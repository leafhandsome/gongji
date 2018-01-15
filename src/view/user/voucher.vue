<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn"  @click="$router.go(-1)">
      </div>
      <h2 class="header-title">充值中心 <div class="header-right" @click="$router.push('payRecord')">充值记录</div></h2>
    </div>
    <div class="voucherlist">
       <ul>
         <li v-for="(item,index) in voucherlist" :key="index" class="border-b1" @click="routo(item.payName,item.payFlag,item.maxMoney,item.minMoney)">
           <img v-bind="{src:item.payIcon}">
            <span v-text="item.payName"></span>
           <span class="islink"></span>
         </li>
       </ul>
    </div>
              <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
  </div>
</template>
<script>
import { imgBaseUrl } from '../../config/env';
import { Alert } from 'vux';
export default {
  components: {
    Alert,
  },
  data() {
    return {
      voucherlist: [],
      imgBaseUrl: imgBaseUrl,
      showToast: false,
      ToastText: '',
      ToastPosition: ''
    }
  },
  created() {
    this.getvoucher();
    this.stopBodyScroll(false);
  },
  methods: {
    getvoucher() {
      this.unitAjax("post", '/api/userCenter/charge/list', {}, res => {
        if (res.operateCode == 100) {
           this.showToast = true;
          this.ToastText = '登录信息已过期，请重新登录';
          setTimeout(() => {
             this.$router.push('/loginpage')
          }, 1000);
        }
        this.voucherlist = res.data;
      })

    },
    routo(key, payFlag,maxMoney,minMoney) {
      switch (key) {
        case '支付宝':
          this.$router.push('voucherzhi/' + payFlag+'/'+maxMoney+'/'+minMoney)
          break;
        case "微信":
          this.$router.push('paywecthar/' + payFlag+'/'+maxMoney+'/'+minMoney)
          break;
        case "QQ钱包":
          this.$router.push('payqq/' + payFlag+'/'+maxMoney+'/'+minMoney)
          break;
        case "卡密支付":
            this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('paycard/' + payFlag)
          break;
        case "快捷支付":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('paykuaijie/' + payFlag+'/'+maxMoney+'/'+minMoney)
          break;
        case "银行卡转账":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('banktomoney/' + payFlag)
          break;
        case "支付宝转银行卡":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('tobank/' + payFlag)
          break;
        case "代理支付":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('payproxy/' + payFlag)
          break;
        case "京东支付":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('paywecthar/' + payFlag)
          break;
        case "银联扫码支付":
           this.showToast = true;
          this.ToastText = '功能暂未开放';
          // this.$router.push('paywecthar/' + payFlag)
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header-right {
  top: 20%;
  line-height: 0.65rem;
  font-weight: 400;
  font-size: 0.28rem;
}
.voucherlist {
  background: #fff;
  ul li {
    width: 100%;
    height: 1rem;
    position: relative;
    img {
      float: left;
      width: 0.6rem;
      height: 0.6rem;
      margin-top: 0.2rem;
      margin-left: 0.35rem;
    }
    span {
      line-height: 1rem;
      margin-left: 0.41rem;
      font-size: 0.24rem;
    }
  }
}
</style>
