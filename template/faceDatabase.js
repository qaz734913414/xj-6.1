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
var  rListData;
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
//初始化table
function getTable() {
    $("#facedataTable").bootstrapTable('destroy');
    $("#facedataTable").bootstrapTable({
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

        return [

            '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">清空</button>',
            '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>',

        ].join('');



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
            $("#facedataTable").bootstrapTable('refresh');
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

    'click .update': function (e, value, row, index) { //修改用户
        userEdit(row);
    },
    'click .delete': function (e, value, row, index) { //删除用户
        // deleteUser(row);
        $("#delUserTModel #modal-body-text").text("确定将" + row.uName + "删除?");
        $("#delUserTModel").modal('show');
        $('#rowUId').val(row.uId);
    },

};
$("#resetTModel #cancel").click(function () {
    $("#facedataTable").bootstrapTable('refresh');
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
            $("#facedataTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
            console.log('密码重置失败!')
        },
        dataType: 'json'
    });
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

function sexFormatter(value) {
    if (value == 0) {
        return '男';
    } else {
        return '女';
    }
}


function roleFormatter(value) {
    var rn='';
$.each(rListData,function (index) {
    if(value==rListData[index].id){
        return  rn= rListData[index].name;
    }
})
    return rn;
}
