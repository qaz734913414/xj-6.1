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

$(function () {
    getTable();

    addFormVali();
    init();
    /*初始化单位和角色的下拉框 dList rList*/
});

function addFormVali() {
    $('#userForm')
        .bootstrapValidator({
            fields: {
                uName: {
                    validators: {
                        notEmpty: {
                            message: '请输入库名'
                        },

                        regexp: {
                            regexp: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{3,11}/,
                            message: '库名只能包含字母或者数字'
                        }
                    }
                },
            }
        });
}

//初始化table
function getTable() {
    $("#facedataTable").bootstrapTable('destroy');
    $("#facedataTable").bootstrapTable({
        method: "post",
        url: pathurl + 'library/librarylist',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber
            }
        },
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        toolbar: "#userdiv",
        searchOnEnterKey: true,
        //		height:$(document).height()-130,
        buttonsClass: "face",

        pageList: [10, 25, 50, 100],
        onLoadSuccess: function (data) {  //加载成功时执行
            console.log('初始化'+data)
        }
    });
}
//重置按钮
function reset() {
    $("#uUnitId").val(0);
    $("#uRealName").val("");
    // var aa=$('#uUnitId option').eq(0).props('selected','selected')
    // console.log(aa);
    getTable();
}

function typeFormatter(value, row, index) {

    if (row.type == '0') {
        return ['<span>静态</span>']
            .join();
    } else {
        return ['<span>静态</span>']
            .join();
    }
}

function operateFormatter(value, row, index) {

        return [

            '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">清空</button>',
            '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',

        ].join('');



}




window.operateEvents = {//done

    'click .update': function (e, value, row, index) { //清空库
        userEdit(row);
    },
    'click .delete': function (e, value, row, index) { //删除库
        // deleteUser(row);
        $("#delUserTModel #modal-body-text").text("确定将" + row.dbname + "删除?");
        $("#delUserTModel").modal('show');
        $('#rowUId').val(row.dbname);
    },

};
$('#userModal #cancel').on('click', function () {
    $('#userModal').modal('hide');
})
//清空库

function userEdit(row) {
    alert(row.dbname);
    $.ajax({
        type: 'POST',
        url: pathurl + 'library/clearlibrary',
        data: {
            dbname: row.dbname
        },
        success: function () {
            $("#modal-body-id").text("已清空!");
            $("#myModal").modal();
            $("#facedataTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#modal-body-id").text("清空失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
}


// 删除库
$("#delUserTModel #continue").off();
$("#delUserTModel #continue").click(function () {
    $("#delUserTModel").modal('hide');
    $.ajax({
        type: 'POST',
        url: pathurl + 'library/deletelibrary',
        data: {
            dbname: $('#rowUId').val()
        },
        success: function (data) {
            console.log('删除成功!')
            if (data.code == 200) {
                $("#modal-body-id").text("删除成功!");
                $("#myModal").modal();
                $("#facedataTable").bootstrapTable('refresh');
            } else {
                $("#modal-body-id").text('删除失败');
                $("#myModal").modal();
            }
        },
        error: function () {
            console.log('处理失败!!')
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        }
    });
});

// 新增
function addUser() {
    $("#userForm")[0].reset();
    $("#adduserModal .modal-title").html("添加用户");
    $("#adduserModal").modal();
    $("#adduserModal #cancel").off()
    $("#adduserModal #cancel").click(function () {
        $('#adduserModal').modal('hide');
        $("#facedataTable").bootstrapTable('refresh');
    });
}
$("#adduserModal #continue").off();
$("#adduserModal #continue").click(function (form) {
    console.log(555555555);

    $.ajax({
        type: 'post',
        url: pathurl + 'library/addlibrary',
        data: {
            dbname: $("#adduserModal #uName").val(),
            province: $("#adduserModal #distpicker select[name='province']").val(),
            city: $("#adduserModal #distpicker select[name='city']").val(),
            area: $("#adduserModal #distpicker select[name='area']").val(),
            uVIP: $("#adduserModal #uVIP").is(':checked') ? '0' : '1'
        },
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 200) {
                $('#adduserModal').modal('hide');
                $("#modal-body-id").html('添加成功');
                $('#myModal').modal('show');
                $("#userForm")[0].reset();
                // LoadAjaxContent(pathurl+'user/list');
                $("#facedataTable").bootstrapTable('refresh');
            } else {
                $("#deptModel").css("z-index", 1500);
                $("#myModalLabel").html("提示");
                $("#modal-body-text").html(data.msg);
                $('#deptModel').modal('show');
            }
        },
        error: function () {
            $("#myModalLabel").html("提示");
            $("#modal-body-id").html('系统出错请稍后再试');
            //	$('#myModal').modal('show');
        }
    });
});

