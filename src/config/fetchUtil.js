import { baseUrl } from './env'
import  methods  from './methods'

export default async(url = '', data = {}, type = 'POST', method = 'fetch') => {
  let dataStr = '';
  let sign  = '';

  type = type.toUpperCase();
  url = baseUrl + url;

  //参数排序
  data = methods.objKeySort(data);
  //数据拼接字符串
  Object.keys(data).forEach(key => {

    dataStr += key + '=' + data[key] + '&';
  })

  //md5加密
  if (dataStr !== '') {
    dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
    sign = methods.getmd5(dataStr);
  }
   data.sign = sign;
   data = methods.getParam(data);

  if (window.fetch && method == 'fetch') {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/json;charset=UTF-8");
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
