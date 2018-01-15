import  Vue from 'vue'
import  Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: null, //用户信息
  login   : false,//是否登录
  nickName:'',//昵称
  username:'',//用户名
  realname:'',//真实姓名
  mobile:'',//手机号码
  userRate:0,//用户返点
  mobilelogin:'',//手机验证码登录标示
  probrom:'',//密保是否绑定
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
