<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">找回密保</h2>
      </div>
      <router-link v-bind="{to:'/msgfindmoney/setprobrom'}">
         <div class="mesg">
           通过短信验证找回
           <span></span>
         </div>
         </router-link>
          <router-link to="/loginsetmoney/setprobrom">
         <div class="mesg">
         通过登录密码找回
           <span></span>
         </div>
         </router-link>
          <router-link v-bind="{to:'/funzhijing/setprobrom'}">
         <div class="mesg">
         通过资金密码找回
           <span></span>
         </div>
         </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setname: "",
      probrom:this.$route.params.probrom,
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.container {
  .mesg {
    height: 0.92rem;
    line-height: 0.92rem;
    margin-top: 0.2rem;
    width: 100%;
    font-size: 0.26rem;
    padding-left: 0.32rem;
    color: rgb(63, 69, 87);
    background-color: white;
    position: relative;
    span:after {
      content: " ";
      display: inline-block;
      height: 0.15rem;
      width: 0.15rem;
      border-width: 0.03rem 0.03rem 0 0;
      border-color: #c8c8cd;
      border-style: solid;
      -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
      position: absolute;
      top: 40%;
      right: 0.61rem;
    }
  }
}
</style>

