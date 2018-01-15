<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">通过资金密码找回</h2>
      </div>
      <div v-show="!showname">
      <div class="jianju">
       账号
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
             
          <input  type="text" placeholder="请输入您的账号" v-model="setname"> 
          </div>           
         </div>
        </div> 
          <div class="jianju">
      资金密码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input  type="password" placeholder="请输入对应的资金密码" v-model="accountPwd"> 
          </div>           
         </div>
          <P class="error" v-text="msg"></P>
         <div class="setok">
             <button @click="getaccountPwd" :class="setname&&accountPwd?'active':''">下一步</button>  
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
      showname:store.state.username,
      setname:store.state.username,
      accountPwd: '',
      msg: '',
      showToast: false,
      ToastText: '',
      ToastPosition: ''
    }
  },
  
  methods: {

    getaccountPwd() {
      if (this.setname && this.accountPwd) {
        this.unitAjax('post', '/api/account/validFindPwdAccountPwd',
          { userName: this.setname, accountPwd: this.accountPwd }, res => {
            if (res.result) {
              store.state.username = this.setname;
              if (this.$route.params.zhijinid == 'setprobrom') {
                this.$router.push('/setprobrom/false')
              } else {
                this.$router.push('/restloginpwd');
              }

            } else {
              this.showToast = true;
              this.ToastText = res.msg;
            }
          })
      } else {
        this.showToast = true;
        this.ToastText = '账号或密码不能为空';
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
      width: 90%;
      height: 100%;
      border: none;
      padding: 0;
      font-size: 0.26rem;
    }
  }
  .setok {
    margin-top: 1.07rem;
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
    color: #fe6d58;
    padding-left: 0.32rem;
  }
}
</style>

