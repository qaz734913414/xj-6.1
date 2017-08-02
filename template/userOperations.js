$(function () {
    getMessage3();
    $(".mydate input").datetimepicker({
        format: 'yyyy-mm-dd',
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
})
function changeTime() {
    $("#startDate").datetimepicker('remove');
    $("#endDate").datetimepicker('remove');
    var date = new Date();
    var y = date.getFullYear();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var m = date.getFullYear() + seperator1 + month;
    var d = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var h = date.getFullYear() + seperator1 + month + seperator1 + strDate + seperator1 + hour;
    var s = $("#timestatus").find("option:selected").val();

    if (s == 0) {

        getDateByYear(y);
    } else if (s == 1) {

        getDateByMonth(m);
    } else if (s == 2) {

        getDateByDay(d);
    }
}
changeTime()
function getDateByMonth() {
    //按月查询
    //$("#startDate").datetimepicker().format();
    $("#startDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        startDate: 3,
        todayHighlight: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 4,
        todayBtn: true,
    }).on("change", function (ev) {
        var start = $('#startDate').val();

        $('#startDate').datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 4,
        todayBtn: true,
    }).on("change", function (ev) {
        var end = $('#endDate').val();

        $('#endDate').datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}
function getDateByYear() {
    //按年查询
    $("#startDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        startDate: "2006",
        endDate: "2020",
        //todayHighlight:true,
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 'decade',
        endDate: new Date()
    });

    $("#endDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 'decade'

    }).on("change", function (ev) {

        $(this).datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}

function getDateByDay() {
    //按天查询
    $("#startDate").datetimepicker({
        format: "yyyy-mm-dd",
        startDate: 4,
        todayHighlight: true,
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        $('#endDate').datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        var end = $('#endDate').val();

        $('#endDate').datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}

function getMessage3() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();

    var choesnType = $("#timestatus").find("option:selected").val();
    var province = $("#distpicker select[name='province']").val();
    var city = $("#distpicker select[name='city']").val();
    var area = $(" #distpicker select[name='area']").val();
    getTable3(startDate, endDate, choesnType, province, city, area);
}
function QueryString(key) {

    var reg = new RegExp(key + "=([^&#]*)", "i");

    var value = reg.exec(window.location.href);

    if (value == null)return null;
    if (value == "undefined")return "";
    return decodeURI(value[1]);
}
    function getTable3(startDate, endDate, choesnType, province, city, area) {
    $("#proportion").bootstrapTable('destroy');
    $("#proportion").bootstrapTable({
        method: "post",
        url: pathurl + "systemlog/count?startDate=" + startDate + "&endDate=" + endDate + "&type=" + choesnType + "&province=" + province + "&city=" + city + "&area=" + area,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        //paginationPreText : "上一页",
        //paginationNextText : "下一页",
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）

        searchOnEnterKey: true,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        onLoadSuccess: function (data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            // 在ajax后我们可以在这里进行一些事件的处理

        },
    });
};
// function numSort(a, b) {
//     return b-a;
// }
// function percentSort(a, b) {
//     var value_a = a.substr(0, a.length-1)
//     var value_b = b.substr(0, b.length-1)
//     return value_b-value_a;
// }
function reset3() {
    $(".face-form input").val("");
    $(".face-form select").val("-1");
    getMessage3();
}


// $('#proportionbd').on('click', 'td', function () {
//     var text = $(this).text();
//     var index = $(this).index()
//     var date = $(this).siblings().first().text()
//     if (text == 0) {
//         return false;
//     } else {
//         $.ajax({
//             type: 'POST',
//             data: {
//                 date: date,
//                 type: index
//             },
//             url: pathurl + 'syslog/crDetails',
//             success: function (data) {
//                 var dListData = data.result, str = '';
//                 $.each(dListData, function (index, item) {
//                     str += '<tr><td>' + item.name + '</td><td>' + item.idno + '</td><td>' + item.carno + '</td><td>' + item.phoneno + '</td><td>' + item.harmful + '</td><td>' + item.dispose + '</td><td>' + item.username + '</td><td>' + item.userdepart + '</td><td>' + item.userorgan + '</td><td>' + item.creattime + '</td></tr>'
//                 })
//                 $('#countbody').html(str)
//             }
//         })
//         $('#countModal').modal()
//     }
//
// })
function typeformatter(value) {
    if (value == 0) {
        return '人脸检索管理';
    } else if(value == 1){
        return '人脸日志管理';
    }else if(value == 2){
        return '统计分析管理';
    }else if(value == 3){
        return '配置中心';
    }
}
