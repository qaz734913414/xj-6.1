var oTable;
$(function () {

    //1.初始化Table
    oTable = new TableInit();
    oTable.Init();
    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

    $(".mydate input").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        language: 'zh-CN',
        autoclose: true,
        inputMask: true,
    });


});

function TableInit() {
    var oTableInit = {};
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
    oTableInit.Init = function () {

        $("#face-table").bootstrapTable('destroy');

        $('#face-table').bootstrapTable({
            url: pathurl + 'facelog/queryRetrieveLog', //请求后台的URL（*）

            // url: './faceLog.json',
            method: 'post', //请求方式（*）
            toolbar: '.face-form', //工具按钮用哪个容器
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: false, //是否启用排序
            sortOrder: "asc", //排序方式
            // queryParamsType: "limit",
            queryParams: oTableInit.queryParams, //传递参数（*）
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页

            pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            // search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            // strictSearch: true,
            //  showColumns: true,                  //是否显示所有的列
            //  showRefresh: true,                  //是否显示刷新按钮
            // minimumCountColumns: 2,           //最少允许的列数
            // clickToSelect: true,                //是否启用点击选中行
            //height:$(document).height()-120,                       //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID", //每一行的唯一标识，一般为主键列
            // showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            showExport: true, //是否显示导出
            exportDataType: "basic", //basic', 'all', 'selected'.
            detailView: false, //是否显示父子表
            buttonsClass: "face",
            responseHandler: function (res) {
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                return res.result;
            },
            onLoadSuccess: function (data) {  //加载成功时执行
                console.log(data)
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
                    }
                }
            }, {
                field: 'username',
                title: '检索用户',
                formatter: function (value, row, index) {
                    var e = '<span class="hov" onclick="openinfo(\'' + row.username + '\')">' + value + '</span> ';

                    return e;
                }
            },{
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
                title: '检索时间'
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
    };
// $('#face-table').bootstrapTable('hideColum', 'id');
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        console.log($("#username").val())
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit, //页面大小
            offset: params.offset, //页码
            username: $("#rusername").val(),
            plat: $("#plat").val(),
            company: $("#company").val(),
            chosen: $("#chosen").val(),
            harmful: $("#harmful").val(),
            from: $("#from").val(),
            to: $("#to").val(),
            province: $("#distpicker select[name='province']").val(),
            city: $("#distpicker select[name='city']").val(),
            area: $("#distpicker select[name='area']").val(),
        };
        console.log(temp)
        return temp;
    };
    return oTableInit;
}


function ButtonInit() {
    var oInit = {};
    var postdata = {};

    oInit.Init = function () {
        $("#btn-query").on("click", function () {
            oTable.Init();

        });
        $("#btn-reset").on("click", function () {
            $(".face-form input,.face-form select").val("");
            oTable.Init();
        });
    };
    return oInit;
}
// 导出
$("#btn-export").on("click", function () {
    $.ajax({
        type: 'POST',
        url: pathurl + 'export/expretriveLog',
        data:{
            username: $("#rusername").val(),
            plat: $("#plat").val(),
            company: $("#company").val(),
            chosen: $("#chosen").val(),
            harmful: $("#harmful").val(),
            from: $("#from").val(),
            to: $("#to").val(),
            province: $("#distpicker select[name='province']").val(),
            city: $("#distpicker select[name='city']").val(),
            area: $("#distpicker select[name='area']").val(),
        },
        success: function (data) {

            console.log('export' + data);
        },
        error: function () {
            console.log('export失败');
        },
        dataType: 'json'
    });
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
            console.log('dListData' + dListData);
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