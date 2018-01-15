<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title"><span class="msg">消息</span>
                 <img src="../../../assets/images/weixin/icon-email.png" alt="" @click="gotoemail"></h2>
      </div>
       <div class="search">
      <search
        placeholder="请输入账户、昵称搜索"
        position="absolute"
        auto-scroll-to-top top="46px"
        :autoFixed="false"
        v-model="value"
        ref="search"></search>
    </div>
   
       <ul class="message-list">
           <li v-for="(item,index) in newlist" :key="index" @click="tonewspage(item.talkUserName,item.talkUserId)">
                <swipeout>
      <swipeout-item :threshold=".5" underlay-color="#ccc">
        <div slot="right-menu">
          <swipeout-button style="width:100px" @click.native.stop="onfavClick(item.talkUserId)" background-color="#336DD6">{{'清空聊天记录'}}</swipeout-button>
          <swipeout-button style="width:62px" @click.native.stop="ondeleteClick(item.talkUserId)" background-color="#D23934">{{"删除"}}</swipeout-button>
        </div>
        <div slot="content" >
             <p class="title"><span v-text="item.talkUserName"></span ><span class="time" v-text="item.updateDate">2017-11-25  15:02</span></p>
              <p class="content">{{item.message}}</p><span class="num"  v-show="item.isNew" @click.stop="reader(item.talkUserId)"></span>
        </div>
      </swipeout-item>
    </swipeout>
              
           </li>
       </ul>
       <!-- 提示 -->
      <div class="toast">
        <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
        </div>
  </div>
</template>
<script>
export default {

    data() {
        return {
            setname: '',
            messagelist: [],
            msgcount: 0,
            value: '',
            showAlert: false,
            alertcontent: '',
            showToast: false,
            ToastText: '',
            ToastPosition: '',
        }
    },
    computed: {
        newlist() {
            return this.messagelist.filter((item) => {
                return item.talkUserName.indexOf(this.value) !== -1;
            })
        }
    },
    created() {
        this.getmessage();
        this.msgUnReadCount()
    },
    methods: {
        //标记已读
        reader(talkUserId) {
            this.unitAjax('post', '/api/userCenter/message/labelMsgRead', { userIds: talkUserId }, res => {
                if (res.result) {
                    this.msgcount = 0;
                }
            })
        },
        // 清空聊天
        onfavClick(type) {
            this.unitAjax('post', '/api/userCenter/message/clear', { talkUserId: type }, res => {
                if (res.result) {
                    this.getmessage();
                    this.showToast = true;
                    this.ToastText = "清空成功";
                } else {
                    this.showToast = true;
                    this.ToastText = res.msg;
                }
            })

        },
        ondeleteClick(type) {
            this.unitAjax('post', '/api/userCenter/message/delete', { talkUserId: type }, res => {
                if (res.result) {
                    this.getmessage();
                     this.showToast = true;
                    this.ToastText = "删除成功";
                } else {
                  this.showToast = true;
                    this.ToastText = res.msg;
                }
            })
        },
        tonewspage(talkUserName, talkUserId) {
            this.$router.push('newspage/' + talkUserName + '/' + talkUserId);
        },
        msgUnReadCount() {
            this.unitAjax('post', '/api/userCenter/message/msgUnReadCount', {}, res => {
                if (res.result) {
                    this.msgcount = res.data.msgUnReadCount;
                }
            })
        },
        gotoemail() {
            this.$router.push('sendemail')
        },
        getmessage() {
            this.unitAjax('post', '/api/userCenter/message/talkList', {}, res => {
                if (res.result) {
                    this.messagelist = res.data.items;
                }else{
                    this.err = res.msg
                }
            })
        }
    }
}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  button {
    border: none;
  }
  .header-title {
      .msg{
         display: inline-block;
        padding-left:  1.36rem;
      }
      text-align: center;
    img {
      float: right;
      width: 0.36rem;
      margin: 0.35rem 0.5rem;
    }
  }
  .message-list {
    li {
      font-size: 0.24rem;
      background-color: white;
      margin-top: 0.2rem;
      padding: 0.1rem 0.33rem;
      .vux-swipeout-button-box{
          height: 95%;
      }
      .vux-swipeout-button {
        padding: 0;
        height: 95%;
      }
      p {
        height: 0.5rem;
        line-height: 0.5rem;
      }
      .title {
          height: .6rem;
        font-size: 0.26rem;
        color: rgb(63, 69, 87);
      }
      .num {
        float: right;
        margin-right: 0.25rem;
        background-color: #fc5051;
        color: white;
        width: 0.15rem;
        height: 0.15rem;
        vertical-align: top;
        border-radius: 50%;
        text-align: center;
        line-height: 0.15rem;
      }
      .time {
        float: right;
        color: rgb(158, 161, 178);
      }
      .content {
        float: left;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgb(158, 161, 178);
      }
    }
  }
}
</style>

