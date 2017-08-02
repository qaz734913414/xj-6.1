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
//初始化table
function getTable() {
    var  uRealName=$("#userForm #uRealName").val()||'',
        uUnitId= $("#userForm #uUnitId").val()||'',
        province=$("#userForm #distpicker select[name='province']").val()||'',
        city=$("#userForm #distpicker select[name='city']").val()||'',
        area= $("#userForm #distpicker select[name='area']").val()||'',
        uVIP=$("#userForm #adduserModal input[name='uVIP']:checked").val()||'';
    $("#userTable1").bootstrapTable('destroy');
    $("#userTable1").bootstrapTable({
        method: "post",
        url: pathurl + "user/usersList?uRealName=" + uRealName + "&uUnitId=" + uUnitId + "&uVIP=" + uVIP + "&province=" + province + "&city=" + city + "&area=" + area,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        searchOnEnterKey: true,
        //		height:$(document).height()-130,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        sortable: true, //是否启用排序
        sortOrder:'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
        onLoadSuccess: function (data) {  //加载成功时执行
            console.log('初始化' + data)
        }
    });
}
function addFormVali() {
    $('#adduserModal #userForm')
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
                            regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
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
                            message: '请输入到期时间'
                        }
                    }
                },
                province: {
                    validators: {
                        notEmpty: {
                            message: '请输入所在省市区'
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
// 新增
function addUser() {

    $("#adduserModal .modal-title").html("添加用户");
    $("#adduserModal").modal();
    $("#adduserModal #cancel").off()
    $("#adduserModal #cancel").click(function () {
        $('#adduserModal').modal('hide');
        $("#adduserModal #userForm")[0].reset();
        $("#userTable1").bootstrapTable('refresh');
        $("#adduserModal #userForm").removeClass("has-feedback has-success has-error");//移除所有class="form-group"属性的所有div
        $(".help-block").hide();//隐藏所有class="help-block"的提示元素

    });
}
$("#adduserModal #continue").off();


$("#adduserModal .face-button").click(function () {
    if (!$('#adduserModal #userForm').data('bootstrapValidator').isValid()) {

        return ;

    } else {
        //通过校验，可进行提交等操作
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
                uVIP: $("#adduserModal input[name='uVIP']:checked").val()
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
                    $("#userTable1").bootstrapTable('refresh');
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
    }
});
$("#adduserModal").on("hidden.bs.modal", function() {
    $("#adduserModal #userForm").data('bootstrapValidator').resetForm();
});
$("#modifyUserModal").on("hidden.bs.modal", function() {
    $("#modifyUserModal #userForm")[0].reset();
});
/*初始化单位和角色的下拉框 dList rList*/
var rListData;
// 角色数组
function init() {
    var dname;
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/initDeptAndRole',
        // url: './testJson/initDeptAndRole.json',
        success: function (data) {

            var unitStr = '';
            var roleStr = '';
            var dListData = data.result.dList;//dList    rName  rId
            rListData = data.result.rList;
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

//重置按钮
function reset() {
    $("#uUnitId").val(0);
    $("#uRealName").val("");
    $('select').val("");
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
    if (row.bindType == 0) {
        return [
            '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>',
            '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
            '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',
            '<button type="button" data-id="button3" class="pcode unbind btn-sm btn face-button2" style="margin-right:15px;">解&#12288;绑</button>'
        ].join('');
    } else if (row.bindType == 1) {
        return [
            '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>',
            '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
            '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',
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
            $("#userTable1").bootstrapTable('refresh');
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
    $("#userTable1").bootstrapTable('refresh');
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
            $("#userTable1").bootstrapTable('refresh');
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
            console.log('解绑' + data);
            $("#myModal #modal-body-id").text("解绑成功!");
            $("#myModal").modal();
            $("#unbindTModel").modal('hide');
            $("#userTable1").bootstrapTable('refresh');
        },
        error: function () {
            $("#unbindTModel #unbind-text").text("解绑失败!");
            $("#unbindTModel").modal();
            $("#unbindTModel").modal('hide');
            console.log('解绑失败!')

            $("#userTable1").bootstrapTable('refresh');
        },
        dataType: 'json'
    });
});


//表格批量删除
function toRemove() {
    var ids = getSelectedRowsIds('userTable1');
    $('#rowUId').val(ids);
    if (ids) {
        $("#delUsersTModel #modal-body-text").text("删除后数据不可恢复，确定要删除吗?");
        $("#delUsersTModel").modal('show');
    } else {
        $("#myModal #modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal('show');
    }
}
//表格批量解绑
function toUnbind() {
    var ids = getSelectedRowsIds('userTable1');
    $('#rowUId').val(ids);
    if (ids) {
        $("#unbindTModel #unbind-text").text("确定要批量解绑吗?");
        $("#unbindTModel").modal('show');

    } else {
        $("#myModal #modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal('show');
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
            $("#userTable1").bootstrapTable('refresh');
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
    var ids = getSelectedRowsIds('userTable1');
    $('#rowUId').val(ids);
    if (ids) {
        $("#wrenchModal").modal('show');

    } else {
        $("#myModal #modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal('show');
    }
}
$("#wrenchModal #cancel").click(function () {
    $("#wrenchModal").modal('hide')
    $("#userTable1").bootstrapTable('refresh');
});
$("#wrenchModal #continue").off();
$("#wrenchModal #continue").click(function () {
    $("#wrenchModal").modal('hide')
    $.ajax({
        type: 'POST',
        url: pathurl + 'user/batchUpdate',
        data: {
            ids: $('#rowUId').val(),
            expireTime: $('#wrenchModal #wrench #expireTimeVal').val(),
            uRoleId: $('#wrenchModal #wrench #uRoleId').val(),
            uUnitId: $('#wrenchModal #wrench #uunitId').val(),
        },
        success: function () {

            $("#modal-body-id").text("批量修改成功!");
            $("#myModal").modal();
            $("#userTable1").bootstrapTable('refresh');
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
    $("#userTable1").bootstrapTable('refresh');
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
            $("#userTable1").bootstrapTable('refresh');
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
    $("#userTable1").bootstrapTable('refresh');
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
                $("#userTable1").bootstrapTable('refresh');
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
    var uSex = row.uSex;
    var uVip = row.uVip;
    if (uVip == "0") {
        $("#modifyUserModal #userForm #vip").attr("checked", true);
        $("#modifyUserModal #novip")
            .attr("checked", false);

    } else {
        $("#modifyUserModal #novip").attr("checked", true);
        $("#modifyUserModal #vip")
            .attr("checked", false);
    }
    if (uSex == "0") {
        $("#modifyUserModal #man").attr("checked", true);
        $("#modifyUserModal #woman")
            .attr("checked", false);

    } else if (uSex == "1") {
        $("#modifyUserModal #woman").attr("checked", true);
        $("#modifyUserModal #man")
            .attr("checked", false);
    }
    var Area = row.uArea.split(',');
    console.log('Area是：' + Area);
    // Area是：“内蒙古自治区,呼和浩特市,新城区”
    // 地区选择插件 设置为获取值
    if (Area) {
        $("#distpicker2").distpicker('destroy');
        $("#distpicker2").distpicker({
            autoSelect: false,
            placeholder: true
        });
        var $province = $("#province");
        $province.val(Area[0]);
        $province.trigger("change");
        var $city = $("#city");
        $city.val(Area[1]);
        $city.trigger("change");
        var area = $("#area");
        area.val(Area[2]);
        area.trigger("change");
    } else {
        $.messager.alert("温馨提示", "error");
    }

    $("#modifyUserModal #uName").val(row.uName);
    $("#modifyUserModal #urealName").val(row.uRealName);

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

    setTimeout(function () {
        $("#modifyUserModal").modal('show');
    },100)

    $("#modifyUserModal #cancel").off();
    $("#modifyUserModal #cancel").click(function () {
        $('#modifyUserModal').modal('hide');
        $("#userTable1").bootstrapTable('refresh');
        $("#userForm")[0].reset();
    });
    $("#modifyUserModal").on("hidden.bs.modal", function() {
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
            uVip: $("#modifyUserModal input[name='uVip']:checked").val(),
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
            province: $("#modifyUserModal  #province").val(),
            city: $("#modifyUserModal #city").val(),
            area: $("#modifyUserModal #area").val(),
        }
        console.log(data)
        $.ajax({
            type: 'post',
            url: pathurl + 'user/edit',
            data: data,
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
                    $("#userTable1").bootstrapTable('refresh');
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


// setInterval(function(){
//   data = new FormData()
//   data.append('key1',"value1");
//   console.log(data)
// },100)
function doUpload() {
    $("#modal-text").text("请上传后缀为'.xlsx'的表格,可以点击下载模板参考");
    $("#fileinputModal").modal();
    $("#fileinputModal #cancel").click(function () {
        $("#userTable1").bootstrapTable('refresh');
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
                    $("#userTable1").bootstrapTable('refresh');
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
        buttonsClass: "face btn-face",
        showExport: true, //是否显示导出
        exportDataType: "all", //basic', 'all', 'selected'.
        pageList: [10, 25, 50, 100],
        onLoadSuccess: function (data) {  //加载成功时执行
            $('#fileInfoModal').css('z-index', 1500);

            if (state == 0) {

                $('#fileInfoModal #fileInfoLabel').text('上传成功:' + data.total + '条')

            }
            else if (state == 1) {
                $('#fileInfoModal #fileInfoLabel').html('上传失败:' + data.total + '条')
            }
            if (state == 2) {
                $('#fileInfoModal #fileInfoLabel').html('上传重复:' + data.total + '条')
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
function nameformater(value,row) {
    return '<span class="hov" onclick="openinfo(\'' + row.uName + '\')">' + value + '</span>'
}

function roleFormatter(value) {
    var rn = '';
    $.each(rListData, function (index) {
        if (value == rListData[index].id) {
            return rn = rListData[index].name;
        }
    })
    return rn;
}

var dListData;
function unitFormatter(value,row) {
    for (var m = 0; m < dListData.length; m++) {
        if (value == dListData[m].did) {
            return dListData[m].dname;
        }
    }
}
$.ajax({
    type: 'POST',
    url: pathurl + 'user/initDeptAndRole',
    success: function (data) {

        dListData = data.result.dList;//dList    rName  rId
        var rListData = data.result.rList;


        for (var i = 0; i < dListData.length; i++) {
            $('#u_unit_id').append('<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>');
        }
        for (var i = 0; i < rListData.length; i++) {
            $('#u_role_id').append('<option value="' + rListData[i].id + '">' + rListData[i].name + '</option>');
        }

    }
})
// 点击用户查看信息
function openinfo(username) {

    var openinofDom = $("#openinofModal .modal-body");
    openinofDom.html("");
    $.ajax({
        type: 'post',
        url: pathurl + 'facelog/personInfo',
        data: {
            username: username
        },
        cache: false,
        success: function (data) {
            var dataresult = [], compareCount, idCardCount, loginCount, retrieveCount;

            dataresult = data.result[0];
            dataresult.compareCount = data.compareCount;
            dataresult.idCardCount = data.idCardCount;
            dataresult.loginCount = data.loginCount;
            dataresult.retrieveCount = data.retrieveCount;
            $('#openinfoTemp').tmpl(dataresult).appendTo(openinofDom);
            var unittext = $("#openinofModal .modal-body").find('.unit').text();

            $.each(dListData, function (index) {
                if (unittext == dListData[index].did) {
                    return $("#openinofModal .modal-body").find('.unit').html(dListData[index].dname)
                }
            })
            $("#openinofModal").modal();

        },

        error: function () {
            console.error("ajax error");
        }

    });
}
// 点击查看次数

$('#openinofModal .modal-body').on('click', ' .count', function () {

    var name = $('#openinofModal table .name').text().split(':')[1], index = $(this).index('.count');

    countinfo(name, index)

})
function countinfo(n, i) {

    $("#counttable").bootstrapTable('destroy');
    switch (i) {
        case 0:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/retrieveShow?username='+n, //请求后台的URL（*）

                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder:'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) {  //加载成功时执行
                    console.log(data)
                },
                columns: [{
                    title: '序号',
                    formatter: function (value, row, index) {
                        return ++index;
                    }
                },  {
                    field: 'time',
                    title: '时间'
                },]
            });
            break;
        case 1:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/compareShow?username='+n, //请求后台的URL（*）

                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder:'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) {  //加载成功时执行
                    console.log(data)
                },
                columns: [{
                    title: '序号',
                    formatter: function (value, row, index) {
                        return ++index;
                    }
                },  {
                    field: 'time',
                    title: '时间'
                },]
            });
            break;
        case 2:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/idCardShow?username='+n, //请求后台的URL（*）


                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder:'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) {  //加载成功时执行
                    console.log(data)
                },
                columns: [{
                    title: '序号',
                    formatter: function (value, row, index) {
                        return ++index;
                    }
                },  {
                    field: 'time',
                    title: '时间'
                },]
            });
            break;
        case 3:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/loginShow?username='+n, //请求后台的URL（*）

                // url: './faceLog.json',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder:'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) {  //加载成功时执行
                    console.log(data)
                },
                columns: [{
                    title: '序号',
                    formatter: function (value, row, index) {
                        return ++index;
                    }
                },  {
                    field: 'time',
                    title: '时间'
                },]
            });
            break;
    }

    $("#countModal").modal();


}