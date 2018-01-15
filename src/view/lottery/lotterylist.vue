<template>
  <div class="cantainer">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <div class="header-right" >
        <div class="cut"  @click="$router.go(-1)">
          <img src="../../assets/images/lottery/cut1.png">
        </div>
      </div>
    </div>
     <div class="lotterylist">
        <ul>
           <li v-for="item in resultData" v-if="item.roomState==1">
              <div class="lottery-item" :class="item.roomId==nowroomId?'avitice':''" @click=gobet(item)>
                 <p class="lotteryname">{{item.roomName}}</p>
                 <p class="lotterytiem">{{item.endTime | remaining}}</p>
                 <img v-bind="{src:item.gameImage.smallOpenLogo}" v-if="item.gameImage">
              </div>
           </li>
        </ul>
     </div>
  </div>
</template>

<script>
  import {imgBaseUrl} from '../../config/env';
  export  default {
    data(){
      return{
        resultData:{},
        nowroomId:0,
        imgBaseUrl:imgBaseUrl,
        refresh : true,
        timer:''
      }
    },
    created(){
      let vm = this;
      vm.getGame();
      vm.nowroomId  = vm.$route.params.roomId;
      vm.stopBodyScroll(false);
    },
    mounted(){
      let vm = this;

      //页面离开停止倒计时
      window.addEventListener("popstate", function(e) {
        clearInterval(vm.timer);
      }, false);
    },

    methods:{
      getGame(){
        let vm = this;
          vm.unitAjax('POST','/api/room/roomList',{},function (result) {
            if(result.result){
              vm.resultData = result.data.roomList;
              let data =  vm.resultData;
                vm.timer = setInterval(() => {
                  for(var key in data){
                    if(data[key].roomState==1){
                      if(data[key].endTime >0) {
                        data[key].endTime--;
                      }else {
                        data = {};
                        vm.getGame();
                        setInterval(vm.timer);
                        return false;
                      }
                    }
                  }
                },1000);
              }
          });
      },
      gobet(data){
        this.$router.push({path: '/betting/'+data.roomId+"/"+data.roomName});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cantainer{
    position: relative;
    height: 13.34rem;
    background: #16619E;
    overflow: auto;
  .header{
    position: absolute;
    top:0;
    background:none;
    border-bottom:none;
    .header-right{
      top:0;
      right:0;
      height: 1.082rem;
      line-height: 1.082rem;
      color:#fff;
    span{
      float: left;
      text-align: center;
      width: 1rem;
    }
    .cut{
      width: 1rem;
      height: 1.082rem;
      line-height: 1.082rem;
      float: left;
      text-align: center;
      padding-top:0.375rem;
      img{
        width: 0.35rem;
        height: 0.35rem;
      }
    }
  }
  .returnBtn:after{
    border-color: #fff;
  }
    .header-title{
      color:#fff;
    }
  }
   .lotterylist{
     margin-top: 1.082rem;
     .lottery-item{
       width: 6.84rem;
       height: 1.22rem;
       margin: 0 auto;
       border-radius: 5px;
       background: #2780D1;
       margin-bottom: 0.37rem;
       position: relative;
       color: #fff;
       opacity:0.5;
       p{

         float: left;
         line-height: 1.22rem;
       }
        img{
          width: 3.62rem;
          height: 0.82rem;
          position: absolute;
          bottom: 0;
          right: 0;
        }
       .lotteryname{
         padding: 0 0 0 0.2rem;
         font-size: 0.34rem;
       }
       .lotterytiem{
         width: 1rem;
         margin-left: 0.3rem;
         font-size: 0.3rem;
       }
     }
    .avitice{
      opacity:1;
    }
   }
  }

</style>
