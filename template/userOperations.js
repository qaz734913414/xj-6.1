getMessage2();
$(".mydate input").datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    language: 'zh-CN',
    autoclose: true,
    inputMask: true
});

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
    } else {
        $("#startDate").datetimepicker('remove');
        $("#endDate").datetimepicker('remove');
        getDateByHour(h);
    }
}
function changeTable() {
    var f = $("#fashion").find("option:selected").val();
    if (f == 0) {
        $("#first").bootstrapTable('destroy');
        $("#third").bootstrapTable('destroy');
        $("#four").bootstrapTable('destroy');
        $("#five").bootstrapTable('destroy');
        $("#second").css("display", "");
        $("#first").css("display", "none");
        $("#third").css("display", "none");
        $("#four").css("display", "none");
        $("#five").css("display", "none");
    } else if (f == 1) {
        $("#first").bootstrapTable('destroy');
        $("#second").bootstrapTable('destroy');
        $("#four").bootstrapTable('destroy');
        $("#five").bootstrapTable('destroy');
        $("#third").css("display", "");
        $("#first").css("display", "none");
        $("#second").css("display", "none");
        $("#four").css("display", "none");
        $("#five").css("display", "none");
    } else if (f == 2) {
        $("#first").bootstrapTable('destroy');
        $("#third").bootstrapTable('destroy');
        $("#second").bootstrapTable('destroy');
        $("#five").bootstrapTable('destroy');
        $("#four").css("display", "");
        $("#first").css("display", "none");
        $("#second").css("display", "none");
        $("#third").css("display", "none");
        $("#five").css("display", "none");
    } else if (f == 3) {
        $("#first").bootstrapTable('destroy');
        $("#third").bootstrapTable('destroy');
        $("#four").bootstrapTable('destroy');
        $("#second").bootstrapTable('destroy');
        $("#five").css("display", "");
        $("#first").css("display", "none");
        $("#second").css("display", "none");
        $("#third").css("display", "none");
        $("#four").css("display", "none");
    } else {
        $("#second").bootstrapTable('destroy');
        $("#third").bootstrapTable('destroy');
        $("#four").bootstrapTable('destroy');
        $("#five").bootstrapTable('destroy');
        $("#first").css("display", "");
        $("#second").css("display", "none");
        $("#third").css("display", "none");
        $("#four").css("display", "none");
        $("#five").css("display", "none");
    }
}
function getMessage2() {
    changeTable();
    var start = $("#startDate").val();
    var end = $("#endDate").val();
    var type = $("#timestatus").find("option:selected").val();
    var fash = $("#fashion").find("option:selected").val();
    if (fash == 0) {
        SecondTable($("#second"), start, end, type, 0);
    } else if (fash == 1) {
        SecondTable($("#third"), start, end, type, 1);
    } else if (fash == 2) {
        SecondTable($("#four"), start, end, type, 2);
    } else if (fash == 3) {
        SecondTable($("#five"), start, end, type, 3);
    } else {
        SecondTable($("#first"), start, end, type, -1);
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
        todayBtn: true,
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
        todayBtn: true,
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
        todayBtn: true,
    }).on("change", function (ev) {
        var end = $('#endDate').val();
        $('#startDate').datetimepicker('setEndDate', new Date());
        $('#endDate').datetimepicker('setStartDate', new Date());
    });
}
function getDateByHour() {
    //按小时查询
    $("#startDate").datetimepicker({
        format: "yyyy-mm-dd-hh",
        todayHighlight: true,
        showMeridian: true,
        autoclose: true,
        inputMask: true,
        language: 'zh-CN',
        minView: 1,
        todayBtn: true,
    }).on("change", function (ev) {
        var start = $('#startDate').val();
        $('#endDate').datetimepicker('setStartDate', start);
        $('#startDate').datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm-dd-hh",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 1,
        todayBtn: true,
    }).on("change", function (ev) {
        var end = $('#endDate').val();
        $('#startDate').datetimepicker('setEndDate', new Date());
        $('#endDate').datetimepicker('setStartDate', new Date());
    });
}
function SecondTable(t, start, end, type, fash) {
    t.bootstrapTable('destroy');
    t.bootstrapTable({
        method: "post",
        url: pathurl + "syslog/count?startDate=" + start + "&endDate=" + end + "&dateType=" + type + "&fashion=" + fash,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        buttonsClass: "face",
        //paginationPreText : "上一页",
        //paginationNextText : "下一页",
        searchOnEnterKey: true,
        showExport: true, //是否显示导出
        responseHandler:function(data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                                        //在ajax后我们可以在这里进行一些事件的处理
          var dataObj=data.result;
          return dataObj;
        },
    });
}
function reset2() {
    $(".face-form input").val("");
    $(".face-form select").val("-1");
    getMessage2();
}
