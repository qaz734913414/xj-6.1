var uploadFile;
var heightFactor = 1.2;//图片高度宽度比例
var logId;//全局调用
$('.nation').html('<option value="">民族</option>');
var national = [
    "汉族", "壮族", "满族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
    "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
    "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
    "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"
];

$(function () {
    $('#retrieveModal2 #uploadChosen')
        .bootstrapValidator({
            fields: {
                phoneNo: {
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
    national.forEach(function (val, i) {
        $('.nation').append('<option value="' + val + '">' + val + '</option>');
    });

    var $distpicker = $('#distpicker');
    $('#distpicker select').each(function (i, val) {
        $(this).find('option').eq(0).prop('selected', 'selected');
    })

    $('#reset').click(function () {
        $distpicker.distpicker('reset');
    });

    $('#reset-deep').click(function () {
        $distpicker.distpicker('reset', true);
    });

    $('#destroy').click(function () {
        $distpicker.distpicker('destroy');
    });

    // logId = null;
    var uploader = bindUploadFileComponent("add-image-button");
    $("#upload-button").bind("click", upload);
    $("#retrieveModal .similar-box").bind("click", function () {
        $("#retrieveModal2").modal();
        $("#retrieveModal2 .modal-body #phoneNo").val("");
        $("#retrieveModal2 .modal-body #carNo").val("");
        $("#retrieveModal2 .modal-body #modal-remark").val("");
    });
    $("input#from,input#to").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        minView: 2,
        autoclose: true,
        inputMask: true
    });

    $("#retrieveModal2 .face-button").on("click", function () {
        $('#retrieveModal2 #uploadChosen').data('bootstrapValidator').validate();
        uploadChosen();


    });

    winChange();

    $(window).resize(function () {
        winChange();
    });


    $('#faceReset').on('click', function (e) {
        $('.form-group select').each(function (i, val) {
            // console.log($(this).find('option')[0])
            $(this).find('option').eq(0).prop('selected', 'selected');
        })

        faceList();

        e.preventDefault();

    });
    $('#faceRetrieval').on('click', function (e) {
        faceList()
        e.preventDefault();
    })

});
function faceList() {
    var faceData = new FormData($('#retrievalFrom')[0]);
    $.ajax({
        type: 'post',
        url: pathurl + 'face/retrieveSearch',
        data: faceData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 200) {
                var data = data.result;
                console.log('retrieveSearch:' + data);
                //alert("拿到了logId："+logId);
                $("#add-image-button-span").text("重新添加照片");
                $("#add-image-button").removeClass("hidden");
                $(".select-button").addClass("hidden");
                $(".add-img-box")
                    .removeClass(
                        "col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-4 col-lg-2 col-lg-offset-5");
                $(".add-img-box").addClass(
                    "col-sm-4 col-md-3 col-lg-2 mybackground ");

                $(".vertical-center").removeClass("vertical-center");
                $(".add-img-box").css("margin-top", "0px");
                $(".filter-box").removeClass("hidden");
                // /展示图片
                $(".result-box .container-fluid .row").html("");//清空

                var imgs = data;
                var imgsDom = $(".result-box .container-fluid .row");
                //排序
                imgs.sort(function (a, b) {
                    return b.percent - a.percent;
                });
                $('#imgTemp').tmpl(imgs).appendTo(imgsDom);

                winChange();//调整高宽
                //绑定图片点击事件
                $(".result-box .thumbnail").bind('click', function () {
                    $("#retrieveModal").modal();
                    //赋值
                    showImageOnModal($(this));
                    //设置当前图片dom的索引，以便左右翻图
                    var imageDom = $(this);
                    //绑定左右切换事件
                    $("#retrieveModal .right-btn").bind("click", function () {
                        if (!imageDom.parent().next().find(".thumbnail img").attr("src")) {
                            return;
                        }
                        imageDom = imageDom.parent().next().find(".thumbnail");
                        showImageOnModal(imageDom);
                    });

                    $("#retrieveModal .left-btn").bind("click", function () {
                        if (!imageDom.parent().prev().find(".thumbnail img").attr("src")) {
                            return;
                        }
                        imageDom = imageDom.parent().prev().find(".thumbnail");
                        console.info(imageDom);
                        showImageOnModal(imageDom);
                    });
                    //绑定按钮事件
                    $("#retrieveModal .similar-box").bind("mouseover", function () {
                        $("#retrieveModal .similar-box > p:last-child").hide();
                        $("#retrieveModal .similar-box > p:first-child span").text("比 中");
                        $("#retrieveModal .similar-box").addClass("selected");

                    });

                    $("#retrieveModal .similar-box").bind("mouseout", function () {
                        $("#retrieveModal .similar-box > p:last-child").show();
                        $("#retrieveModal .similar-box > p:first-child span").text("相似度");
                        $("#retrieveModal .similar-box").removeClass("selected");

                    });
                    winChange();
                });
            } else {
                $("#modal-body-id").text("操作失败，请重试");
                $("#myModal").modal();
            }
        },
        error: function () {
            console.error("ajax upload error");

        }
    });
}
//图片和文字宽高位置调整，初始化和窗口位置改变时调用
function winChange() {

    //统一图片高度，防止不对齐
    var width = $(".result-box .thumbnail img").width();
    $(".result-box .thumbnail img").height(width * heightFactor);
    //图片对齐
    width = $("#retrieveModal .modal-body .thumbnail img").width();
    $("#retrieveModal .modal-body .thumbnail img").height(width * heightFactor);
    //按钮置园
    width = $("#retrieveModal .modal-body .similar-box").width();
    $("#retrieveModal .modal-body .similar-box").height(width);

    width = $(".add-img-box .thumbnail img").width();
    $(".add-img-box .thumbnail img").height(width * heightFactor);
    //图片框垂直居中

}

function showImageOnModal(resource) {
    $("#modal-img").attr("src", resource.find("img").attr("src"));
    $("#retrieveModal .similar-box p:last-child span").html(resource.find(".caption>p:first-child>span:last-child").html());
    $("#retrieveModal .caption").html(resource.find(".caption").html());
    $("#retrieveModal .caption .hidden").removeClass("hidden");
    $("#retrieveModal .caption p:first-child").addClass("hidden");
    //重点人员
    if (resource.hasClass("focus")) {
        $("#retrieveModal .show-results .thumbnail").addClass("focus");
    } else {
        $("#retrieveModal .show-results .thumbnail").removeClass("focus");
    }

}
$("#btntype input[name='options']").eq(0).prop("checked", true);
function upload() {
    if (uploadFile == null) {
        alert("请选择图片");
        return;
    }
    var form_Data = new FormData();
    form_Data.append("file", uploadFile);
    form_Data.append("type", $("#btntype input[name='options']:checked").val());
    form_Data.append("remark", $("#remark").val());
    //防止同时多次提交
    var uploadButton = $(this);
    uploadButton.addClass("disabled");

    var $addimgthis = $('.add-img'), $w = $addimgthis.width(), $h = $addimgthis.height();

    $addimgthis.find(".topLine,.bottomLine").stop().animate({"width": $w});
    $addimgthis.find(".rightLine,.leftLine").stop().animate({"height": $h});

    setTimeout(function () {
        $addimgthis.find(".topLine,.bottomLine").stop().animate({"width": "0px"});
        $addimgthis.find(".rightLine,.leftLine").stop().animate({"height": "0px"});
    }, 1500)


    // $('.loading').show();
    $.ajax({
        type: 'post',
        url: pathurl + 'face/retrieve',
        data: form_Data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                logId = data.logId;
                var data = data.result;
                //alert("拿到了logId："+logId);
                $("#add-image-button-span").text("重新添加照片");
                $("#add-image-button").removeClass("hidden");
                $(".select-button").addClass("hidden");
                $(".add-img-box")
                    .removeClass(
                        "col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-4 col-lg-2 col-lg-offset-5");
                $(".add-img-box").addClass(
                    "col-sm-4 col-md-3 col-lg-2 mybackground ");

                $(".vertical-center").removeClass("vertical-center");
                $(".add-img-box").css("margin-top", "0px");
                $(".filter-box").removeClass("hidden");
                //展示图片
                $(".result-box .container-fluid .row").html("");//清空

                var imgs = data;
                var imgsDom = $(".result-box .container-fluid .row");
                //排序
                imgs.sort(function (a, b) {
                    return b.percent - a.percent;
                });
                $('#imgTemp').tmpl(imgs).appendTo(imgsDom);
                $('#examples').show();

                winChange();//调整高宽
                $('#loading').hide();
                //绑定图片点击事件
                $(".result-box .thumbnail").bind('click', function () {
                    $("#retrieveModal").modal();
                    //赋值
                    showImageOnModal($(this));
                    //设置当前图片dom的索引，以便左右翻图
                    var imageDom = $(this);
                    //绑定左右切换事件
                    $("#retrieveModal .right-btn").bind("click", function () {
                        if (!imageDom.parent().next().find(".thumbnail img").attr("src")) {
                            return;
                        }
                        imageDom = imageDom.parent().next().find(".thumbnail");
                        showImageOnModal(imageDom);
                    });

                    $("#retrieveModal .left-btn").bind("click", function () {
                        if (!imageDom.parent().prev().find(".thumbnail img").attr("src")) {
                            return;
                        }
                        imageDom = imageDom.parent().prev().find(".thumbnail");
                        console.info(imageDom);
                        showImageOnModal(imageDom);
                    });
                    //绑定按钮事件
                    $("#retrieveModal .similar-box").bind("mouseover", function () {
                        $("#retrieveModal .similar-box > p:last-child").hide();
                        $("#retrieveModal .similar-box > p:first-child span").text("比 中");
                        $("#retrieveModal .similar-box").addClass("selected");


                    });

                    $("#retrieveModal .similar-box").bind("mouseout", function () {
                        $("#retrieveModal .similar-box > p:last-child").show();
                        $("#retrieveModal .similar-box > p:first-child span").text("相似度");
                        $("#retrieveModal .similar-box").removeClass("selected");


                    });
                    winChange();
                });


            } else {
                $("#modal-body-id").text("操作失败，请重试");
                $("#myModal").modal();

            }

            uploadButton.removeClass("disabled");

        },
        error: function () {
            uploadButton.removeClass("disabled");
            console.error("ajax upload error");

        }
    });
}
// 初始化处置结果
setTimeout(function () {
    $.ajax({
        type: 'post',
        url: pathurl + 'parameter/dispose',
        dataType: 'json',
        success: function (data) {
            var data = data.result, str = '';
            $.each(data, function (index, item) {
                str += '<option value="' + item.id + '">' + item.value + '</option>'
            })

            $('#dispose').html(str);
        },
        error: function () {
            console.error("ajax upload error");

        }
    });
}, 1000)


// 提交比中

function uploadChosen() {
    if (!$('#uploadChosen').data('bootstrapValidator').isValid()) {

        return;

    } else {
        var form_Data = new FormData();
        var name = $("#retrieveModal .caption > p:nth-child(2)").text();
        var idNo = $("#retrieveModal .caption > p:nth-child(5)").text();

        form_Data.append("logId", logId);
        form_Data.append("phoneNo", $("#retrieveModal2 .modal-body #phoneNo").val());
        form_Data.append("carNo", $("#retrieveModal2 #carNo").val());
        form_Data.append("remark", $("#retrieveModal2 #modal-remark").val());
        form_Data.append("dispose", $("#retrieveModal2 #dispose").val());
        form_Data.append("harmful", $("#retrieveModal2 input[name='harmful']:checked").val());
        form_Data.append("url", $("#retrieveModal .show-results .thumbnail img").attr("src"));
        form_Data.append("name", name.substring(name.indexOf("：") + 1));
        form_Data.append("idNo", idNo.substring(idNo.indexOf("：") + 1));
        console.log(idNo.substring(idNo.indexOf("：") + 1));
        console.log('form_Data' + form_Data);
        $.ajax({
            type: 'post',
            url: pathurl + 'facelog/insertChosenInfo/',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.msg == "SUCCESS") {
                    $("#modal-body-id").text("比中成功");
                    $("#myModal").modal();
                    $("#retrieveModal2").modal("hide");
                } else {
                    $("#modal-body-id").text("操作失败，请重试");
                    $("#myModal").modal();
                }
            },
            error: function () {
                console.error("ajax upload error");

            }
        });

    }
}
$("#retrieveModal2").on("hidden.bs.modal", function() {
    $("#retrieveModal2 #uploadChosen").data('bootstrapValidator').resetForm();
});
function bindUploadFileComponent(buttonid) {
    return new qq.FineUploaderBasic({
        button: $("#" + buttonid)[0],
        request: {
            endpoint: pathurl + 'face/retrieve',
            method: "POST"
        },
        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'zip'],
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
                console.log("id" + filename, '上传失败');
                if (filename == undefined)
                    alert("请选择图片或重新选择图片");
            },
            onSubmit: function (id, filename) {
                console.log(filename, '文件开始提交');
                var self = this;

                $("#add-image-button").addClass("hidden");
                $("#remark").removeClass("hidden");
                $(".select-button").removeClass("hidden");
                //画框展示
                this.drawThumbnail(id, $(".add-img-box .add-img img")[0]);
                //子页面展示
                this.drawThumbnail(id, $("#retrieveModal .modal-body .thumbnail img")[0]);
                //由于上传完成后文件会自动清空，需要保存到uploadFiles
                uploadFile = self.getFile(id);

            },
            onComplete: function (id, filename, responseJSON, xhr) {
                console.log(filename, '上传成功，返回信息为：', responseJSON);
                //object可以如下初始化表格
                /*
                 if (imagetable)
                 imagetable.fnDestroy(false);
                 imageTable(responseJSON.imgs); */
                var self = this;
                //  self.clearStoredFiles();
            }
        }
    });

}
