<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">消息中心</h2>
      <div class="header-right" @click="konw">朕知道了</div>
    </div>
       <div class="content">
          <ul>
            <li >
              <div class="list-item islink">
                 <img src="../../assets/images/icons/icon-kf.png">
                 <p class="notice-title">客服</p>
                 <!-- <span class="vux-badge vux-badge-single" style="right:0.6rem;position: absolute;top: 0.35rem;">1</span> -->
              </div>
            </li>
            <li >
              <router-link to="message">
              <div class="list-item islink">
                <img src="../../assets/images/icons/icon-xx.png">
                <p class="notice-title">消息</p>
                <span class="vux-badge vux-badge-single" style="right:0.6rem;position: absolute;top: 0.35rem;" v-show="count!=0" v-text="count"></span>
              </div>
              </router-link>
            </li>
            <li @click="$router.push('noticelist')">
              <div class="list-item islink">
                <img src="../../assets/images/icons/icon-gg.png">
                <p class="notice-title">公告</p>
                <!-- <span class="vux-badge vux-badge-single" style="right:0.6rem;position: absolute;top: 0.35rem;">5</span> -->
              </div>
            </li>

          </ul>
       </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      count: '',
      talkUserId:1
    }
  },
  created() {
    this.getcount()
  },
  methods: {
    konw() {
      this.unitAjax('post', '/api/userCenter/message/labelAllMsgRead', {}, res => {
        if (res.result) {
          this.count = 0;
        }
      })
    },
    getcount() {
      this.unitAjax('post', '/api/userCenter/message/msgUnReadCount', {}, res => {
        if (res.result) {
          this.count = res.data.msgUnReadCount;
        
        }

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .list-item {
    height: 1rem;
    line-height: 1rem;
    background-color: #fff;
    padding: 0 0.33rem;
    position: relative;
    margin-top: 0.2rem;
    font-size: 0.26rem;
    img {
      width: 0.5rem;
      height: 0.5rem;
      float: left;
      margin-top: 0.25rem;
      margin-right: 0.2rem;
    }
  }
  .vux-badge-single {
    padding: 0;
    width: 0.26rem;
  }
  .vux-badge {
    display: inline-block;
    text-align: center;
    background: #f74c31;
    color: #fff;
    font-size: 0.18rem;
    height: 0.26rem;
    line-height: 0.26rem;
    border-radius: 100%;
    background-clip: padding-box;
    vertical-align: middle;
  }
}
</style>
