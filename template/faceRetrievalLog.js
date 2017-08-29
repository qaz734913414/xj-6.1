$(function () {
    //1.初始化Table
    getTable()

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

});


//初始化Table
var token = window.localStorage.getItem('token');
// console.log(token)
if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token
        }
    });
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
    console.log(areacodeArr);
    var plat = $("#userdiv #plat").val() || '';
    var username=$("#userdiv #username").val() || '';
    var company = $("#userdiv #company").val() || '';
    var chosen = $("#userdiv #chosen").val() || '';
    var harmful = $("#userdiv #harmful").val() || '';
    var from = $("#userdiv #from").val() || '';
    var to = $("#userdiv #to").val() || '';
    console.log(username)
    $("#face-table").bootstrapTable('destroy');

    $('#face-table').bootstrapTable({
        url: pathurl + 'facelog/queryRetrieveLog?areacode=' + areacode +  '&username=' + username+'&plat=' + plat + '&company=' + company + '&chosen=' + chosen + '&harmful=' + harmful + '&from=' + from+ '&to=' + to,
        method: 'post',
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
       
        buttonsClass: "face",

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
            return res.result;
        },
        onLoadSuccess: function (data) {  //加载成功时执行
            // console.log(data)
        },
        rowAttributes: function (row, index) {
            return {
                "data-id": row.id
            }
        },
        columns: [{
            field: 'id',
            title: '序号',
            formatter: function (value, row, index) {
                return ++index;
            }
        }, {
            field: 'plat',
            title: '来源平台',
            formatter: function (value) {
                switch (value) {
                    case "0":
                        return "PC";
                    case "1":
                        return "android";
                    case "2":
                        return "IOS";
                }
            }
        }, {
            field: 'company',
            title: '算法',
            formatter: function (value) {
                <!--["0云创","1依图","2旷视","3商汤"];-->
                switch (value) {
                    case "0":
                        return "通道一";
                    case "1":
                        return "通道二";
                    case "2":
                        return "通道三";
                    case "3":
                        return "通道四";
                }
            }
        }, {
            field: 'username',
            title: '检索用户',
            formatter: function (value, row, index) {
                var e = '<span class="hov" onclick="openinfo(\'' + row.username + '\')">' + value + '</span> ';

                return e;
            }
        }, {
            field: 'u_real_name',
            title: '真实姓名',
        }, {
            field: 'dName',
            title: '工作单位'
        }, {
            field: 'url',
            title: '检索图片',
            formatter: function (value) {

                return '<div class="thumbnail imgToDetail"><img src="' + value + '" /></div>';
            }
        }, {
            field: 'chosen',
            title: '是否比中',
            formatter: function (value) {
                switch (value) {
                    case "0":
                        return "是";
                    case "1":
                        return "否";

                }
            }

        }, {
            field: 'harmful',
            title: '是否有害',
            formatter: function (value) {
                switch (value) {
                    case "0":
                        return "有害";
                    case "1":
                        return "无害";
                    case "2":
                        return "未知";
                }
            }
        }, {
            field: 'createTime',
            title: '检索时间',
        }, {
            field: 'remark',
            title: '检索事由',
            width: 150
        }, {
            field: 'longtutide',
            title: '经度'
        }, {
            field: 'laititude',
            title: '纬度'
        },]
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

// 导出
var token = window.localStorage.getItem('token');
$("#btn-export").on("click", function () {
    window.open(pathurl + 'export/expretriveLog?x-access-token=' + token)
});
var dListData;

// 初始化单位数组
function init() {

    $.ajax({
        type: 'POST',
        url: pathurl + 'user/initDeptAndRole',
        // url: './testJson/initDeptAndRole.json',
        success: function (data) {

            dListData = data.result.dList;
        },
        error: function () {
            console.log('请求单位数组失败');
        },
        dataType: 'json'
    });
}

init();

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


//页面展示详细信息
$("#face-table").delegate(".thumbnail", "click", function () {
    var logid = $(this).parents("tr").attr('data-id');
    var imgsDom = $("#retrieveLogModal .modal-body .row");

    imgsDom.html("");
    $.ajax({
        type: 'post',
        url: pathurl + 'facelog/retrieveImage',
        data: {
            logid: logid
        },
        cache: false,
        success: function (data) {

            //取图片结果信息
            $('#imgTemp').tmpl(data.result).appendTo(imgsDom);


            $("#retrieveLogModal").modal();


        },

        error: function () {
            console.error("ajax error");
        }

    });
});
// 点击查看次数
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
                method:'post',
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
                            return '<img width="130" height="180" src=' + value + '/>'
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
                method:'post',
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
                            return '<img width="130" height="180" src=' + value + '/>'
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
                method:'post',
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
                            return '<img width="130" height="180" src=' + value + '/>'
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

                method:'post',
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
                        title: '时间'
                    },  {
                        field: 'username',
                        title: '用户名'
                    }
                ]
            });
            break;
        case 4:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/appLoginShow?username=' + n, //请求后台的URL（*）

                method:'post',
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

                method:'post',
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
                            return '<img width="130" height="180" src=' + value + '/>'
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