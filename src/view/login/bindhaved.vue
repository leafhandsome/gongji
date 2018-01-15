<template>
 <div class="container">
    <div v-if="show" class="tishi">
            <div class="kuan-bindmobil">
                 <div class="del">+</div>
                <div class="header-bind">
                    <span></span>
                    <img src="../../assets/images/weixin/gongji.png" alt="">
                </div>
                <div class="kuan-text">绑定已有账号</div>
                <form action="" class="form-content">
                    <div class="text-photo">  <input type="text" placeholder="手机号码/账号"></div>   
                    <div class="text-pwd"> <input type="text" placeholder="登录密码"><button>获取验证码</button></div>
                    <p>提示：密码错误！</p>
                    <button class="text-true"><span></span></button>
                    <button class="text-ok"><span class="thisok"></span></button>
                </form>
             
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
      left: .6rem;
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
    height: 6.93rem;
    margin: 0 auto;
    margin-top: 2.28rem;
    text-align: center;
    background-color: white;
    border-radius: 10px;
    color: #9ea1b2;
        position: relative;
    .del{
        position: absolute;
        top: -.8rem;
        right: 0;
        width: .5rem;
        height: .5rem;
        line-height: .5rem;
        text-align: center;
        border-radius: 50%;
        border: 2px solid white;
        transform: rotate(45deg);
     
        font-size: .5rem;
        color: white;
    }
    .kuan-text {
      margin-top: 0.19rem;
    }
    .form-content {
         p {
        height: 0.64rem;
        font-size: 0.18rem;
        line-height: 0.64rem;
        color: #fe6d58;
      }
      input {
        border: none;
        height: 0.8rem;
      }
      div{
            width: 4.92rem;
          height: .86rem;
          line-height: .86rem;
          margin: 0 auto;
           box-shadow: 0 0 10px #F4F4F4;
          border-radius: 1rem;
          border: 1px solid #F4F4F4;
      }
      .text-photo{
       margin-top: .59rem;
       width: 4.92rem;
       text-align: left;
       padding-left: .4rem;
      }
      .text-pwd {
          margin-top: .23rem;
          input{
              width: 2.6rem;
          }
        button {
            padding: 0;
          border: none;
          background-color: white;
          color: rgb(83, 204, 253)
        }
      }
      .text-true{
          width: .9rem;
          height: .9rem;
          margin-top: .1rem;
          border-radius: 50%;
          border: none;
          background-color: #A4A4A4;
          color: #fff;
          font-size: .26rem;
          position: relative;
            span:after {
          content: " ";
          display: inline-block;
          height: 0.2rem;
          width: 0.2rem;
          border-width: 0.04rem 0.04rem 0 0;
          border-color: white;
          border-style: solid;
          transform: rotate(45deg);
          position: absolute;
          top: 36%;
          left: 32%;
        }
      }
      .text-ok{
         margin-left: .8rem;
           width: .9rem;
          height: .9rem;
          margin-top: .1rem;
          border-radius: 50%;
          border: none;
          background-color: #53CCFD;
          color: #fff;
          font-size: .26rem;
          position: absolute;;
          .thisok:after{
               content: " ";
          display: inline-block;
          height: 0.2rem;
          width: 0.3rem;
          border-width: 0.04rem 0.04rem 0 0;
          border-color: white;
          border-style: solid;
          transform: rotate(130deg);
          position: absolute;
          top: 30%;
          left: 32%;
          }
      }
    }
  }
}
</style>
