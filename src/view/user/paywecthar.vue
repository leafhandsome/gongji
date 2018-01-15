<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">微信</h2>
    </div>

    <div class="paymain"  v-if="!erweimashow">
     <div class="title"><span>充值金额</span></div>
     <div class="inputText" >
        <input type="text" v-bind="{placeholder:'请输入充值金额('+minMoney+'-'+maxMoney+'元)'}" v-model="value" @blur="setnumber"
        onkeyup="if(this.value==this.value2)return;if(this.value.search(/^\d*(?:\.\d{0,2})?$/)==-1)this.value=(this.value2)?this.value2:'';else this.value2=this.value;">
     </div>
      <p v-text="msg" class="err"></p>
      <div class="submitBtn " :class='isvalue'>
        <p @click="sendmoney">确定</p>
      </div>
    </div>
     <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
    <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
  <erweima v-if="erweimashow" :send="info"></erweima>
  </div>
</template>


<script>
import erweima from '../set/erweima';
export default {
  components: {
    erweima,
  },
  data() {
    return {
      value: '',
      submitBtn: "submitBtn-disable",
      msg: '',
      info: {},
      erweimashow: false,
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
    }
  },
  methods: {
    setnumber() {
      this.value = (this.value - 0).toFixed(2)
    },
    sendmoney() {
      this.loading.show = true;
      this.unitAjax("post", '/api/userCenter/charge/order', { money: this.value, payFlag: this.$route.params.payFlag }, res => {


        if (res.result) {
          this.info.extraInfo = res.data.extraInfo;
          this.info.payFlag=res.data.payFlag;
          this.erweimashow = true;
          this.loading.show = false;
        } else {
          this.msg = res.msg;
          this.loading.show = false;
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
.paymain {
  background: #f7f7f7;
  .err {
    padding-left: 0.32rem;
    color: #fe6d58;
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
    }
  }
}
</style>
