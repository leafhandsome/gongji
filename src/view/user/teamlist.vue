<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="goout"></div>
      <h2 class="header-title" v-show="memberItem&&index>0">{{memberItem.userName}} <span v-show="memberItem.remarkName">({{memberItem.remarkName}})</span> 的团队</h2>
      <h2 class="header-title" v-show="!memberItem||index==0">团队管理</h2>
      <span class="close" v-show="index>=1" @click="$router.go(-1)">关闭</span>
    </div>

    <div class="search">
      <search
      v-model="searchName"
        placeholder="请输入账户、昵称搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        :autoFixed="false"
         @on-change='changeSearch'
        ref="search">
        </search>
    </div>
  <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="teamlist.length>0">
    <div class="teamlist">
       <ul>
         <li v-for="(item,indexed) in teamlist" :key='indexed' @click="gotonext(item.goUrl,item.id)">
            <div :class="index>=1?'list-item':'list-item islink'">
               <p>{{item.userName}} <span v-show="item.remarkName">&nbsp;({{item.remarkName}})&nbsp;</span> <label class="v-dl-label f18">{{item.userType==1?'代理':'会员'}}</label>
               <label class="xiaji" v-show="item.childCount!==0" @click.stop="getchild(item.id)">下级：{{item.childCount}}</label></p>
               <p>账户总额：{{item.safeMoney}} <span class="fandian">返点：<label class="v-fd-var f18">{{item.userRate}}%</label></span></p>
               <p>返奖：{{(item.reAward*100).toFixed(0)}}%  <label class="fanli">返利:{{(item.rebate*100).toFixed(0)}}%</label></p>
               <p class="endlogin">最后登录：{{item.lastLoginDate}}</p>
            </div>
         </li>
       </ul>
    </div>
      </loadmore>
    <div class="nocord" v-show="teamlist.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">当前没有记录</div>
      </div>
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      teamlist:[],
      searchName:'',
      pageIndex:1,
      pageSize:10,
      loadingText: '加载中...',
      childUserId:'',
      memberItem:'',
      parentId:'',
      index:0,
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created(){
          let filter = eval('(' + this.getStroe('teamlistFilter') + ')');
    if (filter) {
      this.parentUserId= filter.parentUserId;
    }
    this.getteam();
  },
  methods: {
    goout(){
      let params = eval('('+this.getStroe('childObj'+this.index)+')');
      if(params){
        if(params.goChild){
       this.childUserId = params.id;
       this.pageIndex=1;
       this.getteam();
          this.removeStore('childObj'+this.index);
          this.index--;
        }
      }else{
           this.removeStore('teamlistFilter');//删除记录
           this.$router.go(-1)
      }

    },
    gotonext(goUrl,id){
      if(goUrl==1){
        this.$router.push('teamconfig/'+goUrl+'/'+id)
      }else{
        return false;
      }

    },
   // 点击下级时
    getchild(id){
      this.index++;
      this.childUserId = id;
      let params = {
        id:this.parentId,
        goChild :true,
      }
       this.pageIndex=1;
      this.setStore('childObj'+this.index,params);
      this.getteam();

    },
      //搜索变化时
    changeSearch(){
      this.pageIndex=1;
      this.getteam();
    },
    getteam() {
      let vm = this;
          vm.loading.show = true;
      this.parentId = this.childUserId
      let teamobj={
        searchName:this.searchName,
        parentUserId:this.childUserId,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
      }
      this.unitAjax('post', '/api/agent/member/memberList', teamobj, res => {
        vm.loading.show = false;
        if (res.result) {
            this.pageIndex++;
          this.teamlist=res.data.pageInfo.items;
            if (this.teamlist.length < this.pageSize) {
              this.loadingText = '没有更多了……';
            }
          if(res.data.memberItem){
             this.memberItem=res.data.memberItem;
          }
        }else{
          if (res.operateCode == 100) {
          this.showToast = true;
          this.ToastText = '登录信息已过期，请重新登录';
              this.removeValue("token");
            this.removeValue("userId");
          setTimeout(() => {
            this.$router.push('/loginpage')
          }, 1000);
        }
        }

      })
    },
       //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getteam();
      done();
    },
    //下拉刷新
    onInfinite(done) {

      let vm = this;
      let parmars = {
         searchName:this.searchName,
        parentUserId:this.childUserId,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
      }
      vm.unitAjax('POST', '/api/agent/member/memberList', parmars, function (result) {
        if (result.result) {
          let res = result.data.pageInfo.items;
          vm.teamlist = vm.teamlist.concat(res);
          if (res.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
            return false;
          } else {
            vm.pageIndex++;
          }
          done();
        }
      });
    },
  }
}

</script>
<style lang="scss" scoped>
.container {
  .header {
    .close{
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      right:.32rem;
      color:black;
      font-weight: 700;
    }
  }
  .teamlist {
    ul li {
      background-color: #fff;
      padding: 0 0.33rem;
      margin-bottom: 0.2rem;
      height: 2.8rem;
      .list-item {
        position: relative;
        padding-top: 0.3rem;
        p {
          line-height: 0.6rem;
        }
      }
      .islink:after {
        right: 0.05rem;
        top: 50%;
      }
    }
  }
  .v-dl-label {
    margin-left: 0.16rem;
  }
  .xiaji {
    color: #4584f5;
    float: right;
  }
  .fandian {
    margin-left: 0.46rem;
  }
  .fanli {
    margin-left: 0.54rem;
  }
  .endlogin {
    color: #9ea1b2;
    font-size: 0.24rem;
  }
    .nocord {
    text-align: center;
    margin-top: 1.5rem;
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
