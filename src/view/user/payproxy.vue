<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">代理充值</h2>
    </div>

    <div class="paymain">
     <div class="title"><span>请复制下面代理号进行充值</span></div>
      <div class="proxylist">
        <ul>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-wechat.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-disable">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-wechat.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-disable">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-wechat.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-ativice">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-qq.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-ativice">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-qq.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-ativice">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-qq.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-ativice">一键复制</span>
            </div>
          </li>
          <li class="border-b1" >
            <div class="selproxy">
              <img src="../../assets/images/icons/icon-qq.png">
              <span class='proxyname'>代理1</span>
              <span>18562532145</span>
              <span  class="copybtn btn-ativice">一键复制</span>
            </div>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>


<script>

</script>
<style lang="scss" scoped>
  .paymain{
    background: #F7F7F7;
    .title{
      background: #F7F7F7;
      height: 0.73rem;
      padding-left: 0.35rem;
      line-height: 0.73rem;
      span{
        font-size: 0.24rem;
        color: #9EA1B2;
        display: block;
      }
    }
    .proxylist{
      .selproxy{
        width: 100%;
        height:1.42rem;
        position: relative;
        background: #fff;
        img{
          float: left;
          width: 0.8rem;
          height: 0.8rem;
          margin: 0.31rem 0.35rem 0.31rem 0.24rem ;
        }
        .proxyname{
          padding-top: 0.4rem;
          margin-left: 0.41rem;
          color: #000;
        }
        span{
          margin-left: 0.41rem;
          font-size: 0.24rem;
          line-height: 0.33rem;
          display: block;
          color: #9EA1B2;
        }
        .copybtn{
          width: 1.11rem;
          height: 0.5rem;
          display: block;
          position: absolute;
          border-radius: 5px;
          right: 0.2rem;
          top:0.46rem ;
          line-height: 0.5rem;
          text-align: center;
          font-size: 0.16rem;
        }
        .btn-ativice{
          background: #7CCCFF;
          color: #fff;
        }
        .btn-disable{
          background: #ECECEC;
          color: #CACCD4;
        }
      }
    }
  }
</style>
