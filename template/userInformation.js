$(function () {
    getTable1();
    /* $(".face-table button[title='Export data']").removeClass("btn-default");
     $(".face-table button[title='Export data']").addClass("face-button"); */
});
function getTable1() {
    $("#userTable").bootstrapTable('destroy');
    var u_unit_id = $("#u_unit_id").val();
    var area_id = $("#area_id").val();
    var u_type = $("#u_type").val();
    var u_role_id = $("#u_role_id").val();
    var dateStatus = $("#dateStatus").val();
    var u_real_name = $("#u_real_name").val();
    var u_status = $("#u_status").val();
    $("#userTable").bootstrapTable(
        {
            method: "post",
            url: pathurl + "user/selectUsers?u_unit_id=" + u_unit_id
            + "&area_id=" + area_id + "&u_type=" + u_type
            + "&u_role_id=" + u_role_id + "&dateStatus="
            + dateStatus + "&u_real_name=" + u_real_name
            + "&u_status=" + u_status,
            pagination: true,
            toolbar: '#my-button',
            contentType: "application/x-www-form-urlencoded",
            queryParamsType: " limit",
            paginationDetailHAlign: "left",
            //paginationPreText : "上一页",
            //paginationNextText : "下一页",
            searchOnEnterKey: true,
            buttonsClass: "face",
            showExport: true,           //是否显示导出
            exportDataType: "basic",      //basic', 'all', 'selected'.
            responseHandler:function(data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                                            //在ajax后我们可以在这里进行一些事件的处理
              var dataObj=data.result;
              return dataObj;
            }
        });
}

function typeFormatter(value) {
    switch (value) {
        case 0:
            return "APP";
        case 1:
            return "后台";
        case 2:
            return "通用";
    }
}
function statusFormatter(value) {
    switch (value) {
        case 'Y':
            return "正常用户";
        case 'N':
            return "停用用户";
    }
}
function reset() {
    $(".face-form select").val("-1");
    $('#u_status').val('Y')
}
