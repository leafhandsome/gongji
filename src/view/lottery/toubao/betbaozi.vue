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
           <li @click="select(alls.code)">
             <div class="bet-btn " :class="contains(selarr,alls.code)?'sel-btn':''" >
               <p class="bet-name">全骰</p>
               <p class="f26">{{alls.showOdds}}</p>
             </div>
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
          {value:'1',img:require('../../../assets/images/lottery/ks/bz1.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz1.png'),pl:''},
          {value:'2',img:require('../../../assets/images/lottery/ks/bz2.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz2.png'),pl:''},
          {value:'3',img:require('../../../assets/images/lottery/ks/bz3.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz3.png'),pl:''},
          {value:'4',img:require('../../../assets/images/lottery/ks/bz4.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz4.png'),pl:''},
          {value:'5',img:require('../../../assets/images/lottery/ks/bz5.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz5.png'),pl:''},
          {value:'6',img:require('../../../assets/images/lottery/ks/bz6.png'), selimg:require('../../../assets/images/lottery/ks/sel-bz6.png'),pl:''},
        ],
        alls:{},
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
        if(res[key].code=="-"){
          vm.alls = res[key];
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
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    border-radius: 5px;
    overflow:scroll;
    height: 5rem;
    -webkit-overflow-scrolling: touch;
    .cp_main{
      overflow: hidden;
      ul li{
        float: left;
        width: 50%;
        text-align: center;
        height: 1.2rem;
        margin:0.1rem 0;
        img{
          width: 2.66rem;
          height: 0.82rem;
        }
        p{
          height: 0.5rem;
          line-height: 0.5rem;
          color: #BABABA;
        }
        .bet-btn{
          color: #BABABA;
          width: 1.8rem;
          height: 0.74rem;
          line-height: 0.74rem;
          margin:0.1rem auto;
          padding: 0.05rem 0;
          border:1px solid #e5e5e5;
          border-radius: 5px;
          text-align: center;
        p{
          display: block;
          line-height: 0.4rem;
        }
        .bet-name{
          font-size: 0.34rem;
          color: #828282;
        }
        }
        .sel-btn{
          background-color: #52aafc;
          border: none;
          color: #fff;
          .bet-name{
            color: #fff;
          }
          p{
            color: #fff;
          }
        }
      }
    }
    li:nth-last-child(1){
      height: 1.1rem;
    }
  }
</style>
