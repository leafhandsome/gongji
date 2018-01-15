<template>
  <div class="login">
    <div class="tishi"></div>
    <div class="kuan-bindmobil">
      <div class="del" @click="isshow"><img src="../../assets/images/weixin/icon-del.png" alt=""></div>
      <div class="header-bind">
        <img src="../../assets/images/weixin/gongji.png" alt="">
      </div>
      <div class="kuan-text"><span @click="gethome" :class="home? 'login active':'login'">账号登录</span>
        <span @click="getlogin" :class="pwd? 'login active':'login'" >手机登录</span>
      </div>
      <!-- 账号登陆 -->
      <form action="" class="form-content" v-if="home">
        <div class="text-photo"> <input type="text" placeholder="账号/手机号" v-model="userId" class="inputname"></div>
        <div class="text-pwd"> <input type="password" placeholder="密码" v-model="token" class="inputphone">
          <router-link to="fondpwd/false">
            <span>忘记密码</span>
          </router-link>
        </div>
        <ul class="errheight">
          <li v-show="!$vuerify.check()&&userId">{{$vuerify.check()?'':'提示：账号不符合规则'}}</li>
          <li v-text="err" v-show="username==userId&&token==errpwd?err:''"></li>
        </ul>
        <div @click="handsome" :class="userId&&token&&$vuerify.check()?'text-true thisok':'text-true thisshow'"><span></span></div>
      </form>
      <!-- 手机登陆 -->
      <form action="" class="form-content" v-if="pwd">
        <div class="text-photo"> <input type="number" placeholder="手机号码" v-model="mobile" @blur="init" @focus="mobilefocus" onKeyUp="value=value.replace(/\D/g,'').substring(0,11)"></div>
        <div class="text-pwd"> <input type="number" placeholder="验证码" v-model="msgcode" onKeyUp="value=value.replace(/\D/g,'').substring(0,7)" @focus="code" @blur="mycode">
          <p @click="getmobile" class="code-btn" :disabled="!show">
            <span v-show="show" :class="mobile?'active':''">发送验证码</span>
            <span v-show="!show" class="count">{{count}} s</span>
          </p>
        </div>
        <ul class="errheight">
          <li v-text="err2" v-show="true"></li>
        </ul>
        <div @click="mobilelogin" :class="mobile&&msgcode?'text-true thisok':'text-true thisshow'"><span></span></div>
      </form>
      <div class="orther-login">
        <div class="orther"> 第三方登陆</div>
        <div class="orther-img">
          <img src="../../assets/images/icons/wacthfriend.png" alt="">
          <img src="../../assets/images/icons/qqfriend.png" alt="">
        </div>
      </div>
    </div>
     <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
    </div>
  </div>
</template>

<script>
  const TIME_COUNT = 60;
  export default {
    props:['send'],
    data() {
      return {
        err: '',
        err2:'',
        home: !this.send,
        pwd: this.send,
        userId: "",
        token: "",
        islogin: false,
        blu: false,
        errpwd: '',
        username: '',
        mobile: '',
        msgcode: '',
        show: true,
        count: '',
        timer: null,
        showToast: false,
        ToastText: '',
        ToastPosition: '',
          loading: {
          show: false,
          text: '加载中...'
        },
      }
    },
    vuerify: {
      userId: {
        test: /^[a-zA-Z0-9_-]{5,20}$/, // 自定义规则，可以是函数，正则或者全局注册的规则（填字符串）
        message: "请输入用户名5-20位英文字母或数字"
      }
    },
    computed: {
      errors() {
        return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
      },
    },
    mounted () {
      
    },
    methods: {
      mycode(){
        if(this.msgcode==''){
          this.err2='短信验证码不能为空'
        }else{
          this.err2 = ''
        }
      },
      code(){
        if(this.err2=='短信验证码不正确'){
          this.err2=''
        }
      },
      init() {
        if (!(/^1\d{10}$/.test(this.mobile))) {
          this.err2 = "输入的手机号码不正确"
        } else {
          this.err2 = ''
        }
      },
      mobilefocus() {
        this.err2 = ''
      },
      //手机登陆
      mobilelogin() {
       if (/^1\d{10}$/.test(this.mobile)) {
      this.loading.show=true;
      let vm= this;
        this.unitAjax('post', '/api/account/mobileLogin', { mobile:this.mobile,smsCode:this.msgcode,udid:'123'}, res => {
              if (res.result) {
              vm.setValue({
                name: "userId",
                value: res.data.userId,
              });
              vm.setValue({
                name: "token",
                value: res.data.token,
              });
              vm.islogin = true;
              vm.isshow();
              this.loading.show=false;
            }
         else  {
            this.err2 = res.msg;
             this.loading.show=false;
          }
        })
       }
      },
      getmobile() {
        this.unitAjax('post','/api/account/getLoginSmsCode', {
          mobile: this.mobile
        }, res => {
          if (res.result == false) {
            this.showToast = true;
            this.ToastText = res.msg;
            this.loading.show=false;
          }
          if (res.result) {
            this.loading.show=false;
            //倒计时
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.show = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.show = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000)
            }
          }
        })
      },
      gethome() {
        this.home = true;
        this.pwd = false;
        this.userId = ""
        this.token = ""
      },
      getlogin() {
        this.userId = "";
        this.token = "";
        this.pwd = true;
        this.home = false;
      },
      handsome() {
        let vm = this;
        if (this.$vuerify.check()) {
          this.loading.show=true;
          this.unitAjax("post", '/api/account/login', {
            userName: this.userId,
            password: this.token
          }, res => {
            if (res.result == false) {
              this.err = res.msg;
              this.errpwd = this.token;
              this.username = this.userId;
              this.loading.show=false;
            }
            if (res.result) {
              vm.setValue({
                name: "userId",
                value: res.data.userId,
              });
              vm.setValue({
                name: "token",
                value: res.data.token,
              });
              vm.islogin = true;
              vm.isshow();
              this.loading.show=false;
            }
          });
        }
      },
      isshow() {
        let vm = this;
        let parmar = {};
        parmar.hide = false;
        parmar.islogin = vm.islogin
        vm.$emit('hideresult', parmar);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tishi {
    width: 100%;
    height:100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
  }

  .header-bind {
    padding-top: 0.17rem;
    img {
      width: 1.67rem;
      height:1.67rem;
      margin:0 auto;
    }
  }

  .active {
    color: rgb(83, 204, 253);
    border-bottom: 1px solid rgb(83, 204, 253);
  }

  .kuan-bindmobil {
    opacity: 1;
    width: 80%;
    text-align: center;
    background-color: white;
    border-radius: 10px;
    color: #caccd4;
    position: fixed;
    left: 10%;
    top: 20%;
    z-index: 1001;
    .del {
      position: absolute;
      top: -0.8rem;
      right: 0;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      color: white;
    }
    .kuan-text {
      margin-top: 0.26rem;
      color: rgb(158, 161, 178);
      span {
        margin: 0 0.33rem;
        display: inline-block;
        font-size: 0.26rem;
        font-weight: 700;
        width: 1.2rem;
        height: 0.58rem;
      }
    }
    .form-content {
      .errheight {
        height: .54rem;
        border: none;
      }
      li {
        height: 0.64rem;
        font-size: 0.22rem;
        line-height: 0.64rem;
        color: #fe6d58;
      }
      .error {
        font-size: 0.24rem;
        color: #fe6d58;
      }
      input {
        border: none;
        height: 0.76rem;
      }
      div {
        width: 4.92rem;
        height: 0.86rem;
        line-height: 0.86rem;
        margin: 0 auto;
        box-shadow: 0 0 10px #f4f4f4;
        border-radius: 1rem;
        border: 1px solid #f4f4f4;
      }
      .text-photo {
        margin-top: 0.37rem;
        width: 4.92rem;
        text-align: left;
        padding-left: 0.4rem;
        input {
          font-size: 0.24rem;
          width: 90%;
        }
      }
      .text-pwd {
        width: 5.32rem;
        margin-top: 0.23rem;
        input {
          font-size: 0.24rem;
          float: left;
          width: 54%;
          margin-left: 0.4rem;
        }
       span {
          float: right;
          padding: 0;
          border: none;
          height: 0.84rem;
          line-height: 0.86rem;
          background-color: white;
          color: rgb(83, 204, 253);
          margin-right: 0.3rem;
        }
      }
      p {
        text-align: center;
      }
      .text-true {
        width: 0.9rem;
        height: 0.9rem;
        margin-top: 0.03rem;
        border-radius: 50%;
        border: none;
        color: #fff;
        font-size: 0.26rem;
        position: relative;
      }
      .thisshow {
        background-color: #a4a4a4;
        box-shadow: 0 0 10px #a4a4a4;
        span:after {
          content: " ";
          display: inline-block;
          height: 0.15rem;
          width: 0.15rem;
          border-width: 0.04rem 0.04rem 0 0;
          border-color: white;
          border-style: solid;
          transform: rotate(45deg);
          position: absolute;
          top: 40%;
          left: 35%;
        }
      }
      .thisok {
        background-color: #53ccfd;
        box-shadow: 0 0 10px #53ccfd;
        span:after {
          content: " ";
          display: inline-block;
          height: 0.16rem;
          width: 0.3rem;
          border-width: 0.04rem 0.04rem 0 0;
          border-color: white;
          border-style: solid;
          transform: rotate(130deg);
          position: absolute;
          top: 35%;
          left: 33%;
        }
      }
    }
    .orther-login {
      width: 4.72rem;
      margin: 0 auto;
      margin-top: 0.26rem;
      position: relative;
      border-top: 1px solid #f4f4f4;
      .orther-img {
        padding-bottom: 0.11rem;
        img {
          padding: 0.35rem 0.42rem;
          width: 0.73rem;
        }
      }
      .orther {
        position: absolute;
        top: -0.13rem;
        left: 50%;
        transform: translate(-50%);
        z-index: 700;
        width: 1.5rem;
        height: 0.26rem;
        text-align: center;
        font-size: 0.24rem;
        line-height: 0.26rem;
        background-color: white;
      }
    }
  }
  input{
    outline: none;
  }
</style>
