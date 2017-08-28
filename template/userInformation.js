$(function () {
    var select = $('#city-picker-search').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
    getTable()
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

    var u_unit_id = $("#u_unit_id").val();
    var u_role_id = $("#u_role_id").val();
    var dateStatus = $("#dateStatus").val();
    var u_real_name = $("#u_real_name").val();
    var u_status = $("#u_status").val();
    $("#userTable").bootstrapTable('destroy');

    $('#userTable').bootstrapTable({
        url: pathurl + "user/selectUsers?u_unit_id=" + u_unit_id
        + "&areacode=" + areacode + "&u_role_id=" + u_role_id + "&dateStatus="
        + dateStatus + "&u_real_name=" + u_real_name
        + "&u_status=" + u_status,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        queryParams: function (params) {
            var obj = {}
            obj.limit = params.limit;
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
        sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
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

function nameformater(value, row) {
    return '<span class="hov" onclick="openinfo(\'' + row.uName + '\')">' + value + '</span>'
}

function unitFormatter(value, row) {
    for (var m = 0; m < dListData.length; m++) {
        if (value == dListData[m].did) {
            return dListData[m].dname;
        }
    }
}

function sexFormatter(value) {
    if (value == 0) {
        return '男';
    } else {
        return '女';
    }
}

function reset() {
    $(".face-form select").val("-1");
    $('#u_status').val('Y');
    $('#city-picker-search .province a').html('请选择省份')
    $('#city-picker-search .city a').html('请选择省份')
    $('#city-picker-search .district a').html('请选择区县')
    $('#city-picker-search input').val("");
}

// 点击用户查看信息
function openinfo(username) {

    var openinofDom = $("#openinofModal .modal-body");
    openinofDom.html("");
    $.ajax({
        type: 'post',
        url: pathurl + 'facelog/personInfo',
        data: {
            username: username
        },
        cache: false,
        success: function (data) {
            var dataresult = [],
                compareCount,
                idCardCount,
                loginCount,
                retrieveCount,
                appCount,
                importCount;


            dataresult = data.result[0];
            dataresult.compareCount = data.compareCount;
            dataresult.idCardCount = data.idCardCount;
            dataresult.loginCount = data.loginCount;
            dataresult.retrieveCount = data.retrieveCount;
            dataresult.appCount = data.appCount;
            dataresult.importCount = data.importCount;
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

    $("#counttable").bootstrapTable('destroy');
    switch (i) {
        case 0:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/retrieveShow?username=' + n, //请求后台的URL（*）

                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'chosen',
                        title: '是否比中',
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                        }
                    }, {
                        field: 'harmful',
                        title: '是否有害'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img src=' + value + '/>'
                        }
                    }, {
                        field: 'remark',
                        title: '检索备注'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 1:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/compareShow?username=' + n, //请求后台的URL（*）

                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'chosen',
                        title: '是否比中',
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                        }
                    }, {
                        field: 'harmful',
                        title: '是否有害'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img src=' + value + '/>'
                        }
                    }, {
                        field: 'remark',
                        title: '检索备注'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 2:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/idCardShow?username=' + n, //请求后台的URL（*）

                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'chosen',
                        title: '是否比中',
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                        }
                    }, {
                        field: 'harmful',
                        title: '是否有害'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img src=' + value + '/>'
                        }
                    }, {
                        field: 'remark',
                        title: '检索备注'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 3:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/loginShow?username=' + n, //请求后台的URL（*）

                // url: './faceLog.json',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'chosen',
                        title: '是否比中',
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                        }
                    }, {
                        field: 'harmful',
                        title: '是否有害'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img src=' + value + '/>'
                        }
                    }, {
                        field: 'remark',
                        title: '检索备注'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 4:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/appLoginShow?username=' + n, //请求后台的URL（*）

                // url: './faceLog.json',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'devicetype',
                        title: 'APP类型'
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 5:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/importShow?username=' + n, //请求后台的URL（*）

                // url: './faceLog.json',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'name',
                        title: '真实姓名'
                    }, {
                        field: 'userdepart',
                        title: '部门'
                    }, {
                        field: 'userorgan',
                        title: '地区'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img src=' + value + '/>'
                        }
                    }, {
                        field: 'car_no',
                        title: '车牌号'
                    }, {
                        field: 'phone_no',
                        title: '手机号'
                    }
                ]
            });
            break;
    }
    $("#countModal .modal-title").text($($('.count')[i]).text());
    $("#countModal").modal();


}