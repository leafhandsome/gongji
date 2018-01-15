<template>
  <div class="navbar" v-model="onReady">
     <div class="bg"></div>
      <ul class="bottom-nav">
        <li @click='onchange(0)' :class="index==0?'ativice':''">
           <img :src="index==0?homeiconsel:homeicon" >
           <p>首页</p>
        </li>
        <li @click='onchange(1)' :class="index==1?'ativice':''">
          <img :src="index==1?gamecentericonsel:gamecentericon" >
          <p>游戏大厅</p>

        </li>
        <li @click='onchange(2)' :class="index==2?'ativice':''">
          <img :src="index==2?usericonsel:usericon" >
          <p>个人中心</p>
        </li>
      </ul>
  </div>
</template>

<script>

  export default{
    data(){
      return{
        msg:'',
        index:'',
        homeicon:require('../../assets/images/icons/home.png'),
        homeiconsel:require('../../assets/images/icons/home1.png'),
        gamecentericon:require('../../assets/images/icons/gamecenter.png'),
        gamecentericonsel:require('../../assets/images/icons/gamecenter1.png'),
        usericon:require('../../assets/images/icons/user.png'),
        usericonsel:require('../../assets/images/icons/user1.png'),
      }
    },
    computed:{
      onReady(){
       var path = this.$route.path
        if(path =='/index'){
          this.index =0;
        }else if( path =='/gamelobby'){
          this.index =1;
        }else{
          this.index = 2;
        }
      }
    },
    methods:{
      onchange (index) {
        let path = "";
        if(index===0){
          path ='/index';
          this.index =0;
        }else if( index===1){
          path ='/gamelobby';
          this.index =1;
        }else{
          path ='/user';
          this.index = 2;
        }
        this.$router.replace({path: path})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .navbar{
    width: 100%;
    height: 0.98rem;
    position:fixed;
    background-color: #fff;
    bottom:0;
    z-index:9;
    /*box-shadow: 1px -4px 7px #EDEDED;*/
    border-top:1px solid #e5e5e5;
    ul li {
          width: 33.33%;
          float: left;
          text-align: center;
          height: 0.98rem;
          color: #C8C8C8;
          img{
            width: 0.48rem;
            height: 0.48rem;
            margin: 0.08rem;
          }
          p{
            height: 0.30rem;
            line-height: 0.28rem;
            font-size: 0.22rem;
            text-align: center;
          }
      }
  }
  .ativice{
    img {
      /*border-bottom: 0.05rem solid #4584F5;*/
      padding-bottom: 0.03rem;
    }
    p{
      color:#4584F5
    }
  }
</style>

