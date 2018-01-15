<template>
  <ul class="content">
    <li>
       <div class="cp_main">
         <ul>
           <li v-for="(item,index) in list"  @click="select(item.value)" :key="index">
             <img :src=item.img  v-if="!contains(selarr,item.value)">
             <img :src=item.selimg v-if="contains(selarr,item.value)">
             <p>{{item.pl}}</p>
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
          {value:'1,2',img:require('../../../assets/images/lottery/ks/cp1-2.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp1-2.png'),pl:''},
          {value:'1,3',img:require('../../../assets/images/lottery/ks/cp1-3.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp1-3.png'),pl:''},
          {value:'1,4',img:require('../../../assets/images/lottery/ks/cp1-4.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp1-4.png'),pl:''},
          {value:'1,5',img:require('../../../assets/images/lottery/ks/cp1-5.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp1-5.png'),pl:''},
          {value:'1,6',img:require('../../../assets/images/lottery/ks/cp1-6.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp1-6.png'),pl:''},
          {value:'2,3',img:require('../../../assets/images/lottery/ks/cp2-3.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp2-3.png'),pl:''},
          {value:'2,4',img:require('../../../assets/images/lottery/ks/cp2-4.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp2-4.png'),pl:''},
          {value:'2,5',img:require('../../../assets/images/lottery/ks/cp2-5.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp2-5.png'),pl:''},
          {value:'2,6',img:require('../../../assets/images/lottery/ks/cp2-6.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp2-6.png'),pl:''},
          {value:'3,4',img:require('../../../assets/images/lottery/ks/cp3-4.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp3-4.png'),pl:''},
          {value:'3,5',img:require('../../../assets/images/lottery/ks/cp3-5.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp3-5.png'),pl:''},
          {value:'3,6',img:require('../../../assets/images/lottery/ks/cp3-6.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp3-6.png'),pl:''},
          {value:'4,5',img:require('../../../assets/images/lottery/ks/cp4-5.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp4-5.png'),pl:''},
          {value:'4,6',img:require('../../../assets/images/lottery/ks/cp4-6.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp4-6.png'),pl:''},
          {value:'5,6',img:require('../../../assets/images/lottery/ks/cp5-6.png'), selimg:require('../../../assets/images/lottery/ks/sel-cp5-6.png'),pl:''},
        ]
      }
    },
    created(){
      let vm = this;
      let res = vm.params.oddsList;

      for(var key in res){
        for(var key1 in vm.list){
          if(res[key].code == vm.list[key1].value){
            vm.list[key1].pl = res[key].showOdds
          }
        }
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
    height: 3.8rem;
    overflow:scroll;
    border-radius: 5px;
    touch-action: auto;
    -webkit-overflow-scrolling: touch;
    li{
      margin:  0 auto;
    }
    .cp_main{
      height: auto;
      margin:0.1rem auto;
      overflow: hidden;
      ul li{
        float: left;
        width: 33.33%;
        text-align: center;
        height: 1.2rem;
        margin:0.1rem 0;
        img{
          width: 1.8rem;
          height: 0.82rem;
        }
        p{
          height: 0.5rem;
          line-height: 0.5rem;
          color: #BABABA;
        }
      }
    }
  li:nth-last-child(1){
    height: 1.1rem;
  }
  }
</style>
