/*
* 过虑器
* */
var filters={
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
  //转换时间成分秒
  remaining(countNum){
    if(countNum>=0){
      let hours   = parseInt(countNum / 60 / 60 % 24)
      let minute = parseInt(countNum / 60 % 60);
      let second = parseInt(countNum % 60);
      if(hours<10){
        hours = '0' + hours ;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
      if(hours>0){
        return  hours+':'+ minute + ':' + second ;
      }else{
        return  + minute + ':' + second ;
      }
      return  + minute + ':' + second ;
    }
  },

  //是否有选择-添加游戏
  isSel(val){

    return val.count != val.selectedCount?require('../assets/images/check-no-select.png'):require('../assets/images/check-select.png');
  },
  //是否有选择-添加玩法
  isSelPlays(val){

    return val.count != val.selectCount?require('../assets/images/check-no-select.png'):require('../assets/images/check-select.png');
  },
  //展开与收缩
  showAndShrink(val){
    return val?require('../assets/images/down-icon.png'):require('../assets/images/up-icon.png');
  },
  //日期过滤
  filterDate(val){
    return val.split(" ")[0];
  },
  //时间过滤
  filterTime(val){
    return val.split(" ")[1]
  },
  winMoney(val){
    if(val !=null){
      return val;
    }else {
      return 0 ;
    }
  }
}
export default filters;
