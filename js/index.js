
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
var userMes =localStorage.getItem('userMes')?JSON.parse(localStorage.getItem('userMes')):'';

if (!userMes) {
    $('#loginModal #myModalLabel').html('请登录!');
    $('#loginModal').modal('show');
}
$('#loginModal button').on('click', function () {
    window.location.href = "./login.html";
});


var token = window.localStorage.getItem('token');
$('#username').html(userMes.username);

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
    method:'post',
    url: pathurl + 'menu/firstLevelMenu',
    // url:'./testJson/firstLvMenu.json',
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function (firstLevelData) {

        var firstLevelData = firstLevelData.result;
        var str = '', leftstr = '';
       for (var i = 0; i < firstLevelData.length; i++) {
            str += '<li class="firstLvMenu"><a href="javascript:void(0)">' + firstLevelData[i] .name + '</a></li>';
        }
        for (var i = 0; i < firstLevelData.length; i++) {
            leftstr+='<li><a class="has-arrow" href="#" aria-expanded="false"><i class="iconfont icon-'+i+'"></i></span>' + firstLevelData[i].name + '</a><ul aria-expanded="false" class="collapse list-unstyled"></ul></li>'
        }
        $('.first-box .mynav-menu').find('li').eq(1).after(str);
        $('#accordion1 #menu1').append(leftstr);
        secLvMenu(firstLevelData);
        leftMenu(firstLevelData);
    }
});

function leftMenu(firstLevelData) {
    $('.welcome').hide();
    $('.second-box-blank').hide();
    $('#accordion1 #menu1>li>a').each(function (i) {
        $(this).on('click', function (ev) {
            var $this=$(this);
            var index = $(this).parent().index();

            $.ajax({
                url: pathurl + 'menu/secondLevelMenu',
                // url:'./testJson/secLvMenu.json',
                method:'post',
                data: {
                    pid: firstLevelData[i].id
                },
                success: function (secondLevelData) {
                    $('#ajax-content').empty();
                    var secondLevelData = secondLevelData.result;
                    var leftsecondstr = '';

                    for (var i = 0; i < secondLevelData.length; i++) {
                        leftsecondstr += '<li><span hidden id="pid">' + secondLevelData[i].id + '</span><a class="leftsecond"  href="javascript:void(0);"><i class="iconfont icon-dian"></i>' + secondLevelData[i].name + '</a></li>';
                    };

                    $('#accordion1 #menu1>li').eq(index).find('ul').html(leftsecondstr);


                }
            });
            setTimeout(function () {
               $this.parent().toggleClass('active').find('ul').toggleClass('in');
                $this.parent().siblings().removeClass('active').find('ul').removeClass('in');
            },0);

        })
    })
}

function secLvMenu(firstLevelData) {

    $('.first-box .firstLvMenu').each(function (i) {
        $(this).on('click', function (ev) {


            $('.welcome').hide();
            $('.second-box-blank').show();
            $(this).find('a').attr('class', 'active');
            $(this).siblings().find('a').removeAttr('class', 'active');

            var nowIndex = $(this).index() - 2;


            $.ajax({
                url: pathurl + 'menu/secondLevelMenu',
                // url:'./testJson/secLvMenu.json',
                method:'post',
                data: {
                    pid: firstLevelData[i].id
                },
                success: function (secondLevelData) {
                    $('#ajax-content').empty();
                    var secondLevelData = secondLevelData.result;
                    var str = '';
                    for (var i = 0; i < secondLevelData.length; i++) {
                        str += '<li><span hidden id="pid">' + secondLevelData[i].id + '</span><a href="javascript:void(0);">' + secondLevelData[i].name + '</a></li>';
                    }
                    $('.second-box .mynav-menu').html(str);
                    $('.second-box .mynav-menu').find('a').eq(0).attr('class', 'active-second');

                    $('.second-box .mynav-menu li').each(function (i) {
                        $(this).on('click', function (i) {
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

$('.leftopen .icon-putaway').on('click',function () {
    $('#accordion1').css('left','-245px');
    $('.leftopen .icon-putaway').hide();
    $('.leftopen .icon-open').show();
    $('.first-box .firstLvMenu').show();
    $('.second-box').show();
    $('#ajax-content').html('');
    $('#main').css('marginLeft',0)
});
$('.leftopen .icon-open').on('click',function () {
    $('#accordion1').css('left',0);
    $('.leftopen .icon-putaway').show();
    $('.leftopen .icon-open').hide();
    $('.first-box .firstLvMenu').hide();
    $('.second-box').hide();
    $('#ajax-content').html('');
    $('#main').css('marginLeft','250px')
})
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
            var count = data.count;
            if (count > 0) {
                $('#ques').show();
                $('#ques').text(data.count);
            } else {
                $('#ques').hide();
                $('#ques').text(data.count);
            }


        },
        error: function () {
            // alert('错误')
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
            if (item.state == 'Y') {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:red;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">未读反馈</span>' + i + ' <span class="q">问题：' + item.qDetail + '？</span><span class="label label-success">已回答</span> <span class="time">回复时间：' + item.answerTime + '。</span> <input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            } else {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:red;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">未读反馈</span>' + i + ' <span class="q">问题：' + item.qDetail + '？</span><span class="label label-default">未回答</span><input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }

        } else if (item.readState == 'Y') {
            i += 1;
            if (item.state == 'Y') {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:green;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">已读反馈</span>' + i + ' <span class="q">问题：' + item.qDetail + '？</span><span class="label label-success">已回答</span> <span class="time">回复时间：' + item.answerTime + '。</span> <input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            } else {
                questr += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button " style="color:green;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne"><span class="qa">已读反馈</span>' + i + ' <span class="q">问题：' + item.qDetail + '？</span><span class="label label-default">未回答</span><input type="hidden" name="id" value=' + item.id + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body"><p>回复内容</p>' + item.aDetail + ' </div></div></div>'
            }
        }
    });
    $('#infoModal #accordion').html(questr);
    $('#infoModal #infoLabel').text('问题反馈');

    $('#infoModal').modal();
    $('#infoModal #accordion a').click(function () {
        var that = this;
        if ($(this).text().indexOf('未读') == 0) {
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
                    $("#myModal #modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                },
                dataType: 'json'
            });
        }
        ;

    })
};
// 获取未读消息数量
var str = '', msgs = [];

function mis() {
    msgs = [];
    $.ajax({
        type: 'POST',
        cache: false,
        url: pathurl + 'msgpush/msg' + "?timeStamp=" + Math.random(),
        data: {
            username: $('#username').text()
        },
        success: function (data) {

            msgs = data.rows;
            var count = data.count;
            if (count > 0) {
                $('#msgs').show();
                $('#msgs').text(data.count);

            } else {
                $('#msgs').hide();
                $('#msgs').text(data.count);

            }

        },
        error: function () {
            // alert('错误')
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
        } else if (item.state == 'Y') {
            i += 1;
            str += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading' + i + '"><h4 class="panel-title"><a role="button" style="color:#00B83F;" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapseOne">已读消息' + i + ' <input type="hidden" name="mId" value=' + item.mId + '></a></h4> </div> <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '"><div class="panel-body">' + item.content + ' </div></div></div>'
        }
    });
    $('#infoModal #accordion').html(str);
    $('#infoModal #infoLabel').text('消息推送');
    $('#infoModal').modal();
    $('#infoModal #accordion a').click(function () {
        var that = this;
        if ($(this).text().indexOf('未读') == 0) {
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
                    $("#myModal #modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                },
                dataType: 'json'
            });
        }
        ;

    })
};
