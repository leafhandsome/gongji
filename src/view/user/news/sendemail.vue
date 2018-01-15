<template>
  <div class="container">
      <div class="header">
            <div class="header-left returnBtn" @click="$router.go(-1)"></div>
            <h2 class="header-title">发送新消息</h2>
      </div>
     <ul class="listman">
         <li class="border-b1">收件人：<input type="text" placeholder="请输入收件人姓名" v-model="talkUserName" @blur="removename" @focus="getname" @keyup="getselect($event)"></li>
         <li class="border-b1" v-show="showname" v-for="(item,index) in namelist" :key="index" @click="selectorname(item.userName,item.userId)">{{item.userName}}<span v-show="item.nickName">({{item.nickName}})</span> </li>
        
     </ul>
     <div class="toast">
<toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition"></toast>
</div>
     <div class="buttom">
         <input type="text" v-model="emailcontent">
         <span @click="sendemail">发送</span>
     </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            talkUserName: '',
            namelist: [],
            showname: false,
            emailcontent:'',
            showToast:false,
            ToastText:'',
            ToastPosition:'',
            talkUserId:''
        }
    },

    created() {
    },
    methods: {
        //发送邮件
        sendemail(){
            if(this.emailcontent){
            this.unitAjax('post','/api/userCenter/message/sendMsg',{talkUserId:this.talkUserId,msgContent:this.emailcontent},res=>{
                if(res.result){
                   this.emailcontent='';
                   this.showToast=true;
                   this.ToastText='发送成功';
                   setTimeout(() => {
                       this.$router.push('newspage/'+this.talkUserName+'/'+this.talkUserId)
                   }, 1000);
                }else{
                      this.emailcontent='';
                     this.showToast=true;
                   this.ToastText=res.msg;
                }
            })
            }else{
                  this.showToast=true;
                   this.ToastText='发送消息不能为空';
            }    
        },
        //选择下列
        selectorname(userName,userId) {
            this.talkUserName = userName;
            this.talkUserId=userId;
        },
        removename() {
            setTimeout(() => {
                this.showname = false;
            }, 200);

        },
        getselect(ev) {
            if (ev.keyCode) {
                this.unitAjax('post', '/api/userCenter/message/searchUserName', { talkUserName: this.talkUserName }, res => {
                    if (res.result) {
                        this.namelist = res.data;
                    }
                })
            }

        },
        getname() {
            this.unitAjax('post', '/api/userCenter/message/searchUserName', { talkUserName: this.talkUserName }, res => {
                if (res.result) {
                    console.log(res)
                    this.showname = true;
                    this.namelist = res.data;
                }
            })
        }
    }

}

</script>
<style lang="scss" scoped>
.container {
  background-color: #f7f7f7;
  .listman {
    li {
      height: 0.92rem;
      line-height: 0.92rem;
      padding-left: 0.32rem;
      background-color: white;
      font-size: 0.26rem;
      input {
        border: none;
        width: 80%;
        height: 0.84rem;
        line-height: 0.84rem;
        vertical-align: middle;
      }
    }
  }
  .buttom {
    background-color: white;
    width: 100%;
    height: 0.98rem;
    line-height: 0.98rem;
    position: fixed;
    bottom: 0;
    input {
      float: left;
      margin: 0.15rem 0 0 0.2rem;
      width:70%;
      height: 0.58rem;
      border-radius: 0.58rem;
      background-color: #eef0f2;
      border: none;
      padding-left: 0.3rem;
    }
    span {
      margin: 0.2rem 0.22rem 0 0 ;
      float: right;
      width:17%;
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

