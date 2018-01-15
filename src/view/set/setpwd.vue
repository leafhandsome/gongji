<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">修改登录密码</h2>
      </div>
      <div class="jianju">
          请输入6-20位英文或数字组合
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
              <span>旧的密码：</span>
          <input  type="password"  placeholder="请输入旧的密码" v-model="setname" @blur="seterr" @focus="setpwderr"> 
          </div>      
            <div class="pwd">
              <span>新的密码：</span>
          <input class="oddpwd" type="password" placeholder="请输入新的密码" v-model="setpwd" @blur="seterr2" @focus="setpwderr2"> 
          </div>
           <div class="pwd">
              <span>再次输入：</span>
          <input class="oddpwd mspwd" type="password" placeholder="请再次输入新的密码" v-model="setnewpwd" @focus="setpwderr3"> 
          </div>
          <p v-show="setpwd!==setnewpwd&&err">两次密码输入不一致</p>
           <ul class="error" v-show="error"><li v-text="$vuerify.$errors.setname"></li></ul>
           <ul class="error" v-show="error2"><li v-text="$vuerify.$errors.setpwd"></li></ul>
         </div>
         <div class="setok">
             <button :class="setname&&setpwd&&setnewpwd?'active':''" @click="handleSubmit">确定</button>
          
         </div>
         <router-link to="fondpwd/true">
            <div class="over">
             <span>忘记登录密码</span>
         </div>
         </router-link>
       <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div> 
  </div>
</template>
<script>
export default {
  data() {
    return {
      err: false,
      setname: '',
      setpwd: '',
      setnewpwd: '',
      submitBtn: "submitBtn-disable",
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      error: false,
      error2: false,
    }
  },
  vuerify: {
    setname: {
      test: /^(\w){6,20}$/,
      message: "请输入旧密码6-20个字母或数字组合"
    },
    setpwd: {
      test: /^(\w){6,20}$/,
      message: "请输入新密码6-20个字母或数字组合"
    },

  },
  computed: {

    isvalue() {
      return this.setname && this.setpwd && this.setnewpwd && this.setpwd == this.setnewpwd && this.$vuerify.check() ? "submitBtn-ativice" : "submitBtn-disable";
    }
  },
  methods: {
    setpwderr3() {
      this.err =''
    },
    seterr3() {
      this.err= '两次密码输入不一致'
    },
    setpwderr() {
      this.error =false
    },
    seterr() {
      this.error = true
    },
        setpwderr2() {
      this.error2 =false
    },
    seterr2() {
      this.error2= true
    },
    handleSubmit() {
      if (this.$vuerify.check()) {
        this.err = true;
        if (this.setpwd == this.setnewpwd) {
          //发送请求
          this.unitAjax('post', '/api/userCenter/setUp/changeLoginPwd', { oldPwd: this.setname, newPwd: this.setpwd, confirmPwd: this.setnewpwd }, res => {
            if (res.result) {
              let user = this.removeValue({ name: 'userId' });
              let toke = this.removeValue({ name: 'token' });
              this.showToast = true;
              this.ToastText = '修改成功！';
              setTimeout(() => {
                this.$router.push('/loginpage')
              }, 1000);

            } else {
              this.showToast = true;
              this.ToastText = res.msg;
            }

          })
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
    .mspwd {
      width: 60%;
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
    margin-top: 1.68rem;
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
  .error {
    padding-left: 0.32rem;
    color: #ff6b6b;
  }
}
</style>

