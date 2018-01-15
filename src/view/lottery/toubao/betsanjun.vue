<template>
  <ul class="content">
    <li>
       <div class="cp_main">
         <ul>
           <li v-for="(item,index) in list"  @click="select(item.value)" :key="index">
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
          {img:require('../../../assets/images/lottery/ks/1.png'), selimg:require('../../../assets/images/lottery/ks/sel-1.png'),pl:'1.71',value:'1'},
          {img:require('../../../assets/images/lottery/ks/2.png'), selimg:require('../../../assets/images/lottery/ks/sel-2.png'),pl:'1.71',value:'2'},
          {img:require('../../../assets/images/lottery/ks/3.png'), selimg:require('../../../assets/images/lottery/ks/sel-3.png'),pl:'1.71',value:'3'},
          {img:require('../../../assets/images/lottery/ks/4.png'), selimg:require('../../../assets/images/lottery/ks/sel-4.png'),pl:'1.71',value:'4'},
          {img:require('../../../assets/images/lottery/ks/5.png'), selimg:require('../../../assets/images/lottery/ks/sel-5.png'),pl:'1.71',value:'5'},
          {img:require('../../../assets/images/lottery/ks/6.png'), selimg:require('../../../assets/images/lottery/ks/sel-6.png'),pl:'1.71',value:'6'},
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
        console.log(vm.selarr)
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
    .cp_main{
      height: 3rem;
      ul li{
        float: left;
        width: 33.33%;
        text-align: center;
        height: 1.3rem;
        margin:0.1rem 0;
        img{
          width: 0.87rem;
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
