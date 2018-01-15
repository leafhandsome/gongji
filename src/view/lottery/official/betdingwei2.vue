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
        showToast:false,  //显示提示
        ToastText:'',     //提示内容
        ToastPosition: 'bottom',//提示位置,
        responseData:{},  //返回结果,
        betInput:{},
        data:[
          {id:1,name:'万位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'thousands'},
          {id:2,name:'千位',number:[],numText:numlist,btnNumer:[],btnText:btnlist,inputName:'hundrs'},
        ],
      }
    },

    computed: {
      //计算投注的总注数
      balls(){
        let vm  =this;
        vm.count_zs = 0 ;
        if(vm.params.playType == 100){
          let count   = 0;
          vm.count_zs = 1;
          for (var key in vm.data) {
            let len = vm.data[key].number.length;
            if (len > 0) {
              count ++
              vm.count_zs *= len;
              vm.betInput[vm.data[key].inputName] = vm.data[key].number;
            }
          }
          if (count != 2) {
            vm.count_zs = 0;
          }
        }

        vm.responseData.betInput   = vm.betInput;
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
