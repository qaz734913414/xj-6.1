

$(function() {
    var token = window.localStorage.getItem('token');
// console.log(token)
    if (token) {
        $.ajaxSetup({
            headers: {
                'x-access-token': token
            }
        });
    }

    $("#from").datetimepicker({
        startView:2,
        format:"yyyy-mm-dd",
        minView:"month",
        todayBtn : "linked",
        todayHighlight : true,
        language: "zh-CN",
        showMeridian:true,
        autoclose:true,
    }).on('changeDate',function(ev){
        var starttime=$("#from").val();
        $("#to").datetimepicker('setStartDate',starttime);
        $("#from").datetimepicker('hide');
    });

    $("#to").datetimepicker({
        startView:2,
        minView:"month",
        format:"yyyy-mm-dd",
        todayBtn : "linked",
        todayHighlight : true,
        language: "zh-CN",
        autoclose:true,
        showMeridian:true,
    }).on('changeDate',function(ev){
        var starttime=$("#from").val();
        var endtime=$("#to").val();
        $("#from").datetimepicker('setEndDate',endtime);
        $("#to").datetimepicker('hide');
    });
    getTable();

});
$('#tapbar input').on('input propertychange', function () {
    getTable()
})

function getTable() {
    var username=$("#queryMesUser").val()||'';
    var content=$("#queryMesText").val()||'';
    var startTime=$("#from").val()||'';
    var endTime=$("#to").val()|| new Date();
    $("#add-table").bootstrapTable('destroy');

    $('#add-table').bootstrapTable({
        url: pathurl+"msgpush/initTable?username=" + username + "&content=" + content + "&startTime=" + startTime + "&endTime=" + endTime,
        method: 'post',
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        queryParams: function (params) {
            var obj = {}
            obj.pageNumber = Math.ceil(++params.offset / params.limit);
            obj.pageSize = params.limit;
            obj.offset = params.offset;
            obj.limit = params.limit;
            obj.order = params.order;
            if (params.sort) {
                obj.sort = params.sort;
            }
            if (params.search) {
                obj.search = params.search;
            }
            return obj
        },

        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        sortable: true, //是否启用排序
        //      sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
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
        getTable()
});

$("#queryMes").on("click", function() {
    getTable()

});

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