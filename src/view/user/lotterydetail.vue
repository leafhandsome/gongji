<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">彩票详情</h2>
    </div>

    <div class="detail">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr class="thead" >
          <td width="30%" class="border-b1 border-r1">类别</td>
          <td class="border-b1">总计</td>
        </tr>
        <tr v-for="(item,index) in lotterylist" :key="index">
          <td width="30%" class="border-b1 border-r1" v-text="item.changeType">消费</td>
          <td class="border-b1" v-text="item.money">0.000</td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
  const  visibility =false ;
  export default {
    data(){
      return {
        lotterylist:[]
      }
    },
    created(){
        this.getlottery();
    },
    methods:{
      getlottery(){
          this.unitAjax('post','/api/userCenter/lotteryReport/reportDetail',{dayTime:this.$route.params.daytime},res=>{
            this.lotterylist=res.data;
          })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container{
    background-color: #F7F7F7;
    .detail{
      table tr{
        height: 0.8rem;
        background-color: #FFF;
        td{
          text-align: center;
        }
      }
      .thead{
        background-color: #F7F7F7;
      }
    }
  }

</style>
