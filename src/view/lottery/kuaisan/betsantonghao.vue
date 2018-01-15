<template>
  <ul class="content" >
    <li>
       <div class="bet-main">
         <ul>
           <li  v-for="(item,index) in list" @click="select(item.value)" >
            <div class="bet-btn " :class="contains(selarr,item.value)?'sel-btn':''" >
              <p class="bet-name">{{item.name}}</p>
              <p class="f20">{{item.pl}}</p>
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
        backWater :0,     //返回水位
        count_zs :0,      //总注数
        responseData:{},  //返回结果
        list:[
          {name:111,value:'1',pl:''},
          {name:222,value:'2',pl:''},
          {name:333,value:'3',pl:''},
          {name:444,value:'4',pl:''},
          {name:555,value:'5',pl:''},
          {name:666,value:'6',pl:''},
          {name:'通选',value:'-',pl:''},
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
      },
      //获取赔率
      getPlayOddsList(playType){
        let vm = this;
        let token  = vm.getValue("token");
        let userId = vm.getValue("userId");
        if(token && userId){
          let parmars = {
            "playType" :playType
          }
          vm.unitAjax('POST','/api/room/getPlayOddsList',parmars,function(result){
            if(result.result){
              let res = result.data;
              for(var key in res){
                for(var key1 in vm.list){
                  if(res[key].code == vm.list[key1].value){
                    vm.list[key1].pl = res[key].showOdds
                  }
                }
              }
            }else {
              if (result.operateCode == 100) {  //登录形象过期了，清除token userId ,
                vm.removeValue("token");
                vm.removeValue("userId")
                setInterval(function () {
                  vm.showLogin = true;
                  vm.cancel();
                }, 1000);
              }
            }
          });
        }else {
          vm.showLogin = true;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    .bet-main{
      overflow: auto;
      ul li{
        float: left;
        width: 25%;
        height: 1rem;
        margin:0.1rem auto;
        .bet-btn{
          color: #BABABA;
          width: 1.3rem;
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
        }
      }
    }
  li:nth-last-child(1){
    height: 1.1rem;
  }
  }
</style>
