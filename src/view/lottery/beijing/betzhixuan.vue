<template>
  <ul class="content" v-model="balls">
    <li v-for="items in data">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{rankingName}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item" @on-item-click="ballClick(items)">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
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
  const  numlist = [1,2,3,4,5,6,7,8,9,10];
  const  btnlist = ['全','大','小','双','单','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        responseData:{},  //返回结果
        betInput:{},
        data:[
          {number:[],numText:numlist,btnNumer:[],btnText:btnlist,id:1},
        ],
        rankingName:''
      }
    },
    created(){
      let vm = this;
      let playType = vm.params.playType;
      if(playType == 3025){
        vm.rankingName = '冠军';
      }else if(playType == 3026){
        vm.rankingName = '亚军';
      }else if(playType == 3027){
        vm.rankingName = '季军';
      }else if(playType == 3028){
        vm.rankingName = '第四名';
      }else if(playType == 3029){
        vm.rankingName = '第五名';
      }else if(playType == 3030){
        vm.rankingName = '第六名';
      }else if(playType == 3031){
        vm.rankingName = '第七名';
      }else if(playType == 3032){
        vm.rankingName = '第八名';
      }else if(playType == 3033){
        vm.rankingName = '第九名';
      }else{
        vm.rankingName = '第十名';
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let numbers = [] ;
        let data = vm.data[0].number;
        vm.count_zs = data.length;
        for(var key in data){
         if(data[key]<10){
           numbers.push('0'+data[key])
         }else {
           numbers.push(data[key])
         }
        }
        vm.betInput= {"numbers":numbers} ;

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
          items.number = [1,2,3,4,5,6,7,8,9,10];
        }else if(btnText =="单"){
          items.number = [1,3,5,7,9];
        }
        else if(btnText =="双"){
          items.number = [2,4,6,8,10];
        }
        else if(btnText =="大"){
          items.number = [6,7,8,9,10];
        }
        else if(btnText =="小"){
          items.number = [1,2,3,4,5];
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
</style>
