<template>
  <div class="container">
    <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="lotteryout"></div>

      <h2 class="header-title">彩票报表</h2>
    </div>

    <div class="datefilt border-b1">
       <ul>
         <li @click="showdate" v-text="startDate">选择日期</li>
         <li @click="showdate2" v-text="endDate">选择日期</li>
       </ul>
     <div style="display: none">
       <datetime v-model="value1" :show.sync="visibility"  @on-change='onchange' :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2"  @on-change='onchange2' :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       </div>
    </div>
 </div>
    <div class="lotterylist" v-show="lotterlist.length>0">
      <ul>
        <li>
          <div class="list-item list-w" >
              <p class="tit-time">总计</p>
              <p><span class="lotter-money"> 消费：{{(lotterall.sumBetMoney-0).toFixed(3)}}</span> <label class="">盈利：{{(lotterall.sumWinMoney-0).toFixed(3)}}</label></p>
              <p><span class="lotter-money">返点：{{(lotterall.sumRebateMoney-0).toFixed(3)}}</span>  <label class="">中奖：{{(lotterall.sumPrizeMoney-0).toFixed(3)}}</label></p>
          </div>
        </li>
         <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="lotterlist.length>0">
        <li v-for="(item,index) in lotterlist" :key="index">
          <router-link v-bind="{to:'lotterydetail/'+item.dayTime}">
          <div class="list-item" >
            <p class="tit-time" v-text="item.dayTime">2017-10-30</p>
            <p> <span class="lotter-money">消费：{{(item.betMoney-0).toFixed(3)}}</span>  <label>盈利：{{(item.winMoney-0).toFixed(3)}}</label></p>
            <p> <span class="lotter-money">返点：{{(item.rebateMoney-0).toFixed(3)}}</span> <label class="">中奖：{{(item.prizeMoney-0).toFixed(3)}}</label></p>
          </div>
          </router-link>
        </li>
          </loadmore>
      </ul>
    </div>

    <div class="nocord" v-show="lotterlist.length==0 &&!loading.show">
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
const visibility = false;
const visibility2 = false;
export default {
  data() {
    return {
      value1: '',
      value2: '',
      visibility: visibility,
      visibility2: visibility2,
      lotterlist: [],
      lotterall: {},
      startDate:'' ,
      endDate: '',
      loadingText:'',
      showToast: false,//显示提示
      ToastText: '',   //提示内容
      ToastPosition: 'middle',//提示位置,
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
    let filter = eval('(' + vm.getStroe('lotterRecordFilter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }
    this.getlotter()
  },
  methods: {
    lotteryout(){
       this.removeStore('lotterRecordFilter'); //删除记录
       this.$router.go(-1)
    },
    getlotter() {
      let vm = this;
      let parmars = {
        startDate: vm.startDate,
        endDate: vm.endDate,
      }
      vm.loading.show = true;
      this.unitAjax('post', '/api/userCenter/lotteryReport/report', parmars, res => {
        vm.loading.show = false;
        if (res.result) {
          this.lotterlist = res.data.items;
          this.lotterall = res.data;
        } else {
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.goLogin();
          }
        }
      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getlotter();
      done();
    },
    //下拉刷新
    onInfinite(done) {

      let vm = this;
      let parmars = {
        startDate: vm.startDate,
        endDate: vm.endDate,
      }
    },
    showdate: function () {
      this.visibility = true;
    },
    showdate2: function () {
      this.visibility2 = true;
    },
    onchange(vul) {
      let vm = this;
      let filter = {
        startDate: vul,
        endDate: vm.endDate,
      }
      vm.setStore('lotterRecordFilter', filter);
      location.reload()
    },
    onchange2(vul2) {
      let vm = this;
      let filter = {
        startDate: vm.startDate,
        endDate: vul2,
      }
      vm.setStore('lotterRecordFilter', filter);
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
      width: 49%;
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
    top: 4.45rem;
    background-color: #f7f7f7;
  }
  .lotter-money {
    display: inline-block;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lotterylist {
    font-size: 0.26rem;
    label {
      float: right;
      width: 50%;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .list-w {
      height: 1rem;
      font-weight: 700;
      position: fixed;
      top: 2.3rem;
      width: 100%;
      z-index: 2;
      margin: 0;
    }
    ul li {
      height: 1.78rem;
      padding: 0.27rem 0.33rem;
      margin-top: 0.2rem;
      background-color: #fff;
      font-size: 0.26rem;
      p {
        height: 0.6rem;
        line-height: 0.6rem;
      }
    }
    ul li:first-child {
      width: 100%;
      position: fixed;
      top: 2rem;
      left: 0;
      z-index: 2;
      background-color: #fff;
      margin-top: 0.1rem;
      border-top: 1px solid #efefef;
    }
    ul li:last-child {
      margin-bottom: 0.2rem;
    }
  }
  //无数据图片
  .nocord {
    margin-top: 3.5rem;
    text-align: center;
    height: 10rem;
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
