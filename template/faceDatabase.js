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
var uploader;
//保存最后上传的图片
var uploadFile;
$(function () {
    uploader = uploadFile($("#add-image-button"));
    uploadFile = null;//重置
    national.forEach(function (val, i) {
        $('#nation').append('<option value="' + val + '">' + val + '</option>');
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
                dbname: $('#dbname').val()
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
            console.log('初始化' + data)
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

    $("#libPicList").bootstrapTable('destroy');

    $('#libPicList').bootstrapTable({
        url: pathurl + 'library/libPicList?dbname=' + username,
        method: 'post', //请求方式（*）
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        queryParamsType: "limit",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        responseHandler: function (res) {
            //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            //在ajax后我们可以在这里进行一些事件的处理
            return res.result;
        },
        onLoadSuccess: function (data) {

        },
        columns: [{
            field: 'id',
            title: '序号',
            formatter: function (value, row, index) {
                return ++index;
            }
        }, {
            field: 'dbname',
            title: '库名',
            // formatter: function (value) {
            //     return '<span class="dbname">'+value+'</span>';
            // }
        }, {
            field: 'name',
            title: '姓名',

        }, {
            field: 'sex',
            title: '性别',
            formatter: function (value) {

                switch (value) {
                    case 0:
                        return "男";
                    case 1:
                        return "女";
                }
            }
        }, {
            field: 'birthday',
            title: '生日',
        }, {
            field: 'idcard',
            title: '身份证号'
        }, {
            field: 'url',
            title: '检索图片',
            formatter: function (value) {
                return '<img width="150" height="150" alt="" src=' + value + '>'
            }
        }, {
            field: 'imageid',
            title: '图片id',
        }]
    });
    $("#libPicList").bootstrapTable('hideColumn', 'imageid');
    $('#openinofModal #dn').html(username);
    $("#openinofModal").modal();
}
function doUpload2() {
    $("#fileinputModal #modal-text").text("请上传后缀为'.zip'的文件");
    $("#fileinputModal").modal();
}
$("#fileinputModal #continue2").click(function () {
    var formData = new FormData($("#uploadForm2")[0]);
    console.log('formData.get("file"):' + formData.get("file"));
         var name=$('#dn').text();
    if (formData.get("file").name) {
        $.ajax({
            url: pathurl + 'library/libPicZipAdd?dbname=' + name,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    $("#modal-body-id").text('上传成功!');
                    $("#myModal").modal('show');
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
    }else {
        alert('请选择文件再上传');
        return false;
    }




});
$("#myModal").on("hidden.bs.modal", function () {
    $("#uploadForm2")[0].reset();
});
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
$("#addModal").on("hidden.bs.modal", function () {
    $("#addModal #addForm").data('bootstrapValidator').resetForm();
});
$("#addModal #continue").off();
$("#addModal #continue").click(function () {

    var form_Data = new FormData($("#addForm"));
    form_Data.append("file", uploadFile);
    form_Data.append("dbname", $('#dn').text());
    form_Data.append("name", $("#addModal #name").val());
    form_Data.append("nation", $("#addModal #nation").val());
    form_Data.append("idcard", $("#addModal #uCardId").val());
    form_Data.append("remark", $("#addModal #remark").val());
    form_Data.append("telphone", $("#addModal #uPhone").val());
    form_Data.append("address", $("#addModal #distpicker2 select").val());
    console.log(form_Data);
    $.ajax({
        type: 'post',
        url: pathurl + 'library/libPicAdd',
        data: form_Data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 200) {
                $('#addModal').modal('hide');
                $("#modal-body-id").html('添加成功');
                $('#myModal').modal('show');
                $("#addForm")[0].reset();
                // LoadAjaxContent(pathurl+'user/list');
                $("#facedataTable").bootstrapTable('refresh');
            } else {
                $("#myModal").css("z-index", 1550);
                $("#modal-body-id").text("请正确输入");
                $("#myModal").modal();
            }
        },
        error: function () {
            $("#myModalLabel").html("提示");
            $("#modal-body-id").html('系统出错请稍后再试');
            //	$('#myModal').modal('show');
        }
    });
});

function uploadFile(button) {
    return new qq.FineUploaderBasic(
        {
            button: button[0],
            request: {
                endpoint: pathurl + 'library/libPicAdd',
                method: "POST"
            },
            validation: {
                allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
            },
            debug: true,
            multiple: false,
            autoUpload: false,
            editFilename: {
                enable: false
            },
            messages: {
                noFilesError: '没有选中文件'
            },
            text: {
                formatProgress: "{percent}% of {total_size}",
                failUpload: "上传失败",
                waitingForResponse: "上传中...",
                paused: "暂停"
            },
            callbacks: {
                onError: function (id, filename, message, xhr) {
                    console.log(id, filename, '上传失败', message);
                    if (filename === undefined)
                        alert("请选择图片或重新选择图片");
                },
                onSubmit: function (id, filename) {
                    console.log(filename, '文件开始提交');
                    var self = this;
                    button.text("重新添加照片");
                    //画框展示
                    this.drawThumbnail(id, button.prev('#img0')[0]);
                    //由于上传完成后文件会自动清空，需要保存到uploadFiles
                    if (button.attr("id") == "add-image-button") {
                        uploadFile = self.getFile(id);
                    }
                },
                onComplete: function (id, filename, responseJSON, xhr) {
                    console.log(id, filename, '上传成功，返回信息为：',
                        responseJSON);
                    //object可以如下初始化表格
                    /* if (imagetable)
                     imagetable.fnDestroy(false);
                     imageTable(responseJSON.images);
                     var self = this; */
                    // self.clearStoredFiles();
                }
            }
        });
}