import crypto from 'crypto'
import {
  baseUrl
} from './env'
//定义公共的方法
var methods = {
  /*
   *参数说明：
   *opts: {'可选参数'}
   **method: 请求方式:GET/POST,默认值:'GET';
   **url:    发送请求的地址, 默认值: 当前页地址;
   **data: string,json;
   **async: 是否异步:true/false,默认值:true;
   **cache: 是否缓存：true/false,默认值:true;
   **contentType: HTTP头信息，默认值：'application/json';
   **success: 请求成功后的回调函数;
   **error: 请求失败后的回调函数;
   */
  unitAjax: function (type, url, data, success, failed, async = 'true') {
    url = baseUrl + url;
    var sign = '';
    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    var type = type.toUpperCase();

    // 用于清除缓存
    var random = Math.random();

    //获取用户id
    data.userId = methods.getValue("userId") == null ? "" : methods.getValue("userId");
    //获取token
    data.token = methods.getValue("token") == null ? "" : methods.getValue("token");

    //获取其他参数
    data = methods.getParam(data);

    //参数排序
    data = methods.objKeySort(data);

    if (typeof data == 'object') {
      var str = '';
      //拼接字符串
      for (var key in data) {
        if (data[key] != "") {
          str += key + '=' + data[key] + '&';
        }
      }
      //md5加密
      if (str !== '') {
        str = str + "appKey=6375db1d-a1cb-11e7-9d90-d89d672b2f4c";

        //md5加密 获取验签
        sign = methods.getmd5(str);

      }
      data.sign = sign;
    }

    if (type == 'GET') {
      if (data) {
        xhr.open('GET', url + '?' + data, true);
      } else {
        xhr.open('GET', url + '?t=' + random, true);
      }
      xhr.send();

    } else if (type == 'POST') {
      xhr.open('POST', url, async);
      // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
      xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(data));
    }

    // 处理返回数据
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          success(JSON.parse(xhr.responseText));
        } else {
          if (failed) {
            failed(xhr.status);
          }
        }
      }
    }
  },
  //转化图片
  convertCanvasToImage: function (canvas) {
    //新Image对象，可以理解为DOM
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  },
  /**
   * 存储localStorage
   */
  setStore: function (name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
  },

  /**
   * 获取localStorage
   */
  getStroe: function (name) {
    if (!name) return;
    return window.localStorage.getItem(name);
  },
  /**
   *删除localStorage
   */
  removeStore: function (name) {
    if (!name) return;
    window.localStorage.removeItem(name);
  },

  /**
   *数组中删除指定值元素
   */
  removeByValue: function (arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        return arr;
      }
    }
  },
  //->设置
  setValue: function (options) {
    var _default = {
      name: null,
      value: null,
      expires: new Date(new Date().getTime() + (365 * 1000 * 60 * 60 * 24)),
      path: '/',
      domain: ''

    };
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        _default[key] = options[key];

      }

    }
    document.cookie = _default.name + "=" + escape(_default.value) + ";expires=" + _default.expires.toGMTString() + ";path=" + _default.path + ";domain=" + _default.domain;

  },

  //->获取
  getValue: function (name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
      return unescape(arr[2]);

    }
    return null;

  },

  //->删除
  removeValue: function (options) {
    var _default = {
      name: null,
      path: '/',
      domain: ''

    };
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        _default[key] = options[key];

      }

    }
    if (methods.getValue(_default.name)) {
      document.cookie = _default.name + "= ;path=" + _default.path + ";domain=" + _default.domain + ";expires=Fri,02-Jan-1970 00:00:00 GMT";

    }

  },
  /**
   *判断数组含有某个元素
   */
  contains(arr, obj) {
    let i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },
  //找出两个数组相同的元素
  filterData(a, b) { //循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
    var result = new Array();
    var c = b.toString();
    for (var i = 0; i < a.length; i++) {
      if (c.indexOf(a[i].toString()) > -1) {
        for (var j = 0; j < b.length; j++) {
          if (a[i] == b[j]) {
            result.push(a[i]);
            break;
          }
        }
      }
    }
    return result;
  },
  /*
   * 对象排序 a-z
   *
   */
  objKeySort(obj) { //排序的函数
    let newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) { //遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj; //返回排好序的新对象
  },

  /**
   * 跳转url
   */
  goURL(url) {
    this.$router.push({
      path: url
    });
  },

  /*
   * 阻止滑动击穿事件
   * */
  bodyEl: document.body,
  top: 0,
  stopBodyScroll(isFixed) {
    if (isFixed) {
      this.top = window.scrollY
      this.bodyEl.style.position = 'fixed'
      this.bodyEl.style.top = -top + 'px'
    } else {
      this.bodyEl.style.position = ''
      this.bodyEl.style.top = ''
      window.scrollTo(0, top) // 回到原先的top
    }
  },
  /*
   * md5 加密
   * str 加密字符串
   * */
  getmd5(str) {
    let md5 = crypto.createHash("md5");
    md5.update(str);
    let a = md5.digest("hex");
    return a; //47bce5c74f589f4867dbd57e9ca9f808
  },

  /*
   * 组装参数
   *
   * */
  MergeObj(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) {
        o[p] = unescape(n[p]);
      }
    }
  },
  getParam(iOptions) {
    let cParams = {
      "versionCode": "1510",
      "deviceInfo": "Redmi+Note+4X",
      "appId": "7c68da93a1cb11e79d90d89d672b2f4c",
      "requestId": this.getrandom(),
    }
    this.MergeObj(cParams, iOptions, false);
    return cParams;
  },

  /*
   * 获取随机数32位
   * */
  getrandom() {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let nums = "";
    for (let i = 0; i < 32; i++) {
      let id = parseInt(Math.random() * 61);
      nums += chars[id];
    }
    return nums;
  },

  /*
   * 时间转换器
   *
   * */
  formatDuring(mss) {

    let dd = parseInt(mss / 60 / 60 / 24); //计算剩余的天数
    let hh = parseInt(mss / 60 / 60 % 24); //计算剩余的小时数
    let mm = parseInt(mss / 60 % 60); //计算剩余的分钟数
    let ss = parseInt(mss % 60); //计算剩余的秒数

    if (dd > 0) {
      return methods.checkTime(dd) + "天" + methods.checkTime(hh) + ":" + methods.checkTime(mm) + ":" + methods.checkTime(ss);
    } else if (hh > 0) {
      return methods.checkTime(hh) + ":" + methods.checkTime(mm) + ":" + methods.checkTime(ss);
    } else {
      return methods.checkTime(mm) + ":" + methods.checkTime(ss);
    }
  },
  //将0-9的数字前面加上0，例1变为01
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  //资金密码弹框输入框类型装换
  onshow() {
    document.getElementsByClassName('vux-prompt-msgbox')[0].type = 'password';
    document.getElementsByClassName('vux-prompt-msgbox')[0].addEventListener('click', function () {
      this.focus()
    })
  },
  //  电话号码中间*号
  toTel(str) {
    let start = str.slice(0, 3);
    let end = str.slice(-4);
    return `${start}******${end}`;
  },
  //银行卡
  tobank(str) {
    let start = str.slice(0, 4);
    let end = str.slice(-3);
    return `**********${end}`;
  },
  // 隐藏名字
  tousername(str) {
    if (str.length < 3) {
      let end = str.slice(-1);
      return `*${end}`;
    } else if (str.length == 3) {
      let end = str.slice(-1);
      return `**${end}`;
    } else {
      let end = str.slice(-2);
      return `**${end}`;
    }
  },
  //支付宝
  tozhifubao(str) {
    if (str.indexOf("@") >= 0) {
      let end = str.slice(-11);
      return `*****${end}`;
    } else {
      let start = str.slice(0, 3);
      let end = str.slice(-4);
      return `${start}******${end}`;
    }

  },
  //删除数组指定的数
  removeArrVal(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  datefmt(input, fmtstring) {
    var mydate = new Date(input);
    var y = mydate.getFullYear();
    var m = mydate.getMonth() + 1;
    var d = mydate.getDate();
    var h = mydate.getHours();
    var mi = mydate.getMinutes();
    var s = mydate.getSeconds();

    if (fmtstring == 'YYYY-MM-DD') {
      return y + '-' + m + '-' + d;
    }
    if (fmtstring == 'YYYY-MM-DD HH:mm:ss') {
      return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
    }
  },
  //获取当前时间，格式YYYY-MM-DD
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //获取一个月前时间，格式YYYY-MM-DD
  getMonthFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth();
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (month == 0) {
      year = year - 1;
      month = 12;
    }

    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  //app 带来参数
  urlparams(url) {
    url = url || window.location.href;
    var data = {};
    var pos = url.indexOf('?');
    if (pos != -1) {
      var query = url.substring(pos);
      if (query) {
        var ll = query.substring(1).split('&');
        var i = 0;
        for (; i < ll.length; i++) {
          var arr = ll[i].split('=');
          if (arr.length == 2)
            data[arr[0]] = decodeURI(arr[1]);
        }
      }
    }
    return data;
  },
  setUrlCookie(userId, token) {
    methods.setValue({
      name: "userId",
      value: userId,
    });
    methods.setValue({
      name: "token",
      value: token,
    });
  },
  //获取当前的时间 秒
  getSeconds() {
    return Date.parse(new Date()) / 1000;
  },
  //
  goLogin() {
    this.$router.push('/loginpage');
  },

  //玩法组装
  playsData(one) {
    for (var i = 0; i < one.length; i++) {
      var two = one[i].childClassList;
      for (var f = 0; f < two.length; f++) {
        var three = two[f].playList;
        var result = [];
        var temp = [];
        var row = 0;
        var count = 0;
        for (var j = 0; j < three.length; j++) {
          count += three[j].size;
          if (j > 0 && count >= 12) {
            row++
            if (row == 3 && count >= 12) {
              row = 0;
              if (count == 12) {
                temp.push(three[j]);
                result.push(temp);
                temp = [];
                count = 0;
              } else {
                result.push(temp);
                temp = [];
                temp.push(three[j]);
                count = three[j].size;
              }
            } else {
              if (count == 12) {
                count = 0
              } else {
                count = three[j].size;
              }
              temp.push(three[j]);
            }
          } else {
            temp.push(three[j]);
          }
          if (j + 1 == three.length && temp != "") {
            result.push(temp);
          }
        }
        three.splice(0, three.length)
        three.push(result);
      }
    }
    return one;
  },

  //单式
  util_unique(v, reg, digit, itemsort, baohao) {
    if (digit == undefined || digit == null) {
      digit = 1;
    }

    var sszz = new Array();
    var titems = {};
    var titem;
    while ((titem = reg.exec(v)) != null) {
      var key = titem[0];
      if (itemsort) {
        if (digit == 1) {
          key = key.match(/./g).sort().join('');
        } else if (digit == 2) {
          key = key.match(/.{2}/g).sort().join(' ');
        } else {
          key = key.match(/./g).sort().join('');
        }
      } else {
        if (digit == 2) {
          key = key.match(/.{2}/g).join(' ');
        }
      }
      if (!titems[key]) {
        if (baohao) {
          // 去除豹子号如222，用户前三 任选三混合组选 前二
          if (!(key.charAt(0) == key.charAt(1) && key.charAt(0) == key.charAt(2) && key.charAt(1) == key.charAt(2))) {
            titems[key] = 1;
            sszz.push(key);
          }
        } else {
          titems[key] = 1;
          sszz.push(key);
        }
      }
    }
    return sszz;
  },

  /**
   * 禁止手机浏览器拖动
   */
   stopDefault(){
    window.ontouchmove = function(e){
      e.preventDefault && e.preventDefault();
      e.returnValue = false;
      e.stopPropagation && e.stopPropagation();
      return false;
    }
  document.body.style.height   = '100%';
  document.body.style.overflow = 'hidden';
  },
  //获取url 参数
  urlparams (url){
    url = url || document.location.search;
    var data = {};
    var pos = url.indexOf('?');
    if(pos != -1){
      var query = url.substring(pos);
      if(query){
        var ll = query.substring(1).split('&');
        var i = 0;
        for(; i < ll.length; i++){
          var arr = ll[i].split('=');
          if(arr.length == 2)
            data[arr[0]] = decodeURI(arr[1]);
        }
      }
    }
    return data;
  }
}

export default methods;
