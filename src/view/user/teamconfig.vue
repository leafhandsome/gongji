<template>
  <div class="container" >
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">队员配置</h2>
    </div>

    <div class="center" v-if="maxUserRate">
      <div class="teaminfo">
        <p>账号：{{configobj.userName}} <label class="fandian">返点：{{configobj.userRate}}%</label><label class="balance">余额：{{configobj.safeMoney}}</label></p>
        <p v-show="configobj.userType=='1'">团队总额：{{configobj.teamSafeMoney}} &nbsp;<label class="tdrs">团队人数：{{configobj.childCount}}</label></p>
      </div>

      <div class="center-range">
        <div class="nickname">
            <span >昵称</span>
            <input type="text" placeholder="请输入昵称" v-model="remarkName"  @blur="getremarkName">
        </div>

        <div class="range">
          <p>水位调节</p>
          <span class="min">{{waterValue}}</span>
          <range v-model="rangeValue" :min="minUserRate" :max='maxUserRate' :step="1"></range>
          <span class="max">{{configobj.maxUserRate}}</span>
        </div>
        <div class="range range-fandian">
          <p>返点调节</p>
          <span class="min">{{fanmin}}</span>
          <range v-model="rangeValue1" :min="0" :max='100' :step="1"></range>
          <span class="max">{{fanmax}}</span>
        </div>
        <div class="range-tip">
          <span class="min">返利</span>
          <span class="max">返奖</span>
        </div>

      </div>
    </div>
     <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
        </div>
    <div class="submitBtn submitBtn-ativice">
      <p @click="setconfig">确定</p>
    </div>
  </div>
</template>


<script>
import store from '../../store/index';
export default {
  data() {
    return {
      rangeValue: 1,
      rangeValue1: 15,
      configobj: {},
      id: this.$route.params.setid,
      remarkName: '',
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      maxUserRate: 0,
      minUserRate:0
    }
  },
  computed: {
    waterValue() {
      if (this.rangeValue == 0) {
        return 0;
      }
      return this.rangeValue / 10;
    },
    fanmin() {
      return this.rangeValue1 + "%";
    },
    fanmax() {
      return (100 - this.rangeValue1) + "%";
    }
  },
  created() {
    this.getteamconfig();
  },

  methods: {
    getremarkName(){
      if(!(/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/.test(this.remarkName))){
         this.showToast = true;
          this.ToastText ='请输入昵称0-5位';
      }
      
    },
    //修改队员配置
    setconfig() {
      if(this.remarkName==null){
        this.remarkName=''
      }
      let configobj = {
        id: this.id,
        remarkName: this.remarkName,
        userRate: this.waterValue,
        rebate: this.rangeValue1,
      }
      if(/^[\u4e00-\u9fa5a-zA-Z0-9_]{0,5}$/.test(this.remarkName)){
      this.unitAjax('post', '/api/agent/member/modifyMember', configobj, res => {
        if (res.result) {
          this.showToast = true;
          this.ToastText = '修改成功';
        } else {
          this.showToast = true;
          this.ToastText = res.msg;
        }
      })
      }else{
        this.showToast = true;
          this.ToastText ='请输入昵称0-5位';
      }
    },
    getteamconfig() {
      this.unitAjax('post', '/api/agent/member/memberDetail', { id: this.$route.params.setid }, res => {
        if (res.result) {
          this.configobj = res.data;
          this.remarkName = res.data.remarkName;
          this.maxUserRate = res.data.maxUserRate * 10;
          this.minUserRate = res.data.minUserRate * 10;
          this.rangeValue = res.data.userRate * 10;
          this.rangeValue1=res.data.rebate*100;
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.container {
  .header {
  }
  .center {
    .teaminfo {
      background-color: #fff;
      height: 1.05rem;
      padding-top: 0.1rem;
      text-align: center;
      color: #9ea1b2;
      p {
        line-height: 0.48rem;
      }
    }
    .center-range {
      margin-top: 0.2rem;
      padding: 0 0 0 0.33rem;
      height: 5.25rem;
      background-color: #fff;
      .nickname {
        height: 1.2rem;
        line-height: 1.2rem;
        span {
          width: 10%;
        }
        input {
          height: 0.6rem;
          margin-top: 0.24rem;
          border: 0;
          margin-left: 0.43rem;
          width: 81.299%;
          border-bottom: 0.01rem solid #e5e5e5;
        }
      }
      .range {
        padding: 0 0.33rem 0 0;
        position: relative;
        height: 1.2rem;
        p {
          line-height: 0.5rem;
        }
        .min {
          float: left;
          display: block;
          width: 1rem;
          text-align: center;
        }
        .max {
          display: block;
          width: 0.5rem;
          position: absolute;
          right: 0.33rem;
          top: 35%;
          text-align: center;
        }
      }
    }
  }
  .fandian {
    margin-left: 0.46rem;
  }
  .balance {
    margin-left: 0.46rem;
  }
  .range-tip {
    position: relative;
    .min {
      float: left;
      display: block;
      width: 1rem;
      text-align: center;
    }
    .max {
      display: block;
      width: 1rem;
      position: absolute;
      right: 0.1rem;
      top: 27%;
      text-align: center;
    }
  }
  .range-fandian {
    margin-top: 0.79rem;
  }
}
</style>
