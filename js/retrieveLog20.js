

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


});

function TableInit() {
    var oTableInit = {};
    //初始化Table
    oTableInit.Init = function() {

        $(".face-table").bootstrapTable('destroy');

        $('.face-table').bootstrapTable({
            url: 'http://192.168.0.169:8080/FaceManage/facelog/queryRetrieveLog', //请求后台的URL（*）
            // url: './faceLog.json',
            method: 'post', //请求方式（*）
            toolbar: '.face-form', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: false, //是否启用排序
            sortOrder: "asc", //排序方式
            // queryParamsType: "limit",
            queryParams: oTableInit.queryParams, //传递参数（*）
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 4, //每页的记录行数（*）
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
            columns: [{
                field: 'id',
                title: '序号',
                formatter: function(value, row, index)  {
                  return ++index;
                }
            }, {
                field: 'plat',
                title: '来源平台',
                formatter: function(value) {
                    switch (value) {
                        case "0":
                            return "App";
                        case "1":
                            return "后台";
                    }
                }
            }, {
                field: 'company',
                title: '厂商',
                formatter: function(value) {
                    switch (value) {
                        case "0":
                            return "云创";
                        case "1":
                            return "依图";
                        case "2":
                            return "旷视";
                    }
                }
            }, {
                field: 'username',
                title: '检索用户'
            }, {
                field: 'url',
                title: '检索图片',
                formatter: function(value) {
                    return '<div class="thumbnail"><img src="'+value+'" /></div>';
                }
            }, {
                field: 'url',
                title: '对比',
                formatter: function(value) {
                    return '<div class="thumbnail"><img src="'+value+'" /></div>';
                }
            }, {
                field: 'longtutide',
                title: '相似度'
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
            }, ]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit, //页面大小
            offset: params.offset, //页码
            username: $("#username").val(),
            plat: $("#plat").val(),
            company: $("#company").val(),
            //chosen: $("#chosen").val(),
            //harmful: $("#harmful").val(),
            from: $("#from").val(),
            to: $("#to").val()
        };
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




//页面展示详细信息
$(".face-table").delegate(".thumbnail", "click", function() {
    var reqId = $(this).parents("tr").find("td:first-child").text();
    var imgsDom = $("#retrieveLogModal .modal-body .row");
    imgsDom.html("");
    $.ajax({
        type: 'post',
        url: 'http://192.168.0.169:8080/FaceManage/facelog/retrieveImage',
        data: {
          reqId:reqId
        },
        cache: false,
        success: function(data) {
            console.log(data);
            //取图片结果信息
            console.log(data.result);
            $('#imgTemp').tmpl(data.result).appendTo(imgsDom);
            /* $.each(data.imgs,function(key,val){
            	console.log(key);
            	console.log(val.idNo+"  "+val.sex+"  "+val.percent+"   "+val.name+"   "+val.url);
            	console.log("---------------------");
            	console.log(val);

            }); */

            $("#retrieveLogModal").modal();

            /* if(info.logImgUrl!=""){
            	$("#imageInfo").html(
            			' <div class="col-sm-6 col-md-6">'+
            	        '   	  <h5>比中图片</h5> '+
            			'	    <div class="thumbnail">'+
            			'	      <img  src="'+info.logImgUrl+'" alt="...">'+
            			'	    </div>'+
            			'	  </div>'+
            			'	    <div class="col-sm-6 col-md-6">'+
            			'   	<div class="caption">'+
            								'  	 <h5>&nbsp</h5>'+
            		   ( info.idNo==""?'':'        <p>身份证号：'+info.idNo+'</p>')+
            			(info.name==""?'':'        <p>姓名：'+info.name+'</p>')+
            		   ( info.sex==""?'':'        <p>性别：'+info.sex+'</p>')+
            		   (	info.carNo==""?'':'        <p>车牌号：'+info.carNo+'</p>')+
            			(info.phoneNo==""?'':'        <p>手机号：'+info.phoneNo+'</p>')+
            			'      </div>'+
            			'  </div>'
            	);
            } */

        },

        error: function() {
            console.error("ajax error");
        }

    });
});
