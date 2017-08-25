
$('#systemStateTable').bootstrapTable("destroy");
$('#systemStateTable').bootstrapTable({
  url: "${ctx}/house/queryHouseTable",
  method: "post",
  contentType: "application/x-www-form-urlencoded",
  queryParams: function (queryParams) {
    return 'asd'
  },
  queryParamsType: " limit",
  paginationPreText: "上一页",
  paginationNextText: "下一页",
  showColumns:true,
  showRefresh:true,
  striped: true,
  pagination: true, //是否显示分页（*）
  pageNumber: 1, //初始化加载第一页，默认第一页
  pageSize: 10, //每页的记录行数（*）
  pageList: [
    10, 25, 50, 100
  ],
  paginationDetailHAlign: "left"
});