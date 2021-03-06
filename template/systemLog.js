var token = window.localStorage.getItem('token');
// console.log(token)
if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token
        }
    });
}

$(function () {

    $("#from").datetimepicker({
        startView:2,
        format:"yyyy-mm-dd",
        minView:"month",
        todayBtn : "linked",
        todayHighlight : true,
        language: "zh-CN",
        showMeridian:true,
        autoclose:true,
    }).on('changeDate',function(ev){
        var starttime=$("#from").val();
        $("#to").datetimepicker('setStartDate',starttime);
        $("#from").datetimepicker('hide');
    });

    $("#to").datetimepicker({
        startView:2,
        minView:"month",
        format:"yyyy-mm-dd",
        todayBtn : "linked",
        todayHighlight : true,
        language: "zh-CN",
        autoclose:true,
        showMeridian:true,
    }).on('changeDate',function(ev){
        var starttime=$("#from").val();
        var endtime=$("#to").val();
        $("#from").datetimepicker('setEndDate',endtime);
        $("#to").datetimepicker('hide');
    });
    var select = $('#city-picker-search').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
    getTable();
});
//组织机构初始化下拉框
var unitlist = [];
$.ajax({
    type: 'POST',
    url: pathurl + 'department/initDeptList',
    success: function (data) {
        unitlist = data.list, len = unitlist.length, str = '';
        for (var i = 0; i < len; i++) {
            str += ' <option value=' + unitlist[i].did + '>' + unitlist[i].dname + '</option>'

        }
        ;
        $('#uUnit').append(str);
    },
    error: function () {
        $("#modal-body-text").text("删除失败!");
        $("#myModalLabel").modal();
    }
});

$('#userdiv input').on('input propertychange', function () {
    getTable()
})
$('#userdiv select').on('input propertychange', function () {
    getTable()
})
$('#userdiv .selector-item').on('input propertychange', function () {
    getTable()
})

$('#userdiv a.selector-name').on('click', function () {
    $('#userdiv .selector-item ul li').each(function (i, val) {
        $(val).on('click', function () {
            setTimeout(function () {
                getTable()
            })
        })
    })
})

function getTable() {
    // 地区选择编码
    var areacodeArr = [], areanameArr = [];
    var pr = $("#userdiv input[name='userProvinceId']").val() || '';
    areacodeArr.push(pr)
    var ci = $("#userdiv input[name='userCityId']").val() || '';
    areacodeArr.push(ci)
    var di = $("#userdiv input[name='userDistrictId']").val() || '';
    areacodeArr.push(di)


    var prn = $("#userdiv .province>a").text() || '';
    areanameArr.push(prn)
    var cin = $("#userdiv .city>a").text() || '';
    areanameArr.push(cin)
    var din = $("#userdiv .district>a").text() || '';
    areanameArr.push(din)
    var areacode = regk(areacodeArr).substr(1)
    var areaname = regk(areanameArr).substr(1)

    var logUser = $("#susername").val()||'';

    var startTime = $("#from").val()||'';
    var endTime = $("#to").val()|| new Date();
    var unit = $("#uUnit").val() || '1';

    $(".systemLog-table").bootstrapTable('destroy');

    $('.systemLog-table').bootstrapTable({
        url: pathurl + 'systemlog/initTable?areacode=' + areacode + '&logUser=' + logUser + '&unit=' + unit + '&startTime=' + startTime + '&endTime=' + endTime,
        method:'post',
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

        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        sortable: true, //是否启用排序
        sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
        responseHandler: function (res) {
            //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            //在ajax后我们可以在这里进行一些事件的处理
            return res;
        },
        onLoadSuccess: function (data) { //加载成功时执行
            console.log(data)
        },
        rowAttributes: function (row, index) {
            return {
                "data-idCard": row.idno
            }
        },
        columns: [{
            field: 'id',
            title: '序号',
            formatter: function (value, row, index) {
                return ++index;
            }
        }, {
            field: 'log_content',
            title: '操作详情',
            formatter: function (value) {
                return '<p>' + value + '</p>';
            }
        }, {
            field: 'uUnit',
            title: '单位',
            formatter: unitFormatter

        }, {
            field: 'log_user',
            title: '操作人',
            formatter: function (value) {
                return value;
            }
        }, {
            field: 'log_menu',
            title: '操作模块',
            formatter: function (value) {
                return value;
            }
        }, {
            field: 'createTime',
            title: '操作时间',
            formatter: function (value) {
                return value;
            }
        }, {
            field: 'ip',
            title: 'IP',
            formatter: function (value) {
                return value;
            }
        }, {
            field: 'type',
            title: '类型',
            formatter: function (value) {
                return value == 0 ? 'PC' : '移动';
            }
        }]
    });

}

$("#btn-query").on("click", function () {
    getTable()

});
$("#btn-reset").on("click", function () {
    $(".face-form input,.face-form select").val("");
    $('#city-picker-search .province a').html('请选择省份')
    $('#city-picker-search .city a').html('请选择省份')
    $('#city-picker-search .district a').html('请选择区县')
    $('#city-picker-search input').val("");
    getTable()
});

function unitFormatter(value) {
    var rn = '';
    $.each(dListData, function (index) {
        if (value == dListData[index].did) {
            return rn = dListData[index].dname;
        }
    })
    return rn;
}
