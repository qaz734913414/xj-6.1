$('#nation').html('<option value="">民族</option>');
var national = [
    "汉族", "壮族", "满族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
    "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
    "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
    "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"
];

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

//保存最后上传的图片

$(function () {

    national.forEach(function (val, i) {
        $('#nation').append('<option value="' + val + '">' + val + '</option>');
    });
    getTable();

    addFormVali();

    $('#userdiv input').on('input propertychange', function () {
        getTable()
    })
    $('#userdiv select').on('input propertychange', function () {
        getTable()
    })
    $('#userdiv .selector-item').on('input propertychange', function () {
        getTable()
    })

    $('#userdiv a.selector-name').on('click', function () {
        $('#userdiv .selector-item ul li').each(function (i, val) {
            console.log($(val))
            $(val).on('click', function () {
                console.log('点击了')
                setTimeout(function () {
                    getTable()
                })
            })
        })
    })


});

function addFormVali() {
    $('#userForm')
        .bootstrapValidator({
            fields: {
                version_number: {
                    validators: {
                        notEmpty: {
                            message: '请输入版本号'
                        },

                    }
                }, version_info: {
                    validators: {
                        notEmpty: {
                            message: '请输入版本信息'
                        },

                    }
                }
            }
        });
}

//初始化table
function getTable() {
    $("#facedataTable").bootstrapTable('destroy');
    $("#facedataTable").bootstrapTable({
        method: 'post',
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        url:  pathurl + 'version/findversion',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
            }
        },
        buttonsClass: "face",
        // showExport: true, //是否显示导出
        // exportDataType: "basic", //basic', 'all', 'selected'.
        sortable: true, //是否启用排序
        //      sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
        onLoadSuccess: function (data) { //加载成功时执行
            console.log('初始化%o', data)
        },
    });
}


function operateFormatter(value, row, index) {
    return [

        '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
        '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',

    ].join('');

}


window.operateEvents = {//done

    'click .update': function (e, value, row, index) { //修改
        userEdit(row);
        $('#rowUId').val(row.id);
    },
    'click .delete': function (e, value, row, index) { //删除
        // deleteUser(row);
        $("#delUserTModel #modal-body-text").text("确定将id:" + row.id + "删除?");
        $("#delUserTModel").modal('show');
        $('#rowUId').val(row.id);
    },

};
$('#userModal #cancel').on('click', function () {
    $('#userModal').modal('hide');
})

//修改

function userEdit(row) {
    $('#editModal #editForm #version_number').val(row.version_number);
    $('#editModal #editForm #version_info').val(row.version_info);
    $('#editModal').modal();

};
$("#editModal #continue").off();
$("#editModal #continue").click(function () {

    $.ajax({
        type: 'POST',
        url:  pathurl + 'version/editversion',
        data: {
            verNumber: $("#editModal #version_number").val(),
            verInfo: $("#editModal #version_info").val(),
            pid:$('#rowUId').val()
        },
        success: function () {
            $("#myModal #modal-body-id").text("修改成功!");
            $("#myModal").css('z-index','1551');
            $("#myModal").modal();
            $('#editModal').modal('hide');
            $("#facedataTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#myModal").css('z-index','1551');
            $("#myModal #modal-body-id").text("修改失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
});
$("#editModal #cancel").off()
$("#editModal #cancel").click(function () {
    $('#editModal').modal('hide');
    $("#facedataTable").bootstrapTable('refresh');
});

// 删除库
$("#delUserTModel #continue").off();
$("#delUserTModel #continue").click(function () {
    $("#delUserTModel").modal('hide');
    $.ajax({
        type: 'POST',
        url:  pathurl + 'version/deleteversion',
        data: {
            pid: $('#rowUId').val()
        },
        success: function (data) {
            console.log('删除成功!')
            if (data.code == 200) {
                $("#myModal #modal-body-id").text("删除成功!");
                $("#myModal").modal();
                $("#facedataTable").bootstrapTable('refresh');
            } else {
                $("#myModal #modal-body-id").text('删除失败');
                $("#myModal").modal();
            }
        },
        error: function () {
            console.log('处理失败!!')
            $("#myModal #modal-body-id").text("处理失败!");
            $("#myModal").modal();
        }
    });
});

// 新增版本
function addUser() {
    $("#userForm")[0].reset();
    $("#adduserModal .modal-title").html("添加版本");
    $("#adduserModal").modal();
    $("#adduserModal #cancel").off()
    $("#adduserModal #cancel").click(function () {
        $('#adduserModal').modal('hide');
        $("#facedataTable").bootstrapTable('refresh');
        $("#adduserModal #userForm").data('bootstrapValidator').resetForm();
    });
};
$("#adduserModal #continue").off();
$("#adduserModal #continue").click(function () {
    if (!$('#adduserModal #userForm').data('bootstrapValidator').isValid()) {
        return;

    } else {
        $.ajax({
            type: 'post',
            url:  pathurl + 'version/addversion',
            data: {
                verNumber: $("#adduserModal #version_number").val(),
                verInfo: $("#adduserModal #version_info").val(),

            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    $('#adduserModal').modal('hide');
                    $("#myModal #modal-body-id").html('添加成功');
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
                $("#myModal #modal-body-id").html('系统出错请稍后再试');
                //	$('#myModal').modal('show');
            }
        });
    }
});
