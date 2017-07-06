var uploader;
var uploadFile;//保存最后上传的图片
var imageInfo = new Object();//保存人员信息
var heightFactor = 441 / 358;//图片高度宽度比例


$(function () {
    uploader = uploadFile($("#add-image-button"));
    uploadFile = null;//重置
    $("#face-carousel .carousel-inner > .item:first-child").addClass("active");

    winChange();//图片和文字宽高位置调整
    $(".face-similar").hide();//计算边框大小后再隐藏

    $("#idcard-input").on("input propertychange", function () {
        console.log('inputChange');
        getPicture();
    });
    $(window).resize(function () {
        winChange();
    });


});
//图片和文字宽高位置调整，初始化和窗口位置改变时调用
function winChange() {
    //console.info($(".compare-box .thumbnail img").width()+"    "+heightFactor+"     "+$(".compare-box .thumbnail img").width()*heightFactor);
    $(".compare-box .thumbnail img").height($(".compare-box .thumbnail img").width() * heightFactor);
    $(".face-similar").css("margin-left", $(".similar-box").width() / 2 - $(".face-similar").outerWidth() / 2);
    $(".face-similar").css("margin-top", $(".similar-box").width() / 2 - $(".face-similar").outerHeight() / 2 + 5);
    $(".carousel-control").css("padding-top", $(".compare-box .thumbnail img").height() / 2);

}
var getPictureUrl = '';
function getPicture() {
    console.log($("#idcard-input").val());
    if (IdentityCodeValid($("#idcard-input").val())) {
        //  通过校验，发送请求
        $.ajax({
            type: 'post',
            url: pathurl + 'face/getPicture/',
            data: "idcard=" + $("#idcard-input").val(),
            cache: false,
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    console.log(data);
                    var imgarr=data.result.imgAddrs.toString().split(';')
                    var data = data.result;
                    imageInfo.name = data.name;
                    $("#face-carousel .carousel-indicators").html("");
                    $("#face-carousel .carousel-inner").html("");
                    if ($.type(data) == 'object') {
                        $("#face-carousel .carousel-indicators").append('<li data-target="#face-carousel" data-slide-to="' + '' + '" class="" ></li>');
                        $.each(imgarr,function (index,item) {
                            if (index==0){
                                $("#face-carousel .carousel-inner").append('<div class="item active"><img src="' + imgarr[0] + '"></div>');
                            }else {
                                $("#face-carousel .carousel-inner").append('<div class="item"><img src="' + imgarr[index] + '"></div>');
                            }
                        })

                        getPictureUrl = data.imgAddrs;
                    } else if ($.type(data) == 'array') {
                        data.forEach(function (val, i) {
                            $("#face-carousel .carousel-indicators").append('<li data-target="#face-carousel" data-slide-to="' + i + '" class="' + (i != 0 ? '' : 'active') + '" ></li>');
                            $.each(imgarr,function (index,item) {
                                if (index==0){
                                    $("#face-carousel .carousel-inner").append('<div class="item active"><img src="' + imgarr[0] + '"></div>');
                                }else {
                                    $("#face-carousel .carousel-inner").append('<div class="item"><img src="' + imgarr[index] + '"></div>');
                                }
                            })
                        });
                    }

                    winChange();

                } else {
                    $("#modal-body-id").text("操作失败，请重试");
                    $("#myModal").modal();

                }

            },
            error: function () {
                console.error("ajax upload error");
            }
        });

    } else {
        $("#face-carousel .carousel-inner").find('img').prop('src', './img/default_img.png');

    }
}

function IdentityCodeValid(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;

    if (!code || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }

    // console.log(tip)
    return pass;
}

$('.similar-box  input[name="options"],#face-carousel .carousel-control').on('click', function (ev) {
    console.log(ev.target.nodeName);
    if (ev.target.nodeName == 'INPUT'|| ev.target.nodeName == 'A') {
        upload();
    }
});
$("label input[name='options']").eq(0).prop("checked", true);
function upload() {

    var form_Data = new FormData();
    form_Data.append("image1Src", $("#face-carousel .carousel-inner .active img").attr("src"));
    form_Data.append("file2", uploadFile);
    form_Data.append("type", $("label input[name='options']:checked").val());
    form_Data.append("idcard", $("#idcard-input").val());
    form_Data.append("name", imageInfo.name);
    form_Data.append("url", getPictureUrl);
    form_Data.append("source", $.cookie('deviceType'));
    //防止同时多次提交
    //防止同时多次提交
    $("#upload").attr("disabled", "disabled");

    if (!!getPictureUrl) {
        $.ajax({
            type: 'post',
            url: pathurl + 'face/idcard/',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {


                var simi = data.result;
                if (simi == null || simi == "null" || simi == "") {
                    //重置按钮并且解绑
                    $(".compare-box .face-type").show();
                    $(".compare-box .face-similar").hide();

                    $(".face-similar").unbind("mouseover");
                    $("#modal-body-id").text("对不起，查询不到任何相关数据");
                    $("#myModal").modal();
                } else {
                    $(".compare-box .face-similar>p:last-child>span").html('<font>' + simi.substring(0, 3) + '</fonts><fonts>' + simi.substring(3, 6) + '</font>');


                    $(".compare-box .face-similar").css('pointer-events', 'none');
                    //解决鼠标移动过快无法切换的bug
                    $(".face-similar").bind("mouseover", function () {
                        var display = $('.compare-box .face-type').css('display');

                        if (display == 'none') {
                            $(".compare-box .face-type").show();
                            $(".compare-box .face-similar").hide();
                        }
                    });
                    $(".compare-box .face-type").hide();
                    $(".compare-box .face-similar").show();


                }
            },
            error: function () {
                console.error("ajax upload error");
                $("#upload").removeAttr("disabled");
            }
        });
    }

}


function uploadFile(button) {
    return new qq.FineUploaderBasic(
        {
            button: button[0],
            request: {
                endpoint: pathurl + 'face/compare',
                method: "POST"
            },
            validation: {
                allowedExtensions: ['jpeg', 'jpg', 'gif', 'png'],
            },
            // debug : true,
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
                    this.drawThumbnail(id, button.parent().find(".thumbnail img")[0]);
                    //由于上传完成后文件会自动清空，需要保存到uploadFiles
                    uploadFile = self.getFile(id);
                    upload();

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
