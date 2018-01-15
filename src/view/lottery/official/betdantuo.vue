<template>
  <ul class="content" v-model="balls">
    <li v-for="items in data">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{items.name}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item" @on-item-click="ballClick(item,items)">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition" width="8.6em"></toast>
    </div>
  </ul>
</template>

<script>
  const  numlist = [0,1,2,3,4,5,6,7,8,9];
  const  btnlist = ['全','单','双','大','小','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水
        danNum:[],
        selDanValue:'',
        selTuoValue :'',
        responseData:{},  //返回结果
        showToast:false,  //显示提示
        ToastText:'不能选择相同号码',     //提示内容
        ToastPosition: 'default',//提示位置;
        data:[
          {name:'胆码',number:[],numText:numlist,btnText:btnlist,id:1},
          {name:'拖码',number:[],numText:numlist,btnText:btnlist,id:2},
        ],
        selRow:'',
      }
    },

    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        if(vm.selRow==1){
          if(vm.contains(vm.data[1].number,vm.selDanValue)){
            vm.responseData.toast = true;
            vm.removeByValue(vm.data[0].number,vm.selDanValue);
          }else {
            vm.responseData.toast = false;
          }
        }else {
          if(vm.contains(vm.data[0].number,vm.selTuoValue)){
            vm.responseData.toast = true;
            vm.removeByValue(vm.data[1].number,vm.selTuoValue);
          }else {
            vm.responseData.toast = false;
          }
        }

        let danLen   = vm.data[0].number.length;
        let tuoLen   = vm.data[1].number.length;
        //前三组三胆拖
        if(vm.params.playType == 73 ){
          if(danLen>1){
            vm.data[0].number.shift();
          }
            if(danLen>0 && tuoLen>0){
              vm.count_zs = danLen * tuoLen * 2 ;
            }else {
              vm.count_zs =0;
            }
          }
        //前三组六胆拖
        else if(vm.params.playType == 75 ){
          if(danLen>2){
            vm.data[0].number.shift();
          }
          if(danLen>0 && tuoLen>0){
            if(danLen==1){
              vm.count_zs = tuoLen*(tuoLen-1)/2
            }else {
              vm.count_zs = tuoLen;
            }
          }else {
            vm.count_zs =0;
          }
      }

        vm.responseData.betInput ={"manys":vm.data[0].number,"singles":vm.data[1].number};
        vm.responseData.waterValue = vm.backWater ;
        vm.responseData.count_zs   = vm.count_zs;
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      ballClick(item,data){
        let vm = this;
        if(data.id == 1){
          vm.selDanValue = item;
          vm.selRow = 1;
          if(vm.contains(vm.data[1].number,item)){
            vm.removeByValue(data.number,item);
          }
        }else {
          vm.selRow = 2;
          vm.selTuoValue = item;
          if(vm.contains(vm.data[0].number,item)){
            vm.removeByValue(data.number,item);

          }
        }
      },
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
    height: 5rem;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  .title{
    text-align: center;
    font-size: 0.2rem;
    height: 0.4rem;
    line-height: 0.4rem;
  }
  li{
    height: 2.5rem;
    margin:  0 auto;
  }
  li:nth-child(3){
    height: 1.1rem;
  }
  li:last-child{
    height: auto;
  }
  }
  .content-item .box{
    width: 90%;
    margin: 0 auto;
  }
  .content-item .checker-item-button{
    float: left;
    width: 20%;
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
  .toast{
    position: fixed;
    top:50%
  }

</style>
