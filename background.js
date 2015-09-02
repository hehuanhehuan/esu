var task = {};
var last_watchdog_time = null;

var task_start_time = null;

var settings = {running : false};

var running = false;

var api = null;

setTimeout(watchDog, 1000);

function getTask(callback){
  reloadSettings(function () {

    //extensionVersion(function(){
      api = api ? api : new RemoteApi(settings);
      api.getTask(function(data){
        if(data.success){
          task_start_time = new Date().getTime();
          task = data.data;
          task.valid = false;
          cookiesStr(function(){
            goReceiptList(callback);
          });

        }else{
          notify('get task fail',function(){
                closeAllWindows();
          });
        }
      },function(){
        notify('get task api error',function(){
          closeAllWindows();
        });
      });

    //});
  });
}

function extensionVersion(callback){
  api = new RemoteApi(settings);
  api.checkVersion(function (data) {
    if(data.success == 1){
      var version = data.data;
      var current_version = chrome.runtime.getManifest().version;
      if(version && current_version && (version > current_version)){
        notify('需要更新版本');
        extensionsAutoUpdateCheck(callback);
      }else{
        notify('无更新版本');
        callback && callback();
      }

    }else{
      setTimeout(function () {
        extensionVersion(callback);
      },30000);
    }
  }, function () {
    notify('版本接口请求失败 10s后关闭');
    setTimeout(function(){
      last_watchdog_time = new Date().getTime();

      closeAllWindows();
    }, 10000);
  });
}

function extensionsAutoUpdateCheck(callback){
  chrome.runtime.requestUpdateCheck(function(status, details){
    //"throttled", "no_update", or "update_available"

    if(status == 'update_available'){
      notify('rear 自动升级版本' + details.version);
      setTimeout(function () {
        last_watchdog_time = new Date().getTime();
        closeAllWindows();
      },3000);
    }else{
      console.log('rear NO UPDATE');
      notify('rear NO UPDATE');
      callback && callback();
    }

  });
}

function randNum(max) {
  var str_radom = 0;
  do{
    str_radom = Math.floor(Math.random() * max);
  }while(!( str_radom < max));

  return str_radom;
}

function commentData(callback){
  task.comment = data_comments[randNum(data_comments.length)].body;
  task.tag = data_tags[randNum(data_tags.length)].tag;
  commentComplate(callback);
}

function commentComplate(callback){
  console.log(task.comment);
  console.log('去除空。处理已知屏蔽词');
  var re_str = ' ';
  task.comment = task.comment.replace(new RegExp(re_str,'gm'),'');
  task.comment = task.comment.toUpperCase();
  var strs = ['天瘦','买卖','天猫','MD','一B','TM','DIY','AV','QQ群','C4','——','~','～','TMD','X东','TB','T猫','A片'];
  for(var i in strs){
    var str = strs[i];
    var rep = new Array( str.length + 1 ).join( '?' );
    task.comment = task.comment.replace(new RegExp(str,'gm'),rep);
  }

  var length=checksum(task.comment);
  console.log(length);
  if(length == 1){
    task.comment += " ";
  }
  length=checksum(task.comment);
  if(length < 10){
    console.log("length < 10");
    do{
      var position = Math.round(length * Math.random());
      var position_valid = false;
      if(position>0 && position<length){
        position_valid=true;
      }
    }while(!position_valid);
    task.comment=task.comment.substr(0,position)+"?"+task.comment.substr(position);
    commentComplate();
  }else{
    callback && callback();
  }
}

//功能：统计包含汉字的字符个数
//说明：汉字占1个字符，非汉字占0.5个字符
function checksum(chars){
  var sum = 0;
  for (var i=0; i<chars.length; i++)
  {
    var c = chars.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))
    {
      sum++;
    }
    else
    {
      sum+=2;
    }
  }

  return Math.floor(sum/2);
}

function goReceiptList(){
  setCookies(function(){
    tabCreate({
      url: 'http://order.jd.com/center/list.action?s=128',
      selected:true
    },function(){

    });
  });
}

function goCommentList(){
  setCookies(function(){
    tabCreate({
      url: 'http://club.jd.com/mycomments.aspx',
      selected:true
    },function(){

    });
  });
}


function goComment(business_oid){
  setCookies(function(){
    tabCreate({
      url: 'http://club.jd.com/JdVote/TradeComment.aspx?ruleid=' + business_oid,
      selected:true
    },function(){

    });
  });
}

function reloadSettings(callback) {
  chrome.storage.local.get(null, function(data) {
    settings = data.settings;
    console.log(settings);
    running = data.running;
    callback && callback();
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chromeMessageListener && chromeMessageListener(request, sender);
  sendResponse && sendResponse();
});

var chromeMessageListener = function(request, sender){
  console.log('onMessage');
  console.log(request);
  var msg = request.msg;
  if( ! msg){
    return false;
  }
  resetWatchDog();
  switch (msg){
    case 'watchdog':
          resetWatchDog();
          break;
    case 'login':
        if(task.valid){
          goReceiptList();
        }else{
          reportSuccess('cookies unvalid');
        }

          break;
    case 'valid':
        task.valid = true;
          break;
    case 'reload_settings':
      reloadSettings();
      break;
    case 'start':
      getTask();
      break;
    case 'product_comment':
        setCookies(function(){
          chrome.tabs.sendMessage(sender.tab.id,{msg:'product_comment'});
        });
        break;
    case 'comment_submit':
      setCookies(function(){
        chrome.tabs.sendMessage(sender.tab.id,{msg:'comment_submit'});
      });
      break;
    case 'set_cookies':
      setCookies(function(){
        chrome.tabs.sendMessage(sender.tab.id,{msg:'cookies'});
      });
      break;
    case 'reset_cookies':
      setCookies(function(){
        chrome.tabs.sendMessage(sender.tab.id,{msg:'reset_cookies'});
      });
      break;
    case 'all_receipt':
      goCommentList();
      break;
    case 'all_comment':
        var success_result = request.result ? request.result : null;
      reportSuccess(success_result);
      break;
    case 'go_comment':
      var business_oid = request.business_oid;
      if(business_oid){
        goComment(business_oid);
      }else{

      }
      break;
    case 'comment_success':
      var business_oid = request.business_oid;
      if(business_oid){
        goCommentList();
      }else{

      }
      break;
    case 'comment_data':
      commentData(function(){
        chrome.tabs.sendMessage(sender.tab.id,{msg:'comment_data',body:task.comment,tag:task.tag});
      });
      break;
    default :
      break;
  }
};

function reportSuccess(result){
  api.reportSuccess(task.id, result,function(data){
    if(data.success){
      closeAllWindows();
    }else{
      setTimeout(function () {
        last_watchdog_time = new Date().getTime();
        reportSuccess(result);
      },20000);
    }
  },function(){
    setTimeout(function () {
      last_watchdog_time = new Date().getTime();
      reportSuccess(result);
    },10000);
  });
}

function cookiesStr(callback){
  var cookies = task.cookies;
  if(cookies){
    var length = cookies.length;
    task.cookies_str = '';
    while(length--){
      var fullCookie = cookies[length];
      var newCookie = {};
      newCookie.name = fullCookie.name;
      newCookie.value = fullCookie.value;
      //console.log(newCookie);
      task.cookies_str += newCookie.name + '=' + newCookie.value ;
      if(length != 1){
        task.cookies_str += '; ';
      }

    }
  }
  callback && callback();
}

function setCookies(callback){
  var cookies = task.cookies;
  console.log(cookies);
  console.log("set cookies");
  if(cookies){
    var length = cookies.length;
    while(length--){
      var fullCookie = cookies[length];
      //seesion, hostOnly 值不支持设置,
      var newCookie = {};
      var host_only = fullCookie.hostOnly == "false" ? false : true;
      newCookie.url = "http" + ((fullCookie.secure) ? "s" : "") + "://" + fullCookie.domain + fullCookie.path;
      newCookie.name = fullCookie.name;
      newCookie.value = fullCookie.value;
      newCookie.path = fullCookie.path;
      newCookie.httpOnly = fullCookie.httpOnly == "false" ? false : true;
      newCookie.secure = fullCookie.secure == "false" ? false : true;
      if(!host_only){ newCookie.domain = fullCookie.domain; }
      if (fullCookie.session === "true" && newCookie.expirationDate) { newCookie.expirationDate = parseFloat(fullCookie.expirationDate); }
      //console.log(newCookie);
      chrome.cookies.set(newCookie);
    }
  }
  console.log("set cookies success");
  callback && callback();
}

function closeAllWindows(callback) {
  console.log('run closeAllWindows');
  chrome.windows.getAll(function (windows) {
    console.log('chrome.windows.getAll');
    var length = windows.length;
    var i = 0, index = 0;
    for (; i < length; i++) {
      if (windows[i].type === 'popup') {
        index++;
        if (index == length) {
          callback && callback();
        }
      }
      else {
        chrome.windows.remove(windows[i].id, function () {
          index++;
          if (index == length) {
            callback && callback();
          }
        });
      }
    }
  });
}

function tabCreate(tab,response){
  chrome.tabs.create(tab, function(data){
    chrome.tabs.query({active:false}, function(tabs) {
      if(tabs){
        for(var i=0;i<tabs.length;i++){
          var remove_tab = tabs[i];
          chrome.tabs.remove(remove_tab.id, function () {

          });
        }
      }
    });
    response && response();
  });
}

function notify(message, func) {
  var opt = {
    type: 'basic',
    title: '',
    message: message,
    iconUrl: 'icon.png'
  };

  chrome.notifications.create('', opt, function (id) {
    setTimeout(function () {
      chrome.notifications.clear(id, function () {
        func && func();
      });
    }, 10000);
  });
}
