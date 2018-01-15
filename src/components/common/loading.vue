<template>
  <div>
    <div id="loadingToast" v-show="show">
      <div class="mask"></div>
      <!--<div class="weui-mask_transparent"></div>-->
      <div class="weui-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <p class="weui-toast__content">{{text}}</p>
      </div>
    </div>
  </div>
</template>
<script >
  export default{
    props: ['show', 'text']
  }
</script>

<style lang="scss" scoped>
  .mask{
    width:100%;
    height:100%;
    background-color:#fff;
    position:fixed;
    top:0;
    left:0;
    z-index:3000;
    opacity:0.5;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=50);
  }
  .weui-toast {
    position: fixed;
    width: 7.6em;
    min-height: 7.6em;
    top: 35%;
    left: 50%;
    margin-left: -3.8em;
    background: hsla(0,0%,7%,.9);
    text-align: center;
    border-radius: 5px;
    color: #fff;
    z-index:3001;
  }
  .weui-icon_toast.weui-loading {
    margin: 0.3rem 0 0;
    width: 0.7rem;
    height: 0.7rem;
    vertical-align: baseline;
    display: inline-block;
  }
  .weui-toast__content {
    margin: 0 0 0.15rem;
  }
</style>
