var token = window.localStorage.getItem('token');
// console.log(token)
if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token
        }
    });
}

getTable();
// 	table
function getTable() {   //表格初始化
  console.log('aaaaaaaaa')
  $("#systemSetting").bootstrapTable('destroy');
  $("#systemSetting").bootstrapTable({
    method : "post",
    url : pathurl+"parameter/list",
    // url:'http://192.168.0.169:8080/FaceManage/parameter/list',
    // url:'./testJson/parameteList.json',
    striped: true, //是否显示行间隔色
    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true, //是否显示分页（*）
    sortable: false, //是否启用排序
    sortOrder: "asc", //排序方式
    pageList: [10, 25, 50, 100],
    // queryParamsType: "limit",
    queryParams: function (params) {//这个是设置查询时候的参数，我直接在源码中修改过，不喜欢offetset 我后台用的 是pageNo. 这样处理就比较的满足我的要求，其实也可以在后台改，麻烦！
      console.log(params)
      var querySystemSet=$('#querySystemSet').val();
      if(querySystemSet==-1){
        var temp={
          // type:'',
          pageNumber:params.offset/params.limit+1,
          pageSize:params.limit
        }
      }else{
        var temp={
          type:$('#querySystemSet').val(),
          pageNumber:params.offset/params.limit+1,
          pageSize:params.limit
        }
      }

      return temp;
    },
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

    exportDataType: "basic", //basic', 'all', 'selected'.
    detailView: false, //是否显示父子表
    buttonsClass: "face",
    responseHandler:function(data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                                    //在ajax后我们可以在这里进行一些事件的处理
      var dataObj=data.result;
      return dataObj;
    },
    onLoadSuccess: function(data){  //加载成功时执行
      console.log(data);

    },
    columns: [{
        title: '序号',
        formatter: function(value, row, index) {
            return ++index;
            console.log(index)
        }
    },{
        field: 'pKey',
        title: '参数类别',
        formatter: function(value) {
          if(value==0){
            return '<span class="pKey">即将到期</span>';
          }else if(value==1){
            return '<span class="pKey">比中返回照片数量</span>';
          }else if(value==2){
            return '<span class="pKey">处理结果</span>';
          }

        }
    },{
        field: 'pValue',
        title: '参数类别值',
        formatter: function(value) {
            return '<span class="pvalue">'+value+'</span>';
        }
    },{
        title: '操作',
        formatter: function(value, row, index) {
          return [
              '<button type="button" data-id="button1" class="pcode updateBtn btn-sm btn face-button" style="margin-right:15px;">修改</button>',
              '<button type="button" data-id="button2" class="pcode removeBtn btn-sm btn face-button2" style="margin-right:15px;">删除</button>' ]
              .join('');
        }
    },{
        class:'hidden',
        formatter: function(value, row, index) {
          return ['<input type="hidden" value="'+row.pId+'" id="pId" />',
        '<input type="hidden" value="'+row.pKey+'" id="pkey" />',
      '<input type="hidden" value="'+row.pValue+'" id="pvalue" />'].join('');
        }
    }]
  });
}




// function classChange(){
//   var parameter=[
//       ["是","否","未知"],
//       ["App","平台","网站"],
//       ["云创","依图","旷世","商汤"],
//       ["App","平台","通用"],
//       ["已到期","即将到期","未到期"]
//   ];
//   $('#parameterClassVal').html('');
//   if($('#parameterClass').val()==-1){
//     $('#parameterClassVal').append('<option value="-1">参数类别值</option>');
//     return;
//   }
//   //
//   var parameterClass=$('#parameterClass').val();
//   console.log(parameterClass)
//   var parameterClassVal=$('#parameterClassVal');
//   for(var i=0;i<parameter.length;i++){
//     if(parameterClass==i){
//       for(var j=0;j<parameter[i].length;j++){
//         parameterClassVal.append('<option value="'+parameter[i][j]+'">'+parameter[i][j]+'</option>');
//       }
//     }
//   }
//
// }

// function addsystemSet(tit){
//   var tit=tit||'新建参数';
//   $('#systemSetModalLabel').html(tit);
//   $('#systemSetModal').modal('show');
//
// }
// $('#systemSetSubmit').on('click',function(){   //添加
//
//   var pkey=$('#parameterClass').val();
//   var pvalue=$('#parameterClassVal').val();
//   if(pkey==-1||pvalue==-1){
//     $('#promptTit').html('提示');
//     $('#prompt-text').html('请选择参数');
//     $('#promptBox').modal('show');
//     return;
//   }
//   $.ajax({
//     url:pathurl+'parameter/add',
//     // url:'./testJson/true.json',
//     data:{
//       pkey:pkey,
//       pvalue:pvalue
//     },
//     type:'post',
//     success:function(data){
//       console.log(data.code)
//       if(data.code==200){
//         $('#systemSetModal #parameterClass').find('option').eq(0).prop('selected','selected');//.eq(0).props('selected','selected');
//         $('#parameterClassVal').html('<option value="-1">参数类别值</option>');
//         $("#systemSetting").bootstrapTable('refresh');
//
//         $('#systemSetModal').modal('hide');
//         // promptBox promptTit prompt-text
//         $('#promptTit').html('提示');
//         $('#prompt-text').html('添加成功');
//         $('#promptBox').modal('show');
//       }else{
//         console.log('hahahahah')
//         $('#promptTit').html('提示');
//         $('#prompt-text').html(data.result);
//         $('#promptBox').modal('show');
//       }
//
//     }
//   })
// })
$(function () {


$('#systemSetting').on('click','.removeBtn',function(){   //删除按钮
  var pId=$(this).parents('tr').find('#pId').val();
  $('#pId').val(pId);
  $('#delPrompt-text').html('确定要删除吗？')
  $('#delPromptBox').modal('show');
});

$('#delPromptBox #delPromptBtn').on('click',function(){
  $('#delPromptBox').modal('hide');
  var pId=$('#pId').val();
  console.log(pId);
  $.ajax({
    url:pathurl+'parameter/delete',
    // url:'./testJson/true.json',
    type:'post',
    data:{
      pid:pId
    },
    success:function(data){
      console.log(data)
      if(data.code==200){
        $('#promptTit').html('提示');
        $('#prompt-text').html('删除成功');
        $('#promptBox').modal('show');
      }else{
        $('#promptTit').html('提示');
        $('#prompt-text').html(data.msg);
        $('#promptBox').modal('show');
      }
      $("#systemSetting").bootstrapTable('refresh');
    },
    error:function(){
      $('#promptTit').html('提示');
      $('#prompt-text').html('系统出错');
      $('#promptBox').modal('show');
    }
  })
});
// 修改Btn
$('#systemSetting').on('click','.updateBtn',function(){

    var pId=$(this).parents('tr').find('#pId').val();
    $('#pId').val(pId);

  $('#modifyModal #systemSetModalLabel').html('修改参数');
  $('#modifyModal #parameterkey').val($(this).parents('tr').find('.pKey').text());
  $('#modifyModal #parameterVal').val($(this).parents('tr').find('.pvalue').text());
  $('#modifyModal').modal('show');
    var pkey=$('#modifyModal #parameterkey').val();


        var pvalue=$('#modifyModal #parameterVal').val();
        if(pkey=='即将到期'||pkey=='比中返回照片数量'){
            $('#error').text('请输入数字');

        }else if(pkey=='处理结果'){
            $('#error').text('请输入文字');

        }

})

    $('#modifyModal #modifySubmit').on('click', function () {
        var pkey = $('#modifyModal #parameterkey').val();
        var pvalue = $('#modifyModal #parameterVal').val();
        var pId = $('#pId').val();

            if (pkey == '即将到期' || pkey == '比中返回照片数量') {
                if (!/^[0-9]*$/.test(pvalue)) {
                    $('#error').text('请输入数字');
                    return;
                }else {
                    $.ajax({
                        url: pathurl + 'parameter/doedit',
                        // url:'./testJson/true.json',
                        type: 'post',
                        data: {
                            pid: pId,
                            pkey: pkey,
                            pvalue: pvalue
                        },
                        success: function (data) {
                            console.log(data)
                            if (data.code == 200) {
                                $('#systemSetModal #parameterClass').find('option').eq(0).prop('selected', 'selected');//.eq(0).props('selected','selected');
                                $('#parameterClassVal').html('<option value="-1">参数类别值</option>');
                                $("#systemSetting").bootstrapTable('refresh');
                                $('#promptTit').html('提示');
                                $('#prompt-text').html('修改成功');
                                $('#promptBox').modal('show');
                            } else {
                                $('#promptTit').html('提示');
                                $('#prompt-text').html(data.msg);
                                $('#promptBox').modal('show');
                            }
                            $('#modifyModal').modal('hide');
                        },
                        error: function () {
                            $('#promptTit').html('提示');
                            $('#prompt-text').html('系统出错');
                            $('#promptBox').modal('show');
                        }
                    })
                }
            } else if (pkey == '处理结果') {
                if (!/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(pvalue)) {
                    $('#error').text('请输入文字');
                    return;
                }else {
                    $.ajax({
                        url: pathurl + 'parameter/doedit',
                        // url:'./testJson/true.json',
                        type: 'post',
                        data: {
                            pid: pId,
                            pkey: pkey,
                            pvalue: pvalue
                        },
                        success: function (data) {
                            console.log(data)
                            if (data.code == 200) {
                                $('#systemSetModal #parameterClass').find('option').eq(0).prop('selected', 'selected');//.eq(0).props('selected','selected');
                                $('#parameterClassVal').html('<option value="-1">参数类别值</option>');
                                $("#systemSetting").bootstrapTable('refresh');
                                $('#promptTit').html('提示');
                                $('#prompt-text').html('修改成功');
                                $('#promptBox').modal('show');
                            } else {
                                $('#promptTit').html('提示');
                                $('#prompt-text').html(data.msg);
                                $('#promptBox').modal('show');
                            }
                            $('#modifyModal').modal('hide');
                        },
                        error: function () {
                            $('#promptTit').html('提示');
                            $('#prompt-text').html('系统出错');
                            $('#promptBox').modal('show');
                        }
                    })
                }
            }



    })

})