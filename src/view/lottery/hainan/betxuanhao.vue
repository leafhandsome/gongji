<template>
  <ul class="content" v-model="balls" :class="showBtn?'':'isShowBtn'">
    <li v-for="items in data">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{items.name}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item" @on-item-click="ballClick(items)">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn" v-if="showBtn" >
          <checker  default-item-class="btn-checker-item" v-model="items.btnNumer">
            <div class="checker-item-button cker " v-for="(item, index) in items.btnText">
              <checker-item :value="item" @on-item-click="btnClick(item,items)" >{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
  </ul>
</template>

<script>
  const  numlist = [0,1,2,3,4,5,6,7,8,9];
  const  btnlist = ['全','大','小','双','单','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        responseData:{},  //返回结果
        showBtn : true,
        betInput:{},
        data:[
          {name:'选号',number:[],numText:numlist,btnNumer:[],btnText:btnlist,id:1},
        ],
      }
    },
    created(){
      let type = this.params.playType
      if(type == 20 ||type == 22 || type == 24 || type == 4030 || type == 4032 || type == 4034){
        this.showBtn = false;
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let len = 0;
        len = vm.data[0].number.length;
        //一字现
        if(vm.params.playType == 12 || vm.params.playType == 4010){
          if(len>0){
            vm.count_zs = len
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //二字现 n*(n-1)/2
        if(vm.params.playType == 13 || vm.params.playType == 4011){
          if(len>1){
            vm.count_zs = len*(len-1)/2
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //三字现 n*(n-1)*（n-2）/6
        if(vm.params.playType == 14 || vm.params.playType == 4012){
          if(len>2){
            vm.count_zs =len*(len-1) *(len-2)/6
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //四字现 n*(n-1)*（n-2）（n-3）/24
        if(vm.params.playType == 15 || vm.params.playType == 4013){
          if(len>3){
            vm.count_zs =len*(len-1)*(len-2)*(len-3)/24;
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //一定位全倒 n*4
        if(vm.params.playType == 16 || vm.params.playType == 4020){
          if(len>0){
            vm.count_zs =len*4
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //二定位全倒 6*n*(n-1)
        if(vm.params.playType == 17 || vm.params.playType == 4021){
          if(len>1){
            vm.count_zs =6*len*(len-1)
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //三定位全倒 4*n*(n-1)*(n-2)
        if(vm.params.playType == 18 || vm.params.playType == 4022){
          if(len>2){
            vm.count_zs =4*len*(len-1)*(len-2)
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //四定位全倒 n*（n-1）*（n-2）*（n-3）
        if(vm.params.playType == 19 || vm.params.playType == 4023){
          if(len>3){
            vm.count_zs =len*(len-1)*(len-2)*(len-3)
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //二字现双重 - 三字现三重
        if(vm.params.playType == 20 || vm.params.playType == 22 || vm.params.playType == 4030|| vm.params.playType == 4032){
          if(len>1){
            vm.data[0].number.shift();
            vm.count_zs = 1;
          }else if(len ==1){
            vm.count_zs = 1 ;
          }else {
            vm.count_zs = 0 ;
          }
          vm.betInput= {"manys":vm.data[0].number} ;
        }
        //四字现二双重
        if(vm.params.playType == 24 || vm.params.playType == 4034){
          if(len>2){
            vm.data[0].number.shift();
            vm.count_zs = 1;
          }else if(len ==2){
            vm.count_zs = 1 ;
          }else {
            vm.count_zs = 0 ;
          }
          vm.betInput= {"manys":vm.data[0].number} ;
        }
        //二定位双重全倒
        if(vm.params.playType == 26 || vm.params.playType == 4040){
          if(len>0){
            vm.count_zs =6*len
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"manys":vm.data[0].number} ;
        }
        //三定位三重全倒
        if(vm.params.playType == 28 || vm.params.playType == 4042){
          if(len>0){
            vm.count_zs =4*len
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"manys":vm.data[0].number} ;
        }
        //四定位二双重全倒
        if(vm.params.playType == 30 || vm.params.playType == 4044){
          if(len>0){
            vm.count_zs = 3*len*(len -1)
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"manys":vm.data[0].number} ;
        }

        vm.responseData.waterValue = vm.backWater
        vm.responseData.count_zs   = vm.count_zs;
        vm.responseData.betInput   = vm.betInput;
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
      ballClick(){
        let vm = this;
        for(var key in vm.data){
          vm.data[key].btnNumer = []
        }
      },
      btnClick(btnText,items){
        let vm = this;
        if(btnText=="全"){
          items.number = [0,1,2,3,4,5,6,7,8,9];
        }else if(btnText =="单"){
          items.number = [1,3,5,7,9];
        }
        else if(btnText =="双"){
          items.number = [0,2,4,6,8];
        }
        else if(btnText =="大"){
          items.number = [5,6,7,8,9];
        }
        else if(btnText =="小"){
          items.number = [0,1,2,3,4];
        }else{
          items.number = [];
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content{
  .title{
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    font-size: 0.2rem;
  }
  li{
    height: 3.2rem;
    margin:  0 auto;
  }
  }
  .content-item .box{
    width: 90%;
    margin: 0 auto;
  }
  .content-item .checker-item-button{
    float: left;
    width: 20%;
    height: 0.7rem;
    margin: 0.1rem 0;
    text-align: center;
    line-height: 0.7rem;
  }
  .content-item .cker{
    float: left;
    width: 16.66%;
    text-align: center;
  }
  .isShowBtn{
    li{
      height: 2.5rem;
      margin:  0 auto;
    }
  }
</style>
