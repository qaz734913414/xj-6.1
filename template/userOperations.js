$(function () {

    $(".mydate input").datetimepicker({
        format: 'yyyy-mm-dd',
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    var select = $('#city-picker-search').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });

    getDateByYear();
    getMessage3();
$('.datetimepicker.datetimepicker-dropdown-bottom-right.dropdown-menu').remove();
})
function changeTime() {
    $("#startDate").datetimepicker('remove');
    $("#endDate").datetimepicker('remove');
    $("#startQDate").datepicker('remove');
    $("#endQDate").datetimepicker('remove');
    var date = new Date();
    var y = date.getFullYear();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var m = date.getFullYear() + seperator1 + month;
    var d = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var h = date.getFullYear() + seperator1 + month + seperator1 + strDate + seperator1 + hour;
    var s = $("#timestatus").find("option:selected").val();

    if (s == 0) {
		$('.mydate').show()
		$('.mydateQ').hide()
        getDateByYear(y);
    } else if (s == 3) {
    	$('.mydate').hide()
		$('.mydateQ').show()
		
        getDateByQuarter(y,month);
    } else if (s == 1) {
		$('.mydate').show()
		$('.mydateQ').hide()
        getDateByMonth(m);
    } else if (s == 2) {
		$('.mydate').show()
		$('.mydateQ').hide()
        getDateByDay(d);
    }
}
changeTime()

function getDateByYear() {
    //按年查询
    $("#startDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        startDate: "2006",
        endDate: "2020",
        //todayHighlight:true,
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 'decade',
        endDate: new Date()
    }).on('changeDate',function(){
      var startTime=$(this).val();
      $("#endDate").datetimepicker('setStartDate',startTime);
      $("#endDate").datetimepicker('hide');
    });

    $("#endDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 'decade'

    }).on("change", function (ev) {

        $(this).datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}
function getDateByQuarter(y,month) {
	$.fn.datepicker.dates['qtrs'] = {
	  days: ["Sunday", "Moonday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  daysShort: ["Sun", "Moon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
	  months: ["一季度", "二季度", "三季度", "四季度", "", "", "", "", "", "", "", ""],
	  monthsShort: ["一季度", "二季度", "三季度", "四季度", "", "", "", "", "", "", "", ""],
	  today: "Today",
	  clear: "Clear",
	  format: "mm/dd/yyyy",
	  titleFormat: "MM yyyy",
	  /* Leverages same syntax as 'format' */
	  weekStart: 0
	};
//	$('.mydateQ input').datepicker('remove');
	$('#QDate').datepicker({
	  format: "yyyy MM",
	  minViewMode: 1,
	  endDate: new Date(),autoclose: true,
	  language: "qtrs",
	  endDate: new Date(),
	  forceParse: false
	}).on("show", function(event) {
	  
	  $(".month").each(function(index, element) {
	    if (index > 3) $(element).hide();
	  });
	  
	}).on("change", function (ev) {
		console.log()
		qFormat(this,$(this).val(),month)
        $(this).datepicker('hide');
    });
	var date = new Date();
	  var y = date.getFullYear();
	  var month=month
	  if(month>=1&&month<=3){
	  	$('#QDate').val(y+' 一季度')
	  }else if(month>=4&&month<=6){
	  	$('#QDate').val(y+' 二季度')
	  }else if(month>=7&&month<=9){
	  	$('#QDate').val(y+' 三季度')
	  }else if(month>=10&&month<=12){
	  	$('#QDate').val(y+' 四季度')
	  }
	  qFormat($('#QDate'),$('#QDate').val(),month)
    function qFormat(el,val,month){
    	console.log(val)
    	console.log(month)
    	if(!!val){
    		var qArr=val.split(' ');
	    	console.log(qArr)
	    	var qVal='';
	    	if(qArr[1]=="一季度"){
	    		qVal=qArr[0]+'-01'+' '+qArr[0]+'-03';
	    	}else if(qArr[1]=="二季度"){
	    		qVal=qArr[0]+'-04'+' '+qArr[0]+'-06';
	    	}else if(qArr[1]=="三季度"){
	    		qVal=qArr[0]+'-07'+' '+qArr[0]+'-09';
	    	}else if(qArr[1]=="四季度"){
	    		qVal=qArr[0]+'-10'+' '+qArr[0]+'-12';
	    	}
			$(el).attr('data-q',qVal)
    	}else{
    		$(el).attr('data-q',month+' '+month)
    	}
    	
    }
}
function getDateByMonth() {
    //按月查询
    //$("#startDate").datetimepicker().format();
    $("#startDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        startDate: 3,
        todayHighlight: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 4,
        todayBtn: true,
    }).on("change", function (ev) {
        var start = $('#startDate').val();

        $('#startDate').datetimepicker('hide');
    }).on('changeDate',function(){
      var startTime=$(this).val();
      $("#endDate").datetimepicker('setStartDate',startTime);
      $("#endDate").datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 4,
        todayBtn: true,
    }).on("change", function (ev) {
        var end = $('#endDate').val();

        $('#endDate').datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}
function getDateByDay() {
    //按天查询
    $("#startDate").datetimepicker({
        format: "yyyy-mm-dd",
        startDate: 4,
        todayHighlight: true,
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        $('#endDate').datetimepicker('hide');
    }).on('changeDate',function(){
      var startTime=$(this).val();
      $("#endDate").datetimepicker('setStartDate',startTime);
      $("#endDate").datetimepicker('hide');
    });
    $("#endDate").datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        endDate: new Date(),autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        var end = $('#endDate').val();

        $('#endDate').datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}
$('#userdiv input').on('input propertychange', function () {
    getMessage3()
})
$('#userdiv select').on('input propertychange', function () {
    getMessage3()
})
$('#userdiv .selector-item').on('input propertychange', function () {
    getMessage3()
})

$('#userdiv a.selector-name').on('click', function () {
    $('#userdiv .selector-item ul li').each(function (i, val) {
        $(val).on('click', function () {
            setTimeout(function () {
                getMessage3()
            })
        })
    })
})
function getMessage3() {
	if($(".mydateQ").is(':hidden')){
		var choesnType = $("#timestatus").find("option:selected").val();
		var startDate = $("#startDate").val();
	    var endDate = $("#endDate").val();
	}else{
		console.log($('#QDate').attr('data-q'))
		var choesnType = 1;
		var QDate=$('#QDate').attr('data-q').split(' ');
		var startDate = QDate[0];
	    var endDate = QDate[1];
	}
    // 地区选择编码
    var areacodeArr = [], areanameArr = [];
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

    getTable3(startDate, endDate, choesnType,areacode);
}
function QueryString(key) {

    var reg = new RegExp(key + "=([^&#]*)", "i");

    var value = reg.exec(window.location.href);

    if (value == null)return null;
    if (value == "undefined")return "";
    return decodeURI(value[1]);
}
    function getTable3(startDate, endDate, choesnType, areacode) {
    $("#proportion").bootstrapTable('destroy');
    $("#proportion").bootstrapTable({
        method: "post",
        url: pathurl + "systemlog/count?startDate=" + startDate + "&endDate=" + endDate + "&type=" + choesnType + "&areacode=" + areacode,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        queryParams: function (params) {
            var obj = {}
            obj.limit = params.limit;
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
        sortOrder: 'desc',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [
            10, 25, 50, 100
        ], //可供选择的每页的行数（*）
        onLoadSuccess: function (data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            // 在ajax后我们可以在这里进行一些事件的处理

        },
    });
};
function reset3() {
    $(".face-form input").val("");
    $(".face-form select").val("0");
    $('.mydate').show();
	$('.mydateQ').hide();
    $('#city-picker-search .province a').html('请选择省份')
    $('#city-picker-search .city a').html('请选择省份')
    $('#city-picker-search .district a').html('请选择区县')
    $('#city-picker-search input').val("");
    getDateByYear();
    getMessage3();
}
function typeformatter(value) {
    if (value == 0) {
        return '人脸检索管理';
    } else if(value == 1){
        return '人脸日志管理';
    }else if(value == 2){
        return '统计分析管理';
    }else if(value == 3){
        return '配置中心';
    }
}
