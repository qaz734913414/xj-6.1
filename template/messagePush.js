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

        $(".face-table").bootstrapTable('destroy');

        $('.face-table').bootstrapTable({
            url: pathurl+'messagepush/initTable', //请求后台的URL（*）

            // url: './testJson/message.json',
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
                field: 'mContent',
                title: '发布消息',
                class:'mContent',
                formatter: function(value) {
                    return '<p>'+value+'</p>';
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
                formatter: function(value) {
                    return value;
                }
            },{
                field: 'updateTime',
                title: '更新时间',
                formatter: function(value) {
                    return value;
                }
            },{
                field: 'status',
                title: '推送状态',
                formatter: function(value) {
                  switch (value) {
                      case "Y":
                          return "已推送";
                      case "N":
                          return "未推送";
                  }
                }
            },{
                title: '操作',
                formatter: function(value, row, index) {

                    return ['<button type="button" id="reviseMessage" class="btn-sm btn face-button" style="margin-right:15px;">修改</button>',
                				'<button type="button" id="deleteMes" onclick="deleteMes('+row.mId+')" class="btn-sm btn face-button2" style="margin-right:15px;">删除</button>' ]
                				.join('');
                }
            },{
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
// $('.face-table').bootstrapTable('hideColum', 'id');
    //得到查询的参数
    // var formData = new FormData($( "#uploadForm" )[0]);

    oTableInit.queryParams = function(params) {
      console.log(params)
      var username=$("#queryMesUser").val();
      var mContent=$("#queryMesText").val();
      var startTime=$("#from").val();
      var endTime=$("#to").val();

      if($("#from").val()==''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            mContent:$("#queryMesText").val(),
            // startTime:$("#from").val(),
            // endTime:$("#to").val(),
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit
        };
      }else if($("#from").val()!=''&&$("#to").val()==''){
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            mContent:$("#queryMesText").val(),
            startTime:$("#from").val(),
            endTime:'2100-00-00 00:00',
            pageNumber:Math.ceil(params.offset/params.limit)+1,
            pageSize:params.limit
        };
      }else{
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // username:$("#queryMesUser").val(),
            username:$("#queryMesUser").val(),
            mContent:$("#queryMesText").val(),
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

//添加
function addMesBtn(){
  //弹出框
  $('#addMessageBox').modal('show');
  //弹出框确定按钮



  // 判断文本框不能有特殊字符
  // var num=0;
  // $('.form-group.addMessage #addMes').on('input propertychange',function(){
  //   console.log('改变了'+ ++num)
  // })
  // $('.form-group.addMessage #addMes').onkeypress

}
$('#addMessageBox #continue').on('click',function(){

  var nTitle=$('#addMesTit').val();
  var mTitle=$('#addMesTitCon').val();
  var mContent=$('#addMes').val();
  var target=$('#addTarget').val();
  console.log(nTitle+'__'+mTitle+'__'+mContent+'__'+target);
  $.ajax({
    url:pathurl+'messagepush/insert',
    type:'post',
    data:{
      nTitle:nTitle,
      mTitle:mTitle,
      mContent:mContent,
      target:target
    },
    success:function(data){
      console.log(data)
      if(data.code==200){
        //提示框
        $('#addMessageBox').modal('hide');
        $('#promptBox').modal('show');
        $('#modal-body-text').html('消息已推送')
        $(".face-table").bootstrapTable('refresh');

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
// 删除按钮
function deleteMes(mId){
  console.log(mId);
  $('#deleteBox #modal-body-text').html('确定是否删除');
  $('#deleteBox').modal('show');

  $('#promptBox #cancel').on('click',function(){
    $('#promptBox').modal('show');
    return;
  });
  $('#deleteBox #continue').on('click',function(){
    $.ajax({
      url:pathurl+'messagepush/delete',
      // url:'./testJson/true.json',
      data:{
        id:mId
      },
      type:'post',
      success:function(data){
        if(data.code==200){
          $('#addMessageBox').modal('hide');
          $('#promptBox').modal('show');
          $('#modal-body-text').html('删除成功');

          $(".face-table").bootstrapTable('refresh');
          oTable.Init();
        }
      }
    })
  });

}
//修改按钮
$('.face-table').on('click','#reviseMessage',function(){

  var parent=$(this).parents('tr');
  var mId=parent.find('#mId').val();
  $('#mId').val(mId);
  $('#reviseMesTit').val(parent.find('#nTitle').val());
  $('#reviseMesTitCon').val(parent.find('#mTitle').val());
  $('#reviseMes').val(parent.find('.mContent p').html());
  $('#reviseTarget').find('option').eq(parent.find('#target').val()-1).prop('selected','selected');

  $('#reviseMesBox').modal('show');

  $('#reviseMesBox #cancel').on('click',function(){
    $('#reviseMesBox').modal('hide');
    $('#reviseMesTit').val('');
    $('#reviseMesTitCon').val('');
    $('#reviseMes').val('');
  })


})
$('#reviseMesBox #continue').on('click',function(){
  // $('#reviseTarget').val();
  var mId=$('#mId').val();
  var nTitle=$('#reviseMesTit').val();
  var mTitle=$('#reviseMesTitCon').val();
  var mContent=$('#reviseMes').val();
  var target=$('#reviseTarget').val();
  console.log(mId+'__'+nTitle+'__'+mTitle+'__'+mContent+'__'+target)


  $.ajax({
    url:pathurl+'messagepush/update',
    // url:'./testJson/true.json',
    type:'post',
    data:{
      id:mId,
      nTitle:nTitle,
      mTitle:mTitle,
      mContent:mContent,
      target:target
    },
    success:function(data){
      if(data.code==200){
        //提示框
        $('#addMessageBox').modal('hide');
        $('#promptBox').modal('show');
        $('#modal-body-text').html('消息已修改')
        $(".face-table").bootstrapTable('refresh');

      }else{
        //提示框
        $('#promptBox').modal('show');
        $('#modal-body-text').html(data.msg)
        //提示框确认按钮
      }
      $('#reviseMesBox').modal('hide');
      $('#reviseMesTit').val('');
      $('#reviseMesTitCon').val('');
      $('#reviseMes').val('');
    },
    error:function(){
      $('#promptBox').modal('show');
      $('#modal-body-text').html('服务器出错')
    }
  })
})

//弹出框取消按钮
$('#addMessageBox #cancel').on('click',function(){
  $('#addMessageBox').modal('hide');
});
//提示框确认按钮
$('#promptBox #continue').on('click',function(){
  $('#promptBox').modal('hide');
})

// //提示框
// $('#promptBox').modal('show');
// //提示框确认按钮
// $('#promptBox #continue').on('click',function(){
//   $('#promptBox').modal('hide');
// })
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
