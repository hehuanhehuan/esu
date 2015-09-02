//订单评价
var task = {};
var init = new Init();
var messageListener = function (message) {
	if(message.msg == 'comment_data'){
		task.body = message.body;
		task.tag = message.tag;
		orderComment();
	}
	else if(message.msg == 'comment_submit'){
		commentSubmit(function () {

		},true);
	}
};
init.messageListener();
init.sendMessage('comment_data');

function orderComment(){

}

function commentScore(){
	console.log("四项评分");
	if($('div.score-succ').is(':visible')){
		console.log("评价成功了，observe中会处理");
	}else{
		var div_score = $('div[class="score"]');
		if(div_score.length > 0){
			console.log("四项评分");
			var $span_comments = $('div[class="score"] > dl[class="ev-list"] > dd > span[class="commstar"]');
			if($span_comments.length > 0){
				for(var i = 0;i < $span_comments.length;i++){
					console.log("选最后一个满分");
					var $a_last = $($span_comments[i]).find('a:last');
					if($a_last.length > 0){
						$a_last[0].click();
					}
				}
				var $btn_submit = $('a[class="btn-5"]');
				if($btn_submit.length > 0){
					console.log("出现提交按钮");
					setTimeout(function(){

						$btn_submit[0].click();
					},1000);
				}else{
					console.log("未出现提交按钮");
					setTimeout(function(){

						window.location.reload(true);
					},3000);
				}
			}else{

			}
		}else{
			console.log("未发现满意度评价,可能页面打开就是成功的，observe中会处理");
			console.log("未发现满意度评价,可能商品不需要四项评分，订单超3个月，某些商品京东没有四项评分");

		}
	}
}

function commentStar(){
	var $comment_box = $('div[class="comment-box prompt01"]');
	if($comment_box.find('.commstar a.star5').length>0){
		console.log("评分5");
		$comment_box.find('a.star5')[0].click();
	}
}

function commentTags(){
	console.log("开始自定义标签");
	if(task.tag){
		console.log("任务中有自定义标签内容");
		console.log(task.tag);
		console.log("标签");
		var $li_tags = $('ul[class="tips-list"] li.list-last').filter(":contains('自定义')");
		console.log("可以自定义标签");
		if($li_tags.length > 0){
			console.log("商品评价中有自定义标签");
			var tags = task.tag.split(',');
			console.log(tags);
			var label_select=$('div[class="comment-box prompt01"]:visible').find("li.select");
			if(label_select.length==0){
				console.log("没有有选中的标签，添加自定义标签");
				for(var i=0;i < tags.length;i++){
					$li_tags.before('<li class="select" vid=""><s class="f-check"></s>' + tags[i] + '</li>');
				}
			}else{
				console.log("有选中的标签，不再选标签");
			}

			var label_select=$('div[class="comment-box prompt01"]:visible').find("li.select");
			if(label_select.length>5){
				console.log("自定义评价标签选中超过5个");
				setTimeout(function(){


				},3000);
			}else if(label_select.length==0){
				console.log("自定义评价标签未设置成功");
				setTimeout(function(){

				},3000);
			}else{
				console.log("自定义评价标签ok");
			}
		}else{
			console.log("该商品无自定义标签");
		}
	}else{
		console.log("任务无自定义标签内容");
	}
}

function commentTextarea(){
	console.log("commentTextarea");
	console.log("心得");
	var $comment_textarea = $('div[class="comment-box prompt01"]:visible').find('textarea');
	if($comment_textarea){
		console.log("$comment_textarea");
		commentComplate();
		console.log("focus");
		$comment_textarea.focus().val(task.body);
		console.log("commentTextarea ok");
	}
}

function commentAnonymous(){
	console.log("commentAnonymous");
	console.log("匿名评价");
	$('div[class="comment-box prompt01"]:visible').find('#anonymousFlag').attr('checked',true);
}

function commentSubmit(func,submit){
	
	var pingjia = $('div[class="comment-box prompt01"]:visible').find('span.pingjiaEl:contains("评价")');
	if (pingjia.length > 0) {
		console.log("评价提交");
		if(submit){
			setTimeout(function () {

				pingjia[0].click();
			}, 2000);
		}else{
			init.sendMessage('comment_submit');
		}
	} else {
		console.log("无评价提交");
		setTimeout(function () {


		}, 3000);
	}

	func && func();
}

function item_comment(){
	
	console.log('start item_comment');

	var comment_box = $('div[class="comment-box prompt01"]:visible');
	console.log(comment_box);
	var pro_info = $('div[class="comment-box prompt01"]:visible').siblings('.pro-info');
	console.log(pro_info);

	var pub_comment = $('div[class="comment-box prompt01"]:visible').siblings('.pro-info').find('.fore3 a').filter(":contains('发表评价')");

	console.log(pub_comment);
	if (pub_comment.length > 0) {
		setTimeout(function () {

			commentStar();
		}, 2000);

		setTimeout(function () {

			commentTags();

			setTimeout(function () {

				commentTextarea();

				setTimeout(function () {

					commentAnonymous();

						setTimeout(function () {

							commentSubmit();
						}, 1000);

				}, 6000);

			}, 15000);

		}, 5000);
	}else{
		console.log('item has commented');
	}
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if(mutation.type === 'childList' ) {
			console.log(mutation.type);
			console.log(mutation);

			if (mutation.target.id == 'ttbar-login'){
				init.sendMessage('all_comment');
			}

			if(mutation.target.className === 'comment-box prompt01'){
				if(mutation.addedNodes.length > 0){
					var prompt01 = $('div[class="comment-box prompt01"]:visible');
					console.log('评价全部商品');
					item_comment();
				}
			}

			if(mutation.target.className === "score"){
				console.log("出现四项评分");
				var addedNodes = mutation.addedNodes;
				if(addedNodes.length > 0 ){
					console.log("出现四项评分提交");
					var tip_num = $('#tip-num:contains("全部已评价")');
					if(tip_num.length > 0){
						console.log("全部已经评价，开始评分，仅在页面加载完后评价内容已提交，只剩四项评分时才会执行");
						setTimeout(function(){

							commentScore();
						},3000);
					}else {
						console.log('score 有未评价商品');
					}
				}
			}

			if(mutation.target.className === "msg-error-01 hide"){
				console.log("评价过程中出现小提示错误，标签不合要求，字数超出之类的");
			}

			if(mutation.target.className === "thickwrap"
				&& mutation.addedNodes.length > 0
				&& mutation.addedNodes[0].className ==="thickcon"){
				console.log("出现弹出框");
				console.log(mutation);
				console.log($(".thickwrap .thickcon").find("h3").html());
				var errormessage=$(".thickwrap .thickcon").find("h3").filter(':contains("屏蔽词")');
				var thicktitle = $(".thickwrap .thickcon").find("h3").html();
				if(errormessage.length > 0){

				}else{
					//发表失败，直接刷新
					if(thicktitle){
						if(thicktitle == "发表失败"){
							setTimeout(function(){

							},3000);
						}
					}else{
						setTimeout(function(){

						},3000);
					}
				}
			}

			if(mutation.target.className === "pro-info" && mutation.addedNodes.length > 0){
				console.log("产品列表中的 发表评价 变动，该商品评价完成");
				var $a_comments = $('a[class="pj"]').filter(':contains("发表评价")');
				if($a_comments.length == 0){
					console.log("全部商品均评价");
					setTimeout(function(){

						commentScore();
					},3000);
				}else{

				}
			}

		}


		if(mutation.type === "attributes"){
			if(mutation.target.className === "score-succ" && mutation.target.hidden === false){
				console.log("感谢您的评分  是可见状态");
				init.sendMessage('comment_success');
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
