

$(function(){
    getMessage4();
    $(".mydate input").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        language: 'zh-CN',
        autoclose: true,
        inputMask: true
    });
})

function changeTime() {
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
        $("#startDate").datetimepicker('remove');
        $("#endDate").datetimepicker('remove');
        getDateByYear(y);
    } else if (s == 1) {
        $("#startDate").datetimepicker('remove');
        $("#endDate").datetimepicker('remove');
        getDateByMonth(m);
    } else if (s == 2) {
        $("#startDate").datetimepicker('remove');
        $("#endDate").datetimepicker('remove');
        getDateByDay(d);
    }else {
        $("#startDate").datetimepicker('remove');
        $("#endDate").datetimepicker('remove');
        getDateByHour(h);
    }
}
function getDateByMonth() {
    //按月查询
    //$("#startDate").datetimepicker().format();
    $("#startDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        startDate: 3,
        todayHighlight: true,
        //showMeridian :true,
        autoclose: true,
        language: 'zh-CN',
        minView: 4,
        todayBtn: true,
    }).on("change", function (ev) {
        var start = $('#startDate').val();
        $('#endDate').datetimepicker('setStartDate', start);
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
        $('#startDate').datetimepicker('setEndDate', new Date());
        $('#endDate').datetimepicker('setStartDate', new Date());
    });
}

function getDateByYear(y) {
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
        //todayBtn:true,
    });
    /*.on("changeYear",function(ev){
     $("#startDate").datetimepicker('setStartDate',y-10);
     $("#startDate").datetimepicker('setEndDate',$('#endDate').val());
     })*/
    $("#endDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 'decade',

    }).on("change", function (ev) {
        var end = $('#endDate').val();
        $('#endDate').datetimepicker('setStartDate', $('#startDate').val());
        $('#endDate').datetimepicker('setEndDate', y);
    });
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
        var start = $('#startDate').val();
        $('#endDate').datetimepicker('setStartDate', start);
        $('#startDate').datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        var end = $('#endDate').val();
        $('#startDate').datetimepicker('setEndDate', new Date());
        $('#endDate').datetimepicker('setStartDate', new Date());
    });
}

function getMessage4() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();

    var choesnType = $("#timestatus").find("option:selected").val();

    getTable4(startDate, endDate,choesnType);
}
function getTable4(startDate, endDate,choesnType) {
    $("#proportion").bootstrapTable('destroy');
    $("#proportion").bootstrapTable({
        method: "post",
        url: pathurl + "syslog/disposeresult?startDate=" + startDate + "&endDate=" + endDate + "&choesnType=" + choesnType,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        //paginationPreText : "上一页",
        //paginationNextText : "下一页",
        searchOnEnterKey: true,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        responseHandler:function(data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            //在ajax后我们可以在这里进行一些事件的处理
            var dataObj=data.result;
            return dataObj;
        },
    });
}
function reset4() {
    $(".face-form input").val("");
    $(".face-form select").val("-1");
    getMessage4();
}
