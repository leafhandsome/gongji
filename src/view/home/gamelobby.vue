<template>
  <div class="container">
    <div class="bottom-vav ">
      <navBar ></navBar>
    </div>
    <div class="header">
      <div class="header-left"></div>
      <h2  class="header-title">游戏大厅</h2>
      <div class="header-right"></div>
    </div>
    <div class="tab">
      <tab :line-width="2" custom-bar-width="1rem" v-model="index" >
        <tab-item :selected="seltab === item" v-for="(item, index) in tablist" @on-item-click="tabclick" :key="index">{{item}}</tab-item>
      </tab>
    </div>

    <div class='content-swript'>
      <!--彩票大厅-->
      <div class="lottoryroom"   v-if="index==0">
        <div class="gamecontent" v-for="items in gamelist">
          <div class="top-title" @click='showShrink(items)'>
            <img :src=items.imgUrl>
            <span class="mygame">{{items.typeName}}</span>
            <span class="addplay"><img v-bind:src="items.showTypeList |showAndShrink"></span>
          </div>
          <div class="gameList" v-if="items.showTypeList">
            <ul>
              <li class="gameItem" v-for="item in items.gameRoomList" @click="goURL(item)">
                <img  :src=item.imgUrl>
                <span class="item-title" >{{item.gameRoomName}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div >
      <!--真人娱乐-->
      <div class="recreation" v-if="index==1">
         <!--<loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">-->
           <div class="boxbody" v-for="item in realGamelist">
             <div class="boximg">
               <img :src=item.imgUrl >
             </div>
             <div class="boxbottom">
               <span>{{item.gameName}}</span>
                 <!--<span class="btn" @click="startGame(item.linkUrl)">开始游戏</span>-->
                 <span class="btn nosel">敬请期待</span>
             </div>
           </div>
         <!--</loadmore>-->

      </div>
      <!--电子游戏-->
      <div class="computergame" v-if="index==2">
        <!--<loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">-->
          <div class="boxbody" v-for="item in videoGamelist">
            <div class="boximg">
              <img :src=item.imgUrl >
            </div>
            <div class="boxbottom">
              <span>{{item.gameName}}</span>
              <!--<span class="btn" @click="startGame(item.linkUrl)">开始游戏</span>-->
              <span class="btn nosel">敬请期待</span>
            </div>
          </div>
        <!--</loadmore>-->
      </div>

      <div class="loading">
        <loading :show="loading.show" :text="loading.text"></loading>
      </div>
    </div>
  </div>

</template>
<script>

  export  default {
    data(){
      return{
        index: 0,
        counter : 1, //当前页面
        seltab:'彩票大厅',
        tablist:['彩票大厅', '真人娱乐', '电子游戏'],
        loadingText:'加载中...',
        gamelist:{}, //游戏列表
        realGamelist:{},//真人游戏
        videoGamelist:{}, //电子游戏
        loading: {
          show: false,
          text: '加载中...'
        },
      }
    },
    created(){
      this.getgamelist();
      this.getRecreation();
      this.getVideoGame();
      this.stopBodyScroll(false);
    },
    methods:{
      //展开收缩
      showShrink(data){
        if(data.showTypeList){
          data.showTypeList  = false
        }else {
          data.showTypeList  = true
        }
      },
      tabclick(index){

      },
      onInfinite(done){
          let vm =this;
           if(vm.items>50){
             vm.loadingText='没有更多了';
           }else{
             //vm.tabclick();
             vm.items += 10;
           }
        done();
      },
      //获取官方游戏
      getgamelist(){
        let vm = this;
        vm.loading.show = true;
        vm.unitAjax('POST','/api/gameCenter/lottery',{},function (result) {
          if(result.result){
            //关闭加载
            vm.loading.show = false;
            let res =result.data.showTypeList;
            for(var i =0;i<res.length;i++){
              res[i].showTypeList = true;
            }
            vm.gamelist = res;
          }
        });
      },

      //获取真人娱乐
      getRecreation(){
        let vm = this;
        vm.loading.show = true;
        vm.unitAjax('POST','/api/gameCenter/realGame',{},function (result) {
          if(result.result){
            //关闭加载
            vm.loading.show = false;
            vm.realGamelist = result.data.gameList;
          }else{
            vm.loading.show = false;
          }
        });
      },
      //获取电子游戏
      getVideoGame(){
        let vm = this;
        vm.loading.show = true;
        vm.unitAjax('POST','/api/gameCenter/videoGame',{},function (result) {
          if(result.result){
            //关闭加载
            vm.loading.show = false;
            vm.videoGamelist = result.data.gameList;
          }else{
            vm.loading.show = false;
          }
        });
      },
      //开始游戏
      startGame(url){
        location.href = url;
      },
      goURL(data){
        this.$router.push({path: '/betting/'+data.gameRoomId+"/"+data.gameRoomName});
      }
    },
  }
</script>
<style lang="scss" scoped>
  .container{
    background: #fff;
  }
  .tab {
    width: 60%;
    margin: 0 auto;
    color: #9EA1B2;
  .vux-tab .vux-tab-item {
    font-size: .28rem;
    background: none;
  }
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #000;
    font-weight: 800;
   }
  }
  .boxbody{
    margin: 0.40rem 0.2rem 0.2rem;
    .boximg{
      overflow: hidden;
      height:4rem;
       img{
         width: 100%;
         height: 100%;
         border-radius: 0.05rem 0.05rem 0 0;
       }
    }
  .boxbottom{
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.15rem;
    margin-bottom: 0.3rem;
    border: 1px solid #f0f0f0;
    .btn{
      float: right;
      margin-top: 0.1rem;
      width: 1.52rem;
      height: 0.57rem;
      line-height:  0.57rem;
      text-align: center;
      display: block;
      border-radius: 5px;
      background: #77AAFD;
      color: #fff;
    }
    .nosel{
      background: #efefef;
      color: #757575;
    }
  }
  }
  .content-swript{
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    margin-bottom:1.3rem;
  }
  .gamecontent{
    overflow: auto;
    padding: 0.1rem 0.2rem 0.1rem;
    border-bottom: 1px solid #efefef;
  .top-title{
    height: 1rem;
    line-height: 1rem;
    font-weight: 800;
    img{
      float: left;
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.2rem;
      padding-top: 0.3rem;
      display: block;
    }
    .mygame{
      font-size: 0.28rem;
      color: #000;
    }
  .addplay{
    position: sticky;
    float: right;
    img{
      float: right;
      width: 0.16rem;
      height: 0.16rem;
      margin-right: 0rem;
      margin-left: 0.16rem;
      padding-top: 0.45rem;
    }
  }
  }
  .gameList{
    margin-top:0.25rem;
    .gameItem{
      float: left;
      width: 23.5%;
      margin: 0.1rem 0.05rem;
      text-align: center;
      img{
        width: 1.42rem;
        height: 1.42rem;
      }
      span{
        display: block;
        line-height: 0.35rem;
        margin-left: 0.1rem;
        white-space: nowrap;
      }
      .item-title{
        font-size: 0.26rem;
        margin-top: 0.2rem;
        text-align: center;
      }
      .item-msg{
        font-size: 0.2rem;
        color: #9EA1B2;
        text-align: left;
      }
    }
   }
  }
  .bottom-vav{
    position: absolute;
  }
</style>
