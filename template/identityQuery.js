var heightFactor = 1.2;
$("#iidno").focus();
$(".err").html('');
$("#iidno").blur(function () {
    if($("#iidno").val()){
        $("#iidno").val($("#iidno").val().toLocaleUpperCase())
    }
});
function getMessage4() {

    var idno = $("#iidno").val() || '';
    var iname = $("#iname").val() || '';
    if (!idno && !iname) {
        $("#iidno").focus();
        return false;

    } else if (idno && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idno)) {
        $(".err").html('身份证号格式错误');
        $("#iidno").focus();
        return ;
    } else if (iname && !/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(iname)) {
        $(".err").html('请正确输入中文姓名');
        $("#iname").focus();
        return ;
    }
    else {
        $(".err").html('');
        var upload = $(this);
        upload.addClass("disabled");
        var form_Data = new FormData();
        form_Data.append("idno", idno);
        form_Data.append("name", iname);
        $.ajax({
            type: 'post',
            url: pathurl + 'syslog/identityquery/',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                console.info(data);
                if (data.code == 200) {
                    $(".result-box .container-fluid .row").html("");//清空
                    var imgs = data.result;
                    var imgsDom = $(".result-box .container-fluid .row");
                    //排序
                    /* imgs.sort(function(a,b){
                     return b.percent-a.percent;
                     }); */
                    $('#imgTemp').tmpl(imgs).appendTo(imgsDom);
                    winChange();//调整高宽
                    //绑定图片点击事件
                    $(".result-box .thumbnail").bind('click', function () {
                        //var b=$(".result-box .thumbnail p").removeClass("hidden");
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
}

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
    //$("#retrieveModal .caption p:first-child").addClass("hidden");
    //重点人员
    if (resource.hasClass("focus")) {
        $("#retrieveModal .show-results .thumbnail").addClass("focus");
    } else {
        $("#retrieveModal .show-results .thumbnail").removeClass("focus");
    }
}

function reset4() {
    $(".err").html('');
    $(".face-form input").val("");
    $('.result-box .row').html('')
}
