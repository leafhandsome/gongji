import {
  GET_USERINFO,
  GET_GAMEFILETER,
}  from './mutation-types.js'

export default {
  //获取用户信息
  [GET_USERINFO](state,info){
    state.userInfo = info;
  },
}
