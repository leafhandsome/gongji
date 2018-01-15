<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">{{SetPwdQuestion=='true'?'修改密保':'密保设置'}}</h2>
      </div>
      <div  v-show="SetPwdQuestion=='true'">
            <div class="binded">密保已绑定</div>
             <div class="setok" >
             <button class="active" @click="setqusetion">修改密保</button>
         </div>
         <router-link to="/fontquestion">
             <div class="over">
             <span>忘记密保</span>
         </div>
         </router-link>
      </div>
      <div v-if="showqusetion">
            <div style="display: none">
       <popup-picker title="请选择" :data="listquestion" v-model="values" value-text-align="left" :show.sync="visibilityed" @on-change='changequestion'></popup-picker>
     </div>
          <div class="from"> 
                 <div class="probrom" @click="showpick"><span>问题：</span><span class="probrom-get" v-html="question"></span><img src="../../assets/images/down-icon.png" alt=""></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan" > 
          </div>     
         </div>
           <div class="setok" >
             <button class="active" @click="setqusetionnext">下一步</button>
         </div>
      </div>
    <div v-if="showset||SetPwdQuestion=='false'">
        <div style="display: none">
       <popup-picker title="请选择" :data="list"  value-text-align="left" :show.sync="visibility1" @on-change='onchange1'></popup-picker>
     </div>
      <div class="from"> 
                 <div class="probrom" @click="showpicker"><span>问题一：</span><span class="probrom-get" v-html="probrom1"></span><img src="../../assets/images/down-icon.png" alt=""></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan1" > 
          </div>     
         </div>
           <div style="display: none">
       <popup-picker title="请选择" :data="list" v-model="value2" value-text-align="left" :show.sync="visibility2" @on-change='onchange2'></popup-picker>
     </div>
         <div class="from"> 
                 <div class="probrom" @click="showpicker2"><span>问题二：</span><span class="probrom-get" v-html="probrom2"></span><img src="../../assets/images/down-icon.png" alt=""></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan2" > 
          </div>     
         </div>
              <div style="display: none">
       <popup-picker title="请选择" :data="list" v-model="value3" value-text-align="left" :show.sync="visibility3" @on-change='onchange3'></popup-picker>
     </div>
           <div class="from"> 
                 <div class="probrom" @click="showpicker3"><span>问题三：</span><span class="probrom-get" v-html="probrom3">请选择</span><img src="../../assets/images/down-icon.png" alt=""></div> 
        <div class="daan">  
            <span>答案：</span>        
          <input  type="text" placeholder="请输入对应的答案" v-model="daan3" > 
          </div>     
         </div>
           <div class="setok" >
             <button :class="probrom1&&daan1&&probrom2&&daan2&&daan3&&probrom3?'isactive':''" @click="setprobrom"> 确定</button>
         </div>
    </div> 
           <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div> 
  </div>
</template>
<script>

const visibility = false;
const visibilityed = false;
const visibility1 = false;
const visibility2 = false;
const visibility3 = false;
export default {
  data() {
    return {
      setname: '',
      value: '',
      values: ['请选择'],
      value2: ['请选择'],
     
      value3: ['请选择'],
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      visibility3: visibility3,
      visibilityed: visibilityed,
      list: [['你母亲的姓名', '父亲的姓名', '你配偶的姓名']],
      listquestion: [['你母亲的姓名', '父亲的姓名', '你配偶的姓名']],
      probrom1: '请选择',
      daan1: '',
      probrom2: '请选择',
      daan2: '',
      probrom3: '请选择',
      daan3: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      SetPwdQuestion: this.$route.params.question,
      showqusetion: false,
      showset: false,
      valuequstion: [''],
      question: '请选择',
      answer1: '',
      answer2: '',
      answer3: '',
      listnum: [],
      number: 0,
      daan: '',
    }
  },
  created() {
    this.getlist();
  },
  methods: {
    setqusetionnext() {
      if (this.number == '0') {
        this.answer1 = this.daan;
        this.answer2='';
        this.answer3='';
      }
      if (this.number == '1') {
        this.answer2 = this.daan;
         this.answer1='';
        this.answer3='';
      }
      if (this.number == '2') {
        this.answer3 = this.daan;
         this.answer1='';
        this.answer2='';
      }
      this.unitAjax('post', '/api/account/checkPwdQuestion', { answer1: this.answer1, answer2: this.answer2, answer3: this.answer3 }, res => {
        if (res.result) {
          this.showqusetion = false,
            this.showset = true;
        } else {
          this.showToast = true;
          this.ToastText = res.msg;
        }
      })
    },
    setqusetion() {
      this.showqusetion = true;
      this.SetPwdQuestion = false;
    },
    setprobrom() {
      if (this.probrom1 !== '请选择' && this.probrom2 !== '请选择' && this.probrom3 !== '请选择') {
        this.unitAjax('post', '/api/userCenter/setUp/savePasswordQuestion',
          { question1: this.probrom1, question2: this.probrom2, question3: this.probrom3, answer1: this.daan1, answer2: this.daan2, answer3: this.daan3, }, res => {

            if (res.result) {
              this.$router.push('/transfersucess')
            } else {
              this.showToast = true;
              this.ToastText = res.msg;
            }
          })
      } else {
        this.showToast = true;
        this.ToastText = '请选择问题';
      }
    },
    getlist() {

      this.unitAjax('post', '/api/userCenter/setUp/getPasswordQuestions', {}, res => {
        if (res.result) {
          this.list = [res.data];
          this.listquestion = [res.data]
          this.question = res.data[0];
          this.newval = [res.data[0]];
          this.values = [res.data[0]];
          this.listnum = res.data;
        }
      })
    },
    showpick() {
      this.visibilityed = true;
    },
    showdate() {
      this.visibility = true;
    },
    showpicker() {
      this.visibility1 = true;
    },
    showpicker2() {
      this.visibility2 = true;
    },
    showpicker3() {
      this.visibility3 = true;
    },
    changequestion(val) {
      let vm = this;
      this.question = val[0];
      for (var key in vm.listnum) {
        if (this.question == vm.listnum[key]) {
          this.number = key;
        }
      }
    },
    onchange1(val) {
      let prop = this.probrom1;
        if (val[0] == null) {
        this.probrom1 = prop
        return false;
      }
      if (val[0] == this.probrom1) {
        this.probrom1 = this.newval[0]
      } else {
        this.probrom1 = val[0];
        if (prop == '请选择') {
          this.removeArrVal(this.list[0], this.probrom1);
          return false;
        } else {
          this.list[0].push(prop)
        }
      }

      this.removeArrVal(this.list[0], this.probrom1);

    },
    onchange2(val) {
      let prop = this.probrom2;
        if (val[0] == null) {
        this.probrom2 = prop
        return false;
      }
      if (val[0] == this.probrom2) {
        this.probrom2 = this.newval[0]
      } else {
        this.probrom2 = val[0];
        if (prop == '请选择') {
          this.removeArrVal(this.list[0], this.probrom2);
          return false;
        } else {
          this.list[0].push(prop)
        }
      }

      this.removeArrVal(this.list[0], this.probrom2);
    }
    ,
    onchange3(val) {
      let prop = this.probrom3;
      if (val[0] == null) {
        this.probrom3 = prop
        return false;
      }
      if (val[0] == this.probrom3) {
        this.probrom3 = this.newval[0]
      } else {
        this.probrom3 = val[0];
        if (prop == '请选择') {
          this.removeArrVal(this.list[0], this.probrom3);
          return false;
        } else {
          this.list[0].push(prop)
        }
      }

      this.removeArrVal(this.list[0], this.probrom3);
    }
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
    margin-top: 0.6rem;
    button {
      display: block;
      width: 90%;
      height: 0.8rem;
      margin: 0 auto;
      border: none;
      color: #caccd4;
      background-color: #ececec;
    }
    .isactive {
      background-color: #4584f5;
      color: white;
    }
  }
  .binded {
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    border: 1px solid #efefef;
    background-color: #fff;
  }
  .setok {
    margin-top: 1.74rem;
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
  .over {
    width: 6.84rem;
    margin: 0 auto;
    span {
      padding-top: 0.25rem;
      float: right;
      border: none;
      color: rgb(33, 148, 255);
      font-size: 0.24rem;
    }
  }
}
</style>

