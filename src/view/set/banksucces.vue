<template>
 <div class="container">
    <div class="tishi">
            <div class="kuan-bindmobil">
             <div class="del" @click="isshow"><img src="../../assets/images/weixin/icon-del.png" alt=""></div>
              <div class="title-img"><img src="../../assets/images/weixin/bankok.png" alt=""></div>
              <div class="succes">恭喜！提交成功</div>
              <div class="tishi-content">
                提示：客服会在xx时间内帮您充值到账，据说耐心等待的人，更大几率得大奖哦。（如有疑问请及时联系客服）
              </div>
            </div>
        </div>
 </div>
</template>
<script>
import cookieRender from '../../config/cookie.js';
export default {
  data() {
    return {
    
    }
  },
  methods: {
      isshow() {
      let vm = this;
      let parmar = {};
      parmar.hide = false;
      vm.$emit('hideresult', parmar);
    }
    },
  
}

</script>
<style lang="scss" scoped>
.tishi {
  width: 100%;
  height: 13.14rem;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  z-index: 701;
  top: 0%;
  .kuan-bindmobil {
    opacity: 1;
    width: 4.8rem;
    margin: 0 auto;
    margin-top: 40%;
    text-align: center;
    background-color: white;
    border-radius: 10px;
    color: rgb(202, 204, 212);
    position: relative;
    .del {
      position: absolute;
      bottom: -0.8rem;
      left: 50%;
      transform: translate(-50%);
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      color: white;
    }
    .title-img{
      padding-top: .4rem;
     margin: .0 auto;
      width: 1.6rem;
      height: 1.6rem;
    }
    .succes{
      text-align: center;
      font-size: .26rem;
      color: rgb(63, 69, 87);
      margin: .3rem;
    }
    .tishi-content{
      text-align: left;
      padding:0 .5rem .3rem;;
      font-size: .22rem;
      color:#CACCD4;
      display: flex;
    }
  }
}
</style>
