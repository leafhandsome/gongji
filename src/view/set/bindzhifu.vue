<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">绑定支付宝</h2>
      </div>
      <div v-show="!alipayAccount||bindshow==false">
      <div class="jianju">
         请输入真实中文名字，否则会导致提现失败
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
              <span>真实姓名:</span>
          <input v-show="!realname" type="text" placeholder="请输入真实姓名" v-model="setname" @blur="setnameblur"> 
            <span class="realname" v-show="realname">{{realname}}</span>
          </div>      
            <div class="pwd">
              <span>支付宝账号:</span>
          <input class="oddpwd" type="name" placeholder="请输入支付宝账号" v-model="setuser" style="ime-mode: disabled;" @blur="setzhifubao"> 
          </div>
           <div class="pwd">
              <span>资金密码：</span>
          <input class="oddpwd" type="password" placeholder="请输入资金密码" v-model="setpwd" > 
          </div>
         </div>
         <div class="setok">
             <button :class="(setname||realname)&&setuser&&setpwd?'active':''" @click="isshow">确认</button>
          
         </div> 
         </div>
         <div v-show="alipayAccount&&bindshow" class="alipay">
                <div class="alipaycontent">
                    <div class="payheight">您已绑定支付宝</div>
                    <p class="weit payheight" v-text="tozhifubao(alipayAccount)"></p>
                </div>
                <div class="setok">
             <button class="clear" @click="clearbind">解除绑定</button>
          
         </div>
         </div>
           <div >
        <confirm v-model="show" show-input title="请输入资金密码" @on-confirm="onConfirm" @on-show="onshow">
        </confirm>
      </div>
            <!-- 提示框 -->
    <div class="draw-nobind" v-show="showbindzhifu">
        <div class="draw-kuan">
          <div class="draw-title">请先绑定资金密码</div>
          <div class="draw">
            <div class="draw-true" @click="$router.push('/setmoney/'+false+'/'+false)">确定</div>
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
import { Confirm } from 'vux';
import store from '../../store/index';
export default {
  components: {
    Confirm,
  },
  data() {
    return {
      setname: '',
      setuser: '',
      setpwd: '',
      alipayAccount: '',
      show: false,
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      showbindzhifu: false,
      realname: store.state.realname,
      bindshow:true,
    }
  },
  created() {
    this.getzhifu()
  },
  methods: {
    setnameblur() {
      if (!(/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/.test(this.setname))) {
        this.showToast = true;
        this.ToastText = '只能输入真实姓名中文、英文、数字1-5位';
      }
    },
    setzhifubao() {
      if (/[\u4e00-\u9fa5]{5,20}/.test(this.setuser)) {
        this.showToast = true;
        this.ToastText = '请输入支付宝账户名5-20 位英文字母或数字';
      }
    },
    // 点击取消隐藏弹框
    draw() {
      this.showbindzhifu = false;
    },
    clearbind() {
      this.show = true;
    },
    onConfirm: function (val) {
      if(/^(\w){6,20}$/.test(val)){
      this.unitAjax('post', '/api/userCenter/setUp/deleteAlipayAccount', { accountPwd: val }, res => {
        if (res.result) {
         this.bindshow=false;
        } else {
          this.showToast = true;
          this.ToastText = res.msg;   
        }
      })
      }else{
           this.showToast = true;
          this.ToastText = '请输入资金密码6-20个字母和数字';
      }
    },
    getzhifu() {
      if (this.$route.params.accountPwd == 'false') {
        this.showbindzhifu = true
      }
      this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {
        if (res.result) {
          this.alipayAccount = res.data.alipayAccount
        }
      })
    },
    isshow() {
      if ((/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/.test(this.setname)) && !(/[\u4e00-\u9fa5]{5,20}/.test(this.setuser))) {
        if(this.realname){
          this.setname=store.state.realname;
        }
        this.unitAjax('post', '/api/userCenter/setUp/bindAlipay',
          { alipayAccount: this.setuser, realName: this.setname, accountPwd: this.setpwd }, res => {
            if (res.result == false) {
              this.showToast = true;
              this.ToastText = res.msg;
            }
            if (res.result) {
              store.state.realname = this.setname;
              this.$router.push('/transfersucess')
            }
          })
      }else{
         this.showToast = true;
              this.ToastText = '只能输入中文、英文、数字';
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.container {
  .jianju {
    height: 0.56rem;
    line-height: 0.56rem;
    font-size: 0.24rem;
    color: rgb(255, 107, 107);
    text-align: center;
    background-color: #fff;
  }
  .pwd {
    background-color: white;
    height: 0.92rem;
    color: rgb(63, 69, 87);
    line-height: 0.92rem;
    margin-top: 0.2rem;
    .realname{
      padding-left: 0;
    }
    span {
      padding-left: 0.32rem;
    }
    input {
      width: 70%;
      height: 100%;
      border: none;
      padding: 0;
      font-size: 0.26rem;
    }
  }
  .setok {
    margin-top: 0.8rem;
    .active {
      background-color: #007aff;
      color: white;
    }
    button {
      display: block;
      width: 6.84rem;
      height: 0.88rem;
      margin: 0 auto;
      border: none;
      font-size: 0.28rem;
      color: rgb(202, 204, 212);
      background-color: #ececec;
    }
  }
  .tishi {
    width: 100%;
    height: 13.14rem;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    z-index: 555;
    top: 0;
    .kuan {
      opacity: 1;
      width: 5.4rem;
      height: 2.24rem;
      margin: 0 auto;
      margin-top: 3.4rem;
      text-align: center;
      background-color: white;
      border-radius: 10px;
      .kuan-text {
        height: 1.6rem;
        line-height: 1.6rem;

        font-size: 0.34rem;
        color: black;
        border-bottom: 1px solid #d9d9d9;
      }
      .kuan-ture {
        width: 48%;
        float: left;
        border-right: 1px solid #d9d9d9;
        color: #007aff;
      }
      .kuan-false {
        width: 50%;
        float: right;
        color: #007aff;
      }
    }
  }
  .alipay {
    margin-top: 0.2rem;
    text-align: center;
    .alipaycontent {
      padding: 0.5rem;
      background-color: white;
      .weit {
        font-weight: 700;
        color: black;
      }
      .payheight {
        height: 0.8rem;
        line-height: 0.8rem;
      }
    }
    .clear {
      background-color: #007aff;
      color: white;
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
}
</style>

