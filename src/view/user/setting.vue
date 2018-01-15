<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">设置</h2>
    </div>
      <div class="settinglist">
         <ul>
           <router-link to="setname">
           <li class="islink border-b1">
              <p>修改昵称</p>
           </li>
           </router-link>
         <router-link to="setpwd">
             <li class="islink border-b1">
             <p class="islink">修改登录密码</p>
           </li>
         </router-link>
         <router-link v-bind="{to:'setmoney/'+item.hasCreateAccountPwd+'/'+item.hasSetPwdQuestion}">
           <li class="islink border-b1">
             <p v-text="item.hasCreateAccountPwd?'修改资金密码':'设置资金密码'"> </p>
           </li>
           </router-link>
            <router-link v-bind="{to:'setprobrom/'+item.hasSetPwdQuestion}">
           <li class="islink border-b1">
             <p>密保设置  <span class="right" v-text="item.hasSetPwdQuestion?'已设置':'未设置'"></span></p>
           </li>
            </router-link>
           <router-link v-bind="{to:'bankcar/'+item.hasCreateAccountPwd}">
           <li class="islink border-b1">
             <p>银行卡管理 <span class="right" v-text="item.hasBindBank?'已绑定':'未绑定'"></span></p>
           </li>
           </router-link>
           <router-link to="bindphoto">
           <li class="islink border-b1">
             <p>绑定手机 <span class="right" v-text="item.hasBindPhone?'已绑定':'未绑定'"></span></p>
           </li>
           </router-link>
             <router-link v-bind="{to:'bindwx/'+item.weiXinCode}">
           <li class="islink border-b1">
             <p>绑定微信 <span class="right">未绑定</span></p>
           </li>
           </router-link>
           <router-link v-bind="{to:'bindzhifu/'+item.hasCreateAccountPwd}">
           <li class="islink ">
             <p>绑定支付宝 <span class="right" v-text="item.hasBindAlipayAccount?'已绑定':'未绑定'"></span></p>
           </li>
           </router-link>
         </ul>
         <ul style="display: none">
           <li>
             <p>手势密码 <span class="right x-switch">
               <x-switch title="title" :value="true"></x-switch>
             </span></p>
           </li>
         </ul>
        <ul>
          <router-link to="aboutme">
          <li class="islink border-b1">
            <p>关于我们</p>
          </li>
          </router-link>
        </ul>
        <ul>
          <li class="islink ">
            <p @click="over">退出当前账号</p>
          </li>
        </ul>
      </div>
       <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
           <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
  </div>
</template>
<script>
import store from '../../store/index'
export default {
  data() {
    return {
      stringValue: '0',
      item: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      loading: {
        show: false,
        text: '加载中...'
      },
      
    }
  },
  created() {
    this.getsetting();
  },
  methods: {
    over() {
      let user = this.removeValue({ name: 'userId' });
      let toke = this.removeValue({ name: 'token' });
      store.state.mobile='';
      store.state.realname='';
      store.state.username='';
      this.$router.push('index')
    },
    getsetting() {
        let userId=this.getValue('userId');
       let token=this.getValue('token');
      if(userId&&token){
      this.loading.show = true;
      this.unitAjax('post', '/api/userCenter/setUp/index', {}, res => {
        if (res.result) {
          this.item = res.data;
          this.loading.show = false;
          store.state.probrom=res.data.hasSetPwdQuestion;
        }else{
             if (res.operateCode == 100) {
          this.loading.show = false;
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
    }else{
       this.$router.push('/loginpage')
    }
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  overflow: hidden;
  min-height: 100%;
  .settinglist {
    ul {
      margin-bottom: 0.2rem;
      li {
        height: 0.87rem;
        line-height: 0.87rem;
        font-size: 0.26rem;
        position: relative;
        padding: 0 0.33rem;
        background-color: #fff;
        .right {
          float: right;
          font-size: 0.24rem;
          color: #9ea1b2;
          padding-right: 0.26rem;
        }
      }
    }
  }
}

.right group .weui-label {
  display: none;
}
</style>
