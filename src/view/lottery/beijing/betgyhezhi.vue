<template>
  <ul class="content">
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

  const count_zs=0,selarr = [];
  export default {
    props:['params'],
    data(){
      return {
        selarr:[],
        count_zs :0,      //总注数
        backWater :0,     //返回水位
        responseData:{},  //返回结果
        list:[
          {name:3,value:'3',pl:''},
          {name:4,value:'4',pl:''},
          {name:5,value:'5',pl:''},
          {name:6,value:'6',pl:''},
          {name:7,value:'7',pl:''},
          {name:8,value:'8',pl:''},
          {name:9,value:'9',pl:''},
          {name:10,value:'10',pl:''},
          {name:11,value:'11',pl:''},
          {name:12,value:'12',pl:''},
          {name:13,value:'13',pl:''},
          {name:14,value:'14',pl:''},
          {name:15,value:'15',pl:''},
          {name:16,value:'16',pl:''},
          {name:17,value:'17',pl:''},
          {name:18,value:'18',pl:''},
          {name:19,value:'19',pl:''},
        ]
      }
    },
    created(){
      let vm = this;
      let res = vm.params.oddsList;

      //前三和
      if(vm.params.playType == 3038){
        vm.list = [
          {name:6,value:'6',pl:''},
          {name:7,value:'7',pl:''},
          {name:8,value:'8',pl:''},
          {name:9,value:'9',pl:''},
          {name:10,value:'10',pl:''},
          {name:11,value:'11',pl:''},
          {name:12,value:'12',pl:''},
          {name:13,value:'13',pl:''},
          {name:14,value:'14',pl:''},
          {name:15,value:'15',pl:''},
          {name:16,value:'16',pl:''},
          {name:17,value:'17',pl:''},
          {name:18,value:'18',pl:''},
          {name:19,value:'19',pl:''},
          {name:20,value:'20',pl:''},
          {name:21,value:'21',pl:''},
          {name:22,value:'22',pl:''},
          {name:23,value:'23',pl:''},
          {name:24,value:'24',pl:''},
          {name:25,value:'25',pl:''},
          {name:26,value:'26',pl:''},
          {name:27,value:'27',pl:''},
        ]
      }

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
        vm.responseData.betInput ={"numbers":vm.selarr};
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
    height: 3rem;
    border-radius: 5px;
    overflow:scroll;
    touch-action: auto;
    -webkit-overflow-scrolling: touch;
    .title{
      text-align: center;
      font-size: 0.2rem;
      height: 0.4rem;
      line-height: 0.4rem;
    }
    .bet-main{
      width:100%;
      overflow: hidden;
      ul li{
        float: left;
        height: 1rem;
        width: 33.33%;
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
        }
      }
    }
  }
</style>
