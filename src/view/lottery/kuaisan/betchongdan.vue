<template>
  <ul class="content" v-model="balls">
    <li>
      <div class="content-item">
        <div class="box box-num">
          <p class="title">重号</p>
          <checker v-model="chongNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item" :key="item" @on-item-click="chongclick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <p class="title">单号</p>
        <div class="box box-num">
          <checker v-model="danNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item":key='item' @on-item-click="danclick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
    <li>
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition" width="8.6em"></toast>
      </div>
    </li>
  </ul>
</template>

<script>
  const numlist = [1,2,3,4,5,6];
  export default {

    props:['params'],
    data(){
      return {
        numlist:numlist,
        chongNum:[],
        danNum  :[],
        count_zs :0,      //总注数
        backWater :0,     //返回水
        selChongValue:'',
        selDanValue :'',
        showToast:false, //显示提示
        ToastText:'',    //提示内容
        ToastPosition: 'bottom',//提示位置;
        responseData :{},     //返回结果
        selRow:'',
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        if(vm.selRow == 1){
          if(vm.contains(vm.danNum,vm.selChongValue)){
            vm.removeByValue(vm.chongNum,vm.selChongValue);
          }
        }else {
          if(vm.contains(vm.chongNum,vm.selDanValue)){
            vm.removeByValue(vm.danNum,vm.selDanValue);
          }
        }
        let chonglen = vm.chongNum.length;
        let danlen = vm.danNum.length;

        if(chonglen>0 && danlen >0 ){
          vm.count_zs = chonglen * danlen ;
        }else {
          vm.count_zs = 0 ;
        }
        vm.responseData.betInput   = {"num1":vm.chongNum,"num2":vm.danNum};
        vm.responseData.waterValue = vm.backWater ;
        vm.responseData.count_zs   = vm.count_zs ;
        vm.$emit('resultData',vm.responseData) ;  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      chongclick(value){
        let vm = this;
            vm.selChongValue = value;
            vm.selRow =1;
        if(vm.contains(vm.danNum,vm.selChongValue)){
           vm.showToast = true;
           vm.ToastText = '不能选相同的号码';
        }
      },
      danclick(value){
        let vm = this;
            vm.selDanValue = value;
            vm.selRow = 2;
        if(vm.contains(vm.chongNum,vm.selDanValue)){
           vm.showToast = true;
           vm.ToastText = '不能选相同的号码';
        }
      },
      changWater(data){
        let vm  = this;
        vm.backWater = data.backWater
        vm.responseData.waterValue = vm.backWater
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content{
  .title{
    text-align: center;
    font-size: 0.2rem;
    height: 0.4rem;
    line-height: 0.4rem;
  }
  li{
    height: 1.3rem;
    margin:  0 auto;
  }
  }
  .content-item .box{
    width: 90%;
    margin: 0 auto;
  }
  .content-item .checker-item-button{
    float: left;
    width: 16%;
    text-align: center;
    height: 0.7rem;
    line-height: 0.7rem;
    margin: 0.1rem 0;
  }
  .content-item .cker{
    float: left;
    width: 16.66%;
    text-align: center;
  }
</style>
