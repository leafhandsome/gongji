<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">支付宝转银行卡</h2>
    </div>

    <div class="paymain">
     <div class="title">
         <div class="bankcar">
            <div class="banknews"><span>收款账户信息</span> <span class="banknews-right">长按复制</span></div>
            <div class="banknum"><span class="bank-left">卡号：</span><span>6666</span><span>2222</span><span>6666</span><span>6666</span></div>
            <div class="bankname"><span>户名：</span><span class="bank-hide">牛二大范甘迪</span><span class="bank-n">银行：</span><span>招商银行</span></div>
             <div class="bankadr"><span>开户地址：</span><span>什么省什么是石棉瓦</span></div>   
         </div>
     </div>
     <div class="inputText" >
         <span>姓名</span>
        <input type="text" placeholder="请输入支付宝实名" v-model="value">
     </div>
      <div class="inputText" >
         <span>金额</span>
        <input type="number" placeholder="请输入本次充值的金额" v-model="money" onkeyup="value=value.replace(/[^\d.]/g,'')">
     </div>
       <div class="err">
       <p class="">单笔最低充值<span>10</span>元/最高 <span>50000</span>元</p>
       <p>1.复制收款账户信息并打开支付宝</p>
       <p>2.成功转账至收款账户</p>
       <p>3.回到此页面输入姓名和金额并提交</p>
        </div>
    </div>
      <div class="subBtn " :class='isvalue' @click="getbtn">
         提交
      </div>
         <banksucces v-if="showscucces" @hideresult="hide"></banksucces>
  </div>
</template>
<script>
import banksucces from './banksucces';
export default {
  components: {
    banksucces,
  },
  data() {
    return {
      value: '',
      submitBtn: "submitBtn-disable",
      msg: '',
      showscucces: false,
      money:''
    }
  },
  computed: {
    isvalue() {
      return this.value ? "submitBtn-ativice" : "submitBtn-disable";
    }
  },
  methods: {
    getbtn() {
      this.showscucces = true;
    },
    hide(data) {
      this.showscucces = data.hide;
    },
    sendmoney() {

    }
  }
}

</script>
<style lang="scss" scoped>
.paymain {
  background: #f7f7f7;
  .err {
    padding-left: 0.32rem;
    color: #fe6d58;
  }
  .title {
    background-color: white;
    height: 4.3rem;
    padding: 0.12rem 0.12rem 0rem;
  }
  .inputText {
    margin: 0.21rem 0.1rem;
    height: 1.1%;
    line-height: 1.1rem;
    background: #fff;
    padding-left: 0.32rem;
    font-size: 0.26rem;
    span {
      margin-right: 0.4rem;
      color: rgb(63, 69, 87);
    }
    input {
      height: 1rem;
      background: #fff;
      width: 80%;
      border: 0;
      font-size: .26rem;
    }
  }
  .bankcar {
    height: 3.15rem;
    background: linear-gradient(left bottom, #20befc, #5e70e9);
    color: white;
    border-radius: 0.1rem;
    padding: 0.3rem;
    .banknews {
      font-size: 0.22rem;
      .banknews-right {
        float: right;
        font-size: 0.2rem;
      }
    }
    .banknum {
      margin: 0.7rem 0;
      .bank-left {
        padding-left: 0;
        font-size: 0.2rem;
      }
      span {
        font-size: 0.44rem;
        padding: 0 0.2rem;
      }
    }
    .bankname {
      height: 0.6rem;
      font-size: 0.22rem;
      span:nth-child(1) {
        float: left;
        height: 0.6rem;
      }
      .bank-n {
        margin-left: 1rem;
      }
      .bank-hide {
        width: 1rem;
        height: 0.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
      }
    }
    .bankadr {
      font-size: 0.22rem;
    }
  }
  .err {
    font-size: 0.22rem;
    margin-top: 0.3rem;
    color: rgb(158, 161, 178);
    span {
      color: rgb(255, 107, 107);
    }
  }
}
.subBtn { 
  text-align: center; 
  width: 100%;
  height: .88rem;
  line-height: .88rem;
  margin: 0 auto;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 0.26rem;
  color: #caccd4;
}
</style>
