<template>
  <div class="dialog" v-model="plays" id="doubelwin">
    <div class="mask" @click="cancel"></div>
    <div class="dialog-content">
      <div class="top">
        <img src="../../assets/images/modal-top.png">
        <div class="text">
           <p class="betname">{{params.playName}}</p>
           <p class="betno">No.{{params.gameNo}}</p>
         </div>
         <div class="img" @click="showMark" v-if="!successMain">
           <img :src=markIcon>
         </div>
      </div>
      <div class="main">
        <div class="inline-number-item" v-if="showMain">
          <p class="wintip">可赢：<label>{{totalmoney}}元</label></p>

          <div class="numberplay">
              <p>赔率@{{showOdds}}</p>
            <div class="inputValue">
              <input type="tel" v-model="playSum" >
            </div>
          </div>
          <div class="">
            <div class="center-range">
              <div class="range">
                <p class="f24">下注水位</p>
                <span class="min">{{selfRate}}</span>
                <range :min='minWater' :max='maxWater' :step="1" v-model="rangeValue" :rangeBarHeight="5"></range>
                <span class="max">{{waterValue}}</span>
              </div>
            </div>
          </div>
          <div class="inline-number-check">
            <checker default-item-class="btn-checker-item" >
              <checker-item value="5"   @on-item-click="moneyValue">5</checker-item>
              <checker-item value="20"  @on-item-click="moneyValue">20</checker-item>
              <checker-item value="100" @on-item-click="moneyValue">100</checker-item>
              <checker-item value="500" @on-item-click="moneyValue">500</checker-item>
              <checker-item value="1000" @on-item-click="moneyValue">1000</checker-item>
            </checker>
          </div>
          <div class="number-tip">
            <p class="cancel-tip" v-if="showTip">TIPS:点击窗口外关闭弹窗</p>
            <p class="pay" v-if="showPay" >对不起，您的余额不足<span @click="goURL('/voucher')"> &nbsp;&nbsp;去充值</span></p>
          </div>
          <div class="xiazhubtn" @click="betOrder()" :class="playSum>0?'ativice':''">下注</div>
        </div>
        <div class="remak" v-if="showRemark">
          <p>{{remark}}</p>
        </div>
        <div class="successMain" v-if="successMain">
           <p class="orderText">{{successObj.betCount}}注，{{successObj.betTimes}}倍，共{{successObj.betMoney}}元</p>
           <img src="../../assets/images/weixin/bankok.png">
           <p class="successText">投注成功！</p>
           <p class="cancel-tip">TIPS:点击窗口外关闭弹窗</p>
           <p >订单号：{{successObj.orderId}}</p>
        </div>
      </div>

    </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
    </div>
  </div>
</template>

<script>
  import param from '../../config/Param.json';
  import {mapState, mapMutations} from 'vuex'

  export default {
    props:['params','height'],
    data(){
      return {
        playSum:param.minValue,
        showOdds: 1.92,
        multiplevalue:1, //倍数值
        rangeValue: 0,   //水位
        count_zs :0,     //总注数
        responseData:{}, //返回结果
        waterV :0,       //返回水位
        loading: {
          show: false,
          text: '加载中...'
        },
        showToast:false,//显示提示
        ToastText:'',   //提示内容
        ToastPosition: 'bottom',//提示位置,
        minWater: 0,
        maxWater: 0,
        maxUserWater:0,
        remark:'',
        showMain:true,
        showRemark:false,
        successMain:false,
        markIcon :'',
        successObj:{},
        showTip:true,
        showPay:false,
      }
    },
    created(){
      let vm = this;
      vm.showOdds   = vm.params.showOdds;
      let localRate = vm.getStroe('playType'+ vm.params.playType);
      vm.rangeValue = vm.params.defaultWater > vm.params.maxUserWater ? vm.params.defaultWater:vm.params.maxUserWater;//两者取大

      //获取本地记录水位
      if(localRate && localRate < vm.rangeValue){
        vm.rangeValue = localRate;
      }

      vm.rangeValue   = parseInt(vm.rangeValue);
      vm.minWater     = vm.params.minWater;
      vm.maxWater     = vm.params.maxWater;
      vm.maxUserWater = vm.params.maxUserWater;
      vm.remark = vm.params.remark;
    },

    computed: {
      plays(){
        let vm = this;
        if(vm.playSum > param.maxValue){
          vm.playSum = param.maxValue ;
        }
        vm.showOdds = (vm.rangeValue * vm.params.playOdds / 2000).toFixed(3);
        vm.markIcon = vm.showMain?require('../../assets/images/lottery/question.png'):require('../../assets/images/lottery/close.png');
      },
      totalmoney(){
        let vm = this;
        vm.playSum = /^[0-9]*$/.test(vm.playSum) ? vm.playSum : 1;
        return (vm.playSum * (vm.rangeValue/2000 * vm.params.playOdds)).toFixed(3)
      },
      waterValue () {
        let vm = this;
        return (vm.rangeValue/20).toFixed(1);
      },
      selfRate(){
        let  vm = this;
        var temp = vm.maxUserWater - vm.rangeValue;
        if(temp <= 0)
          return 0 + "%";
        return (temp / 20).toFixed(1) + "%";
      },
    },
    methods: {
      ...mapMutations([
        'GET_USERINFO'
      ]),
      moneyValue(val){
        let vm = this;
        vm.playSum = vm.playSum ? vm.playSum : 0;
        if(vm.playSum < param.maxValue){
          vm.playSum =parseInt(vm.playSum)+ parseInt(val)
        }else{
          vm.playSum = param.maxValue;
        }
      },
      betOrder(){
        let vm = this;
        let token  = vm.getValue("token");
        let userId = vm.getValue("userId");
        if(token && userId){
          if(vm.playSum>0){
            let parmars = {
              "roomId"    :vm.params.roomId,
              "gameNo"    :vm.params.gameNo,
              "playType"  :vm.params.playType,
              "betInput"  :"",
              "betTimes"  :vm.playSum,
              "moneyUnit" :1,
              "orderWater":vm.rangeValue,
            }
            vm.loading.show = true;
            vm.loading.text = '正在下注...'
            vm.unitAjax('POST','/api/lottery/bet',parmars,function (result) {
              if(result.result){
                vm.loading.show = false;
                vm.showMain = false;
                vm.successMain = true;
                vm.successObj = result.data;
                let userInfoData = {
                  safeMoney: result.data.userSafeMoney
                }
                vm.GET_USERINFO(userInfoData) ;
                //记住下注水位
                let name = 'playType'+vm.params.playType;
                let obj = vm.rangeValue;
                vm.removeStore(name);
                vm.setStore(name,obj);
                //关闭下注界面
                setInterval(function () {
                   vm.cancel();
                },3000);
              }else{
                vm.loading.show = false;
                if(result.operateCode==100){ //登录形象过期了，清除token userId ,
                  vm.showToast = true;
                  vm.ToastText = result.msg ;
                  vm.removeValue("token");
                  vm.removeValue("userId");
                  setTimeout(function () {
                    vm.goLogin();
                  },1000);
                }else if(result.msg.indexOf('对不起，您的余额不足')!=-1){
                    vm.showTip = false;
                    vm.showPay = true;
                }else if(result.msg.indexOf('房间已关闭，无法下注')!=-1){
                  vm.showToast = true;
                  vm.ToastText = result.msg ;
                  setTimeout(function () {
                    vm.$router.push('/index');
                  },2000);
                }else {
                  vm.showToast = true;
                  vm.ToastText = result.msg ;
                }
              }
            });
          }else{
            vm.showToast = true;
            vm.ToastText = '金额不能为0' ;
          }
        }else {
          vm.goLogin();
          vm.cancel();
        }
      },
      // 取消,
      cancel() {
        let vm = this;
        let parmar ={};
            parmar.hide = false ;
        this.$emit('hidedoubel',parmar);//调用父组件的自定义事件，并传值
      },
      //显示玩法详情
      showMark(){
        let vm = this;
        if(vm.showMain){
          vm.showMain = false;
          vm.showRemark = true;
        } else {
          vm.showMain = true;
          vm.showRemark = false;
        }
        vm.successMain = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dialog {
  .dialog-content{
    position: fixed;
    box-sizing: border-box;
    width: 90%;
    height: auto;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    -webkit-animation:myfirst 0.1s;
    animation: myfirst 0.1s;
    border-radius: 5px;
    z-index: 602;
    .top{
      img{
        position: relative;
        width: 100%;
      }
      .text{
        position: absolute;
        top: 0.2rem;
        left: 0.3rem;
        color: #FFF;
        p{
          line-height: 0.4rem;
        }
        .betname{
          font-size: 0.4rem;
        }
        .betno{
          font-size: 0.24rem;
        }
      }
      .img{
        position: absolute;
        right: 0.1rem;
        top: 0.2rem;
        text-align: center;
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        img{
          width: 0.46rem;
          height: 0.46rem;
        }
      }
    }
    .main{
     position: relative;
     background: url("../../assets/images/modal-centen.png") no-repeat;
     background-size: 100% 100%;
     height: 6rem;
     .inline-number-item {
          width: 100%;
          height:auto;
          .wintip{
            height: 0.5rem;
            line-height: 0.5rem;
            padding-top: 0.39rem;
            text-align: center;
            font-size: 0.3rem;
          }
          .numberplay{
            height: 1rem;
            padding-top:0.22rem;
            p{
              width: 2rem;
              height: 1rem;
              line-height: 1rem;
              float: left;
              text-align: center;

            }
            .inputValue{
              width: 4rem;
              float: left;
              height: 0.84rem;
              line-height: 0.84rem;
              border: 2px solid #e5e5e5;
              border-radius: 5px;
              input{
                border: none;
                padding: 0.05rem;
              }
            }
          }
          .inline-number-check{
            width: 90%;
            margin: 0 auto;
            padding-top: 0.38rem;
            .btn-checker-item{
              width: auto;
              margin :0 0.03rem;
            }
          }
          .number-tip{
            padding-top: 0.1rem;
            clear: both;
            p{
              line-height: 0.35rem;
              font-size: 0.22rem;
              color: #C0C1C1;
            }
              .cancel-tip{
                text-align: center;
              }
              .pay{
                line-height: 0.55rem;
                text-align: center;
                color: #F59330;
                span{
                  color: #4584F5;
                }
              }
          }
        }
        .xiazhubtn {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 1rem;
          background: #fff;
          border-top: 1px solid #e5e5e5;
          /*border-radius: 0 0 5px 5px;*/
          font-size: 0.34rem;
          line-height:1rem;
          text-align: center;
        }
        .ativice{
          background-color: #52AAFC;
          color: #fff;
        }
        .center-range{
          padding:0 0 0 0.33rem;
          height: auto;
          background-color: #FFF;
        .range{
          padding:0 0.33rem 0 0;
          margin: 0.2rem 0;
          height: auto;
          position: relative;
            p{
              line-height: 0.3rem;
              color: #C0C1C1;
            }
          .min{
            width: 1rem;
            float: left;
            display: block;
            margin-top: 0.15rem;
            text-align: center;
            color:#4584F5;
          }
          .max{
            position: absolute;
            right: 0.33rem;
            top:64%;
            display: block;
            width: 0.5rem;
            text-align: center;
            color:#4584F5;
          }
        }
        }
       .remak{
         padding: 0.2rem;
         position: absolute;
         top: 25%;
       }
       .successMain{
         width: 100%;
         text-align: center;
         font-size: 0.26rem;
         .orderText{
           display: block;
           padding-top: 0.42rem;
           font-size: 0.3rem;
         }
         .successText{
           padding-top: 0.39rem;
           padding-bottom: 0.3rem;
           font-size: 0.36rem;
           color: #5EE072;
         }
         .cancel-tip{
           line-height: 0.5rem;
         }
         img{
           width: 1.6rem;
           height: 1.6rem;
           padding-top: 0.34rem;
         }
       }
    }
  }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 601;
      background: rgba(0,0,0,.5);
    }
  }

  @keyframes myfirst
  {
    0%   {top:0;}
    50%  {top:25%;}
    100% {top:50%;}
  }
  .dialog .dialog-content .main .inline-number-item .inline-number-check .btn-checker-item{
    margin: 0 ;
    width: 1.08rem;
    text-align: center;
    padding: 0;
  }
</style>
