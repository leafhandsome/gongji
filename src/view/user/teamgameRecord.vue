<template>
  <div class="container">
     <div class="top">
    <div class="header" >
      <div class="header-left returnBtn"  @click="reocrdout" v-if="showTitle==0"></div>
       <a href="close:close;" v-if="showTitle==1"><div class="header-left returnBtn" ></div></a>
       <h2 class="header-title">团队游戏记录</h2>
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
         <li @click="showdate"  v-text="dayTypeStr"></li>
         <li @click="showdate2"  v-text="gametypename"></li>
         <li @click="showpicker"  v-text="changeTypeName"></li>
       </ul>
     <div style="display: none">

       <popup-picker title="请选择" :data="daylist" v-model="value" value-text-align="left" :show.sync="visibility"  @on-change='onchange'></popup-picker>
       <popup-picker title="请选择" :data="teamgamelist"  value-text-align="left" :show.sync="visibility2"  @on-change='onchange2'></popup-picker>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>
 </div>
    <div class="gamelist" v-show="gamelist.length>0">
      <ul>
        <li>
          <div class="list-item list-frist">
            <div  class="item-tit">团队总计</div>
            <dl>
              <dd>消费：{{teamsum.betMoney}}</dd>
              <dd>中奖：{{teamsum.betPrizeMoney}}</dd>
            </dl>
            <dl>
              <dd>返点：{{teamsum.sendRebateMoney}}</dd>
              <dd>盈利：{{teamsum.winMoney}}</dd>
            </dl>
            <dl>
              <dd>返利：{{teamsum.rebateMoney}}</dd>
              <dd>返奖：{{teamsum.realMoney}}</dd>
            </dl>
          </div>
        </li>
         <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="gamelist.length>0">
        <li v-for="(item,index) in gamelist" :key="index" @click="gotodetail(item.orderSn)">
          <div class="list-item">
            <div class="item-t">{{item.userName}}<label v-show="item.nickName">&nbsp;({{item.nickName}})&nbsp;</label><label class="v-dl-label f18">{{item.userType}}</label> <span>返点{{item.waterRate}}%</span> </div>
            <div class="item-l">
              <!-- <p>{{item.gameType}}({{item.gameNo}})期&nbsp;{{item.playType}}</p> -->
               <p>{{item.gameType}}<label class="jine">&nbsp;({{item.gameNo}}期)</label>&nbsp;  <label class="win">{{item.playType}}</label></p>

              <p>投注金额：<label class="jine">{{item.betMoney}}</label>元  <label class="win">返点金额：{{item.sendRebateMoney}} 元</label></p>
              <p>中奖金额：<label class="jine"><span :class="item.betPrizeMoney>0?'prizeMoney':''">{{item.betPrizeMoney}}</span></label> 元  <label  class="win">{{item.orderState}}</label></p>
              <p>返奖金额：<label class="jine">{{item.realMoney}}</label>元  <label class="win">返利金额：{{item.rebateMoney}}元</label></p>
            </div>
            <!-- <p class="state reviewColor">{{item.orderState}}</p> -->
          </div>
        </li>
          </loadmore>
      </ul>
    </div>
     <div class="nocord" v-show="gamelist.length==0 &&!loading.show">
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
const visibility1 = false;
const visibility2 = false;
export default {
  data() {
    return {
      value: ['今天'],

      value1: ['全部下级'],
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      list: [['全部下级', '直接下级', '所有下级']],
      showTitle: 0,//app 返回按钮标识
      userName: '',
      changeTypeName: '全部下级',//下级选择
      daiLiType: 0,//下级选择编号
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载更多',
      dayType: 1,//时间
      dayTypeStr: '今天',//时间选择
      daylist: [['今天', '近三天', '近五天']],//时间
      gameType: '',
      gamelist: [],
      teamgamelist: [['今天', '三天内', '五天内']],
      typeList: {},
      gametypename: '全部彩种',
      teamsum: {},
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
    let vm = this;
    let urlHash = vm.urlparams();
    if (urlHash.userId && urlHash.token) {
      vm.setUrlCookie(urlHash.userId, urlHash.token)
      vm.showTitle = urlHash.showTitle;
    }
    let filter = eval('(' + vm.getStroe('teamgameFilter') + ')');
    if (filter) {
      vm.dayType = filter.dayType;//时间
      vm.gameType = filter.gameType;//彩中类型
      vm.daiLiType = filter.daiLiType;//下级
      vm.changeTypeName = filter.changeTypeName;
      vm.gametypename = filter.gametypename;
      vm.dayTypeStr = filter.dayTypeStr
    } else {
      vm.gametypename = '全部彩种';
      vm.dayTypeStr = '今天'
    }
    vm.getteamGemeType();
    vm.getteamgame();
    this.removeStore('teamgameFilter');//删除记录
  },
  methods: {
       gotodetail(orderSn){
        let filter = {};
        let vm = this;
        filter = {
          dayType: vm.dayType,//时间
          gameType: vm.gameType,//彩中类型
          daiLiType: vm.daiLiType,//下级
          changeTypeName: vm.changeTypeName,
          dayTypeStr: vm.dayTypeStr,
          gametypename: vm.gametypename,
        }
        vm.setStore('teamgameFilter', filter);
        vm.$router.push('teamgamedetail/'+orderSn);
    },
    reocrdout() {
      this.removeStore('teamgameFilter');//删除记录
      this.$router.go(-1)
    },
    changeSearch() {
      this.pageIndex = 1;
      this.getteamgame();
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
    onchange(vul) {
      let vm = this;
      let filter = {};
      let dayType = 0
      vm.dayTypeStr = vul[0];
      if (vm.dayTypeStr == '近三天') {
        dayType = 2;
      } else if (vm.dayTypeStr == '近五天') {
        dayType = 3;
      } else {
        dayType = 1;
      }
      filter = {
        dayType: dayType,//时间
        gameType: vm.gameType,//彩中类型
        daiLiType: vm.daiLiType,//下级
        changeTypeName: vm.changeTypeName,
        dayTypeStr: vm.dayTypeStr,
        gametypename: vm.gametypename,
      }
      vm.setStore('teamgameFilter', filter);
      location.reload()
    },
    onchange2(vul) {
      let vm = this;
      let filter = {};
      vm.gametypename = vul[0];
      for (var key in vm.typeList) {
        if (vm.typeList[key].name == vm.gametypename) {
          vm.gameType = vm.typeList[key].id;
        }
      }
      if (vm.gametypename == '全部彩种') {
        vm.gameType = '';
      }
      filter = {
        dayType: vm.dayType,//时间
        gameType: vm.gameType,//彩中类型
        daiLiType: vm.daiLiType,//下级
        changeTypeName: vm.changeTypeName,
        dayTypeStr: vm.dayTypeStr,
        gametypename: vm.gametypename,
      }
      vm.setStore('teamgameFilter', filter);
      location.reload()
    },
    onchange1(vul) {
      let vm = this;
      let filter = {};
      let daiLiType = 0
      vm.changeTypeName = vul[0];
      if (vm.changeTypeName == '直接下级') {
        daiLiType = 1;
      } else if (vm.changeTypeName == '所有下级') {
        daiLiType = 2;
      } else {
        daiLiType = 0;;
      }
      filter = {
        dayType: vm.dayType,//时间
        gameType: vm.gameType,//彩中类型
        daiLiType: daiLiType,//下级
        changeTypeName: vm.changeTypeName,
        dayTypeStr: vm.dayTypeStr,
        gametypename: vm.gametypename,
      }
      vm.setStore('teamgameFilter', filter);
      location.reload()
    },
    getteamGemeType() {
      let vm = this;
      this.unitAjax('post', '/api/agent/teamPlayLog/gameTypeMap', {}, res => {
        let arr = ['全部彩种'];
        if (res.result) {
          vm.typeList = res.data;
          for (var key in res.data) {
            arr.push(res.data[key].name);
          }
          vm.teamgamelist = [arr];
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            this.removeValue("token");
            this.removeValue("userId");
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }
      })
    },
    getteamgame() {
      let vm = this;
      let obj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        dayType: this.dayType,//时间
        gameType: this.gameType,//彩中类型
        daiLiType: this.daiLiType,//下级
        userName: this.userName//搜索名
      }
      vm.loading.show = true;
      this.unitAjax('post', '/api/agent/teamPlayLog/list', obj, res => {
        vm.loading.show = false;
        if (res.result) {
          vm.pageIndex++;
          this.gamelist = res.data.pageInfo.items;
          this.teamsum = res.data.sum;
          if (res.data.pageInfo.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            this.removeValue("token");
            this.removeValue("userId");
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
      vm.getteamgame();
      done();
    },
    //下拉刷新
    onInfinite(done) {
      let vm = this;
      let parmars = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        dayType: this.dayType,//时间
        gameType: this.gameType,//彩中类型
        daiLiType: this.daiLiType,//下级
        userName: this.userName//搜索名
      }
      vm.unitAjax('POST', '/api/agent/teamPlayLog/list', parmars, function (result) {
        if (result.result) {
          let res = result.data.pageInfo.items;
          vm.gamelist = vm.gamelist.concat(res);
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
    top: 5.6rem;
    background-color: #f7f7f7;
  }
  .gamelist {
    font-size: 0.26rem;
    ul li {
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
      }
      .item-l {
        width: 100%;
        float: left;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 0.45rem;
        }
        .prizeMoney {
          color: red;
        }
        .win {
          float: right;
        }
        .jine {
          color: #4584f5;
        }
      }
      .list-item {
        height: 2.1rem;
        .item-t {
          width: 100%;
          span {
            float: right;
          }
        }
        dl dd {
          width: 50%;
          float: left;
          height: 0.6rem;
        }
      }
      .list-frist {
        height: 1rem;
        font-weight: 700;
        position: fixed;
        top: 3.3rem;
        width: 100%;
        z-index: 2;
        margin: 0;
      }
      .list-item .item-tit {
        height: 0.4rem;
        line-height: 0.4rem;
      }
    }
    ul li:first-child {
      width: 100%;
      position: fixed;
      top: 3rem;
      left: 0;
      z-index: 2;
      background-color: #fff;
      margin-top: 0.1rem;
      border-top: 1px solid #efefef;
      padding: 0 0.33rem;
      height: 2.5rem;
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
