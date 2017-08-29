$(function () {


    $("input#from,input#to").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        minView: 2,
        autoclose: true,
        inputMask: true
    });
    $('.mydate #from').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        minView: 2,
        autoclose: true,
        inputMask: true
    }).on('changeDate', function () {
        var startTime = $('#from').val();
        $('#to').datetimepicker('setStartDate', startTime);
        $('#to').datetimepicker('hide');
    });
    gettable();
});
$('.face-form input').on('input propertychange', function () {
    gettable()
})
$('.face-form select').on('input propertychange', function () {
    gettable()
})
function gettable() {

    var token = window.localStorage.getItem('token');
    if (token) {
        $.ajaxSetup({
            headers: {
                'x-access-token': token
            }
        });
    }
    ;
    var fName = $("#userName").val(),
        fTelephone = $("#userPhone").val(),
        startTime = $("#from").val(),
        endStart = $("#to").val(),
        status = $("#status").val();
    $("#problem").bootstrapTable('destroy');

    $('#problem').bootstrapTable({
        url: pathurl + "answer/initTable?fName=" + fName + "&fTelephone=" + fTelephone + "&startTime=" + startTime + "&endStart=" + endStart + "&status=" + status,
        method: 'post',
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        queryParams: function (params) {
            var obj = {}
            obj.pageNumber = Math.ceil(++params.offset / params.limit);
            obj.pageSize = params.limit;
            obj.offset = params.offset;
            obj.limit = params.limit;
            obj.order = params.order;
            if (params.sort) {
                obj.sort = params.sort;
            }
            if (params.search) {
                obj.search = params.search;
            }
            return obj
        },
        //      search: true,
        //		height:$(document).height()-130,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        sortable: true, //是否启用排序
        //      sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
        onLoadSuccess: function (data) {  //加载成功时执行
            console.log(data)
        },
        // rowAttributes:function(row,index) {
        //   return {
        //       "data-id": row.id
        //   }
        // },
        columns: [{
            title: '序号',
            formatter: function (value, row, index) {
                return index + 1;
                console.log(index)
            }
        }, {
            field: 'fName',
            title: '提问人',

        }, {
            field: 'telephone',
            title: '提问人手机号',

        }, {
            field: 'qTime',
            title: '提问时间',

        }, {
            field: 'fDetail',
            title: '问题描述',

        }, {
            field: 'aName',
            title: '回复人',

        }, {
            field: 'aTime',
            title: '回复时间',

        }, {
            field: 'aDetail',
            title: '回复描述',

        }, {
            field: 'status',
            title: '问题状态',
            formatter: function (value) {
                switch (value) {
                    case "Y":
                        return "已回复";
                    case "N":
                        return "未回复";
                }
            }
        }, {
            title: '操作',
            formatter: function (value, row, index) {
                if (row.status == 'Y') {
                    return '<button type="button" class="btn-sm btn face-button" disabled="disabled" style="margin-right:15px;">已回复</button>';
                } else {
                    return '<button type="button" data-id="button6" class="pcode btn-sm btn face-button" onclick="problemCompany(' + row.aId + ')" style="margin-right:15px;">回&#12288;复</button>'
                }

            }
        }]
    });
}



$("#btn-query").on("click", function () {
    gettable();

});
$("#btn-reset").on("click", function () {
    $(".face-form input,.face-form select").val("");
    gettable();
});



function problemCompany(aId) {
    console.log(aId)
    $("#companyModel").modal('show');
    $("#companyModel #cancel").click(function () {//取消
        $("#companyModel").modal('hide');
        $('#companyContent').val('')
    })
    var aId = aId;
    $("#companyModel #continue").click(function () {//确定
        var detail = $('#companyContent').val();
        console.log(detail);
        console.log(aId)
        $.ajax({
            type: 'POST',
            url: pathurl + 'answer/update',
            // url:'./testJson/false.json',
            data: {
                aId: aId,
                detail: detail
            },
            success: function (data) {
                if (data.code == 200) {
                    console.log('回复成功')
                    $("#promptBox #modal-body-text").text("回复成功!");
                    $("#promptBox").modal('show');
                    $(".face-table").bootstrapTable('refresh');
                } else {
                    $("#promptBox #modal-body-text").text(data.msg);
                    $("#promptBox").modal('show');
                }
                oTable.Init();
            },
            error: function () {
                console.log('出错')
                $("#promptBox #modal-body-text").text("处理失败!");
                $("#promptBox").modal('show');
            }
        });
        $('#companyContent').val('')
    });
}
