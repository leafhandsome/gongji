//cookie封装库
var cookieRender = {
    //->设置
    setValue: function (options) {
          var _default = {
                    name: null,
                   value: null,
                    expires: new Date(new Date().getTime() + (365*1000* 60 * 60 * 24)),
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
    getValue:function (name) {
   var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) {
                    return unescape(arr[2]);
            
        }
            return null;
        
    },
    
    //->删除
  removeValue:  function (options) {
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
      if (cookieRender.getValue(_default.name)) {
                    document.cookie = _default.name + "= ;path=" + _default.path + ";domain=" + _default.domain + ";expires=Fri,02-Jan-1970 00:00:00 GMT";
        
        }
        
    }   
}
export default cookieRender;
//-->设置cookie
// cookieRender.set({
//    name: '',
//         value: ''

// });
// //-->获取cookie
// cookieRender.get([key]);
// //-->删除cookie
// cookieRender.remove({
//     name: ''
// }); 