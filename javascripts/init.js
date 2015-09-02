function Init() {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    messageListener && messageListener(message);
  });
}

Init.prototype = {
  sendMessage: function(type,callback) {
    chrome.extension.sendMessage({msg: type},function(){
      callback && callback();
    });
  },

  messageListener:function(){
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
      if(message.msg == 'cookies'){
        window.location.reload(true);
      }
      messageListener && messageListener(message);
    });
  }
};
