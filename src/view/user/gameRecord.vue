<template>
  <div class="container">
    <div class="top">
      <div class="header">
        <div class="header-left returnBtn" @click="$router.go(-1)"></div>
        <h2 class="header-title">游戏记录</h2>
      </div>

      <div class="datefilt">
        <ul>
          <li @click="showS">{{startDate}}</li>
          <li @click="showE">{{endDate}}</li>
          <li @click="showpicker">{{gameTypeName}}</li>
        </ul>
        <div style="display: none">
          <datetime v-model="startDate" title="请选择开始时间" :show.sync="showStartDate" @on-change="getStarDate" :start-date="startMonthDate" :end-date="endDate"></datetime>
          <datetime v-model="endDate"   title="请选择结束时间" :show.sync="showEndDate"   @on-change="getEndDate"  :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
          <popup-picker title="请选择"   :data="gameTypeList" :show.sync="showPicker"    @on-change='changType'></popup-picker>
        </div>
      </div>
    </div>
    <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="gameList.length>0">
      <div class="gamelist" >
        <ul>
          <swipeout class="vux-1px-tb">
            <swipeout-item transition-mode="follow" v-for="(item,index) in gameList" :key="index" >
              <div slot="right-menu"  v-show="item.orderCode==1">
                <swipeout-button type="warn" @click.native="onButtonClick(item)">撤单</swipeout-button>
              </div>
              <li slot="content">
                <!--<router-link v-bind="{to:'gamedetail/'+item.orderId}">-->
                  <div class="list-item"  @click="toGameDetail(item.orderId)">
                    <div class="item-l">
                      <p>{{item.gameName}}&nbsp;<span class="jine">({{item.gameNo}}期)</span>&nbsp;&nbsp;{{item.playType}}</p>
                      <p>投注金额：<label class="jine">{{item.betMoney}}</label>元  <label class="win">中奖金额：<span :class="item.prizeMoney>0?'prizeMoney':''">{{item.prizeMoney}}</span>元</label></p>
                    </div>
                    <p class="state" :class="item.orderCode==1 || item.orderCode==4?'feateColor':item.orderCode==2?'reviewColor':'successColor'">{{item.orderState}}</p>
                  </div>
                <!--</router-link>-->
              </li>
            </swipeout-item>
          </swipeout>
        </ul>
      </div>
    </loadmore>
    <div class="nocord" v-show="gameList.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
    </div>
    <div class="alert">
      <confirm v-model="showConfirm" @on-confirm="onConfirm">
        <p style="text-align:center;">是否要撤销订单？</p>
      </confirm>
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
  export default {
    data() {
      return {
        startDate: "",
        endDate: '',
        gameTypeName: "全部",
        showStartDate: false,
        showEndDate: false,
        showPicker: false,
        gameTypeList: [],
        typeList: {},
        gameType: '',
        gameList: [],
        pageIndex: 1,
        pageSize: 10,
        loadingText: '加载中...',
        showConfirm:false,
        nowItem:{},
        loading: {
          show: false,
          text: '加载中...'
        },
        showToast:false,//显示提示
        ToastText:'',   //提示内容
        ToastPosition: 'middle',//提示位置,
        startMonthDate:this.getMonthFormatDate(),
        endMonthDate:this.getNowFormatDate()
      };
    },
    created() {
      let vm = this;
      let filter = eval('(' + vm.getStroe('gameFilter') + ')');
      if(filter){
        vm.startDate = filter.startDate;
        vm.endDate   = filter.endDate;
        vm.gameType  = filter.gameType;
        vm.gameTypeName = filter.gameTypeName;

      }else {
        vm.startDate = vm.getNowFormatDate();
        vm.endDate   = vm.getNowFormatDate();
      }
      vm.removeStore('gameFilter'); //删除记录
      vm.getgame();
      vm.getgameType();
      vm.stopBodyScroll(false);

    },
    methods: {
      getgame() {
        let vm = this;
        let token = vm.getValue("token");
        let userId = vm.getValue("userId");
        vm.loadingText = '加载中...';
        vm.loading.show = true;
        vm.gameList = [];
        if (token && userId) {
          let parmars = {
              pageIndex: vm.pageIndex,
              pageSize : vm.pageSize,
              startDate: vm.startDate,
              endDate  : vm.endDate,
              gameType : vm.gameType,
          }
          vm.unitAjax('POST', '/api/userCenter/game/gameOrderList', parmars, function (result) {
            if (result.result) {
              vm.loading.show = false;
              let res = result.data.items;
                  vm.pageIndex ++;
                  vm.gameList = res;

              if(res.length < vm.pageSize) {
                vm.loadingText = '没有更多了……';
              }
            }else{
              vm.loading.show = false;
              vm.showToast = true;
              vm.ToastText = result.msg ;
              if(result.operateCode == 100){
                vm.removeValue("token");
                vm.removeValue("userId");
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }
            }
          });
        } else {
          vm.goLogin();
        }
      },
      //获取彩种列表
      getgameType() {
        let vm = this;
        let token = vm.getValue("token");
        let userId = vm.getValue("userId");
        if (token && userId) {
          vm.unitAjax('POST', '/api/userCenter/game/gameTypeList', {}, function (result) {
            let res = ['全部']
            if (result.result) {
              vm.typeList = result.data;
              for (var key in result.data) {
                res.push(result.data[key].name);
              }
              vm.gameTypeList.push(res)
            } else {
              vm.showToast = true;
              vm.ToastText = result.msg ;
              if (result.operateCode == 100) {
                vm.removeValue("token");
                vm.removeValue("userId");
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }
            }
          });
        } else {
          vm.goLogin();
        }
      },
      //上拉刷新
      onRefresh(done) {
        let vm = this;
        vm.pageIndex = 1;
        vm.getgame();
        done();
      },
      //下拉刷新
      onInfinite(done) {
        let vm = this;
        let parmars = {
          pageIndex: vm.pageIndex,
          pageSize : vm.pageSize,
          startDate: vm.startDate,
          endDate:   vm.endDate,
          gameType:  vm.gameType,
        }
        vm.unitAjax('POST', '/api/userCenter/game/gameOrderList', parmars, function (result) {
          if (result.result) {
            let res = result.data.items;
            vm.gameList = vm.gameList.concat(res);
            if(res.length < vm.pageSize){
              vm.loadingText = '没有更多了……';
              return false;
            } else {
              vm.pageIndex++;
            }
            done();
          }else {
            vm.showToast = true;
            vm.ToastText = result.msg ;
            if (result.operateCode == 100) {
              vm.removeValue("token");
              vm.removeValue("userId");
              setTimeout(function () {
                vm.goLogin();
              },1000);
            }
          }
        });
      },
      //选择开始时间
      getStarDate(date) {
        let vm = this;
        let filter = {
          startDate : date,
          endDate   :vm.endDate,
          gameType  : vm.gameType,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('gameFilter',filter);
        location.reload();
      },
      //选择结束时间
      getEndDate(date) {
        let vm = this;
        let filter = {
          startDate : vm.startDate,
          endDate   : date,
          gameType  : vm.gameType,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('gameFilter',filter);
        location.reload()
      },
      //显示开始时间
      showS() {
        this.showStartDate = true;
      },
      //显示结束时间
      showE() {
        this.showEndDate = true;
      },
      showpicker() {
        this.showPicker = true;
      },
      //选择彩票类型
      changType(val) {
        let vm = this;
        vm.gameTypeName = val[0];
        for (var key in vm.typeList) {
          if (vm.typeList[key].name == vm.gameTypeName) {
            vm.gameType = vm.typeList[key].id;
          }
        }
        if (vm.gameTypeName == '全部') {
          vm.gameType = '';
        }
        let filter = {
          startDate : vm.startDate,
          endDate   : vm.endDate,
          gameType  : vm.gameType,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('gameFilter',filter);
        location.reload()
      },
      //跳转彩票详情
      toGameDetail(id){
        let vm =this;
        let filter = {
          startDate : vm.startDate,
          endDate   : vm.endDate,
          gameType  : vm.gameType,
          gameTypeName: vm.gameTypeName,
          top      : this.$el.querySelector('.inner').clientHeight
        }
        vm.setStore('gameFilter',filter);
        vm.$router.push('/gamedetail/'+id)

      },
      //撤销订单
      onButtonClick(item){
        let vm = this;
        vm.nowItem = item;
        vm.showConfirm =true;
        event.stopPropagation();
      },
      //确认撤销订单
      onConfirm(){
        let vm = this;
        vm.loading.show = true;
        let item = vm.nowItem;
        let parmars = {
          orderId:item.orderId
        }
        vm.unitAjax('POST','/api/lottery/cancelOrder',parmars,function (result) {
          vm.loading.show = false;
          if(result.result){
            vm.showToast = true;
            vm.ToastText = '取消成功';
            item.orderCode   = 4;
            item.orderState  = '已取消';
          }else {
            if(result.operateCode==100){ //登录形象过期了，清除token userId ,
              vm.showToast = true;
              vm.ToastText = result.msg;
              vm.removeValue("token");
              vm.removeValue("userId");
              setInterval(function () {
                vm.goLogin();
              },1000);
            }else {
              vm.showToast = true;
              vm.ToastText = result.msg;
            }
          }
        })
      },
    }
  };
</script>
<style lang="scss" scoped>
  .container {
    height: -webkit-fill-available;
  .top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
  }
  .datefilt {
    height: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
  ul li {
    width: 33%;
    float: left;
    height: 0.6rem;
    text-align: center;
    line-height: 0.6rem;
    margin: 0.2rem 0;
    border-right: 0.02rem solid #e5e5e5;
    font-size: 0.24rem;
  }
  li:last-child {
    border-right: none;
  }
  }
  .yo-scroll{
    top: 2.1rem;
  }
  .gamelist {
    background-color: #f7f7f7;
    font-size: 0.26rem;
  ul li {
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0.27rem 0.33rem;
    margin-top: 0.2rem;
    background-color: #fff;
  .time {
    font-size: 0.24rem;
  }
  .withdrawtype {
    padding: 0 0.32rem;
  img {
    margin-top: 0.1rem;
    width: 0.6rem;
    height: 0.6rem;
  }
  }
  .state {
    float: right;
    width: 13%;
    line-height: 0.3rem;
    height: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item-l {
    width: 85%;
    float: left;
  p {
    line-height: 0.45rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .win {
    margin-left: 0.3rem;
    .prizeMoney{
      color: red;
    }
  }
  .jine {
    color: #4584f5;
  }
  }
  }
  ul li:last-child {
    margin-bottom: 0.2rem;
  }
  }
  /*//无数据图片*/
  .nocord {
    margin-top: 3.5rem;
    text-align: center;
    img {
      width: 50%;
    }
  .record {
    margin-top: 0.3rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }
  }
  }
</style>
