var uploader;
var uploadFile;//保存最后上传的图片
var imageInfo = new Object();//保存人员信息
var heightFactor = 441/358;//图片高度宽度比例
var draw;

$(function() {
    uploader = uploadFile($("#add-image-button"));
    uploadFile = null;//重置
    $("#face-carousel .carousel-inner > .item:first-child").addClass("active");
    draw = new DrawSimilar();
    winChange();//图片和文字宽高位置调整
    $(".face-similar").hide();//计算边框大小后再隐藏
    $("#canvas").bind("click",function(e){
        draw.changeByPosition(e);
    });
    $(".face-type").bind("click",function(){
        draw.changeToNext();
    });
    $("#idcard-input").on("input propertychange",function(){
        console.log('inputChange');
        getPicture();
    });
    $(window).resize(function() {
        winChange();
    });


});
//图片和文字宽高位置调整，初始化和窗口位置改变时调用
function winChange(){
    //console.info($(".compare-box .thumbnail img").width()+"    "+heightFactor+"     "+$(".compare-box .thumbnail img").width()*heightFactor);
    $(".compare-box .thumbnail img").height($(".compare-box .thumbnail img").width()*heightFactor);
    $(".face-similar").css("margin-left",$(".similar-box").width()/2-$(".face-similar").outerWidth()/2);
    $(".face-similar").css("margin-top",$(".similar-box").width()/2-$(".face-similar").outerHeight()/2+5);
    $(".carousel-control").css("padding-top",$(".compare-box .thumbnail img").height()/2);
    draw.init();

}
var getPictureUrl='';
function getPicture(){
  console.log($("#idcard-input").val());
    if(IdentityCodeValid($("#idcard-input").val())){
        //  通过校验，发送请求
        $.ajax({
            type:'post',
            url:pathurl+'face/getPicture/',
            data:"idcard="+$("#idcard-input").val(),
            cache:false,
            dataType:"json",
            success:function(data){
              console.log(data);
                if(data.code==200){
                  console.log(data);
                  var data=data.result;
                    imageInfo.name = data.name;
                    $("#face-carousel .carousel-indicators").html("");
                    $("#face-carousel .carousel-inner").html("");
                    if($.type(data)=='object'){
                      $("#face-carousel .carousel-indicators").append('<li data-target="#face-carousel" data-slide-to="'+''+'" class="" ></li>');
                      $("#face-carousel .carousel-inner").append('<div class="item active"><img src="'+data.imgAddrs+'"></div>');
                      getPictureUrl=data.imgAddrs;
                    }else if($.type(data)=='array'){
                      data.forEach(function(val,i){
                        $("#face-carousel .carousel-indicators").append('<li data-target="#face-carousel" data-slide-to="'+i+'" class="'+(i!=0?'':'active')+'" ></li>');
                        $("#face-carousel .carousel-inner").append('<div class="item '+(i!=0?'':'active')+'"><img src="'+val.imgAddrs+'"></div>');
                      });
                    }

                    winChange();

                }else{
                    $("#modal-body-id").text("操作失败，请重试");
                    $("#myModal").modal();

                }

            },
            error:function(){
                console.error("ajax upload error");
            }
        });

    }else{
     $("#face-carousel .carousel-inner").find('img').prop('src','./img/default_img.png');

     }
}

function IdentityCodeValid(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    // if(!pass) alert(tip);
    console.log(tip)
    return pass;
}

$('.similar-box').on('click',function(ev){
  console.log(ev);
  console.log(ev.target);
  if(ev.target.nodeName=='SPAN'||ev.target.nodeName=='CANVAS'){
    upload();
  }
});

function upload(){

    var form_Data = new FormData();
    form_Data.append("image1Src",$("#face-carousel .carousel-inner .active img").attr("src"));
    form_Data.append("file2",uploadFile);
    form_Data.append("type",draw.getType());
    form_Data.append("idcard",$("#idcard-input").val());
    form_Data.append("name",imageInfo.name);
    form_Data.append("url",getPictureUrl);
    //防止同时多次提交
    //防止同时多次提交
    $("#upload").attr("disabled","disabled");
    console.log(draw.getType());
    if(!!getPictureUrl){
      $.ajax({
          type:'post',
          url:pathurl+'face/idcard/',
          data:form_Data,
          cache:false,
          contentType:false,
          processData:false,
          dataType:'json',
          success:function(data){


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

                  $("#canvas").bind("mousemove",function(e){
                      draw.show(e);
                  });
                  $(".compare-box .face-similar").css('pointer-events','none');
                  //解决鼠标移动过快无法切换的bug
                  $(".face-similar").bind("mouseover",function(){
                      var display=$('.compare-box .face-type').css('display');

                      if(display=='none'){
                        $(".compare-box .face-type").show();
                        $(".compare-box .face-similar").hide();
                      }
                  });
                  $(".compare-box .face-type").hide();
                  $(".compare-box .face-similar").show();

                  $("#canvas").bind("mouseout",function(e){
                      if(draw.isIn(e)==false){
                          $(".face-type").hide();
                          $(".face-similar").show();
                      }

                  });

              }
          },
          error:function(){
              console.error("ajax upload error");
              $("#upload").removeAttr("disabled");
          }
      });
    }

}

function DrawSimilar(){
    var type = ["云创","依图","旷视","商汤"];
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
            //	console.info("在里面");
            _isIn = true;
        }

        if(postionVoctor.x*postionVoctor.x+postionVoctor.y*postionVoctor.y>outerRadius*outerRadius){
            //	console.info("在外面");
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
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#236bd4";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //选中标蓝
        ctx.save;
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
            console.log(unitVoctor[i]);
        }
        upload();
        console.log('更改了')
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
            // debug : true,
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
                    uploadFile = self.getFile(id);
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
