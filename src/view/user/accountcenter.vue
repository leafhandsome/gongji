<template>
  <div class="cantainer">
    <div class="header">
      <div class="header-left returnBtn" @click="goout"></div>
      <h2 class="header-title">开户中心</h2>
    </div>
    <div v-if="!erweimashow">
    <div class="tabnav">
       <ul >
         <li @click="selectNav(1)" :class="navvalue==1?'avitice':''">普通开户</li>
         <li @click="selectNav(2)" :class="navvalue==2?'avitice':''">链接开户</li>
       </ul>
    </div>
    <div class="notice-tip">
    </div>

      <!--普通用户-->
     <div class="general" v-if="navvalue==1 && maxUserRate" >
       <div class="accounttype">
         <span>开户类型</span>
         <ul>
           <li @click="selectType(1)"><span :class="typevalue==1?'ativice':''">代理</span></li>
           <li @click="selectType(2)"><span :class="typevalue==2?'ativice':''">会员</span></li>
         </ul>
       </div>
  <form @submit.prevent="handleSubmit">
       <div class="fromEdit">
        
            <div class="from user">
           <span >用户名</span>
           <input type="text" placeholder="请输入用户名(5-20 位英文字母和数字)" v-model="username" @focus="geterr">
              
         </div>
      <div class="from">
           <span >密码</span>
           <input type="password" placeholder="请输入密码(6-20个字母和数字)" v-model="password" @focus="geterr">
         </div>
       
         <div class="from">
           <span >昵称</span>
           <input type="text" placeholder="请输入昵称(1-5个字符/可选)" v-model="name" @focus="geterr">
         </div>
       <p v-show="err&&!$vuerify.check()">提示：用户名或密码不符合规范！</p>
      
       
       </div>
       <div class="center-range">
         <div class="range" >
           <p>下注水位</p>
           <span class="min">{{waterValue}}</span>
           <range v-model="rangeValue" :min="0" :max="maxUserRate" :step="1"></range>
           <span class="max">{{hostoryobj.maxUserRate}}</span>
         </div>
         <div class="range range-fandian">
           <p>返点调节</p>
           <span class="min">{{fanmin}}</span> <range v-model="rangeValue1" :min="0" :max='100' :step="1"></range>
           <span class="max">{{fanmax}}</span>
         </div>
         <div class="range-tip">
           <span class="min">返利</span>
           <span class="max">返奖</span>
         </div>
       </div>
      
      <div class="foot">
         <p class="foot-t" v-show="err&&error" v-text="error"></p>
        <div v-show="download">
       <div class="foot-t">提示：开户成功，游戏下载地址为:</div>
       <div class="foot-t">{{hostoryobj.downloadUrl}}</div>
       </div>
       <div :class="showCopy?'foot-a':'foot-nocopy'">
         <button type="button"
             class="btn-left" v-show="showCopy"
      v-clipboard:copy="hostoryobj.downloadUrl"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">复制下载地址</button>
        <button  @click="handleSubmit">开户</button></div>
      </div>
              <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div> 
         </form>
     </div>
      <!--链接开户-->
      <div class="general" v-if="navvalue==2">
        <div class="accounttype">
          <span>账户类型</span>
          <ul>
            <li @click="selectType(1)"><span :class="typevalue==1?'ativice':''">代理</span></li>
            <li @click="selectType(2)"><span :class="typevalue==2?'ativice':''">会员</span></li>
          </ul>
        </div>
      
        <div class="center-range">
          <div class="range">
            <p>下注水位</p>
            <span class="min">{{waterValue}}</span>
            <range v-model="rangeValue" :min="0" :max="maxUserRate" :step="1"></range>
            <span class="max">{{hostoryobj.maxUserRate}}</span>
          </div>
          <div class="range range-fandian">
            <p>返点调节</p>
            <span class="min">{{fanmin}}</span> <range v-model="rangeValue1" :min="0" :max='100' :step="1"></range>
            <span class="max">{{fanmax}}</span>
          </div>
            <div class="range-tip">
           <span class="min">返利</span>
           <span class="max">返奖</span>
         </div>
        </div>
         <div class="text"><span>备注</span><input type="text" placeholder="请输入备注(20字以内)" v-model="remarkvalue"></div>
          <div class="general-tishi"><span v-text="linkerr">提示：开户成功</span></div>
        <div class="submitBtn submitBtn-ativice">
         
          <p @click="creatlink">生成链接</p>
        </div>
       <div class="hostory"><span>历史链接</span></div>
       <div class="daili" v-for="(item,index) in hostoryobj.urlListItems" :key="index">
         <div class="daili-top clearfix" >
              <div class="top-left">
                <span v-bind="{class:item.userType==1?'show-d':'show-h '}">{{item.userType==1?'代理':'会员'}}</span><span>返点：</span><span>{{item.userRate}}%</span>
              </div>
              <div class="top-right" v-text="item.createDate">2017/11/9 16:36</div>
         </div>
         <div class="beiz-center"><span>备注：</span><span v-text="item.remark"></span></div>
         <div class="daili-bottom">
           <div class="line"></div>
           <button class="dal-left" @click="removelink(item.id)">删除</button>
           <button class="right" @click="getmore(item.spreadUrl)">推广</button>
         </div>
       </div>
        <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
        </div> 
      </div>
      </div>
       <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
       <erweima v-if="erweimashow" :send="info"></erweima>
  </div>
</template>
<script>
import crypto from "crypto";
import erweima from './erweimaurl.vue';
import store from '../../store/index';
export default {
  components: {
    erweima,
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      err: false,
      rangeValue: 0,
      rangeValue1: 100,
      typevalue: 1, //
      navvalue: 1,
      shareshow: false,
      menusshow: false,
      menus: {
        menu1: "失效",
        menu2: "删除"
      },
      hostoryobj: {},
      notice: '',
      info: '',
      erweimashow: false,
      download: false,
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      error: '',
      remarkvalue: '',
      linkerr: '',
      loading: {
        show: false,
        text: '加载中...'
      },
      maxUserRate: 0,
      userRate: store.state.userRate,
      showCopy: false,
    };
  },
  vuerify: {
    username: {
      test: /^[a-zA-Z0-9]{5,20}$/, // 自定义规则，可以是函数，正则或者全局注册的规则（填字符串）
      message: "请输入用户名5-20 位英文字母或数字"
    },
    password: {
      test: /^(\w){6,20}$/,
      message: "请输入密码6-20个字母、数字、下划线"
    }, // 使用全局注册的规则
    name: {
      test: /^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/, // 自定义规则，可以是函数，正则或者全局注册的规则（填字符串）
      message: "请输入昵称，不得含特殊字符"
    }

  },
  computed: {
    waterValue() {
      if (this.rangeValue == 0) {
        return 0;
      }
      return this.rangeValue / 10;
    },
    fanmin() {
      return this.rangeValue1 + "%";
    },
    fanmax() {
      return 100 - this.rangeValue1 + "%";
    },
    errors() {
      return this.$vuerify.$errors; // 错误信息会在 $vuerify.$errors 内体现
    }
  },
  created() {
    this.gethostory();
    this.bl()
  },
  methods: {
    goout() {
      if (this.getStroe('accout') == 'true') {
        this.erweimashow = false;
        this.removeStore('accout');
      } else {
        this.$router.go(-1)
      }

    },
    //删除链接
    removelink(id) {
      this.unitAjax('post', '/api/agent/accountCenter/deleteSpreadUrl', { id: id }, res => {
        if (res.result) {
          this.showToast = true;
          this.ToastText = '删除成功';
          this.gethostory();
        } else {
          this.showToast = true;
          this.ToastText = res.msg;
        }
      })
    },
    //创建开户链接
    creatlink() {
      this.loading.show = true;
      var linkobj = {
        userRate: this.waterValue,
        userType: this.typevalue,
        remark: this.remarkvalue,
        rebate: this.rangeValue1
      }
      this.unitAjax('post', '/api/agent/accountCenter/createSpreadUrl', linkobj, res => {
        if (res.result) {
          this.linkerr = '提示:开户成功！';
          this.gethostory();
          this.loading.show = false;
        } else {
          this.linkerr = res.msg;
          this.loading.show = false;
        }
      })
    },
    onCopy(e) {
      this.showToast = true;
      this.ToastText = '复制成功';
    },
    onError() {
      this.showToast = true;
      this.ToastText = '复制失败';
    },
    //获取焦点错误提示隐藏
    geterr() {
      this.err = false;
      this.download = false;
    },
    // 点击推广
    getmore(hostoryurl) {
      this.setStore('accout', true);
      this.info = hostoryurl;
      this.erweimashow = true;
    },
    bl() {
      this.err = this.$vuerify.check();
    },
    //开户 
    handleSubmit() {
      this.err = true;
      this.download = false;
      if (this.$vuerify.check()) {
        // 手动触发校验所有数据
        // do something
        this.loading.show = true;
        this.vuer = this.$vuerify.check()
        var obj = {
          userName: this.username,
          password: this.password,
          remarkName: this.name,
          userRate: this.waterValue,
          userType: this.typevalue,
          rebate: this.rangeValue1
        }
        this.unitAjax('post', '/api/agent/accountCenter/regUser', obj, res => {
          if (res.result) {
            this.error = '';
            this.err='';
            this.showCopy = true;
            this.download = true;
            this.loading.show = false;
            this.username = '';
            this.password = '';
            this.name = '';
          } else {
            this.error = res.msg;
            this.loading.show = false;
          }
        })
      }
    },
    //历史链接
    gethostory() {
      this.loading.show = true;
      this.unitAjax('post', '/api/agent/accountCenter/index', {}, res => {

        if (res.result) {
          this.loading.show = false;
          this.rangeValue = res.data.maxUserRate * 10;
          this.hostoryobj = res.data;
          this.maxUserRate = res.data.maxUserRate * 10;
        } else {
          this.loading.show = false;
          if (res.operateCode) {
            this.showToast = true;
            this.ToastText = res.msg;
            vm.removeValue("token");
            vm.removeValue("userId");
            setTimeout(() => {
              this.$router.push('/loginpage')
            }, 1000);
          }
        }

      })
    },
    selectType(type) {
      this.typevalue = type;
    },
    selectNav(val) {
      this.navvalue = val;
    },
    /*分享显示和关闭*/
    showShare(boolean) {
      this.shareshow = boolean;
    },
    showmore() {
      this.menusshow = true;
    },
    menueclick(menuKey, menuItem) {
    }
  }
};
</script>

<style lang="scss" scoped>
.cantainer {
  padding-bottom: 0.1rem;
  overflow: hidden;
  .header {
    position: fixed;
    background-color: #fff;
    z-index: 5;
  }
  .tabnav {
    margin-top: 1.08rem;
    background-color: #fff;
    width: 100%;
    height: 0.8rem;
    padding-top: 0.1rem;
    font-size: 0.26rem;
    color: #9799aa;
    ul {
      width: 67%;
      height: 0.68rem;
      margin: 0 auto;
      border-radius: 5px;
      background-color: #f2f2f2;
      li {
        float: left;
        width: 48%;
        text-align: center;
        height: 0.58rem;
        line-height: 0.58rem;
        border-radius: 5px;
        margin: 0.05rem 0 0 0.05rem;
      }
      .avitice {
        background-color: #fff;
        color: #3f4557;
      }
    }
  }
  .notice-tip {
    height: 0.6rem;
    line-height: 0.6rem;
    background-color: #fff;
    color: #fe6d58;
    overflow: hidden;
  }
  .accounttype {
    height: 1.05rem;
    line-height: 1.05rem;
    background-color: #fff;
    margin-top: 0.2rem;
    padding: 0 0.32rem;
    span {
      width: 20%;
      float: left;
    }
    ul {
      width: 80%;
      li {
        width: 35%;
        float: left;
        text-align: center;
        margin-top: 0.2rem;
        span {
          display: block;
          height: 0.62rem;
          line-height: 0.62rem;
          width: 1.51rem;
          border-radius: 5px;
          border: 0.03rem solid #efefef;
        }
        .ativice {
          background-color: #4584f5;
          color: #fff;
        }
      }
    }
  }
  .fromEdit {
    margin-top: 0.2rem;
    padding: 0 0 0 0.3rem;
    background-color: #fff;
    p {
      color: rgb(254, 109, 88);
    }
    .from {
      height: 1.2rem;
      line-height: 1.2rem;
      span {
        width: 20%;
        display: block;
        float: left;
      }
      input {
        height: 0.6rem;
        margin-top: 0.24rem;
        border: 0;
        width: 75%;
        border-bottom: 0.01rem solid #e5e5e5;
      }
      textarea {
        border: 0;
        width: 75%;
        height: 1rem;
      }
    }
    .user {
    }
  }
  .center-range {
    margin-top: 0.2rem;
    padding: 0.3rem 0 0 0.33rem;
    height: 4.25rem;
    background-color: #fff;
    .range {
      padding: 0 0.33rem 0 0;
      position: relative;
      height: 1.2rem;
      p {
        line-height: 0.5rem;
      }
      .min {
        float: left;
        display: block;
        width: 1rem;
        text-align: center;
      }
      .max {
        display: block;
        width: 0.5rem;
        position: absolute;
        right: 0.33rem;
        top: 35%;
        text-align: center;
      }
    }
  }
  .text {
    margin-top: 0.2rem;
    padding-left: 0.33rem;
    height: 1.01rem;
    line-height: 1.01rem;
    background-color: white;
    input {
      padding-left: 0.32rem;
      border: none;
      height: 90%;
      line-height: 1.01rem;
    }
  }
  .general-tishi {
    font-size: 0.22rem;
    padding: 0.14rem 0.33rem;
    color: rgb(254, 109, 88);
  }
  .hostory {
    width: 2.47rem;
    height: 0.37rem;
    margin: 0 auto;
    margin-top: 0.37rem;
    margin-bottom: 0.47rem;
    border-bottom: 1px solid #c3c3c3;
    color: #c3c3c3;
    position: relative;
    span {
      position: absolute;
      top: 0.2rem;
      left: 0.08rem;
      transform: translate(50%);
      z-index: 2;
      background-color: #f7f7f7;
    }
  }
  .daili {
    margin-top: 0.2rem;
    padding: 0 0.33rem;
    background-color: white;
    .daili-top {
      .top-left {
        padding-top: 0.27rem;
        float: left;
        text-align: center;
        height: 0.5rem;
        line-height: 0.5rem;
        span:nth-child(1) {
          color: white;
          display: inline-block;
          font-size: 0.24rem;
          width: 1rem;
          border-radius: 0.25rem;
        }
        .show-d {
          background-color: #4584f5;
        }
        .show-h {
          background-color: #f56e45;
        }
        span:nth-child(2) {
          padding-left: 0.44rem;
        }
        span:nth-child(3) {
          padding-left: 0.04rem;
          color: white;
          background-color: #feb407;
          display: inline-block;
          font-size: 0.24rem;
          width: 1rem;
          border-radius: 0.1rem;
        }
      }

      .top-right {
        float: right;
        font-size: 0.24rem;
        padding-top: 0.2rem;
        color: rgb(158, 161, 178);
      }
    }
    .beiz-center {
      padding-top: 0.45rem;

      input {
        border: none;
        height: 0.6rem;
        font-size: 0.26rem;
        line-height: 0.6rem;
        vertical-align: middle;
      }
    }
    .line {
      border-top: 1px solid #efefef;
    }
    .daili-bottom {
      height: 0.7rem;
      line-height: 0.7rem;
      text-align: center;

      button {
        padding-top: 0.01rem;
        height: 0.37rem;
        width: 48%;
        border: none;
        background-color: white;
        color: #4584f5;
      }
      .dal-left {
        border-right: 1px solid #efefef;
      }
    }
  }
  .fandian {
    margin-left: 0.46rem;
  }
  .range-tip {
    position: relative;
    .min {
      float: left;
      display: block;
      width: 1rem;
      text-align: center;
    }
    .max {
      display: block;
      width: 1rem;
      position: absolute;
      right: 0.1rem;
      top: 27%;
      text-align: center;
    }
  }
  .range-fandian {
    margin-top: 0.79rem;
  }

  .lose {
    background: url("../../assets/images/lose.png") no-repeat right;
    background-size: 30%;
  }
}
.foot {
  padding: 0 0.33rem;
  .foot-t {
    color: #f56e45;
    height: 0.6rem;
    line-height: 0.6rem;
  }
  .foot-a {
    button {
      height: 0.88rem;
      line-height: 0.88rem;
      width: 3.3rem;
      border: none;
      background-color: #4584f5;
      font-size: 0.28rem;
      color: white;
      border-radius: 0.05rem;
    }
    .btn-left {
      margin-right: 0.1rem;
      margin-bottom: 0.5rem;
    }
  }
  .foot-nocopy {
    button {
      display: block;
      margin: 1rem auto;
      height: 0.88rem;
      line-height: 0.88rem;
      width: 3.3rem;
      border: none;
      background-color: #4584f5;
      font-size: 0.28rem;
      color: white;
      border-radius: 0.05rem;
    }
  }
}
/*分享 暂时放在这里，后面抽出公共的 删除*/

.share-title {
  text-align: center;
  font-size: 0.34rem;
}

.sharemain {
  color: #2b304b;
  z-index: 100;
  .shareType {
    margin-top: 0.4rem;
    ul li {
      float: left;
      width: 25%;
      text-align: center;
      img {
        width: 0.94rem;
        height: 0.94rem;
      }
      span {
        display: block;
        line-height: 0.8rem;
        font-size: 0.24rem;
      }
    }
  }
  .share-cansole {
    clear: both;
    display: block;
    text-align: center;
    height: 1.1rem;
    line-height: 1.1rem;
    border-top: 0.001rem solid #e5e5e5;
  }
}
/*---------------------------*/
.errorColor {
  color: red;
}
.submitBtn {
  margin: 0 0 0 0.3rem;
}
input {
  color: #2b304b;
}
</style>