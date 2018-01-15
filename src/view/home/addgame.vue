<template>
  <popup v-model="showPopup" position="right" width="100%" style="background: #fff;">
    <div class="container">
      <div class="header">
        <div class="header-left returnBtn" @click="$router.go(-1)"></div>
        <h2 class=" header-title">添加游戏</h2>
        <div class="header-right" @click="confirm">确定 ({{total}})</div>
      </div>
      <div class="content">
        <div class="gamecontent" v-for="(items,index) in resultData.showTypeList" :key="index">
          <div class="top-title" >
            <img v-bind:src="items |isSel" @click='allselect(items)'>
            <img :src=items.imgUrl>
            <span class="mygame">{{items.name}}</span>
            <span class="addplay" @click='showShrink(items)'>已选 （{{items.selectedCount}}） <img v-bind:src="items.showTypeList |showAndShrink"></span>
          </div>
          <div class="gameList"  v-if="items.showTypeList">
            <ul>
              <li class="gameItem " @click=select(item,items) :class="item.selected?'selItem':''" v-for="(item,index) in items.gameRoomList" :key="index">
                <img  :src=item.imgUrl class="imgitem" >
                <img  src="../../assets/images/img-sel.png"  class="selimg">
                <span class="item-title">{{item.gameRoomName}}</span>
                <span class="item-msg">{{item.msg}}</span>
              </li>
            </ul>
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
  </popup>
</template>
<script>
  export default {
    data(){
      return {
        total : 0,
        arr:[],
        showPopup:true,
        loading: {
          show: true,
          text: '加载中...'
        },
        showToast:false,//显示提示
        ToastText:'',//提示内容
        ToastPosition: 'bottom',//提示位置
        resultData:{}
      }
    },

    created(){
      let vm = this;
      vm.getgamelist();
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
      //单选
      select(data,items){
        let vm = this;
        //游戏id
        let index = data.gameRoomId;
        //判断是否已经选择
        if(vm.contains(vm.arr,index)){
          //移除游戏
          vm.removeByValue(vm.arr,index);
          //该组数减去一条
          items.selectedCount--;
          //总数减去一条
          vm.total -- ;
          //设置未选择状态
          data.selected = false;
        }else{
          //添加游戏
          vm.arr.push(index);
          //该组加上一条
          items.selectedCount ++ ;
          //总数加上一条
          vm.total ++ ;
          //设置选中状态
          data.selected = true;
        }
      },

      //全选
      allselect(data){
        let vm = this;
        let len = data.gameRoomList.length;
        let count =0;
        //默认选择等于游戏列表个数
        if(data.selectedCount == len){
          for(var i = 0;i<len; i++) {
              //移除该组数据
            if(vm.contains(vm.arr,data.gameRoomList[i].gameRoomId)){
              vm.removeByValue(vm.arr,data.gameRoomList[i].gameRoomId);
              //设置未选择属性
              data.gameRoomList[i].selected = false;
            }
          }
           //设置选择个数为0
          data.selectedCount = 0 ;
           //选择总数减去改组个数
          vm.total = vm.total - len ;
        }else{
           //全选该组的个数
          data.selectedCount = len;

          for(var i=0;i<len; i++) {
            //设置该组数据选中
            if(data.gameRoomList[i].selected){
              count ++;
            }
            if(!vm.contains(vm.arr,data.gameRoomList[i].gameRoomId)){
              //添加该组数据id
              vm.arr.push(data.gameRoomList[i].gameRoomId);
              data.gameRoomList[i].selected = true;
            }
          }
          //选择总数加上该组个数
          vm.total = vm.total + len - count;
        }
        event.stopPropagation();
      },

      //获取数据
      getgamelist(){
        let vm =this;

        vm.unitAjax('POST','/api/home/selectGame',{},function (result) {
          if(result.result){
            let res = result.data.showTypeList;
            //遍历两层数组
            for(var i = 0;i<res.length;i++){
              for(var j = 0; j<res[i].gameRoomList.length;j++){
                 if(res[i].gameRoomList[j].selected){
                   //默认选择添加到数组中
                    vm.arr.push(res[i].gameRoomList[j].gameRoomId)
                 }
              }
              //添加展开属性
              res[i].showTypeList = true;
              //统计默认选择总数
              vm.total += parseInt(res[i].selectedCount)
            }
            //绑定数据
            vm.resultData = result.data;
          }else {
            vm.showToast = true;
            vm.ToastText = result.msg ;
            if(result.operateCode==100){ //登录形象过期了，清除token userId ,
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

      //选择游戏确定
      confirm(){
        let vm =this;
        //选中的游戏id
        let gameRoomIds = vm.arr;
        //选中一项方可提交
        console.log(gameRoomIds)
        if(gameRoomIds.length > 0){
          //显示加载动画
          vm.loading.show = true;
          vm.loading.text = "正在提交...";
          vm.unitAjax('POST','/api/home/saveSelectGame',{"gameRoomIds":gameRoomIds},function (result) {
            //关闭加载动画
            vm.loading.show = false;
            if(result.result){
              //跳转页面
              vm.$router.push({path: 'index'});
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
    overflow: hidden;
    padding : 0 0.3rem;
    border-bottom: 1px solid #e5e5e5;
  .top-title{
    height: 0.9rem;
    font-weight: 800;
    line-height:0.9rem;
    img{
      float: left;
      width: 0.40rem;
      height: 0.40rem;
      margin-right: 0.2rem;
      padding-top: 0.30rem;
      display: block;
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
    padding-top: 0.54rem;
    .gameItem{
      float: left;
      width: 24%;
      padding-bottom: 0.54rem;
      margin-left: 0.05rem;
      text-align: center;
      .imgitem{
        width: 1.42rem;
        height: 1.42rem;
      }
      span{
        display: block;
        line-height: 0.35rem;
        margin-left: 0.1rem;
        white-space: nowrap
      }
    .item-title{
      font-size: 0.26rem;
      margin-top: 0.2rem;
      text-align: center;
    }
    .item-msg{
      font-size: 0.2rem;
      color: #9EA1B2;
      text-align: left;
    }
  }
  }
    .selItem{
      position:relative;
      .selimg{
        position: absolute;
        top: 0.02rem;
        left: 0.18rem;
        width: 0.7rem;
        height: 0.7rem;
        display: block;
      }
    }
  }
</style>
