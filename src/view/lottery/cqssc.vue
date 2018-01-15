<template>
  <div>
  <div class="container">
    <div class="top-time">
      <p>距离09322556期开奖:<label class="v-c-red">06:09</label></p>
      <p class="bonus">玩法奖金:<label class="v-c-red"><countup :start-val="1" :end-val="850000" :duration="2" class="demo1"></countup></label>元</p>
    </div>

    <div class="top-tab">
      <tab :line-width=0 active-color='#4584F5' v-model="index" animate>
        <tab-item class="vux-center" :selected="seltab === item" v-for="(item, index) in tablist" @click="seltab = item" :key="index"><span>{{item}}</span></tab-item>
      </tab>
    </div>
    <div v-if="index==0">
      <div class="content-item">
        <p class="tit-badge">千位</p>
        <div class="box box-num">
          <checker v-model="qianNum" type="checkbox"  default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item">{{item}}</checker-item>
            </div>
          </checker>
        </div>
        <div class="box box-btn">
          <checker  default-item-class="btn-checker-item" selected-item-class="btn-checker-selected">
            <div class="checker-item-button cker " v-for="(item, index) in btnlist">
              <checker-item :value="item" @on-item-click="qianClick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
      <div class="content-item">
        <p class="tit-badge">百位</p>
        <div class="box box-num">
          <checker v-model="baiNum" type="checkbox" default-item-class="checker-item sprite" selected-item-class="checker-item-selected sprite-sel">
            <div class="checker-item-button" v-for="(item, index) in numlist">
              <checker-item :value="item" >{{item}}</checker-item>
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
      <div class="content-item">
        <p class="tit-badge">十位</p>
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
              <checker-item :value="item" @on-item-click="shiClick">{{item}}</checker-item>
            </div>
          </checker>
        </div>
      </div>
      <div class="rang-item">
        <group title="下注水位">
          <cell primary="content" :inline-desc="rangeValue" >
            <range v-model="rangeValue" :min="0" :max='48' @on-change="onChange" :step="0.1"></range>
          </cell>
        </group>
      </div>
      <div class="inline-number-item">
        <group title="下注倍数"></group>
        <div class="inline-number-l">
          <inline-x-number width="50px"></inline-x-number>
        </div>
        <div class="inline-number-r">
          <checker radio-required default-item-class="btn-checker-item" selected-item-class="btn-checker-selected">
            <checker-item value="1">元</checker-item>
            <checker-item value="2">角</checker-item>
            <checker-item value="3">分</checker-item>
          </checker>
        </div>
      </div>
      <div class="bottom-price">
        <p>共<label class="v-c-red">10，20</label>元</p>
        <p class="bonus">余额:<label class="v-c-red">888.88</label>元</p>
      </div>
    </div>
    <div v-if="index==1">
      大小
    </div>
    <div v-if="index==2">
      单双
    </div>
    <div v-if="index==3">
      龙虎
    </div>
  </div>
    <bottomCar></bottomCar>
  </div>
</template>

<script>
  import {Checker,CheckerItem, Tab, TabItem,Range,Group,Cell,InlineXNumber,Countup} from 'vux'

  const tablist = () => ['一定位', '大小', '单双', '龙虎'];
  const numlist = () => [0,1,2,3,4,5,6,7,8,9];
  const btnlist = () => ['全','单','双','大','小','清']
  let max = 4.8 ,rangeValue = 0;
  const  qianNum = [],baiNum = [] ,shiNum = []  ;

  export default {
    data () {
      return {
        tablist: tablist(),
        numlist:numlist(),
        btnlist:btnlist(),
        seltab: '一定位',
        index: 0,
        rangeValue:rangeValue,
        max:max,
        qianNum:qianNum,
        baiNum:baiNum,
        shiNum:shiNum
      }
    },
    components: {
      Tab,
      TabItem,
      Checker,
      CheckerItem,
      Range,
      Group,
      Cell,
      InlineXNumber,
      Countup
    },
    methods: {
      onChange:function (val) {
        rangeValue = val/10
        console.log(rangeValue)
      },
      //千位按钮
      qianClick:function (itemValue, itemDisabled) {
        if(itemValue =="全"){
          this.qianNum = [0,1,2,3,4,5,6,7,8,9];
        }
        else if(itemValue =="单"){
          this.qianNum = [1,3,5,7,9];
        }
        else if(itemValue =="双"){
          this.qianNum = [0,2,4,6,8];
        }
        else if(itemValue =="大"){
          this.qianNum = [5,6,7,8,9];
        }
        else if(itemValue =="小"){
          this.qianNum = [0,1,2,3,4];
        }else{
          this.qianNum =  [];
        }
      },
      //百位按钮
      baiClick:function (itemValue, itemDisabled) {
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
      shiClick:function (itemValue, itemDisabled) {
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
      }
    }
  }

</script>

<style scoped lang="scss" >
  /*@import "../../assets/css/lottery/cqssc.css";*/
</style>
