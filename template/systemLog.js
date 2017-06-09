var token = window.localStorage.getItem('token');
// console.log(token)
if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token
        }
    });
}

var oTable;
$(function() {

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
    $('#from').datetimepicker({
      format: 'yyyy-mm-dd hh:ii',
      language: 'zh-CN',
      autoclose: true,
      inputMask: true
    }).on('changeDate',function(){
      var startTime=$('#from').val();
      $('#to').datetimepicker('setStartDate',startTime);
      $('#to').datetimepicker('hide');
    });

});

function TableInit() {
    var oTableInit = {};
    //初始化Table
    oTableInit.Init = function() {

        $(".systemLog-table").bootstrapTable('destroy');

        $('.systemLog-table').bootstrapTable({
            url: pathurl+'systemlog/initTable', //请求后台的URL（*）
            // url: './testJson/queryIdcardLog.json',
            method: 'post', //请求方式（*）
            toolbar: '.face-form', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "desc", //排序方式asc  desc
            // queryParamsType: "limit",
            queryParams: oTableInit.queryParams, //传递参数（*）
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1, //初始化加载第一页，默认第一页
            pageSize:4, //每页的记录行数（*）
            pageList: [4, 10, 25, 50, 100], //可供选择的每页的行数（*）
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
            responseHandler: function(res) {
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                return res;
            },
            onLoadSuccess: function(data) { //加载成功时执行
                console.log(data)
            },
            rowAttributes: function(row, index) {
                return {
                    "data-idCard": row.idno
                }
            },
            columns: [{
                field: 'id',
                title: '序号',
                formatter: function(value, row, index) {
                    return ++index;
                }
            }, {
                field: 'log_content',
                title: '操作详情',
                formatter: function(value) {
                    return '<p>'+value+'</p>';
                }
            }, {
                field: 'log_user',
                title: '操作人',
                formatter: function(value) {
                    return value;
                }
            }, {
                field: 'log_menu',
                title: '操作模块',
                formatter: function(value) {
                    return value;
                }
            }, {
                field: 'createTime',
                title: '操作时间',
                formatter: function(value) {
                    return value;
                }
            }, {
                field: 'ip',
                title: 'IP',
                formatter: function(value) {
                    return value;
                }
            }, {
                field: 'type',
                title: '类型',
                formatter: function(value) {
                    return value==0?'PC':'移动';
                }
            } ]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
      var logUser=$("#susername").val();
      var startTime=$("#from").val();
      var endTime=$("#to").val();
      console.log(logUser=='')
      console.log(startTime=='')
      console.log(endTime=='')
      if($("#from").val()==''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNumber: params.offset/params.limit+1, //页码
            logUser:$("#susername").val(),
            // // startTime:$("#from").val(),
            // endTime:$("#to").val()
        };
      }else if($("#from").val()!=''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNumber: params.offset/params.limit+1, //页码
            logUser:$("#susername").val(),
            startTime:$("#from").val(),
            endTime:'2100-00-00 00:00'
        };
      }else{
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNumber: params.offset/params.limit+1, //页码
            logUser:$("#susername").val(),
            startTime:$("#from").val(),
            endTime:$("#to").val()
        };
      }
      return temp;

    };
    return oTableInit;
}


function ButtonInit() {
    var oInit = {};
    var postdata = {};

    oInit.Init = function() {
        $("#btn-query").on("click", function() {
            oTable.Init();

        });
        $("#btn-reset").on("click", function() {
            $(".face-form input,.face-form select").val("");
            oTable.Init();
        });
    };
    return oInit;
}
