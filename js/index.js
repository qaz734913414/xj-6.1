

$(function(){
    var token = window.localStorage.getItem('token');
    // console.log(token)
    if (token) {
        $.ajaxSetup({
            headers: {
                'x-access-token': token
            }
        });
    }
    $('.second-box-blank').hide();
    $('#ajax-content>div').hide();
    $.ajax({
        type: 'post',
        url:'http://192.168.0.169:8080/FaceManage/menu/firstLevelMenu',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(firstLevelData) {
          // console.log(firstLevelData)
            var firstLevelData = firstLevelData.result;
            var str = '';
            for (var i = 0; i < firstLevelData.length; i++) {
                str += '<li class="firstLvMenu"><a href="##' + firstLevelData[i].url + '">' + firstLevelData[i].name + '</a></li>';
            }
            $('.first-box .mynav-menu').find('li').eq(1).after(str);
            secLvMenu(firstLevelData);
        }
    });
})

function secLvMenu(firstLevelData){

    $('.first-box .firstLvMenu').each(function(i) {
        $(this).on('click', function(ev) {


            $('.welcome').hide();
            $('.second-box-blank').show();
            $(this).find('a').attr('class','active');
            $(this).siblings().find('a').removeAttr('class','active');
            var _href=$(this).find('a').attr('href');
            var _url=$(this).find('a').attr('href').substr(_href.indexOf('/')+1);

            var nowIndex = $(this).index() - 2;

            $.ajax({
                url:'http://192.168.0.169:8080/FaceManage/menu/secondLevelMenu',
                type:'post',
                data:{
                  pid:firstLevelData[i].id
                },
                success:function(secondLevelData){
                    var secondLevelData=secondLevelData.result;
                    var str = '';
                    for (var i = 0; i < secondLevelData.length; i++) {
                        str+='<li><a href="##">'+secondLevelData[i].name+'</a></li>';
                    }
                    $('.second-box .mynav-menu').html(str);
                    $('.second-box .mynav-menu').find('a').eq(0).attr('class','active-second');
                    $('.second-box .mynav-menu li').each(function(i) {
                      $(this).on('click',function(){
                        $(this).find('a').attr('class','active-second');
                        $(this).siblings().find('a').removeAttr('class','active-second');
                        $('#ajax-content>div').eq($(this).index()).show().siblings().hide();
                      })
                    })
                }
            })
        })
    })
}


//获取系统时间，将时间以指定格式显示到页面。
function systemTime() {
    //获取系统时间。
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hh = dateTime.getHours();
    var mm = dateTime.getMinutes();
    var ss = dateTime.getSeconds();

    //分秒时间是一位数字，在数字前补0。
    mm = extra(mm);
    ss = extra(ss);
    month = extra(month);
    day = extra(day);

    //将时间显示到ID为time的位置，时间格式形如：19:18:02
    document.getElementById("topDate").innerHTML = year + "-" + month +
        "-" + day + " " + hh + ":" + mm + ":" + ss;

    //每隔1000ms执行方法systemTime()。
    setTimeout("systemTime()", 1000);
}

//补位函数。
function extra(x) {
    return x < 10 ? ("0" + x) : x;
}
systemTime();
