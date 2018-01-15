<template>
  <div class="container">
      <navBar ></navBar>
    <div class="header-positon" v-if="">
      <div class="header">
        <div class="header-left"  @click="$router.push('messagecenter')"><img src=../../assets/images/icons/icon-message.png>
          <span class="vux-badge vux-badge-single" style="left:0.5rem;position: absolute;top: 0.3rem;
    background: #f74c31;color:#fff;border-radius: 50%;" v-text="count" v-show="count!=0"></span>
        </div>
        <h2 class="header-title">个人中心</h2>
        <div class="header-right" @click="combabe('setting')"><img src=../../assets/images/icons/icon-setting.png class="setimg"></div>
      </div>

      <!-- 登陆后显示 -->
      <div class="userInfo" v-show="hotbanner">
        <div class="user-logo">
          <div class="user-logo-img"> <img src="../../assets/images/headPortra.png" ></div>
         <p class="userName" v-text="hotbanner.nickName"></p>
          <p class="userName small" v-text="hotbanner.userName"></p>
        </div>

        <div class="info">
          <p class="zhye" >账户余额</p>
          <p class="balance"  v-text="(hotbanner.safeMoney-0).toFixed(3)"></p>
          <div class="mLevel f28">
            <span>返点 <label class="v-fd-var f18"  v-text="hotbanner.userRate"></label></span>
            <span class="txye">可提现：<span>{{ (hotbanner.canCashMoney-0).toFixed(3)}}</span> <img src="../../assets/images/lottery/question.png" alt="" @click="showhot(hotbanner.cashExplain)"></span>
          </div>
        </div>
      </div>
            <!-- 未登录 -->
        <div class="userInfo"  v-show="tokenshow">
        <div class="user-nologin">
           <div class="user-login">
            <span class="login-left" @click="getloginshow()">账号登录</span>
            <span class="login-line"></span>
            <span class="login-right" @click="getloginshow('mobilelogin')">手机登录</span></div>
        </div>

      </div>
      <div class="notice-tip" @click="combabe('公告')" v-if='hotbanner'>
        <div class="trans f22" v-show="hotbanner.noticeMessage.length>=20" v-text="hotbanner.noticeMessage"></div>
        <div class="transnot f22" v-show="hotbanner.noticeMessage.length<20" v-text="hotbanner.noticeMessage"></div>
      </div>
      <div class="wallet f26">
        <ul>
          <li @click="combabe('voucher')">
            <img src="../../assets/images/icons/icon-cz.png">
            <span>充值</span>
          </li>
          <li @click="combabe('withdraw')">
            <img src="../../assets/images/icons/icon-tx.png">
            <span>提现</span>
          </li>
          <li @click="combabe('transfer')">
            <img src="../../assets/images/icons/icon-zz.png">
            <span>转账</span>
          </li>
        </ul>
      </div>
      <div class="nologin" v-show="tokenshow">
        <div class="nologin-img">
        <img src="../../assets/images/weixin/icon-over.png" alt="">
        </div>
      <div class="logined">登录后，即可查看个人数据，<span @click="getloginshow()">马上就去！</span></div>
    <div class="no-over"></div>
      </div>
    </div>
    <div class="grid-columns f26" v-show="hotbanner">
      <ul v-for="(items,index) in userlist" :key="index">
        <li><div class="columns">
              <span class="columns-title" v-text="items.menuName"></span>
            <ul class="clearfix">
              <li v-for="(item,index) in items.menuChildItems" :key="index" @click="combabe(item.menuName,hotbanner.userType)">
                <img v-bind="{src:item.icoUrl}">
                <span v-text="item.menuName"></span>
                 <span class="vux-badge vux-badge-single" v-show="hotbanner.messageCount!==0&&item.id==9?true:false" v-text="hotbanner.messageCount"></span>
              </li>
            </ul>
          </div></li>
      </ul>
    </div>
     <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
    <div>
      <alert v-model="showAlert"  :content="alertcontent"></alert>
    </div>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
    </div>
  </div>

</template>

<script>
import store from '../../store/index';
export default {

  data() {
    return {
      show: false,
      userlist: [],
      hotbanner: '',
      showlogin: true,
      count: 0,
      showAlert: false,
      alertcontent: '',
      info: '',
      loading: {
        show: false,
        text: '加载中...'
      },
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      showNoData: true,
      tokenshow: false,
    }
  },
  computed: {

  },
  created() {
    this.getcount();
    let token = this.getValue("token");
    if (token) {
      this.getuser();
      if (this.hotbanner) {
        this.tokenshow = true;
        
      }
    } else {
      this.tokenshow = true;
    }
 
  },
  methods: {
    //获取未读消息数量
    getcount() {
      this.unitAjax('post', '/api/userCenter/message/msgUnReadCount', {}, res => {
        if (res.result) {
          this.count = res.data.msgUnReadCount;
        }
      })
    },
    showhot(cashExplain) {
      this.showAlert = true;
      this.alertcontent = cashExplain;
    },
    getuser() {
      let vm = this;
      let userId=this.getValue('userId');
       let token=this.getValue('token');
      if(userId&&token){
         this.loading.show = true;
          this.unitAjax("post", '/api/userCenter/index', {}, res => {
        if (res.result) {
          this.showNoData = false;
          store.state.nickName = res.data.nickName;
          store.state.username = res.data.userName;
          store.state.mobile = res.data.mobile;
          store.state.realname = res.data.realName;
          store.state.userRate = res.data.userRate.substring(0, res.data.userRate.length - 1);
          this.userlist = res.data.userCenterMenusList;
          this.hotbanner = res.data;
          this.loading.show = false;
        } else {
          this.loading.show = false;
          this.showNoData = true;
          if (res.operateCode == 100) {
            this.removeValue({ name: 'token' })
            this.removeValue({ name: 'userId' })
            this.showToast = true;
            this.ToastText = res.msg;
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }
        }); 
      }else{
         this.tokenshow = true;
      }
    
    },
    hide(data) {
      let vm = this;
      //判断是否登录成功
      if (data.islogin) {
        vm.getuser();
      }
      vm.showlogin = data.hide;
    },
    getloginshow(send) {
      store.state.mobilelogin = send;
      this.$router.push('/loginpage')
    },
    combabe(voucher, userType) {
      if (userType == 1) {
        let token = this.getValue("token");
        if (token) {
          switch (voucher) {
            case "游戏记录":
              this.$router.push('gameRecord')
              break;
            case "彩票报表":
              this.$router.push('lotteryRecord')
              break;
            case "充值记录":
              this.$router.push('payRecord')
              break;
            case "提现记录":
              this.$router.push('withdrawRecord')
              break;
            case "团队返点记录":
              this.$router.push('rebateRecord')
              break;
            case "账变记录":
              this.$router.push('billRecord')
              break;
            case "转账记录":
              this.$router.push('transferRecord')
              break;
            case "代理中心":
              this.$router.push('agencycenter')
              break;
            case "开户中心":
              this.$router.push('accountcenter')
              break;
            case "团队管理":
              this.$router.push('teamlist')
              break;
            case "团队报表":
              this.$router.push('teamreport')
              break;
            case "团队游戏记录":
              this.$router.push('teamgameRecord')
              break;
            case "团队充提记录":
              this.$router.push('teampayRecord')
              break;
            case "团队账变记录":
              this.$router.push('teambillRecord')
              break;
            case "客服":
              this.$router.push('')
              break;
            case "公告":
              this.$router.push('noticelist')
              break;
            case "消息":
              this.$router.push('message')
              break;
            case "setting":
              this.$router.push('setting')
              break;
            case "voucher":
              this.$router.push('voucher')
              break;
            case "withdraw":
              this.$router.push('withdraw')
              break;
            case "transfer":
              this.$router.push('transfer')
              break;
          }
        } else {
          this.$router.push('loginpage')
        }
      } else {
        let token = this.getValue("token");
        if (token) {
          switch (voucher) {
            case "游戏记录":
              this.$router.push('gameRecord')
              break;
            case "彩票报表":
              this.$router.push('lotteryRecord')
              break;
            case "充值记录":
              this.$router.push('payRecord')
              break;
            case "提现记录":
              this.$router.push('withdrawRecord')
              break;
            case "返点记录":
              this.$router.push('rebateRecord')
              break;
            case "账变记录":
              this.$router.push('billRecord')
              break;
            case "转账记录":
              this.$router.push('transferRecord')
              break;
            case "客服":
              this.$router.push('')
              break;
            case "公告":
              this.$router.push('noticelist')
              break;
            case "消息":
              this.$router.push('message')
              break;
            case "setting":
              this.$router.push('setting')
              break;
            case "voucher":
              this.$router.push('voucher')
              break;
            case "withdraw":
              this.$router.push('withdraw')
              break;
            case "transfer":
              this.$router.push('transfer')
              break;
            case "代理中心":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "开户中心":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队管理":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队报表":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队游戏记录":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队充提记录":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队账变记录":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
            case "团队返点记录":
              this.showToast = true;
              this.ToastText = '对不起，您不是代理，无法进行查看';
              break;
          }
        } else {
          this.$router.push('/loginpage')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #f7f7f7;
  overflow: hidden;
  padding-bottom: 1.11rem;
  .vux-badge-single {
    width: 0.25rem;
    height: 0.25rem;
    line-height: 0.25rem;
    text-align: center;
    font-size: 0.12rem;
  }
}
.header-positon {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #f7f7f7;
  z-index: 2;
}
.header {
  .header-left {
    img {
      position: relative;
      padding-top: 0.45rem;
    }
  }
  img {
    position: relative;
    width: 0.36rem;
    height: 0.36rem;
  }
  .header-right {
    width: 1.082rem;
    height: 1.082rem;
    top: 0;
    right: 0;
    .setimg {
      padding-top: 0.45rem;
      padding-right: 0.35rem;
      float: right;
    }
  }
}

.userInfo {
  height: 2.6rem;
  background: url("../../assets/images/userinfo-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
  width: 100%;
  padding-top: 0.4rem;
  .user-login {
    margin: 0.8rem auto;
    width: 5rem;
    text-align: center;
    font-weight: 700;
    .login-line {
      border-right: 1px solid white;
      margin: 0 0.5rem;
    }
  }
  .fl {
    float: left;
  }
  .user-logo {
    margin-left: 0.3rem;
    float: left;
    width: 2rem;
    text-align: center;

    .user-logo-img {
      display: flex;
    }
    img {
      border-radius: 100%;
      width: 1.4rem;
      height: 1.4rem;
      margin: 0 auto;
    }
    .userName {
      text-align: center;
      font-size: 0.36rem;
      height: 0.45rem;
      line-height: 0.45rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .small {
      font-size: 0.24rem;
    }
  }
  .info {
    line-height: 0.6rem;
    width: 100%;
    margin-top: 0.2rem;
    .zhye {
      margin-left: 2.5rem;
    }
    .balance {
      font-size: 0.5rem;
      margin-left: 2.5rem;
    }
    .mLevel {
      margin-left: 2.5rem;
      line-height: 1.4rem;
      label {
        vertical-align: middle;
      }
      span {
        width: 40%;
      }
    }
    .txye {
      margin-left: 0.1rem;
      img {
        width: 0.3rem;
        height: 0.3rem;
        vertical-align: middle;
      }
    }
  }
}
.nologin {
  width: 100%;
  font-size: 0.26rem;
  color: #7f8088;
  height: 100%;
  .nologin-img {
    width: 45%;
    margin: 0 auto;
    margin-top: 0.5rem;
  }
  span {
    color: #4584f5;
  }
}
.logined {
  text-align: center;
}
.notice-tip {
  height: 0.55rem;
  color: #fe6d58;
  background: #fff;
  line-height: 0.55rem;
  overflow: hidden;
  .transnot{
    padding-left: .32rem;
  }
  .trans {
    width: 180%;
    animation: mymove 10s infinite linear;
    -webkit-animation: mymove 20s infinite linear; /* Safari 和 Chrome */
    transform: translateZ(0);
  }
  @-webkit-keyframes mymove {
    /*兼容性写法。spin是关键帧的动画名称*/
    from {
      /*动画起始状态*/
      -webkit-transform: translate(60%);
    }
    to {
      /*动画结束状态*/
      -webkit-transform: translate(-100%);
    }
  }
}
.wallet {
  color: #7f8088;
  background: #fff;
  height: 1.5rem;
  width: 100%;
  margin-top: 0.2rem;
  ul li {
    float: left;
    width: 33.33%;
    text-align: center;
    img {
      width: 0.6rem;
      height: 0.6rem;
      padding-top: 0.2rem;
    }

    span {
      display: block;
      line-height: 0.001rem;
      text-align: center;
      padding-top: 0.3rem;
    }
  }
}
.grid-columns {
  width: 100%;
  margin-top: 6.5rem;
  height: auto;
  overflow: hidden;
  ul li {
    /*height: 6.19rem;*/
    background: #fff;
  }
  .gjdl {
    height: 5.79rem;
  }
  .gjzx {
    height: 2.5rem;
  }
}
.columns {
  margin-top: 0.2rem;
  width: 100%;
  color: #7f8088;
  .columns-title {
    display: block;
    height: 0.9rem;
    line-height: 0.9rem;
    border-bottom: 0.001rem solid #e5e5e5;
    width: 100%;
    padding-left: 0.19rem;
    color: #2b304b;
  }
  ul li {
    float: left;
    width: 33.33%;
    text-align: center;
    height: 1.6rem;
    position: relative;
    .vux-badge {
      position: absolute;

      padding: 0;
      width: 0.25rem;
      top: 15%;
      right: 30%;
      background: #f74c31;
      color: #fff;
      font-size: 0.12rem;
      height: 0.25rem;
      line-height: 0.25rem;
      border-radius: 100%;
    }
    img {
      width: 0.5rem;
      height: 0.5rem;
      padding-top: 0.37rem;
    }
    span {
      display: block;
      line-height: 0.001rem;
      text-align: center;
      padding-top: 0.35rem;
    }
  }
  li:nth-child(1),
  li:nth-child(2),
  li:nth-child(3) {
    border-bottom: 0.01rem solid #e5e5e5;
  }
}
</style>
