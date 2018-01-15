<template>
  <ul class="content" :class="row==4?'row4':''">
    <li v-for="items in data" v-model="balls">
      <div class="content-item">
        <div class="box box-num">
          <p class="title">{{items.name}}</p>
          <checker v-model="items.number" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in items.numText">
              <checker-item :value="item" :key="item" @on-item-click="ballClick(items)">{{item}}</checker-item>
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
  const  numlist = [0,1,2,3,4,5,6,7,8,9];
  const  btnlist = ['全','大','小','双','单','清'];
  export default {
    props:['params'],
    data(){
      return {
        count_zs :0,      //总注数
        backWater :0,     //返回水
        showToast:false,  //显示提示
        ToastText:'',     //提示内容
        ToastPosition:'bottom',//提示位置,
        responseData:{},  //返回结果,
        selNum :[],
        betInput:{},
        data:[
          {id:1,name:'万位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'thousands'},
          {id:2,name:'千位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'hundrs'},
          {id:3,name:'百位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'tens'},
          {id:4,name:'十位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'ones'},
          {id:5,name:'个位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'specials'}
          ],
         row:0
      }
    },

    created(){
      let vm = this;
      let type = vm.params.playType ;
      if(type==4000 ||type==4001 ||type==4002 ||type==4003){
        vm.data=[
          {id:1,name:'千位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'thousands'},
          {id:2,name:'百位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'hundrs'},
          {id:3,name:'十位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'tens'},
          {id:4,name:'个位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'ones'},
        ],
        vm.row =4;
      }
    },
    computed: {
      //计算投注的总注数
      balls(){
        let vm  = this;
        let selcount = vm.selNum.length;
        vm.count_zs = 0 ;
        //一定位
        if(vm.params.playType==8 || vm.params.playType==4000) {
          vm.betInput = {};
          for (var key in vm.data) {
            let len = vm.data[key].number.length;
            if (len > 0 ) {
              vm.betInput[vm.data[key].inputName] = vm.data[key].number;
              vm.count_zs = len
            }
          }
          //二定位
        }else if(vm.params.playType==9 || vm.params.playType==4001 && selcount==2){
          let count =0;
          vm.betInput = {};
          vm.count_zs =1;
          for (var key in vm.data) {
            let len = vm.data[key].number.length;
            if (len > 0) {
              count++;
              vm.count_zs*= len;
              vm.betInput[vm.data[key].inputName] = vm.data[key].number;
            }
          }
          if(count!=2){
            vm.count_zs =0;
          }
          //三定位
        }else if(vm.params.playType==10 || vm.params.playType==4002 && selcount==3){
          let count =0;
          vm.betInput = {};
          vm.count_zs =1;
          for (var key in vm.data) {
            let len = vm.data[key].number.length;
            if (len > 0) {
              count++;
              vm.count_zs*= len;
              vm.betInput[vm.data[key].inputName] = vm.data[key].number;
            }
          }
          if(count!=3){
            vm.count_zs =0;
          }
          //四定位
        }else if(vm.params.playType == 11 || vm.params.playType==4003 && selcount==4) {
          let count = 0;
          vm.betInput = {};
          vm.count_zs = 1;
          for (var key in vm.data) {
            let len = vm.data[key].number.length;
            if (len > 0) {
              count++;
              vm.count_zs *= len;
              vm.betInput[vm.data[key].inputName] = vm.data[key].number;
            }
          }
          if (count != 4) {
            vm.count_zs = 0;
          }
        }
        vm.responseData.betInput =   vm.betInput;
        vm.responseData.waterValue = vm.backWater ;
        vm.responseData.count_zs   = vm.count_zs;
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      addBall(){
        let vm = this;
        for(var key in vm.data){
          //一定位
          if(vm.params.playType==8 || vm.params.playType==4000){
            if(vm.data[key].id!=vm.selNum[0]){
              vm.data[key].number = []
            }
          }
          //二定位
          else if(vm.params.playType==9 || vm.params.playType==4001){
            if(vm.data[key].id!=vm.selNum[0] && vm.data[key].id!=vm.selNum[1]){
              vm.data[key].number = []
            }
          }
          //三定位
          else if(vm.params.playType==10 || vm.params.playType==4002){
            if(vm.data[key].id!=vm.selNum[0] && vm.data[key].id!=vm.selNum[1] && vm.data[key].id!=vm.selNum[2]){
              vm.data[key].number = []
            }
          }
          //四定位
          else if(vm.params.playType==11 || vm.params.playType==4003){
            if(vm.data[key].id!=vm.selNum[0] && vm.data[key].id!=vm.selNum[1] && vm.data[key].id!=vm.selNum[2] && vm.data[key].id!=vm.selNum[3]){
              vm.data[key].number = []
            }
          }
        }
      },
      //选择号码
      selBall(items){
        let vm = this;
        if(vm.contains(vm.selNum,items.id)){
          vm.removeByValue(items.id);
        }
        else {
          vm.selNum.push(items.id);
        }
         //一定位
        if(vm.params.playType == 8 || vm.params.playType==4000){
          if(vm.selNum.length>1){
            vm.selNum.shift();
          }
        }
        //二定位
       else if(vm.params.playType == 9 || vm.params.playType==4001){
          if(vm.selNum.length>2){
            vm.selNum.shift();
          }
        }
        //三定位
       else if(vm.params.playType == 10 || vm.params.playType==4002){
          if(vm.selNum.length>3){
            vm.selNum.shift();
          }
        }
        //四定位
       else if(vm.params.playType == 11 || vm.params.playType==4003){
          if(vm.selNum.length>4){
            vm.selNum.shift();
          }
        }
      },
      ballClick(items){
        let vm = this;
        vm.selBall(items);
        vm.addBall();
        for(var key in vm.data){
          vm.data[key].btnNumer = []
        }
      },
      //点击快捷选择
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
          items.number =  [];
          return;
        }
        vm.selBall(items);
        vm.addBall();
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
    overflow: scroll;
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
  li:nth-child(6){
    height: 1.1rem;
  }
  li:last-child{
    height: auto;
  }
  }
  .row4{
    li:nth-child(5){
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
