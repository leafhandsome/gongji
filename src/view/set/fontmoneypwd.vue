<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">找回资金密码</h2>
      </div>
      <router-link v-bind="{to:'/msgfindmoney/setmoney'}">
         <div class="mesg">
           通过短信验证找回
           <span></span>
         </div>
         </router-link>
          <router-link to="/loginsetmoney/setmoney">
         <div class="mesg">
         通过登录密码找回
           <span></span>
         </div>
         </router-link>
          <router-link v-bind="{to:'/funprobrom/'+probrom}">
         <div class="mesg" v-show="probrom=='true'">
         通过密保信息找回
           <span></span>
         </div>
         </router-link>
  </div>
</template>
<script>
import store from '../../store/index';
export default {
  data() {
    return {
      setname: "",
      probrom: this.$route.params.probrom,
      probromshow: store.state.probrom
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

