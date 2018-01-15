<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">代理1报表明细</h2>
    </div>

     <div class="datefilt border-b1">
       <ul>
         <li @click="showdate"  v-text="startDate">2017-10-28</li>
         <li @click="showdate2"  v-text="endDate">2017-10-28</li>
         <li @click="showpicker"  v-text="changeTypeName">全部</li>
       </ul>
     <div style="display: none">
        <datetime v-model="value" :show.sync="visibility" @on-change='getStarDate'></datetime>
       <datetime v-model="value2" :show.sync="visibility2" @on-change='getEndDate'></datetime>
       <popup-picker title="请选择" :data="list" v-model="value1" value-text-align="left" :show.sync="visibility1"  @on-change='onchange1'></popup-picker>
     </div>
    </div>

    <div class="gamelist">
      <ul>
        <li>
          <div class="list-item">
            <div class="item-l">
              <p>七星彩（2017125期） 一字定</p>
              <p>投注金额：<label class="jine">6666</label>元  <label class="win">中奖金额：0.00元</label></p>
              <p>返利金额：<label class="jine">6666</label>元  <label class="win">返奖金额：0.00元</label></p>
            </div>
            <p class="state reviewColor">未开奖</p>
          </div>
        </li>
        <li>
          <div class="list-item">
            <div class="item-l">
              <p>七星彩（2017125期） 一字定</p>
              <p>投注金额：<label class="jine">6666</label>元  <label class="win">中奖金额：0.00元</label></p>
              <p>返利金额：<label class="jine">6666</label>元  <label class="win">返奖金额：0.00元</label></p>
            </div>
            <p class="state reviewColor">未开奖</p>
          </div>
        </li>
        <li>
          <div class="list-item">
            <div class="item-l">
              <p>七星彩（2017125期） 一字定</p>
              <p>投注金额：<label class="jine">6666</label>元  <label class="win">中奖金额：0.00元</label></p>
              <p>返利金额：<label class="jine">6666</label>元  <label class="win">返奖金额：0.00元</label></p>
            </div>
            <p class="state successColor">中奖</p>
          </div>
        </li>
      </ul>
    </div>
     <div class="nocord" >
      <img src="../../assets/images/weixin/icon-nomore.png" alt="">
      <div class="record">暂无记录，请选择日期</div>
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
      visibility: visibility,
      visibility1: visibility1,
      visibility2: visibility2,
      list: [['全部', '重庆时时彩', '北京塞车']],
        startDate: this.getNowFormatDate(),
      endDate: this.getNowFormatDate(),
      changeTypeName:'全部',
        pageIndex: 1,
        pageSize: 10,
    }
  },
  created(){
    this.getteamdetail();
  },
  methods: {
    getteamdetail(){
        let obj = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startDate: this.startDate,
        endDate: this.endDate,
        }
      this.unitAjax('post','/api/agent/teamReport/list',obj,res=>{
        if(res.result){

        }else{
           if(res.operateCode==100){
              vm.removeValue("token");
              vm.removeValue("userId");
              vm.$router.push({path:'/loginpage'});
            }
        }
      })
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
      this.startDate = vul;
      this.getteamdetail()
    },
    getEndDate(vul) {
      this.endDate = vul;
      this.getteamdetail()
    },
    onchange1(vul) {
        let vm = this;
        vm.changeTypeName=vul[0];
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
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
  .gamelist {
    font-size: 0.26rem;
    ul li {
      height: 1.6rem;
      line-height: 1.6rem;
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
      .item-l {
        width: 80%;
        float: left;
        p {
          height: 0.6rem;
          line-height: 0.6rem;
        }
        .win {
          margin-left: 0.5rem;
        }
        .jine {
          color: #4584f5;
        }
      }
    }
    ul li:last-child {
      margin-bottom: 0.2rem;
    }
  }
  //无数据图片
  .nocord {
    margin-top: 1.5rem;
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
