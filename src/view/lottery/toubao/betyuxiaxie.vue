<template>
  <ul class="content">
    <li>
       <div class="cp_main">
         <ul>
           <li v-for="(item,index) in list"  @click="select(item.value)" :key="index">
             <img :src=item.img    v-if="!contains(selarr,item.value)">
             <img :src=item.selimg v-if="contains(selarr,item.value)">
             <p>{{item.name}}</p>
           </li >
         </ul>
       </div>
    </li>
    <li><water :params="params" @changWate="changWater"></water></li>
  </ul>
</template>
<script>
  export default {
    props:['params'],
    data(){
      return {
        selarr:[],
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        responseData:{},  //返回结果
        list:[
          {value:'1',name:'鱼',img:require('../../../assets/images/lottery/ks/yu.png'), selimg:require('../../../assets/images/lottery/ks/sel-yu.png'),pl:'1.71'},
          {value:'2',name:'虾',img:require('../../../assets/images/lottery/ks/xia.png'), selimg:require('../../../assets/images/lottery/ks/sel-xia.png'),pl:'1.71'},
          {value:'3',name:'葫芦',img:require('../../../assets/images/lottery/ks/hulu.png'), selimg:require('../../../assets/images/lottery/ks/sel-hulu.png'),pl:'1.71'},
          {value:'4',name:'铜钱',img:require('../../../assets/images/lottery/ks/tongqian.png'), selimg:require('../../../assets/images/lottery/ks/sel-tongqian.png'),pl:'1.71'},
          {value:'5',name:'蟹', img:require('../../../assets/images/lottery/ks/xie.png'), selimg:require('../../../assets/images/lottery/ks/sel-xie.png'),pl:'1.71'},
          {value:'6',name:'青蛙',img:require('../../../assets/images/lottery/ks/qingwa.png'), selimg:require('../../../assets/images/lottery/ks/sel-qingwa.png'),pl:'1.71'},
        ]
      }
    },
    methods: {
      select(val){
        let vm = this;
        if(vm.contains(vm.selarr,val)){
          var res = vm.removeByValue(vm.selarr,val);
          vm.selarr = res ;
        }else{
          vm.selarr.push(val);
        }
        let arrlen = vm.selarr.length;
        if(arrlen>0){
          vm.responseData.count_zs  = arrlen
        }else{
          vm.responseData.count_zs  = 0
        }
        vm.responseData.betInput ={"alls":vm.selarr};
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      },
      changWater(data){
        let vm  = this;
        vm.backWater = data.backWater
        vm.responseData.waterValue = vm.backWater
        vm.$emit('resultData',vm.responseData);  //调用父组件的自定义事件，并传值
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    .title{
      text-align: center;
      font-size: 0.2rem;
      height: 0.4rem;
      line-height: 0.4rem;
    }
    .cp_main{
      height: 3.8rem;
      overflow: auto;
      ul li{
        float: left;
        width: 33.33%;
        text-align: center;
        height: 1.6rem;
        margin:0.1rem 0;
        img{
          width: 1.32rem;
          height: 1.32rem;
        }
        p{
          height: 0.5rem;
          line-height: 0.5rem;
          color: #BABABA;
        }
      }
    }
  }
</style>
