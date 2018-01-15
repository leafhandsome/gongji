<template>
  <div class="navbar" v-model="ready">
     <div class="bg"></div>
      <ul class="bottom-nav">

        <li :class="index==0?'ativice':''" @click="onchange(0)">
           <img :src="index==0?historyiconsel:historyicon" >
        </li>

        <li :class="index==1?'ativice':''" @click="onchange(1)">
          <img :src="index==1?resulticonsel:resulticon" >
        </li>

        <li :class="index==2?'ativice':''" @click="onchange(2)">
          <img :src="index==2?bigsmalliconsel:bigsmallicon" >
        </li>

        <li :class="index==3?'ativice':''" @click="onchange(3)">
          <img :src="index==3?singdoubleiconsel:singdoubleicon" >
        </li>

        <li :class="index==4?'ativice':''" @click="onchange(4)">
          <img :src="index==4?dragontigericonsel:dragontigericon" >
        </li>
      </ul>
  </div>
</template>

<script>

  import {mapState, mapMutations} from 'vuex'
  export default{
    data(){
      return{
        msg:'',
        index:'2',//初始化菜单不点中
        historyicon:require('../../assets/images/lottery/history.png'),
        historyiconsel:require('../../assets/images/lottery/history1.png'),
        resulticon:require('../../assets/images/lottery/result.png'),
        resulticonsel:require('../../assets/images/lottery/result1.png'),
        bigsmallicon:require('../../assets/images/lottery/bigsmall.png'),
        bigsmalliconsel:require('../../assets/images/lottery/bigsmall1.png'),
        singdoubleicon:require('../../assets/images/lottery/singdouble.png'),
        singdoubleiconsel:require('../../assets/images/lottery/singdouble1.png'),
        dragontigericon:require('../../assets/images/lottery/dragonttiger.png'),
        dragontigericonsel:require('../../assets/images/lottery/dragonttiger1.png'),
      }
    },
    created(){

    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      ready(){
        let vm = this;
        if(vm.userInfo){
          if(vm.userInfo.userSetNav){
            vm.index = vm.userInfo.userSetNav
          }
        }
      }
    },
    methods:{
      onchange(index){
        this.index = index ;
        // 判断点击菜单打开哪个模块

        this.$emit('clickType',index);//调用父组件的自定义事件，并传值
      },
    }
  }
</script>
<style lang="scss" scoped>
  .navbar{
    width: 100%;
    height: 0.98rem;
    background-color: #fff;
    bottom:0;
    position:fixed;
    z-index: 600;
    /*box-shadow: 1px -4px 7px #EDEDED;*/
    border-top:1px solid #e5e5e5;
    ul li {
          width: 20%;
          float: left;
          text-align: center;
          height: 0.98rem;
        img {
          width: 0.63rem;
          height: 0.63rem;
          margin-top: 0.18rem;
        }
    }
  }
  .ativice img {
    padding-bottom: 0.03rem;
  }
  .histtory{
    z-index: 503;
  }
</style>

