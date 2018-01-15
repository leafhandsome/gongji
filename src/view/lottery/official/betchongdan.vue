<template>
  <ul class="content" v-model="balls">
    <li v-for="items in data">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{items.name}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn" >
          <checker  default-item-class="btn-checker-item" v-model="items.btnNumer">
            <div class="checker-item-button cker " v-for="(item, index) in items.btnText">
              <checker-item :value="item" @on-item-click="btnClick(item,items)" >{{item}}</checker-item>
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
  const  btnlist = ['全','大','小','双','单','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水
        selChongValue:'',
        selDanValue :'',
        responseData:{},  //返回结果
        showToast:false,  //显示提示
        ToastText:'不能选择相同号码',//提示内容
        ToastPosition: 'default',//提示位置;
        data:[
          {name:'重号',number:[],numText:numlist,btnNumer:[],btnText:btnlist,id:1},
          {name:'单号',number:[],numText:numlist,btnNumer:[],btnText:btnlist,id:2},
        ],
        selRow:'',
      }
    },
    created(){
      let vm = this;
      let type = vm.params.playType;
      if(type==47){
        vm.data[0].name = '三重号';
        vm.data[1].name = '二重号';
      }
    },


    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        let equalLen = 0;
        let chongLen = vm.data[0].number.length;
        let danLen   = vm.data[1].number.length;

        for(var key in vm.data[0].number){
          for(var key1 in vm.data[1].number ){
            if(vm.data[0].number[key] == vm.data[1].number[key1]){
              equalLen++;
            }
          }
        }

        //五星组选60 c*d*(d-1)*(d-2)/6-dc*(d-1)*(d-2)/2
        if(vm.params.playType == 44){
          if(chongLen>0 && danLen>2){
            vm.count_zs = chongLen*danLen*(danLen-1)*(danLen-2)/6-equalLen*(danLen-1)*(danLen-2)/2;
          }else {
            vm.count_zs = 0;
          }
        }
        //五星组选30 (c*(c-1)/2)*d-dc*(dc-1)
        else if(vm.params.playType == 45){
          if(chongLen>1 && danLen>0){
            if(danLen!=1 || equalLen!=1){
              vm.count_zs =(chongLen*(chongLen-1)/2)*danLen-equalLen*(equalLen-1);
            }
          }else {
            vm.count_zs =0;
          }
        }
        //五星组选20 c*d*(d-1)/2-dc*(d-1)
        else if(vm.params.playType == 46){
          if(chongLen>0 && danLen>1){
            vm.count_zs =  chongLen * danLen*(danLen-1)/2-equalLen*(danLen-1);
          }else {
            vm.count_zs =0;
          }
        }
        //五星组选10 a=c*d-dc
        else if(vm.params.playType == 47){
          if(chongLen>0 && danLen>0){
            vm.count_zs =chongLen * danLen - equalLen;
          }else {
            vm.count_zs =0;
          }
        }
        //五星组选5 a=c*d-dc
        else if(vm.params.playType == 48){
          if(chongLen>0 && danLen>0){
            vm.count_zs =chongLen * danLen - equalLen;
          }else {
            vm.count_zs =0;
          }
        }
        //前四组选12 c*d*(d-1)/2-dc*(d-1)
        else if(vm.params.playType == 54){
          if(chongLen>0 && danLen>1){
            vm.count_zs =  chongLen * danLen * (danLen-1)/2-equalLen*(danLen-1);
          }else {
            vm.count_zs =0;
          }
        }
        //前四组选4 c*d-dc
        else if(vm.params.playType == 56){
          if(chongLen>0 && danLen>0){
            vm.count_zs = chongLen * danLen - equalLen;
          }else {
            vm.count_zs =0;
          }
        }else {

        }

        vm.responseData.betInput   = {"manys":vm.data[0].number,"singles":vm.data[1].number};
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
    height: 3.2rem;
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
