var userMes = JSON.parse(localStorage.getItem('userMes'))
var rListData=[];
var dListData=[];
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
var uploader1;
var uploader2;
//保存最后上传的图片
var uploadFile1;
var uploadFile2;
$(function () {
    var select = $('#city-picker-search').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
    var select1 = $('#city-picker-search1').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
    var select2 = $('#city-picker-search2').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });


    national.forEach(function (val, i) {
        $('#nation').append('<option value="' + val + '">' + val + '</option>');
    });

    addFormVali();
    init();
    /*初始化单位和角色的下拉框 dList rList*/

    getTable();
    $(".face-table-group button[title='Export data']").removeClass("btn-default");
    $(".face-table-group button[title='Export data']").addClass("face-button");
    $('#adduserModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#modifyUserModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#modifyUserModal #expireTimeVal2').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#wrenchModal #expireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    $('#wrenchModal #manyExpireTimeVal').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });

});

//console.log($('#userdiv input'))

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

//初始化table
function getTable() {
    var uName = $("#userdiv #uRealName").val() || '',

        uUnitId = $("#userdiv #uUnitId").val() || '',
        uRoleId = $("#userdiv #uRoleId").val() || '';
    policeType = $("#userdiv #policeType").val() || '',
        approval = $("#userdiv #approval").val() || '';
    var areacodeArr = [],
        areanameArr = [];

    var pr = $("#userdiv input[name='userProvinceId']").val() || '';
    areacodeArr.push(pr)
    var ci = $("#userdiv input[name='userCityId']").val() || '';
    areacodeArr.push(ci)
    var di = $("#userdiv input[name='userDistrictId']").val() || '';
    areacodeArr.push(di)
    var prn = $("#userdiv .province>a").text() || '';
    areanameArr.push(prn)
    var cin = $("#userdiv .city>a").text() || '';
    areanameArr.push(cin)
    var din = $("#userdiv .district>a").text() || '';
    areanameArr.push(din)
    var areacode = regk(areacodeArr).substr(1)
    var areaname = regk(areanameArr).substr(1)


    $("#userTable1").bootstrapTable('destroy');
    $("#userTable1").bootstrapTable({
        method: "post",
        url: pathurl + "user/usersList?uName=" + uName + "&uUnitId=" + uUnitId + "&uRoleId=" + uRoleId + "&areacode=" + areacode + "&policeType=" + policeType + '&approval=' + approval,
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
        onLoadSuccess: function (data) { //加载成功时执行
            console.log('初始化%o', data)
        },
        columns: [{
            field: 'checked',
            checkbox: true,
            formatter: function (value, row, index) {
                if (row.uId == userMes.uid) {
                    return {
                        disabled: true, //设置是否可用
                    };
                } else {
                    return {
                        disabled: false, //设置是否可用
                    };
                }
            }
        }]
    });

}

function addFormVali() {
    $('#adduserModal #userForm').bootstrapValidator({
        fields: {
            uName: {
                validators: {
                    notEmpty: {
                        message: '请输入用户名'
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
                        regexp: /^1[3|4|5|7|8][0-9]{9}$/,
                        message: '手机格式不正确'
                    }
                }
            }
        }
    });
}

function addUser() {
    // uploadFile($("#add-image-button1"));
    // uploadFile1=null
    $('#adduserModal #city-picker-search1 .province a').html('请选择省份')
    $('#adduserModal #city-picker-search1 .city a').html('请选择省份')
    $('#adduserModal #city-picker-search1 .district a').html('请选择区县')
    $('#adduserModal #city-picker-search1 input').val("");

    $('#addImg').attr('src', './img/default_img.png');
    $('#adduserModal #userForm')[0].reset()
    $("#adduserModal .modal-title").html("添加用户");
    $("#adduserModal").modal();
    $("#adduserModal #cancel").off()
    $("#adduserModal #cancel").click(function () {
        $('#adduserModal').modal('hide');
        $("#adduserModal #userForm")[0].reset();
        $("#userTable1").bootstrapTable('refresh');
        $("#adduserModal #userForm").removeClass("has-feedback has-success has-error"); //移除所有class="form-group"属性的所有div
        $(".help-block").hide(); //隐藏所有class="help-block"的提示元素

    });
}

$("#adduserModal #continue").off();
$('#adduserModal #uCardId').blur(function () {
    $(this).val($('#adduserModal #uCardId').val().toString().toUpperCase())
})
$('#adduserModal #expireTime').change(function () {
    var dateval = $(this).val();
    if (dateval == 5) {
        $('#adduserModal #expireTimeVal').css('visibility', '');

    } else {
        $('#adduserModal #expireTimeVal').css('visibility', 'hidden').val('');
        var expireTime;
        if (dateval == 0) {
            expireTime = dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd');
        } else if (dateval == 1) {
            expireTime = dateUtil.dateAdd('d ', 30, new Date).format('yyyy-MM-dd');
        } else if (dateval == 2) {
            expireTime = dateUtil.dateAdd('m ', 6, new Date).format('yyyy-MM-dd');
        } else if (dateval == 3) {
            expireTime = dateUtil.dateAdd('y ', 1, new Date).format('yyyy-MM-dd');
        } else if (dateval == 4) {
            expireTime = dateUtil.dateAdd('y ', 3, new Date).format('yyyy-MM-dd');
        }

        $('#expireTimeVal').val(expireTime);
    }

});


$('#adduserModal #userForm').on('hide.bs.modal', function () {
    $('#adduserModal #userForm')[0].reset();

    $('#adduserModal #userForm').data('bootstrapValidator').resetForm();
});

$("#adduserModal #continue").click(function () {

    //触发全部验证
    $('#adduserModal #userForm').data("bootstrapValidator").validate();
    // 获取当前表单验证状态
    // flag = true/false
    var flag = $('#adduserModal #userForm').data("bootstrapValidator").isValid();
    if (!flag) {
        return;

    } else {
        //通过校验，可进行提交等操作toUpperCase()
        var expireTime = $('#expireTimeVal').val()

        var areacodeArr = [],
            areanameArr = [];
        var pr = $("#adduserModal input[name='userProvinceId']").val() || '';
        areacodeArr.push(pr)
        var ci = $("#adduserModal input[name='userCityId']").val() || '';
        areacodeArr.push(ci)
        var di = $("#adduserModal input[name='userDistrictId']").val() || '';
        areacodeArr.push(di)
        var prn = $("#adduserModal .province>a").text() || '';
        areanameArr.push(prn)
        var cin = $("#adduserModal .city>a").text() || '';
        areanameArr.push(cin)
        var din = $("#adduserModal .district>a").text() || '';
        areanameArr.push(din)
        var areacode = regk(areacodeArr).substr(1)
        var areaname = regk(areanameArr).substr(1)

        var faceData = new FormData();
        try {
            var isImg = $('#addImgFile').get(0).files[0];
        } catch (e) {
            var isImg = $('#addImgFile').get(0).value;
        }
        if (!!isImg) {
            faceData.append('file', isImg);
        }
        faceData.append('uName', $("#adduserModal #uName").val());
        faceData.append('policeType', $("#adduserModal #policeType").val());
        faceData.append('approval', $("#adduserModal #approval").val());
        faceData.append('uRealName', $("#adduserModal #urealName").val());
        faceData.append('uSex', $("#adduserModal input[name='uSex']:checked").val());
        faceData.append('uCardId', $('#adduserModal #uCardId').val());
        faceData.append('uStatus', $("#adduserModal #uStatus").val());
        faceData.append('uPhone', $("#adduserModal #uPhone").val());
        faceData.append('uTelephone', $("#adduserModal #uTelephone").val());
        faceData.append('uPolicyNum', $("#adduserModal #uPolicyNum").val());
        faceData.append('uDuty', $("#adduserModal #uDuty").val());
        faceData.append('uRoleId', $("#adduserModal #uRoleId").val());
        faceData.append('uUnitId', $("#adduserModal #uunitId").val());
        faceData.append('expireTime', expireTime||dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd'));
        faceData.append('areacode', areacode);
        faceData.append('areaname', areaname);
        faceData.append('uVip', $("#adduserModal input[name='uVIP']:checked").val());
        // uCardId=$('#adduserModal #uCardId').val().toString().toUpperCase();
        $.ajax({
            type: 'post',
            url: pathurl + 'user/new',
            data: faceData,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.code == 200) {
                    $('#adduserModal').modal('hide');
                    $("#modal-body-id").html('添加成功');
                    $('#myModal').modal('show');
                    $("#userForm")[0].reset();
                    uploadFile1 = null; //重置
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
                $('#myModal').modal('show');
            }
        });
    }
});


$("#adduserModal").on("hidden.bs.modal", function () {
    $("#adduserModal #userForm").data('bootstrapValidator').resetForm();
    $("#adduserModal #userForm")[0].reset();
    $('#expireTimeVal').css('visibility', 'hidden');
});
$("#modifyUserModal").on("hidden.bs.modal", function () {
    $("#modifyUserModal #userForm")[0].reset();
});
/*初始化单位和角色的下拉框 dList rList*/


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
            dListData = data.result.dList; //dList    rName  rId
            rListData = data.result.rList;
            for (var i = 0; i < dListData.length; i++) {
                unitStr += '<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>';
            }
            for (var i = 0; i < rListData.length; i++) {
                roleStr += '<option value="' + rListData[i].id + '">' + rListData[i].name + '</option>';
            }


            $('#userdiv #uUnitId option').eq(0).after(unitStr);
            $('#userdiv #uRoleId option').eq(0).after(roleStr);
            //          $('#userdiv #uunitId').html(unitStr);
            //          $('#userdiv #uRoleId').html(roleStr);

            $('#adduserModal #uUnitId option').eq(0).after(unitStr);
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
    $("#uUnitId").val('');
    $("#uRealName").val("");
    $(".face-form input,.face-form select").val("");
    $('#userdiv #city-picker-search .province a').html('请选择省份')
    $('#userdiv #city-picker-search .city a').html('请选择省份')
    $('#userdiv #city-picker-search .district a').html('请选择区县')
    $('#userdiv #city-picker-search input').val("");
    var select = $('.city-picker-select').cityPicker({dataJson: cityData, renderMode: false, linkage: false});


    getTable();
}

function statusFormatter(value, row, index) {
    if(userMes.uid==row.uId){
      if (row.uStatus == 'Y') {
          return ['<button class="reset btn-sm btn face-button " style="margin-right:15px;" disabled="disabled">正常</button>'].join();
      } else {
          return ['<button class="reset btn-sm btn face-button2" style="margin-right:15px;" disabled="disabled">停用</button>'].join();
      }
    }else{
      if (row.uStatus == 'Y') {
          return ['<button class="reset btn-sm btn face-button " style="margin-right:15px;">正常</button>'].join();
      } else {
          return ['<button class="reset btn-sm btn face-button2" style="margin-right:15px;">停用</button>'].join();
      }
    }

}

function operateFormatter(value, row, index) {
    if (userMes.uid == row.uId) {   //登陆的用户和列表的用户相同   ：不现实删除按钮   登录用户不能删除自己
        if (userMes.uid == 1) {  //是管理员

            if (row.bindType == 0) {  //绑定状态

                return ['<button type="button" class="resetSafetyCode btn-sm btn  face-button" style="margin-right:15px;">安全码重置</button>', '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" data-id="button3" class="pcode unbind btn-sm btn face-button2" style="margin-right:15px;">解&#12288;绑</button>'].join('');
            } else if (row.bindType == 1) {  //未绑定状态

                return ['<button type="button" class="resetSafetyCode btn-sm btn  face-button" style="margin-right:15px;">安全码重置</button>', '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" disabled class="unbind btn-sm btn face-button" style="margin-right:15px;">未绑定</button>'].join('');
            }
        } else { //不是管理员
            if (row.bindType == 0) {

                return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" data-id="button3" class="pcode unbind btn-sm btn face-button2" style="margin-right:15px;">解&#12288;绑</button>'].join('');
            } else if (row.bindType == 1) {

                return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" disabled class="unbind btn-sm btn face-button" style="margin-right:15px;">未绑定</button>'].join('');
            }
        }

    } else {
        if (row.bindType == 0) {
            if (row.isdelete == 1) {//删除
                return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" data-id="button3" class="pcode unbind btn-sm btn face-button2" style="margin-right:15px;">解&#12288;绑</button>', '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">确认删除</button>', '<button type="button" data-id="button2" class="pcode btn-warning btn-sm btn" style="margin-right:15px;">恢复</button>'].join('');
            }
            return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>', '<button type="button" data-id="button3" class="pcode unbind btn-sm btn face-button2" style="margin-right:15px;">解&#12288;绑</button>'].join('');
        } else if (row.bindType == 1) {
            if (row.isdelete == 1) {//删除
                return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" disabled class="unbind btn-sm btn face-button" style="margin-right:15px;">未绑定</button>', '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">确认删除</button>', '<button type="button" data-id="button2" class="pcode btn-warning btn-sm btn recovery" style="margin-right:15px;">恢复</button>'].join('');
            }
            return ['<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>', '<button type="button" data-id="button1" class="pcode update btn-sm btn face-button " style="margin-right:15px;">修改</button>', '<button type="button" data-id="button2" class="pcode delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>', '<button type="button" disabled class="unbind btn-sm btn face-button" style="margin-right:15px;">未绑定</button>'].join('');
        }
    }

}

$('#userModal #cancel').on('click', function () {
    $('#userModal').modal('hide');
})

function updateStatus(row) {

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
        // if(row.uId=)
        updateStatus(row); //修改状态
    }
};

window.operateEvents = { //done
    'click .recovery': function (e, value, row, index) {
        recovery(row);
    },
    'click .resetSafetyCode': function (e, value, row, index) { //安全吗重置
        resetSafetyCodeValidator()
        $('#resetSafetyCodeModal').modal('show');
        $('#rowUId').val(row.uId);
    },
    'click .resetPwd': function (e, value, row, index) { //密码重置
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
    'click .unbind': function (e, value, row, index) {
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

function resetSafetyCodeValidator() {
    $('#resetSafetyCodeForm').bootstrapValidator({
        fields: {
            oldPd: {
                validators: {
                    notEmpty: {
                        message: '请输入原始密码'
                    },
                    callback: {
                        message: '密码错误',
                        callback: function (value, validator) {
                            var oldPassword;
                            $.ajax({
                                type: 'POST',
                                async: false,
                                url: pathurl + 'user/getsafepwd',
                                success: function (data) {
                                    //  console.log(data)
                                    if (data.code == 200) {
                                        oldPassword = data.result
                                    }
                                }
                            })
                            //  console.log(md5(value).toUpperCase())
                            //   console.log(oldPassword)
                            return md5(value).toUpperCase() == oldPassword;
                        }
                    }
                },

            },
            newPd: {
                trigger: "change",
                validators: {

                    notEmpty: {
                        message: '请输入新密码'
                    }
                }
            },
            twiceNewPd: {
                trigger: "change",
                validators: {
                    notEmpty: {
                        message: '请再次输入新密码'
                    },
                    identical: {
                        field: 'newPd',
                        message: '两次输入的密码不相符'
                    }
                }
            }
        }
    });
    $('#resetSafetyCodeForm').data('bootstrapValidator').validate();
}

//安全码重置
$('#resetSafetyCodeModal').on('hide.bs.modal', function () {
    $('#resetSafetyCodeForm')[0].reset();
    $('#resetSafetyCodeForm').data('bootstrapValidator').resetForm();
});
$("#resetSafetyCodeModal #resetSubmit").on('click', function () {

    var twiceNewPd = $('#resetSafetyCodeModal #twiceNewPd').val();
    if ($('#resetSafetyCodeForm').data('bootstrapValidator').isValid()) {
        console.log('验证通过')
        console.log(md5(twiceNewPd).toUpperCase())
        $.ajax({
            type: 'POST',
            url: pathurl + 'user/resetsafepwd',
            data: {
                safecode: md5(twiceNewPd).toUpperCase()
            },
            success: function (data) {
                if (data.code == 200) {
                    $("#myModal #modal-body-id").text("重置成功!");
                    $('#resetSafetyCodeForm')[0].reset();
                    $("#myModal").modal();
                    $("#resetSafetyCodeModal").modal('hide');
                }
            }
        })
    }

})

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
            ids: $('#rowUId').val()
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
    $('#wrenchModal #wrench')[0].reset();
    var ids = getSelectedRowsIds('userTable1');
    $('#rowUId').val(ids);
    if (ids) {
        $("#wrenchModal").modal('show');

    } else {
        $("#myModal #modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal('show');
    }
};
$('#wrenchModal #manyExpireTime').change(function () {
    var dateval = $(this).val();
    if (dateval == 5) {
        $('#wrenchModal #manyExpireTimeVal').css('visibility', '');

    } else {
        $('#wrenchModal #manyExpireTimeVal').css('visibility', 'hidden');
        var expireTime;
        if (dateval == 0) {
            expireTime = dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd');
        } else if (dateval == 1) {
            expireTime = dateUtil.dateAdd('d ', 30, new Date).format('yyyy-MM-dd');
        } else if (dateval == 2) {
            expireTime = dateUtil.dateAdd('m ', 6, new Date).format('yyyy-MM-dd');
        } else if (dateval == 3) {
            expireTime = dateUtil.dateAdd('y ', 1, new Date).format('yyyy-MM-dd');
        } else if (dateval == 4) {
            expireTime = dateUtil.dateAdd('y ', 3, new Date).format('yyyy-MM-dd');
        }
        console.log(expireTime)
        $('#wrenchModal #manyExpireTimeVal').val(expireTime);
    }

});

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
            expireTime: $('#manyExpireTimeVal').val() || dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd'),
            uRoleId: $('#wrenchModal #wrench #uRoleId').val(),
            uUnitId: $('#wrenchModal #wrench #uunitId').val()
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
// 删除用户

$("#delUserTModel #continue").off();
$("#delUserTModel #continue").click(function () {
    if (userMes.roleid == 1) {
        $("#delUserTModel").modal('hide');
        $('#verificationSafetyCodeModal').modal('show');
    } else {
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
    }


});
//管理员删除是真删啊  用安全吗验证
$('#verificationSafetyCodeModal').on('hide.bs.modal', function () {
    $('#verificationSafetyCodeForm')[0].reset();
    $("#userTable1").bootstrapTable('refresh');
});
$('#verificationSafetyCodeModal #verificationSafetyCodeSubmit').on('click', function () {
    var safetyCode = md5($('#safetyCode').val()).toUpperCase();
    $.ajax({
        type: 'POST',
        async: false,
        url: pathurl + 'user/getsafepwd',
        success: function (data) {
            //  console.log(data)
            if (data.code == 200) {
                console.log(safetyCode)
                console.log(data.result)
                if (safetyCode == data.result) {
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
                                $('#verificationSafetyCodeModal').modal('hide');
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
                } else {
                    $("#modal-body-id").text("密码错误");
                    $("#myModal").modal();
                }

            }
        }
    })


})

// 修改
$('#modifyUserModal #userForm').on('hide.bs.modal', function () {
    $('#modifyUserModal #userForm')[0].reset();
    uploadFile2 = null; //重置
    $('#modifyUserModal #userForm').data('bootstrapValidator').resetForm();
});

function userEdit(row) {
//   console.log(uploadFile2)
//
// uploadFile2 = null; //重置
// console.log(row.uId)
// console.log(userMes.uId)
//
    $('#modifyUserModal #city-picker-search2 .province a').html('请选择省份');
    $('#modifyUserModal #city-picker-search2 .city a').html('请选择省份');
    $('#modifyUserModal #city-picker-search2 .district a').html('请选择区县');
    $('#modifyUserModal #city-picker-search2 input').val("");

    $('#modifyImg').attr('src', './img/default_img.png');
    $('#modifyUserModal #userForm')[0].reset()
    if (row.uId == userMes.uid) {
        console.log('是自己')
        $('#modifyUserModal #vip').prop('disabled', true);
        $('#modifyUserModal #novip').prop('disabled', true);
        $('#modifyUserModal #uRoleId').prop('disabled', true);
        $('#modifyUserModal #uunitId').prop('disabled', true);
        $('#modifyUserModal #approval').prop('readonly', true);
        // $('#city-picker-search2')
        // select2.bindEvent()
        $('#city-picker-search2').click(function () {
            $('#city-picker-search2 .selector-list').hide();
        })

    } else {
        console.log('不是自己')
        $('#modifyUserModal #vip').prop('disabled', false);
        $('#modifyUserModal #novip').prop('disabled', false);
        $('#modifyUserModal #uRoleId').prop('disabled', false);
        $('#modifyUserModal #uunitId').prop('disabled', false);
        $('#modifyUserModal #approval').prop('readonly', false);
        $('#city-picker-search2').click(function () {
            $('#city-picker-search2 .selector-list').show();
        })
    }

    console.log(row);
    var uSex = row.uSex;
    var uVip = row.uVip;
    if (uVip == "0") {
        $("#modifyUserModal #userForm #vip").attr("checked", true);
        $("#modifyUserModal #novip").attr("checked", false);

    } else {
        $("#modifyUserModal #novip").attr("checked", true);
        $("#modifyUserModal #vip").attr("checked", false);
    }
    if (uSex == "0") {
        $("#modifyUserModal #man").attr("checked", true);
        $("#modifyUserModal #woman").attr("checked", false);

    } else if (uSex == "1") {
        $("#modifyUserModal #woman").attr("checked", true);
        $("#modifyUserModal #man").attr("checked", false);
    }
    var Area = row.uArea.split(',');
    console.log('Area是：' + Area);
    // Area是：“内蒙古自治区,呼和浩特市,新城区”
    // 地区选择插件 设置为获取值
    // if (Area) {
    //     $("#distpicker2").distpicker('destroy');
    //     $("#distpicker2").distpicker({
    //         autoSelect: false,
    //         placeholder: true
    //     });
    //     var $province = $("#province");
    //     $province.val(Area[0]);
    //     $province.trigger("change");
    //     var $city = $("#city");
    //     $city.val(Area[1]);
    //     $city.trigger("change");
    //     var area = $("#area");
    //     area.val(Area[2]);
    //     area.trigger("change");
    // } else {
    //     $.messager.alert("温馨提示", "error");
    // }
    // $("#imgId").attr('src',path);
    // $("#modifyUserModal #img0").attr('src','');
    var select2 = $('#city-picker-search2').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
    $("#modifyUserModal #uName").val(row.uName);
    $("#modifyUserModal #urealName").val(row.uRealName);
    $('#modifyUserModal #modifyImg').attr('src', '')
    if (row.picurl) {
        console.log(row.picurl)
        $('#modifyUserModal #modifyImg').attr('src', row.picurl)
    } else {
        $('#modifyUserModal #modifyImg').attr('src', './img/default_img.png');
    }
    var cityArr = []

    var areanameArr = row.uArea.split('-')
    var areacodeArr = row.areacode.split('-')

    // console.log(areanameArr)
    // console.log(areacodeArr)
    for (var i = 0; i < areacodeArr.length; i++) {
        var obj = {}
        obj.id = areacodeArr[i];
        obj.name = areanameArr[i];
        cityArr.push(obj)
    }


    //设置城市
    select2.setCityVal(cityArr);
    $("#modifyUserModal #uCardId").val(row.uCardId);
    $("#modifyUserModal #uType").val(row.uType);
    $("#modifyUserModal #uStatus").val(row.uStatus);
    console.log(row.uVip)
    if (row.uVip == 1) {
        console.log('是vip')
        $("#modifyUserModal #vip").prop('checked', true);
    } else if (row.uVip == 0) {
        console.log('不是vip')
        $("#modifyUserModal #novip").prop('checked', true);
    }

    $('#modifyUserModal #expireTime2').val(5)
    $('#modifyUserModal #expireTimeVal2').css('visibility', '').val(row.expireTime)
    $('#modifyUserModal #imgBox').attr('src', row.picurl);
    $("#modifyUserModal #uPhone").val(row.phone);
    $("#modifyUserModal #uTelephone").val(row.telephone);
    $("#modifyUserModal #uPolicyNum").val(row.uPolicyNum);
    $("#modifyUserModal #uDuty").val(row.uDuty);
    $("#modifyUserModal #uRoleId").val(row.uRoleId);
    $("#modifyUserModal #uunitId").val(row.uUnitId);
    $("#modifyUserModal #expireTimeVal").val(row.expireTime);
    $("#modifyUserModal .modal-title").html("修改用户");
    $('#modifyUserModal #approval').val(row.approval);
    $('#modifyUserModal #policeType').val(row.policeType)
    setTimeout(function () {
        $("#modifyUserModal").modal('show');
    }, 100)
    $('#modifyUserModal #expireTime2').change(function () {
        var dateval = $(this).val();
        if (dateval == 5) {
            $('#modifyUserModal #expireTimeVal2').css('visibility', '');

        } else {
            $('#modifyUserModal #expireTimeVal2').css('visibility', 'hidden');
            var expireTime;
            if (dateval == 0) {
                expireTime = dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd');
            } else if (dateval == 1) {
                expireTime = dateUtil.dateAdd('d ', 30, new Date).format('yyyy-MM-dd');
            } else if (dateval == 2) {
                expireTime = dateUtil.dateAdd('m ', 6, new Date).format('yyyy-MM-dd');
            } else if (dateval == 3) {
                expireTime = dateUtil.dateAdd('y ', 1, new Date).format('yyyy-MM-dd');
            } else if (dateval == 4) {
                expireTime = dateUtil.dateAdd('y ', 3, new Date).format('yyyy-MM-dd');
            }
            console.log(expireTime)
            $('#expireTimeVal2').val(expireTime);
        }

    });
    $("#modifyUserModal #cancel").off();
    $("#modifyUserModal #cancel").click(function () {
        $('#modifyUserModal').modal('hide');
        $("#userTable1").bootstrapTable('refresh');
        $("#userForm")[0].reset();
    });
    $("#modifyUserModal").on("hidden.bs.modal", function () {
        $("#userForm")[0].reset();
    });
    var uId = row.uId;
    $("#modifyUserModal #continue").off();
    $("#modifyUserModal #continue").click(function () {
        $('#modifyUserModal').modal('hide');

        var faceDatas = new FormData();
        expireTime = $('#expireTimeVal2').val()

        faceDatas.append('uId', uId);

        // if(uploadFile2){
        //   faceDatas.append('file', uploadFile2);
        // }

        try {
            var isImg = $('#modifyImgFile').get(0).files[0];
        } catch (e) {
            var isImg = $('#modifyImgFile').get(0).value;
        }
        console.log(isImg)
        if (!!isImg) {
            faceDatas.append('file', isImg);

        }

        faceDatas.append('uName', $("#modifyUserModal #uName").val());
        faceDatas.append('policeType', $("#modifyUserModal #policeType").val());
        // faceDatas.append('uVIP', $("#modifyUserModal #uVIP").val());
        faceDatas.append('uVip', $("#modifyUserModal input[name='uVIP']:checked").val());
        // console.log($("#modifyUserModal input[name='uVIP']:checked").val())
        faceDatas.append('approval', $("#modifyUserModal #approval").val());
        faceDatas.append('uRealName', $("#modifyUserModal #urealName").val());
        faceDatas.append('uSex', $("#modifyUserModal input[name='uSex']:checked").val());
        faceDatas.append('uCardId', $('#modifyUserModal #uCardId').val());
        faceDatas.append('uStatus', $("#modifyUserModal #uStatus").val());
        faceDatas.append('uPhone', $("#modifyUserModal #uPhone").val());
        faceDatas.append('uTelephone', $("#modifyUserModal #uTelephone").val());
        faceDatas.append('uPolicyNum', $("#modifyUserModal #uPolicyNum").val());
        faceDatas.append('uDuty', $("#modifyUserModal #uDuty").val());
        faceDatas.append('uRoleId', $("#modifyUserModal #uRoleId").val());
        faceDatas.append('uUnitId', $("#modifyUserModal #uunitId").val());
        faceDatas.append('expireTime', expireTime||dateUtil.dateAdd('d ', 7, new Date).format('yyyy-MM-dd'));
        var areacodeArr = [],
            areanameArr = [];

        var pr = $("#modifyUserModal input[name='userProvinceId']").val() || '';
        areacodeArr.push(pr)
        var ci = $("#modifyUserModal input[name='userCityId']").val() || '';
        areacodeArr.push(ci)
        var di = $("#modifyUserModal input[name='userDistrictId']").val() || '';
        areacodeArr.push(di)
        var prn = $("#modifyUserModal .province>a").text() || '';
        areanameArr.push(prn)
        var cin = $("#modifyUserModal .city>a").text() || '';
        areanameArr.push(cin)
        var din = $("#modifyUserModal .district>a").text() || '';
        areanameArr.push(din)
        var areacode = regk(areacodeArr).substr(1)
        var areaname = regk(areanameArr).substr(1)
        faceDatas.append('areacode', areacode);
        faceDatas.append('areaname', areaname);
        faceDatas.append('uVIP', $("#modifyUserModal input[name='uVIP']:checked").val());
        // var data = {
        //
        //     uName: $("#modifyUserModal #uName").val(),
        //     uRealName: $("#modifyUserModal #urealName").val(),
        //     uSex: $("#modifyUserModal input[name='uSex']:checked").val(),
        //     uVip: $("#modifyUserModal input[name='uVip']:checked").val(),
        //     uCardId: $("#modifyUserModal #uCardId").val(),
        //     uType: $("#modifyUserModal #uType").val(),
        //     uStatus: $("#modifyUserModal #uStatus").val(),
        //     uPhone: $("#modifyUserModal #uPhone").val(),
        //     uTelephone: $("#modifyUserModal #uTelephone").val(),
        //     uPolicyNum: $("#modifyUserModal #uPolicyNum").val(),
        //     uDuty: $("#modifyUserModal #uDuty").val(),
        //     uRoleId: $("#modifyUserModal #uRoleId").val(),
        //     uUnitId: $("#modifyUserModal #uunitId").val(),
        //     expireTime: $("#modifyUserModal #expireTimeVal").val(),
        //     province: $("#modifyUserModal  #province").val(),
        //     city: $("#modifyUserModal #city").val(),
        //     area: $("#modifyUserModal #area").val(),
        // }
        // console.log(data)
        $.ajax({
            type: 'post',
            url: pathurl + 'user/edit',
            data: faceDatas,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
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
            return {pageSize: params.pageSize, pageNumber: params.pageNumber}
        },
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        buttonsClass: "face btn-face",
        showExport: true, //是否显示导出
        exportDataType: "all", //basic', 'all', 'selected'.
        pageList: [
            10, 25, 50, 100
        ],
        onLoadSuccess: function (data) { //加载成功时执行
            $('#fileInfoModal').css('z-index', 1500);

            if (state == 0) {

                $('#fileInfoModal #fileInfoLabel').text('上传成功:' + data.total + '条')

            } else if (state == 1) {
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

function nameformater(value, row) {
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

function unitFormatter(value, row) {
    for (var m = 0; m < dListData.length; m++) {
        if (value == dListData[m].did) {
            return dListData[m].dname;
        }
    }
}

//恢复
function recovery(row) {
    console.log(row);
    $("#resetTModel #modal-body-text").text("确定恢复吗?");
    $("#resetTModel").modal('show');
    $("#resetTModel #continue").off();
    $("#resetTModel #continue").click(function () {
        $.ajax({
            type: 'post',
            url: pathurl + 'user/undodelete',
            data: {
                uId: row.uId
            },
            success: function (res) {
                if (res.code == 200) {
                    $("#modal-body-id").text("恢复成功");
                    $("#myModal").modal();
                    $("#resetTModel").modal('hide');
                    $("#userTable1").bootstrapTable('refresh');
                } else {
                    $("#modal-body-id").text("恢复失败");
                    $("#myModal").modal();
                }
            },
            error: function () {
                $("#modal-body-id").text("服务器出错");
                $("#myModal").modal();
            }
        })
    })

};

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
            var dataresult = [],
                compareCount,
                idCardCount,
                loginCount,
                retrieveCount,
                appCount,
                importCount;


            dataresult = data.result[0];
            dataresult.compareCount = data.compareCount;
            dataresult.idCardCount = data.idCardCount;
            dataresult.loginCount = data.loginCount;
            dataresult.retrieveCount = data.retrieveCount;
            dataresult.appCount = data.appCount;
            dataresult.importCount = data.importCount;
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

    var name = $('#openinofModal table .name').text().split(':')[1],
        index = $(this).index('.count');

    countinfo(name, index)

})

function countinfo(n, i) {

    $("#counttable").bootstrapTable('destroy');
    switch (i) {
        case 0:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/retrieveShow?username=' + n, //请求后台的URL（*）
                method: 'post',
                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'chosen',
                        title: '是否比中',
                        formatter: function (value, row, index) {
                            if (value == 0) {
                                return '是'
                            } else {
                                return '否'
                            }
                        }
                    }, {
                        field: 'harmful',
                        title: '是否有害'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    }, {
                        field: 'remark',
                        title: '检索备注'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 1:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/compareShow?username=' + n, //请求后台的URL（*）

                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'name',
                        title: '真实姓名'
                    },  {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    },{
                        field: 'yurl',
                        title: '原来图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    }, {
                        field: 'persent',
                        title: '相似度'
                    }
                ]
            });
            break;
        case 2:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/idCardShow?username=' + n, //请求后台的URL（*）

                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'plat',
                        title: '来源'
                    }, {
                        field: 'company',
                        title: '算法'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'name',
                        title: '真实姓名'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    }, {
                        field: 'yurl',
                        title: '原来图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    }, {
                        field: 'persent',
                        title: '相似度'
                    }
                ]
            });
            break;
        case 3:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/loginShow?username=' + n, //请求后台的URL（*）

                method: 'post',
                pagination: true,
                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '时间'
                    },  {
                        field: 'username',
                        title: '用户名'
                    }
                ]
            });
            break;
        case 4:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/appLoginShow?username=' + n, //请求后台的URL（*）

                method: 'post',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'devicetype',
                        title: 'APP类型'
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'longtutide',
                        title: '经度'
                    }, {
                        field: 'laititude',
                        title: '纬度'
                    },
                ]
            });
            break;
        case 5:
            $('#counttable').bootstrapTable({
                url: pathurl + 'facelog/importShow?username=' + n, //请求后台的URL（*）

                method: 'post',
                pagination: true,

                contentType: "application/x-www-form-urlencoded",
                queryParamsType: " limit",
                paginationDetailHAlign: "left",
                sortOrder: 'desc',
                pageNumber: 1, //初始化加载第一页，默认第一页
                pageList: [
                    10, 25, 50, 100
                ], //可供选择的每页的行数（*）
                onLoadSuccess: function (data) { //加载成功时执行
                    console.log(data)
                },
                columns: [
                    {
                        title: '序号',
                        formatter: function (value, row, index) {
                            return ++index;
                        }
                    }, {
                        field: 'time',
                        title: '创建时间'
                    }, {
                        field: 'username',
                        title: '用户名'
                    }, {
                        field: 'name',
                        title: '真实姓名'
                    }, {
                        field: 'userdepart',
                        title: '部门'
                    }, {
                        field: 'userorgan',
                        title: '地区'
                    }, {
                        field: 'url',
                        title: '图片',
                        formatter: function (value, row, index) {
                            return '<img width="130" height="180" src=' + value + '>'
                        }
                    }, {
                        field: 'car_no',
                        title: '车牌号'
                    }, {
                        field: 'phone_no',
                        title: '手机号'
                    }
                ]
            });
            break;
    }

    $("#countModal .modal-title").text($($('.count')[i]).text());
    $("#countModal").modal();

}


function preview(file) {
    var img = $(file).parents('.tx').find('img');
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            $(img).attr('src', evt.target.result);
        }
        reader.readAsDataURL(file.files[0]);

    } else {
        $(img).removeAttr('src');
        $(img)[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + file.value + "\")"
    }
}
