<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">{{gameDetailObj.gameType}} <label>期号{{gameDetailObj.gameNo}}期</label></h2>
    </div>
     <div class="usercode">
         <div class="user-title">用户信息</div>
         <ul class="clearfix">
             <li><p class="fl"> <span>账户：{{gameDetailObj.userName}}</span><span class="user-active">{{gameDetailObj.userType==1?'代理':'会员'}}</span></p></li>
             <li><p class="fl"> <span>返点：</span><span>{{gameDetailObj.waterRate}}%</span></p><p class="fr"><span>返点金额：</span><span>{{gameDetailObj.sendRebateMoney}}</span></p></li>
             <li><p class="fl"> <span>返利：</span><span>{{gameDetailObj.rebate *100}}%</span></p><p class="fr"><span>已获返利：</span><span>{{gameDetailObj.rebateMoney}}</span></p></li>
             <li><p class="fl"> <span>返奖：</span><span>{{gameDetailObj.reAward*100}}%</span></p><p class="fr"><span>已获返奖：</span><span>{{gameDetailObj.realMoney}}</span></p></li>
         </ul>
         </div>
    <div class="from1">
        <div class="type-title">账单信息</div>
       <span>玩法：{{gameDetailObj.playType}}</span>
       <span>投注详情(点击可查看详情)</span>
       <div class="detailball"  @click="goBetinput(gameDetailObj.orderSn)">
         <ul v-html="gameDetailObj.betInput">
           <!-- <li>
             <p class="lable">千位：</p>
             <p class="ball ball-touzhu">0</p>
             <p class="ball ball-touzhu">1</p>
             <p class="ball ball-touzhu">2</p>
             <p class="ball ball-touzhu">3</p>
             <p class="ball ball-touzhu">4</p>
             <p class="ball ball-touzhu">5</p>
             <p class="ball ball-hui">6</p>
             <p class="ball ball-hui">7</p>
             <p class="ball ball-hui">8</p>
             <p class="ball ball-hui">9</p>
           </li>
           <li>
             <p class="lable">百位：</p>
             <p class="ball ball-touzhu">0</p>
             <p class="ball ball-touzhu">1</p>
             <p class="ball ball-touzhu">2</p>
             <p class="ball ball-touzhu">3</p>
             <p class="ball ball-touzhu">4</p>
             <p class="ball ball-touzhu">5</p>
             <p class="ball ball-hui">6</p>
             <p class="ball ball-hui">7</p>
             <p class="ball ball-hui">8</p>
             <p class="ball ball-hui">9</p>
           </li>
           <li>
             <p class="lable">个位：</p>
             <p class="ball ball-touzhu">0</p>
             <p class="ball ball-touzhu">1</p>
             <p class="ball ball-touzhu">2</p>
             <p class="ball ball-touzhu">3</p>
             <p class="ball ball-touzhu">4</p>
             <p class="ball ball-touzhu">5</p>
             <p class="ball ball-hui">6</p>
             <p class="ball ball-hui">7</p>
             <p class="ball ball-hui">8</p>
             <p class="ball ball-hui">9</p>
           </li> -->
         </ul>
       </div>
      <div class="drawball">
        <span>开奖结果</span>
          <p class="ball ball-draw" v-for="(item,index) in gameDetailObj.openCode" :key="index">{{item}}</p>
          <p class="clearfix"><span v-show="gameDetailObj.bigOrSmall">{{gameDetailObj.bigOrSmall}}|</span><span v-show="gameDetailObj.singleOrDouble">{{gameDetailObj.singleOrDouble}}|</span>
          <span v-show="gameDetailObj.draganOrTiger">{{gameDetailObj.draganOrTiger}}</span><span class="sum" v-show="gameDetailObj.sum">和值：{{gameDetailObj.sum}}</span></p>
      </div>
    </div>

    <div class="from2">
      <p>订单编号 <label>{{order}}</label></p>
      <p>下单时间 <label>{{gameDetailObj.betDate}}</label></p>
      <p>当前状态 <label>{{gameDetailObj.orderState}}</label></p>

      <p>标准赔率 <label>{{gameDetailObj.playRate}}倍</label></p>
      <p>投注水位 <label>{{gameDetailObj.orderWater}}</label></p>
      <p>投注金额 <label>{{gameDetailObj.betMoney}}元</label></p>
      <p>最多可赢 <label>{{gameDetailObj.canWinMoney}}元</label></p>
      <p>中奖金额 <label>{{gameDetailObj.prizeMoney}}元</label></p>
    </div>
    <div class="footerbtn" v-text="gameDetailObj.prizeMoney>0?'已中奖':'暂未中奖'" :class="gameDetailObj.prizeMoney>0?'win':'nowin'"></div>
  </div>
</template>


<script>
import cookieRender from '../../config/cookie';
export default {
    data() {
        return {
            gameDetailObj: {},
            order:this.$route.params.orderSn
        }
    },
    created() {
        this.getgame();
    },
    methods: {
        getgame() {
            let vm = this;
            let token = cookieRender.getValue("token");
            let userId = cookieRender.getValue("userId");
            if (token && userId) {

                vm.unitAjax('POST', '/api/agent/teamPlayLog/detail',{orderSn:this.order}, function (result) {
                    if (result.result) {
                        vm.gameDetailObj = result.data;
                      if(vm.gameDetailObj.betInput.length>200){
                        vm.$el.querySelector('.detailball').style.height   = '2rem';
                        vm.$el.querySelector('.detailball').style.overflow = 'hidden';
                      }
                    } else {
                        if (result.operateCode == 100) {
                            vm.removeValue("token");
                            vm.removeValue("userId");
                            vm.goLogin();
                        }
                    }
                });
            } else {
              vm.goLogin();
            }
        },
      goBetinput(orderSn){
        let vm = this;
        if(vm.gameDetailObj.betInput!=""){
          vm.$router.push('/betinput/'+orderSn+'/'+vm.gameDetailObj.playType)
        }
      }
    }
}

</script>
<style lang="scss" scoped>
.container {
  font-size: .26rem;
  .header {
    .header-title {
      line-height: 0.4rem;
      padding: 0.2rem;
      label {
        display: block;
        font-size: 0.2rem;
      }
    }
  }
  background-color: #f7f7f7;
  .usercode {
    padding:0 0.34rem;
    background-color:#FFFFFF;
    font-size: .26rem;
    color: rgb(63  ,69, 87);
    .user-title {
      height: 0.79rem;
      line-height: 0.79rem;
      border-bottom: 1px solid #efefef;
       color: rgb(43, 48, 75);
    }
    ul{
        padding:.12rem 0 .12rem 0;
        .user-active{
            display: inline-block;
            margin-left: .13rem;
            background-color: #4584F5;
            color:white;
            height: .4rem;
            width:.9rem;
            text-align: center;
            font-size: .12rem;
            line-height: .4rem;
            border-radius: .4rem;
        }
        li{
           height: .66rem;
           line-height: .66rem;
              font-size: .26rem;
            .fl{
                float: left;
            }
            .fr{
                float: right;
            }
        }
    }
  }
  .from1 {
    padding: 0.2rem 0.2rem;
    background-color: #fff;
    margin-top: 0.2rem;
    .type-title {
      height: 0.58rem;
      line-height: 0.48rem;
      border-bottom: 1px solid #efefef;
    }
    span {
      display: block;
      line-height: 0.5rem;
    }
    .detailball {
      background-color: #f7f7f7;
      border-radius: 5px;
        padding:  .2rem 0.15rem 0.2rem;
      ul li {
        height: 0.6rem;
      }
      .lable {
        width: 0.9rem;
        height: 0.42rem;
        line-height: 0.42rem;
        float: left;
        font-size: 0.26rem;
        margin: 0.15rem 0 0;
      }
    }
    .drawball {
      margin-top: 0.1rem;
      p{
        span{
          float: left;
        }
        .sum{
          padding-left: .2rem;
        }
      }
    }
    .ball {
      width: 0.42rem;
      height: 0.42rem;
      line-height: 0.42rem;
      text-align: center;
      display: inline-block;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
      font-size: 0.26rem;
      margin: 0.05rem 0.04rem;
    }
    .ball-hui {
      background-image: url("../../assets/images/ball-hui.png");
    }
    .ball-draw {
      background-image: url("../../assets/images/ball-draw.png");
    }
    .ball-touzhu {
      background-image: url("../../assets/images/ball-touzhu.png");
    }
  }

  .from2 {
    padding: 0.3rem 0.2rem 0.5rem;
    background-color: #fff;
    margin-top: 0.2rem;
    p {
      font-size: 0.26rem;
      line-height: 0.55rem;
      color: #9ea1b2;
      label {
        float: right;
        color: #000;
        margin-left: 0.2rem;
      }
    }
  }
  .footerbtn {
    height: 0.98rem;
    line-height: 0.98rem;
    font-size: 0.36rem;
    text-align: center;
  }
  .nowin {
    background-color: #ececec;
    color: #caccd4;
  }
  .win {
    color: #fff;
    background-color: #f85e3c;
  }
}
</style>
