var uploader1,uploader2;
//保存最后上传的图片
var uploadFile1,uploadFile2;
var heightFactor=441/358;//图片高度宽度比例


$(function() {
    uploader1 = uploadFile($("#add-image-button1"));
    uploader2 = uploadFile($("#add-image-button2"));
    uploadFile1 = null;//重置
    uploadFile2 = null;//重置
    //图片和文字宽高位置调整

    winChange();
    $(".face-similar").hide();

    $(window).resize(function() {
        winChange();
    });
});


//图片和文字宽高位置调整，初始化和窗口位置改变时调用
function winChange(){
    $(".compare-box .thumbnail img").height($(".compare-box .thumbnail img").width()*heightFactor);
    $(".face-similar").css("margin-left",$(".similar-box").width()/2-$(".face-similar").outerWidth()/2);
    $(".face-similar").css("margin-top",$(".similar-box").width()/2-$(".face-similar").outerHeight()/2+5);


}


$('.similar-box').on('click',function(ev){
  // console.log(ev);
  // console.log(ev.target);
  if(ev.target.nodeName=='INPUT'||ev.target.nodeName=='CANVAS'){
    upload();
  }
});
$("label input[name='options']").eq(0).prop("checked", true);
function upload() {


    var form_Data = new FormData($("#form1"));
    form_Data.append("file1", uploadFile1);
    form_Data.append("file2", uploadFile2);
    form_Data.append("type", $("label input[name='options']:checked").val());
    form_Data.append("source", $.cookie('deviceType'));
    if (!!uploadFile1 && !!uploadFile2) {
        $.ajax({
            type: 'post',
            url: pathurl + 'face/compare',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (data) {
                // console.info(data);
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
            }
        });

    } else {
        console.log('需要两张图片');
        return;

    }
}
function uploadFile(button) {
    return new qq.FineUploaderBasic(
        {
            button : button[0],
            request : {
                endpoint : pathurl+'face/compare',
                method : "POST"
            },
            validation : {
                allowedExtensions : [ 'jpeg', 'jpg', 'gif', 'png' ],
            },
            debug : true,
            multiple : false,
            autoUpload : false,
            editFilename : {
                enable : false
            },
            messages : {
                noFilesError : '没有选中文件'
            },
            text : {
                formatProgress : "{percent}% of {total_size}",
                failUpload : "上传失败",
                waitingForResponse : "上传中...",
                paused : "暂停"
            },
            callbacks : {
                onError : function(id, filename, message, xhr) {
                    console.log(id, filename, '上传失败', message);
                    if (filename === undefined)
                        alert("请选择图片或重新选择图片");
                },
                onSubmit : function(id, filename) {
                    console.log(filename, '文件开始提交');
                    var self = this;
                    button.text("重新添加照片");
                    //画框展示
                    this.drawThumbnail(id, button.parent().find(".thumbnail img")[0]);
                    //由于上传完成后文件会自动清空，需要保存到uploadFiles
                    if(button.attr("id")=="add-image-button1"){
                        uploadFile1 = self.getFile(id);
                    }
                    if(button.attr("id")=="add-image-button2"){
                        uploadFile2 = self.getFile(id);
                    }

                    upload();

                },
                onComplete : function(id, filename, responseJSON, xhr) {
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
