<template>
    <div class="container">
        <router-link to="/index">
         <div class="tltle">回到首页</div>
         </router-link>
         <div class="logo"><img src="../../assets/images/weixin/loge.png" alt=""></div>
         <div v-show="!replay">
         <div class="content">
               <div class="header-top clearfix">
                   <span @click="gethome" :class="home? ' active':''">账户密码登录</span>
                   <span @click="getlogin" :class="pwd? ' active':''">手机验证码登录</span>
                 </div>
                 <div class="or" v-if="home">
                     <div class="liatom"><img src="../../assets/images/weixin/login/yongfuming.png" alt="">
                     <input class="zhanhao" v-model="userId" type="text" placeholder="请输入账号/已绑定手机号" @blur="userbl" @focus="userfs"></div>
                       <div class="liatom"><img src="../../assets/images/weixin/login/pwd.png" alt="">
                     <input type="password"  v-model="token" placeholder="请输入密码">
                      <router-link to="fondpwd/false">
                     <span class="code-btn">忘记密码</span>
                      </router-link>
                     </div>
                     <div class="nopassword"><input type="checkbox" class="check" name="checkbox" checked='true'   v-model="checkname" @click="getcheck"><span>记住密码</span></div>
                     <div class="err" v-text="err">提示：密码错误！</div>
                     <div class="login" @click="handsome">登录</div>
                 </div>
                 <!-- 手机验证码登录 -->
                 <div class="or ormobile" v-if="pwd">
                     <div class="liatom"><img src="../../assets/images/weixin/login/mobile.png" alt="">
                     <input class="zhanhao" type="number" placeholder="已绑定手机号" v-model="mobile" @blur="init" @focus="mobilefocus" onKeyUp="value=value.replace(/\D/g,'').substring(0,11)"></div>
                       <div class="liatom"><img src="../../assets/images/weixin/login/code.png" alt="">
                     <input  type="number" placeholder="请输入验证码"  v-model="msgcode" onKeyUp="value=value.replace(/\D/g,'').substring(0,7)" @focus="code" @blur="mycode">
                      <p @click="getmobile" class="code-btn" :disabled="!show">
                        <span v-show="show" :class="mobile?'active':''">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </p>
                     </div>
                      <div class="err" v-text="err2">提示：密码错误！</div>
                       <div class="login"  @click="mobilelogin">登录</div>
                 </div>
         </div>
          <div class="replay"  @click="showreplay" v-show="render">
             <img src="../../assets/images/weixin/login/gointo.png" alt="">
             <span>快捷注册</span>
         </div>
         </div>
         <!-- 注册 -->
         <div v-show="replay" >
          <div class="content">
               <div class="header-top place">
                   注册
                 </div>
              <div class="or ormobile">
                         <div class="liatom"><img src="../../assets/images/weixin/login/mobile.png" alt="">
                     <input class="zhanhao" type="number" placeholder="输入手机号" v-model="iphone" @blur="setiphone" @focus="mobilefocus" ></div>
                       <div class="liatom"><img src="../../assets/images/weixin/login/code.png" alt="">
                     <input type="number" placeholder="请输入验证码" v-model="msgCode">
                       <p @click="getiphonecode" class="code-btn" :disabled="!show">
                        <span v-show="show" :class="iphone?'active':''">获取验证码</span>
                        <span v-show="!show" class="count">{{count}} s</span>
                    </p>
                     </div>
                      <div class="err" v-text="err3">提示：密码错误！</div>
                       <div class="login" @click="newslogin">注册</div>
                 </div>
         </div>
          <div class="replay"  @click="showreplay">
             <img src="../../assets/images/weixin/login/gointo.png" alt="">
             <span>已有账户？立即登录</span>
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
import store from '../../store/index';
export default {
    data() {
        return {
            userId: this.getValue('username'),
            token: this.getValue('password'),
            home: true,
            pwd: false,
            replay: false,
            err: '',
            err2: '',
            err3: '',
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
            render: false,
            iphone: '',
            msgCode: '',
            checkname: false,
        }
    },
    watch: {
        userId(newval, oldval) {
            if (newval == '') {
                this.token = '';
                 this.checkname = false;
            } else {
                if (this.getValue('check')) {
                    this.checkname = true;
                }
            }
        }
    },
    created() {
        if (store.state.mobilelogin == 'mobilelogin') {
            this.home = false;
            this.pwd = true;
        }
        if (this.getValue('check')) {
            this.checkname = true;
        }
        this.removeValue({ name: 'userId' })
        this.randed()
    },
    methods: {
        getcheck(vul) {
            setTimeout(() => {
                this.checkname = this.checkname
            }, 0);

        },
        userbl() {
            if (!(/^[a-zA-Z0-9_-]{5,20}$/.test(this.userId))) {
                this.err = '请输入用户名5-20位英文字母或数字'
            }
        },
        userfs() {
            this.err = ''
        },
        // 注册
        newslogin() {
            let vm = this;
            if (/^1\d{10}$/.test(this.iphone)) {
                 this.loading.show = true;
                this.unitAjax('post', '/api/account/register', { mobile: this.iphone, msgCode: this.msgCode }, res => {
                    if (res.result) {
                         this.loading.show = false;
                        vm.setValue({
                            name: "userId",
                            value: res.data.userId,
                        });
                        vm.setValue({
                            name: "token",
                            value: res.data.token,
                        });
                        this.loading.show = false;
                        this.$router.push('/index')
                    } else {
                        this.err3 = res.msg;
                        this.loading.show = false;
                    }
                })
            }
        },
        //注册验证码
        getiphonecode() {
            if (this.iphone) {
                this.loading.show = true;
                this.unitAjax('post', '/api/account/getRegSmsCode', {
                    mobile: this.iphone
                }, res => {
                    if (res.result) {
                        this.loading.show = false;
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
                    } else {
                        this.showToast = true;
                        this.ToastText = res.msg;
                        this.loading.show = false;
                    }
                })
            } else {
                this.err3 = '手机号码不能为空'
            }
        },
        //是否显示注册
        randed() {
            this.unitAjax('post', '/api/home/moduleConfig', {}, res => {
                if (res.result) {
                    this.render = res.data.openStatus;
                }
            })
        },
        //账户登录
        handsome() {
            let vm = this;
            if (/^[a-zA-Z0-9_-]{5,20}$/.test(this.userId) && this.userId && this.token) {
                this.loading.show = true;
                this.unitAjax("post", '/api/account/login', {
                    userName: this.userId,
                    password: this.token
                }, res => {
                    if (res.result) {
                        this.getcheck();
                        vm.setValue({
                            name: "username",
                            value: this.userId,
                        });
                        if (this.checkname) {
                            vm.setValue({
                                name: "password",
                                value: this.token,
                            });
                            vm.setValue({
                                name: "check",
                                value: true,
                            });
                        } else {
                            vm.removeValue({
                                name: "password"
                            });
                            vm.removeValue({
                                name: "check"
                            });
                        }
                        vm.setValue({
                            name: "userId",
                            value: res.data.userId,
                        });
                        vm.setValue({
                            name: "token",
                            value: res.data.token,
                        });
                        this.loading.show = false;
                        this.$router.push('/index')
                    } else {
                        this.err = res.msg;
                        this.errpwd = this.token;
                        this.username = this.userId;
                        this.loading.show = false;
                    }
                });
            } else {
                if (!(/^[a-zA-Z0-9_-]{5,20}$/.test(this.userId))) {
                    this.err = '请输入用户名5-20位英文字母或数字'
                } else {
                    this.err = '请输入账户密码'
                }

            }
        },
        //手机登陆
        mobilelogin() {
            if (/^1\d{10}$/.test(this.mobile)) {
                this.loading.show = true;
                let vm = this;
                this.unitAjax('post', '/api/account/mobileLogin', { mobile: this.mobile, smsCode: this.msgcode, udid: '123' }, res => {
                    if (res.result) {
                        vm.setValue({
                            name: "userId",
                            value: res.data.userId,
                        });
                        vm.setValue({
                            name: "token",
                            value: res.data.token,
                        });
                        this.loading.show = false;
                        this.$router.push('/index')
                    }
                    else {
                        this.err2 = res.msg;
                        this.loading.show = false;
                    }
                })
            }
        },
        getmobile() {

            if (/^1\d{10}$/.test(this.mobile)) {
                this.loading.show = true;
                this.unitAjax('post', '/api/account/getLoginSmsCode', {
                    mobile: this.mobile
                }, res => {
                    if (res.result == false) {
                        this.showToast = true;
                        this.ToastText = res.msg;
                        this.loading.show = false;
                    }
                    if (res.result) {
                        this.loading.show = false;
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
            } else {
                this.err2 = '输入的手机号码不正确'
            }
        },
        showreplay() {
            this.replay = !this.replay;
        },
        gethome() {
            this.home = true;
            this.pwd = false;
            // this.mobile = "";
            // this.msgcode = "";
            this.err2 = '';
        },
        getlogin() {
            // this.userId = "";
            // this.token = "";
            this.pwd = true;
            this.home = false;
            this.err = '';
        },
        mycode() {
            if (this.msgcode == '') {
                this.err2 = '短信验证码不能为空'
            } else {
                this.err2 = ''
            }
        },
        code() {
            if (this.err2 == '短信验证码不正确') {
                this.err2 = ''
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
            this.err3 = ''
        },

        setiphone() {
            if (!(/^1\d{10}$/.test(this.iphone))) {
                this.err3 = "输入的手机号码不正确"
            } else {
                this.err3 = ''
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
  background-image: url("../../assets/images/weixin/loginback.jpg");
  background-size: contain;
  input {
    border: none;
  }
  .tltle {
    color: #fff;
    font-size: 0.3rem;
    padding-left: 0.34rem;
    margin-top: 0.34rem;
  }
  .logo {
    width: 2.05rem;
    margin: 0 auto;
    margin-top: 0.8rem;
  }
  .content {
    border-radius: 0.1rem;
    background-color: #fff;
    width: 5.96rem;
    margin: 0.4rem auto;
    margin-bottom: 0;
    padding: 0.3rem;
    .header-top {
      span {
        float: left;
        margin-left: 0.7rem;
        font-size: 0.3rem;
        color: #9ea1b2;
        height: 0.6rem;
        line-height: 0.6rem;
      }
      .active {
        color: #1a95f2;
        border-bottom: 2px solid #1a95f2;
      }
    }
    .or {
      .liatom {
        height: 0.88rem;
        line-height: 0.88rem;
        margin-top: 0.43rem;
        border-bottom: 1px solid #ecedee;

        img {
          vertical-align: middle;
          width: 0.32rem;
        }
        input {
          vertical-align: middle;
          padding-left: 0.26rem;
          font-size: 0.26rem;
        }
        .code-btn {
          color: #1a95f2;
          float: right;
          padding-right: 0.2rem;
        }
        .zhanhao {
          width: 85%;
        }
      }
      .nopassword {
        margin-top: 0.22rem;
        .check {
          border: 1px solid #b9bbc7;
        }
        input {
          vertical-align: middle;
          background-color: #fff;
        }
        span {
          padding-left: 0.13rem;
          color: #b9bbc7;
        }
      }
      .err {
        font-size: 0.22rem;
        height: 0.65rem;
        line-height: 0.65rem;
        text-align: center;
        color: #fe6d58;
      }
      .login {
        background-color: #1a95f2;
        text-align: center;
        width: 5.22rem;
        margin: 0 auto;
        height: 0.84rem;
        line-height: 0.84rem;
        color: #fff;
        font-size: 0.32rem;
        border-radius: 0.1rem;
      }
    }
  }
  .place {
    font-size: 0.3rem;
    margin-top: 0.2rem;
    text-align: center;
    color: #1a95f2;
  }
  .replay {
    text-align: center;
    margin-top: 0.1rem;
    margin-bottom: 0.3rem;
    img {
      width: 0.31rem;
      vertical-align: middle;
    }
    span {
      color: #fff;
      padding-left: 0.12rem;
    }
  }
}
</style>
