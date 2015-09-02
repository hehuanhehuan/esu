function product_comment(){
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
}


function commentBox(click){
    if($('div[class="comment-box prompt01"]:visible').length > 0){

    }else{
        var pubs = $('.pro-info').find('.fore3 a').filter(":contains('发表评价')");
        if(pubs.length > 0){
            var pub = pubs[0];
            if(click){
                init.sendMessage('watchdog');
                pub.click();
            }else{
                init.sendMessage('product_comment');
            }
        }
    }
}

function commentStar(){
    init.sendMessage('watchdog');
    var $comment_box = $('div[class="comment-box prompt01"]');
    if($comment_box.find('.commstar a.star5').length>0){
        console.log("评分5");
        $comment_box.find('a.star5')[0].click();
    }
}

function commentTags(){
    init.sendMessage('watchdog');
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
                    init.sendMessage('watchdog');

                },3000);
            }else if(label_select.length==0){
                console.log("自定义评价标签未设置成功");
                setTimeout(function(){
                    init.sendMessage('watchdog');
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
    init.sendMessage('watchdog');
    console.log("commentTextarea");
    console.log("心得");
    var $comment_textarea = $('div[class="comment-box prompt01"]:visible').find('textarea');
    if($comment_textarea){
        console.log("$comment_textarea");
        console.log("focus");
        $comment_textarea.focus().val(task.body);
        console.log("commentTextarea ok");
    }
}

function commentAnonymous(){
    init.sendMessage('watchdog');
    console.log("commentAnonymous");
    console.log("匿名评价");
    $('div[class="comment-box prompt01"]:visible').find('#anonymousFlag').attr('checked',true);
}

function commentSubmit(func,submit){
    init.sendMessage('watchdog');
    var pingjia = $('div[class="comment-box prompt01"]:visible').find('span.pingjiaEl:contains("评价")');
    if (pingjia.length > 0) {
        console.log("评价提交");
        if(submit){
            setTimeout(function () {
                init.sendMessage('watchdog');
                pingjia[0].click();
            }, 2000);
        }else{
            init.sendMessage('comment_submit');
        }
    } else {
        console.log("无评价提交");
        setTimeout(function () {
            init.sendMessage('watchdog');

        }, 3000);
    }

    func && func();
}