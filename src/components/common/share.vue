<template>
  <div class="sharemain">
    <popup  v-model="show" height="6rem">
      <div style="background-color:#fff;margin:0 auto;border-radius:5px;padding-top:0.26rem;">
        <div class="share-title">
          <span>分享至</span>
        </div>
        <div class="shareType">
          <ul>
            <li>
              <img src='../../assets/images/icons/qqzoom.png'>
              <span>QQ空间</span>
            </li>
            <li>
              <img src='../../assets/images/icons/qqfriend.png'>
              <span>QQ好友</span>
            </li>
            <li>
              <img src='../../assets/images/icons/sina.png'>
              <span>新浪微博</span>
            </li>
            <li>
              <img src='../../assets/images/icons/friends.png'>
              <span>朋友圈</span>
            </li>
            <li>
              <img src='../../assets/images/icons/wacthfriend.png'>
              <span>微信好友</span>
            </li>
            <li>
              <img src='../../assets/images/icons/copy.png'>
              <span>复制链接</span>
            </li>
          </ul>
        </div>
        <div class="share-cansole" @click='showShare()'>
          <span>取消</span>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  export default{
    props: ['show'],

    methods:{
      showShare(){
        this.props['show'] = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*分享*/
  .share-title{
    text-align: center;
    font-size: 0.34rem;
  }
  .sharemain{
    color: #2b304b;
    z-index:100;
  .shareType{
    margin-top:0.4rem;
  ul li{
    float: left;
    width: 25%;
    text-align: center;
  img{
    width: 0.94rem;
    height: 0.94rem;
  }
  span{
    display: block;
    line-height: 0.8rem;
    font-size: 0.24rem;
  }
  }
  }
  .share-cansole{
    clear: both;
    display: block;
    text-align: center;
    height: 1.1rem;
    line-height: 1.1rem;
    border-top: 0.001rem solid #e5e5e5;
  }
  }
</style>

