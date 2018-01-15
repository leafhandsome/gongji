<template>
  <div class="container">
    <div class="top">
    <div class="header">
      <div class="header-left returnBtn" @click="reocrdout"></div>
      <h2 class="header-title">提现记录</h2>
    </div>

    <div class="datefilt">
       <ul>
         <li  @click="showdate" v-text="startDate">2017-10-28</li>
         <li  @click="showdate2" v-text="endDate">2017-10-28</li>
         <li @click="showpicker" v-text="gameTypeName">全部</li>
       </ul>
       <div style="display: none">
       <datetime v-model="value" :show.sync="visibility" @on-change='onchange' :start-date="startMonthDate" :end-date="endDate"></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change='onchange2' :start-date="startMonthDate" :end-date="endMonthDate"></datetime>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>
    </div>
     <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText"  v-show="drawlist.length>0">
    <div class="withdrawlist" v-show="drawlist.length>0">
      <ul>
        <li  v-for="(item,index) in drawlist" :key="index"
         @click="goshowDetail(item)">
          <div class="list-item">
            <span class="time" v-text="item.createDate">
            </span>
            <span class='withdrawtype' v-text="item.cashFlagName">
              <!-- <img src="../../assets/images/icons/icon-zfb.png"> -->
              </span>
            <span v-text="item.cashMoney"></span>
            <span class="state successColor" v-text="item.cashStatus"></span>
          </div>
        </li>
      </ul>
    </div>
      </loadmore>
    <div class="nocord" v-show="drawlist.length==0 &&!loading.show">
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
const visibility1 = false;
const visibility2 = false;
export default {
  data() {
    return {
      value: '',
      value2: '',
      value1: ['全部'],
      list: [['122', '5555']],
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      drawlist: [],
      endDate: this.datefmt(Date(), 'YYYY-MM-DD'),
      startDate: this.datefmt(Date(), 'YYYY-MM-DD'),
      gameTypeName: '全部',
      pageIndex: 1,
      pageSize: 10,
      loadingText: '加载中...',
      cashStatusid: '',
      statusobj: {},
      startMonthDate:this.getMonthFormatDate(),
      endMonthDate:this.getNowFormatDate(),
      loading: {
        show: false,
        text: '加载中...'
      },
    }
  },
  created() {
     let vm = this;
     let filter = eval('(' + vm.getStroe('withdrawFilter') + ')');
    if (filter) {
      vm.startDate = filter.startDate;
      vm.endDate = filter.endDate;
      vm.cashStatusid = filter.cashStatusid;
      vm.gameTypeName= filter.gameTypeName;
    } else {
      vm.startDate = vm.getNowFormatDate();
      vm.endDate = vm.getNowFormatDate();
    }
    this.getdraw();
    this.getrecordlist();
     this.removeStore('withdrawFilter');//删除记录
  },
  methods: {
      reocrdout(){
      this.removeStore('withdrawFilter');//删除记录
      this.$router.go(-1)
    },
    getrecordlist() {
      let vm = this;
          vm.loading.show = true;
      this.unitAjax('post', '/api/userCenter/cash/cashStateList', {}, res => {
        vm.loading.show = false;
        let arr = ['全部'];
        if (res.result) {
          this.list = res.data;
          this.statusobj = res.data;
          //取出来重新加入数组
          for (var i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].name)
          }
          this.list = [arr]
        }
      });
    },
    getdraw() {
      let vm = this;
      let parmars = {
        pageIndex: vm.pageIndex,
        pageSize: vm.pageSize,
        startDate: vm.startDate,
        endDate: vm.endDate,
        cashState: vm.cashStatusid,
      }
      this.unitAjax('post', '/api/userCenter/cash/cashLog', parmars, res => {
        if (res.result) {
          vm.pageIndex++;
          this.drawlist = res.data.items;
           if ( res.data.items.length < vm.pageSize) {
              vm.loadingText = '没有更多了……';
            }
        } else {
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.$router.push({ path: '/loginpage' })
          }
        }

      })
    },
        //上拉刷新
    onRefresh(done) {
      let vm = this;
      vm.pageIndex = 1;
      vm.getdraw();
      done();
    },
    //下拉刷新
    onInfinite(done) {

      let vm = this;
      let parmars = {
          pageIndex: vm.pageIndex,
        pageSize: vm.pageSize,
        startDate: vm.startDate,
        endDate: vm.endDate,
         cashState: vm.cashStatusid,
      }
      vm.unitAjax('POST', '/api/userCenter/cash/cashLog', parmars, function (result) {
        if (result.result) {
          let res = result.data.items;
          vm.drawlist = vm.drawlist.concat(res);
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
    onchange(vul) {
       let vm = this;
        let filter = {
          startDate : vul,
          endDate   :vm.endDate,
          cashStatusid  : vm.cashStatusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('withdrawFilter',filter);
        location.reload()
    },
    onchange2(vul2) {
    let vm = this;
        let filter = {
          startDate : vm.startDate,
          endDate   : vul2,
          cashStatusid  : vm.cashStatusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('withdrawFilter',filter);
        location.reload()
    },
    onchange1(vul1) {
      let vm = this;
      vm.gameTypeName = vul1[0];
      for (var key in vm.statusobj) {
        if (vm.gameTypeName == vm.statusobj[key].name) {
          vm.cashStatusid =vm.statusobj[key].value;
        }
      }
       if (vm.gameTypeName == '全部') {
          vm.cashStatusid = '';
        }
        let filter = {
          startDate : vm.startDate,
          endDate   : vm.endDate,
          cashStatusid : vm.cashStatusid,
          gameTypeName: vm.gameTypeName
        }
        vm.setStore('withdrawFilter',filter);
        location.reload()
    },
    goshowDetail(data){
      let vm = this;
      let filter = {
        startDate :   vm.startDate,
        endDate   :   vm.endDate,
        cashStatusid: vm.cashStatusid,
        gameTypeName: vm.gameTypeName
      }
       vm.setStore('withdrawFilter',filter);
        vm.$router.push('paymoney/'+data.cashAccount+'/'+data.cashFlagName+'/'+data.cashMoney+'/'+data.cashStatus+'/'+data.createDate+'/'+data.remark+'/'+data.userId+'/'+data.id)
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
    .yo-scroll{
      top: 2.1rem;
        background-color: #F7F7F7;
    }
  .withdrawlist {
    font-size: 0.26rem;
    ul li {
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0.27rem 0.33rem;
      margin-top: 0.2rem;
      background-color: #fff;
      .time {
        font-size: 0.24rem;
      }
      .withdrawtype {
        padding: 0 0.32rem;
        img {
          margin-top: 0.1rem;
          width: 0.6rem;
          height: 0.6rem;
        }
      }
      .state {
        float: right;
      }
    }
    .successColor {
      color: #33d54e;
    }
    .reviewColor {
      color: #ebaf1f;
    }
    .feateColor {
      color: #ec4040;
    }
  }
  ul li:last-child {
    margin-bottom: 0.2rem;
  }
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
