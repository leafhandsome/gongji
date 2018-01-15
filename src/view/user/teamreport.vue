<template>
  <div class="container">
      <div class="top">
    <div class="header">
      <div class="header-left returnBtn"  @click="goout"></div>
      <h2 class="header-title">团队报表</h2>
        <span class="close" v-show="index>=1" @click="$router.go(-1)">关闭</span>
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
         <li @click="showdate"  v-text="startDate">2017-10-28</li>
         <li @click="showdate2"  v-text="endDate">2017-10-28</li>
         <li @click="showpicker"  v-text="changeTypeName">全部</li>
       </ul>
     <div style="display: none">
        <datetime v-model="value" :show.sync="visibility" @on-change='getStarDate' :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change='getEndDate' :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>
 </div>
    <div class="reportlist"  v-show="teamreportlist.length>0">
      <ul>
        <li class="sumheight">
          <div class="list-item list-frist">
             <div  class="item-tit">团队总计</div>
             <dl>
               <dd>消费：{{teamreportsum.betMoney}}</dd>
               <dd>中奖：{{teamreportsum.betPrizeMoney}}</dd>
               <dd>充值：{{teamreportsum.payMoney}}</dd>
               <dd>提现：{{teamreportsum.cashMoney}}</dd>
             </dl>
              <dl>
                <dd>返利：{{teamreportsum.rebateMoney}}</dd>
                <dd>返奖：{{teamreportsum.realMoney}}</dd>
                  <dd>盈利：{{teamreportsum.winMoney}}</dd>
              </dl>
          </div>
        </li>
          <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="teamreportlist.length>0">
        <li v-for="(item,index) in teamreportlist" :key="index">
          <div class="list-item">
            <div  class="item-tit">{{item.userName}}<span v-show="item.remarkName">&nbsp;({{item.remarkName}})</span><label class="v-dl-label f18">
            {{item.userType==1?'代理':'会员'}}</label> 
            <label class="subnum" @click.stop="getchild(item.userId)" v-show="item.childCount!==0">下级：{{item.childCount}}</label></div>
            <dl>
              <dd>消费：{{item.betMoney}}</dd>
              <dd>中奖：{{item.betPrizeMoney}}</dd>
              <dd>盈利：{{item.winMoney}}</dd>
            </dl>
            <dl>
              <dd>返利：{{item.rebateMoney}}</dd>
              <dd>返奖：{{item.realMoney}}</dd>
            </dl>
          </div>
        </li>
         </loadmore>
      </ul>
    </div>
     <div class="nocord" v-show="teamreportlist.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record" v-show="!errtext">暂无记录，请选择日期</div>
      <div class="record" v-show="errtext" v-text="errtext"></div>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>

<script>
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
      list: [['全部', '直接下级', '所有下级']],
      userName: '',
      startDate: this.getNowFormatDate(),
      endDate: this.getNowFormatDate(),
      startMonthDate: this.getMonthFormatDate(),
      endMonthDate: this.getNowFormatDate(),
      changeTypeName: '全部',
      pageIndex: 1,
      pageSize: 10,
      daiLiType: 0,
      teamreportlist: [],
      teamreportsum: {},
      childUserId: '',
      loadingText: '加载更多',
      index: 0,
      parentId: '',
      errtext: '',
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
    this.getteamreport();
     this.removeStore('gameFilter');//删除记录
  },
  methods: {
    goout() {

      let params = eval('(' + this.getStroe('childObj' + this.index) + ')');
      if (params) {
        if (params.goChild) {
          this.pageIndex = 1;
          this.childUserId = params.id;
          this.getteamreport();
          this.removeStore('childObj' + this.index);
          this.index--;
        }
      } else {
        this.removeStore('gameFilter');//删除记录
        this.$router.go(-1)
      }

    },
    changeSearch() {
      this.pageIndex = 1;
      this.getteamreport()
      if (this.teamreportlist.length == 0) {
        this.errtext = '当前没有该用户'
      }
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
      this.startDate = vul;
      this.pageIndex = 1;
      this.getteamreport()
    },
    getEndDate(vul) {
      this.endDate = vul;
      this.pageIndex = 1;
      this.getteamreport()
    },
    onchange1(vul) {
      let vm = this;
      vm.changeTypeName = vul[0];
      if (vm.changeTypeName == '直接下级') {
        vm.daiLiType = 1;
        this.pageIndex = 1;
        vm.getteamreport()
        return;
      } else if (vm.changeTypeName == '所有下级') {
        vm.daiLiType = 2;
        this.pageIndex = 1;
        vm.getteamreport()
        return;
      } else {
        vm.daiLiType = 0;
        this.pageIndex = 1;
        vm.getteamreport()
      }
    },
    getteamreport() {
      let obj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        daiLiType: this.daiLiType,//下级代理
        userName: this.userName,//搜索名
        childUserId: this.childUserId
      }
      this.parentId = this.childUserId;
      let vm = this;
      vm.loading.show = true;
      this.unitAjax('post', '/api/agent/teamReport/list', obj, res => {
        vm.loading.show = false
        if (res.result) {
          vm.pageIndex++;
          this.teamreportlist = res.data.pageInfo.items;
          this.teamreportsum = res.data.reportSum;
          if (res.data.pageInfo.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        } else {
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.$router.push({ path: '/loginpage' });
          }
        }
      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getteamreport();
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
        daiLiType: this.daiLiType,//下级代理
        userName: this.userName,//搜索名
        childUserId: this.childUserId
      }
      vm.unitAjax('POST', '/api/agent/teamReport/list', parmars, function (result) {
        if (result.result) {
          let res = result.data.pageInfo.items;
          vm.teamreportlist = vm.teamreportlist.concat(res);
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
    // 点击下级时
    getchild(id) {
      this.index++;
      this.childUserId = id;
      let params = {
        id: this.parentId,
        goChild: true,
      }
      this.setStore('childObj' + this.index, params);
      this.pageIndex = 1;
      this.getteamreport();
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  height: -webkit-fill-available;
  .header {
    .close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0.32rem;
      color: black;
      font-weight: 700;
    }
  }
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
    top: 5.8rem;
    background-color: #f7f7f7;
  }
  .reportlist {
    font-size: 0.26rem;
    .sumheight {
      height: 2.5rem;
      margin-top: 1rem;
    }
    ul li {
      background-color: #fff;
      height: 2.02rem;
      margin-bottom: 0.2rem;
      padding: 0 0.32rem;
      .list-item {
        padding-top: 0.1rem;
        dl dd {
          width: 33.33%;
          float: left;
          height: 0.6rem;
        }
      }
      .list-frist {
        height: 1rem;
        font-weight: 700;
        position: fixed;
        top: 3.2rem;
        width: 100%;
        z-index: 2;
      }
      .list-item .item-tit {
        height: 0.6rem;
        line-height: 0.6rem;
      }
      .list-item .subnum {
        float: right;
        color: #4584f5;
      }
    }
    ul li:first-child {
      width: 100%;
      position: fixed;
      top: 2rem;
      left: 0;
      z-index: 2;
      background-color: #fff;
      margin-top: 1.1rem;
      border-top: 1px solid #efefef;
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
