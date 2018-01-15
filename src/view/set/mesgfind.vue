<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">通过短信验证码找回</h2>
      </div>
      <div>
      <div class="jianju">
        手机号码
      </div>
      <div class="from">
          <div class="pwd oddpwd">
              <button @click="getsmscode" class="code-btn" :disabled="!show">
                <span v-show="show" :class="setname||mobile?'active':''">发送验证码</span>
                <span v-show="!show" class="count">{{count}} s</span>
             </button>             
          <input v-show="!mobile" type="text" placeholder="请输入手机号码" v-model="setname" > 
          <span class="mobile" v-text="mobile" v-show="mobile"></span>
          </div>           
         </div>
          <div class="jianju">
       验证码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input  class="input" type="text" placeholder="请输入验证码" v-model="smsCode" > 
          </div>           
         </div>
          <div class="setok">
             <button  @click="isshownext" :class="setname&&smsCode&&$vuerify.check()?'active':''">下一步</button>  
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
            show: true,
            count: '',
            timer: null,
            setname: '',
            mobile: store.state.mobile,
            smsCode: '',
            newPwd: '',
            confirmPwd: '',
            msg: '',
            showToast: false,
            ToastText: '',
            ToastPosition: '',
            loading: {
                show: false,
                text: '加载中...'
            },
        }
    },
    computed: {
        errors() {
            return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
        }
    },
    vuerify: {
        setname: {
            test: /^1(3|4|5|7|8)\d{9}$/,
            message: "手机号码错误",
        }
    },
    methods: {
        isshownext() {
            if (this.$vuerify.check()) {
                if (this.mobile) {
                    this.setname = this.mobile;
                    this.unitAjax('post', '/api/account/validFindPwdSmsCode', { mobile: this.setname, smsCode: this.smsCode }, res => {
                        if (res.result) {
                            store.state.mobile = this.setname;
                            this.$router.push('/restloginpwd');
                        } else {
                            this.showToast = true;
                            this.ToastText = res.msg;
                        }
                    })
                } else {
                    //绑定手机
                    this.unitAjax('post', '/api/userCenter/setUp/bindPhone', { mobile: this.setname, smsCode: this.smsCode }, res => {
                        if (res.result) {
                            this.loading.show = false;
                             store.state.mobile = this.setname;
                            this.$router.push('/restloginpwd')
                        } else {
                            this.showToast = true;
                            this.ToastText = res.msg;
                            this.loading.show = false;
                            if (res.operateCode == 100) {
                                this.removeValue({ name: 'token' })
                                this.removeValue({ name: 'userId' })
                                setTimeout(() => {
                                    this.$router.push('/loginpage')
                                }, 1000);
                            }
                        }
                    })
                }

            }

        },
        getsmscode() {
            if (this.$vuerify.check() || this.mobile) {
                 this.loading.show=true;
                if (this.mobile) {
                    this.setname = this.mobile;
                    this.unitAjax('post', '/api/account/getFindPwdSmsCode', { mobile: this.setname }, res => {
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
                            if (res.operateCode == 100) {
                                this.removeValue("token");
                                this.removeValue("userId");
                                setTimeout(() => {
                                    this.$router.push('/loginpage')
                                }, 1000);
                            }
                        }
                    })
                } else {
                    //绑定手机的验证码
                    this.unitAjax('post', '/api/userCenter/setUp/sendBindPhoneSmsCode', { mobile: this.setname }, res => {
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
                            this.loading.show = false;
                            this.showToast = true;
                            this.ToastText = res.msg;
                        }
                    })
                }

            } else {
                this.showToast = true;
                this.ToastText = '手机号码不合法';
            }
        },
    }
}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  .jianju {
    height: 0.66rem;
    line-height: 0.66rem;
    font-size: 0.24rem;
    color: rgb(158, 161, 178);
    padding-left: 0.32rem;
  }
  .from {
    .oddpwd {
      margin-top: 0;
      .mobile {
        background-color: #fff;
      }
      input {
        float: left;
        padding-left: 0.31rem;
      }
      .input {
        width: 90%;
      }
      span {
        margin: 0.1rem;
        display: inline-block;
        width: 1.92rem;
        height: 0.71rem;
        font-size: 0.26rem;
        line-height: 0.71rem;
        color: rgb(202, 204, 212);
        background-color: #ececec;
      }
      .active {
        background-color: #007aff;
        color: white;
      }
    }
  }

  .pwd {
    background-color: white;
    height: 0.92rem;
    text-decoration: 0.02rem;
    line-height: 0.92rem;
    margin-top: 0.2rem;
    span {
      text-align: center;
      margin-left: 0.32rem;
    }
    input {
      width: 60%;
      height: 100%;
      border: none;
      padding: 0;
      font-size: 0.26rem;
    }
  }
  .setok {
    margin-top: 1.74rem;
    button {
      display: block;
      width: 6.84rem;
      height: 0.88rem;
      margin: 0 auto;
      border: none;
      font-size: 0.28rem;
      color: rgb(202, 204, 212);
      background-color: #ececec;
    }
    .active {
      background-color: #007aff;
      color: white;
    }
  }
  .error {
    padding-left: 0.32rem;
    color: #ff6b6b;
  }
  .code-btn {
    border: none;
    background-color: white;
    padding: 0;
    float: right;
  }
}
</style>

