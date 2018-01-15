/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl = 'http://shengshicai.f3322.net:9097';

if (process.env.NODE_ENV == 'development') {
  baseUrl = "http://192.168.1.3:9097"


} else if (process.env.NODE_ENV == 'production') {
  imgBaseUrl = 'http://shengshicai.f3322.net:9097';
  baseUrl    = 'http://shengshicai.f3322.net:9097'
}

export {
    baseUrl,
    routerMode,
    imgBaseUrl,
}
