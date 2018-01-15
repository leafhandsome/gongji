<template>
  <div>
    <div class="bottom-vav ">
      <navBar ></navBar>
    </div>
  <div class="container">
    <dl class="v-userInfo" @click="$router.push('userinfo')">
      <dt>
        <p class="user-logo"><img  src="../../assets/images/game-11-5.png"></p>
        <p class="user-nm">TOM</p>
        <p class="user-tag">
          <span class="mLevel">彩票返点 <label class="v-fd-var">260%</label></span>
          <span class="vux-badge vux-badge-single" style="right: 30px;position: absolute;top: 30px;">1</span>
          <span class="v-jiantou"></span>
        </p>
      </dt>

    </dl>
    <ul class="listCom list-arrow list-icon mt20 userlist" >
      <group>
        <cell title='账户余额' value = "1000"  is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/zhye.png">
        </cell>
        <cell title='可提现余额' value = "1000" is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/txye.png">
        </cell>
        <cell title='游戏记录' is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/yxjl.png">
        </cell>
        <cell title='彩票记录' is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/cpjl.png">
          <span class="vux-badge vux-badge-single">2</span>
        </cell>
        <cell title='充值记录' is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/czjl.png">
        </cell>
        <cell title='记录' is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/txjl.png">
        </cell>
        <cell title='分享'  is-link >
          <img slot="icon" class="v-cell-icon" src="../../assets/images/user/fx.png">
        </cell>
      </group>
    </ul>
  </div>
  </div>
</template>
<script>
  import { Cell, Group } from 'vux'

  export default {
    name:'user',
    components: {Cell,Group},
    data () {
      return {
        data:{},
      }
    },
    methods :{
    },
  }
</script>
