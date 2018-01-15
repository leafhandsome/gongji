<template>
  <popup height="7.3rem" style="background: #fff;" v-model="show" @on-hide="hideresut" class="popupdiv">
  <div class="cantainer">
      <div class="header">
        <h2 class="header-title">开奖结果
          <!--<label > &nbsp;{{params.roomName}}</label>-->
        </h2>
        <div class="header-right"></div>
      </div>

    <loadmore :on-refresh="onRefresh" :on-infinite="onInfinite" :loading-text="loadingText">
    <div class="timeline">
      <ul>
        <li class="timeline-item" v-for="item in resultList" :class="item.openCode.length>5?'itemHeight':''">
          <div class="line-date"> {{item.openDate| filterDate}} </div>
          <div class="line-time"> {{item.openDate| filterTime}} </div>
          <div class="timeline-item-color timeline-item-head"></div>
          <div class="timeline-item-tail"></div>
          <div class="timeline-item-content">
            <div class="line-gameNo">
              {{item.gameNo}}
               <div class="line-right">
                  <div class="drawtext">
                    <p >{{item.sum}}  </p>
                    <p >{{item.draganOrTiger}} | </p>
                    <p >{{item.singleOrDouble}}  |</p>
                    <p >{{item.bigOrSmall}} | </p>
                 </div>
              </div>
                <div class="drawBall">
                  <p class="sprite" v-for="openCode in item.openCode">{{openCode}}</p>
                </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </loadmore>
  </div>
  </popup>
</template>

<script>

  export  default {
    props:['params'],
    data(){
      return{
        show: true,
        roomId: '',
        roomName:'',
        loadingText:'加载中...',
        resultList:[],//开奖结果
        pageIndex:1,//当前页码
        pageSize:10,//没有显示条数
      }
    },
    created(){
      let vm = this;
       vm.roomName = vm.params.roomName //房间名称
       vm.getData();
    },
    methods:{
      getData(){
        let vm = this;
        let parmars = {
          roomId   : vm.params.roomId ,
          pageIndex: vm.pageIndex,
          pageSize : vm.pageSize
        }
        vm.unitAjax('POST','/api/lottery/gameMatchResultList',parmars,function (result) {
          if(result.result){
            let res = result.data.items;
              vm.pageIndex ++;
              if(res.length >= vm.pageSize){
                vm.resultList = res;
              }
          }
        });
      },
      onRefresh(done){
        let vm = this;
        vm.pageIndex = 1;
        vm.getData();
        done();
      },

      onInfinite(done){
        let vm = this;
        let parmars = {
          roomId   : vm.params.roomId ,
          pageIndex: vm.pageIndex,
          pageSize : vm.pageSize
        }
        vm.unitAjax('POST','/api/lottery/gameMatchResultList',parmars,function (result) {
          if(result.result){
            vm.show = true;
            let res = result.data.items;
            vm.resultList =  vm.resultList.concat(res);
            if(res.length < vm.pageSize){
              vm.loadingText = '没有更多了……';
              return false;
            }else{
              vm.pageIndex ++;
            }
            done();
          }
        });
      },
      //关闭窗口
      hideresut(){
        this.$emit('bethideresut','false');//调用父组件的自定义事件，并传值
      },
    },
  }

</script>

<style lang="scss" scoped>
  .cantainer{
    .header {
      position: absolute;
      top: 0;
      background-color: #FFF;
      z-index: 99;
    .header-title {
      height: 1.082rem;
      line-height: 1.082rem;
      label {
        display: block;
        height: 0.3rem;
        line-height: 0.3rem;
        text-align: left;
        padding-left: 0.33rem;
        font-size: 0.30rem;
        color: #4584F5;
        font-weight: 100;
      }
     }
    }
  .yo-scroll{
    top: 1.1rem;
  }
  .timeline{
   height:atuo;
  .timeline-item {
    position: relative;
    height: 1.6rem;
    margin-top: -1px;
    padding: 0.5rem 0 0 0.1rem ;
    border-bottom: 1px solid #efefef;
    .timeline-item-color {
      background-color: #fff;
      border: 1px solid #4584F5;
    }
    .line-date{
      width: 1.5rem;
      text-align:center;
    }
    .line-time{
      width: 1.5rem;
      margin-top: 0.3rem;
      text-align:center;
    }

  .timeline-item-head {
    width: 0.2rem;
    height: 0.2rem;
    left: 1.62rem;
    top: 0.55rem;
    position: absolute;
    content: '';
    z-index: 11;
    border-radius: 100px;
  }
  .timeline-item-tail{
    position: absolute;
    content: '';
    height: 100%;
    width: 0.02rem;
    left: 1.7385rem;
    top: 0;
    z-index: 10;
    background-color: #4584F5;
  }
  .timeline-item-content{
    position: absolute;
    left: 1.9rem;
    top: 0;
    .line-gameNo{
      float: left;
      padding-top: 0.5rem;
      padding-right: 0.3rem;
    }
    .line-right{
      float: right;
      width:50%;
      .drawtext{
        p{
          float: right;
          text-align: center;
          margin: 0 0.05rem;
          line-height: 0.5rem;
        }
      }
    }
   .drawBall{
      float: right;
      text-align: right;
     .sprite {
       margin: 0.2rem 0 0 0.4rem;
       width: 0.5rem;
       height: 0.5rem;
       line-height: 0.5rem;
       font-size: 0.24rem;
       background-color: #D4E8FF;
       background-image: none;
       border-radius: 100%;
     }
   }
  }
  }
  .itemHeight{
    height: 2.2rem;
  }
  }
  }

</style>
