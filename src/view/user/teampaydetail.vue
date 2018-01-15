<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">团队充提详情</h2>
    </div>

    <div class="paytype">
        <div class="zhuan">
        <!-- <span class="zhuan-left"><img src="../../assets/images/icons/icon-zfb.png" alt=""></span> -->
        <span v-text="showName">支付宝</span></div>
        <div class="money" v-text="money">5600.0</div>
        <div class="zhuan-ok" v-text="status">用户撤单</div>
    </div>
    <div class="from">
      <p>充提方式 <label v-text="showName">0.27</label></p>
      <p>充提账户 <label v-text="userName">0.27</label></p>
      <p>充提时间 <label v-text="createDate">2017-10-24 14:36:10</label></p>
      <p>订单号 <label v-text="orderSn">撤单订单[1122845]</label></p>
    </div>
     <div class="divider">如果疑问，请<a href="#">联系客服</a> </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
          createDate:this.$route.params.createDate,
          userName:this.$route.params.userName,
          money:this.$route.params.money,
          orderSn:this.$route.params.orderSn,
          payCashType:this.$route.params.payCashType,
          status:this.$route.params.status,
          showName:this.$route.params.showName,
      }
    },
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
       color:rgb(236, 64, 64);
       font-size: .26rem;
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
