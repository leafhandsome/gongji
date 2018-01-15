<template>
  <ul class="content" v-model="balls">
    <li>
      <div class="content-item">
        <div class="box box-num">
          <p class="title">胆码</p>
          <checker v-model="danNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item" :key="item" @on-item-click="danclick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <p class="title">拖码</p>
        <div class="box box-num">
          <checker v-model="tuoNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item" :key="item" @on-item-click="tuoclick">{{item}}</checker-item>
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
        danNum:[],
        tuoNum :[],
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        selDanValue:'',
        selTuoValue :'',
        showToast:false,  //显示提示
        ToastText:'',     //提示内容
        ToastPosition: 'bottom', //提示位置,
        responseData:{},  //返回结果
        selRow:'',
      }
    },

    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let danlen = 0;
        let tuolen = 0;
        //二不同胆拖
        if(vm.params.playType == 1010 ){
          if(vm.selRow==1){

            if(vm.contains(vm.tuoNum,vm.selDanValue)){
              vm.removeByValue(vm.danNum,vm.selDanValue);
            }else {
              if(vm.danNum.length>1){
                vm.danNum.shift();
              }
            }
          }else {
            if(vm.contains(vm.danNum,vm.selTuoValue)){
              vm.removeByValue(vm.tuoNum,vm.selTuoValue)
            }
          }
          danlen = vm.danNum.length;
          tuolen = vm.tuoNum.length;

          if(danlen==1 && tuolen > 0){
            vm.count_zs = danlen * tuolen ;
          }else {
            vm.count_zs = 0 ;
          }
        }
        //三不同胆拖 b*(b-1)/2
        if(vm.params.playType == 1013){
          if(vm.selRow==1){
            if(vm.contains(vm.tuoNum,vm.selDanValue)){
              vm.removeByValue(vm.danNum,vm.selDanValue);
            }else {
              if(vm.danNum.length > 2){
                vm.danNum.shift();
              }
            }
          }else {
            if(vm.contains(vm.danNum,vm.selTuoValue)){
              vm.removeByValue(vm.tuoNum,vm.selTuoValue) ;
            }
          }
          danlen = vm.danNum.length;
          tuolen = vm.tuoNum.length;

          if(danlen>0 && tuolen > 0){
            if(danlen==1){
              vm.count_zs = tuolen*(tuolen-1)/2
            }else {
              vm.count_zs = tuolen;
            }
          }else {
            vm.count_zs = 0 ;
          }
        }

        vm.responseData.betInput   = {"num1":vm.danNum,"num2":vm.tuoNum};
        vm.responseData.waterValue = vm.backWater ;
        vm.responseData.count_zs   = vm.count_zs;
        vm.$emit('resultData',vm.responseData);   //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      danclick(value){
        let vm = this;
        vm.selDanValue = value;
        vm.selRow = 1;
        if(vm.contains(vm.tuoNum,vm.selDanValue)){
          vm.showToast = true;
          vm.ToastText = '不能选相同的号码';
        }
      },
      tuoclick(value){
        let vm = this;
        vm.selTuoValue = value;
        vm.selRow = 2;
        if(vm.contains(vm.danNum,vm.selTuoValue)){
          vm.showToast = true;
          vm.ToastText = '不能选相同的号码';
        }
      },
      changWater(data){
        let vm  = this;
        vm.backWater   = data.backWater
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
