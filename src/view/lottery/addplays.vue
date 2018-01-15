<template>
    <div class="container">
      <div class="header">
        <div class="header-left returnBtn" @click="$router.go(-1)"></div>
        <h2 class=" header-title">添加玩法</h2>
        <div class="header-right" @click="confirm">确定 ({{total}})</div>
      </div>
      <div class="content">
        <div class="content">
          <div class="gamecontent" v-for="(items,index) in resultData.showUserGamePlayList" :key="index">
            <div class="top-title">
              <img v-bind:src="items |isSelPlays" @click='allselect(items)'>
              <span class="mygame">{{items.name}}</span>
              <span class="addplay" @click='showShrink(items)'>已选 （{{items.selectCount}}） <img v-bind:src="items.showTypeList |showAndShrink"></span>
            </div>
            <div class="gameList"  v-if="items.showTypeList">
              <ul>
                <li class="gameItem " @click=select(item,items) :class="item.selected?'selItem':''" v-for="(item,index) in items.playList" :key="index">
                  <img  :src=item.imgUrl class="imgitem" >
                  <img  src="../../assets/images/img-sel.png"  class="selimg">
                  <span class="item-title">{{item.playName}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
      </div>
    </div>
</template>

<script>

  export  default {
    data(){
      return {
        total : 0,
        arr:[],
        loading: {
          show: true,
          text: '加载中...'
        },
        showToast:false,//显示提示
        ToastText:'',//提示内容
        ToastPosition: 'bottom',//提示位置
        resultData:{},
        roomId:'',
        roomName:''
      }
    },
    created(){
      let vm = this;
      vm.roomId   = vm.$route.params.roomId;
      vm.roomName = vm.$route.params.roomName;
      vm.getUserPlayslist();
      vm.stopBodyScroll(false);
    },
    methods:{
      showShrink(data){
        let vm = this;
        let flag = data.showTypeList ;
        if(data.showTypeList){
          data.showTypeList  = false
        }else {
          data.showTypeList  = true
        }
      },
      //获取数据
      getUserPlayslist(){
        let vm =this;
        vm.unitAjax('POST','/api/gameCenter/getUserFavGamePlay',{'roomId':vm.roomId},function (result) {
          if(result.result){
            let res = result.data.showUserGamePlayList;
            //遍历两层数组
            for(var i = 0;i<res.length;i++){
              for(var j = 0; j<res[i].playList.length;j++){
                if(res[i].playList[j].selected){
                  //默认选择添加到数组中
                  vm.arr.push(res[i].playList[j].playType)
                }
              }
              //添加展开属性
              res[i].showTypeList = true;
              //统计默认选择总数
              vm.total += parseInt(res[i].selectCount)
            }
            //绑定数据
            vm.resultData = result.data;
          }else {
            vm.showToast = true;
            vm.ToastText = result.msg ;
            if(result.operateCode==100){ //登录过期了，清除token userId ,
              vm.removeValue("token");
              vm.removeValue("userId");
              setTimeout(function () {
                vm.goLogin();
              },1000);
            }
          }
          //关闭加载
          vm.loading.show = false;
        });
      },
      //单选
      select(data,items){
        let vm = this;
        //玩法id
        let index = data.playType;
        //判断是否已经选择
        if(vm.contains(vm.arr,index)){
          //移除游戏
          let res = vm.removeByValue(vm.arr,index);
          vm.arr  = res ;
          //该组数减去一条
          items.selectCount--;
          //总数减去一条
          vm.total -- ;
          //设置未选择状态
          data.selected = false;
        }else{
          //添加游戏
          vm.arr.push(index);
          //该组加上一条
          items.selectCount++;
          //总数加上一条
          vm.total ++ ;
          //设置选中状态
          data.selected = true;
        }
      },

      //全选
      allselect(data){
        let vm = this;
        let len = data.playList.length;
        let count =0;
        //默认选择等于游戏列表个数
        if(data.selectCount == len){
          for(var i=0;i<len; i++) {
           if(vm.contains(vm.arr,data.playList[i].playType)){
             //移除该组数据
             vm.removeByValue(vm.arr,data.playList[i].playType);
             //设置未选择属性
             data.playList[i].selected = false;
           }
          }
          //设置选择个数为0
          data.selectCount = 0 ;
          //选择总数减去改组个数
          vm.total = vm.total - len ;
        }else{
          //全选该组的个数
          data.selectCount = len;

          for(var i=0;i<len; i++) {
            //设置该组数据选中
            if(data.playList[i].selected){
              count ++;
            }
            if(!vm.contains(vm.arr,data.playList[i].playType)){
              //添加该组数据id
              vm.arr.push(data.playList[i].playType);
              data.playList[i].selected = true;
            }
          }
          //选择总数加上该组个数
          vm.total = vm.total + len - count;
        }
        event.stopPropagation();
      },
      //选择游戏确定
      confirm(){
        let vm =this;
        //选中的游戏id
        let playsType =  vm.arr;
        //选中一项方可提交
        if(playsType.length > 0){
          //显示加载动画
          vm.loading.show = true;
          vm.loading.text = "正在提交...";
          vm.unitAjax('POST','/api/gameCenter/addGamePlayByUserId',{"gamePlays":playsType,"roomId":vm.roomId},function (result) {
            //关闭加载动画
            vm.loading.show = false;
            vm.ToastText = '添加完成';
            if(result.result){
              //跳转页面
              vm.$router.push('/betting/'+vm.roomId +"/"+vm.roomName);
            }else {
              //显示错误提示
              vm.showToast = true;
              //错误内容
              vm.ToastText = result.msg ;
              if(result.operateCode==100){ //登录形象过期了，清除token userId ,
                vm.removeValue("token");
                vm.removeValue("userId");
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }
            }
          })
        }else{
          vm.loading.show = false;
          vm.showToast = true;
          vm.ToastText = '至少选择一项';
        }
      }
    }
  }
</script>

<style lang="scss"  scoped>
  .container{
    overflow: auto;
    background-color: #FFFFFF;
  }
  .selimg{
    display: none;
  }
  /*header*/
  .header{
    .header-right{
      top:0;
     line-height: 1.082rem;
    }
  }
  /*内容列表*/
  .gamecontent{
    border-bottom: 1px solid #e5e5e5;
    overflow: auto;
    padding : 0 0.3rem;
  .top-title{
    height: 0.9rem;
    position: relative;
    font-weight: 800;
    line-height:0.9rem;
    img{
      width: 0.40rem;
      height: 0.40rem;
      float: left;
      display: block;
      margin-right: 0.2rem;
      padding-top: 0.2rem;
    }
  .mygame{
    font-size: 0.28rem;
    color: #000;
  }
  .addplay{
    position: sticky;
    float: right;
    color: #9EA1B2;
    font-size: 0.26rem;
    img{
      float: right;
      width: 0.16rem;
      height: 0.16rem;
      margin-right: 0rem;
      margin-left: 0.16rem;
      padding-top: 0.35rem;
    }
  }
  }
  .gameList{
    padding: 0.54rem 0;
    overflow: auto;
    .gameItem{
      float: left;
      width: 22.8%;
      height: 1.13rem;
      border: 1px solid #349AFB;
      background: #F9FCFF;
      margin:0.05rem;
      border-radius:5px;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        display: block;
        text-align: center;
      }
  }
  }
  .selItem{
    position:relative;
    .selimg{
      position: absolute;
      top: -0.01rem;
      left: 0;
      width: 0.5rem;
      height: 0.5rem;
      display: block;
    }
  }
  }
</style>
