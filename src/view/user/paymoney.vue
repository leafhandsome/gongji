<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">提现详情</h2>
    </div>
    <div class="paytype">
        <div class="zhuan"><span>{{cashFlagName}}</span></div>
        <div class="money">{{cashMoney}}</div>
        <div class="zhuan-ok">{{cashStatus}}</div>
    </div>
    <div class="from">
      <p>提现方式 <label>{{cashFlagName}}</label></p>
      <p v-show="remark!=='null'">收款人 <label>{{remark}}</label></p>
      <p>收款账号 <label>{{cashAccount}}</label></p>
      <p>提现时间 <label>{{createDate}}</label></p>
      <p>订单号 <label>{{cashId}}</label></p>

    </div>
     <div class="divider">如果疑问，请<a href="#">联系客服</a> </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        cashAccount:this.$route.params.cashAccount,
        cashFlagName:this.$route.params.cashFlagName,
        cashMoney:this.$route.params.cashMoney,
        createDate:this.$route.params.createDate,
        remark:this.$route.params.remark,
        userId:this.$route.params.userId,
        cashStatus:this.$route.params.cashStatus,
        cashId:this.$route.params.id
      }
    },
    created(){
      let vm = this;
      if(vm.cashFlagName != '支付宝'){
        vm.cashAccount = vm.cashAccount.split(',')[1]
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container{
    background-color: #F7F7F7;
    .paytype{
      text-align: center;
      background-color: #FFF;
     .zhuan{
       padding-top: .2rem;
       .zhuan-left{
         display: inline-block;
        margin-right: .23rem;
          width: .6rem;
          height: .6rem;
          line-height: .6rem;
          border-radius:100%;
          color: white;
          background-color: #4584F5;
       }
     }
     .money{
       margin: .57rem 0 .49rem;
       font:700 .66rem "微软雅黑";
       color: rgb(63, 69, 87);
     }
     .zhuan-ok{
       color:#33D54E;
     }
    }
    .from{
      padding: 0.5rem 0.32rem 0.5rem 0.32rem;
      background-color: #fff;
      margin-bottom: 0.2rem;
    p{
      font-size: 0.26rem;
      line-height: 0.6rem;
     color: #9EA1B2;
      label{
        float: right;;
        color: #000;
        margin-left: 0.2rem;
      }
    }
  }
  }

</style>
