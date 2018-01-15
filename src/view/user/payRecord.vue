<template>
  <div class="container">
     <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">充值记录</h2>
    </div>

    <div class="datefilt">
       <ul>
         <li @click="showS">{{startDate}}</li>
         <li @click="showE">{{endDate}}</li>
         <li @click="showpicker">{{gameTypeName}}</li>
       </ul>
     <div style="display: none">
       <datetime v-model="startDate" title="请选择开始时间" :show.sync="showStartDate" @on-change="getStarDate" :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="endDate"   title="请选择结束时间" :show.sync="showEndDate"  @on-change="getEndDate" :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择"   :data="gameTypeList" :show.sync="showPicker" @on-change='changType'></popup-picker>
     </div>
    </div>
    </div>
    <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="recordlist.length>0">
    <div class="paylist" v-show="recordlist.length>0">
      <ul>
        <li v-for="(item,index) in recordlist" :key="index" >
          <router-link v-bind="{to:'paydetail/'+item.payMoney+'/'+item.payStatus+'/'+item.payFlagName+'/'+item.userName+'/'+item.createDate+'/'+item.orderSn}">
          <div class="list-item">
            <span class="time" v-text="item.createDate"></span>
            <span class='paytype'> <span>{{item.payFlagName}}</span></span>
            <span>{{item.payMoney}}(元)</span>
            <span class="state successColor" v-text="item.payStatus">充值成功</span>
          </div>
          </router-link>
        </li>
      </ul>
    </div>
      </loadmore>
     <div class="nocord" v-show="recordlist.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>

<script>
import cookieRender from '../../config/cookie';
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
      recordlist: [],
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载中...',
      statusobj: {},
      statusid: '',
        startMonthDate:this.getMonthFormatDate(),
         endMonthDate:this.getNowFormatDate(),
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
      let vm = this;
      let  filter = eval('(' + vm.getStroe('payRecordFilter') + ')');
      if(filter){
        vm.startDate = filter.startDate;
        vm.endDate   = filter.endDate;
        vm.statusid  = filter.statusid;
        vm.gameTypeName=filter.gameTypeName
      }else {
        vm.startDate = vm.getNowFormatDate();
        vm.endDate   = vm.getNowFormatDate();
      }
      vm.getpayRecord();
      vm.getpaystatus();
       this.removeStore('payRecordFilter');//删除记录
  },
  methods: {
    reocrdout(){
      this.removeStore('payRecordFilter');//删除记录
      this.$router.go(-1)
    },
    //状态
    getpaystatus() {
      this.unitAjax('post', '/api/userCenter/charge/payStatusList', {}, res => {
        let arr = ['全部']
        if (res.result) {
          for (var key in res.data) {
            arr.push(res.data[key]);
          }
          this.gameTypeList = [arr]
          this.statusobj = res.data
        }
      })
    },
    getpayRecord() {
      let vm = this;
      let token =  vm.getValue("token");
      let userId = vm.getValue("userId");
      vm.loading.show = true;
      if (token && userId) {
        let parmars = {
          pageIndex: vm.pageIndex,
          pageSize: vm.pageSize,
          startDate: vm.startDate,
          endDate: vm.endDate,
          payStatus: vm.statusid,
        }
        vm.unitAjax('POST', '/api/userCenter/charge/chargeLog', parmars, function (result) {
          vm.loading.show = false;
          if (result.result) {
            vm.pageIndex++;
            vm.recordlist = result.data.items;
            if (result.data.items.length < vm.pageSize) {
              vm.loadingText = '没有更多了……';
            }
          } else {
            if (result.operateCode == 100) {
              vm.removeValue("token");
              vm.removeValue("userId");
              vm.goLogin();
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
      vm.getpayRecord();
      done();
    },
    //下拉刷新
    onInfinite(done) {

      let vm = this;
      let parmars = {
        pageIndex: vm.pageIndex,
        pageSize: vm.pageSize,
        startDate: vm.startDate,
        endDate: vm.endDate,
        payStatus: vm.statusid,
      }
      vm.unitAjax('POST', '/api/userCenter/charge/chargeLog', parmars, function (result) {
        if (result.result) {
          let res = result.data.items;
          vm.recordlist = vm.recordlist.concat(res);
          if (res.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
            return false;
          } else {
            vm.pageIndex++;
          }
          done();
        }
      });
    },
    getStarDate(date) {
      let vm = this;
        let filter = {
          startDate : date,
          endDate   :vm.endDate,
          statusid  : vm.statusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('payRecordFilter',filter);
        location.reload()
    },
    getEndDate(date) {
       let vm = this;
        let filter = {
          startDate : vm.startDate,
          endDate   : date,
          statusid  : vm.statusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('payRecordFilter',filter);
        location.reload()
    },
    changType(val) {
      let vm = this;
      vm.gameTypeName = val[0];
      for (var key in vm.statusobj) {
        if (vm.gameTypeName == vm.statusobj[key]) {
          vm.statusid = key;
        }
      }
        if (vm.gameTypeName == '全部') {
          vm.statusid = '';
        }
       let filter = {
          startDate : vm.startDate,
          endDate   : vm.endDate,
          statusid  : vm.statusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('payRecordFilter',filter);
        location.reload()
    },
    showS() {
      this.showStartDate = true;
    },
    showE() {
      this.showEndDate = true;
    },
    showpicker() {
      this.showPicker = true;
    },
  }
}

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
       background-color: #F7F7F7;
    }
  .paylist {
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
      .paytype {
        padding: 0 0.32rem;
        img {
          margin-top: 0.1rem;
          width: 0.6rem;
          height: 0.6rem;
        }
      }
      .state {
        float: right;
      }
    }
  }
  ul li:last-child {
    margin-bottom: 0.2rem;
  }
  //无数据图片
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
