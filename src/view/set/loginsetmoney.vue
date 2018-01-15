<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">通过登录密码找回</h2>
      </div>
          <div class="jianju">
      登录密码
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">           
          <input  type="password" placeholder="请输入登录密码" v-model="accountPwd" > 
          </div>           
         </div>
          <P class="error" v-text="msg"></P>
         <div class="setok">
             <button @click="getaccountPwd" :class="accountPwd?'active':''">下一步</button>  
         </div>  
        
  </div>
</template>
<script>
export default {
    data() {
        return {  
            accountPwd:'',
            msg:'',
        }
    },
    methods: {
      getaccountPwd(){
        this.unitAjax("post", '/api/userCenter/setUp/checkLoginPwd', {
            password: this.accountPwd},res=>{
            if(res.result){
              if(this.$route.params.goid=='setprobrom'){
                this.$router.push('/setprobrom/false')
              }else{
                  this.$router.push('/restmoneypwd')
              }
             
            }else{
                this.msg=res.msg;
            }
        })
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
    width:90%;
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
  .error{
       color: #fe6d58;
       padding-left: .32rem;
  }
}
</style>

