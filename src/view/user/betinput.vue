<template>
  <div class="container">
    <div class="top">
      <div class="header">
        <div class="header-left returnBtn" @click="$router.go(-1)"></div>
        <h2 class="header-title">{{playType}}</h2>
      </div>
      <div class="listTop">
        <ul>
          <li class="betintitle clearfix"><span>号码</span><span>赔率</span><span>注数</span><span>金额</span></li>
        </ul>
      </div>
    </div>

      <div class="betincontent" v-show="betinlist.length>0">
        <ul>
          <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText" >
          <li class="betin clearfix" v-for="item in betinlist" >
            <span>{{item.betNo}}</span>
            <span>{{item.betOdds}}</span>
            <span>{{item.betCount}}</span>
            <span>{{item.betMoney}}</span>
          </li>
          </loadmore>
        </ul>
      </div>
    <div class="nocord" v-show="noCard">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录</div>
    </div>
  </div>
</template>
<script>
  export default{
    data() {
      return{
        betinlist:[],
        playType :this.$route.params.playType,
        loadingText: '加载中...',
        pageIndex : 1,
        pageSize  : 18,
        noCard:false,
      }
    },
    created(){
      this.getbetin();
    },
    methods:{
      getbetin(){
        let vm = this;
        let parmars = {
          orderSn:vm.$route.params.order,
          pageIndex:vm.pageIndex,
          pageSize:vm.pageSize
        }

        vm.unitAjax('post','/api/agent/teamPlayLog/betOrderCodeList',parmars,result=>{
          if(result.result){
            let res = result.data.items;
            vm.pageIndex ++;
            vm.betinlist = res;
            if(res.length < vm.pageSize){
              vm.loadingText = '没有更多了...';
            }
            if(res.length==0){
              vm.noCard =true;
            }
          } else {
            if (result.operateCode == 100) {
              vm.removeValue("token");
              vm.removeValue("userId");
              vm.goLogin();
            }
          }
        })
      },
      //上拉刷新
      onRefresh(done) {
        let vm = this;
        vm.pageIndex = 1;
        vm.getbetin();
        done();
      },
      //下拉刷新
      onInfinite(done) {
        let vm = this;
        let parmars = {
          orderSn:vm.$route.params.order,
          pageIndex:vm.pageIndex,
          pageSize:vm.pageSize
        }
        vm.loadingText='正在加载...';
        vm.unitAjax('POST', '/api/agent/teamPlayLog/betOrderCodeList', parmars, function (result) {
          if (result.result) {
            let res = result.data.items;
            vm.betinlist = vm.betinlist.concat(res);
            if( result.data.items.length < vm.pageSize){
              vm.loadingText = '没有更多了...';
              return false;
            } else {
              vm.pageIndex++;
            }
            done();
          } else {
            if (result.operateCode == 100) {
              vm.removeValue("token");
              vm.removeValue("userId");
              vm.goLogin();
            }
          }
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .container{
    height: -webkit-fill-available;

  .top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
  .listTop{
    ul{
    .betintitle{
      width: 100%;
      height:0.6rem;
      line-height: 0.6rem;
      background-color: #EEE;
    span{
      box-sizing: border-box;
      float: left;
      width:25%;
      display: block;
      text-align: center;
      height: .6rem;
      line-height: .6rem;
      border-right: 1px solid #ccc;
    }
    }
    }
  }
  }
  .yo-scroll{
    top: 1.6rem;
    background:#eee;
  }
  .betincontent{
    height: -webkit-fill-available;
  .betin{
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    margin-top: 0.1rem;
    background-color: white;
  span{
    box-sizing: border-box;
    float: left;
    width:25%;
    text-align: center;
    height: .6rem;
    line-height: .6rem;
    border-right: 1px solid #ccc;
  }
  }
  }
  /*//无数据图片*/
  .nocord {
    margin-top: 3.5rem;
    text-align: center;
  img {
    width: 50%;
  }
  .record {
    margin-top: 0.3rem;
    height: 0.6rem;
    line-height: 0.6rem;
  }
  }
  }
</style>


