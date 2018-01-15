<template>
   <div class="container">
     <div class="erweima-tilte">分享二维码</div>
    <div  class="erweima" style="display: none;">
         
          <div id="container">
        <canvas ref="canvas"  width="400" height="400"></canvas>
       
         </div>    
    </div>
    <div class="centerimg"><div id="imgDiv"></div></div>
       <div class="erweima-url"><span class="url" v-text="send">www.baidu.com</span></div>
       <div  class='copy'
        v-clipboard:copy="send"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">
     复制</div>
        <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div> 
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
            showToast: false,
            ToastText: '',
            ToastPosition: '',
            srcurl: '',
            imges: ''
        };
    },
    mounted() {
        this.geterweima()
    },
    methods: {
        onCopy(e) {
            this.showToast = true;
            this.ToastText = '复制成功';
        },
        onError() {
            this.showToast = true;
            this.ToastText = '复制失败';
        },
        geterweima() {
            let vm = this;
            $("#container").erweima({
                fill: 'black',
                text: vm.send,
                size: 200,
                mode: 0,
                minVersion: 10
            });
          var mycanvas1=document.getElementsByTagName('canvas')[0];

            var img = this.convertCanvasToImage(mycanvas1);
            $('#imgDiv').append(img);  
        }
    }
};
</script>
<style lang="scss" scoped>
.container{
    background-color: #fff;
}
.erweima-tilte {
  background-color: white;
  text-align: center;
  padding-top: 0.4rem;
  font-size: 0.26rem;
  margin-top: 1.08rem;
}
.erweima {
  background-color: white;
}
.centerimg{
    width: 200px;
    margin: 0 auto;
}
#container {
  width: 200px;

  margin: 0 auto;
}
.erweima-url {
  width: 100%;
  text-align: center;
  background-color: white;
  font-size: 0.26rem;
  padding-bottom: 0.5rem;
}
.copy {
  background-color: white;
  text-align: center;
  height: 0.6rem;
  line-height: 0.6rem;
  border: none;
  background-color: white;
  color: rgb(69, 132, 245);
}
</style>
