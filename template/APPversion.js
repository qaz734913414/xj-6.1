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
                uName: {
                    validators: {
                        notEmpty: {
                            message: '请输入库名,至少4位'
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
        method: 'post',
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        url: pathurl + 'library/librarylist',
        queryParams: function (params) {
            return {
                pageSize: params.pageSize,
                pageNumber: params.pageNumber,
                dbname: $('#dbname').val()
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

    // var openinofDom = $("#openinofModal .modal-body");
    // openinofDom.html("");
    // $.ajax({
    //     type: 'post',
    //     url: pathurl + 'facelog/personInfo',
    //     data: {
    //         username: username
    //     },
    //     cache: false,
    //     success: function (data) {
    //         var dataresult = [],
    //             compareCount,
    //             idCardCount,
    //             loginCount,
    //             retrieveCount,
    //             appCount,
    //             importCount;
    //         dataresult = data.result[0];
    //         dataresult.compareCount = data.compareCount;
    //         dataresult.idCardCount = data.idCardCount;
    //         dataresult.loginCount = data.loginCount;
    //         dataresult.retrieveCount = data.retrieveCount;
    //         dataresult.appCount = data.appCount;
    //         dataresult.importCount = data.importCount;
    //         $('#openinfoTemp').tmpl(dataresult).appendTo(openinofDom);
    //         var unittext = $("#openinofModal .modal-body").find('.unit').text();
    //
    //         $.each(dListData, function (index) {
    //             if (unittext == dListData[index].did) {
    //                 return $("#openinofModal .modal-body").find('.unit').html(dListData[index].dname)
    //             }
    //         })
    $('#username').text(username);
    $("#openinofModal").modal();

    //     },
    //
    //     error: function () {
    //         console.error("ajax error");
    //     }
    //
    // });
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
//表格批量删除
function toRemove() {
    var ids = '';
    $.map($('#facedataTable').bootstrapTable('getSelections'), function (row) {
        ids += row.id + ',';
    });
    $('#rowUId').val(ids)
    if (ids) {
        $("#delUsersTModel #modal-body-text").text("删除后数据不可恢复，确定要删除吗?");
        $("#delUsersTModel").modal('show');
    } else {
        $("#myModal #modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal('show');
    }
}
//批量删除
$("#delUsersTModel #cancel").click(function () {
    $("#userTable1").bootstrapTable('refresh');
});
$("#delUsersTModel #continue").off();
$("#delUsersTModel #continue").click(function () {
    $("#delUsersTModel").modal('hide')
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
    $.ajax({
        type: 'post',
        url: pathurl + 'library/addlibrary',
        data: {
            dbname: $("#adduserModal #uName").val(),
            areacode:areacode,
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
// 点击库名后 新增2
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
    var areacodeArr = [],
        areanameArr = [];
    var pr = $("#addModal input[name='userProvinceId']").val() || '';
    areacodeArr.push(pr)
    var ci = $("#addModal input[name='userCityId']").val() || '';
    areacodeArr.push(ci)
    var di = $("#addModal input[name='userDistrictId']").val() || '';
    areacodeArr.push(di)
    var prn = $("#addModal .province>a").text() || '';
    areanameArr.push(prn)
    var cin = $("#addModal .city>a").text() || '';
    areanameArr.push(cin)
    var din = $("#addModal .district>a").text() || '';
    areanameArr.push(din)
    var areacode = regk(areacodeArr).substr(1)
    var areaname = regk(areanameArr).substr(1)

    var form_Data = new FormData($("#addForm"));
    form_Data.append("file", uploadFile);
    form_Data.append("dbname", $('#dn').text());
    form_Data.append("name", $("#addModal #name").val());
    form_Data.append("nation", $("#addModal #nation").val());
    form_Data.append("idcard", $("#addModal #uCardId").val());
    form_Data.append("remark", $("#addModal #remark").val());
    form_Data.append("telphone", $("#addModal #uPhone").val());
    form_Data.append("address", areacode);
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