<template>
  <ul class="content">
    <li>
       <div class="cp_main">
         <ul>
           <li v-for="(item,index) in list"  @click="select(item.value)" :key="index" >
             <img :src=item.img    v-if="!contains(selarr,item.value)">
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
          {img:require('../../../assets/images/lottery/ks/dp1.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp1.png'),pl:'',value:'1,1'},
          {img:require('../../../assets/images/lottery/ks/dp2.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp2.png'),pl:'',value:'2,2'},
          {img:require('../../../assets/images/lottery/ks/dp3.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp3.png'),pl:'',value:'3,3'},
          {img:require('../../../assets/images/lottery/ks/dp4.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp4.png'),pl:'',value:'4,4'},
          {img:require('../../../assets/images/lottery/ks/dp5.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp5.png'),pl:'',value:'5,5'},
          {img:require('../../../assets/images/lottery/ks/dp6.png'), selimg:require('../../../assets/images/lottery/ks/sel-dp6.png'),pl:'',value:'6,6'},
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
    border-radius: 5px;
    .title{
      text-align: center;
      font-size: 0.2rem;
      height: 0.4rem;
      line-height: 0.4rem;
    }
    .cp_main{
      width:100%;
      height: 2.7rem;
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
  }
</style>
