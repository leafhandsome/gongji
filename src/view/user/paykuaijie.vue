<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">快捷支付</h2>
    </div>
      <!-- 没有银行卡时显示 -->
 <div v-if="showbank" class="bankmsg">
     <div class="no-bank"><img src="../../assets/images/weixin/no-bank.png" alt=""></div>
      <div class="text">请先绑定您的银行卡信息</div>
      <div class="goto" @click="gotobind">马上就去</div>
 </div>
    <div class="paymain"  v-if="!showbank">
      <ul>
         <li @click="showpicker" >
            <div class="selBank">
            <!-- <img src="../../assets/images/icons/icon-ccb.png"> -->
            <span class='bankname' v-text="selector.bankName">中国建设银行</span>
            <span v-text="bankCode">尾号1020</span>
            <span class="islink"></span>
          </div>
         </li>
       </ul>
     <div style="display: none">
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1" @on-change="onchange1"></popup-picker>
     </div>
     
     <div class="title"><span>充值金额</span></div>
     <div class="inputText" >
        <input type="number" v-bind="{placeholder:'请输入充值金额('+minMoney+'-'+maxMoney+'元)'}" v-model="value" @blur="setnumber"
        onkeyup="if(this.value==this.value2)return;if(this.value.search(/^\d*(?:\.\d{0,2})?$/)==-1)this.value=(this.value2)?this.value2:'';else this.value2=this.value;">
     </div>
           <p v-text="msg" class="err"></p>
      <div class="submitBtn " :class='isvalue'>
       <p @click="sendmoney(bankCode)">确定</p>
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

export default {
  data() {
    return {
      value: '',
      submitBtn: "submitBtn-disable",
      list: [['全部', '2017-10-28', this.datefmt(Date(), 'YYYY-MM-DD')]],
      value1: ['全部'],
      visibility1: false,
      msg: '',
      oldlist: {},
      selector: {},
      bankCode: '',
      showbank: false,
      minMoney: this.$route.params.minMoney,
      maxMoney: this.$route.params.maxMoney,
      loading: {
        show: false,
        text: '加载中...'
      },
      showToast: false,
      ToastText: '',
      ToastPosition: ''
    }
  },
  computed: {
    isvalue() {
      return this.value ? "submitBtn-ativice" : "submitBtn-disable";
    },

  },
  watch: {
  },
  created() {
    this.getbankcar();
  },
  methods: {
    setnumber() {
      this.value = (this.value - 0).toFixed(2)
    },
    gotobind() {
      this.$router.push('/addcar')
    },
    showpicker() {
      this.visibility1 = true;
    },
    onchange1(val) {
      let vm = this;
      for (var key in vm.oldlist) {
        if (val[0] == vm.oldlist[key].bankName) {
          vm.selector = vm.oldlist[key];
          vm.bankCode = vm.oldlist[key].bankCode;
        }
      }
    },
    getbankcar() {
      let vm = this;
      this.unitAjax('post', '/api/userCenter/charge/quickBankList', {}, res => {
        let arr = [];
        if (res.result) {
          if (res.data.length == 0) {
            this.showbank = true;
            return;
          } else {
            vm.oldlist = res.data;
            vm.selector = res.data[0];
            vm.bankCode = res.data[0].bankCode;
          }


          //取出数据重新加入数组
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].bankName)
          }
          vm.list = [arr];
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
               vm.removeValue("token");
            vm.removeValue("userId");
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }
      })
    },
    sendmoney(bankCode) {
      this.loading.show = true;
      this.unitAjax("post", '/api/userCenter/charge/quickPay', { money: this.value, bankCode: bankCode }, res => {
        if (res.result) {
          let url = res.data.extraInfo;
          window.location.href = url;
          this.loading.show = false;
        }
        else {
          this.msg = res.msg;
          this.loading.show = false;
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.paymain {
  background: #f7f7f7;
  .err {
    padding: 0.32rem;
    color: #fe6d58;
  }
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
    }
    span {
      margin-left: 0.41rem;
      font-size: 0.24rem;
      line-height: 0.5rem;
      display: block;
      color: #9ea1b2;
    }
  }
  .title {
    background: #f7f7f7;
    height: 0.65rem;
    padding-left: 0.35rem;
    span {
      font-size: 0.24rem;
      color: #9ea1b2;
      display: block;
      line-height: 0.65rem;
    }
  }
  .inputText {
    height: 0.92rem;
    line-height: 0.92rem;
    background: #fff;
    padding-left: 0.32rem;
    input {
      height: 0.8rem;
      background: #fff;
      width: 90%;
      border: 0;
      font-size: 0.24rem;
      padding-left: 0.32rem;
    }
  }
  .passwordInput {
    margin-top: 0.2rem;
  }
}
//没有银行卡时
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
