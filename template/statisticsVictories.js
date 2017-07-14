$(function () {
    getMessage3();
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
    } else {
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
// 单位初始
$.ajax({
    type: 'POST',
    url: pathurl + 'user/initDeptAndRole',
    success: function (data) {
        var dListData = data.result.dList;//dList    rName  rId
        console.log(dListData);
        for (var i = 0; i < dListData.length; i++) {
            $('#u_unit_id').append('<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>');
        }

    }
})
function getMessage3() {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    var departname = $("#u_unit_id").find("option:selected").text();
    var choesnType = $("#timestatus").find("option:selected").val();
    var province = $("#distpicker select[name='province']").val();
    var city = $("#distpicker select[name='city']").val();
    var area = $(" #distpicker select[name='area']").val();
    getTable3(startDate, endDate, departname, choesnType, province, city, area);
}
function getTable3(startDate, endDate, departname, choesnType, province, city, area) {
    $("#proportion").bootstrapTable('destroy');
    $("#proportion").bootstrapTable({
        method: "post",
        url: pathurl + "syslog/chosenresult?startDate=" + startDate + "&endDate=" + endDate + "&choesnType=" + choesnType + "&departname=" + departname + "&province=" + province + "&city=" + city + "&area=" + area,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        //paginationPreText : "上一页",
        //paginationNextText : "下一页",
        searchOnEnterKey: true,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        responseHandler: function (data) {//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            //在ajax后我们可以在这里进行一些事件的处理
            var dataObj = data.result;
            return dataObj;
        },
    });
}
function reset3() {
    $(".face-form input").val("");
    $(".face-form select").val("-1");
    getMessage3();
}
$('#proportionbd').on('click', 'td', function () {
    var text = $(this).text();
    var index = $(this).index()
    var date = $(this).siblings().first().text()
    if (text == 0) {
        return false;
    } else {
        $.ajax({
            type: 'POST',
            data: {
                date: date,
                type: index
            },
            url: pathurl + 'syslog/crDetails',
            success: function (data) {
                var dListData = data.result, str = '';
                $.each(dListData, function (index, item) {
                    str += '<tr><td>' + item.name + '</td><td>' + item.idno + '</td><td>' + item.carno + '</td><td>' + item.phoneno + '</td><td>' + item.harmful + '</td><td>' + item.dispose + '</td><td>' + item.username + '</td><td>' + item.userdepart + '</td><td>' + item.userorgan + '</td><td>' + item.creattime + '</td></tr>'
                })
                $('#countbody').html(str)
            }
        })
        $('#countModal').modal()
    }


})