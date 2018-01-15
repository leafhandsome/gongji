<template>
 <div class="container">
    <div v-if="show" class="tishi">
            <div class="kuan-bindmobil">
                 <div class="del">+</div>
                <div class="header-bind">
                    <span></span>
                    <img src="../../assets/images/weixin/gongin2.png" alt="">
                </div>
                <div class="new">
                    <img src="../../assets/images/weixin/icon-shouji.png" alt=""><span>新用户绑定手机</span>
                </div>
             <div class="odd">
                    <img src="../../assets/images/weixin/icon-zhanhao.png" alt=""><span>新用户绑定手机</span>
                </div>
            <P>新用户绑定手机立送18元</P>
            </div>

        </div>   
 </div>  
</template>
<script>
export default {
    data() {
        return {
            show: true,
        }
    },
    methods: {
        isshow() {
            this.show = true;
        },
        showok() {
            this.show = false;
        },
        showno() {
            this.show = false;
        }

    }
}

</script>
<style lang="scss" scoped>
.tishi {
  width: 100%;
  height: 13.14rem;
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 555;
  top: 0;
  .header-bind {
    span:after {
      content: " ";
      display: inline-block;
      height: 0.2rem;
      width: 0.2rem;
      border-width: 0.03rem 0.03rem 0 0;
      border-color: #afb1bf;
      border-style: solid;
      transform: rotate(224deg);
      position: absolute;
      top: 10%;
      left: 0.6rem;
    }
    img {
      width: 1.67rem;
      height: 1.67rem;
      margin: 0 auto;
    }
  }
  .kuan-bindmobil {
    opacity: 1;
    width: 5.81rem;
    height: 5.38rem;
    margin: 0 auto;
    margin-top: 2.28rem;
    text-align: center;
    background-color: white;
    border-radius: 10px;
    color: #9ea1b2;
    position: relative;
    .del {
      position: absolute;
      top: -0.8rem;
      right: 0;
      width: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      border-radius: 50%;
      border: 2px solid white;
      transform: rotate(45deg);

      font-size: 0.5rem;
      color: white;
    }
    .new,
    .odd {
      width: 4.17rem;
      height: 0.83rem;
      line-height: 0.83rem;
      font-size: 0.26rem;
      margin: 0 auto;
      border-radius: 0.15rem;
      background-color: #5ccbff;
      color: #fff;
      img {
        width: 0.5rem;
        vertical-align: middle;
      }
      span {
        padding-left: 0.3rem;
      }
    }
    .new {
      margin-top: 0.49rem;
    }
    .odd {
      margin-top: 0.24rem;
    }
    p{
        margin-top: .48rem;
        font-size: .22rem;
        color: rgb(255, 165, 36);
    }
  }
}
</style>
