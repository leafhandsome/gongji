import home from './components/home';
export default [
    {
        path: '/', component: home, children: [
            //个人中心
            {
                path: 'user', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/userA'], resolve) },
                ]
            },
            //个人信息
            {
                path: 'userinfo', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/userinfo'], resolve) },
                ]
            },
            //首页
            {
                path: 'index', component: home, children: [
                    { path: '/', component: resolve => require(['./view/home/index'], resolve) },
                ]
            },
            //添加游戏
            {
                path: 'addgame', component: home, children: [
                    { path: '/', component: resolve => require(['./view/home/addgame'], resolve) },
                ]
            },
            //游戏大厅
            {
                path: 'gamelobby', component: home, children: [
                    { path: '/', component: resolve => require(['./view/home/gamelobby'], resolve) },
                ]
            },
            //添加游戏
            {
                path: 'addgame', component: home, children: [
                    { path: '/', component: resolve => require(['./view/home/addgame'], resolve) },
                ]
            },
            //投注页面
            {
                path: '/betting/:roomId/:roomName', component: home, children: [
                    { path: '/', component: resolve => require(['./view/lottery/bettingpage'], resolve) },
                ]
            },
            //添加游戏
            {
                path: 'addplays/:roomId/:roomName', component: home, children: [
                    { path: '/', component: resolve => require(['./view/lottery/addplays'], resolve) },
                ]
            },
            //充值中心
            {
                path: 'voucher', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/voucher'], resolve) },
                ]
            },
            //微信充值
            {
                path: 'paywecthar/:payFlag/:maxMoney/:minMoney', component: home, children: [

                    { path: '/', component: resolve => require(['./view/user/paywecthar'], resolve) },
                ]
            },
            //卡密支付
            {
                path: 'paycard/:payFlag', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/paycard'], resolve) },
                ]
            },
            //快捷支付
            {
                path: 'paykuaijie/:payFlag/:maxMoney/:minMoney', component: home, children: [

                    { path: '/', component: resolve => require(['./view/user/paykuaijie'], resolve) },
                ]
            },
            //代理充值
            {
                path: 'payproxy/:payFlag', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/payproxy'], resolve) },
                ]
            },
            //提现记录
            {
                path: 'withdrawRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/withdrawRecord'], resolve) },
                ]
            },
            //提现中心
            {
                path: 'withdraw', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/withdraw'], resolve) },
                ]
            },
            //银行卡提现
            {
                path: 'withdrawbank/:minmoney/:maxmoney', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/withdrawbank'], resolve) },
                ]
            },
            //支付宝提现
            {
                path: 'withdrawalipay/:minMoney/:maxMoney', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/withdrawalipay'], resolve) },
                ]
            },
            //转账中心
            {
                path: 'transfer', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/transferCenter'], resolve) },
                ]
            },
            //转账记录
            {
                path: 'transferRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/transferRecord'], resolve) },
                ]
            },
            //转账详情
            {
                path: 'transferdetail/:itemsid', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/transferdetail'], resolve) },
                ]
            },
            {
                path: 'transfersucess', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/transferSucess'], resolve) },
                ]
            },
            //游戏记录
            {
                path: 'gameRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/gameRecord'], resolve) },
                ]
            },
            //游戏详情
            {
                path: 'gamedetail/:orderId', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/gamedetail'], resolve) },
                ]
            },
            //彩票记录
            {
                path: 'lotteryRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/lotteryRecord'], resolve) },
                ]
            },
            //彩票详情
            {
                path: 'lotterydetail/:daytime', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/lotterydetail'], resolve) },
                ]
            },
            //充值记录
            {
                path: 'payRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/payRecord'], resolve) },
                ]
            },
            //充值详情
            {
                path: 'paydetail/:payMoney/:payStatus/:payFlagName/:userName/:createDate/:orderSn', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/paydetail'], resolve) },
                ]
            },
            //账变记录
            {
                path: 'billRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/billRecord'], resolve) },
                ]
            },
            //账变详情
            {
                path: 'billdetail/:createDate/:changeType/:beforeMoney/:afterMoney/:remark/:changeMoney', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/billdetail'], resolve) },
                ]
            },
            //返奖记录
            {
                path: 'rebateRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/rebateRecord'], resolve) },
                ]
            },
            //返奖详情
            {
                path: 'rebatedetail/:orderSn', component: home, children: [

                    { path: '/', component: resolve => require(['./view/user/rebatedetail'], resolve) },
                ]
            },
            //代理中心
            {
                path: 'agencycenter', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/agencycenter'], resolve) },
                ]
            },
            //团队报表
            {
                path: 'teamreport', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teamreport'], resolve) },
                ]
            },

            //团队管理
            {
                path: 'teamlist', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teamlist'], resolve) },
                ]
            },
            //队员配置
            {
                path: 'teamconfig/:configid/:setid', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teamconfig'], resolve) },
                ]
            },
            //开户中心
            {
                path: 'accountcenter', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/accountcenter'], resolve) },
                ]
            },
            //团队充值记录
            {
                path: 'teampayRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teampayRecord'], resolve) },
                ]
            },
            //团队账变记录
            {
                path: 'teambillRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teambillRecord'], resolve) },
                ]
            },
            //团队游戏记录
            {
                path: 'teamgameRecord', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teamgameRecord'], resolve) },
                ]
            },
            //公告中心
            {
                path: 'noticelist', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/noticelist'], resolve) },
                ]
            },
            //公告详情
            {
                path: 'noticedetail/:noticeids', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/noticedetail'], resolve) },
                ]
            },
            //设置
            {
                path: 'setting', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/setting'], resolve) },
                ]
            },
            //消息中心
            {
                path: 'messagecenter', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/messagecenter'], resolve) },
                ]
            },
            //开奖历史
            {
                path: 'history', component: home, children: [
                    { path: '/', component: resolve => require(['./view/lottery/history'], resolve) },
                ]
            },
            //彩票列表
            {
                path: '/lotterylist/:roomId/:roomName', component: home, children: [
                    { path: '/', component: resolve => require(['./view/lottery/lotterylist'], resolve) },
                ]
            },
            //投注弹窗
            {
                path: 'betmodal', component: home, children: [
                    { path: '/', component: resolve => require(['./view/lottery/betmodal'], resolve) },
                ]
            },
            // {
            //     path: 'cqssc', component: home, children: [
            //         { path: '/', component: resolve => require(['./view/lottery/cqssc'], resolve) },
            //     ]
            // },
            //修改昵称
            {
                path: 'setname',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/setname'], resolve) },
                ]
            },
            //修改密码
            {
                path: 'setpwd',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/setpwd'], resolve) },
                ]
            },
            //修改资金密码
            {
                path: 'setmoney/:zijin/:probrom',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/setmoney'], resolve) },
                ]
            },
            //银行卡管理
            {
                path: 'bankcar/:accountPwd',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/bank'], resolve) },
                ]
            },
            //银行卡管理
            {
                path: 'fondpwd/:login',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/fondpwd'], resolve) },
                ]
            },
            //绑定手机
            {
                path: 'bindphoto',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/bindphoto'], resolve) },
                ]
            },

            //绑定微信
            {
                path: 'bindwx/:wxcode',

                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/bindwx'], resolve) },
                ]
            },
            //绑定微信
            {
                path: 'bindzhifu/:accountPwd',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/bindzhifu'], resolve) },
                ]
            },
            //通过短信找回密码
            {
                path: 'mesgfind',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/mesgfind'], resolve) },
                ]
            },
            // //关于我们
            {
                path: 'aboutme',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/about'], resolve) },
                ]
            },
            //登陆注册
            {
                path: 'login',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/login/login'], resolve) },
                ]
            },
            //绑定手机弹窗
            {
                path: 'bindmobil',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/login/bindmobil'], resolve) },
                ]
            },
            //绑定已有账号
            {
                path: 'bindhaved',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/login/bindhaved'], resolve) },
                ]
            },
            //绑定页
            {
                path: 'bindpage',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/login/bindpage'], resolve) },
                ]
            },
            //通过资金密码找回登录密码
            {
                path: 'funzhijing/:zhijinid',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/funzhijing'], resolve) },
                ]
            },
            //通过保密问题找密码
             {
                  path: 'funprobrom/:param',
                  component: home,
                  children: [
                         { path: '/', component: resolve => require(['./view/set/funprobrom'], resolve) },
                  ]
              },
            //提现详情
            {
                path: 'paymoney/:cashAccount/:cashFlagName/:cashMoney/:cashStatus/:createDate/:remark/:userId/:id',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/user/paymoney'], resolve) },
                ]
            },
            //添加银行卡
            {
                path: 'addcar',

                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/addcar'], resolve) },
                ]
            },
            //qq钱包
            {
                path: 'payqq/:payFlag/:maxMoney/:minMoney',

                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/payqq'], resolve) },
                ]
            },
            // voucherzhi
            {
                path: 'voucherzhi/:payFlag/:maxMoney/:minMoney',

                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/voucherzhi'], resolve) },
                ]
            },
            //设置密保
            {
                path: 'setprobrom/:question',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/setprobrom'], resolve) },
                ]
            },
            //支付宝转银行卡
            {
                path: 'tobank/:payFlag',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/tobank'], resolve) },
                ]
            },
            //银行卡转账
            {
                path: 'banktomoney/:payFlag',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/banktomoney'], resolve) },
                ]
            },
            //银行转账成功弹窗
            {
                path: 'banksucces',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/banksucces'], resolve) },
                ]
            },
            //充值二维码
            {
                path: 'erweima',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/erweima'], resolve) },
                ]
            },
            //消息
            {
                path: 'message',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/user/news/message.vue'], resolve) },
                ]
            },
            //发送邮件
            {
                path: 'sendemail',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/user/news/sendemail.vue'], resolve) },
                ]
            },
            //聊天详情页
            {
                path: 'newspage/:talkUserName/:talkUserId',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/user/news/newspage.vue'], resolve) },
                ]
            },
            //团队账变详情
            {
                path: 'teambilldetail/:afterSafeMoney/:beforeSafeMoney/:changeSafeMoney/:changeType/:createDate/:remark/:userName/:userTypeStr', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teambilldetail'], resolve) },
                ]
            },
            //团队充值详情
            {
                path: 'teampaydetail/:createDate/:userName/:money/:orderSn/:payCashType/:status/:showName', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teampaydetail'], resolve) },
                ]
            },
            //团队游戏详情
            {
                path: 'teamgamedetail/:orderSn', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/teamgamedetail'], resolve) },
                ]
            },
             //团队游戏详情下注详情
            {
                path: 'betinput/:order/:playType', component: home, children: [
                    { path: '/', component: resolve => require(['./view/user/betinput'], resolve) },
                ]
            },
            //推广二维码
            {
                path: 'erweimaurl',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/user/erweimaurl'], resolve) },
                ]
            },
            //找回资金密码
            {
                path: 'fontmoneypwd/:probrom',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/fontmoneypwd'], resolve) },
                ]
            },
            //通过短信找回资金密码
            {
                path: 'msgfindmoney/:fineid',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/msgfindmoney'], resolve) },
                ]
            },
            //重置资金密码
            {
                path: 'restmoneypwd',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/restmoneypwd'], resolve) },
                ]
            },
            //通过登录密码找回资金密码
            {
                path: 'loginsetmoney/:goid',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/loginsetmoney'], resolve) },
                ]
            },
            //重置资金密码
            {
                path: 'restloginpwd',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/restloginpwd'], resolve) },
                ]
            },
            //找回密保
            {
                path: 'fontquestion',
                component: home,
                children: [
                    { path: '/', component: resolve => require(['./view/set/fontquestion'], resolve) },
                ]
            },
                //登录页面
                {
                  path: 'loginpage',
                  component: home,
                  children: [{
                    path: '/',
                    component: resolve => require(['./view/login/loginpage'], resolve)
                  }, ]
                },
        ]
    }
]
