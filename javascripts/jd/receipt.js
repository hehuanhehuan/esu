var init = new Init();
init.sendMessage('valid');
init.messageListener();

var orders = $('.tr-th').find('a[name="orderIdLinks"]');
if(orders.length > 0){
    var order = orders[0];
    console.log(order);
    var business_oid = order.innerText;
    console.log(business_oid);
    if(business_oid){
        orderReceipt(business_oid);
    }else{
        init.sendMessage('set_cookies');
    }
}
else{
    console.log('已全部收货');
    init.sendMessage('all_receipt');
}

function orderReceipt(business_oid){
    var order_confirm = $('#operate'+business_oid).find('a.order-confirm');
    console.log(order_confirm);
    if(order_confirm){
        confirmDeliver(business_oid);
    }else{
        init.sendMessage('set_cookies');
    }
}

function confirmDeliver(business_oid){
    var url = "http://odo.jd.com/oc/toolbar_confirmDeliver?action=confirmDeliver&orderid="+ business_oid;
    console.log(url);
    $.ajax({
        type:"GET",
        url:url,
        data:"",
        dataType:"json",
        timeout: 6e3,
        success: function(e) {
            console.log(e);
            setTimeout(function(){
                //refresh

                init.sendMessage('set_cookies');
            },3000);
        },
        error: function (e) {
            console.log('error');
            console.log(e);
            var message = e.responseText ? e.responseText : '';
            //responseText: "{html:"抱歉! 订单的状态不能执行该业务"}";
            if(message.indexOf('抱歉') != -1){
                setTimeout(function(){
                    init.sendMessage('watchdog');
                },3000);
            }else{
                setTimeout(function () {
                    init.sendMessage('set_cookies');
                }, 3000);
            }
        }
    })
}

