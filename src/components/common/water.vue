<template>
  <div class="center-range">
    <div class="range">
      <p class="f24">下注水位</p>
      <span class="min">{{selfRate}}</span>
      <range  :min='minWater' :max='maxWater' :step="1" v-model="rangeValue" :rangeBarHeight="5"></range>
      <span class="max">{{waterValue}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props:['params'],
  data(){
    return {
      rangeValue:0, //默认水位
      minWater: 0,  //最小水位
      maxWater: 0,  //最大水位
      maxUserWater:0,//
    }
   },
  created(){
    let vm = this;
    let localRate = vm.getStroe('playType'+ vm.params.playType);
        vm.rangeValue = vm.params.defaultWater > vm.params.maxUserWater ? vm.params.defaultWater:vm.params.maxUserWater;//两者取大

    //获取本地记录水位
    if(localRate && localRate < vm.rangeValue){
      vm.rangeValue = localRate;
    }

    vm.rangeValue   = parseInt(vm.rangeValue);
    vm.minWater     = vm.params.minWater;
    vm.maxWater     = vm.params.maxWater > vm.params.maxUserWater ? vm.params.maxUserWater : vm.params.maxWater;
    vm.maxUserWater = vm.params.maxUserWater;
  },
  computed:{
    waterValue () {
      let vm = this;
      let data = {
        backWater:vm.rangeValue
      }
      //记住下注水位
//      let name = 'playType'+vm.params.playType;
//      let obj = vm.rangeValue;
//      vm.removeStore(name);
//      vm.setStore(name,obj);

      vm.$emit('changWate',data);  //调用父组件的自定义事件，并传值
      return (vm.rangeValue/20).toFixed(1);
    },
    selfRate(){
      let  vm  = this;
      var temp = vm.maxUserWater - vm.rangeValue;
      if(temp <= 0)
        return 0 + "%";
        return (temp / 20).toFixed(1) + "%";
    },
  }
}
</script>

<style lang="scss" scoped>
  .center-range{
    padding:0 0 0 0.2rem;
    height: auto;
    background-color: #FFF;
  .range{
    padding:0 .35rem 0 0;
    margin: 0.2rem 0;
    height: auto;
    position: relative;
  p{
    line-height: 0.3rem;
    color: #C0C1C1;
  }
  .min{
    float: left;
    display: block;
    width: 1rem;
    text-align: center;
    color:#4584F5;
    margin-top: 0.15rem;
  }
  .max{
    display: block;
    width: 0.5rem;
    position: absolute;
    right: 0.33rem;
    top:70%;
    text-align: center;
    color:#4584F5;
  }
  }
  }

</style>
