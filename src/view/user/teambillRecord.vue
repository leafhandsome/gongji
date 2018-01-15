<template>
  <div class="container">
      <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">团队账变记录</h2>
    </div>

    <div class="search">
      <search
        placeholder="请输入账户、昵称搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        :autoFixed="false"
        v-model="userName"
        ref="search" @on-change='changeSearch'></search>
    </div>

    <div class="datefilt">
       <ul>
         <li @click="showdate" v-text="startDate">2017-10-28</li>
         <li @click="showdate2" v-text="endDate">2017-10-28</li>
         <li @click="showpicker" v-text="changeTypeName">全部</li>
       </ul>
     <div style="display: none">
       <datetime v-model="startDate" :show.sync="visibility"  @on-change="getStarDate" :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="endDate" :show.sync="visibility2"  @on-change="getEndDate" :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1" @on-change="getchangeType"></popup-picker>
     </div>
    </div>
      </div>
       <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="teamlist.length>0">
    <div class="paylist" v-show="teamlist.length>0">
      <ul>
        <li v-for="(item,index) in teamlist" :key="index"
         @click="$router.push('teambilldetail/'+item.afterSafeMoney+'/'+item.beforeSafeMoney+'/'+item.changeSafeMoney+'/'+item.changeType+'/'+item.createDate+'/'+item.remark+'/'+item.userName+'/'+item.userTypeStr)">
          <div class="list-item">
             <div class="dates">
              <span class="time">{{item.createDate |filterDate}}</span>
              <span class="time">{{item.createDate |filterTime}}</span>
            </div>
              <!-- <span class='paytype'>

                 </span> -->
            <div class="touzhu">
              <span class="var">{{item.userName}}&nbsp;<span class="nickName" v-show="item.nickName">({{item.nickName}})</span>&nbsp;<span class="userTypeStr">{{item.userTypeStr}}</span></span>
              <span class="txt" v-text="item.remark"></span>
            </div>
            <div class="touzhu state">
              <span v-text="item.changeSafeMoney"></span>
            <span class="successColor" v-text="item.changeType"></span>
            </div>
          </div>
        </li>

      </ul>
    </div>
      </loadmore>
     <div class="nocord" v-show="teamlist.length==0 &&!loading.show">
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
      </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
  </div>
</template>


<script>
const visibility = false;
const visibility1 = false
const visibility2 = false
export default {
  data() {
    return {
      value1: [''],
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      list: [['全部', 'B', 'C']],
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载更多',
      userName: '',
      startDate: '',
      endDate: '',
      changeTypeName: '全部',
      teamlist: [],
      changeTypeList: [],
      changeType: '',
      startMonthDate: this.getMonthFormatDate(),
      endMonthDate: this.getNowFormatDate(),
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
    let vm = this;
    let filter = eval('(' + vm.getStroe('teambilFilter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
      vm.changeType = filter.changeType;
      vm.changeTypeName = filter.changeTypeName
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }
    this.getteambill();
    this.getRecordlist();
    this.removeStore('teambilFilter');//删除记录
  },
  methods: {
    reocrdout() {
      this.removeStore('teambilFilter');//删除记录
      this.$router.go(-1)
    },
    //搜索变化时
    changeSearch() {
      this.pageIndex = 1;
      this.getteambill();

    },
    getteambill() {
      let vm = this;
      let obj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        changeType: this.changeType,//账变类型
        userName: this.userName//搜索名
      }
      vm.loading.show = true;
      this.unitAjax('post', '/api/agent/accountLog/list', obj, res => {
        vm.loading.show = false;
        if (res.result) {
          vm.pageIndex++;
          this.teamlist = res.data.items;
          if (res.data.items.length < vm.pageSize) {
            vm.loadingText = '没有更多了……';
          }
        }
      })
    },
    //获取账变类型
    getRecordlist() {
      let vm = this;
      this.unitAjax('post', '/api/agent/accountLog/changeTypeMap', {}, res => {

        let arr = ['全部']
        if (res.result) {
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].name)
          }
          this.list = [arr]
          this.changeTypeList.push(res.data)
        } else {
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.$router.push({ path: '/loginpage' });
          }
        }
      })
    },
    //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getteambill();
      done();
    },
    //下拉刷新
    onInfinite(done) {
      let vm = this;
      let parmars = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        changeType: this.changeType,//账变类型
        userName: this.userName//搜索名
      }
      vm.unitAjax('POST', '/api/agent/accountLog/list', parmars, function (result) {
        if (result.result) {
          let res = result.data.items;
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
    showdate() {
      this.visibility = true;
    },
    showdate2() {
      this.visibility2 = true;
    },
    showpicker() {
      this.visibility1 = true;
    },
    getStarDate(vul) {
      let vm = this;
      let filter = {
        startDate: vul,
        endDate: vm.endDate,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teambilFilter', filter);
      location.reload()
    },
    getEndDate(vul) {
      let vm = this;
      let filter = {
        startDate: vm.startDate,
        endDate: vul,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teambilFilter', filter);
      location.reload()
    },
    getchangeType(vul) {
      let vm = this;
      vm.changeTypeName = vul[0];
      let changelist = vm.changeTypeList[0];

      for (var key in changelist) {
        if (changelist[key].name == vm.changeTypeName) {
          vm.changeType = changelist[key].id;
        }
      }
      if (vm.changeTypeName == '全部') {
        vm.changeType = '';
      }
      let filter = {
        startDate: vm.startDate,
        endDate: vm.endDate,
        changeType: vm.changeType,
        changeTypeName: vm.changeTypeName
      }
      vm.setStore('teambilFilter', filter);
      location.reload()
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  height: -webkit-fill-available;
  .top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 2;
  }
  .datefilt {
    height: 1rem;
    background-color: #fff;
    ul li {
      width: 33%;
      float: left;
      height: 0.6rem;
      text-align: center;
      line-height: 0.6rem;
      margin: 0.2rem 0;
      border-right: 0.02rem solid #e5e5e5;
      font-size: 0.24rem;
    }
    li:last-child {
      border-right: none;
    }
  }
  .yo-scroll {
    top: 3.1rem;
    background-color: #f7f7f7;
  }
  .paylist {
    font-size: 0.26rem;
    ul li {
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0.27rem 0.33rem;
      margin-top: 0.2rem;
      background-color: #fff;
      .dates {
        width: 1.5rem;
        float: left;
        .time {
          font-size: 0.24rem;
          display: block;
          line-height: 0.4rem;
        }
      }
      .paytype {
        padding: 0 0.32rem;
        float: left;
        width: 0.6rem;
        height: 0.6rem;
        img {
          margin-top: 0.1rem;
          width: 0.6rem;
          height: 0.6rem;
        }
      }
      .touzhu {
        float: left;
        width: 45%;
        .txt {
          font-size: 0.2rem;
        }
        .nickName{
            display: inline;
        }
        .userTypeStr{
          background-color: #4584F5;
          display: inline;
          color:white;
              padding: .03rem;
        }
        span {
          display: block;
          line-height: 0.4rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
        }
      }
      .state {
        width: 28%;
        float: right;
      }
    }
  }
  ul li:last-child {
    margin-bottom: 0.2rem;
  }
  //无数据图片
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
