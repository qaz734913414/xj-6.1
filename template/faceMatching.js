var uploader1,uploader2;
//保存最后上传的图片
var uploadFile1,uploadFile2;
var heightFactor=441/358;//图片高度宽度比例
var draw ;

$(function() {
    uploader1 = uploadFile($("#add-image-button1"));
    uploader2 = uploadFile($("#add-image-button2"));
    uploadFile1 = null;//重置
    uploadFile2 = null;//重置
    //图片和文字宽高位置调整
    draw = new DrawSimilar();
    winChange();
    $(".face-similar").hide();
    $("#canvas").bind("click",function(e){
        draw.changeByPosition(e);
    });
    $(".face-type").bind("click",function(){
        draw.changeToNext();
    });
    $(window).resize(function() {
        winChange();
    });
});


//图片和文字宽高位置调整，初始化和窗口位置改变时调用
function winChange(){
    $(".compare-box .thumbnail img").height($(".compare-box .thumbnail img").width()*heightFactor);
    $(".face-similar").css("margin-left",$(".similar-box").width()/2-$(".face-similar").outerWidth()/2);
    $(".face-similar").css("margin-top",$(".similar-box").width()/2-$(".face-similar").outerHeight()/2+5);
    draw.init();

}

function DrawSimilar(){
    var type = ["云创","依图","商汤","旷视"];
    var typeIndex = 0;//默认类型
    var border = 8;
    var outerRadius,innerRadius;
    var isIn = false;
    this.init =  function(){
        outerRadius = $(".similar-box").width()/2;
        innerRadius = outerRadius-border;
        try{
          drawBorder(typeIndex);
          drawText(typeIndex);
        }catch(e){

        }
    };
    this.changeByPosition = function(e){
        typeIndex =  getTypeByEvent(e);
        //alert(_type);
        try{
          drawBorder(typeIndex);
          drawText(typeIndex);
        }catch(e){

        }
    };
    this.changeToNext = function(){
        typeIndex = (typeIndex+1)%type.length;
        //alert(_type);
        try{
          drawBorder(typeIndex);
          drawText(typeIndex);
        }catch(e){

        }
    };
    //判定是否在圆框里
    this.isIn = function(e){
        var postionVoctor = new Vector();
        postionVoctor.setVectorFromEvent(e);
        var _isIn ;
        if(postionVoctor.x*postionVoctor.x+postionVoctor.y*postionVoctor.y<innerRadius*innerRadius){
            //console.info("在里面");
            _isIn = true;
        }

        if(postionVoctor.x*postionVoctor.x+postionVoctor.y*postionVoctor.y>outerRadius*outerRadius){
            //console.info("在外面");
            _isIn = false;
        }
        return _isIn;

    }
    this.show = function(e){
        var _isIn = this.isIn(e);
        //当外面里面变化改变显示
        if(_isIn!=isIn){
            isIn = _isIn;
            //console.info("变了");

            if(_isIn==false){
                $(".face-type").hide();
                $(".face-similar").show();
            }else{
                $(".face-type").show();
                $(".face-similar").hide();
            }

        }
    }
    //公有get方法
    this.getType = function(){
        return typeIndex;
    }
    //显示文本
    function drawText(index){
        $(".face-type").html("<span>"+type[index]+"</span>");
        //alert($(".face-type").outerWidth()/2+"     "+ $(".similar-box").innerWidth()/2+"     "+ $(".similar-box").width()/2);
        $(".face-type").css("margin-left",$(".similar-box").width()/2-$(".face-type").outerWidth()/2);
        $(".face-type").css("margin-top",$(".similar-box").width()/2-$(".face-type").outerHeight()/2);
    }
    //画外框
    function drawBorder(index){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();//初始状态保存
        ctx.translate(outerRadius, outerRadius);
        //外圆
        ctx.fillStyle = "#5e6160";
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI*2, false);
        ctx.fill();
        //边框均分线
        ctx.save();
        ctx.beginPath();
        ctx.rotate(-Math.PI/2-Math.PI/type.length);
        //ctx.rotate(Math.PI/2-Math.PI/type.length);
        for(var i=0;i<type.length;i++){
            ctx.moveTo(0,0);
            ctx.lineTo(outerRadius,0);
            ctx.rotate(Math.PI*2/type.length)//旋转;
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#236bd4";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //选中标蓝
        // ctx.save();
        ctx.fillStyle = "#236bd4 ";
        ctx.beginPath();
        ctx.rotate(-Math.PI/2-Math.PI/type.length+index*2*Math.PI/type.length);
        ctx.moveTo(0,0);
        ctx.lineTo(outerRadius,0);
        ctx.arc(0, 0, outerRadius, 0,2*Math.PI/type.length, false);
        ctx.lineTo(0,0);
        ctx.fill();
        ctx.restore;
        //内圆
        ctx.fillStyle = "#1f2327";
        ctx.beginPath();
        ctx.arc(0, 0, innerRadius, 0, Math.PI*2, false);
        ctx.fill();

        ctx.restore();//恢复初始
    }
    //内部定义向量
    function Vector(ax,ay){
        this.x = ax;
        this.y = ay;

        this.setVectorFromEvent= function(e){
            var _left =$(".similar-box").offset().left+15;//div相当于窗口的左边的偏移量
            var _top = $(".similar-box").offset().top;//相当于窗口的顶部的偏移量
            //计算矢量
            this.x =e.pageX-_left-$(".similar-box").width()/2;
            this.y =-(e.pageY-_top-$(".similar-box").width()/2);
            //return new Vector(voctorX,voctorY);
        }
    }
    //根据坐标计算出type类型
    function getTypeByEvent(e){
        //计算每一个区域中线的单位向量
        var postionVoctor = new Vector();
        postionVoctor.setVectorFromEvent(e);
        var unitVoctor = new Array(type.length);
        for(var i=0;i<unitVoctor.length;i++){
            unitVoctor[i] = new Vector(Math.sin(i*Math.PI*2/type.length),Math.cos(i*Math.PI*2/type.length));
            console.info(unitVoctor[i]);
        }
        //单位向量值最大的即为所在区域
        var _type = 0;
        var maxValue = 0;
        for(var i=0;i<unitVoctor.length;i++){
            value = unitVoctor[i].x*postionVoctor.x + unitVoctor[i].y*postionVoctor.y;
            if(value > maxValue){
                maxValue = value;
                _type = i;
            }
        }
        return _type;
    }

}

function upload() {
    if (uploadFile1 == null || uploadFile2 == null) {
        /* 	$("#modal-body-id").text("请选择图片");
         $("#myModal").modal(); */
        return;
    }
    var form_Data = new FormData($("#form1"));
    form_Data.append("file1", uploadFile1);
    form_Data.append("file2", uploadFile2);
    form_Data.append("type", draw.getType());

    $.ajax({
        type : 'post',
        url : pathurl+'face/compare/',
        data : form_Data,
        cache : false,
        contentType : false,
        processData : false,
        dataType : 'json',
        success : function(data) {
            console.info(data);
            var simi = data.result;
            if (simi == null || simi == "null" || simi == ""){
                //重置按钮并且解绑
                $(".compare-box .face-type").show();
                $(".compare-box .face-similar").hide();
                $("#canvas").unbind("mouseout");
                $("#canvas").unbind("mousemove");
                $(".face-similar").unbind("mouseover");
                $("#modal-body-id").text("对不起，查询不到任何相关数据");
                $("#myModal").modal();
            }else{
                $(".compare-box .face-similar>p:last-child>span").html('<font>'+simi.substring(0,3)+'</font><font>'+simi.substring(3,6)+'</font>');
                $(".compare-box .face-type").hide();
                $(".compare-box .face-similar").show();
                $("#canvas").bind("mousemove",function(e){
                    draw.show(e);
                });
                //解决鼠标移动过快无法切换的bug
                $(".face-similar").bind("mouseover",function(){
                    if($(".face-type").hasClass("hidden")){
                        $(".face-type").show();
                        $(".face-similar").hide();
                    }
                });
                $("#canvas").bind("mouseout",function(e){
                    if(draw.isIn(e)==false){
                        $(".face-type").hide();
                        $(".face-similar").show();
                    }

                });

            }

        },
        error : function() {
            console.error("ajax upload error");
        }
    });

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
