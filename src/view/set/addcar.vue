<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">添加银行卡</h2>
      </div>
      <div class="jianju">
          请绑定持卡人本人银行卡
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
              <span>真实姓名：</span>
          <input v-show="!realname" type="text" placeholder="请输入姓名" v-model="realName" @blur="getrealName"> 
          <span class="realname" v-show="realname">{{realname}}</span>
          </div>      
            <div class="pwd">
              <span>银行名称：</span>
          <input class="oddpwd" type="text" placeholder="请输入银行名称" v-model="bankName" > 
          </div>
           <div class="pwd">
              <span>开户网点：</span>
          <input class="oddpwd" type="text" placeholder="请输入网点名称（选填）" v-model="branchName" > 
          </div>
             <div class="pwd">
              <span>银行卡号：</span>
          <input class="oddpwd" type="number" placeholder="请输入银行卡号" v-model="bankNo" maxlength="30" minlength="16" onkeyup="value=value.replace(/[^\d]/g,'')"> 
          </div>
              <div class="pwd">
              <span>再次输入：</span>
          <input class="oddpwd" type="number" placeholder="请再次输入银行卡号" v-model="setnewpwd" @blur="err" onkeyup="value=value.replace(/[^\d]/g,'')"> 
          </div>
            <div class="pwd">
              <span>资金密码：</span>
          <input class="oddpwd" type="password" placeholder="请输入资金密码" v-model="accountPwd" > 
          </div>
         </div>
         <div class="setok">
             <button :class="(realName||realname)&&bankName&&bankNo&&accountPwd&&setnewpwd?'active':''" @click="addbankcar">确认</button>         
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
      realName: '',
      bankName: '',
      branchName: '',
      bankNo: '',
      accountPwd: '',
      setnewpwd: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      realname:store.state.realname,
    }
  },
  methods: {
    getrealName() {
      if (!(/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/.test(this.realName))) {
        this.showToast = true;
        this.ToastText = '只能输入中文、英文和数字1-5位';
      }
    },
    err() {
      if (this.bankNo !== this.setnewpwd) {
        this.showToast = true;
        this.ToastText = '两次密码输入不一致';
      }
    },
    addbankcar() {
      if (this.setnewpwd == this.bankNo) {
        if(this.realname){
          this.realName=store.state.realname;
        }
        this.unitAjax('post', '/api/userCenter/setUp/saveUserBank',
          { bankName: this.bankName, branchName: this.branchName, bankNo: this.bankNo, realName: this.realName, accountPwd: this.accountPwd }, res => {
         
            if (res.result) {
              store.state.realname=this.realName;
              this.$router.go(-1)
            } else {
              this.showToast = true;
              this.ToastText = res.msg;
            }
          })
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
    .realname{
      padding-left: 0;
    }
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
      color: rgb(202, 204, 212);
      background-color: #ececec;
    }
    .active {
      background-color: rgb(33, 148, 255);
      color: white;
    }
  }
}
</style>

