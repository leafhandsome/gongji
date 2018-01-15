<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">提现中心</h2>
      <div class="header-right" @click="$router.push('withdrawRecord')">提现记录</div>
    </div>
    <div class="withdrawlist">
       <ul>
         <li v-for="(item,index) in withdraw" :key="index" class="border-b1" @click="withdrawbank(item.cashFlag,item.minMoney,item.maxMoney,item.needBindPhone)">
           <img :src="item.cashLogo">
            <span v-text="item.showName"></span>
            <span class="islink" v-show="item.cashFlag=='bankcard'"></span>
         </li>

       </ul>
    </div>
    <!-- 提示框 -->
    <div class="draw-nobind" v-show="showdraw&&bindphone">
        <div class="draw-kuan">
          <div class="draw-title" v-text="bindphone"></div>
          <div class="draw">
            <div class="draw-true" @click="torouter(bindphone)">确定</div>
            <div class="draw-false" @click="draw">取消</div>
          </div>
        </div>
    </div>
               <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
  </div>
</template>


<script>
import store from '../../store/index';
export default {
  data() {
    return {
      withdraw: [],
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      bindphone: '',
      showdraw: true,
      hasBindBank: false,
      hasCreateAccountPwd: false,
      mobile: ''
    }
  },
  created() {
    this.getsetting();
    this.getmoney();
  },
  methods: {
    torouter(bindphone) {
      if (bindphone == '请先设置资金密码，再提现。') {
        this.$router.push('/setmoney/false/' + store.state.probrom)
      }
      if (bindphone == '请先绑定手机，再提现。') {
        this.$router.push('/bindphoto')
      }
      if (bindphone == '请先绑定银行卡，再提现。') {
        this.$router.push('/addcar')
      }
      if (bindphone == '请先绑定支付宝，再提现。') {
        this.$router.push('/bindzhifu/' + this.hasCreateAccountPwd)
      }
    },
    draw() {
      this.showdraw = false;
    },
    getsetting() {
      this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {

        if (res.result) {
          this.hasBindBank = res.data.hasBindBank;
          this.hasCreateAccountPwd = res.data.hasCreateAccountPwd;
          this.hasBindAlipayAccount = res.data.hasBindAlipayAccount;
          this.mobile = res.data.mobile;
          if (res.data.hasCreateAccountPwd == false) {
            this.bindphone = '请先设置资金密码，再提现。'
          }

        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }

      })
    },
    withdrawbank(key, minMoney, maxMoney, needBindPhone) {
      if (needBindPhone&&this.mobile=='') {
        this.bindphone = '请先绑定手机，再提现。';
        this.showdraw = true;
      } else {
        switch (key) {
          case "bankcard":
            if (this.hasBindBank) {
              this.$router.push('withdrawbank/' + minMoney + '/' + maxMoney)
            } else {
              this.bindphone = '请先绑定银行卡，再提现。';
              this.showdraw = true;
            }
            break;
          case "alipay":
            if (this.hasBindAlipayAccount) {
              this.$router.push('withdrawalipay/' + minMoney + '/' + maxMoney)
            } else {
              this.bindphone = '请先绑定支付宝，再提现。';
              this.showdraw = true;
            }
            break;
        }
      }



    },
    getmoney() {
      this.unitAjax('post', '/api/userCenter/cash/cashTypeList', {}, res => {
        if (res.result) {
          this.withdraw = res.data;
          if (res.data[0].needBindPhone&&this.mobile=='') {
            this.bindphone = '请先绑定手机，再提现。'
          };
        } else {
          if (res.operateCode == 100) {
            this.showToast = true;
            this.ToastText = '登录信息已过期，请重新登录';
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
.header-right {
  top: 30%;
  line-height: 0.65rem;
}
.withdrawlist {
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
    .islink {
      float: right;
      margin-right: 0.7rem;
    }
  }
}
.draw-nobind {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  .draw-kuan {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%);
    background-color: #fff;
    width: 5.4rem;
    height: 2.24rem;
    text-align: center;
    border-radius: 0.1rem;
    .draw-title {
      height: 1.5rem;
      line-height: 1.5rem;
      border-bottom: 1px solid #efefef;
      font-size: 0.34rem;
      color: black;
    }
    .draw {
      color: #007aff;
      height: 0.74rem;
      .draw-true {
        width: 50%;
        float: left;
        border-right: 1px solid #efefef;
        box-sizing: border-box;
        line-height: 0.74rem;
      }
      .draw-false {
        width: 50%;
        float: right;
        box-sizing: border-box;
        line-height: 0.74rem;
      }
    }
  }
}
</style>
