<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">公告详情</h2>
    </div>
       <div class="content">
         <p class="notice-title">{{noticelist.title}}</p>
         <p class="notice-time">{{noticelist.createDate}}</p>
         <div class="contentdetail">
         
           <div v-html="noticelist.content"></div>

         </div>
       </div>
  </div>

</template>
<script>
import {getnoticelist} from '../../server/getData.js'
export default {
  data(){
    return{
      noticeids:this.$route.params.noticeids,
      noticelist:{}
    }
  },
  created(){
    this.getnotice();
  },
  methods:{   
    getnotice(){
      this.unitAjax('post','/api/userCenter/notice/noticeDetail',{id:this.noticeids},res=>{
        if(res){
              this.noticelist= res.data;
        }
     
      })
    }
  }
  
}
</script>
<style scoped lang="scss">
  .container {
    .content{
      height: auto;
      background-color: #FFF;
      padding: 0 0.33rem;
      position: relative;
      margin-top: 0.2rem;
      font-size: 0.26rem;
      .notice-time{
        font-size: 0.22rem;
        color: #9EA1B2;
        height: 0.65rem;
        line-height: 0.65rem;
      }
      .notice-title{
        line-height: 0.65rem;
        font-size: 0.34rem; 
      }
      .contentdetail{
        font-size: 0.26rem;
        line-height: 0.6rem;
        padding: 0.34rem 0 ;
        overflow: hidden;
      }
    }
  }
</style>
