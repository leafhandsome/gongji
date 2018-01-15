<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">转账详情</h2>
    </div>

    <div class="paytype">
        <div class="zhuan"><span class="zhuan-left">转</span><span>转账</span></div>
        <div class="money">{{recordlist.tranMoney}}</div>
        <div class="zhuan-ok">已完成</div>
    </div>
    <div class="from">
      <p>付款方式 <label>{{recordlist.tranFlagName}}</label></p>
      <p>转账人 <label>{{recordlist.sendUserName}}</label></p>
      <p>收款人 <label>{{recordlist.toUserName}}</label></p>
      <p>转账时间 <label>{{recordlist.tranDate}}</label></p>
    </div>
     <div class="divider">如果疑问，请<a href="#">联系客服</a> </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        recordlist:{},
      }
    },
    created(){
      this.gettransfer();
    },
    methods:{
         gettransfer(){
          let i= this.$route.params.itemsid;
         this.unitAjax("post",'/api/userCenter/transfer/tranMoneyLog',{},res=>{     
        this.recordlist=res.data.items[i];
        })
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
      padding: 0.3rem 0.32rem 0.5rem 0.32rem;
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
