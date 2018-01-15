<template>
  <div class="shopCar">
    <div class="del">
      <img src='../../assets/images/lottery/del.png'/>
    </div>
    <div class="right">
      <div class="car">
        <img src='../../assets/images/lottery/car.png'/>
        <span class="vux-badge vux-badge-single">9</span>
        <x-button type="default" mini class="x-button">添加号码</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { XButton} from 'vux'

  export default {
    components: {
      XButton,
    },
    methods: {

    },
  }
</script>

<style>
  .shopCar{
    position: fixed;
    bottom: 0;
    height: 50px;
    width: 100%;
    border-top: 1px solid #F2F2F2;
    background: #fff;
  }
  .shopCar img{
    width: 25px;
    height: 25px;
    margin-top: 13px;
  }
  .shopCar .del{
    width: 45%;
    float: left;
    line-height: 50px;
    margin-left: 10px;
    display: block;
  }
  .shopCar .right{
    width: 50%;
    line-height: 50px;
    display: inline;
    float: left;
  }

  .shopCar .right .car{
    width: 100%;
  }

  .shopCar .car .weui-btn_default{
    background: #4584F5;
  }
  .shopCar .car  img{
    position: absolute;
    right: 120px;
  }
  .shopCar .car .x-button{
    color: #fff;
    position: absolute;
    margin-top: 10px;
    right: 10px;
  }
  .shopCar .car span{
    position: absolute;
    right: 110px;
  }

</style>
