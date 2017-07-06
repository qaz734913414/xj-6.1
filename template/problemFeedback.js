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
    var token = window.localStorage.getItem('token');
    // console.log(token)
    if (token) {
        $.ajaxSetup({
            headers: {
                'x-access-token': token
            }
        });
    }
    oTableInit.Init = function() {

        $("#problem").bootstrapTable('destroy');

        $('#problem').bootstrapTable({
            url: pathurl+'answer/initTable', //请求后台的URL（*）

            // url: './testJson/answerInitTable.json',
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
            // showExport: true, //是否显示导出
            exportDataType: "basic", //basic', 'all', 'selected'.
            detailView: false, //是否显示父子表
            buttonsClass: "face",
            onLoadSuccess: function(data){  //加载成功时执行
              console.log(data)
            },
            // rowAttributes:function(row,index) {
            //   return {
            //       "data-id": row.id
            //   }
            // },
            columns: [{
                title: '序号',
                formatter: function(value, row, index) {
                    return index+1;
                    console.log(index)
                }
            },{
                title: '问题描述',
                valign:'top',
                class:'question',
                formatter: function(value, row, index) {
                    console.log(row);
                    return  '<div><p>[提问人]：'+row.fName+'<span>'+row.qTime+'</span></p><p>'+row.fDetail+'</p></div>'
                }
            },{
                field: 'company',
                title: '回复详情',
                valign:'top',
                class:'answer',
                formatter: function(value, row, index) {
                    console.log(row);
                    var aName=row.aName||'';
                    var aDetail=row.aDetail||'';
                    var aTime=row.aTime||'';
                    return  '<div><p>[回复人]：'+aName+'<span>'+aTime+'</span></p><p>'+aDetail+'</p></div>'
                }
            },{
                field: 'status',
                title: '问题状态',
                formatter: function(value) {
                  switch (value) {
                      case "Y":
                          return "已回复";
                      case "N":
                          return "未回复";
                  }
                }
            },{
                title: '操作',
                formatter: function(value, row, index) {
                    if(row.status=='Y'){
                      return '<button type="button" class="btn-sm btn face-button" disabled="disabled" style="margin-right:15px;">已回复</button>';
                    }else{
                      return '<button type="button" class="btn-sm btn face-button" onclick="problemCompany('+row.aId+')" style="margin-right:15px;">回复</button>'
                    }

                }
            }]
        });
    };
// $('.face-table').bootstrapTable('hideColum', 'id');
    //得到查询的参数
    oTableInit.queryParams = function(params) {
      console.log(params)
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的

            fName:$("#userName").val(),
            fTelephone:$("#userPhone").val(),
            startTime:$("#from").val(),
            endStart:$("#to").val(),
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit,
            status:$("#status").val(),
        };
        console.log(temp)
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
            $("#problem input,#problem select").val("");
            oTable.Init();
        });
    };
    return oInit;
}
function problemCompany(aId){
  console.log(aId)
  $("#companyModel").modal('show');
  $("#companyModel #cancel").click(function() {//取消
    $("#companyModel").modal('hide');
    $('#companyContent').val('')
  })
  var aId=aId;
  $("#companyModel #continue").click(function() {//确定
      var detail=$('#companyContent').val();
      console.log(detail);
      console.log(aId)
      $.ajax({
          type: 'POST',
          url: pathurl+'answer/update',
          // url:'./testJson/false.json',
          data:{
            aId:aId,
            detail:detail
          },
          success: function(data) {
            if(data.code==200){
              console.log('回复成功')
              $("#promptBox #modal-body-text").text("回复成功!");
              $("#promptBox").modal('show');
              $(".face-table").bootstrapTable('refresh');
            }else{
              $("#promptBox #modal-body-text").text(data.msg);
              $("#promptBox").modal('show');
            }
            oTable.Init();
          },
          error: function() {
            console.log('出错')
              $("#promptBox #modal-body-text").text("处理失败!");
              $("#promptBox").modal('show');
          }
      });
      $('#companyContent').val('')
  });
}
