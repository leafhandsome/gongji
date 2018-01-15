import fetch from '../config/fetchUtil'

/**
 * 登录
 */
export const login = (name, password) => fetch('/api/account/login', {
  userName: name,
  password: password

},"POST");

/*
*获取游戏列表
*
**/
export  const getGamelist = (userId,token,appid)=>fetch('/api/home/index',{
  // userId:userId,
  // token:token,
  appid:appid,
},"POST");

/*
* 获取选择游戏列表
*
**/

export const getSelectGame = (userId,token,appid)=>fetch('/api/home/selectGame',{
  // userId:userId,
  // token:token,
  appid:appid,
},"POST");

/*
* 保存选择游戏
*
**/

export const saveGame = (userId,token,appid,gameRoomIds)=>fetch('/api/home/saveSelectGame',{
  userId:userId,
  token:token,
  appid:appid,
  gameRoomIds:gameRoomIds
},"POST");

/*
* 游戏大厅-游戏中心
*
**/
export const gameCenterlist = (userId,token,appid)=>fetch('/api/gameCenter/lottery',{
  userId:userId,
  token:token,
  appid:appid
},"POST");


//游戏记录
export const getgameRecord = (userId, token) => fetch("/api/userCenter/gameTypeMap", {
    userId: userId,
    token: token,
}, "POST");

//游戏记录详情
export const getgamedeta = (userId, token, id) => fetch("/api/userCenter/gameTypeMap", {
    userId: userId,
    token: token,
    id: id
}, "POST");

//公告中心
export const getnoticelist = (userId, token) => fetch("/api/userCenter/gameTypeMap", {
    userId: userId,
    token: token,
}, "POST");

//公告详情
export const getnoticedetail = (userId, token, id) => fetch("/api/userCenter/noticeDetail", {
    userId: userId,
    token: token,
    id: id
}, "POST");
//充值方式列表
export const voucher = () => fetch("/api/userCenter/charge/list", {

}, "POST");
