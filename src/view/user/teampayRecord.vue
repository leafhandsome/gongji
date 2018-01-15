<template>
  <div class="container">
     <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">团队充提记录</h2>
    </div>
    <div class="search">
      <search
        placeholder="请输入账户、昵称搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        :autoFixed="false"
         v-model="userName"
        ref="search" @on-change='changeSearch'></search>
    </div>

    <div class="datefilt border-b1">
       <ul>
         <li @click="showdate"   v-text="startDate"></li>
         <li @click="showdate2"  v-text="endDate"></li>
         <li @click="showpicker" v-text="changeTypeName"></li>
       </ul>
     <div style="display: none">
        <datetime v-model="value" :show.sync="visibility" @on-change='getStarDate' :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change='getEndDate' :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择":data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>
 </div>
    <div class="paylist" v-show="teampaylist.length>0">
      <ul>
        <li>
          <div class="list-item list-frist">
            <div class="item-tit">团队总计</div>
            <dl>
              <dd>充值：{{teamsum.payMoney}}</dd>
              <dd>提现：{{teamsum.cashMoney}}</dd>
            </dl>
          </div>
        </li>
           <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="teampaylist.length>0">
        <li v-for="(item,index) in teampaylist" :key="index"
         @click="gotodetail(item)">
          <div class="list-item">
             <div class="dates">
              <span class="time">{{item.createDate |filterDate}}</span>
              <span class="time">{{item.createDate |filterTime}}</span>
            </div>
            <span class='paytype' > <img v-bind="{src:item.icon}"></span>
               <div class="touzhu">
              <span class="var">{{item.showName}} </span>
              <span class="txt" >{{item.money}}</span>
            </div>
            <div class="touzhu order">
            <span>订单号：{{item.orderSn}}</span>
            <span class="state successColor" v-text="item.status"></span>
            </div>
          </div>
        </li>
          </loadmore>
      </ul>
    </div>
    <div class="nocord" v-show="teampaylist.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
      </div>
      <div class="toast">
         <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>


<script>
import { imgBaseUrl } from '../../config/env';
const visibility = false;
const visibility1 = false;
const visibility2 = false;
export default {
  data() {
    return {
      value: '',
      value2: '',
      value1: ['全部'],
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      list: [['全部', '充值', '提现']],
      teampaylist: [],
      imgBaseUrl: imgBaseUrl,
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载更多',
      userName: '',
      startDate: '',
      endDate: '',
      changeTypeName: '全部',
      teamlist: [],
      changeTypeList: [],
      payCashType: '',
      teamsum: {},
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      startMonthDate: this.getMonthFormatDate(),
      endMonthDate: this.getNowFormatDate(),
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
    let vm = this;
    let filter = eval('(' + vm.getStroe('teampayFilter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
      vm.payCashType = filter.payCashType;
      vm.changeTypeName = filter.changeTypeName
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }
    this.getteampay();
    this.removeStore('teampayFilter');//删除记录
  },
  methods: {

    gotodetail(data) {

      let filter = {};
      let vm = this;
      filter = {
        startDate: this.startDate,
        endDate: this.endDate,
        payCashType: vm.payCashType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teampayFilter', filter);
      vm.$router.push('teampaydetail/' + data.createDate + '/' + data.userName + '/' + data.money + '/' + data.orderSn + '/' + data.payCashType + '/' + data.status + '/' + data.showName);
    },
    reocrdout() {
      this.removeStore('teampayFilter');//删除记录
      this.$router.go(-1)
    },
    changeSearch() {
      this.pageIndex = 1;
      this.getteampay()
    },
    showdate() {
      this.visibility = true;
    },
    showdate2() {
      this.visibility2 = true;
    },
    showpicker() {
      this.visibility1 = true;
    },
    getStarDate(vul) {
      let vm = this;
      let filter = {
        startDate: vul,
        endDate: vm.endDate,
        payCashType: vm.payCashType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teampayFilter', filter);
      location.reload()
    },
    getEndDate(vul) {
      let vm = this;
      let filter = {
        startDate: vm.startDate,
        endDate: vul,
        payCashType: vm.payCashType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teampayFilter', filter);
      location.reload()
    },
    onchange1(vul) {
      let vm = this;
      let filter = {};
      let type = 0
      vm.changeTypeName = vul[0];
      if (vm.changeTypeName == '充值') {
        type = 1;
      } else if (vm.changeTypeName == '提现') {
        type = 2;
      } else {
        type = 0;
      }
      filter = {
        startDate: vm.startDate,
        endDate: vm.endDate,
        payCashType: type,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teampayFilter', filter);
      location.reload()
    },
    getteampay() {
      let vm = this;
      let obj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        payCashType: this.payCashType,//充值类型
        userName: this.userName//搜索名
      }
      vm.loading.show = true;
      this.unitAjax('post', '/api/agent/teamPayCash/list', obj, res => {
        vm.loading.show = false;
        if (res.result) {
          vm.pageIndex++;
          this.teampaylist = res.data.pageInfo.items;
          this.teamsum = res.data.sum;
          if (res.data.pageInfo.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }
      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getteampay();
      done();
    },
    //下拉刷新
    onInfinite(done) {

      let vm = this;
      let parmars = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        payCashType: this.payCashType,//充值类型
        userName: this.userName//搜索名
      }
      vm.unitAjax('POST', '/api/agent/teamPayCash/list', parmars, function (result) {
        if (result.result) {
          let res = result.data.pageInfo.items;
            vm.teampaylist = vm.teampaylist.concat(res);
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
    top: 4.8rem;
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
        img {
          margin-top: 0.1rem;
          width: 0.6rem;
          height: 0.6rem;
        }
      }
      .touzhu {
        float: left;
        width: 22%;
        text-align: center;
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
      .order {
        width: 35%;
        span {
          margin: 0 auto;
        }
      }
      .state {
        float: right;
      }
      .list-item {
        padding-top: 0.1rem;
        dl dd {
          width: 50%;
          float: left;
          height: 0.6rem;
        }
      }
      .list-frist {
        font-weight: 700;
      }
      .list-item .item-tit {
        height: 0.6rem;
        line-height: 0.6rem;
      }
    }
    ul li:first-child {
      margin-top: 3.3rem;
      padding: 0 0.33rem;
      height: 1.5rem;
    }
    ul li:last-child {
      margin-bottom: 0.2rem;
    }
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
