
var init = new Init();
init.messageListener();

console.log('chrome');
console.log('watchdog');
setTimeout(function(){
    init.sendMessage('start');
}, 10000);