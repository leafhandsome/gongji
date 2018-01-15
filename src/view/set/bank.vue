<template>
   <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">银行卡
                <span @click="addcar"></span>
             </h2>       
      </div>
      <ul v-show="bankcarlist.length>0">
       <li class="selBank" v-for="(item,index) in bankcarlist" :key="index">
        <p class='bankname' v-text="item.bankName">钟国仁</p>
        <p v-text="tobank(item.bankNo)">123****1236</p>
        <span class="del" @click="delbank(item.userBankId)" >删除</span>
      </li>
        <div >
        <confirm v-model="show" show-input title="请输入资金密码" @on-confirm="onConfirm" @on-show="onshow"> 
        </confirm>
      </div>
      </ul>
      <div v-show="bankcarlist.length==0">
      <div class="bank" >
          <img src="../../assets/images/weixin/yuan.png" alt="">
      </div>
      <div class="bank_content">暂无银行卡信息</div>
      </div>
         <!-- 提示框 -->
    <div class="draw-nobind" v-show="showaddcar">
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
export default {
  components: {
    Confirm,
  },
  data() {
    return {
      bankcarlist: '',
      bankid: 1,
      show: false,
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      accountPwd:this.$route.params.accountPwd,
      showaddcar:false,
    }
  },
  created() {
    this.getbankcar();

  },
  methods: {
    onshow(){
      document.getElementsByClassName('vux-prompt-msgbox')[0].type='password'
    },
    draw(){
      this.showaddcar=false
    },
    addcar(){
      if(this.accountPwd=='true'){
        this.$router.push('/addcar')
      }else{
        this.showaddcar=true
      }
    },
    getbankcar() {
      this.unitAjax('post', '/api/userCenter/setUp/userBankList', {}, res => {
        if(res.result){
             this.bankcarlist = res.data;
        }
      })
    },
    delbank(bankid) {
      this.show = true;
      this.bankid = bankid
    },
    onConfirm: function (val) {
      if(/^(\w){6,20}$/.test(val)){
      this.unitAjax('post', '/api/userCenter/setUp/deleteUserBank', { userBankId: this.bankid, accountPwd: val }, res => {
        if (res.result) {
          this.$router.replace({ path: '/transfersucess' })
        } else {
          this.showToast = true;
          this.ToastText = res.msg;
         if (res.operateCode == 100) {
           setTimeout(() => {
               this.$router.push('/loginpage')
           }, 1000);
         
          }
        }
      })
      }else{
         this.showToast = true;
          this.ToastText = '请输入密码6-20个字母、数字';
      }
    }
  }

}   
</script>
<style lang="scss" scoped>
.container {
  .header {
    span:after {
      content: "+";
      float: right;
      padding: 0.1rem 0.3rem;
      font: 400 0.56rem "微软雅黑";
    }
  }
  .vux-prompt-msgbox{
    ime-mode: disabled;
  }
  .selBank {
    margin-top: 0.2rem;
    width: 100%;
    height: 1.5rem;
    position: relative;
    background: #fff;
    padding: 0.3rem 0.32rem;
    .del {
      position: absolute;
      right: 1.2rem;
      top: 35%;
    }
  }
  li {
    padding: 0 0.32rem;
    p {
      height: 0.8rem;
      line-height: 0.8rem;
    }
  }
  .bank {
    width: 1.72rem;
    height: 1.72rem;
    margin: 0 auto;
    margin-top: 1.64rem;
  }
  .bank_content {
    text-align: center;
    padding-top: 0.5rem;
    font-size: 0.32rem;
    color: #e4e4e4;
  }
  .draw-nobind{
  position: fixed;
  top: 0;
  left:0;
  z-index:5;
  background-color: rgba(0,0,0,.3);
  width: 100%;
  height: 100%;
  .draw-kuan{
    position: fixed;
    top: 35%;
    left:50%;
    transform: translate(-50%);
    background-color: #fff;
    width: 5.4rem;
    height: 2.24rem;
    text-align: center;
    border-radius: .1rem;
    .draw-title{
      height: 1.5rem;
      line-height: 1.5rem;
      border-bottom: 1px solid #efefef;
      font-size: .34rem;
      color:black;
    }
    .draw{
      color:#007AFF;
      height: .74rem;
      .draw-true{
        width: 50%;
        float: left;
        border-right: 1px solid #efefef;
        box-sizing: border-box;
        line-height: .74rem;
      }
      .draw-false{
        width: 50%;
        float:right;
        box-sizing: border-box;
         line-height: .74rem;
      }
    }
  }
}
}
</style>
