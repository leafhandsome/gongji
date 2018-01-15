<template>
 <div class="container">
    <div v-if="show" class="tishi">
            <div class="kuan-bindmobil">
                 <div class="del" v-if="show" @click="isshow"><img src="../../assets/images/weixin/icon-del.png" alt=""></div>
                <div class="header-bind">
                    <span @click="$router.go(-1)"></span>
                    <img src="../../assets/images/weixin/gongji.png" alt="">
                </div>
                <div class="kuan-text">绑定手机</div>
                <form action="" class="form-content">
                    <div class="text-photo">  <input type="number" placeholder="18802097807" v-model="mobile" onKeyUp="value=value.replace(/\D/g,'').substring(0,12)"></div>   
                    <div class="text-pwd"> <input type="number" placeholder="97807" v-model="tonum" onKeyUp="value=value.replace(/\D/g,'').substring(0,6)">
                    <button @click="getsmscode" class="code-btn" :disabled="!show">
                <span :class="mobile?'active':''">发送验证码</span>
              
             </button>  
                    </div>
                       <ul class="error"><li v-for="(err,index) in errors" v-text="err" class="errorColor" :key="index"></li></ul>
                    <button class="text-true" @click="showok" v-text="count"></button>
                </form>
             
            </div>
        </div>   
 </div>  
</template>
<script>
const TIME_COUNT = 60;
export default {
    data() {
        return {
            show: true,
            mobile: "",
            tonum: "",
            num:"3s",
             number:60,
              showsms: true,
            count: '',
            timer: null,
        }
    },
    vuerify: {
        userId: {
            test: /^1[3|4|5|7|8][0-9]{9}$/, // 自定义规则，可以是函数，正则或者全局注册的规则（填字符串）
            message: "输入手机号码不正确"
        },
        token: {
            test: /^[0-6]*$/,
            message: "验证码不正确"
        }
    },
      computed:{
         errors() {
      return this.$vuerify.$errors;
    },
  },
    methods: {
        isshow() {
            this.show = false;
        },
        showok() {
            this.show = false;
        },
      // 获取验证码
           getsmscode() {
      this.unitAjax('post', '/api/userCenter/setUp/sendBindPhoneSmsCode', { mobile: this.mobile }, res => {
        if (res.result == false) {
          alert(res.msg)
        }
        if (res.result) {
          //倒计时
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.showsms = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
        }
      })
    },
    }
}

</script>
<style lang="scss" scoped>
.tishi {
  width: 100%;
  height: 13.14rem;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 555;
  top: 0;
  .header-bind {
    span:after {
      content: " ";
      display: inline-block;
      height: 0.3rem;
      width: 0.3rem;
      border-width: 0.03rem 0.03rem 0 0;
      border-color: #afb1bf;
      border-style: solid;
      transform: rotate(224deg);
      position: absolute;
      top: 0.7rem;
      left: 0.5rem;
    }
    img {
      width: 1.67rem;
      height: 1.67rem;
      margin: 0 auto;
    }
  }
  .kuan-bindmobil {
    opacity: 1;
    width: 5.81rem;
    height: 6.93rem;
    margin: 0 auto;
    margin-top: 3.4rem;
    text-align: center;
    background-color: white;
    border-radius: 10px;
    color: #9ea1b2;
    position: relative;
    .del {
      position: absolute;
      top: -0.8rem;
      right: 0;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      color: white;
    }
    .kuan-text {
      margin-top: 0.19rem;
    }
    .form-content {
         .error{
        font-size: 0.24rem;  
        color: #fe6d58;
      }
      input {
        border: none;
        height: 0.8rem;
      }
      div {
        width: 4.92rem;
        height: 0.86rem;
        line-height: 0.86rem;
        margin: 0 auto;
        box-shadow: 0 0 10px #f4f4f4;
        border-radius: 1rem;
        border: 1px solid #f4f4f4;
      }
      .text-photo {
        margin-top: 0.59rem;
        width: 4.92rem;
        text-align: left;
        padding-left: 0.4rem;
      }
      .text-pwd {
        width: 5.32rem;
        margin-top: 0.23rem;
        input {
          float: left;
          width: 2.8rem;
          margin-left: 0.4rem;
        }
        button {
          padding: 0;
          border: none;
          background-color: white;
          color: rgb(83, 204, 253);
        }
      }
      .text-true {
        width: 0.9rem;
        height: 0.9rem;
       position: absolute;
       bottom: .4rem;
       transform: translate(-50%);
        border-radius: 50%;
        border: none;
        background-color: #a4a4a4;
        color: #fff;
        font-size: 0.26rem;
      }
    }
  }
 .code-btn {
    border: none;
    background-color: white;
    padding: 0;
    float: right;
     margin-right: .38rem;
     margin-top: .04rem;
    span{
      display: inline-block;
        height: 0.8rem;
        line-height: .8rem;
       
    }
  }
}
</style>
