<template>
  <ul class="content" :class="type?'qiansan':''">
    <li v-for="items in data" v-model="balls">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{items.name}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
          <checker default-item-class="btn-checker-item" v-model="items.btnNumer">
            <div class="checker-item-button cker " v-for="(item, index) in items.btnText">
              <checker-item :value="item" @on-item-click="btnClick(item,items)">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
    <li>
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
      </div>
    </li>
  </ul>
</template>

<script>
  const  numlist = [1,2,3,4,5,6,7,8,9,10];
  const  btnlist = ['全','大','小','双','单','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs  :0,     //总注数
        backWater :0,     //返回水
        showToast :false, //显示提示
        ToastText :'',    //提示内容
        ToastPosition: 'bottom',//提示位置,
        responseData:{},  //返回结果,
        betInput  :{},
        type:false,
        data :[
          {id:1,name:'冠军',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'no1'},
          {id:2,name:'亚军',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'no2'},
          ],
      }
    },
    created(){
      let vm = this;
      if(vm.params.playType == 3036){
        vm.type = true;
        vm.data = [
          {id:1,name:'冠军',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'no1'},
          {id:2,name:'亚军',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'no2'},
          {id:3,name:'季军',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'no3'},
        ];
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  = this;
        //前二直选
        if(vm.params.playType == 3035){
          let repetionLen = 0;
          let number1  = vm.data[0].number;
          let number2  = vm.data[1].number;
          let selNum   = [[],[]];
          if(number1.length!= 0 && number2.length!= 0 ){
            vm.count_zs = 1;
            repetionLen = (vm.filterData(number1,number2)).length;
            for (var key in vm.data) {
              let len = vm.data[key].number.length;
              if (len > 0) {
                vm.count_zs *= len;
              }
            }
            //号码加上0
            for(var i =0;i<2;i++){
              for(var num in vm.data[i].number){
                if(vm.data[i].number[num]<10){
                  selNum[i].push('0'+vm.data[i].number[num]);
                }else {
                  selNum[i].push(vm.data[i].number[num])
                }
              }
              vm.betInput[vm.data[i].inputName] = selNum[i];
            }
            vm.count_zs = vm.count_zs  -  repetionLen;
          }else {
            vm.count_zs = 0;
          }
        }
        //前三直选
        else {
          let all = [] ;
          let selNum   = [[],[],[]];
          let number1 = vm.data[0].number;
          let number2 = vm.data[1].number;
          let number3 = vm.data[2].number;
          if(number1.length!= 0 && number2.length!= 0 && number3.length!= 0){
            for(var i=0;i<number1.length;i++){
              for(var j=0;j<number2.length;j++){
                for(var k=0;k<number3.length;k++){
                  if (number1[i] == number2[j] || number1[i] == number3[k] || number2[j] == number3[k]){
                    continue;
                  }
                  all.push(number1[i]);
                  all.push(number2[j]);
                  all.push(number3[k]);
                }
              }
            }
            vm.count_zs = all.length / 3;
            //号码加上0
            for(var i =0;i<3;i++){
              for(var num in vm.data[i].number){
                if(vm.data[i].number[num]<10){
                  selNum[i].push('0'+vm.data[i].number[num]);
                }else {
                  selNum[i].push(vm.data[i].number[num])
                }
              }
              vm.betInput[vm.data[i].inputName] = selNum[i];
            }
          }else {
            vm.count_zs = 0;
          }
        }
        vm.responseData.betInput   = vm.betInput;
        vm.responseData.waterValue = vm.backWater;
        vm.responseData.count_zs   = vm.count_zs;
        vm.$emit('resultData',vm.responseData);   //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      //点击快捷选择
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
          items.number =  [];
          return;
        }
      },
      //水位调节
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
    overflow:scroll;
    touch-action: auto;
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
  .qiansan{
    li{}
    li:nth-child(3){
      height: 3.2rem;
      }
    li:nth-child(4){
      height: 1.1rem;
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
</style>
