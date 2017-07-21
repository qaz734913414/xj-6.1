$("#bgli").mouseenter(function () {
    $(this).delay('300').toggleClass("open");

});
$("#bgli").mouseleave(function () {
    $(this).delay('300').removeClass("open");
    //5.页面打开之后判断它是否存在
});
var $li = $("#skin li");
$li.click(function () {
    $("#" + this.id).addClass("selected")
        .siblings().removeClass("selected");
    $("#cssfile").attr("href", "css/" + this.id + ".css");
    $.cookie("MyCssSkin", this.id, {path: '/', expires: 10});
});
var cookie_skin = $.cookie("MyCssSkin");
if (cookie_skin) {
    $("#" + cookie_skin).addClass("selected")
        .siblings().removeClass("selected");
    $("#cssfile").attr("href", "css/" + cookie_skin + ".css");
    $.cookie("MyCssSkin", this.id, {path: '/', expires: 10});
}
jQuery.support.cors = true;
var user = localStorage.getItem('username');

if (!user) {
    $('#loginModal #myModalLabel').html('请登录!');
    $('#loginModal').modal('show');
}
$('#loginModal button').on('click', function () {
    window.location.href = "./login.html";
});


var token = window.localStorage.getItem('token');
var username = window.localStorage.getItem('username');
$('#username').html(username);

if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token,
        },
        cache: false
    });
}
$('.second-box-blank').hide();
// $('#ajax-content>div').hide();
$.ajax({
    type: 'post',
    url: pathurl + 'menu/firstLevelMenu',
    // url:'./testJson/firstLvMenu.json',
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function (firstLevelData) {

        var firstLevelData = firstLevelData.result;
        var str = '';
        for (var i = 0; i < firstLevelData.length; i++) {
            str += '<li class="firstLvMenu"><a href="javascript:void(0)">' + firstLevelData[i].name + '</a></li>';
        }
        $('.first-box .mynav-menu').find('li').eq(1).after(str);
        secLvMenu(firstLevelData);
    }
});


function secLvMenu(firstLevelData) {

    $('.first-box .firstLvMenu').each(function (i) {
        $(this).on('click', function (ev) {


            $('.welcome').hide();
            $('.second-box-blank').show();
            $(this).find('a').attr('class', 'active');
            $(this).siblings().find('a').removeAttr('class', 'active');
            // var _href=$(this).find('a').attr('href');
            // var _url=$(this).find('a').attr('href').substr(_href.indexOf('/')+1);

            var nowIndex = $(this).index() - 2;


            $.ajax({
                url: pathurl + 'menu/secondLevelMenu',
                // url:'./testJson/secLvMenu.json',
                type: 'post',
                data: {
                    pid: firstLevelData[i].id
                },
                success: function (secondLevelData) {
                    $('#ajax-content').empty();
                    var secondLevelData = secondLevelData.result;
                    var str = '';
                    for (var i = 0; i < secondLevelData.length; i++) {
                        str += '<li><a href="javascript:void(0);">' + secondLevelData[i].name + '</a></li>';
                    }
                    $('.second-box .mynav-menu').html(str);
                    $('.second-box .mynav-menu').find('a').eq(0).attr('class', 'active-second');

                    $('.second-box .mynav-menu li').each(function (i) {
                        $(this).on('click', function () {
                            $(this).find('a').attr('class', 'active-second');
                            $(this).siblings().find('a').removeAttr('class', 'active-second');
                            // $('#ajax-content>div').eq($(this).index()).show().siblings().hide();

                        })
                    });

                    $('.second-box .mynav-menu li').eq(0).find('a').trigger('click');

                }
            })
        })
    })
};
// 获取未读问题反馈数量
var questr = '', quemsgs = [];
function quesmis() {
    quemsgs = [];
    $.ajax({
        type: 'POST',
        cache: false,
        url: pathurl + 'answer/appfeedback',
        data: {
            username: $('#username').text()
        },
        success: function (data) {

            quemsgs = data.result;
            var count=data.count;
            if(count>0){
                $('#ques').show();
                $('#ques').text(data.count);
            }else {
                $('#ques').hide();
                $('#ques').text(data.count);
            }


        },
        error: function () {
            alert('错误')
        },
        dataType: 'json'
    });

}
quesmis();

//顶部未读点击
function ques() {
    questr = '';
    $.each(quemsgs, function (i, item) {
        if (item.readState == 'N') {
            i += 1;
            if(item.state=='Y'){
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:red;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">未读反馈</span>' + i + ' <span class="q">问题：'+item.qDetail+'？</span><span class="label label-success">已回答</span> <span class="time">回复时间：'+item.answerTime+'。</span> <input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }else {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:red;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">未读反馈</span>' + i + ' <span class="q">问题：'+item.qDetail+'？</span><span class="label label-default">未回答</span><input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }

        }else if(item.readState == 'Y'){
            i += 1;
            if(item.state=='Y'){
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:green;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">已读反馈</span>' + i + ' <span class="q">问题：'+item.qDetail+'？</span><span class="label label-success">已回答</span> <span class="time">回复时间：'+item.answerTime+'。</span> <input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }else {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:green;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">已读反馈</span>' + i + ' <span class="q">问题：'+item.qDetail+'？</span><span class="label label-default">未回答</span><input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }
        }
    });
    $('#infoModal #accordion').html(questr);
    $('#infoModal #infoLabel').text('问题反馈');

    $('#infoModal').modal();
    $('#infoModal #accordion a').click(function () {
        var that = this;
        if($(this).text().indexOf('未读')==0){
            $.ajax({
                type: 'POST',
                cache: false,
                url: pathurl + 'answer/updateReadStatus',
                data: {
                    id: $(this).find('input[name="id"]').val(),
                    username: $('#username').text()
                },
                success: function () {
                    $(that).find('.qa').text("已读反馈!");
                    mis();
                },
                error: function () {
                    $("#myModal").css('z-index', 1500);
                    $("#modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                },
                dataType: 'json'
            });
        };

    })
};
// 获取未读消息数量
var str = '', msgs = [];
function mis() {
    msgs = [];
    $.ajax({
        type: 'POST',
        cache: false,
        url: pathurl + 'msgpush/msg'+ "?timeStamp=" + Math.random(),
        data: {
            username: $('#username').text()
        },
        success: function (data) {

            msgs = data.rows;
            var count=data.count;
            if(count>0){
                $('#msgs').show();
                $('#msgs').text(data.count);

            }else {
                $('#msgs').hide();
                $('#msgs').text(data.count);

            }

        },
        error: function () {
            alert('错误')
        },
        dataType: 'json'
    });

}
mis();

//顶部未读点击
function msg() {
    str = '';
    $.each(msgs, function (i, item) {
        if (item.state == 'N') {
            i += 1;
            str += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:red;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne">未读消息' + i + ' <input type="hidden" name="mId" value=' + item.mId + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body">' + item.content + ' </div></div></div>'
        }else if(item.state == 'Y'){
            i += 1;
            str += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button" style="color:#00B83F;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne">已读消息' + i + ' <input type="hidden" name="mId" value=' + item.mId + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body">' + item.content + ' </div></div></div>'
        }
    });
    $('#infoModal #accordion').html(str);
    $('#infoModal #infoLabel').text('消息推送');
    $('#infoModal').modal();
    $('#infoModal #accordion a').click(function () {
        var that = this;
        if($(this).text().indexOf('未读')==0){
            $.ajax({
                type: 'POST',
                cache: false,
                url: pathurl + 'msgpush/updatestate',
                data: {
                    mId: $(this).find('input[name="mId"]').val(),
                    username: $('#username').text()
                },
                success: function () {
                    $(that).text("消息已读!");
                    mis();
                },
                error: function () {
                    $("#myModal").css('z-index', 1500);
                    $("#modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                },
                dataType: 'json'
            });
        };

    })
};


//获取系统时间，将时间以指定格式显示到页面。
// function systemTime() {
//     //获取系统时间。
//     var dateTime = new Date();
//     var year = dateTime.getFullYear();
//     var month = dateTime.getMonth() + 1;
//     var day = dateTime.getDate();
//     var hh = dateTime.getHours();
//     var mm = dateTime.getMinutes();
//     var ss = dateTime.getSeconds();
//
//     //分秒时间是一位数字，在数字前补0。
//     mm = extra(mm);
//     ss = extra(ss);
//     month = extra(month);
//     day = extra(day);
//
//     //将时间显示到ID为time的位置，时间格式形如：19:18:02
//     document.getElementById("topDate").innerHTML = year + "-" + month +
//         "-" + day + " " + hh + ":" + mm + ":" + ss;
//
//     //每隔1000ms执行方法systemTime()。
//     setTimeout("systemTime()", 1000);
// }
//
// //补位函数。
// function extra(x) {
//     return x < 10 ? ("0" + x) : x;
// }
// systemTime();
