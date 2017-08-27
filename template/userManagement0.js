$(function(){
  var unitData=[];
  var roleData=[];
  mainSelectInit()//主要下拉菜单生成
  userTableInit()



})

function mainSelectInit(){
  var unitHtml=$('#mainSearch #uUnitId').html();
  var roleHtml=$('#mainSearch #uRoleId').html();
  $.ajax({
    type: 'post',
    url:pathurl + 'user/initDeptAndRole',
    success: function(res){
      unitData=res.result.dList;
      roleData=res.result.rList;
      for (var i = 0; i < unitData.length; i++) {
        unitHtml += '<option value="' + unitData[i].did + '">' + unitData[i].dname + '</option>';
      }
      for (var i = 0; i < roleData.length; i++) {
        roleHtml += '<option value="' + roleData[i].id + '">' + roleData[i].name + '</option>';
      }
      $('#mainSearch #uUnitId').html(unitHtml);
      $('#mainSearch #uRoleId').html(roleHtml);
    }
  })
}
function userTableInit(){
  $("#userTable").bootstrapTable('destroy');
  $("#userTable").bootstrapTable({
    url: pathurl + "user/usersList",      //请求后台的URL（*）
    method: 'post',                      //请求方式（*）
    // toolbar: '#toolbar',                //工具按钮用哪个容器
    striped: true,                      //是否显示行间隔色
    cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,                   //是否显示分页（*）
    sortable: true,                     //是否启用排序
    sortOrder: "desc",                   //排序方式
    queryParams: function (params) {    //传递参数（*）

    },
    sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
    pageNumber:1,                       //初始化加载第一页，默认第一页
    pageSize: 10,                       //每页的记录行数（*）
    pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
    strictSearch: true,
    clickToSelect: true,                //是否启用点击选中行
    // height: 460,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
    uniqueId: "id",                     //每一行的唯一标识，一般为主键列
    // cardView: false,                    //是否显示详细视图
    // detailView: false,                   //是否显示父子表
    columns: [
      {
          field: 'uId',
          title: '用户账号'
      }, {
          field: 'uName',
          title: '用户名',
          sortable: true,
      }, {
          field: 'uRealName',
          title: '姓名'
      }, {
          field: 'uRoleId',
          title: '角色',
          formatter: userRoleFormatter
      }, {
          field: 'uUnitId',
          title: '单位',
          formatter: userUnitFormatter
      }, {
          field: 'uCardId',
          title: '身份证'
      }, {
          field: 'uDuty',
          title: '职务'
      }, {
          field: 'policeType',
          title: '警种'
      }, {
          field: 'uPolicyNum',
          title: '警号'
      }, {
          field: 'approval',
          title: '审批人'
      }, {
          field: 'uStatus',
          title: '用户状态',
          formatter: userStatusFormatter
      }, {
          field: 'uUnitId',
          title: '单位'
      }, {
          field: 'uSex',
          title: '性别',
          formatter: userSexFormatter
      }, {
          field: 'uType',
          title: '账户类别'
      }, {
          field: 'expireTime',
          title: '账户到期时间',
          sortable: true
      }, {
          field: 'uName',
          title: '操作'
      }
    ]
  })
}
function userRoleFormatter(value, row, index){
  console.log(roleData)
  for (var i = 0; i < roleData.length; i++) {
    if (value == roleData[i].id) {
      console.log(roleData)
      return roleData[i].name;
    }
  }
}
function userUnitFormatter(value, row, index){
  console.log(unitData)
  for (var i = 0; i < unitData.length; i++) {
    if (value == unitData[i].did) {
      return unitData[i].dname;
    }
  }
}
function userStatusFormatter(value, row, index){

}
function userSexFormatter(value, row, index){

}







//
