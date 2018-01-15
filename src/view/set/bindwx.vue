<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">绑定微信</h2>
      </div>
      <div class="from setname">       
           <div class="sond">1.复制并发送标识码到微信群</div>
           <div class="sond_content" v-text="message"></div>
           <div class="setok">
    <button type="button"
      v-clipboard:copy="message"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">复制</button>
         </div>
         </div>
   <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>  
  </div>
</template>
<script>
export default {
    data() {
        return {
            setname: '',
            message: this.$route.params.wxcode,
            showToast: false,
            ToastText: '',
            ToastPosition: ''
        }
    },
    methods: {
        onCopy(e) {
            this.showToast = true;
            this.ToastText = '复制成功';
        },
        onError() {
            this.showToast = true;
            this.ToastText = '复制失败';
        }
    }
}

</script>
<style lang="scss" scoped>
.container {
  .from {
    margin-top: 0.2rem;
    background-color: #fff;
    .sond {
      padding-left: 0.32rem;
      color: rgb(158, 161, 178);
    }
    .sond_content {
      margin-top: 0.7rem;
      text-align: center;
      font-size: 0.28rem;
    }
  }
  .setok {
    font-size: 0.3rem;
    height: 0.87rem;
    line-height: 0.87rem;
    margin-top: 0.6rem;
    border-top: 1px solid #ecedee;
    text-align: center;
    background-color: white;
  }
  button {
    border: none;
    background-color: white;
    color: rgb(69, 132, 245);
  }
}
</style>

