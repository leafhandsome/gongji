<template>
  <ul class="content" v-model="balls">
    <li>
      <div class="content-item">
        <textarea class="form-control" v-model="content"  placeholder="请输入您要投注的号码,用逗号、空格或 ';' 分割开"></textarea>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition" width="8.6em"></toast>
    </div>
  </ul>
</template>

<script>
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水
        responseData:{},  //返回结果
        showToast:false,  //显示提示
        ToastText:'',//提示内容
        ToastPosition: 'default',//提示位置;
        content:'',
      }
    },

    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let itemcount = 0;
        let sscds = '';
        //五星单选
        if(vm.params.playType==41){
          let reg =  /\b[0-9]{5}\b/g;
          sscds = vm.util_unique(vm.content, reg);

          sscds = sscds.sort();
          if (sscds) {
            itemcount   = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
        //前四单选
        else if(vm.params.playType==51){
          let reg =  /\b[0-9]{4}\b/g;
          sscds = vm.util_unique(vm.content, reg);

          sscds = sscds.sort();
          if (sscds) {
            itemcount = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
        //前三单选
        else if(vm.params.playType==71){
          let reg =  /\b[0-9]{3}\b/g;
          sscds = vm.util_unique(vm.content, reg);

          sscds = sscds.sort();
          if (sscds) {
            itemcount = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
        //前三组合
        else if(vm.params.playType==76){
          let reg =  /\b[0-9]{3}\b/g;
          sscds = vm.util_unique(vm.content, reg,1,true,true);

          sscds = sscds.sort();
          if (sscds) {
            itemcount = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
         //前二直选
        else if(vm.params.playType == 101){
          let reg = /\b[0-9]{2}\b/g;
          sscds = vm.util_unique(vm.content, reg);

          sscds = sscds.sort();
          if (sscds) {
            itemcount = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
        //前二组合
        else if(vm.params.playType == 103){
          let reg = /\b([0-9])(?!\1)([0-9])\b/g;
          sscds = vm.util_unique(vm.content, reg,1,true);

          sscds = sscds.sort();
          if (sscds) {
            itemcount = sscds.length;
            vm.count_zs = itemcount;
          }else {
            itemcount = 0
          }
        }
        vm.responseData.betInput   = {"custom":vm.content};
        vm.responseData.waterValue = vm.backWater ;
        vm.responseData.count_zs   = vm.count_zs;
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      changWater(data){
        let vm  = this;
        vm.backWater = data.backWater
        vm.responseData.waterValue = vm.backWater
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    height: 4.5rem;
    li{
      margin:  0 auto;
    }
    li:nth-child(2){
      height: 1.1rem;
    }
    li:last-child{
      height: auto;
    }
    .content-item{
      padding:0.2rem;
      .form-control{
        resize: none;
        border: 1px solid #ddd;
        width: 98%;
        height: 1.8rem;
        color: #333;
        padding:0.1rem ;
      }
    }
  }
  .toast{
    position: fixed;
    top:50%
  }
</style>
