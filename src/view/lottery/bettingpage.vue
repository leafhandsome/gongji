<template>
  <div class="main" style="background: #fff;">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.push('/index')"></div>
      <div class="header-title"><label v-if="userInfo && !showLoginBtn">￥{{userInfo.safeMoney}}</label>&nbsp;&nbsp;
        <span @click="goURL('/voucher')" v-if="!showLoginBtn">充值</span>
        <span @click="login" v-if="showLoginBtn">登录</span>
      </div>
      <div class="header-right" >
        <div class="cut" @click="golotterylist()">
          <img src="../../assets/images/lottery/cut1.png">
        </div>
      </div>
    </div>
    <div class="timercontainer">
      <div class="timer-tab" v-model="swiperItemIndex" :class="[swiperItemIndex==0?'first':'',swiperItemIndex==1?'second':'',swiperItemIndex==2?'last':'']">
        <ul>
          <li @click="ontab(index)" v-for= "(items,index) in gameMatchList" :key="index">
            <div class="marquee">
              <Marquee>
                <marquee-item >No.{{items.gameNo}}</marquee-item>
                <marquee-item >{{items.gameStateName}}</marquee-item>
              </Marquee>
            </div>
          </li>
        </ul>
      </div>

      <div class="timer-content">
        <swiper dots-position="center" :show-dots="false"  @on-index-change="onSwiperItemIndexChange" v-model="swiperItemIndex" height="1.7rem">
          <swiper-item class="black" v-for= "(items,index) in gameMatchList" :key="index">
            <div class="" v-show="!closeRoom">
              <p class="lotteryname"v-if="index==0">{{roomName}}</p>
              <p class="timer-time" v-if="index==0">{{remaining}}</p>
              <p class="timer-tip"><span  v-if="index==0 && islockBtn">最后{{lockTime}}s截止受注</span></p>
            </div>
             <div v-show="closeRoom && index==0">
               <p class="f30">{{roomName}}</p>
               <p class="closeReason f50">{{closedTitle}}</p>
               <p class="openTime f20">{{closedContent}}</p>
             </div>
            <p class="lotteryname" v-if="index==1 && isopenCode">正在开奖</p>
            <div class="drawBall">
              <p class="sprite" v-for="(item,key) in items.openCode" :key="key">{{item}}</p>
            </div>
            <div class="drawtext" v-if="index==1 && !isopenCode">
              <p >{{items.bigOrSmall}}|</p>
              <p >{{items.singleOrDouble}} |</p>
              <p >{{items.draganOrTiger}} </p>
              <p >和值:{{items.sum}}</p>
            </div>

            <div class="drawtext" v-if="index==2">
              <p >{{items.bigOrSmall}}|</p>
              <p >{{items.singleOrDouble}} |</p>
              <p >{{items.draganOrTiger}} </p>
              <p >和值:{{items.sum}}</p>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>

    <div class="containermain">
      <div class="head-tab">
        <div class="tab" v-show="showTab">
          <tab :line-width="2" custom-bar-width="1rem" v-model="index" >
            <tab-item :selected="seltab == index" v-for="(item,index) in tablist" :key="index" @on-item-click="clickTab(item,index)">{{item.name}}</tab-item>
          </tab>
        </div>
      </div>
      <!--玩法列表-->
      <div class="authpaly" v-if="index==idx" v-for="(allList,idx) in allPlayList">
        <div class="btn-content">
          <p class="tip" v-if="index==0">添加您喜爱的玩法，<span class="now" @click="addplays">马上就去</span></p>
          <scroller lock-y :scrollbar-x=false v-if="index!=0">
            <div class="scrollernav border-b1">
              <ul>
                <li v-for="(items,index) in allList.childClassList" @click="subnavfun(index,items)" :class="subnavval==index?'selsubnav':''" :key="index">{{items.name}}</li>
              </ul>
            </div>
          </scroller>
          <div class="" v-for="(items,idx) in allList.childClassList":key="idx" v-if="subNavId==items.id">
            <swiper dots-position="center" height="3.9rem" >
                <swiper-item class="black" v-for="(data,i) in items.playList[0]" :key="i">
                  <div class="btn">
                    <ul class="btnAll rol-2" :class="islockBtn?'lockBtn':''">
                      <li :class="[item.size==6?'col-2':'',item.size==4?'col-3':'',item.size==3?'col-4':'']"  @click="showmadol(item)" v-for="(item,idx1) in data" :key="idx1"><span>{{item.playName}}</span></li>
                    </ul>
                  </div>
                </swiper-item>
            </swiper>
          </div>
        </div>
      </div>

      <div class="trendpage" v-show="!loading.show ">
        <scroller lock-y :scrollbar-x=true>
          <div class="trendlist zoushi">
            <div class="list">
              <ul v-for="ul in rend">
                <li v-for="li in ul">{{li}}</li>
              </ul>
            </div>
          </div>
        </scroller>
      </div>
    </div>
    <div class="navbar">
      <subnavbar @clickType="clickmune"></subnavbar>
    </div>
    <div class="modal">
      <!--显示通用的页面-->
      <betmodal v-if="showbetmodal" @changingType='hidemodal' :params="objparma"></betmodal>
      <!--两面玩法页面-->
      <doubelplay v-if="showdoubelplay" @hidedoubel='hidemodal' :params="objparma"></doubelplay>
    </div>
    <div class="bottomNav">
      <history v-if="showhistory" @hidehistory ="hidehistory" :params="objparma"></history>
      <result  v-if="showresult"  @bethideresut="hideresult"  :params="objparma"></result>
    </div>
    <!--加载动画-->
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>

</template>
<script>

  import {Marquee, MarqueeItem} from  'vux';
  import {mapState, mapMutations} from 'vuex'
  import Params from  '../../config/Param.json';
  import history from './history'
  import betmodal from './betmodal'
  import result from   './result'
  import doubelplay from  './betdouble'

  export default {
    data(){
      return{
        seltab:0,
        index: 5,
        subnavval:0,
        subNavId:0,
        countNum:3,        //倒计时
        lockTime:0,        //封盘的时间
        tablist:[],
        swiperItemIndex:0,
        showTab:false,
        loading: {
          show: true,
          text: '加载中...'
        },
        isopenCode:false,//是否开奖
        islockBtn:false, //是否封盘
        showbetmodal:false,//显示投注页面
        showdoubelplay:false,//显示双面玩法
        showLoginBtn:false,//登录关闭按钮
        rend:{},    //走势
        rendlist:{}, //走势数据
        showhistory: false,//历史记录
        showresult:false,//显示开奖结果
        objparma:{},//玩法参数,
        playData : {}, //玩法数据,
        modalheight:'8.3rem',//投注框的高度
        roomId:"",//房间ID
        roomName:"",//房间名称
        gameMatchList:{}, //前三期数据
        allPlayList:{},//所有玩法
        safeMoney:0, //用户余额,
        futureTime:0,//记住当前时间
        closeRoom:false,//房间关闭状态
        closedTitle:'',  //房间关闭标题
        closedContent:'',//房间关闭内容
        userInfoData:{},  //用户信息
        rendList:{},
        navType:'',
      }
    },
    created(){
      let vm = this;
      let token =  vm.getValue("token");
      let userId = vm.getValue("userId");
      if(!token && !userId){
        vm.showLoginBtn = true;
      }
      vm.getData();
    },
    mounted(){
      let vm = this;
      vm.remainingTime();
      //页面离开停止倒计时
      window.addEventListener("popstate", function(e) {
        clearInterval(vm.timers);
        //clearInterval(vm.timer);
        vm.setNav(2);
      }, false);
    },

    computed: {
      //转换时间成分秒
      remaining: function (){
        let vm = this;
        //同步浏览器停止倒计时
        //console.log(vm.futureTime- vm.getSeconds())
        if(vm.futureTime - vm.getSeconds()<=-4){
          vm.gameMatches();
          return;
        }
        //封盘停止受注
        if(vm.countNum <= vm.lockTime){
          vm.showbetmodal   = false;
          vm.showdoubelplay = false;
          vm.islockBtn = true;
          vm.gameMatchList[0].gameStateName = '停止受注['+vm.countNum+"]" ;
        }
        //时间格式转换
        if(vm.countNum >= 0){
          return vm.formatDuring(vm.countNum)
        }else{
          vm.gameMatches();
          vm.ontab(1);
        }
      },
      ...mapState([
        'userInfo'
      ]),
    },
    methods: {
      ...mapMutations([
        'GET_USERINFO'
      ]),
      getData () {
        let vm = this;
        let parmar = vm.$route.params;
        vm.roomId = parmar.roomId;//获取房间id
        vm.roomName = parmar.roomName //房间名称

        vm.gameMatches();
        vm.getplayList();
        vm.getTrend(1);
      },
      //获取游戏前三期
      gameMatches () {
        let vm = this;
        vm.loading.show = true;
        vm.gameMatchList[1] = {};
        vm.unitAjax('POST', '/api/lottery/gameMatches', {"roomId": vm.roomId}, function (result) {
          if (result.result) {
            vm.userInfoData = {
              safeMoney: result.data.safeMoney
            }
            vm.GET_USERINFO(vm.userInfoData)
            vm.islockBtn = false;
            vm.gameMatchList = result.data.gameMatchList;
            vm.countNum = vm.gameMatchList[0].endTime
            vm.futureTime = vm.getSeconds();
            vm.lockTime = vm.gameMatchList[0].lockTime;
            if (vm.gameMatchList[1].openCode.length <= 0) {
              vm.isopenCode = true;
              vm.timergetlist();
            }
            vm.loading.show = false;
            //房间关闭
            if (result.data.roomStatus && result.data.roomStatus != 1) {
              vm.closeRoom = true;
              vm.islockBtn = true;
              vm.gameMatchList[0].gameStateName = '已经关闭';
              vm.closedTitle = result.data.closedTitle;
              vm.closedContent = result.data.closedContent;
              return;
            }
          } else {
            vm.loading.show = false;
          }
        });
      },

      //定时获取开奖结果
      timergetlist () {
        let vm = this;
        vm.stopBodyScroll(false);
        vm.timers = setInterval(() => {
          if (vm.isopenCode) {
            vm.unitAjax('POST', '/api/lottery/gameMatches', {"roomId": vm.roomId}, function (result) {
              if (result.result) {
                vm.gameMatchList = result.data.gameMatchList;
                if (result.data.roomStatus && result.data.roomStatus != 1) {
                  vm.$router.push('/index');
                  return;
                }
                if (vm.gameMatchList[1].openCode.length > 0) {
                  let data = vm.gameMatchList[1];
                  vm.isopenCode = false;
                  vm.rendList.bigOrSmall.pop();    //大小
                  vm.rendList.singleOrDouble.pop();//单双
                  vm.rendList.draganOrTiger.pop(); //龙虎
                  vm.rendList.bigOrSmall.unshift(data.bigOrSmall);       //大小
                  vm.rendList.singleOrDouble.unshift(data.singleOrDouble); //单双
                  vm.rendList.draganOrTiger.unshift(data.draganOrTiger);   //龙虎
                  if (vm.navType == 4) {
                    vm.renddata(vm.rendList.draganOrTiger);
                  } else if (vm.navType == 3) {
                    vm.renddata(vm.rendList.singleOrDouble);
                  } else {
                    vm.renddata(vm.rendList.bigOrSmall);
                  }
                } else {
                  vm.isopenCode = true;
                }
              }
            });
          } else {
            clearInterval(vm.timers);
          }
        }, 10000);
      },
      //获取玩法列表
      getplayList () {
        let vm = this;
        vm.tablist = []
        vm.unitAjax('POST', '/api/lottery/playList', {"roomId": vm.roomId}, function (result) {
          vm.showTab = true;
          if (result.result) {
            let res = vm.playsData(result.data.playClassList);
            vm.allPlayList = res;
            for (var i = 0; i < vm.allPlayList.length; i++) {
              vm.tablist.push(vm.allPlayList[i]);
            }
          }
        });
      },
      //获取走势
      getTrend (type) {
        let vm = this;
        vm.stopBodyScroll(false);
        vm.unitAjax('POST', '/api/lottery/trend', {"roomId": vm.roomId, "trendType": type}, function (result) {
          if (result.result) {
            vm.loading.show = false;
            vm.rendList = result.data;
            vm.renddata(result.data.bigOrSmall);
          } else {
            vm.loading.show = false;
          }
        });
      },
      //三期切换
      onSwiperItemIndexChange (index) {
        this.swiperItemIndex = index;
      },
      //三期切换
      ontab (index) {
        this.swiperItemIndex = index;
      },
      //计算时间 时间倒计时
      remainingTime () {
        let vm = this;
        clearInterval(vm.timer);
        vm.timer = setInterval(() => {
          vm.countNum--;
          vm.futureTime++;
        }, 1000);
      },
      //弹出投注弹窗
      showmadol (val) {
        let vm = this;
        if (vm.islockBtn) {
          return false;
        }
        let token = vm.getValue("token");
        let userId = vm.getValue("userId");
        if (token && userId) {
          vm.objparma = val;
          vm.objparma.roomId = vm.roomId;                  //房间id
          vm.objparma.gameNo = vm.gameMatchList[0].gameNo; //游戏期号
          console.log(val.playType)
          if (vm.contains(Params.doubelPlayType, val.playType)) {
            vm.showdoubelplay = true;
          } else {
            vm.showbetmodal = true;
          }
          vm.stopBodyScroll(true);
        } else {
          vm.goLogin();
        }
      },
      //关闭投注弹窗
      hidemodal (data) {
        let vm = this;
        if (!data.hide) {
          vm.showbetmodal = false;
          vm.showdoubelplay = false;

        } else {
          vm.showbetmodal = true;
        }
        vm.stopBodyScroll(false);
      },
      //走势
      renddata (arr1) {

        let vm = this;
        let result = [];
        let temp = [];
        let arr2 = [];
        let arr1len = arr1.length - 1;
        vm.rend = {};

        for (var i = arr1len; i >= 0; i--) {
          arr2.push(arr1[i]);
        }

        for (var i = 0; i < arr2.length; i++) {
          if (i > 0 && arr2[i] != arr2[i - 1] || temp.length > 5) {
            result.push(temp);
            temp = [];
          }
          temp.push(arr2[i]);
          if (i + 1 == arr2.length) {
            result.push(temp);
          }
        }
        vm.rend = result;
      },

      //点击菜单
      clickmune (type) {
        let vm = this;
        vm.navType = type;
        vm.objparma.roomId = vm.roomId;
        vm.objparma.gameNo = vm.gameMatchList[0].gameNo;
        vm.objparma.roomName = vm.roomName
        //显示开奖结果
        if (type == 0) {
          vm.showresult = true;
          vm.showhistory = false;
          vm.stopBodyScroll(true);
          return false;
        }
        //显示开奖历史
        else if (type == 1) {
          let token = vm.getValue("token");
          let userId = vm.getValue("userId");
          if (!token && !userId) {
            vm.goLogin();
            return false;
          }
          vm.showhistory = true;
          vm.showresult = false;
          vm.stopBodyScroll(true);
          return false;
        }
        //大小走势
        else if (type == 2) {
          vm.setNav(type);
          vm.renddata(vm.rendList.bigOrSmall);
        }
        //单双走势
        else if (type == 3) {
          vm.setNav(type);
          vm.renddata(vm.rendList.singleOrDouble);
        }
        //龙虎走势
        else if (type == 4) {
          vm.setNav(type);
          vm.renddata(vm.rendList.draganOrTiger);
        }
        vm.showresult = false;
        vm.showhistory = false;
      },
      //隐藏开奖历史
      hidehistory (data) {
        let vm = this;
        vm.showhistory = data.hide;
        vm.stopBodyScroll(false);
        vm.getNav();
      },
      //隐藏开奖结果
      hideresult (data) {
        let vm = this;
        vm.showresult = false;
        vm.stopBodyScroll(false);
        vm.getNav();
      },

      //跳转彩票列表
      golotterylist () {
        let vm = this;
        vm.$router.push({path: '/lotterylist/' + vm.roomId + "/" + vm.roomName});
      },
      //添加玩法
      addplays () {
        let vm = this;
        let token = vm.getValue("token");
        let userId = vm.getValue("userId");

        if (token && userId) {
          vm.$router.push({path: '/addplays/' + vm.roomId + "/" + vm.roomName})
        } else {
          vm.goLogin();
        }
      },
      //显示登录页面
      login () {
        let vm = this;
        vm.goLogin();
      },
      //点击一级菜单，默认选择二级菜单第一个。
      clickTab (data, index) {
        this.subnavval = 0;
        this.subNavId = data.childClassList[0].id
      },
      //选择二级菜单
      subnavfun (val, items) {
        this.subnavval = val;
        this.subNavId = items.id
      },
      //点击菜单设置菜单值
      setNav (type) {
        let vm = this;
        vm.userSetNav = {
          userSetNav: type
        }
        vm.GET_USERINFO(vm.userSetNav);
      },
      //取消开奖结果 历史记录回到原来的菜单
      getNav () {
        let vm = this;
        let type = 2
        if (vm.userInfo) {
          if (vm.userInfo.userSetNav) {
            type = vm.userInfo.userSetNav
          }
        }
        vm.userSetNav = {
          userSetNav: type
        }
        vm.GET_USERINFO(vm.userSetNav);
      }
    },
    components:{
      Marquee,
      MarqueeItem,
      history,
      betmodal,
      result,
      doubelplay,
    }
  }
</script>
<style lang="scss" scoped>
  /*header*/
  .main{
    position: relative;
    margin-bottom: 0.6rem;
  }
  .returnBtn:after{
    border-color: #FFF;
  }
  .header{
    position: absolute;
    top:.2rem;
    background:none;
    border-bottom:none;
    height:0.6rem;
  .header-right{
    top:0;
    right:0;
    height: 0.6rem;
    line-height: 0.6rem;
    color:#fff;
  span{
    float: left;
    text-align: center;
    width: 1rem;
  }
  .cut{
    width: 1rem;
    height:0.6rem;
    line-height: 0.6rem;
    float: left;
    text-align: center;
    padding-top:0.1rem;
  img{
    width: 0.35rem;
    height: 0.35rem;
  }
  }
  }
  .header-title{
    color:#fff;
    line-height: 0.6rem;
    span{
      font-size: 0.3rem;
      color: #FFF369;
    }
  }
  .header-left {
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    padding-left: 0.33rem;
  }
  .returnBtn:after{
    top:30%;
  }
  }
  .timercontainer{
    background: url("../../assets/images/betting-bg.png") no-repeat;
    background-size: cover;
    height:2.3rem;
    color:#fff;
    padding-top: 1.09rem;
    ul li{
      float: left;
      width: 29%;
      text-align: center;
      border-right: 1px solid #fff;
      height:0.4rem;
      line-height: 0.4rem;
      font-size: 0.22rem;
      display:block;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    ul li:nth-child(3){
      border-right: none;
    }
    .first li:first-child {
      width: 40%;
    }
    .second li:nth-child(2){
      width: 40%;
    }
    .last li:nth-child(3){
      width: 40%
    }
    .timer-content{
      padding-top: 0.60rem;
      text-align: center;
    .lotteryname{
      font-size: 0.36rem;
      height: 0.8rem;
      line-height: 0.8rem;
    }
    .timer-tip{
      font-size: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
    }
    .timer-time{
      font-size: 0.38rem;
      height: 0.7rem;
      line-height: 0.7rem;
    }
    .drawBall{
      p{
        margin: 0 0.1rem;
      }
    .sprite{
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
    }
    }
    .drawtext{
      text-align: center;
      height:0.4rem;
      line-height: 0.4rem;
      p{
        margin: 0.2rem 0.05rem;
        text-align: center;
        display: inline-block;
      }
    }

  }
  .marquee {
    padding:0 0.2rem;
    ul li {
      text-align: center;
      border-right: none;
      line-height: 0.4rem;
      font-size: 0.22rem;
      overflow: hidden;
    }
    li:first-child{
      width: 100%;
    }
    li:nth-child(2){
      width: 100%;
    }
    li:nth-child(3){
      display: none;
      width: 100%
    }
    }
  }
  /*tab*/
  .head-tab {
    border-bottom: 1px solid #e5e5e5;
    .tab {
      width: 90%;
      margin: 0 auto;
      color: #9EA1B2;
      height: 0.69rem;
    .vux-tab{
      height: 0.66rem;
    }
    .vux-tab .vux-tab-item {
      font-size: .28rem;
      background: none;
      line-height: 0.69rem;
    }

    .vux-tab .vux-tab-item.vux-tab-selected {
      color: #000;
      font-weight: 800;
     }
    }
  }
  .btn-content{
    margin:0 0.05rem;
    .tip{
      height: 0.62rem;
      line-height: 0.62rem;
      text-align: center;
      color:#9EA1B2;
      font-size: 0.25rem;
    .now{
      color: #349AFB;
      border-bottom: 1px solid #349AFB;
    }
  }
  }

  .containermain{
    height: auto;
    overflow: hidden;
    background-color: #FFF;
    padding-bottom: 0.5rem;
  .trendpage{
    position: relative;
    height: 3rem;
  .trendlist{
    width: 15.5rem;
    height:2.5rem;
    background: url("../../assets/images/trend.png");
    background-size: cover;
    border-top: 1px solid #e5e5e5;
    .list{
      padding: 0.15rem 0 0 0.04rem;
    }
  }
    ul{
      width:0.3rem;
      float: left;
      margin:0.02rem 0 0 0.14rem;
    li{
      width: 0.3rem;
      height: 0.3rem;
      background: #fff;
      line-height: 0.3rem;
      font-size: 0.2rem;
      text-align: center;
      border: 0.01rem solid #e5e5e5;
      border-radius:100px;
      margin:  0.04rem 0;
    }
    }
  }
  }
  /*投注类型按钮*/
  .btn{
    width: 100%;
    margin-top:0.1rem ;
  .col-2{
    width: 48%;
  }
  .col-3{
    width: 31.3%;
  }
  .col-4{
    width: 23%
  }

  /*投注按钮有倍数*/
  .rol-2{
    li{
      span{
        display: block;
        line-height: 0.5rem;
      }
    }
  }
  }
  .btnAll{
    li{
      float: left;
      margin:0.05rem;
      height: 1.05rem;
      border: 1px solid  #349AFB;
      line-height: initial;
      text-align: center;
      border-radius: 0.05rem;
      font-size: 0.3rem;
      color: #565D63;
      font-weight: 500;
      background: #F9FCFF;
      display: flex;
      justify-content: center;
      align-items: center
    }
  }
  .lockBtn{
    li{
      opacity:0.5;
    }
  }
  .nolockBtn{
    li{
      opacity:1;
    }
  }
  /*滑动菜单*/
  .scrollernav{
    height: 0.62rem;
    width: 7.68rem;
    line-height: 0.62rem;
    ul li{
      width: 1.28rem;
      float: left;
      text-align: center;
    }
  }
  .doublescroll{
    width: 11.52rem;
  }
  .selsubnav {
    color:#349AFB;
  }
  .betPage{
    float: right;
    width: auto;
  }
</style>
