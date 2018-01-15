<template>
  <ul class="content" v-model="balls">
    <li>
      <div class="content-item">
        <div class="box box-btn ">
          <p class="title">万位</p>
          <checker  default-item-class="btn-checker-item quwei" selected-item-class="btn-checker-selected">
            <!--<div class="checker-item-button  " v-for="(item, index) in quweilist">-->
              <!--<checker-item  type="radio" :value="item">{{item}}</checker-item>-->
            <!--</div>-->
          </checker>
          <checker  default-item-class="btn-checker-item double-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button doublebtn" v-for="(item, index) in doublelist">
              <checker-item  type="radio" :value="item" >{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <div class="box box-btn quwei">
          <p class="title">千位</p>
          <checker  default-item-class="btn-checker-item quwei" selected-item-class="btn-checker-selected">
            <!--<div class="checker-item-button " v-for="(item, index) in quweilist">-->
              <!--<checker-item  type="radio" :value="item"  >{{item}}</checker-item>-->
            <!--</div>-->
          </checker>
          <checker  default-item-class="btn-checker-item double-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button doublebtn" v-for="(item, index) in doublelist">
              <checker-item  type="radio" :value="item" >{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <p class="title">百位</p>
        <div class="box box-num">
          <checker v-model="baiNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
          <checker  default-item-class="btn-checker-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button cker " v-for="(item, index) in btnlist">
              <checker-item :value="item" @on-item-click="baiClick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <p class="title">十位</p>
        <div class="box box-num">
          <checker v-model="shiNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
          <checker  default-item-class="btn-checker-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button cker " v-for="(item, index) in btnlist">
              <checker-item :value="item"   @on-item-click="shiClick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="content-item">
        <p class="title">个位</p>
        <div class="box box-num">
          <checker v-model="geNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
          <checker  default-item-class="btn-checker-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button cker " v-for="(item, index) in btnlist">
              <checker-item :value="item" @on-item-click="geClick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
    </li>
    <li>
      <div class="center-range">
        <div class="range">
          <p>下注水位</p>
          <span class="min">{{waterValue}}</span>
          <range  :min="0" :max='maxandmin' :step="1" v-model="rangeValue" :rangeBarHeight="5"></range>
          <span class="max">{{waterValue1}}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
  const numlist = [0,1,2,3,4,5,6,7,8,9];
  const btnlist = ['全','单','双','大','小','清'] ;
  const quweilist = ['一区','二区','三区','四区','五区'] ;
  const doublelist = ['大','小'];
  const baiNum = [] , shiNum = [] , geNum =[],count_zs=0;
  export default {

    props:['params'],
    data(){
      return {
        numlist:numlist,
        btnlist:btnlist,
        quweilist:quweilist,
        doublelist:doublelist,
        baiNum :baiNum,
        shiNum :shiNum,
        geNum  :geNum,
        maxandmin:0, //最大最小水位跨度
        multiplevalue:1, //倍数值
        rangeValue: 0,   //水位
        count_zs :count_zs, //总注数
        responseData:{}, //返回结果
        waterV :0, //返回水位
      }
    },
    created(){
      //获取水位值
      let vm =this;
      vm.maxandmin = (vm.params.maxWater - vm.params.minWater)*10;
      vm.rangeValue = vm.params.maxUserWater;
    },

    computed: {
      waterValue () {
        let vm = this;
        vm.waterV = vm.params.maxWater - (vm.rangeValue/10);
        return  vm.waterV + "%";
      },
      waterValue1(){
        let  vm =this;
        return (vm.rangeValue/10) + "%";
      },

      //计算投注的总注数
      balls(){
        let vm  =this;
        let bailen = vm.baiNum.length;
        let shilen = vm.shiNum.length;
        let gelen = vm.geNum.length;

        if(bailen >0 && shilen >0 && gelen >0){
          vm.count_zs = bailen * shilen * gelen ;
        }else {
          vm.count_zs = 0 ;
        }
        vm.responseData.waterValue = vm.waterV *0.01;
        vm.responseData.count_zs  = vm.count_zs;
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    },

    methods: {
      //百位按钮
      baiClick (itemValue, itemDisabled) {
        if(itemValue =="全"){
          this.baiNum = [0,1,2,3,4,5,6,7,8,9];
        }
        else if(itemValue =="单"){
          this.baiNum = [1,3,5,7,9];
        }
        else if(itemValue =="双"){
          this.baiNum = [0,2,4,6,8];
        }
        else if(itemValue =="大"){
          this.baiNum = [5,6,7,8,9];
        }
        else if(itemValue =="小"){
          this.baiNum = [0,1,2,3,4];
        }else{
          this.baiNum =  [];
        }
      },
      //十位按钮
      shiClick (itemValue, itemDisabled) {
        if(itemValue =="全"){
          this.shiNum = [0,1,2,3,4,5,6,7,8,9];
        }
        else if(itemValue =="单"){
          this.shiNum = [1,3,5,7,9];
        }
        else if(itemValue =="双"){
          this.shiNum = [0,2,4,6,8];
        }
        else if(itemValue =="大"){
          this.shiNum = [5,6,7,8,9];
        }
        else if(itemValue =="小"){
          this.shiNum = [0,1,2,3,4];
        }else{
          this.shiNum =  [];
        }
      },
      //个位按钮
      geClick (itemValue, itemDisabled) {
        if(itemValue =="全"){
          this.geNum = [0,1,2,3,4,5,6,7,8,9];
        }
        else if(itemValue =="单"){
          this.geNum = [1,3,5,7,9];
        }
        else if(itemValue =="双"){
          this.geNum = [0,2,4,6,8];
        }
        else if(itemValue =="大"){
          this.geNum = [5,6,7,8,9];
        }
        else if(itemValue =="小"){
          this.geNum = [0,1,2,3,4];
        }else{
          this.geNum =  [];
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    height: 5.2rem;
    border-radius: 5px;
    padding-top: 0.1rem;
    -webkit-overflow-scrolling: touch;
    overflow:auto;
    .title{
      text-align: center;
      font-size: 0.2rem;
      height: 0.4rem;
      line-height: 0.4rem;
    }
    li{
      height: 3.3rem;
      margin:  0 auto;
    }
    li:nth-last-child(1){
      height: 1.7rem;
    }
    li:nth-child(1),li:nth-child(2){
      height: 1.4rem;
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

  .content-item .doublebtn{
    width: 32%;
    margin-left: 0.74rem;
  }
  .center-range{
    padding:0.2rem 0 0 0.33rem;
    height: auto;
    background-color: #FFF;
    .range{
      padding:0 0.33rem 0 0;
      height: auto;
      position: relative;
      .min{
        float: left;
        display: block;
        width: 1rem;
        text-align: center;
        color:#4584F5;
      }
      .max{
        display: block;
        width: 0.5rem;
        position: absolute;
        right: 0.33rem;
        top:65%;
        text-align: center;
        color:#4584F5;
      }
     }
  }

  /*趣味按钮*/
  .quwei{
    width: 1.02rem;
    padding: 0;
  }
  .double-item{
    width: 1.6rem;
    height: 0.74rem;
    line-height: 0.74rem;
    padding: 0;
  }
</style>
