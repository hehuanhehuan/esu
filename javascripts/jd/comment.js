var init = new Init();
var task = {};
var messageListener = function (message) {
    if(message.msg == 'comment_data'){
        task.body = message.body;
        task.tag = message.tag;
        init.sendMessage('watchdog');
        product_comment();
    }
    else if(message.msg == 'comment_submit'){
        commentSubmit(function () {

        },true);
    }else if(message.msg == 'product_comment'){
        commentBox(true);
    }
};
init.messageListener();


var orders = $('.pro-info');
if(orders.length > 0){
    var order = orders.eq(0);
    console.log(order);
    var business_oid = order.attr('oid');
    var product_id = order.attr('pid');
    console.log(business_oid);
    console.log(product_id);
    if(business_oid){
        console.log('comment business_oid');
        //chrome.extension.sendMessage({msg: 'go_comment',business_oid:business_oid});
        //init.sendMessage('comment_data');
        setTimeout(function () {
            init.sendMessage('watchdog');
            commentBox();
        },5000);
    }else{
        init.sendMessage('set_cookies');
    }
}
else{
    console.log('已全部评价');
    init.sendMessage('all_comment');
    chrome.extension.sendMessage({msg: 'all_comment',result:'receipt,comments all finish'},function(){
        callback && callback();
    });
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation.type);
        console.log(mutation);
        if(mutation.type == 'childList'){
            if(mutation.target.className === 'comment-box prompt01'){
                if(mutation.addedNodes.length > 0){
                    var prompt01 = $('div[class="comment-box prompt01"]:visible');
                    console.log('评价商品');

                    init.sendMessage('comment_data');
                }
            }
        }
    })
});
observer.observe(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true
});
