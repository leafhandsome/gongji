<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">转账中心</h2>
    </div>

    <div class="paymain">
      <div class="selBank">
        <span class='bankname'>收款账号</span><input type="text" placeholder="请输入收款人账号" v-model="toUserName" @blur="seterr"
        >
      </div>

      <div class="withdraw">
        <div class="title"><span>转账金额</span></div>
        <div class="inputText" >
           <span>￥</span>
          <input type="tel" placeholder="请输入转账金额" v-model="num" @blur="setnumber" class="inputNum"
          onkeyup="if(this.value==this.value2)return;if(this.value.search(/^\d*(?:\.\d{0,2})?$/)==-1)this.value=(this.value2)?this.value2:'';else this.value2=this.value;">
        </div>
        <div class="balance">
           <p>可转账{{(balance-0).toFixed(2)}}元</p>
           <p class="alltx" @click="allfun">全部转账</p>
        </div>
      </div>
      <p class="error" v-text="err"></p>
      <div class="submitBtn " :class='isnum' @click="showconfirm">
        <p>确定</p>
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
import { Confirm } from 'vux';
export default {
  data() {
    return {
      num: '',
      submitBtn: "submitBtn-disable",
      balance: '0.00',
      show: false,
      toUserName: '',
      err: '',
      showToast: false,
      ToastText: '',
      ToastPosition: ''
    }
  },
  components: {
    Confirm,
  },
  computed: {
    isnum() {
      return this.num ? "submitBtn-ativice" : "submitBtn-disable";
    }
  },
  created(){
    this.getuser();
  },
  methods: {
       setnumber() {
      this.num = (this.num - 0).toFixed(2)
    },
    seterr(){
      if(!(/^[a-zA-Z0-9_-]{5,20}$/.test(this.toUserName))){
           this.showToast = true;
          this.ToastText = '收款人账号只能输入英文字母或数字';
      }
    },
    allfun() {
      this.num =(this.balance-0).toFixed(2);
    },
    showconfirm: function () {
      if(/^[a-zA-Z0-9_-]{5,20}$/.test(this.toUserName)&&parseFloat(this.num)<parseFloat(this.balance)){
         this.show = true;
      }else{
        if(parseFloat(this.num)>parseFloat(this.balance)){
           this.showToast = true;
          this.ToastText = '转账余额不足';
        }else{
          this.showToast = true;
          this.ToastText = '收款人账号只能输入英文字母或数字';
        }
          
      }
     
    },
      //获取可提现金额
       getuser() {
      this.unitAjax("post", '/api/userCenter/index', {}, res => {
        if(res.result){
          this.balance = res.data.canCashMoney;
        }else{
              if (res.operateCode == 100) {
          this.showToast = true;
          this.ToastText = '登录信息已过期，请重新登录';
          setTimeout(() => {
             this.$router.push('/loginpage')
          }, 1000);

        }
        }
      });
    },
    onConfirm: function (val) {
      this.unitAjax("post", '/api/userCenter/transfer/tranMoney', { toUserName: this.toUserName, tranMoney: this.num, accountPwd: val }, res => {
        if (res.result) {
          this.$router.replace({ path: 'transfersucess' })
        } else {
          this.err = res.msg;
        }
      });

    }
  }
}
</script>
<style lang="scss" scoped>
.paymain {
  background: #f7f7f7;
  .selBank {
    margin-top: 0.2rem;
    width: 100%;
    height: 1.5rem;
    position: relative;
    background: #fff;
    img {
      float: left;
      width: 0.88rem;
      height: 0.88rem;
      margin: 0.46rem 0.35rem;
    }
    .bankname {
      margin-top: 0.6rem;
      margin-right: 0.41rem;
      font-size: 0.26rem;
      color: #000;
    }
    span {
      margin-left: 0.41rem;
      font-size: 0.24rem;
      line-height: 0.5rem;
      display: inline-block;
      color: #9ea1b2;
    }
    input {
      border: none;
      width: 65%;
      height: 70%;
      margin-top: 0.3rem;
      font-size: 0.26rem;
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
        color: #2b304b;
        display: block;
      }
    }
    .inputText {
      height: 1.2rem;
      line-height: 1.2rem;
      background: #fff;
      padding-left: 0.31rem;
      span {
        font-size: 0.6rem;
      }
      input {
        height: 0.6rem;
        background: #fff;
        width: 80%;
        border: 0;
        color: #2b304b;
        font-size: 0.6rem;
        padding-left: 0.32rem;
        margin-top: 0.1rem;
      }
      /*input提示语样式*/
      input:-ms-input-placeholder {
        color: #a9a9a9;
        font-size: 0.32rem;
        padding-top: 0.2rem;
      } /* Internet Explorer 10+ */
      input::-webkit-input-placeholder {
        color: #a9a9a9;
        font-size: 0.32rem;
        padding-top: 0.2rem;
      } /* WebKit browsers */
      input::-moz-placeholder {
        color: #a9a9a9;
        font-size: 0.32rem;
        padding-top: 0.2rem;
      } /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #a9a9a9;
        font-size: 0.32rem;
        padding-top: 0.2rem;
      } /* Mozilla Firefox 19+ */
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
</style>
