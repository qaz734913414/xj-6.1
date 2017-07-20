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

    $("input#from,input#to").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        minView: 2,
        autoclose: true,
        inputMask: true
    });
    $('#from').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        minView: 2,
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

        $("#add-table").bootstrapTable('destroy');

        $('#add-table').bootstrapTable({
            url: pathurl+'msgpush/initTable', //请求后台的URL（*）

            // url: './testJson/message.json',
            method: 'post', //请求方式（*）
            toolbar: '#tapbar', //工具按钮用哪个容器
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
            // showExport: true, //是否显示导出
            exportDataType: "all", //basic', 'all', 'selected'.
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
                field: 'content',
                title: '发布消息',
                class:'mContent',
                formatter: function(value) {
                    return value
                }
            },{
                field: 'username',
                title: '发布人员',
                formatter: function(value) {
                    return value;
                }
            },{
                field: 'createTime',
                title: '发布时间',
                width : '15%',
                formatter: function(value) {
                    return value;
                }
            },
                
                // {
            //     title: '操作',
            //     cellStyle:function cellStyle(value, row, index, field) {
            //       return {
            //         classes: 'text-nowrap another-class',
            //         css: {
            //           'width':'250px',
            //           'overflow': 'hidden',
            //           'text-overflow':'ellipsis',
            //           'white-space': 'nowrap'
            //         }
            //       };
            //     },
            //     formatter: function(value, row, index) {
            //
            //         return ['<button type="button" id="reviseMessage" class="btn-sm btn face-button" style="margin-right:15px;">修改</button>',
            //     				'<button type="button" id="deleteMes" onclick="deleteMes('+row.mId+')" class="btn-sm btn face-button2" style="margin-right:15px;">删除</button>' ]
            //     				.join('');
            //     }
            // },
                {
                class:'hidden',
                formatter: function(value, row, index) {
                    return ['<input type="hidden" value="'+row.mId+'" id="mId" />',
                    '<input type="hidden" value="'+row.nTitle+'" id="nTitle" />',
                    '<input type="hidden" value="'+row.mTitle+'" id="mTitle" />',
                  '<input type="hidden" value="'+row.target+'" id="target" />' ].join('');
                }
            }]
        });
    };
// $('#add-table').bootstrapTable('hideColum', 'id');
    //得到查询的参数
    // var formData = new FormData($( "#uploadForm" )[0]);

    oTableInit.queryParams = function(params) {
      console.log(params)
      var username=$("#queryMesUser").val();
      var content=$("#queryMesText").val();
      var startTime=$("#from").val();
      var endTime=$("#to").val();

      if($("#from").val()==''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            content:$("#queryMesText").val(),
            // startTime:$("#from").val(),
            // endTime:$("#to").val(),
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit
        };
      }else if($("#from").val()!=''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            content:$("#queryMesText").val(),
            startTime:$("#from").val(),
            endTime:'2100-00-00 00:00',
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit
        };
      }else{
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            content:$("#queryMesText").val(),
            startTime:$("#from").val(),
            endTime:$("#to").val(),
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit
        };
      }

        console.log(temp)
        return temp;
    };
    return oTableInit;
}

//添加消息
function addMesBtn(){
  //弹出框
  $('#addMessageBox').modal('show');

}
$('#addMessageBox #continue').on('click',function(){

  var nTitle=$('#addMesTit').val();
  var mTitle=$('#addMesTitCon').val();
  var mContent=$('#addMes').val();
  var target=$('#addTarget').val();
  console.log(nTitle+'__'+mTitle+'__'+mContent+'__'+target);
  $.ajax({
    url:pathurl+'msgpush/insert',
    type:'post',
    data:{
      nTitle:nTitle,
      mTitle:mTitle,
      content:mContent,
      target:target
    },
    success:function(data){
      console.log(data)
      if(data.code==200){
        //提示框
        $('#addMessageBox').modal('hide');
        $('#promptBox').modal('show');
        $('#modal-body-text').html('消息已推送')
        $("#add-table").bootstrapTable('refresh');
          mis ();
      }else{
        //提示框
        $('#promptBox').modal('show');
        $('#modal-body-text').html(data.msg)
        //提示框确认按钮
      }
      $('#addMesTit').val('');
      $('#addMesTitCon').val('');
      $('#addMes').val('');
      $('#addTarget').val('1');
    }
  })
});
// // 删除按钮
// function deleteMes(mId){
//   console.log(mId);
//   $('#deleteBox #modal-body-text').html('确定是否删除');
//   $('#deleteBox').modal('show');
//
//   $('#promptBox #cancel').on('click',function(){
//     $('#promptBox').modal('show');
//     return;
//   });
//   $('#deleteBox #continue').on('click',function(){
//     $.ajax({
//       url:pathurl+'msgpush/delete',
//       // url:'./testJson/true.json',
//       data:{
//         id:mId
//       },
//       type:'post',
//       success:function(data){
//         if(data.code==200){
//           $('#addMessageBox').modal('hide');
//           $('#promptBox').modal('show');
//           $('#modal-body-text').html('删除成功');
//
//           $("#add-table").bootstrapTable('refresh');
//           oTable.Init();
//         }
//       }
//     })
//   });
//
// }
// //修改按钮
// $('#add-table').on('click','#reviseMessage',function(){
//
//   var parent=$(this).parents('tr');
//   var mId=parent.find('#mId').val();
//   $('#mId').val(mId);
//   $('#reviseMesTit').val(parent.find('#nTitle').val());
//   $('#reviseMesTitCon').val(parent.find('#mTitle').val());
//   $('#reviseMes').val(parent.find('.mContent').html());
//   $('#reviseTarget').find('option').eq(parent.find('#target').val()-1).prop('selected','selected');
//
//   $('#reviseMesBox').modal('show');
//
//   $('#reviseMesBox #cancel').on('click',function(){
//     $('#reviseMesBox').modal('hide');
//     $('#reviseMesTit').val('');
//     $('#reviseMesTitCon').val('');
//     $('#reviseMes').val('');
//   })
//
//
// })
// $('#reviseMesBox #continue').on('click',function(){
//   // $('#reviseTarget').val();
//   var mId=$('#mId').val();
//   var nTitle=$('#reviseMesTit').val();
//   var mTitle=$('#reviseMesTitCon').val();
//   var mContent=$('#reviseMes').val();
//   var target=$('#reviseTarget').val();
//   console.log(mId+'__'+nTitle+'__'+mTitle+'__'+mContent+'__'+target)
//
//
//   $.ajax({
//     url:pathurl+'messegepush/update',
//     // url:'./testJson/true.json',
//     type:'post',
//     data:{
//       id:mId,
//       nTitle:nTitle,
//       mTitle:mTitle,
//         content:mContent,
//       target:target
//     },
//     success:function(data){
//       if(data.code==200){
//         //提示框
//         $('#addMessageBox').modal('hide');
//         $('#promptBox').modal('show');
//         $('#modal-body-text').html('消息已修改')
//         $("#add-table").bootstrapTable('refresh');
//
//       }else{
//         //提示框
//         $('#promptBox').modal('show');
//         $('#modal-body-text').html(data.msg)
//         //提示框确认按钮
//       }
//       $('#reviseMesBox').modal('hide');
//       $('#reviseMesTit').val('');
//       $('#reviseMesTitCon').val('');
//       $('#reviseMes').val('');
//     },
//     error:function(){
//       $('#promptBox').modal('show');
//       $('#modal-body-text').html('服务器出错')
//     }
//   })
// })
//
//弹出框取消按钮
$('#addMessageBox #cancel').on('click',function(){
  $('#addMessageBox').modal('hide');
});
//提示框确认按钮
$('#promptBox #continue').on('click',function(){
  $('#promptBox').modal('hide');
})

//提示框
// $('#promptBox').modal('show');
//提示框确认按钮
$('#promptBox #continue').on('click',function(){
  $('#promptBox').modal('hide');
})
$('#queryreset').on('click',function(){
  $("#queryMesUser").val(''),
  $("#queryMesText").val(''),
  $("#from").val(''),
  $("#to").val(''),
  oTable.Init();
});
function ButtonInit() {
    var oInit = {};
    var postdata = {};

    oInit.Init = function() {
        $("#queryMes").on("click", function() {
            oTable.Init();

        });
    };
    return oInit;
}
function info(state) {
    //初始化table

    $("#infoTable").bootstrapTable('destroy');
    $("#infoTable").bootstrapTable({
        method: "post",
        url: pathurl + 'msgpush/msg',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
                username:$('#username').text()
            }
        },
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        pageList: [10, 25, 50, 100],
        onLoadSuccess: function (data) {  //加载成功时执行
            $('#infoModal').css('z-index', 1500);

            $('#infoModal').modal();

        }
    });

}