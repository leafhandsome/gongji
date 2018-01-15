<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title" v-text="toname">xx聊天</h2>
      </div>
     <ul class="listman clearfix" ref="reference" id="list">

         <li v-show="item.message" v-for="(item,index) in messagelist" :key="index" :class="item.sendUserId==talkUserId?'li-to':'li-me'">
             <span class="span"></span>
                <p class="toutal clearfix"><span  class="toutal-time">{{item.sendDate}}</span></p>
            <p class="clearfix li"><span :class="item.sendUserId==talkUserId?'active-user':'active-me'"> {{item.message}}</span></p>

        </li>
     </ul>
     <div class="buttom" ref="myinput">
         <input type="text" v-model="textconten" @focus="msginput" @blur="blinput"  @click="getfocus">
         <span @click="sendmsg">发送</span>
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
import $ from "jquery";
export default {
  data() {
    return {
      toname: this.$route.params.talkUserName,
      talkUserId: this.$route.params.talkUserId,
      textconten: '',
      messagelist: [],
      pageIndex: 1,
      pageSize: 10,
      showToast: false,
      ToastText: '',
      ToastPosition: '',
      loading: {
        show: false,
        text: '发送中...'
      },
    flag:true
    }
  },

  created() {
    this.getmessage();
    $('html,body').animate({
      scrollTop: 10000
    }, 500);
  },

  computed: {
  },
  mounted() {
    window.addEventListener('scroll', this.scorllcrrent);
    // this.$refs.reference.addEventListener('touch')
  },
  methods: {

    getfocus() {
      var target = this.$refs.reference;
      // 使用定时器是为了让输入框上滑时更加自然
      target.animate({
        scrollTop: 100000
      }, 500);
    },
    blinput() {
      this.$refs.myinput.style.position = 'fixed';
    },
    msginput() {
      this.$refs.myinput.style.position = 'absolute';

    },
    menu() {
      window.scrollTo(0, 1314);
    },
    getmessage() {
      this.loading.text='加载中';
       this.loading.show = true;
      let vm = this;
      let parms = {
        talkUserId: this.talkUserId,
        talkUserName: this.talkUserName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.unitAjax('post', '/api/userCenter/message/talkDetail', parms, res => {
        if (res.result) {
           this.loading.show = false;
          this.messagelist = res.data.items.reverse();
          //  this.pageSize++;
        } else {
           this.loading.show = false;
          if (res.operateCode == 100) {
            vm.removeValue("token");
            vm.removeValue("userId");
            vm.$router.push({ path: '/loginpage' });
          }
        }

      })
    },
    //     scorllcrrent() {
    //   let scroll = document.documentElement.scrollTop;
     
    //   if (scroll == 0&&this.flag) {
    //     this.pageIndex++;
    //     console.log(this.pageIndex)
    //     let vm = this;
    //     let parms = {
    //       talkUserId: this.talkUserId,
    //       talkUserName: this.talkUserName,
    //       pageIndex: this.pageIndex,
    //       pageSize: this.pageSize
    //     }
    //     this.unitAjax('post', '/api/userCenter/message/talkDetail', parms, res => {
    //       if (res.result) {
    //         vm.messagelist = (vm.messagelist.reverse().concat(res.data.items)).reverse();
    //          this.flag=(res.data.items.length>vm.pageSize)
    //          console.log(res.data.items.length)
    //       } else {
    //         if (res.operateCode == 100) {
    //           vm.removeValue("token");
    //           vm.removeValue("userId");
    //           vm.$router.push({ path: '/loginpage' });
    //         }
    //       }

    //     })
    //   }
    // },
    sendmsg() {
        this.loading.text='发送中';
      this.loading.show = true;
      if (this.textconten) {
        this.unitAjax('post', '/api/userCenter/message/sendMsg',
          { talkUserId: this.$route.params.talkUserId, msgContent: this.textconten }, res => {
            if (res.result) {
              this.loading.show = false;
              this.textconten = '';
              this.getmessage();
            } else {
              this.showToast = true;
              this.ToastText = res.msg;
              this.loading.show = false;
            }

          })
      } else {
        this.showToast = true;
        this.ToastText = '发送消息不能为空';
      }
    }
  }
}

</script>
<style lang="scss" scoped>
body {
  height: 100%;
}
.container {
  position: relative;
  background-color: #f7f7f7;
  .header {
    position: fixed;
    top: 0;
    z-index: 2;
  }
  .listman {
    margin: 1.28rem 0;
    li {
      width: 100%;
      text-align: center;
      .toutal-time {
        margin: 0.34rem auto;
        width: 3rem;
        height: 0.34rem;
        color: rgb(146, 156, 165);
        background-color: #e8e8e8;
        font-size: 0.18rem;
        text-align: center;
        line-height: 0.34rem;
      }
      .li {
      }
      .li > span {
        text-align: left;
        border-radius: 0.1rem;
        padding: 0.1rem 0.2rem;
        max-width: 5rem;
        word-wrap: break-word;
      }
    }
    .li-to {
      margin-left: 0.34rem;
      float: left;
      .toutal {
        width: 100%;
        margin: 0.34rem 0;
      }
    }
    .li-me {
      margin-right: 0.34rem;
      .toutal {
        padding-left: 0.34rem;
        width: 100%;
        margin: 0.34rem;
      }
      float: right;
    }
    .active-user {
      float: left;
      background-color: white;
    }
    .active-me {
      background-color: #59afff;
      color: white;
      float: right;
    }
  }
  .buttom {
    background-color: white;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    position: fixed;
    bottom: 0;
    left: 0;
    transform: translate(0, 0, 0);
    input {
      float: left;
      margin: 0.15rem 0 0 0.2rem;
      width: 70%;
      height: 0.58rem;
      border-radius: 0.58rem;
      background-color: #eef0f2;
      border: none;
      padding-left: 0.3rem;
      transform: translate(0, 0, 0);
    }
    span {
      margin: 0.2rem 0.22rem 0 0;
      float: right;
      width: 17%;
      height: 0.58rem;
      background-color: #59afff;
      color: white;
      font-size: 0.26rem;
      text-align: center;
      line-height: 0.58rem;
      border-radius: 0.1rem;
    }
  }
}
</style>

