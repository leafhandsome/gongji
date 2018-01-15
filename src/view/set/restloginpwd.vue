<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">填写新登录密码</h2>
      </div>
      <div class="from setname">  
          <div class="newspwd">新密码</div>      
           <input type="password" placeholder="请输入您要修改的登录密码" v-model="setname" @blur="seterr">  
         </div>
         <div class="from setname"> 
              <div class="newspwd"> 再次输入</div>      
           <input type="password" placeholder="请再次输入您要修改的登录密码" v-model="confirmPwd" @blur="firmPwd">  
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
import store from '../../store/index';
export default {
    data() {
        return {
            setname: '',
            submitBtn: "submitBtn-disable",
            err: '',
            confirmPwd: '',
            showToast: false,
            ToastText: '',
            ToastPosition: '',
        }
    },
    computed: {
        isvalue() {
            return this.setname && this.confirmPwd ? "submitBtn-ativice" : "submitBtn-disable";
        }
    },
    methods: {
        seterr() {
            if (!(/^(\w){6,20}$/.test(this.setname))) {
                this.showToast = true;
                this.ToastText = '请输入密码6-20个字母或数字组合';
            }
        },
        firmPwd() {
            if (this.setname !== this.confirmPwd) {
                this.showToast = true;
                this.ToastText = '两次密码输入不一致';
            }
        },
        setusername() {
            if (this.setname == this.confirmPwd && (/^(\w){6,20}$/.test(this.setname))) {
                //重置登录密码
                this.unitAjax('post', '/api/userCenter/setUp/restLoginPwd', { mobile: store.state.mobile, userName: store.state.username, password: this.setname, confirmPassword: this.confirmPwd }, res => {
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
            } else {
                this.showToast = true;
                this.ToastText = '请输入密码6-20个字母或数字组合';
            }
        }
    }
}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  .newspwd {
    height: 0.8rem;
    line-height: 0.8rem;
    padding-left: 0.34rem;
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

