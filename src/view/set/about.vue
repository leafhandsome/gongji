<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">关于我们</h2>
      </div>
      <div class="about-img"><img src="../../assets/images/weixin/gongji.png" alt=""></div>
        <div class="v-content">当前版本：1.3.0</div>
  </div>
</template>
<style lang="scss" scoped>
.container{
    height:13.34rem;
    background-color: #fff;
    .about-img{      
        width: 4.07rem;
        margin:0 auto;
        margin-top: 1.99rem;
    }
    .v-content{
        margin-top: .18rem;
        text-align: center;
        font-size: .26rem;
        color: rgb(63, 69, 87)
    }
}
</style>

