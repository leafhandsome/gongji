<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">返点详情</h2>
    </div>

    <div class="rebate">
      <dl>
        <dd>投注金额：{{rebateobj.betMoney}}</dd>
        <dd class="rebate-r">中奖：{{rebateobj.prizeMoney}}</dd>
      </dl>
      <dl class="fanli">
        <dd>返利：{{rebateobj.rebateMoney}}</dd>
        <dd class="rebate-r">返奖：{{rebateobj.realMoney}}</dd>
      </dl>
    </div>
    <div class="from">
      <p>用户 <label ><span>{{rebateobj.userName}}</span><span v-show="rebateobj.nickName">({{rebateobj.nickName}})</span><span class="v-dl-label f18">{{rebateobj.userType==1?'代理':'会员'}}</span></label></p>
      <p>返点 <label ><span class="v-fd-var f18">{{rebateobj.waterRate}}%</span></label></p>
      <p>期号<label>{{rebateobj.gameType}}（{{rebateobj.gameNo}}）期</label></p>
      <p>玩法 <label>{{rebateobj.playType}}</label></p>
      <p>订单编号<label>{{rebateobj.gameNo}}</label></p>
      <p>下单时间<label>{{rebateobj.betDate}}</label></p>
    </div>
     <div class="divider">如果疑问，请<a href="#">联系客服</a> </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rebateobj:{}
    }
  },
  created() {
    this.getrebadetail();
  },
  methods: {
    getrebadetail() {
      this.unitAjax('post', '/api/agent/teamRebateLog/detail', {orderSn:this.$route.params.orderSn}, res => {
        if (res.result) {
          this.rebateobj=res.data
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            this.removeValue("token");
            this.removeValue("userId");
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  .rebate dl {
    background-color: #fff;
    padding: 0.15rem 0.32rem 0;
    height: 0.8rem;
    line-height: 0.8rem;
    dd {
      width: 50%;
      float: left;
      height: 0.6rem;
      line-height: 0.6rem;
    }
    .rebate-r {
      text-align: right;
    }
  }

  .rebate .fanli {
    background-color: white;
  }
  .from {
    margin-top: 0.2rem;
    padding: 0.5rem 0.32rem 0.5rem 0.32rem;
    background-color: #fff;
    margin-bottom: 0.2rem;
    p {
      font-size: 0.26rem;
      line-height: 0.6rem;
      color: #9ea1b2;
      label {
        height: 0.5rem;
        float: right;
        text-align: right;
        color: #000;
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
