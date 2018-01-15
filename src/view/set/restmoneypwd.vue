<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">填写新资金密码</h2>
      </div>
      <div class="from setname">
          <div class="newspwd">新密码</div> 
               
           <input type="password" placeholder="请输入您要修改的资金密码" v-model="setname" >  
         </div>
         <div class="from setname">
             <div class="newspwd"> 再次输入</div>
                      
           <input type="password" placeholder="请再次输入您要修改的资金密码" v-model="confirmPwd" @blur="firmPwd">  
         </div>
         <p class="error" v-text="err"></p>
         <div class="setok" >
             <button :class="isvalue" @click="setusername"> 确定</button>
         </div>
                  <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div> 
  </div>
</template>
<script>
export default {
    data() {
        return {
            setname: '',
            submitBtn: "submitBtn-disable",
            err: '',
            confirmPwd: '',
            showToast: false,
            ToastText: '',
            ToastPosition: ''
        }
    },
    computed: {
        isvalue() {
            return this.setname&&this.confirmPwd? "submitBtn-ativice" : "submitBtn-disable";
        }
    },
    methods: {
        firmPwd() {
            if (this.setname !== this.confirmPwd) {
                this.showToast = true;
                this.ToastText = '两次密码输入不一致';
            }
        },
        setusername() {
            if (this.setname == this.confirmPwd) {
                this.unitAjax('post', '/api/userCenter/setUp/restAccountPwd', { newPwd: this.setname, confirmPwd: this.confirmPwd }, res => {
                    if (res.result) {
                        this.$router.push('transfersucess')
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
  .newspwd{
      height: .8rem;
      line-height: .8rem;
     padding-left: .34rem;
  }
  input {
    height: 0.8rem;
    border: none;
    width: 100%;
    font-size: 0.24rem;
    padding-left: 0.31rem;
  }
  .setok {
    margin-top: 0.6rem;
    button {
      display: block;
      width: 90%;
      height: 0.8rem;
      margin: 0 auto;
      border: none;
    }
  }
  .error {
    padding-left: 0.32rem;
    color: #ff6b6b;
  }
}
</style>

