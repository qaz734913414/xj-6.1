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
    $(".face-table-group button[title='Export data']").removeClass(
        "btn-default");
    $(".face-table-group button[title='Export data']").addClass(
        "face-button");
    $('#adduserModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#modifyUserModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#wrenchModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
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
                            message: '请输入用户名'
                        },
                        stringLength: {
                            min: 3,
                            max: 11,
                            message: '用户名长度必须在3到11位之间'
                        },
                        regexp: {
                            regexp: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{3,11}/,
                            message: '用户名只能包含字母+数字,或者手机号'
                        }
                    }
                },
                uCardId: {
                    validators: {
                        notEmpty: {
                            message: '请输入身份证'
                        },
                        regexp: {
                            regexp: /^\d{17}(\d|x)$/,
                            message: '身份证输入不正确，请输入18位正确格式的身份证'
                        }

                    }
                },
                uRealName: {
                    validators: {
                        notEmpty: {
                            message: '请输入真实姓名'
                        }
                    }
                },
                expireTime: {
                    validators: {
                        notEmpty: {
                            message: '请输入账户过期时间'
                        }
                    }
                },
                uPhone: {
                    validators: {
                        notEmpty: {
                            message: '手机号码不能为空'
                        },
                        regexp: {
                            regexp: /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                            message: '手机格式不正确'
                        }
                    }
                }
            }
        });
}
/*初始化单位和角色的下拉框 dList rList*/
function init() {
    var dname, rName;
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/initDeptAndRole',
        // url: './testJson/initDeptAndRole.json',
        success: function (data) {

            var unitStr = '';
            var roleStr = '';
            var dListData = data.result.dList;//dList    rName  rId
            var rListData = data.result.rList;
            // console.log(data.result)
            dname = dListData;
            rname = rListData;
            for (var i = 0; i < dListData.length; i++) {
                unitStr += '<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>';
            }
            for (var i = 0; i < rListData.length; i++) {
                roleStr += '<option value="' + rListData[i].id + '">' + rListData[i].name + '</option>';
            }
            $('#adduserModal #uUnitId option').eq(0).after(unitStr);
            $('#userdiv #uUnitId option').eq(0).after(unitStr);
            $('#userdiv #uunitId').html(unitStr);
            $('#adduserModal #uunitId').html(unitStr);
            $('#adduserModal #uRoleId').html(roleStr);

            $('#modifyUserModal #uUnitId option').eq(0).after(unitStr);
            $('#modifyUserModal #uunitId').html(unitStr);
            $('#modifyUserModal #uRoleId').html(roleStr);
            $('#wrenchModal #uUnitId option').eq(0).after(unitStr);
            $('#wrenchModal #uunitId').html(unitStr);
            $('#wrenchModal #uRoleId').html(roleStr);

        },
        error: function () {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
}
//初始化table
function getTable() {
    console.log($("#uRealName").val() + '__' + $("#uUnitId").val())
    $("#userTable").bootstrapTable('destroy');
    $("#userTable").bootstrapTable({
        method: "post",
        url: pathurl + 'user/usersList',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
                uRealName: $("#uRealName").val(),
                uUnitId: $("#uUnitId").val()
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
        showExport: true, //是否显示导出
        exportDataType: "all", //basic', 'all', 'selected'.
        pageList: [4, 10, 25, 50, 100],
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
function statusFormatter(value, row, index) {

    if (row.uStatus == 'Y') {
        return ['<button class="reset btn-sm btn face-button " style="margin-right:15px;">正常</button>']
            .join();
    } else {
        return ['<button class="reset btn-sm btn face-button2" style="margin-right:15px;">停用</button>']
            .join();
    }
}

function operateFormatter(value, row, index) {
    if (row.bindType==0){
        return [
            '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>',
            '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
            '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',
            '<button type="button" class="unbind btn-sm btn face-button2" style="margin-right:15px;">解绑</button>'
        ].join('');
    }else if(row.bindType==1){
        return [
            '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>',
            '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
            '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',
            '<button type="button" disabled class="unbind btn-sm btn face-button" style="margin-right:15px;">已解绑</button>'
        ].join('');
    }

}


$('#userModal #cancel').on('click', function () {
    $('#userModal').modal('hide');
})


function updateStatus(row) {
    console.log(row.uId)
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/status',
        data: {
            uId: row.uId
        },
        success: function () {
            $("#modal-body-id").text("用户状态已改变!");
            $("#myModal").modal();
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
}
//修改状态
window.statusEvents = {
    'click .reset': function (e, value, row, index) {
        updateStatus(row);  //修改状态
    }
};


window.operateEvents = {//done
    'click .resetPwd': function (e, value, row, index) {//密码重置
        $("#resetTModel #modal-body-text").text("确定将密码重置为123456吗?");
        $("#resetTModel").modal('show');
        $('#rowUId').val(row.uId);
    },
    'click .update': function (e, value, row, index) { //修改用户
        userEdit(row);
    },
    'click .delete': function (e, value, row, index) { //删除用户
        // deleteUser(row);
        $("#delUserTModel #modal-body-text").text("确定将" + row.uName + "删除?");
        $("#delUserTModel").modal('show');
        $('#rowUId').val(row.uId);
    },
    'click .unbind': function (e, value, row, index) { //删除用户
        // deleteUser(row);
        $("#unbindTModel #unbind-text").text("确定将" + row.uName + "解绑?");
        $("#unbindTModel").modal('show');
        $('#username').val(row.uName);
    }
};
$("#resetTModel #cancel").click(function () {
    $("#userTable").bootstrapTable('refresh');
});
//重置密码
$("#resetTModel #continue").off();
$("#resetTModel #continue").click(function () { //done
    $("#resetTModel").modal('hide');
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/resetpwd',
        data: {
            uId: $('#rowUId').val()
        },
        success: function () {
            $("#modal-body-id").text("密码重置成功!");
            $("#myModal").modal();
            console.log('密码重置成功!')
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
            console.log('密码重置失败!')
        },
        dataType: 'json'
    });
});
//解绑
$("#unbindTModel #continue").off();
$("#unbindTModel #continue").off().click(function () { //done
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/unbind',
        data: {
            username: $('#username').val()
        },
        success: function (data) {
            console.log('解绑'+data);
            $("#myModal #modal-body-id").text("解绑成功!");
            $("#myModal").modal();
            $("#unbindTModel").modal('hide');
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#unbindTModel #unbind-text").text("解绑失败!");
            $("#unbindTModel").modal();
            $("#unbindTModel").modal('hide');
            console.log('解绑失败!')

            $("#userTable").bootstrapTable('refresh');
        },
        dataType: 'json'
    });
});


//表格批量删除
function toRemove() {
    var ids = getSelectedRowsIds('userTable');
    $('#rowUId').val(ids);
    if (ids) {
        $("#delUsersTModel #modal-body-text").text("删除后数据不可恢复，确定要删除吗?");
        $("#delUsersTModel").modal('show');
    } else {
        $("#delUsersTModel #modal-body-text").text("请选择一条数据进行操作!");
        $("#delUsersTModel").modal('show');
    }
}
//表格批量解绑
function toUnbind() {
    var ids = getSelectedRowsIds('userTable');
    $('#rowUId').val(ids);
    if (ids) {
        $("#unbindTModel #unbind-text").text("确定要批量解绑吗?");
        $("#unbindTModel").modal('show');

    } else {
        $("#unbindTModel #unbind-text").text("请选择一条数据进行操作!");
        $("#unbindTModel").modal('show');
    }
}
$("#unbindTModel #continue").click(function () {
    $("#unbindTModel").modal('hide')
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/batchunbinding',
        data: {
            ids: $('#rowUId').val(),

        },
        success: function () {

            $("#modal-body-id").text("批量解绑成功!");
            $("#myModal").modal();
            getTable();
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            console.log('批量解绑失败')
            $("#modal-body-id").text("批量解绑失败!");
            $("#myModal").modal();
        }
    });
});
//表格批量修改
function toWrench() {
    var ids = getSelectedRowsIds('userTable');
    $('#rowUId').val(ids);
    if (ids) {
        $("#wrenchModal").modal('show');

    } else {
        $("#unbindTModel #unbind-text").text("请选择一条数据进行操作!");
        $("#unbindTModel").modal('show');
    }
}
$("#wrenchModal #continue").click(function () {
    $("#wrenchModal").modal('hide')
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/batchUpdate',
        data: {
            ids: $('#rowUId').val(),
            expireTime:$('#wrenchModal #wrench #expireTimeVal').val(),
            uRoleId:$('#wrenchModal #wrench #uRoleId').val(),
            uUnitId:$('#wrenchModal #wrench #uunitId').val(),
        },
        success: function () {

            $("#modal-body-id").text("批量修改成功!");
            $("#myModal").modal();
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            console.log('批量修改失败')
            $("#modal-body-id").text("批量修改失败!");
            $("#myModal").modal();
        }
    });
});
//done
// 多表删除
$("#delUsersTModel #cancel").click(function () {
    $("#userTable").bootstrapTable('refresh');
});
$("#delUsersTModel #continue").off();
$("#delUsersTModel #continue").click(function () {
    $("#delUsersTModel").modal('hide')
    console.log(111)
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/deleteByIds',
        data: {
            ids: $('#rowUId').val()
        },
        success: function () {
            console.log('多表删除成功')
            $("#modal-body-id").text("删除成功!");
            $("#myModal").modal();
            $("#userTable").bootstrapTable('refresh');
        },
        error: function () {
            console.log('多表删除失败')
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        }
    });
});
//操作删除
// function deleteUser(row) {
//   console.log(row)
//     // $("#delUserTModel #modal-body-text").text("确定将该用户删除?");
//     // $("#delUserTModel").modal('show');
//
// }
// 删除
$("#delUserTModel #cancel").click(function () {
    $("#userTable").bootstrapTable('refresh');
});
// 删除
$("#delUserTModel #continue").off();
$("#delUserTModel #continue").click(function () {
    $("#delUserTModel").modal('hide');
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/delete',
        data: {
            uId: $('#rowUId').val()
        },
        success: function (data) {
            console.log('删除成功!')
            if (data.code == 200) {
                $("#modal-body-id").text("删除成功!");
                $("#myModal").modal();
                $("#userTable").bootstrapTable('refresh');
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

// 修改
function userEdit(row) {

    $(".bs-checkbox input[name='btSelectItem']").attr("checked", false);

    //	$("#userForm")[0].reset();
    $("#modifyUserModal #uName").val(row.uName);
    $("#modifyUserModal #urealName").val(row.uRealName);
    var uSex = row.uSex;
    var uSex = row.uSex;
    console.log(uSex);
    if (uSex == 0) {
        $("#modifyUserModal input[name='uSex'][value='0']").attr("checked", true);
        $("#modifyUserModal input[name='uSex'][value='1']")
            .attr("checked", false);
        $("#modifyUserModal input[name='uSex'][value='2']")
            .attr("checked", false);
    } else if (uSex == 1) {
        $("#modifyUserModal input[name='uSex'][value='1']").attr("checked", true);
        $("#modifyUserModal input[name='uSex'][value='0']")
            .attr("checked", false);
        $("#modifyUserModal input[name='uSex'][value='2']")
            .attr("checked", false);
    } else {
        $("#modifyUserModal input[name='uSex'][value='2']").attr("checked", true);
        $("#modifyUserModal input[name='uSex'][value='1']")
            .attr("checked", false);
        $("#modifyUserModal input[name='uSex'][value='0']")
            .attr("checked", false);
    }

    console.log(row.expireTime);
    $("#modifyUserModal #uCardId").val(row.uCardId);
    $("#modifyUserModal #uType").val(row.uType);
    $("#modifyUserModal #uStatus").val(row.uStatus);
    $("#modifyUserModal #uPhone").val(row.uPhone);
    $("#modifyUserModal #uTelephone").val(row.uTelephone);
    $("#modifyUserModal #uPolicyNum").val(row.uPolicyNum);
    $("#modifyUserModal #uDuty").val(row.uDuty);
    $("#modifyUserModal #uRoleId").val(row.uRoleId);
    $("#modifyUserModal #uunitId").val(row.uUnitId);
    $("#modifyUserModal #expireTimeVal").val(row.expireTime);
    $("#modifyUserModal .modal-title").html("修改用户");
    $("#modifyUserModal").modal('show');
    $("#modifyUserModal #cancel").off();
    $("#modifyUserModal #cancel").click(function () {
        $('#modifyUserModal').modal('hide');
        $("#userTable").bootstrapTable('refresh');
        $("#userForm")[0].reset();
    });
    var uId = row.uId;
    $("#modifyUserModal #continue").off();
    $("#modifyUserModal #continue").click(function () {
        $('#modifyUserModal').modal('hide');

        var data = {
            uId: uId,
            uName: $("#modifyUserModal #uName").val(),
            uRealName: $("#modifyUserModal #urealName").val(),
            uSex: $("#modifyUserModal input[name='uSex']:checked").val(),
            uCardId: $("#modifyUserModal #uCardId").val(),
            uType: $("#modifyUserModal #uType").val(),
            uStatus: $("#modifyUserModal #uStatus").val(),
            uPhone: $("#modifyUserModal #uPhone").val(),
            uTelephone: $("#modifyUserModal #uTelephone").val(),
            uPolicyNum: $("#modifyUserModal #uPolicyNum").val(),
            uDuty: $("#modifyUserModal #uDuty").val(),
            uRoleId: $("#modifyUserModal #uRoleId").val(),
            uUnitId: $("#modifyUserModal #uunitId").val(),
            expireTime: $("#modifyUserModal #expireTimeVal").val(),
            province: $("#modifyUserModal #distpicker select[name='province']").val(),

            city: $("#modifyUserModal #distpicker select[name='city']").val(),
            area: $("#modifyUserModal #distpicker select[name='area']").val(),
        }
        console.log(data)
        $.ajax({
            type: 'post',
            url: pathurl + 'user/edit',
            data: {
                uId: uId,
                uName: $("#modifyUserModal #uName").val(),
                uRealName: $("#modifyUserModal #urealName").val(),
                uSex: $("#modifyUserModal input[name='uSex']:checked").val(),
                uCardId: $("#modifyUserModal #uCardId").val(),
                uType: $("#modifyUserModal #uType").val(),
                uStatus: $("#modifyUserModal #uStatus").val(),
                uPhone: $("#modifyUserModal #uPhone").val(),
                uTelephone: $("#modifyUserModal #uTelephone").val(),
                uPolicyNum: $("#modifyUserModal #uPolicyNum").val(),
                uDuty: $("#modifyUserModal #uDuty").val(),
                uRoleId: $("#modifyUserModal #uRoleId").val(),
                uUnitId: $("#modifyUserModal #uunitId").val(),
                expireTime: $("#modifyUserModal #expireTimeVal").val()
            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    console.log('修改成功')
                    $('userModal').modal('hide');
                    $("#modal-body-id").text(data.msg);
                    $("#myModal").modal('show');
                    $("#userForm")[0].reset();
                    // LoadAjaxContent(pathurl+'user/list');
                    $("#userTable").bootstrapTable('refresh');
                } else {
                    $("#myModalLabel").html("提示");
                    $("#modal-body-text").html(data.msg);
                    $('#deptModel').modal('show');
                }
            },
            error: function () {
                console.log('修改失败')
                $("#modal-body-id").html('系统出错请稍后再试');
                $('#myModal').modal('show');
            }
        });
    });
    // $("#userModal #continue").off();
}
// 新增
function addUser() {
    $("#userForm")[0].reset();
    $("#adduserModal .modal-title").html("添加用户");
    $("#adduserModal").modal();
    $("#adduserModal #cancel").off()
    $("#adduserModal #cancel").click(function () {
        $('#adduserModal').modal('hide');
        $("#userTable").bootstrapTable('refresh');
    });
}
$("#adduserModal #continue").off();
$("#adduserModal #continue").click(function (form) {
    console.log(555555555);

    $.ajax({
        type: 'post',
        url: pathurl + 'user/new',
        data: {
            uName: $("#adduserModal #uName").val(),
            uRealName: $("#adduserModal #urealName").val(),
            uSex: $("#adduserModal input[name='uSex']:checked").val(),
            uCardId: $("#adduserModal #uCardId").val(),

            uStatus: $("#adduserModal #uStatus").val(),
            uPhone: $("#adduserModal #uPhone").val(),
            uTelephone: $("#adduserModal #uTelephone").val(),
            uPolicyNum: $("#adduserModal #uPolicyNum").val(),
            uDuty: $("#adduserModal #uDuty").val(),
            uRoleId: $("#adduserModal #uRoleId").val(),
            uUnitId: $("#adduserModal #uunitId").val(),
            expireTime: $("#adduserModal #expireTimeVal").val(),
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
                $("#userTable").bootstrapTable('refresh');
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
// setInterval(function(){
//   data = new FormData()
//   data.append('key1',"value1");
//   console.log(data)
// },100)
function doUpload() {
    $("#modal-text").text("请上传后缀为'.xlsx'的表格,可以点击下载模板参考");
    $("#fileinputModal").modal();
    $("#fileinputModal #cancel").click(function () {
        $("#userTable").bootstrapTable('refresh');
    });

}
$("#fileinputModal #continue").click(function () {
    var formData = new FormData($("#uploadForm")[0]);
    console.log(formData.get("file"));
    if (formData.get("file").name) {
        $.ajax({
            url: pathurl + 'fileUpload',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data.code == 200) {
                    $("#modal-body-id").empty();
                    var text = '';
                    text += '<p onclick="fileInfo(0) "><a>上传成功:' + data.success + '</a> </p ><p onclick="fileInfo(1)"><a>上传失败:' + data.fail + '</a> </p><p onclick="fileInfo(2)"><a>上传重复:' + data.repeat + '</a> </p>';
                    $("#modal-body-id").append(text);
                    $("#myModal").modal('show');
                    $("#userTable").bootstrapTable('refresh');
                } else {
                    $("#modal-body-id").text('上传文件失败,请重新尝试!');
                    $("#myModal").modal();
                }
            },
            error: function (data) {
                $("#modal-body-id").text("上传文件失败,请重新尝试!");
                $("#myModal").modal();
            }
        });
    } else {
        $("#modal-body-id").text('请选择要上传的文件');
        $("#myModal").modal();

    }

});
function fileInfo(state) {
    //初始化table

    $("#fileInfoTable").bootstrapTable('destroy');
    $("#fileInfoTable").bootstrapTable({
        method: "post",
        url: pathurl + 'import/initTable?state=' + state,
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
        showExport: true, //是否显示导出
        exportDataType: "all", //basic', 'all', 'selected'.
        pageList: [4, 10, 25, 50, 100],
        onLoadSuccess: function (data) {  //加载成功时执行
            $('#fileInfoModal').css('z-index', 1500);

            if (state == 0) {

                $('#fileInfoModal #fileInfoLabel').text('上传成功:' + data.total + '条')

            }
            else if (state == 1) {
                $('#fileInfoModal #fileInfoLabel').text('上传失败:' + data.total + '条')
            }
            if (state == 2) {
                $('#fileInfoModal #fileInfoLabel').text('上传重复:' + data.total + '条')
            }
            $('#fileInfoModal').modal();

        }
    });

}
function sexFormatter(value) {
    if (value == 0) {
        return '男';
    } else {
        return '女';
    }
}
