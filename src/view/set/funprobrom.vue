<template>
  <div class="container">
    <div v-show="showcontent">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">找回密码</h2>
      </div>
      <div v-show="!list.question1">
      <div class="jianju">
       账号
      </div>
      <div class="from"> 
          <div class="pwd oddpwd">
             
          <input  type="text" placeholder="请输入您的账号" v-model="setname" > 
          </div>           
         </div>
        <div class="setok">
             <button @click="getlist" :class="setname?'active':''">下一步</button>  
         </div> 
         </div>
         <div v-show="list.question1">
      <div class="from"> 
                 <div class="probrom"><span>问题一：</span><span class="probrom-get" v-html="list.question1"></span></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan1" > 
          </div>     
         </div>
     
         <div class="from"> 
                 <div class="probrom" ><span>问题二：</span><span class="probrom-get" v-html="list.question2"></span></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan2" > 
          </div>     
         </div>
           <div class="from"> 
                 <div class="probrom"><span>问题三：</span><span class="probrom-get" v-html="list.question3">请选择</span></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan3" > 
          </div>     
         </div>
           <div class="setok">
             <button @click="question" :class="setname?'active':''">下一步</button>  
         </div>  
        </div>
                          <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
</div>
  </div>
</template>
<script>
import store from '../../store/index'
export default {
  data() {
    return {
      setname: store.state.username,
      list: {},
      daan1: '',
      daan2: '',
      daan3: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      param: this.$route.params.param,
      showcontent:false,
    }
  },
  created() {
    if (store.state.username) {
      this.getlist()
    }else{
       this.showcontent=true;
    }
  },
  methods: {
    question() {
      this.unitAjax('post', '/api/account/validPasswordQuestion', { userName: this.setname, answer1: this.daan1, answer2: this.daan2, answer3: this.daan3, }, res => {
        if (res.result) {
          store.state.username = this.setname;
          if (this.param == 'true') {
            this.$router.push('/restmoneypwd')
          } else {
            this.$router.push('/restloginpwd')
          }

        } else {
          this.showToast = true;
          this.ToastText = res.msg;
        }
      })
    },
    getlist() {
      this.unitAjax('post', '/api/account/getPasswordQuestion', { userName: this.setname }, res => {
        if (res.result) {
          this.list = res.data;
          this.showcontent=true;
        } else {
          this.showToast = true;
          this.ToastText = res.msg;
           this.showcontent=true;
        }
      })
    },
  }
}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  .jianju {
    height: 0.66rem;
    line-height: 0.66rem;
    font-size: 0.24rem;
    color: rgb(158, 161, 178);
    padding-left: 0.32rem;
  }
  .from {
    .oddpwd {
      margin-top: 0;
      input {
        float: left;
        font-size: 0.26rem;
        padding-left: 0.31rem;
        color: #3f4557;
      }
      span {
        margin: 0.1rem;
        float: right;
        width: 1.92rem;
        height: 0.71rem;
        font-size: 0.26rem;
        line-height: 0.71rem;
        color: rgb(202, 204, 212);
        background-color: #ececec;
      }
    }
  }

  .pwd {
    background-color: white;
    height: 0.92rem;
    text-decoration: 0.02rem;
    line-height: 0.92rem;
    margin-top: 0.2rem;
    span {
      padding-left: 0.32rem;
    }
    input {
      height: 100%;
      border: none;
      padding: 0;
      font-size: 0.26rem;
      color: rgb(202, 204, 212);
    }
  }
  input {
    width: 75%;
    height: 100%;
    border: none;
    padding: 0;
    font-size: 0.26rem;
    color: rgb(202, 204, 212);
    color: #3f4557;
  }
  .probrom {
    padding-left: 0.31rem;
    height: 0.92rem;
    line-height: 0.92rem;
    background-color: white;
    margin-top: 0.2rem;
    position: relative;
    img {
      position: absolute;
      top: 0.31rem;
      right: 0.31rem;
      width: 0.18rem;
      vertical-align: middle;
    }
    .probrom-get {
      font-size: 0.26rem;
      color: rgb(63, 69, 87);
    }
  }
  .daan {
    padding-left: 0.31rem;
    height: 0.92rem;
    line-height: 0.92rem;
    background-color: white;
  }
  .setok {
    margin-top: 1.07rem;
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
    .active {
      background-color: #007aff;
      color: white;
    }
  }
}
</style>

