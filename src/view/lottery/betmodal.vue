<template>
  <div class="dialog" id="dialog">
    <div class="mask" @click="cancel"></div>
    <div class="dialog-content">
      <div class="top">
        <img src="../../assets/images/modal-top.png">
         <div class="text">
           <p class="betname">{{params.playName}}</p>
           <p class="betno">No.{{params.gameNo}}</p>
         </div>
        <div class="img" @click="showMark" v-if="!successMain">
          <img :src=markIcon>
        </div>
      </div>

      <div class="main"  id="modalmain">
        <div class="showmain"v-show="showMain">
          <betquwei v-if="showquwei" @resultData="resultData" :params="objparma"></betquwei>
          <!--骰宝 start-->
          <dianshu  v-if="t_dianshu"  @resultData="resultData" :params="objparma"></dianshu>
          <duanpai  v-if="t_duanpai"  @resultData="resultData" :params="objparma"></duanpai>
          <changpai v-if="t_changpai" @resultData="resultData" :params="objparma"></changpai>
          <sanjun   v-if="t_sanjun"   @resultData="resultData" :params="objparma"></sanjun>
          <baozi    v-if="t_baozi"    @resultData="resultData" :params="objparma"></baozi>
          <yuxiaxie v-if="t_yuxiaxie" @resultData="resultData" :params="objparma"></yuxiaxie>
          <sima     v-if="t_sima"     @resultData="resultData" :params="objparma"></sima>
          <wuma     v-if="t_wuma"     @resultData="resultData" :params="objparma"></wuma>
          <!--骰宝 end-->

          <!--快三 start-->
          <kuadu v-if="k_kuadu" @resultData="resultData" :params="objparma"></kuadu>
          <hezhi v-if="k_hezhi" @resultData="resultData" :params="objparma"></hezhi>
          <sanlianhao v-if="k_sanlianhao" @resultData="resultData" :params="objparma"></sanlianhao>
          <santonghao v-if="k_santonghao" @resultData="resultData" :params="objparma"></santonghao>
          <erdanxuan  v-if="k_erdanxuan"  @resultData="resultData" :params="objparma"></erdanxuan>
          <chongdan   v-if="k_chongdan"   @resultData="resultData" :params="objparma"></chongdan>
          <dantuo     v-if="k_dantuo"     @resultData="resultData" :params="objparma"></dantuo>
          <!--快三 end-->

          <!--海南 start-->
          <xuanhao   v-if="s_xuanhao" @resultData="resultData" :params="objparma"></xuanhao>
          <hchongdan v-if="s_chongdan"@resultData="resultData" :params="objparma"></hchongdan>
          <dingwei   v-if="s_dingwei" @resultData="resultData" :params="objparma"></dingwei>
          <!--海南 end-->

          <!--北京赛车 start-->
          <bjrangking v-if="bj_zhixuan" @resultData="resultData" :params="objparma"></bjrangking>
          <bjqianer   v-if="bj_qianer"  @resultData="resultData" :params="objparma"></bjqianer>
          <bjgyhezhi  v-if="bj_gyhezhi" @resultData="resultData" :params="objparma"></bjgyhezhi>
          <!--北京赛车 end-->

          <!--官方玩法 start-->
          <gfdingwei1 v-if="gf_dingwei1" @resultData="resultData":params="objparma"></gfdingwei1>
          <gfdingwei2 v-if="gf_dingwei2" @resultData="resultData":params="objparma"></gfdingwei2>
          <gfdingwei3 v-if="gf_dingwei3" @resultData="resultData":params="objparma"></gfdingwei3>
          <gfdingwei4 v-if="gf_dingwei4" @resultData="resultData":params="objparma"></gfdingwei4>
          <gfdingwei5 v-if="gf_dingwei5" @resultData="resultData":params="objparma"></gfdingwei5>
          <gfdantuo   v-if="gf_dantuo"   @resultData="resultData":params="objparma"></gfdantuo>
          <gfdanshi   v-if="gf_danshi"   @resultData="resultData":params="objparma"></gfdanshi>
          <gfchongdan v-if="gf_chongdan" @resultData="resultData":params="objparma"></gfchongdan>
          <!--官方玩法 end-->

          <div class="inline-number-item">
            <p>下注倍数</p>
            <div class="inline-number-l">
              <div class="inline-x-number">
                <div>
                  <a class="number-selector number-selector-sub" @click="subtract">-</a>
                  <input type="tel" class="number-input"  v-model="multiple" @blur='onBlurValue()' >
                  <a class="number-selector number-selector-plus" @click="add">+</a>
                </div>
              </div>
            </div>
            <div class="inline-number-r">
              <checker default-item-class="btn-checker-item" selected-item-class="btn-checker-selected" v-model="checkboxMax">
                <checker-item value="1" @on-item-click="moneyunit">元</checker-item>
                <checker-item value="2" @on-item-click="moneyunit">角</checker-item>
                <checker-item value="3" @on-item-click="moneyunit">分</checker-item>
              </checker>
            </div>
            <div class="number-tip" v-model="totalMoney">
              <p>每注最多可赢：<label class="oddsmoney">{{totalOdds}}元</label></p>
              <p class="cancel-tip" v-if="count_zs<=0 && showTip" >TIPS:点击窗口外关闭弹窗</p>
              <p class="cancel-tip" v-if="count_zs>0 && showZs" >{{count_zs}}注，共{{total}}元</p>
              <p class="pay" v-if="showPay" >对不起，您的余额不足<span @click="goURL('/voucher')"> &nbsp;&nbsp;去充值</span></p>
            </div>
          </div>
          <div class="xiazhubtn" @click="betOrder()" :class="count_zs>0?'ativice':''">下注</div>
        </div>
        <div class="successMain" v-if="successMain">
          <p class="orderText">{{successObj.betCount}}注，{{successObj.betTimes}}倍，共{{successObj.betMoney}}元</p>
          <img src="../../assets/images/weixin/bankok.png">
          <p class="successText">投注成功！</p>
          <p class="cancel-tip">TIPS:点击窗口外关闭弹窗</p>
          <p >订单号：{{successObj.orderId}}</p>
        </div>
      </div>
      <div class="remak" v-show="showRemark">
        <p>{{remark}}</p>
      </div>
    </div>
    <div class="loading">
      <loading :show="loading.show" :text="loading.text"></loading>
    </div>
    <div class="toast">
      <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="ToastText" :position="ToastPosition" width="8.6em"></toast>
    </div>
  </div>
</template>

<script>
  import betquwei from './betquwei'
  import Params   from '../../config/Param.json';
  import {mapState, mapMutations} from 'vuex' ;

  import dianshu from './toubao/betdianshu' //骰宝-点数
  import duanpai from './toubao/betduanpai' //骰宝-短牌
  import changpai from './toubao/betchangpai' //骰宝-短牌
  import sanjun from './toubao/betsanjun'  //骰宝-三军
  import baozi from  './toubao/betbaozi'   //骰宝-豹子
  import yuxiaxie from  './toubao/betyuxiaxie' //骰宝-鱼虾蟹
  import sima from  './toubao/betsima' //骰宝-四码
  import wuma from  './toubao/betwuma' //骰宝-鱼虾蟹

  import kuadu from './kuaisan/betkuadu' //快三-跨度
  import hezhi from './kuaisan/bethezhi' //快三-和值
  import sanlianhao from './kuaisan/betsanlianhao' //快三-三连号
  import santonghao from './kuaisan/betsantonghao' //快三-三同号
  import erdanxuan from './kuaisan/beterdanxuan'   //快三- 单选
  import chongdan from './kuaisan/betchongdan'     //快三- 重单-两排
  import dantuo from './kuaisan/betdantuo'         //快三 - 胆拖 -二不同拖胆 -三不同胆拖

  import xuanhao from './hainan/betxuanhao';    //海南 -选号
  import hchongdan from './hainan/betchongdan'; //海南 -重单
  import dingwei from  './hainan/betdingwei'    //海南 -定位

  import bjrangking from './beijing/betzhixuan' //北京赛车直选
  import bjqianer   from './beijing/betqianer'  //北京赛车前二直选
  import bjgyhezhi  from './beijing/betgyhezhi' //北京赛车和值

  import gfdingwei1 from  './official/betdingwei1'//官方玩法 1排
  import gfdingwei2 from  './official/betdingwei2'//官方玩法 2排
  import gfdingwei3 from  './official/betdingwei3'//官方玩法 3排
  import gfdingwei4 from  './official/betdingwei4'//官方玩法 4排
  import gfdingwei5 from  './official/betdingwei5'//官方玩法 5排
  import gfdantuo   from  './official/betdantuo'  //官方玩法 胆拖
  import gfdanshi   from  './official/betdanshi'  //官方玩法 单式
  import gfchongdan from  './official/betchongdan'//官方玩法 重单

  export default {
    props:['params'],
    data(){
      return {
        multiple:1,//倍数值,
        checkboxMax:"1",
        count_zs:0,//注数
        showMain:true,
        showRemark:false,
        successMain:false,
        successObj:{},
        markIcon :'',//玩法详情图标
        playOdds: 0, //赔率
        totalOdds:0,
        waterValue:0,//000
        total:0,     //总金额
        betInput:'', //下注内容
        showquwei:false,
        showTip:true,
        showZs:true,
        showPay:false,
        showToast:false,//显示提示
        ToastText:'',   //提示内容
        ToastPosition: 'bottom',//提示位置,
        remark:'',
        loading: {
          show: false,
          text: '加载中...'
        },
        height:'8.3rem',
        /*-------------------------骰宝 start-------------------------**/
        t_dianshu:false,  //骰宝 - 点数,
        t_duanpai:false,  //骰宝-短牌,
        t_changpai:false, //骰宝-长牌,
        t_sanjun:false,   //骰宝-三军,
        t_baozi :false,   //骰宝-豹子,
        t_yuxiaxie:false, //骰宝-鱼虾蟹,
        t_sima    :false, //骰宝-四码,
        t_wuma    :false, //骰宝-五码,
        /*-------------------------骰宝 end-------------------------**/
        k_kuadu   :false,    //快三-跨度
        k_hezhi   :false,    //快三-和值
        k_sanlianhao:false,  //快三-三连号
        k_santonghao:false,  //快三-三同号
        k_erdanxuan :false,  //快三-二同号单排
        k_chongdan  :false,  //快三 - 重号-单号
        k_dantuo    :false,  //快三 - 胆拖 -二不同拖胆 -三不同胆拖
        /*-------------------------海南 start-------------------------**/
        s_xuanhao   :false,  //时时彩-海南 -选号
        s_chongdan  :false,  //时时彩-海南 -重单
        s_dingwei   :false,  //时时彩-海南 -定位
        /*-------------------------海南 end-------------------------**/
        bj_zhixuan  :false,
        bj_qianer   :false,
        bj_gyhezhi  :false,

        gf_dingwei1 :false,
        gf_dingwei2 :false,
        gf_dingwei3 :false,
        gf_dingwei4 :false,
        gf_dingwei5 :false,
        gf_dantuo   :false,
        gf_danshi   :false,
        gf_chongdan :false,
      }
    },
    created(){
      let vm =this;
      let playType = vm.params.playType;
      vm.markIcon = vm.showMain?require('../../assets/images/lottery/question.png'):require('../../assets/images/lottery/close.png');
      vm.objparma = vm.params;
      vm.playOdds = vm.params.playOdds;
      vm.remark = vm.params.remark;
      /*-------------------------骰宝 start-------------------------**/
      //骰宝 - 点数
      if(playType == 1006){
        vm.height = '6.9rem';
        vm.getPlayOddsList(playType);
      }
      //骰宝-长牌
      else if(playType == 1015){
        vm.height = '7rem';
        vm.getPlayOddsList(playType);
      }
      //骰宝-短牌
      else if(playType == 1016){
        vm.height = '7.1rem';
        vm.getPlayOddsList(playType);
      }
      //骰宝-豹子
      else if(playType == 1017){
        vm.height = '8.4rem';
        vm.getPlayOddsList(playType);
      }
      //骰宝-三军
      else if(playType == 1019){
        vm.height = '7.35rem';
        vm.getPlayOddsList(playType);
      }
      //骰宝-鱼虾蟹
      else if(playType == 1028 ||playType == 1018){
        vm.height = '8.2rem';
        vm.t_yuxiaxie = true;
      }
      //骰宝-五码
      else if(playType == 1029){
        vm.height = '6rem';
        vm.t_wuma= true;
      }
      //骰宝-四码
      else if(playType == 1030 ||playType == 1031){
        vm.height = '6rem';
        vm.t_sima= true;
      }
      /*-------------------------骰宝 end-------------------------**/
      /*-------------------------快三 start-----------------------**/
      //快三-跨度
      else if(playType == 1023){
        vm.height  = '6.8rem';
        vm.getPlayOddsList(playType);
      }
      //快三-和值
      else if(playType == 1005){
        vm.height = '6.3rem';
        vm.getPlayOddsList(playType);
      }
      //快三-三连号
      else if(playType == 1014){
        vm.height = '6.8rem';
        vm.getPlayOddsList(playType);
      }
      //快三-三同号
      else if(playType == 1011){
        vm.height = '6.8rem';
        vm.getPlayOddsList(playType);
      }
      //快三-二同号复选 --二不同单选 --三不同单选
      else if(playType == 1008 || playType == 1009 || playType == 1012){
        vm.height = '5.7rem';
        vm.k_erdanxuan = true ;
      }
      //快三 - 重号-单号
      else if(playType ==1007){
        vm.height = '7rem';
        vm.k_chongdan = true;
      }
      //快三 - 胆拖 -二不同拖胆 -三不同胆拖
      else if(playType ==1010 || playType == 1013){
        vm.height = '7rem';
        vm.k_dantuo = true;
      }
      /*-------------------------快三 end-------------------------**/
      else if(vm.contains(Params.xuanhaoType,playType)){
        vm.height = '7.6rem';
        if(playType == 20 || playType == 22 || playType == 24){
          vm.height = '6.9rem';
        }
        vm.s_xuanhao = true;
      }
      else if(vm.contains(Params.chongDanType,playType)){
        vm.height = '8.2rem';
        vm.s_chongdan = true;
      }
      //1,2,3,4定位
      else if(vm.contains(Params.hdingwei,playType)){
        vm.height = '8rem';
        vm.s_dingwei = true;
      }
      //北京赛车直选
      else if(vm.contains(Params.bjRangking,playType)){
        vm.height = '7.6rem';
        vm.bj_zhixuan = true;
      }
       //北京赛车 前二直选 - 前三直选
      else if(playType == 3035 || playType == 3036){
        vm.height = '8rem';
        vm.bj_qianer = true;
      }
      //北京赛车 冠亚和值 - 前三和值
      else if(playType == 3037 || playType == 3038){
        vm.height = '6.3rem';
        vm.getPlayOddsList(playType);
      }
      //官方玩法  不定位
      else if(vm.contains(Params.gfdingwei1,playType)){
        vm.height = '7.6rem';
        vm.gf_dingwei1 = true;
      }
      //官方玩法 定位胆  五星复式  五星组合
      else if(playType == 120 || playType == 40 || playType == 42){
        vm.height = '8rem';
        vm.gf_dingwei5 = true;
      }
      //官方玩法 重 单
      else if(vm.contains(Params.gfchongdan,playType)){
        vm.height = '8.2rem';
        vm.gf_chongdan = true;
      }
      //官方玩法 前四
      else if(playType == 50 || playType == 52){
        vm.height = '8rem';
        vm.gf_dingwei4 = true;
      }
      //官方玩法 前三
      else  if(playType == 70){
        vm.height = '8rem';
        vm.gf_dingwei3 = true;
      }
      //官方玩法 前三组三胆拖   前三组六胆拖
      else if(playType == 73 || playType == 75){
        vm.height = '8.2rem';
        vm.gf_dantuo = true;
      }
      //前二直选
      else if(playType == 100){
        vm.height = '8.2rem';
        vm.gf_dingwei2 = true;
      }
      //五星单选，前四单选 ，前三单选， 前三组合  前二  前二直选
      else if(vm.contains(Params.gfdanshi,playType)){
        vm.height  = '6.9rem';
        vm.gf_danshi = true;
      }
      else{
        vm.showToast = true;
        vm.ToastText = '敬请期待' ;return
        vm.showchonghao =true;
      }
    },
    mounted(){
      let vm =this;
      if(vm.height!=""){
        vm.$el.querySelector('.main').style.height = vm.height //设置投注框的高度
      }
    },
    computed: {
      //计算总投注金额
      totalMoney(){
        let  vm  = this;
        vm.multiple = /^[0-9]*$/.test(vm.multiple) ? vm.multiple : 1;
        if(vm.multiple > Params.maxValue){
          vm.multiple  = Params.maxValue ;
        }
        if(vm.count_zs && vm.count_zs>0){
          //计算元单位
          if(vm.checkboxMax==1){
            vm.total = (vm.count_zs *vm.multiple * 1).toFixed(3) ;
            //计算角单位
          }else  if(vm.checkboxMax==2){
            vm.total = (vm.count_zs *vm.multiple * 0.1).toFixed(3) ;
            //计算分单位
          }else if(vm.checkboxMax==3){
            vm.total = (vm.count_zs *vm.multiple * 0.01).toFixed(3) ;
          }else {
            vm.total = (vm.count_zs *vm.multiple *1).toFixed(3) ;
          }
        }
      },
    },

    methods: {
      ...mapMutations([
        'GET_USERINFO'
      ]),
      //下注
      betOrder(){
        let vm = this;
        let token  = vm.getValue("token");
        let userId = vm.getValue("userId");
        if(vm.betInput==""){
          vm.showToast = true;
          vm.ToastText = '敬请期待' ;return false;
        }
        if(vm.count_zs <= 0){  vm.showToast = true;vm.ToastText = '投一注吧';return false;}

        if(token && userId){
          let moneyUnit = vm.checkboxMax?vm.checkboxMax:'1';
          if(vm.multiple>0 && vm.multiple){
            let parmars = {
              "roomId"    :vm.params.roomId,    //房间id
              "gameNo"    :vm.params.gameNo,    //游戏id
              "playType"  :vm.params.playType,  //玩法id
              "betInput"  :JSON.stringify(vm.betInput), //下注内容
              "betTimes"  :vm.multiple,     //倍数
              "moneyUnit" :moneyUnit,       //单位
              "orderWater":vm.waterValue,   //水位
            }
            vm.loading.show = true ;
            vm.loading.text = '正在下注...';
            vm.unitAjax('POST','/api/lottery/bet',parmars,function (result) {
              if(result.result){
                vm.loading.show  = false;
                vm.showMain      = false;
                vm.successMain   = true;  //显示成功界面
                vm.successObj    = result.data;
                let userInfoData = {
                  safeMoney: (result.data.userSafeMoney).toFixed(3)   //下注后金额
                }
                vm.GET_USERINFO(userInfoData) ;

                //记住下注水位
                let name = 'playType' + vm.params.playType;
                let obj = vm.waterValue;
                vm.removeStore(name);
                vm.setStore(name,obj);

                //关闭下注页面
                setTimeout(function () {
                    vm.cancel();
                  },3000);
              }else{
                vm.loading.show = false;
                vm.showToast = true;
                vm.ToastText = result.msg ;
                if(result.operateCode==100){ //登录状态过期了，清除token userId ,
                  vm.removeValue("token");
                  vm.removeValue("userId")
                  setTimeout(function () {
                    vm.goLogin();
                  },1000);
                }else if(result.msg.indexOf('对不起，您的余额不足')!=-1){
                  vm.count_zs = 0;
                  vm.showTip = false;
                  vm.showPay = true;
                }
                else {
                  vm.showToast = true;
                  vm.ToastText = result.msg ;
                }
              }
            });
          }else{
            vm.showToast = true;
            vm.ToastText = '金额不能为0' ;
          }
        }else {
          vm.goLogin();
        }
      },
      //减少倍数
      subtract(){
       if(this.multiple>1){
         this.multiple-=1;
       }else {
         this.multiple = 1;
       }
      },
      //增加倍数
      add(){
        this.multiple+= 1;
      },
      // 取消,
      cancel() {
        let vm = this;
        let parmar = {};
            parmar.hide = false ;
        this.$emit('changingType',parmar);//调用父组件的自定义事件，并传值
      },

      resultData(data){
        let vm = this;
        if(data){
          vm.waterValue  = data.waterValue ;  //水位
           if(data.betInput){
             vm.betInput = data.betInput;    //下注内容
           }else {
             vm.betInput = {};
           }
          if(data.count_zs){
            vm.count_zs  = data.count_zs;   //下注注数
          }else{
            vm.count_zs  = 0;
          }
          //赔率乘以赔率 *投注金额，等于每注可赢金额。
          if(vm.checkboxMax==1){
            vm.totalOdds = (vm.playOdds * vm.waterValue/2000 *1).toFixed(3) ;
            //计算角单位
          }else if(vm.checkboxMax==2){
            vm.totalOdds = (vm.playOdds * vm.waterValue/2000 * 0.1).toFixed(3) ;
            //计算分单位
          }else if(vm.checkboxMax==3){
            vm.totalOdds = (vm.playOdds * vm.waterValue/2000 * 0.01).toFixed(3) ;
          }else{
            vm.totalOdds = (vm.playOdds * vm.waterValue/2000 *1 ).toFixed(3);
          }

          if(data.toast){
            vm.showToast = true;
            vm.ToastText = '不能选相同的号码' ;
          }else {
            vm.showToast = false;
          }
        }else {
          vm.count_zs = 0;
          vm.betInput = {};
        }
      },
      moneyunit(val){
        let vm =this;
        vm.checkboxMax = val;
      },
      //显示玩法详情
      showMark(){
        let vm = this;
        if(vm.showMain){
          vm.showMain = false;
          vm.showRemark = true;
        } else {
          vm.showMain = true;
          vm.showRemark = false;
        }
        vm.markIcon = vm.showMain?require('../../assets/images/lottery/question.png'):require('../../assets/images/lottery/close.png')
        vm.successMain = false;
      },
      //获取赔率
      getPlayOddsList(playType){
        let vm = this;
        let token  = vm.getValue("token");
        let userId = vm.getValue("userId");
        if(token && userId){
          let parmars = {
            "playType" :playType
          }
          vm.unitAjax('POST','/api/room/getPlayOddsList',parmars,function(result){
            if(result.result){
              vm.objparma.oddsList = result.data;
              //先获取赔率表，才能打开投注页面。
              if(playType=='1017'){
                vm.t_baozi = true;
              }else if(playType == '1006'){
                vm.t_dianshu = true
              }
              else if(playType == '1005'){
                vm.k_hezhi = true
              }
              else if(playType == '1023'){
                vm.k_kuadu = true
              }
              else if(playType == '1011'){
                vm.k_santonghao = true
              }
              else if(playType == '1014'){
                vm.k_sanlianhao = true
              }
              else if(playType == '1015'){
                vm.t_changpai =  true;
              }
              else if(playType == '1016'){
                vm.t_duanpai =  true;
              }
              else if(playType == '1019'){
                vm.t_sanjun = true;
              }else if(playType == 3037 || playType == 3038){
                vm.bj_gyhezhi = true;
              }
            }else {
              if (result.operateCode == 100) {  //登录状态过期了，清除token userId ,
                vm.removeValue("token");
                vm.removeValue("userId");
                vm.showToast = true;
                vm.ToastText = result.msg ;
                setTimeout(function () {
                  vm.goLogin();
                },1000);
              }
            }
          });
        }else {
          vm.goLogin();
        }
      },
      onBlurValue(){
        let vm = this;
        if(vm.multiple==0 && vm.multiple==''){
          vm.multiple =1;
        }
      }
    },
    components:{
      betquwei,
      /*--骰宝 start--**/
      dianshu,
      duanpai,
      changpai,
      sanjun,
      baozi,
      yuxiaxie,
      sima,
      wuma,
      /*--骰宝 end--**/
      /*--快三 start--**/
      kuadu,
      hezhi,
      sanlianhao,
      santonghao,
      erdanxuan,
      chongdan,
      dantuo,
      /*--快三 end--**/
      /*--时时彩-海南 start--**/
      xuanhao,
      hchongdan,
      dingwei,
      /*--时时彩-海南 end--**/
      bjrangking,
      bjqianer,
      bjgyhezhi,

      gfdingwei1,
      gfdingwei2,
      gfdingwei3,
      gfdingwei4,
      gfdingwei5,
      gfdantuo  ,
      gfdanshi  ,
      gfchongdan
    }
  }
</script>

<style lang="scss" scoped>
  .dialog {
    position: relative;
    overflow-y: hidden;
  .dialog-content{
    position: fixed;
    box-sizing: border-box;
    width: 90%;
    height: auto;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    -webkit-animation:myfirst 0.1s;
    animation: myfirst 0.1s;
    border-radius: 5px;
    z-index: 1002;
    .top{
      img{
        position: relative;
        width: 100%;
      }
      .text{
        position: absolute;
        top: 0.2rem;
        left: 0.3rem;
        color: #FFF;
        p{
          line-height: 0.4rem;
        }
        .betname{
          font-size: 0.4rem;
        }
        .betno{
          font-size: 0.24rem;
        }
      }
      .img{
        position: absolute;
        right: 0.1rem;
        top: 0.3rem;
        text-align: center;
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        img{
          width: 0.46rem;
          height: 0.46rem;
        }
    }
    }
    .main{
       background: url("../../assets/images/modal-centen.png") no-repeat;
       background-size: 100% 100%;
        .inline-number-item {
          position: fixed;
          bottom: 1.46rem;
          height:1.7rem;
          padding-left: 0.2rem;
          background-color: #FFF;
          p{
            font-size: 0.24rem;
            color: #c0c1c1;
          }
        .inline-number-l {
          float: left;
          text-align: center;
          .vux-inline-x-number {
            margin-top: 3px;
          }
        }
        .inline-number-r {
          float: left;
          margin-left: 0.3rem;
          text-align: center;
        }
        .number-tip{
          padding-top: 0.1rem;
          clear: both;
          p{
            line-height: 0.35rem;
            color: #C0C1C1;
          }
            .cancel-tip{
              text-align: center;
            }
            .pay{
              line-height: 0.45rem;
              text-align: center;
              color: #F59330;
              span{
                color: #4584F5;
              }
            }
        }
        }
        .xiazhubtn {
          position: fixed;
          bottom: 0;
          width: 100%;
          height: 1rem;
          background: #fff;
          border-top: 1px solid #e5e5e5;
          /*border-radius: 0 0 5px 5px;*/
          font-size: 0.34rem;
          line-height:1rem;
          text-align: center;
        }
        .ativice{
          background-color: #52AAFC;
          color: #fff;
        }
    }
     .remak{
       padding: 0.2rem;
       position: absolute;
       top: 25%;
     }
    .successMain{
      width: 100%;
      text-align: center;
      font-size: 0.26rem;
      .orderText{
        display: block;
        padding-top: 0.42rem;
        font-size: 0.3rem;
      }
      .successText{
        padding-top: 0.39rem;
        padding-bottom: 0.3rem;
        font-size: 0.36rem;
        color: #5EE072;
      }
      .cancel-tip{
        line-height: 0.5rem;
      }
      img{
        width: 1.6rem;
        height: 1.6rem;
        padding-top: 0.34rem;
      }
    }
  }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1001;
      background: rgba(0,0,0,.5);
    }
  }
  @keyframes myfirst
  {
    0%   {top:0;}
    50%  {top:25%;}
    100% {top:50%;}
  }
  .oddsmoney{
    color: #52aafc;
  }
</style>
