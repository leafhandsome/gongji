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
        <div class="box box-btn" v-if="showBtn">
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
        betInput:{},
        showBtn : true,
        data:[
          {name:'选号',number:[],numText:numlist,btnNumer:[],btnText:btnlist,id:1},
        ],
      }
    },
    created(){
      let type = this.params.playType
      if(type == 77){
        this.showBtn = false;
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let len = 0;
        len = vm.data[0].number.length;
        //前三一码，中三一码，后三一码，五星一码
        if(vm.params.playType == 130 || vm.params.playType == 131 ||vm.params.playType == 132 ||vm.params.playType == 133){
          if(len>0){
            vm.count_zs = len
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
        //五星二码计重 n*(n-1)/2
        else if(vm.params.playType == 134 ||vm.params.playType == 136){
          if(len>1){
            vm.count_zs = len*(len-1)/2
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number} ;
        }
         //五星三码计重 n*(n-1)*(n-2)/6
        else if(vm.params.playType == 135 || vm.params.playType == 137){
          if(len>2){
            vm.count_zs = len*(len-1)*(len-2)/6
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //五星组选120 n*(n-1) *(n-2) *(n-3) *(n-4)/120
        else if(vm.params.playType == 43){
          if(len>4){
            vm.count_zs = len*(len-1) *(len-2) *(len-3) *(len-4)/120
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前四组选24 n*(n-1) *(n-2) *(n-3)/24
        else if(vm.params.playType == 53){
          if(len>3){
            vm.count_zs = len*(len-1) *(len-2) *(len-3)/24
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前四组选6 n*(n-1) *(n-2) *(n-3)/24
        else if(vm.params.playType == 55){
          if(len>1){
            vm.count_zs = len*(len-1) /2;
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前三组三 n*(n-1)
        else if(vm.params.playType == 72){
          if(len>1){
            vm.count_zs = len*(len-1);
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前三组六 n*(n-1)*(n-2) /6
        else if(vm.params.playType == 74){
          if(len>2){
            vm.count_zs = len*(len-1)*(len-2) /6
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前三组选包胆
        else if(vm.params.playType == 77){
          if(len>1){
            vm.data[0].number.shift();
          }
          len = vm.data[0].number.length;
          if(len>0 && len == 1){
            vm.count_zs = 54 ;
          }else {
            vm.count_zs = 0 ;
          }
          vm.betInput= {"all":vm.data[0].number};
        }

        //前三跨度
        else if(vm.params.playType == 78){
          if(len>0){
            let nums = vm.data[0].number;
            let total = 0;
            for(var key in nums){
              if(nums[key]==0){
                total += 10;
              }else if(nums[key]==1 || nums[key]==9){
                total += 54;
              }else if(nums[key]==2 || nums[key]==8){
                total += 96;
              }else if(nums[key]==3 || nums[key]==7){
                total += 126;
              }else if(nums[key]==4 || nums[key]==6){
                total += 144;
              }else {
                total += 150;
              }
            }
            vm.count_zs = total ;
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前二跨度
        else if(vm.params.playType == 104){
          if(len>0){
            let nums = vm.data[0].number;
            let total = 0;
            for(var key in nums){
              if(nums[key]==0){
                total += 10;
              }else if(nums[key]==1){
                total += 18;
              }else if(nums[key]==2){
                total += 16;
              }else if(nums[key]==3){
                total += 14;
              }else if(nums[key]==4){
                total += 12;
              }else if(nums[key]==5){
                total += 10;
              }else if(nums[key]==6){
                total += 8;
              }else if(nums[key]==7){
                total += 6;
              }else if(nums[key]==8){
                total += 4;
              }else{
                total += 2;
              }
            }
            vm.count_zs = total ;
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }
        //前二组合复式  n*(n-1)/2
        else if(vm.params.playType == 102){
          if(len>1){
            vm.count_zs = len*(len-1)/2
          }else {
            vm.count_zs = 0
          }
          vm.betInput= {"all":vm.data[0].number};
        }else {

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
