<template>
  <div class="container">
    <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">转账记录</h2>
    </div>

    <div class="datefilt">
       <ul>
         <li  @click="showdate" v-text="startDate">2017-10-28</li>
         <li  @click="showdate2" v-text="endDate">2017-10-28</li>
       </ul>
     <div style="display: none">
       <datetime v-model="value" :show.sync="visibility" @on-change="onchange" :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change="onchange2" :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
     </div>
    </div>
    </div>
       <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="recordlist.length>0">
    <div class="paylist" v-show="recordlist.length>0">
      <ul>
        <li v-for="(item,index) in recordlist" :key="index">
          <router-link v-bind="{to:'transferdetail/'+index}">
          <div class="list-item">
              <div class="dates">
              <span class="time">{{item.tranDate |filterDate}}</span>
              <span class="time">{{item.tranDate |filterTime}}</span>
            </div>
            <span class='paytype' ></span>
               <div class="touzhu">
              <span class="var">{{item.tranMoney}}(元)</span>
              <span class="txt">{{item.tranFlagName}}</span>
            </div>

            <span class="state successColor" v-text="item.tranStatus">转账成功</span>
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
import filters from '../../config/filters';
const visibility = false;
const visibility1 = false;
const visibility2 = false;
export default {
  data() {
    return {
      value: '',
      value2: '',
      visibility: visibility,
      visibility2: visibility2,
      recordlist: [],
      startDate:'',
      endDate:'',
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载中...',
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
  let filter = eval('(' + vm.getStroe('transferFilter') + ')');
  if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }
    this.gettransfer();
     this.removeStore('transferFilter');//删除记录
  },
  methods: {
      reocrdout() {
      this.removeStore('transferFilter');//删除记录
      this.$router.go(-1)
    },
    gettransfer() {
      let vm = this;
      let parmars = {
        pageIndex: vm.pageIndex,
        pageSize: vm.pageSize,
        startDate: vm.startDate,
        endDate: vm.endDate,
      }
      vm.loading.show = true;
      this.unitAjax("post", '/api/userCenter/transfer/tranMoneyLog', parmars, res => {
        vm.loading.show = false;
        if (res.result) {
          vm.pageIndex++;
          this.recordlist = res.data.items;
          if (res.data.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        } else {
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.$router.push({ path: '/loginpage' })
          }
        }

      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.gettransfer();
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
      }
      vm.unitAjax('POST', '/api/userCenter/transfer/tranMoneyLog', parmars, function (result) {
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
    showdate() {
      this.visibility = true;
    },
    showdate2() {
      this.visibility2 = true;
    },
    onchange(val) {
       let vm = this;
      let filter = {
        startDate: val,
        endDate: vm.endDate,
      }
      vm.setStore('transferFilter', filter);
      location.reload()
    },
    onchange2(val2) {
      let vm = this;
      let filter = {
        startDate: vm.startDate,
        endDate: val2,
      }
      vm.setStore('transferFilter', filter);
      location.reload()
    }
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
      width: 48%;
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
