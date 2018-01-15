<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">卡密支付</h2>
    </div>

    <div class="paymain">
     <div class="title"><span>请输入卡号和密码</span></div>
     <div class="inputText" >
        <span>卡号</span>
        <input type="number" placeholder="请输入卡号" v-model="cardno">
     </div>
      <div class="inputText passwordInput" >
        <span>密码</span>
        <input type="password" placeholder="请输入密码" v-model="password">
      </div>
      <div class="submitBtn" :class="isvalue">
         <p>确定</p>
      </div>
    </div>
  </div>
</template>


<script>
  export  default {
    data(){
      return{
        cardno :'',
        password:'',
        submitBtn:"submitBtn-disable"
      }
    },
    computed:{
      isvalue(){
        return  (this.cardno && this.password)?"submitBtn-ativice":"submitBtn-disable";
      }
    },
    methods:{

    }
  }

</script>
<style lang="scss" scoped>
  .paymain{
    background: #F7F7F7;
    .title{
      background: #F7F7F7;
      height: 0.65rem;
      padding-left: 0.35rem;
      span{
        font-size: 0.24rem;
        color: #9EA1B2;
        display: block;
        line-height: 0.65rem;
      }
    }
    .inputText{
      height: 0.92rem;
      line-height: 0.92rem;
      background: #fff;
      padding-left: 0.32rem;
      input{
        height: 0.8rem;
        background: #fff;
        width: 80%;
        border: 0;
        font-size: 0.24rem;
        padding-left: 0.32rem;
      }
    }
  .passwordInput{
    margin-top: 0.2rem;
  }
  }

</style>
