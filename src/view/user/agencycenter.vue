<template>
  <div class="cantainer">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">代理中心</h2>
    </div>

    <div class="column" v-if="sumobj.userCount">
      <dl class="">
        <dd>
            <p class="column-tit">团队人数</p>
          <p class="column-num"><countup :start-val="0" :end-val="sumobj.userCount" :duration="1"></countup></p>
        
        </dd>
        <dd>
           <p class="column-tit">团队余额</p>
          <p class="column-num"><countup :start-val="0" :end-val="sumobj.safeMoney" :duration="1"></countup></p>
         
        </dd>
      </dl>
      <dl>
        <dd>
          <p class="column-num"><countup :start-val="0" :end-val="sumobj.daiLiCount" :duration="1"></countup></p>
          <p class="column-tit">代理人数</p>
        </dd>
        <dd>
          <p class="column-num"><countup :start-val="0" :end-val="sumobj.huiYuanCount" :duration="1"></countup></p>
          <p class="column-tit">会员人数</p>
        </dd>
      </dl>
    </div>
    <div class="column">
      <div class="colunm-date border-b1" @click="showpicker">{{dateTime}}<img src="../../assets/images/down-icon.png" alt=""></div>
      <div style="display: none">
        <popup-picker title="请选择" :data="list" v-model="value" value-text-align="left" :show.sync="visibility"  @on-change='onchange1'></popup-picker>
      </div>
      <dl class="">
        <dd>
          <p class="column-num">{{dayobj.winMoney}}</p>
          <p class="column-tit">总盈亏</p>
        </dd>
        <dd>
          <p class="column-num">{{dayobj.rebateMoney}}</p>
          <p class="column-tit">返点</p>
        </dd>
      </dl>
      <dl class="">
        <dd>
          <p class="column-num">{{dayobj.betMoney}}</p>
          <p class="column-tit">下注</p>
        </dd>
        <dd>
          <p class="column-num">{{dayobj.prizeMoney}}</p>
          <p class="column-tit">中奖</p>
        </dd>
      </dl>
      <dl class="">
        <dd>
          <p class="column-num">{{dayobj.payMoney}}</p>
          <p class="column-tit">充值</p>
        </dd>
        <dd>
          <p class="column-num">{{dayobj.cashMoney}}</p>
          <p class="column-tit">提现</p>
        </dd>
      </dl>
      <dl class="">
        <dd>
          <p class="column-num">{{dayobj.daiLiCount}}</p>
          <p class="column-tit">新增代理</p>
        </dd>
        <dd>
          <p class="column-num">{{dayobj.huiYuanCount}}</p>
          <p class="column-tit">新增会员</p>
        </dd>
      </dl>
    </div>
  </div>

</template>

<script>

  const  visibility = false ;
  import {login} from "../../server/getData";
  export default {
    data(){
      return {
        value: ['今日'],
        visibility: visibility,
        list: [['今日', '近一周', '近三个月']],
        dateTime:'今日',
        dayType:1,
        sumobj:{},
        dayobj:{},
      }
    },
    created(){
      this.getteamcenter();
    },
    methods:{
      onchange1(val){
         let vm = this;
        this.dateTime=val[0]         
      if (vm.dateTime == '近一周') {
        vm.dayType = 2;
        vm.getteamcenter()
        return;
      } else if (vm.dateTime == '近三个月') {
        vm.dayType = 2;
        vm.getteamcenter()
        return;
      } else {
        vm.dayType = 1;
        vm.getteamcenter()
      }
      },
      getteamcenter(){  
        let vm =this;    
        vm.unitAjax('post','/api/agent/daiLiCenter/detail',{dayType:this.dayType},res=>{
          if(res.result){
            vm.sumobj=res.data.sum;
            vm.dayobj=res.data.day;
          }
        })
      },
      showpicker() {
        this.visibility = true ;
      },
    }
  }

</script>

<style lang="scss" scoped>
  .cantainer div:nth-child(2){
    margin-bottom: 0.2rem;
  }
  .column{
    background-color: #fff;
    padding-bottom: .1rem;
    
    .colunm-date{
      font-size: .26rem;
      height: 0.92rem;
      line-height: 0.92rem;
      padding: 0  0.3rem;
      img{
        width: .2rem;
        padding-top: .4rem;
        float: right;
      }
    }
    dl{
      width: 7rem;
      height: 1.42rem;
      margin: 0 auto;
      padding-top: .14rem;
      dd:nth-child(2n){
        margin-left: .25rem;;
      }
    dd{
      width: 3rem;
      height: 1.3rem;
      float:left;
      text-align: left;
      padding-left: .32rem;
      border:1px solid #EEEEEE;
      :nth-child(1){
        padding-top: 0.26rem;
      }
    }
  }
  }
  .column-num{
    line-height: 0.50rem;
    font-size: 0.4rem ;
    font-weight: 700;
  }
  .column-tit{
    font-size: 0.24rem;
    line-height: 0.40rem;
    color: #9EA1B2;
  }
  .column1{
    margin-top: 0.2rem;
  }

</style>


