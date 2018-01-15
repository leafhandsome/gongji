<template>
  <div class="container">
    <dl class="v-userInfo">
      <dt>
        <p class="user-logo"><img  src="../../assets/images/game-11-5.png"></p>
        <p class="user-tag">
          <span class="mLevel">修改头像</span>
          <span class="v-jiantou"></span>
        </p>
      </dt>
    </dl>
    <ul class="list-arrow list-icon mt20 userlist">
      <group>
        <cell title='用户名' is-link ></cell>
        <cell title='昵称' is-link></cell>
        <cell title='登陆密码' is-link></cell>
        <cell title='资金密码' is-link></cell>
        <cell title='银行卡管理' is-link></cell>
        <cell title='绑定手机' is-link></cell>
        <cell title='玩法介绍' is-link></cell>
        <cell title='提款帮助' is-link></cell>
      </group>
    </ul>
  </div>
</template>
<script>
  import { Cell, Group } from 'vux'

  export default {
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
<style scoped lang="scss">
  .container {
    overflow: hidden;
    min-height: 100%;
      p {
      color: red;
      font-size: 18px;
    }
  }
  .userInfo .user-tag{
    margin-top: 0.1rem;
  }
</style>
