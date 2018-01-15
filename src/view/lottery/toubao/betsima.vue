<template>
  <ul class="content" v-model="balls">
    <li>
      <div class="content-item">
        <div class="box box-num">
          <p class="title">选号</p>
          <checker v-model="qianNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item" :key="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
  </ul>
</template>

<script>
  const numlist = [1,2,3,4,5,6];
  const qianNum = [] ;
  export default {
    props:['params'],
    data(){
      return {
        numlist:numlist,
        qianNum:qianNum,
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        responseData:{},  //返回结果
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        if(vm.qianNum.length>4){
          vm.qianNum.shift();
        }
        let qianlen = vm.qianNum.length;
        if(qianlen>0 && qianlen ==4 ){
          vm.count_zs = 1
        }else {
          vm.count_zs = 0 ;
        }
        vm.responseData.waterValue = vm.backWater
        vm.responseData.count_zs  = vm.count_zs;
        vm.responseData.betInput ={"alls":vm.qianNum};
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
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
    height: 1.55rem;
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
