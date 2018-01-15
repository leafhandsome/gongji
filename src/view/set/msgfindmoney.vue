<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">通过短信验证码找回</h2>
      </div>
      <div class="jianju">
        手机号码
      </div>
      <div class="from">
          <div class="pwd oddpwd">
              <button @click="getsmscode" class="code-btn" :disabled="!show">
                <span v-show="show" :class="mobile||iphone?'active':''">发送验证码</span>
                <span v-show="!show" class="count">{{count}} s</span>
             </button>             
          <input v-show="!iphone" type="number" placeholder="请输入手机号码" v-model="mobile" @blur="errmobil"> 
          <span class="mobile" v-text="iphone" v-show="iphone"></span>
          </div>           
         </div>
          <div class="jianju">
       验证码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input  class="input" type="number" placeholder="请输入验证码" v-model="smsCode" > 
          </div>           
         </div>
  
          <p class="error" v-text="msg"></p>
          <p class="error" v-show="!newPwd&&!confirmPwd&&newPwd!==confirmPwd">两次密码输入不一致</p>
         <div class="setok">
             <button  @click="isok" :class="mobile&&smsCode&&$vuerify.check()?'active':''">下一步</button>  
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
            mobile: '',
            smsCode: '',
            newPwd: '',
            confirmPwd: '',
            msg: '',
            showToast: false,
            ToastText: '',
            ToastPosition: '',
            oldmobile:'',
            iphone:store.state.mobile,
        }
    },
    computed: {
        errors() {
            return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
        }
    },
    vuerify: {
        mobile: {
            test: /^1\d{10}$/,
            message: "手机号码错误",
        }
    },
    created(){
        this.getmobile();
    },
    methods: {
        getmobile(){
                  this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {
        if (res.operateCode == 100) {
           this.showToast = true;
          this.ToastText = res.msg;
          setTimeout(() => {
             this.$router.push('/loginpage')
          }, 1000);
        }
        if (res.result) {
          this.mobile = res.data.mobile;
            this.oldmobile=res.data.mobile
        }

      })
        },
        errmobil() {
            if (!(/^1\d{10}$/.test(this.mobile))) {
                this.showToast = true;
                this.ToastText = '手机号码输入错误';
            }
        },
        getsmscode() {
                 if(this.iphone){
                   this.mobile=this.iphone;
                }
             if (this.mobile !==this.oldmobile) { 
                    this.unitAjax('post', '/api/userCenter/setUp/sendBindPhoneSmsCode', { mobile: this.mobile }, res => {
                this.msg = res.msg;

                if (res.result) {
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
        } else{  
            this.unitAjax('post', '/api/account/getLoginSmsCode', { mobile: this.mobile }, res => {
                this.msg = res.msg;
                if (res.result) {
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
            }  
        },
        isok() {
            if (this.$vuerify.check()) {
                   if(this.iphone){
                   this.mobile=this.iphone;
                }
                if (this.mobile !== this.oldmobile) {
                    //绑定手机
                    this.unitAjax('post', '/api/userCenter/setUp/bindPhone', { mobile: this.mobile, smsCode: this.smsCode }, res => {
                        if (res.result) {
                            if(this.$route.params.fineid=='setprobrom'){
                                 this.$router.push('/setprobrom/false')
                            }else{
                                 this.$router.push('/restmoneypwd')
                            }
                            
                        } else {
                            this.showToast = true;
                            this.ToastText = res.msg;
                        }
                    })
                } else {
                    //跳转修改资金密码
                    this.unitAjax('post', '/api/account/mobileLogin', { mobile: this.mobile, smsCode: this.smsCode, udid: '123' }, res => {
                        if (res.result) {
                               if(this.$route.params.fineid=='setprobrom'){
                                 this.$router.push('/setprobrom/false')
                            }else{
                                 this.$router.push('/restmoneypwd')
                            }
                        } else {
                            this.showToast = true;
                            this.ToastText = res.msg;
                        }
                    })
                }

            }
        }
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
      .mobile{
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

