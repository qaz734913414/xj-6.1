$(function () {
    getTable1();
    /* $(".face-table button[title='Export data']").removeClass("btn-default");
     $(".face-table button[title='Export data']").addClass("face-button"); */
    init();
});
var dListData;
function init() {

    $.ajax({
        type: 'POST',
        url: pathurl + 'user/initDeptAndRole',
        success: function (data) {

             dListData = data.result.dList;//dList    rName  rId
            var rListData = data.result.rList;


            for (var i = 0; i < dListData.length; i++) {
                $('#u_unit_id').append('<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>');
            }
            for (var i = 0; i < rListData.length; i++) {
                $('#u_role_id').append('<option value="' + rListData[i].id + '">' + rListData[i].name + '</option>');
            }

        }
    })
}
function getTable1() {
    $("#userTable").bootstrapTable('destroy');
    var u_unit_id = $("#u_unit_id").val();
    var  province=$("#distpicker select[name='province']").val();
    var  city= $("#distpicker select[name='city']").val();
    var area= $(" #distpicker select[name='area']").val();

    var u_role_id = $("#u_role_id").val();
    var dateStatus = $("#dateStatus").val();
    var u_real_name = $("#u_real_name").val();
    var u_status = $("#u_status").val();
    $("#userTable").bootstrapTable(
        {
            method: "post",
            url: pathurl + "user/selectUsers?u_unit_id=" + u_unit_id
            + "&province=" + province + "&city=" + city + "&area=" + area + "&u_role_id=" + u_role_id + "&dateStatus="
            + dateStatus + "&u_real_name=" + u_real_name
            + "&u_status=" + u_status,
            pagination: true,
            toolbar: '#my-button',
            contentType: "application/x-www-form-urlencoded",
            queryParamsType: " limit",
            paginationDetailHAlign: "left",
            //paginationPreText : "上一页",
            //paginationNextText : "下一页",
            searchOnEnterKey: true,
            buttonsClass: "face",
            showExport: true,           //是否显示导出
            exportDataType: "basic",      //basic', 'all', 'selected'.
            responseHandler: function (data) {//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                var dataObj = data.result;
                return dataObj;
            }
        });
}

function typeFormatter(value) {
    switch (value) {
        case 0:
            return "APP";
        case 1:
            return "后台";
        case 2:
            return "通用";
    }
}
function statusFormatter(value) {
    switch (value) {
        case 'Y':
            return "正常用户";
        case 'N':
            return "停用用户";
    }
}
function nameformater(value,row) {
    return '<span class="hov" onclick="openinfo(\'' + row.uName + '\')">' + value + '</span>'
}
function sexFormatter(value) {
    if (value == 0) {
        return '男';
    } else {
        return '女';
    }
}
function unitFormatter(value) {
    var rn='';
    $.each(dListData,function (index) {
        if(value==dListData[index].did){
            return  rn= dListData[index].dname;
        }
    })
    return rn;
}

function reset() {
    $(".face-form select").val("-1");
    $('#u_status').val('Y');
    getTable1()
}
// 点击用户查看信息
function openinfo(username) {
    var openinofDom = $("#openinofModal .modal-body");
    $.ajax({
        type: 'post',
        url: pathurl + 'facelog/personInfo',
        data: {
            username: username
        },
        cache: false,
        success: function (data) {
            var dataresult = [], compareCount, idCardCount, loginCount, retrieveCount;

            dataresult = data.result[0];
            dataresult.compareCount = data.compareCount;
            dataresult.idCardCount = data.idCardCount;
            dataresult.loginCount = data.loginCount;
            dataresult.retrieveCount = data.retrieveCount;
            $('#openinfoTemp').tmpl(dataresult).appendTo(openinofDom);
            var unittext = $("#openinofModal .modal-body").find('.unit').text();

            $.each(dListData, function (index) {
                if (unittext == dListData[index].did) {
                    return $("#openinofModal .modal-body").find('.unit').html(dListData[index].dname)
                }
            })
            $("#openinofModal").modal();

        },

        error: function () {
            console.error("ajax error");
        }

    });
}
// 点击查看次数

$('#openinofModal .modal-body').on('click', ' .count', function () {

    var name = $('#openinofModal table .name').text().split(':')[1], index = $(this).index('.count');

    countinfo(name, index)

})
function countinfo(n, i) {

    $.ajax({
        type: 'post',
        url: pathurl + 'facelog/getShow',
        data: {
            username: n
        },
        cache: false,
        success: function (data) {
            $('#countModal #countbody').html('');
            var str = '';
            switch (i) {
                case 0:
                    var data = data.retrieveShow;
                    $.each(data, function (index, item) {
                        var index = index + 1;
                        str += '<tr><td>' + index + '</td><td>' + item.time + '</td></tr>'
                    })
                    $('#countModal #countbody').append(str)
                    break;
                case 1:
                    var data = data.compareShow;
                    $.each(data, function (index, item) {
                        var index = index + 1;
                        str += '<tr><td>' + index + '</td><td>' + item.time + '</td></tr>'
                    })
                    $('#countModal #countbody').append(str)
                    break;
                case 2:
                    var data = data.idCardShow;
                    $.each(data, function (index, item) {
                        var index = index + 1;
                        str += '<tr><td>' + index + '</td><td>' + item.time + '</td></tr>'
                    })
                    $('#countModal #countbody').append(str)
                    break;
                case 3:
                    var data = data.loginShow;
                    $.each(data, function (index, item) {
                        var index = index + 1;
                        str += '<tr><td>' + index + '</td><td>' + item.time + '</td></tr>'
                    })
                    $('#countModal #countbody').append(str)
                    break;
            }

            $("#countModal").modal();

        },

        error: function () {
            console.error("ajax error");
        }

    });
}