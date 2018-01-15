<template>
   <div class="container">
     <div class="erweima-tilte">请使用【{{info}}-扫一扫】进行支付</div>
    <div class="erweima">
         
          <div id="container">
        <canvas width="400" height="400"></canvas>
         </div>    
    </div>
      <div class="centerimg"><div id="imgDiv"></div></div>
       <div class="erweima-tishi" v-text="flag"></div>

  </div>
</template>
<script>
import $ from "jquery";
import "../../config/jqueryqr";
export default {
  props: ['send'],
  data() {
    return {
      info: '',
      flag: ''
    };
  },
  created() {
    if (this.send.payFlag == 'weixin_code') {
      this.info = '微信';
      this.flag = '请使用另外一部手机设备打开微信扫二维码进行支付，或长按保存到相册再扫码'
    } else if (this.send.payFlag == 'alipay_code') {
      this.info = '支付宝';
      this.flag = '请使用另外一部手机设备打开支付宝扫二维码进行支付，或长按识别二维码'
    } else if (this.send.payFlag == 'qq_code') {
      this.info = 'QQ';
      this.flag = '请使用另外一部手机设备打开QQ扫二维码进行支付，或长按识别二维码'
    }
  },
  mounted() {
    this.geterweima()
  },
  methods: {
    geterweima() {
      let vm = this;
      $("#container").erweima({
        fill: 'black',
        text: vm.send.extraInfo,
        size: 200,
        mode: 0,
        minVersion: 10
      });
      var mycanvas1 = document.getElementsByTagName('canvas')[0];

      //将转换后的img标签插入到html中
      var img = this.convertCanvasToImage(mycanvas1);
      $('#imgDiv').append(img);
    }
  }
};
</script>
<style>

.erweima-tilte {
  background-color: white;
  text-align: center;
  padding-top: 0.4rem;
  font-size: 0.26rem;
}
.centerimg{
  background-color: #fff;
}
#imgDiv{
    width: 200px;
    margin: 0 auto;
}
.erweima {
  display:none;
  background-color: white;
}
#container {
  width: 200px;

  margin: 0 auto;
}
.erweima-tishi {
  text-align: center;
  background-color: white;
  text-align: center;
  font-size: 0.26rem;
  padding: 0 1rem 0.5rem;
}
</style>
