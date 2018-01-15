<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">公告中心</h2>
    </div>
       <div class="content">
          <ul>
             <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="noticelist.length>0">
            <li v-for="(item,index) in noticelist" :key="index">
               <router-link v-bind="{to:'noticedetail/'+item.id}" >
              <div class="list-item islink">
                <p class="notice-title">{{item.title}}</p>
                <p class="notice-time">{{item.createDate}}</p>
              </div>
                </router-link>
            </li>  
               </loadmore>           
          </ul>
       </div>
  </div>

</template>
<script>
import { getnoticelist } from '../../server/getData.js'
export default {
  data() {
    return {
      userId: "",
      token: "",
      noticelist: [],
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载中...',
    }
  },
  created() {
    this.getnotice()
  },
  methods: {
    getnotice() {
      let vm = this;
        let parmars = {
          pageIndex: vm.pageIndex,
          pageSize : vm.pageSize,
        }
      this.unitAjax('post', '/api/userCenter/notice/noticeList',parmars, res => {
        if (res.result) {
          this.noticelist = res.data.items;
          vm.pageIndex++;
          if (res.data.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        } else {
          if (result.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            setTimeout(function () {
              vm.goLogin();
            }, 1000);
          }
        }

      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getnotice();
      done();
    },
    //下拉刷新
    onInfinite(done) {
      let vm = this;
        let parmars = {
          pageIndex: vm.pageIndex,
          pageSize : vm.pageSize,
        }
      vm.unitAjax('POST', '/api/userCenter/notice/noticeList',parmars, function (result) {
        if (result.result) {
          let res = result.data.items;
          vm.noticelist = vm.noticelist.concat(res);
          if (res.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
            return false;
          } else {
            vm.pageIndex++;
          }
          done();
        } else {
          vm.showToast = true;
          vm.ToastText = result.msg;
          if (result.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            setTimeout(function () {
              vm.goLogin();
            }, 1000);
          }
        }
      });
    },
  }

}
</script>
<style scoped lang="scss">
.container {
  li{
    border-bottom: 1px solid #efefef;
  }
  .list-item {
    height: 1.5rem;
    padding: 0.2rem 0.33rem 0;
    position: relative;
    margin-top: 0.2rem;
    font-size: 0.26rem;
    .notice-time {
      font-size: 0.22rem;
      color: #9ea1b2;
    } 

    p {
      height: 0.65rem;
      line-height: 0.65rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
   .yo-scroll {
        top: 1.2rem;
      }
}
</style>
