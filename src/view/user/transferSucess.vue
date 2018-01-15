<template>
  <div class="container">
    <div class="header">
      <div class="header-left returnBtn" @click="$router.go(-1)"></div>
      <h2 class="header-title">提示</h2>
    </div>
    <div class="tip">
       <img src="../../assets/images/sucess.png">
       <p>恭喜，操作成功！</p>
    </div>
      <div class="submitBtn submitBtn-ativice ">
        <p class="" @click="$router.push('user')">确定</p>
      </div>
    </div>
</template>

<script>
  export  default {
    data() {
      return{

      }
    }
  }
</script>
<style lang="scss" scoped>
  .container{
  .header{
    position: fixed;
  }
   .tip{
     margin-top: 2.872rem;
    text-align: center;
     img{
       width:1.96rem;
       height: 1.96rem;
     }
     p{
       margin-top: 0.6rem;
     }
   }
  }



</style>
