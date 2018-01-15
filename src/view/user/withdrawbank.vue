<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">银行卡提现</h2>
    </div>
    <!-- 没有银行卡时显示 -->
 <div v-show="showbank" class="bankmsg">
     <div class="no-bank"><img src="../../assets/images/weixin/no-bank.png" alt=""></div>
      <div class="text">请先绑定您的银行卡信息</div>
      <div class="goto" @click="gotobind">马上就去</div>
 </div>
 <!-- 有银行卡时 -->
    <div class="paymain" v-if="selector">   
      <div class="selBank" @click="showpicker">
        <!-- <img src="../../assets/images/icons/icon-ccb.png"> -->
        <div class="clearfix">
        <span class='bankname' >{{selector.bankName}}</span>
        <span class='bankname' >{{tousername(realName)}}</span>
        </div>
        <span v-text="tobank(selector.bankNo)">尾号1020</span>
        <span class="islink" ></span>
      </div>
       <div style="display: none">
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1" @on-change="onchange1"></popup-picker>
     </div>
      <div class="withdraw">
        <div class="title"><span>提现金额</span></div>
        <div class="inputText" >
           <span>￥</span>
          <input type="tel" v-bind="{placeholder:'请输入提现金额('+minmoney+'-'+maxmoney+'元)'}" v-model="num" @blur="drawmoney"
           onkeyup="if(this.value==this.value2)return;if(this.value.search(/^\d*(?:\.\d{0,2})?$/)==-1)this.value=(this.value2)?this.value2:'';else this.value2=this.value;">
        </div>
        <div class="balance">
           <p>可提现{{(balance-0).toFixed(2)}}元</p>
           <p class="alltx" @click="allfun">全部提现</p>
        </div>
      </div>
      <p class="error" v-text="err"></p>
      <div class="submitBtn" :class='isnum' @click="showconfirm">
        <p >确定</p>
      </div>
        <div >
        <confirm v-model="show" show-input title="请输入资金密码" @on-confirm="onConfirm" @on-show="onshow">
        </confirm>
      </div>
    </div>
                                   <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
  </div>
</template>

<script>
import store from '../../store/index';
import { Confirm } from 'vux';
export default {
  data() {
    return {
      num: '',
      submitBtn: "submitBtn-disable",
      balance: '888.88',
      show: false,
      err: '',
      banklist: {},
      bankmsg: '',
      showbank: false,
      visibility1: false,
      list: [['全部', '2017-10-28', this.datefmt(Date(), 'YYYY-MM-DD')]],
      value1: ['全部'],
      oldlist: {},
      selector: '',
      minmoney: this.$route.params.minmoney,
      maxmoney: this.$route.params.maxmoney,
      userBankId:'',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      realName:store.state.realname
    }
  },
  computed: {
    isnum() {
      return this.num ? "submitBtn-ativice" : "submitBtn-disable";
    }
  },
  created() {
    this.getbankcar();
    this.getuser();
    
  },
  methods: {
    drawmoney() { 
        this.num =(this.num-0).toFixed(2);
    },
    //获取可提现金额
    getuser() {
      this.unitAjax("post", '/api/userCenter/index', {}, res => {
        if (res.result) {
          this.balance = res.data.canCashMoney;
        } else {
          if (res.operateCode == 100) {
            this.removeValue("token");
            this.removeValue("userId");
            this.$router.push('/loginpage')
          }
        }
      });
    },
    gotobind() {
      this.$router.push('addcar')
    },
    showpicker() {
      this.visibility1 = true;
    },
    onchange1(val) {
      let vm = this;
      for (var key in vm.oldlist) {
        if (val[0] == vm.oldlist[key].bankName + '(' + vm.oldlist[key].bankNo.slice(-3) + ')') {
          vm.selector = vm.oldlist[key];
          vm.userBankId = vm.oldlist[key].userBankId;
        }
      }
    },
    getbankcar() {
      let vm = this;
      this.unitAjax('post', '/api/userCenter/setUp/userBankList', {}, res => {
        let arr = [];
        if (res.result) {
          vm.oldlist = res.data;
         
          // 没有银行卡时
          if (res.data.length == 0) {
            this.showbank = true
          }
          vm.selector = res.data[0];
           vm.userBankId=res.data[0].userBankId;
          //取出数据重新加入数组
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].bankName + '(' + res.data[i].bankNo.slice(-3) + ')')
          }
          vm.list = [arr];
        }
      })
    },
    allfun() {
      this.num = (this.balance - 0).toFixed(2);
    },
    showconfirm: function () {
        if(parseFloat(this.num)>=parseFloat(this.minmoney)&&parseFloat(this.num)<=parseFloat(this.maxmoney)&&this.balance!==0.00){
        this.show = true;
      } else {
         this.showToast = true;
         if(parseFloat(this.num)>parseFloat(this.maxmoney)){
           this.ToastText ='提现金额超出限额'
         }else if(parseFloat(this.num)>parseFloat(this.balance)||this.balance==0.00){
           this.ToastText ='提现余额不足'
         }else if(parseFloat(this.num)<parseFloat(this.minmoney)){
            this.ToastText ='提现金额必须大于'+this.minmoney
         }
        
      }
    },
    onConfirm: function (val) {
      this.unitAjax('post', '/api/userCenter/cash/createBankCashOrder', { userBankId: this.userBankId, cashMoney: this.num, accountPwd: val }, res => {
        if (res.result) {
          this.$router.push('/transfersucess' )
        } else {
          this.err = res.msg;
        }
      })
    }

  },
  components: {
    Confirm,
  }
}
</script>
<style lang="scss" scoped>
.paymain {
  background: #f7f7f7;
  .selBank {
    margin-top: 0.2rem;
    width: 100%;
    height: 1.8rem;
    position: relative;
    background: #fff;
    img {
      float: left;
      width: 0.88rem;
      height: 0.88rem;
      margin: 0.46rem 0.35rem;
    }
    .bankname {
      padding-top: 0.4rem;
      margin-left: 0.41rem;
      font-size: 0.32rem;
      color: #000;
      float: left;
    }
    span {
      margin-left: 0.41rem;
      font-size: 0.32rem;
      padding-top: .2rem;
      line-height: 0.5rem;
      display: block;
      color: #9ea1b2;
    }
  }
  .withdraw {
    margin-top: 0.2rem;
    background: #fff;
    .title {
      height: 0.65rem;
      padding-left: 0.35rem;
      line-height: 0.65rem;
      span {
        font-size: 0.24rem;
        color: #9ea1b2;
        display: block;
      }
    }
    .inputText {
      height: 0.92rem;
      line-height: 0.92rem;
      background: #fff;
      padding-left: 0.32rem;
      span {
        font-size: 0.6rem;
      }
      input {
        height: 0.8rem;
        background: #fff;
        width: 80%;
        border: 0;
        font-size: 0.24rem;
        padding-left: 0.32rem;
      }
    }
    .balance {
      margin: 0 0.35rem;
      font-size: 0.24rem;
      height: 0.8rem;
      border-top: 0.01rem solid #e5e5e5;
      line-height: 0.8rem;
      p {
        display: block;
        width: 50%;
        float: left;
        color: #9ea1b2;
      }
      .alltx {
        text-align: right;
        color: #4584f5;
      }
    }
  }
  .error {
    padding-left: 0.32rem;
    color: #ec4040;
  }
}
.bankmsg {
  text-align: center;
  .no-bank {
    width: 3.18rem;
    margin: 0 auto;
    margin-top: 1.72rem;
  }
  .text {
    margin-top: 0.32rem;
    color: #9ea1b2;
  }
  .goto {
    margin: 1.05rem auto;
    width: 2.26rem;
    height: 0.64rem;
    line-height: 0.64rem;
    font-size: 0.28rem;
    background-color: #4584f5;
    color: #f7f7f7;
    border-radius: 0.1rem;
  }
}
</style>
