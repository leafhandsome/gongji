<template>
  <div class="main">
    <div class="bottom-vav ">
      <navBar ></navBar>
    </div>
    <div class="header">
      <div class="header-left"><img src=../../assets/images/icons/icon-kefu.png></div>
      <h2 class="header-title">大公鸡</h2>
      <!--<div class="header-right" v-if="showLoginBtn" @click="showShare(true)"><img src=../../assets/images/share.png class="shareimg"></div>-->
      <div class="header-right" v-if="!showLoginBtn"  @click="login" ><span>登录</span></div>
    </div>
    <div class="header-banner">
      <swiper auto style="width:95%;margin:0 auto 0.2rem;" dots-position="center" height="3.38rem" >
        <swiper-item class="black" v-for="(lists,index) in focusAdList" :key="index">
         <a :href="lists.linkUrl"><img :src=lists.imgUrl /></a>
        </swiper-item>
      </swiper>
    </div>
    <div class="content">
      <scroller lock-y :scrollbar-x=false>
        <div class="scrollerlist">
          <div class="scroller-item" v-for="(list,index) in middleAdList" :key="index">
            <img :src=list.imgUrl  @click='scrollerBar(list.linkUrl)'>
          </div>
        </div>
      </scroller>
      <div class="gamecontent">
        <div class="top-title">
          <img  src="../../assets/images/icons/game-icon.png">
          <span class="mygame">我的游戏</span>
          <span class="addplay islink" @click="addgames()">添加游戏</span>
        </div>
        <div class="gameList">
          <ul>
            <li class="gameItem" @click="goURL(items)" v-for="(items,index) in gamelist" :key="index">
              <img :src=items.imgUrl>
              <span  class="item-title">{{items.gameRoomName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="sharemain">
      <popup v-model="isshowshare" height="4.1rem">
        <div style="background-color:#fff;margin:0 auto;border-radius:5px;padding-top:0.26rem;">
          <div class="share-title">
            <span>分享至</span>
          </div>
          <div class="shareType">
            <ul>
              <!--<li>-->
                <!--<img src='../../assets/images/icons/qqzoom.png'>-->
                <!--<span>QQ空间</span>-->
              <!--</li>-->
              <!--<li>-->
                <!--<img src='../../assets/images/icons/qqfriend.png'>-->
                <!--<span>QQ好友</span>-->
              <!--</li>-->
              <!--<li>-->
                <!--<img src='../../assets/images/icons/sina.png'>-->
                <!--<span>新浪微博</span>-->
              <!--</li>-->
              <li>
                <img src='../../assets/images/icons/friends.png'>
                <span>朋友圈</span>
              </li>
              <li>
                <img src='../../assets/images/icons/wacthfriend.png'>
                <span>微信好友</span>
              </li>
              <li>
                <img src='../../assets/images/icons/copy.png'>
                <span>复制链接</span>
              </li>
            </ul>
          </div>
          <div class="share-cansole" @click='showShare(false)'>
            <span>取消</span>
          </div>
        </div>
      </popup>
    </div>
  </div>

</template>
<script>

  export default {
    data () {
      return {
        isshowshare:false,
        resultData:{},
        gamelist:{},
        focusAdList:{},
        middleAdList:{},
        showLoginBtn:true,
        loading: {
          show: true,
          text: '加载中...'
        },
      }
    },
    created(){
      let vm = this;
      vm.getGame();
      let token  = vm.getValue("token");
      let userId = vm.getValue("userId");
      if(!token && !userId){
        vm.showLoginBtn = false;
      }
    },

    methods: {
      showShare(flg){
        this.isshowshare = flg;
      },
      //获取游戏列表
      getGame(){
        let vm  = this;
        vm.stopBodyScroll(false);

       vm.unitAjax('POST','/api/home/index',{},function (result) {
         if(result && result.result){
           vm.loading.show = false;
           vm.gamelist = result.data.gameRoomItemList;
           vm.focusAdList= result.data.focusAdList
           vm.middleAdList = result.data.middleAdList

           //获取广告位的个数,设置广告位长度
           let middlen = vm.middleAdList.length;
           vm.$el.querySelector('.scrollerlist').style.width = (middlen * 2.3+0.3) +"rem"
         }else{
           vm.loading.show = false;
         }
       })
      },
      goURL(data){
        this.$router.push({path: '/betting/' + data.gameRoomId+"/" + data.gameRoomName});
      },

      addgames(){
        let vm = this;
        let token  = vm.getValue("token");
        let userId = vm.getValue("userId");

        if(token && userId){
          vm.$router.push({path:'/addgame'})
        }else{
          vm.goLogin();
        }
      },
      login(){
        this.goLogin();
      },
      //广告位跳转
      scrollerBar(url){
       let vm = this;
       if(!url){
         return false;
       }
       let data = vm.urlparams(url);
       if(data.gameRoomName && data.gameRoomId){
         this.$router.push({path: '/betting/' + data.gameRoomId+"/" + data.gameRoomName});
       }else {
         window.location.href = url
        }
      },
    }
  }
</script>

<!--样式-->
<style lang="scss" scoped>
  .main{
    background:#fff;
    overflow: scroll;
  }
  .header{
    .header-left {
      img {
        position: relative;
        padding-top: 0.4rem;
      }
    }
  }
  .header-right{
    top:0;
    right:0;
    width: 1.082rem;
    height: 1.082rem;
    line-height: 1.082rem;
    .shareimg{
      padding-top: 0.4rem;
      padding-right: 0.35rem;
      float: right;
    }
    span{
      text-align: center;
      color: #4584F5;
    }
  }
  .header-banner{
    img{
      width: 100%;
    }
  }
  .scrollerlist {
    position: relative;
    height: 1.36rem;
    width: 14.2rem;
    margin: 0 0.2rem;
    font-size: 0.26rem;
  }
  .scroller-item {
    float: left;
    width: 2.12rem;
    height: 1.36rem;
    line-height: 1.36rem;
    display:inline-block;
    background-color: #ccc;
    margin-left: 0.2rem;
    text-align: center;
    border-radius: 0.12rem;
    img{
      width: 100%
    }
  }
  .scroller-item:first-child {
    margin-left: 0;
  }
  .gamecontent{
    margin: 0.4rem 0.2rem 0.38rem;
  .top-title{
    height: 0.6rem;
    line-height: 0.6rem;
    font-weight: 800;
    img{
      float: left;
      width: 0.46rem;
      height: 0.46rem;
      display: block;
      margin-right: 0.2rem;
      padding-top: 0.10rem;
    }
    .islink:after{
      right: 0.05rem;
      top:32%;
    }
  .mygame{
    font-size: 0.28rem;
    color: #000;
  }
  .addplay{
    position: relative;
    float: right;
    padding-right: 0.25rem;
    color: #9EA1B2;
    font-size: 0.26rem;
  }
  }
  .gameList{
    overflow: hidden;
    margin-top:0.25rem;
    padding-bottom: 0.5rem;
    .gameItem{
      float: left;
      padding-bottom: 0.3rem;
      width: 25%;
      text-align:center;
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
        text-align:center;
      }
      .item-msg{
        font-size: 0.2rem;
        color: #9EA1B2;
        text-align: left;
      }
  }
  }
  }
  /*分享*/
  .share-title{
    text-align: center;
    font-size: 0.34rem;
  }
  .sharemain{
    color: #2b304b;
    z-index:1000;
  .shareType{
    margin-top:0.4rem;
    ul li{
      float: left;
      width: 25%;
      text-align: center;
      img{
        width: 0.94rem;
        height: 0.94rem;
      }
      span{
        display: block;
        line-height: 0.8rem;
        font-size: 0.24rem;
      }
    }
  }
  .share-cansole{
    clear: both;
    display: block;
    text-align: center;
    height: 1.1rem;
    line-height: 1.1rem;
    border-top: 1px solid #e5e5e5;
  }
  }
</style>

