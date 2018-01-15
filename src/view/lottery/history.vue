<template>
  <popup  height="7.3rem" style="background: #fff;" v-model="show" @on-hide="hidehistory">
    <div class="cantainer">
      <div class="header">
        <h2 class="header-title">历史记录
          <!--<label > &nbsp;{{params.roomName}}</label>-->
        </h2>
        <div class="header-right"></div>
      </div>

      <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
        <div class="timeline">
          <ul>
            <li class="timeline-item" v-for="item in orderList" @click="orderDetail(item)">
              <div class="line-date"> {{item.createDate| filterDate}} </div>
              <div class="line-time"> {{item.createDate| filterTime}} </div>
              <div class="timeline-item-color timeline-item-head"></div>
              <div class="timeline-item-tail"></div>
              <div class="timeline-item-content">
                 <div class="line-gameNo" :class="[item.canCancel?'centent-cancel':'',item.status==4?'cancelStatus':'']">
                   {{item.gameNo}}
                   <div class="line-right fl"><span class="loss">@{{item.realRate}}</span><span class="pices">￥{{item.betMoney}}</span></div>
                   <div class="line-right">  <span class="loss">{{item.playTypeName}}</span><span class="pices">￥{{item.winMoney |winMoney}}</span></div>
                 </div>
                 <div class="cancelbtn" v-show="item.canCancel" @click="cancelOrder(item)">撤单</div>
                 <div class="cancelbtn" v-show="item.status==4" :class="item.status==4?'cancelOrder':''">已取消</div>
              </div>
            </li>
          </ul>
        </div>
      </loadmore>

      <div class="footer">
        <p class="today">今天</p>
        <p>下注：{{total.totalBetMoney}}</p>
        <p>输赢：<label :class="total.totalWinMoney>0?'win':'lose'">{{total.totalWinMoney}}</label></p>
      </div>

      <!--加载动画-->
      <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
      </div>
      <div class="alert">
        <confirm v-model="showConfirm" @on-confirm="onConfirm">
          <p style="text-align:center;">是否要撤销订单？</p>
        </confirm>
      </div>
    </div>
  </popup>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  export  default {
    props:['params'],
    data(){
      return{
        show: true,
        roomId: '',
        roomName:'',
        loadingText:'加载中...',
        orderList:[],
        pageIndex:1,
        pageSize:10,
        showConfirm:false,
        loading: {
          show: false,
          text: '加载中...'
        },
        showToast:false,//显示提示
        ToastText:'',   //提示内容
        ToastPosition:'middle',//提示位置,
        nowItem :{},
        total:{
          totalBetMoney:'0.00',
          totalWinMoney:'0.00'
        },
      }
    },
    created(){
      let vm = this;
      vm.roomId = vm.params.roomId
      vm.getData();
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
    },
    methods:{
      ...mapMutations([
        'GET_USERINFO'
      ]),
      getData(){
        let vm = this;
          let parmars = {
            roomId: vm.roomId,
            pageIndex:vm.pageIndex,
            pageSize :vm.pageSize
          }
          vm.unitAjax('POST','/api/lottery/orderList',parmars,function (result) {
            if(result.result){
             vm.showCantainer = true;
              let res = result.data.items;
              if(res.length>0){
                vm.total = result.data.items[0];
                vm.pageIndex ++;
                vm.orderList = res;
                if(res.length < vm.pageSize){
                  vm.loadingText = '没有更多了…' ;
                }else {
                  vm.loadingText = '暂无下注记录';
                }
              }else{
                vm.loadingText   = '没有历史记录';
              }
            }else{
              if(result.operateCode==100){ //登录形象过期了，清除token userId ,
                vm.removeValue("token");
                vm.removeValue("userId")
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }
              vm.loadingText='登录后可查询下注历史';
            }
          });
      },
      //上拉刷新
      onRefresh(done){
        let vm =this;
        vm.pageIndex = 1;
        vm.getData();
        done();
      },

      //下拉加载
      onInfinite(done){
        let vm =this;
        let parmars = {
          roomId: vm.roomId,
          pageIndex:vm.pageIndex,
          pageSize :vm.pageSize
        }
        vm.loadingText = '加载中...';
        vm.unitAjax('POST','/api/lottery/orderList',parmars,function (result) {
          if(result.result){
            let res = result.data.items;
            vm.orderList =  vm.orderList.concat(res);
            if(res.length < vm.pageSize){
              vm.loadingText='没有更多了…';
              return
            }else{
              vm.pageIndex ++;
            }
            done();
          }
        });
      },
      hidehistory(){
        let vm = this;
        let parmar ={};
            parmar.hide = false ;

        vm.$emit('hidehistory',parmar);//调用父组件的自定义事件，并传值
      },
      orderDetail(item){
        this.$router.push('/gamedetail/'+item.id);
      },
      onConfirm(){
        let vm = this;
            vm.loading.show = true;
        let item = vm.nowItem;
        if(item.canCancel){
          let parmars = {
            orderId:item.id
          }
          vm.unitAjax('POST','/api/lottery/cancelOrder',parmars,function (result) {
            vm.loading.show = false;
            if(result.result){
              vm.showToast   = true;
              vm.ToastText   = '取消成功';
              item.canCancel = false;
              item.status    = 4;
              //用户金额
              let userInfoData = {
                safeMoney: parseFloat(vm.userInfo.safeMoney) + parseFloat(item.betMoney)
              }
              vm.total.totalBetMoney = parseFloat(vm.total.totalBetMoney) - parseFloat(item.betMoney);//下注金额
              vm.GET_USERINFO(userInfoData) ;
            }else {
              if(result.operateCode==100){ //登录形象过期了，清除token userId ,
                vm.showToast = true;
                vm.ToastText = result.msg;
                vm.removeValue("token");
                vm.removeValue("userId")
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }else {
                vm.showToast = true;
                vm.ToastText = result.msg;
              }
            }
          });
        }
      },
      cancelOrder(item){
        let vm = this;
        vm.nowItem = item;
        vm.showConfirm =true;
        event.stopPropagation();
      }
    },
  }

</script>

<style lang="scss" scoped>
  .cantainer{
    .header{
      position: absolute;
      background-color: #FFF;
      top: 0;
      z-index: 99;
      .header-title {
        height: 1.082rem;
        line-height: 1.082rem;
      label {
        display: block;
        line-height: 0.3rem;
        text-align: left;
        padding-left: 0.33rem;
        font-size: 0.30rem;
        color: #4584F5;
        font-weight: 100;
      }
      }
    }
    .yo-scroll{
      top: 1.1rem;
      bottom: 0.5rem;
    }
    .timeline{
      .timeline-item {
        position: relative;
        height: 1.5rem;
        margin-top: -1px;
        padding: 0.5rem 0 0 0.1rem ;
        border-bottom: 1px solid #efefef;
        .timeline-item-color {
          background-color: #fff;
          border: 1px solid #4584F5;
        }
        .line-date{
          width: 1.5rem;
          text-align:center;
        }
        .line-time{
          width: 1.5rem;
          margin-top: 0.3rem;
          text-align: center;
        }
        .timeline-item-head {
          width: 0.2rem;
          height: 0.2rem;
          left: 1.62rem;
          top: 0.55rem;
          position: absolute;
          content: '';
          z-index: 11;
          border-radius: 100%;
        }
        .timeline-item-tail{
          position: absolute;
          content: '';
          height: 100%;
          width: 0.02rem;
          left: 1.7385rem;
          top: 0.2rem;
          z-index: 10;
          background-color: #4584F5;
        }
        .timeline-item-content{
          position: absolute;
          left: 1.9rem;
          top: 0;
          padding-right: 0.3rem;
          .line-gameNo{
            float: left;
            padding-top: 0.5rem;
          }
          .line-right{
            float: right;
            text-align: right;
            width: 90%;
            .pices{
              margin-left: 0.7rem;
            }
          }
            .fl{
              width: 60%;
              span{
                line-height: 0;
              }
            }
            .line-right{
              span{
                line-height: 0.5rem;
              }
            }
         .cancelbtn{
           position: absolute;
           right: 0.1rem;
           top: 40%;
           height: 0.8rem;
           line-height: 0.8rem;
           text-align: center;
           color: #4584F5;
         }
          .cancelOrder{
            color: red;
          }
        }
        .centent-cancel{
          margin-right: 0.6rem;
        }
        .cancelStatus{
          margin-right: 0.8rem;
        }
     }
    }
  .footer{
    position: absolute;
    bottom: 1rem;
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
    p{
      float: left;
      width: 42%;
      display: block;
      text-align: center;
    }
    .win{
      color: red;
    }
    .lose{
      color: green;
    }
  p:first-child{
    width: 15%;
  }
  }
  }
</style>
