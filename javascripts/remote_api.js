function RemoteApi(settings) {
  settings.env = settings.env ? settings.env : 'pro';

  switch (settings.env){
    case 'pro':
          this.server_host = 'https://disi.se';
          break;
    case 'dev':
          this.server_host = 'http://192.168.3.68:91';
          break;
    case 'test':
          this.server_host = 'http://b22.poptop.cc';
          break;
    default :
          this.server_host = '';
          break;
  }

  this.request_data = {
    host_id: settings.computer_name ? settings.computer_name : null,
    user: settings.user ? settings.user : null,
    version: chrome.runtime.getManifest().version,
    app_secret: 'F$~((kb~AjO*xgn~'
  };

  this.urls = {
    getTask : '/index.php/Admin/clientApi/get_receipt_comment_tasks',
    reportSuccess : '/index.php/Admin/clientApi/receipt_comment_tasks_success',
    reportFail : '/index.php/Admin/clientApi/receipt_comment_tasks_fail',
    checkVersion: '/index.php/Admin/ExtensionApi/version'
  }
}

RemoteApi.prototype = {

  ajax: function(params,done,fail){
    $.ajax(params).done(done && done()).fail(fail && fail());
  },

  get: function (url, params, done, fail) {
    $.getJSON(url,params,function(data,textStatus,jqXHR){
      done && done(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      fail && fail();
    });
  },

  post: function (url, params, done, fail) {
    $.post(url, params, function(data) {
      done && done(data);
    },'Json').fail(function(jqXHR, textStatus, errorThrown) {
      fail && fail();
    });
  },

  getTask: function(done_callback, fail_callback) {
    var url = this.server_host + this.urls.getTask;

    this.post(url,this.request_data,done_callback,fail_callback);
  },



  reportFail: function(id, result, done_callback, fail_callback) {
    var url = this.server_host + this.urls.reportFail;

    var params = this.request_data;
    params.task_id = id;
    params.result = result;

    this.post(url,params,done_callback,fail_callback);
  },

  reportSuccess: function(id, result, done_callback, fail_callback) {
    var url = this.server_host + this.urls.reportSuccess;

    var params = this.request_data;
    params.task_id = id;
    params.result = result;

    this.post(url,params,done_callback,fail_callback);
  },

  checkVersion: function (done_callback, fail_callback) {
    var url = this.server_host + this.urls.checkVersion;
    var params = this.request_data;
    params.appid = chrome.runtime.id;
    this.get(url, params, done_callback, fail_callback);
  }
	
};