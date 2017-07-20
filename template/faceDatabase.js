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

$(function () {
    national.forEach(function(val,i){
        $('#nation').append('<option value="'+val+'">'+val+'</option>');
    });
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
    $('#addForm')
        .bootstrapValidator({
            fields: {
                uname: {
                    validators: {
                        notEmpty: {
                            message: '请输入用户名'
                        },
                        regexp: {
                            regexp: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{3,11}/,
                            message: '库名只能包含字母或者数字'
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
                nation: {
                    validators: {
                        notEmpty: {
                            message: '请输入民族'
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

//初始化table
function getTable() {
    $("#facedataTable").bootstrapTable('destroy');
    $("#facedataTable").bootstrapTable({
        method: "post",
        url: pathurl + 'library/librarylist',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
                dbname:$('#dbname').val()
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
    $("#dbname").val("");
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

function openFormatter(value, row, index) {
    return '<span class="hov" onclick="openinfo(\'' + row.dbname + '\')">' + value + '</span>'
}
// 点击建库者查看信息
function openinfo(username) {
    var openinofDom = $("#openinofModal .modal-body");
    // openinofDom.html("");
    // $.ajax({
    //     type: 'post',
    //     url: pathurl + 'facelog/personInfo',
    //     data: {
    //         username: username
    //     },
    //     cache: false,
    //     success: function (data) {

            $("#openinofModal").modal();

    //     },
    //
    //     error: function () {
    //         console.error("ajax error");
    //     }
    //
    // });
}
function doUpload() {
    $("#modal-text").text("请上传后缀为'.zip'的文件");
    $("#fileinputModal").modal();


}
$("#fileinputModal #continue").click(function () {
    var formData = new FormData($("#uploadForm")[0]);
    console.log('formData.get("file"):'+formData.get("file"));
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
// 上传图片
function preview(file){
    if (file.files && file.files[0]){
        var reader = new FileReader();
        reader.onload = function(evt){
            $('#img0').attr('src',evt.target.result);
        }
        reader.readAsDataURL(file.files[0]);
    }else{
        $('#img0').removeAttr('src');
        $('#img0')[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + file.value + "\")"
    }
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

// 新增1
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
// 新增2
function add() {
    $("#userForm")[0].reset();
    $("#addModal .modal-title").html("添加用户");
    $("#addModal").modal();
    $("#addModal #cancel").off()
    $("#addModal #cancel").click(function () {
        $('#addModal').modal('hide');
        $("#facedataTable").bootstrapTable('refresh');
    });
}
$("#addModal #continue").off();
$("#addModal #continue").click(function (form) {

    $.ajax({
        type: 'post',
        url: pathurl + 'library/addlibrary',
        data: {
            dbname: $("#addModal #uName").val(),
            province: $("#addModal #distpicker select[name='province']").val(),
            city: $("#addModal #distpicker select[name='city']").val(),
            area: $("#addModal #distpicker select[name='area']").val(),
            uVIP: $("#addModal #uVIP").is(':checked') ? '0' : '1'
        },
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 200) {
                $('#addModal').modal('hide');
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

