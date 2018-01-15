<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="removerebate"></div>
      <h2 class="header-title">团队返点记录</h2>
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
        <li @click="showdate"  v-text="startDate"></li>
         <li @click="showdate2"  v-text="endDate"></li>
         <li @click="showpicker"  v-text="changeTypeName"></li>
       </ul>
     <div style="display: none">
       <datetime v-model="value" :show.sync="visibility" @on-change='getStarDate' :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change='getEndDate' :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>

    <div class="lotterylist" v-show="rebatelist.length>0">
      <ul>
        <li >
          <div class="list-item list-w" >
              <p class="tit-time">总计</p>
              <p>返利：{{rebateSum.rebateMoney}} <label class="fanli">返奖：{{rebateSum.realMoney}}</label></p>
          </div>
        </li>
             <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="rebatelist.length>0">
        <li @click="gotodetail(item.orderSn)" v-for="(item,index) in rebatelist" :key="index">
          <div class="list-item" >
            <dl>
              <dd style="width:60%">{{item.userName}}<span v-show="item.nickName">&nbsp;({{item.nickName}})</span><label class="v-dl-label f18">{{item.userType}}</label>
              <dd style="width:40%">彩票返点：<label class="v-fd-var f18">{{item.waterRate}}%</label></dd>
            </dl>
            <dl>
              <dd style="width:60%">{{item.gameType}}&nbsp;({{item.gameNo}})&nbsp;期</dd>
              <dd  style="width:40%">{{item.playType}}</dd>
            </dl>
            <dl>
              <dd style="width:60%">返利：{{item.rebateMoney}}</dd>
              <dd  style="width:40%">返奖：{{item.realMoney}}</dd>
            </dl>
          </div>
        </li>
            </loadmore>
      </ul>
    </div>
     <div class="nocord" v-show="rebatelist.length==0 &&!loading.show">
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
const visibility  = false;
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
      startMonthDate: this.getMonthFormatDate(),
      endMonthDate: this.getNowFormatDate(),
      list: [['全部', 'B', 'C']],
      userName: '',
      startDate: this.getNowFormatDate(),
      endDate: this.getNowFormatDate(),
      changeTypeName: '全部',
      loadingText: '加载更多',
      pageIndex: 1,
      pageSize: 10,
      rebatelist: [],
      errtext: '',
      typeobj: {},
      changeType: '',//彩种id
      rebateSum: {},
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
    let vm=this;
    let filter = eval('(' + vm.getStroe('rebateFiter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate   = filter.endDate;
      vm.changeTypeName = filter.changeTypeName;
      vm.changeType = filter.changeType
    }else{
      vm.startDate = vm.getNowFormatDate();
      vm.endDate   = vm.getNowFormatDate()
    }
    vm.getType();
    vm.getrebateRecord()
    vm.removeStore('rebateFiter');//删除记录
  },
  methods: {
    gotodetail(orderSn){
      let filter={};
      let vm = this;
      filter = {
        startDate: vm.startDate,
        endDate: vm.endDate,
        changeType:vm.changeType,//彩种类型
        userName: vm.userName,
        changeTypeName: vm.changeTypeName,
      }
      vm.setStore('rebateFiter', filter);
      vm.$router.push('rebatedetail/'+orderSn);
    },
    removerebate(){
      this.removeStore('rebateFiter');//删除记录
      this.$router.go(-1)
    },
    getrebateRecord() {
      let vm = this;
          vm.loadingText = '加载中...';
      let obj = {
        pageIndex: vm.pageIndex,
        pageSize:  vm.pageSize,
        startDate: vm.startDate,
        endDate:   vm.endDate,
        gameType:  vm.changeType,//彩种类型
        userName:  vm.userName//搜索名
      }
      vm.loading.show = true;
      vm.unitAjax('post', '/api/agent/teamRebateLog/list', obj, res => {
        vm.loading.show = false;
        if (res.result) {
          vm.pageIndex++;
          vm.rebatelist = res.data.pageInfo.items;
          vm.rebateSum = res.data.rebateSum;
          if (res.data.pageInfo.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        }
      })
    },
    //获取彩种列表
    getType() {
      this.unitAjax('post', '/api/agent/teamPlayLog/gameTypeMap', {}, res => {
        if (res.result) {
          let arr = ['全部']
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].name)
          }
          this.list = [arr];
          this.typeobj = res.data;
        }
      })
    },
    // 搜索
    changeSearch() {
      this.pageIndex = 1;
      this.getrebateRecord()
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
      let filter = {};
      let vm = this;
      filter = {
        startDate: vul,
        endDate: vm.endDate,
        changeType: vm.changeType,//彩种类型
        userName: vm.userName,
        changeTypeName: vm.changeTypeName,
      }
      vm.pageIndex = 1;
      vm.setStore('rebateFiter', filter);
      location.reload()
    },
    getEndDate(vul) {
      let filter = {};
      let vm = this;
      filter = {
        startDate: vm.startDate,
        endDate:   vm.vul,
        changeType: vm.changeType,//彩种类型
        userName:   vm.userName,
        changeTypeName: vm.changeTypeName,
      }
      vm.pageIndex = 1;
      vm.setStore('rebateFiter', filter);
      location.reload()
    },
    onchange1(vul) {
      let filter = {}
      let vm = this;
      vm.changeTypeName = vul[0];
      for (var key in vm.typeobj) {
        if (vm.changeTypeName == vm.typeobj[key].name) {
          vm.changeType = vm.typeobj[key].id
        }
      }
      if (vm.changeTypeName == '全部') {
        vm.changeType = ''
      }
      filter = {
        startDate:  vm.startDate,
        endDate:    vm.endDate,
        changeType: vm.changeType,//彩种类型
        userName:   vm.userName,
        changeTypeName: vm.changeTypeName,
      }
      vm.pageIndex = 1;
      vm.setStore('rebateFiter', filter);
      location.reload()
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getrebateRecord();
      done();
    },
    //下拉刷新
    onInfinite(done) {
      let vm = this;
      let parmars = {
        pageIndex: vm.pageIndex,
        pageSize:  vm.pageSize,
        startDate: vm.startDate,
        endDate:   vm.endDate,//时间
        gameType:  vm.changeType,//彩中类型
        userName:  vm.userName//搜索名
      }

      vm.unitAjax('POST', '/api/agent/teamRebateLog/list', parmars, function (result) {
        if (result.result) {
          let res = result.data.pageInfo.items;
          vm.rebatelist = vm.rebatelist.concat(res);
          if ( result.data.pageInfo.items.length < vm.pageSize) {
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
    top: 5.1rem;
    background-color: #f7f7f7;
  }
  .lotterylist {
    font-size: 0.26rem;
    .list-w {
      font-weight: 700;
    }
    ul li {
      height: 1.78rem;
      padding: 0.27rem 0.33rem;
      margin-top: 0.2rem;
      background-color: #fff;
      font-size: 0.26rem;
      .list-item dl dd {
        width: 50%;
        float: left;
        height: 0.6rem;
        line-height: 0.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list-item p {
        height: 0.6rem;
        line-height: 0.6rem;
      }
      .fanli {
        padding-left: 0.5rem;
      }
    }
    ul li:first-child {
      margin-top: 0;
      height: 1.42rem;
    }
    ul li:last-child {
      margin-bottom: 0.2rem;
    }
  }
  select {
    background: transparent;
    border: none;
    padding-left: 10px;
    width: 1rem;
    height: 100%;
    text-align: center;
    option {
      background: transparent;
    }
  }
  //无数据图片
  .nocord {
    margin-top: 1.5rem;
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
