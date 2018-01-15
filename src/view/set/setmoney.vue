<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title" >{{hasCreateAccountPwd?'修改资金密码':'设置资金密码'}}</h2>
      </div>
      <div class="jianju" >{{hasCreateAccountPwd?'修改资金密码':'设置资金密码'}}
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
              <span v-text="hasCreateAccountPwd?'旧的密码:':'登录密码:'"></span>
          <input  type="password" placeholder="请输入密码" v-model="setold"> 
          </div>      
            <div class="pwd">
              <span >{{hasCreateAccountPwd?'新的密码:':'资金密码:'}}</span>
          <input class="oddpwd" type="password" placeholder="请输入资金密码" v-model="setnew"> 
          </div>
           <div class="pwd">
              <span>再次输入：</span>
          <input class="oddpwd newpwd" type="password" placeholder="请再次输入资金密码" v-model="setnewpwd"> 
          </div>
          
         </div>
          
         <div class="setok">
             <button :class="setold&&setnew&&setnewpwd?'active':''" @click="handleSubmit(hasCreateAccountPwd)">下一步</button>
          
         </div>
            <div class="over" @click="gotowhere(zijin)">
             <span>忘记{{zijin=='true'?'资金':'登录'}}密码</span>
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
export default {
  data() {
    return {
      err: false,
      setold: '',
      setnew: '',
      setnewpwd: '',
      submitBtn: "submitBtn-disable",
      hasCreateAccountPwd: false,
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      zijin: this.$route.params.zijin,
      probrom: this.$route.params.probrom,
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  vuerify: {
    setold: {
      test: /^(\w){6,20}$/,
      message: "请输入密码6-20个字母、数字、下划线"
    },
    setnew: {
      test: /^(\w){6,20}$/,
      message: "请输入密码6-20个字母、数字、下划线"
    },
    setnewpwd: {
      test: /^(\w){6,20}$/,
      message: "请输入密码6-20个字母、数字、下划线"
    }
  },
  computed: {
    errors() {
      return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
    },
    isvalue() {
      return this.setold && this.setnew && this.setnewpwd && this.setnew === this.setnewpwd && this.$vuerify.check() ? "submitBtn-ativice" : "submitBtn-disable";
    }
  },
  created() {
    this.getdilt()
  },
  methods: {

    gotowhere(zijin) {
      if (zijin == 'true') {
        this.$router.push('/fontmoneypwd/' + this.probrom)
      } else {
        this.$router.push('/fondpwd/login')
      }
    },
    getdilt() {
      this.loading.show = true;
      this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {
        if (res.result) {
          this.hasCreateAccountPwd = res.data.hasCreateAccountPwd;
          this.loading.show = false;
        } else {
          if (res.operateCode == 100) {
            this.loading.show = false;
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
          this.loading.show = false;
        }
      })
    },
    handleSubmit(hasCreate) {
      if (this.$vuerify.check()) {
        this.err = true;
        if (this.setnew == this.setnewpwd) {
          if (hasCreate) {
            this.loading.show = true;
            this.unitAjax('post', '/api/userCenter/setUp/editAccountPwd', { oldPwd: this.setold, newPwd: this.setnewpwd, confirmPwd: this.setnewpwd }, res => {
              if (res.result) {
                this.loading.show = false;
                this.$router.replace({ path: '/transfersucess' })
              } else {
                this.showToast = true;
                this.ToastText = res.msg;
                this.loading.show = false;
              }
            })
          } else {
            this.unitAjax("post", '/api/userCenter/setUp/createAccountPwd', { loginPwd: this.setold, newPwd: this.setnewpwd, confirmPwd: this.setnewpwd }, res => {
              this.loading.show = true;
              if (res.result) {
                this.loading.show = false;
                this.$router.replace({ path: '/transfersucess' })
              } else {
                this.showToast = true;
                this.ToastText = res.msg;
                this.loading.show = false;
              }
            });
          }

        } else {
          this.showToast = true;
          this.ToastText = '两次密码输入不一致';
        }

      }    }
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
    p {
      padding-left: 0.32rem;
      color: #ff6b6b;
    }
    .oddpwd {
      margin-top: 0;
    }
    .newpwd {
      width: 70%;
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
    input {
      width: 70%;
      height: 100%;
      border: none;
      padding: 0;
      font-size: 0.26rem;
    }
  }
  .setok {
    margin-top: 1.08rem;
    button {
      display: block;
      width: 6.84rem;
      height: 0.88rem;
      margin: 0 auto;
      border: none;
      font-size: 0.28rem;
      background-color: #ececec;
    }
    .active {
      background-color: rgb(33, 148, 255);
      color: white;
    }
  }
  .over {
    width: 6.84rem;
    margin: 0 auto;
    span {
      padding-top: 0.25rem;
      float: right;
      border: none;
      color: rgb(33, 148, 255);
      font-size: 0.24rem;
    }
  }
}
</style>

