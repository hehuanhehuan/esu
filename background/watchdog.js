function watchDog() {
  console.log("entrance watchdog");
  if (settings.running) {
    var time = new Date().getTime();
    console.log(parseInt((time - last_watchdog_time)/1000) +"秒");
    if (time - last_watchdog_time > 60000) {

      if(time - last_watchdog_time > 250000){
        console.log("250 seconds unactive");
        closeAllWindows();
      }

      if(task_start_time && (time - task_start_time > 600000)){
        closeAllWindows();
      }

      chrome.tabs.query({active: true, highlighted: true}, function(tabs) {
        if (tabs.length > 0) {
          var current_url = tabs[0].url;
          console.log(current_url);
          last_watchdog_time = time;
          if(current_url.indexOf('jd.com')!=-1){
            if(current_url.indexOf('passport.jd.com')==-1 &&
                current_url.indexOf('order.jd.com/center/list.action?s=128')==-1 &&
                current_url.indexOf('club.jd.com/mycomments.aspx')==-1
            ){
              goReceiptList();
            }else{
              chrome.tabs.reload(tabs[0].id, function() {
                //success
              });
            }
          }
        }
      });

    }
  }

  setTimeout(watchDog, 1000);
}

function resetWatchDog(callback){
  last_watchdog_time = new Date().getTime();
  callback && callback();
}