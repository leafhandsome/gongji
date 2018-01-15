<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">绑定手机</h2>
      </div>
      <div v-show="oldphone">
        
          <div class="mobil" >
            <span>您已绑定手机</span>
            <br>
            <span class="num-mobile"> {{toTel(mobile)}}</span>
          
            
            </div>
            <div class="setok" >
             <button class="active" @click="setbind(false)">更换绑定手机</button>
         </div>
      </div>     
      <div v-show="!oldphone">
        <div v-show="!shownext">
         <div class="jianju">
        旧手机号码
      </div>
          <div class="from" > 
          <div class="pwd oddpwd active">
           <input v-model="mobile" class="active-i" type="number" readonly>
            <button @click="getmobile" class="code-btn" :disabled="!show">
                <span v-show="show" :class="mobile?'active':''">发送验证码</span>
                <span v-show="!show" class="count">{{count}} s</span>
             </button>
          </div>           
         </div>
             <div class="jianju">
       旧手机验证码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input class="input" type="number" placeholder="请输入旧的手机验证码" v-model="oldnum"> 
          </div>           
         </div>
          <div  class="setok">
             <button  @click="gotonext" :class="mobile&&oldnum?'active':''">下一步</button>  
         </div>
         </div>
         <div v-show="shownext">
      <div class="jianju">
        手机号码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
               <button @click="getnum" class="code-btn" :disabled="!shownew">
                <span v-show="shownew" :class="setname?'active':''">发送验证码</span>
                <span v-show="!shownew" class="count">{{countnew}} s</span>
             </button>
          <input  type="text" placeholder="请输入手机号码" v-model="setname" onKeyUp="value=value.replace(/\D/g,'').substring(0,11)" @focus="getfocus" @blur="init"> 
          </div>           
         </div>
       
          <div class="jianju">
       验证码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input class="input" type="number" placeholder="请输入验证码" v-model="setpwd"> 
          </div>           
         </div>
       <p class="error" v-text="msg"></p>
         <div  class="setok">
             <button  @click="isok" :class="setname&&setpwd&&$vuerify.check()?'active':''">绑定</button>  
         </div>
         </div> 
        </div> 
          <confirm v-model="showacout" show-input title="请输入资金密码" @on-confirm="onConfirm" @on-show="onshow">
        </confirm>
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

  data() {
    return {
      oldphonenum: '',
      oldnum: '',
      setname: '',
      setpwd: '',
      hasBindPhone: false,
      oldphone: false,
      mobile: '',
      msg: '',
      show: true,
      shownew: true,
      count: '',
      timer: null,
      countnew: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      shownext: true,
      loading: {
        show: false,
        text: '加载中...'
      },
      showacout: false,
    }
  },
  computed: {
    errors() {
      return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
    }
  },
  vuerify: {
    setname: {
      test: /^1\d{10}$/,
      message: "手机号码不正确",
    }
  },
  created() {
    this.getsetting()
  },
  methods: {
    setbind(vul) {
      this.showacout = true;
        this.shownext = vul;
    },
    onConfirm: function (val) {
         if(/^(\w){6,20}$/.test(val)){
      this.unitAjax('post', '/api/userCenter/setUp/deleteAlipayAccount', { accountPwd: val }, res => {
        if (res.result) {
          this.oldphone = false
        } else {
          this.showToast = true;
          this.ToastText = res.msg; 
        }
      })
       }else{
           this.showToast = true;
          this.ToastText = '请输入资金密码6-20个字母和数字';
      }
    },
    //下一步更改绑定手机
    gotonext() {
      if (/^1\d{10}$/.test(this.mobile) && this.smsCode !== '') {
        this.unitAjax('post', '/api/account/validFindPwdSmsCode', { mobile: this.mobile, smsCode: this.oldnum }, res => {
          if (res.result) {
            this.shownext = true;

          } else {
            this.showToast = true;
            this.ToastText = res.msg;
          }
        })
      }
    },
    init() {
      if (!(/^1\d{10}$/.test(this.setname))) {
        this.msg = "请输入正确的手机号码"
      } else {
        this.msg = ''
      }
    },
    getfocus() {
      this.msg = '';
    },

    getsetting() {
      this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {
        if (res.result) {
          this.hasBindPhone = res.data.hasBindPhone;
          this.oldphone = res.data.hasBindPhone;
          this.mobile = res.data.mobile;
        } else {
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

      })
    },
    getmobile() {
      this.loading.show = true;
      this.unitAjax('post', '/api/userCenter/setUp/getEditPhoneSmsCode', {}, res => {
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
    },
    getnum() {
      if (/^1\d{10}$/.test(this.setname)) {
        this.loading.show = true;
        this.unitAjax('post', '/api/userCenter/setUp/sendBindPhoneSmsCode', { mobile: this.setname }, res => {
          if (res.result) {
            this.loading.show = false;
            //倒计时
            if (!this.timernew) {
              this.countnew = TIME_COUNT;
              this.shownew = false;
              this.timernew = setInterval(() => {
                if (this.countnew > 0 && this.countnew <= TIME_COUNT) {
                  this.countnew--;
                } else {
                  this.shownew = true;
                  clearInterval(this.timernew);
                  this.timernew = null;
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
    },
    isok() {
      if (this.$vuerify.check()) {
        this.loading.show = true;
        if (this.hasBindPhone == false) {
          this.unitAjax('post', '/api/userCenter/setUp/bindPhone', { mobile: this.setname, smsCode: this.setpwd }, res => {
            if (res.result) {
              this.loading.show = false;
              this.$router.push('transfersucess')
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
        } else {
          this.unitAjax('post', '/api/userCenter/setUp/editPhone', { oldSmsCode: this.oldnum, newMobile: this.setname, newSmsCode: this.setpwd }, res => {

            if (res.result) {
              this.loading.show = false;
              this.$router.push('transfersucess')
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
  }
}

</script>
<style lang="scss" scoped>
.container {
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
      input {
        float: left;
        padding-left: 0.31rem;
      }
      span {
        margin: 0.1rem;
        float: right;
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
      .active-t {
        width: 2.5rem;
        background-color: #007aff;
        color: white;
      }
      .active-i {
        width: 50%;
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
      padding-left: 0.32rem;
    }
    .input {
      width: 90%;
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
  .tishi {
    width: 100%;
    height: 13.14rem;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 555;
    top: 0;
    .kuan {
      width: 5.4rem;
      height: 2.24rem;
      margin: 0 auto;
      margin-top: 3.4rem;
      text-align: center;
      background-color: white;
      border-radius: 10px;
      .kuan-text {
        height: 1.6rem;
        line-height: 1.6rem;
        opacity: 1;
        font-size: 0.34rem;
        color: black;
        border-bottom: 1px solid #d9d9d9;
      }
      .kuan-ture {
        width: 50%;
        float: left;
        border-right: 1px solid #d9d9d9;
        color: #007aff;
      }
      .kuan-false {
        width: 50%;
        float: right;
        color: #007aff;
      }
    }
  }
  .mobil {
    margin-top: 0.2rem;
    height: 2rem;
    line-height: 1rem;
    text-align: center;
    background-color: white;
    .num-mobile {
      font-size: 0.36rem;
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

