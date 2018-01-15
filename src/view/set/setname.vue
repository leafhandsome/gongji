<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">修改昵称</h2>
      </div>
      <div class="from setname">       
           <input type="text" placeholder="请输入您要修改的昵称" v-model="setname"  @blur="setnamebulr">  
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
import store from '../../store/index'
export default {
    data() {
        return {
            setname: store.state.nickName,
            submitBtn: "submitBtn-disable",
            err: '',
            showToast: false,
            ToastText: '',
            ToastPosition: '',
        }
    },
    computed: {
        isvalue() {
            return this.setname ? "submitBtn-ativice" : "submitBtn-disable";
        }
    },
    methods: {
        setnamebulr() {
            if (!(/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,20}$/.test(this.setname))) {
                this.showToast = true;
                this.ToastText = '只能输入中文、数字、字母，长度为1-20位。';
            }
        },
        setusername() {
            if (/^[\u4e00-\u9fa5a-zA-Z0-9_]{1,20}$/.test(this.setname) && this.setname !== '') {
                this.unitAjax('post', '/api/userCenter/setUp/editNickName', { nickName: this.setname }, res => {

                    if (res.result) {
                        this.$router.push('transfersucess')
                    } else {
                            this.err = res.msg;
                    }
                })
            } else {
                this.showToast = true;
                this.ToastText = '只能输入中文、数字、字母，长度为1-20位。';
            }
        }
    }
}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  input {
    height: 0.8rem;
    margin-top: 0.2rem;
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

