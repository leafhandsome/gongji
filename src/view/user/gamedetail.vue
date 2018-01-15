<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">{{gameDetailObj.gameType}} <label>期号{{gameDetailObj.gameNo}}期</label></h2>
    </div>

    <div class="from1">
       <span>玩法：{{gameDetailObj.playType}}</span>
       <span>投注详情(点击可查看详情)</span>
       <div class="detailball"  @click="goBetinput()">
         <ul v-html="gameDetailObj.betInput">

           <!--<li>-->
             <!--<p class="lable">千位：</p>-->
             <!--<p class="ball ball-touzhu">0</p>-->
             <!--<p class="ball ball-touzhu">1</p>-->
             <!--<p class="ball ball-touzhu">2</p>-->
             <!--<p class="ball ball-touzhu">3</p>-->
             <!--<p class="ball ball-touzhu">4</p>-->
             <!--<p class="ball ball-touzhu">5</p>-->
             <!--<p class="ball ball-hui">6</p>-->
             <!--<p class="ball ball-hui">7</p>-->
             <!--<p class="ball ball-hui">8</p>-->
             <!--<p class="ball ball-hui">9</p>-->
           <!--</li>-->
           <!--<li>-->
             <!--<p class="lable">百位：</p>-->
             <!--<p class="ball ball-touzhu">0</p>-->
             <!--<p class="ball ball-touzhu">1</p>-->
             <!--<p class="ball ball-touzhu">2</p>-->
             <!--<p class="ball ball-touzhu">3</p>-->
             <!--<p class="ball ball-touzhu">4</p>-->
             <!--<p class="ball ball-touzhu">5</p>-->
             <!--<p class="ball ball-hui">6</p>-->
             <!--<p class="ball ball-hui">7</p>-->
             <!--<p class="ball ball-hui">8</p>-->
             <!--<p class="ball ball-hui">9</p>-->
           <!--</li>-->
           <!--<li>-->
             <!--<p class="lable">个位：</p>-->
             <!--<p class="ball ball-touzhu">0</p>-->
             <!--<p class="ball ball-touzhu">1</p>-->
             <!--<p class="ball ball-touzhu">2</p>-->
             <!--<p class="ball ball-touzhu">3</p>-->
             <!--<p class="ball ball-touzhu">4</p>-->
             <!--<p class="ball ball-touzhu">5</p>-->
             <!--<p class="ball ball-hui">6</p>-->
             <!--<p class="ball ball-hui">7</p>-->
             <!--<p class="ball ball-hui">8</p>-->
             <!--<p class="ball ball-hui">9</p>-->
           <!--</li>-->
         </ul>
       </div>
      <div class="drawball">
        <span>开奖结果</span>
          <p class="ball ball-draw" v-for="(item,index) in gameDetailObj.openCode">{{item}}</p>
           <p class="clearfix"><span v-show="gameDetailObj.bigOrSmall">{{gameDetailObj.bigOrSmall}}|</span><span v-show="gameDetailObj.singleOrDouble">{{gameDetailObj.singleOrDouble}}|</span>
            <span v-show="gameDetailObj.draganOrTiger">{{gameDetailObj.draganOrTiger}}</span><span v-show="gameDetailObj.sum" class="sum">和值：{{gameDetailObj.sum}}</span></p>
      </div>
    </div>

    <div class="from2">
      <p>订单编号 <label>{{orderId}}</label></p>
      <p>当前状态 <label>{{gameDetailObj.orderState}}</label></p>
      <p>投注单位 <label>{{gameDetailObj.moneyUnit}}</label></p>
      <p>投注倍数 <label>{{gameDetailObj.betTimes}}倍</label></p>
      <p>投注金额 <label>{{gameDetailObj.betMoney}}元</label></p>
      <p>投注赔率 <label>{{gameDetailObj.realOdds}}元</label></p>
      <p>最多可赢 <label>{{gameDetailObj.canWinMoney}}元</label></p>
      <p>投注水位 <label>{{gameDetailObj.orderWater}}</label></p>
      <p>下单时间 <label>{{gameDetailObj.betDate}}</label></p>
      <p>中奖金额 <label></label></p>

    </div>
    <div class="footerbtn" :class="gameDetailObj.prizeMoney>0?'win':'nowin'">{{gameDetailObj.prizeMoney>0?'奖金：￥'+gameDetailObj.prizeMoney:gameDetailObj.orderStatus==3?'未中奖':gameDetailObj.orderState}}</div>
  </div>
</template>

<script>
  import cookieRender from '../../config/cookie';
  export default {
    data(){
      return {
        gameDetailObj:{},
        orderId:''
      }
    },
    created(){
      this.orderId = this.$route.params.orderId;
      this.getgame();
      this.stopBodyScroll(false);
    },
    methods:{
      getgame(){
        let vm = this;
        let token  = cookieRender.getValue("token");
        let userId = cookieRender.getValue("userId");
        if(token && userId){
          let parmars = {
            orderId : vm.orderId,
          }
          vm.unitAjax('POST','/api/userCenter/game/gameOrderDetail',parmars,function (result) {
            if(result.result){
              vm.gameDetailObj = result.data;
              if(vm.gameDetailObj.betInput.length>200){
                vm.$el.querySelector('.detailball').style.height   = '2rem';
                vm.$el.querySelector('.detailball').style.overflow ='hidden';
              }
            }else{
              if(result.operateCode==100){
                vm.removeValue("token");
                vm.removeValue("userId");
                vm.goLogin();
              }
            }
          });
        }else{
          vm.goLogin();
        }
      },
      goBetinput(){
        let vm = this;
        if(vm.gameDetailObj.betInput!=""){
          vm.$router.push('/betinput/'+vm.orderId+'/'+vm.gameDetailObj.playType)
        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  .container{
    .header{
      .header-title{
        line-height: 0.4rem;
        padding: 0.2rem;
        label{
          display: block;
          font-size: 0.2rem;
        }
      }
    }
    background-color: #F7F7F7;
    .from1{
      padding:0.2rem 0.2rem;
      background-color: #fff;
      margin-top:0.2rem;
       span{
         display: block;
         line-height: 0.5rem
       }
      .detailball{
        background-color: #F7F7F7;
        border-radius: 5px;
        padding:  .2rem 0.15rem 0.2rem;
        ul{
          word-wrap: break-word;
          word-break: normal;
        }
        ul li{
          height: 0.6rem
        }
        .lable{ width: 0.9rem; height: 0.42rem;  line-height: 0.42rem; float: left;font-size: 0.26rem; margin: 0.15rem 0 0;}
      }
     .drawball{
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
      .ball{
        width: 0.42rem;
        height: 0.42rem;
        line-height: 0.42rem;
        text-align: center;
        display: inline-block;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size:100% 100%;
        color: #fff;
        font-size: 0.26rem;
        margin: 0.05rem 0.04rem ;
      }
      .ball-hui{
        background-image: url('../../assets/images/ball-hui.png');
      }
      .ball-draw{
        background-image: url('../../assets/images/ball-draw.png');
      }
      .ball-touzhu{
        background-image: url('../../assets/images/ball-touzhu.png');
      }
    }

     .from2{
       padding: 0.3rem 0.2rem 0.5rem;
       background-color: #fff;
       margin-top:0.2rem;
       p{
         font-size: 0.26rem;
         line-height: 0.55rem;
         color: #9EA1B2;
        label{
          float: right;
          color: #000;
          margin-left: 0.2rem;
        }
       }
     }
      .footerbtn{
        height: 0.98rem;
        line-height: 0.98rem;
        font-size: 0.36rem;
        text-align: center;
      }
      .nowin{
        background-color: #ECECEC;
        color: #CACCD4;
      }
      .win{
        color: #FFF;
        background-color: #F85E3C;
      }
  }

</style>
