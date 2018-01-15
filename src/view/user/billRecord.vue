<template>
  <div class="container">
    <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">账变记录</h2>
    </div>
    <div class="datefilt">
       <ul>
         <li @click="showS">{{startDate}}</li>
         <li @click="showE">{{endDate}}</li>
         <li @click="showpicker">{{changeTypeName}}</li>
       </ul>
     <div style="display: none">
       <datetime v-model="startDate" title="请选择开始时间" :show.sync="showStartDate" @on-change="getStarDate" :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="endDate"   title="请选择结束时间" :show.sync="showEndDate"  @on-change="getEndDate" :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择"   :data="changeTypeList" :show.sync="showPicker" @on-change='changType'></popup-picker>
     </div>
    </div>
    </div>
      <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="changeList.length>0">
    <div class="paylist" v-show="changeList.length>0">
      <ul>
        <li @click="$router.push('billdetail/'+item.createDate+'/'+item.changeType+'/'+item.beforeMoney+'/'+item.afterMoney+'/'+item.remark+'/'+item.changeMoney)" v-for="(item,index) in changeList" :key="index">
          <div class="list-item">
            <div class="dates">
              <span class="time">{{item.createDate |filterDate}}</span>
              <span class="time">{{item.createDate |filterTime}}</span>
            </div>
            <span class='paytype'>
               </span>
            <div class="touzhu">
              <span class="var">{{item.changeMoney}}</span>
              <span class="txt">{{item.remark}}</span>
            </div>
            <span class="state" :class="item.changeType=='用户撤单'?'feateColor':item.changeType=='消费投注'?'reviewColor':'successColor'">{{item.changeType}}</span>
          </div>
        </li>
      </ul>
    </div>
     </loadmore>
     <div class="nocord" v-show="changeList.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      startDate: "",
      endDate: '',
      changeTypeName: "全部",
      showStartDate: false,
      showEndDate: false,
      showPicker: false,
      changeTypeList: [],
      typeList: {},
      changeType: '',
      changeList: [],
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载中...',
      startMonthDate:this.getMonthFormatDate(),
      endMonthDate:this.getNowFormatDate(),
      loading: {
        show: false,
        text: '加载中...'
      },
    };
  },
  created() {
    let vm = this;
    let filter = eval('(' + vm.getStroe('billRecordFilter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
      vm.changeType = filter.changeType;
      vm.changeTypeName= filter.changeTypeName;
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }

    vm.getbill();
    vm.getchangeType();
      this.removeStore('billRecordFilter');//删除记录
  },
  methods: {
    reocrdout() {
      this.removeStore('billRecordFilter');//删除记录
      this.$router.go(-1)
    },
    getbill() {
      let vm = this;
      let token = vm.getValue("token");
      let userId = vm.getValue("userId");
      if (token && userId) {
        let parmars = {
          pageIndex: vm.pageIndex,
          pageSize: vm.pageSize,
          startDate: vm.startDate,
          endDate: vm.endDate,
          changeType: vm.changeType,
        }
        vm.loading.show = true;
        vm.unitAjax('POST', '/api/userCenter/charge/moneyChangeLog', parmars, function (result) {
          vm.loading.show = false;
          if (result.result) {
            vm.pageIndex++;
            vm.changeList = result.data.items;
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
      vm.getbill();
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
        changeType: vm.changeType,
      }
      vm.unitAjax('POST', '/api/userCenter/charge/moneyChangeLog', parmars, function (result) {
        if (result.result) {
          let res = result.data.items;
          vm.changeList = vm.changeList.concat(res);
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
    //获取彩种列表
    getchangeType() {
      let vm = this;
      let token = vm.getValue("token");
      let userId = vm.getValue("userId");
      if (token && userId) {
        vm.unitAjax('POST', '/api/userCenter/charge/moneyChangeType', {}, function (result) {
          let res = ['全部']
          if (result.result) {
            vm.typeList = result.data;
            for (var key in result.data) {
              res.push(result.data[key].name);
            }
            vm.changeTypeList.push(res)
          } else {
            if (result.operateCode == 100) {
              vm.removeValue("token");
              vm.removeValue("userId");
              vm.$router.push({ path: '/user' });
            }
          }
        });
      } else {
        vm.$router.push({ path: '/user' })
      }
    },
    getStarDate(date) {
      let vm = this;
      let filter = {
        startDate: date,
        endDate: vm.endDate,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('billRecordFilter', filter);
      location.reload()
    },
    getEndDate(date) {
      let vm = this;
      let filter = {
        startDate: vm.startDate,
        endDate: date,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('billRecordFilter', filter);
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
    changType(val) {
      let vm = this;
      vm.changeTypeName = val[0];
      if (vm.changeTypeName == '全部') {
        vm.changeType = '';
      }
      for (var key in vm.typeList) {
        if (vm.typeList[key].name == vm.changeTypeName) {
          vm.changeType = vm.typeList[key].id;
        }
      }
      let filter = {
        startDate: vm.startDate,
        endDate: vm.endDate,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('billRecordFilter', filter);
      location.reload()
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
  .yo-scroll {
    top: 2.1rem;
    background-color: #f7f7f7;
  }
  .paylist {
    font-size: 0.26rem;
    ul li {
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0.27rem 0.33rem;
      margin-top: 0.2rem;
      background-color: #fff;
      .dates {
        width: 1.5rem;
        float: left;
        .time {
          font-size: 0.24rem;
          display: block;
          line-height: 0.4rem;
        }
      }
      .paytype {
        padding: 0 0.32rem;
        float: left;
        margin-top: 0.1rem;
        width: 0.3rem;
        height: 0.3rem;
      }
      .touzhu {
        float: left;
        width: 42%;
        .txt {
          font-size: 0.2rem;
        }
        span {
          display: block;
          line-height: 0.4rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
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
    text-align: center;
    margin-top: 3.5rem;
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
