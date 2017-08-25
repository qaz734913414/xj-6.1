$(function () {
    getMessage3();
    $(".mydate input").datetimepicker({
        format: 'yyyy-mm-dd',
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
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
function getDateByMonth() {
    //按月查询
    //$("#startDate").datetimepicker().format();
    $("#startDate").datetimepicker({
        format: "yyyy-mm",
        startView: 3,
        startDate: 3,
        todayHighlight: true,
        autoclose: true,
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
        autoclose: true,
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
	  autoclose: true,
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
function getDateByYear() {
    //按年查询
    $("#startDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        startDate: "2006",
        endDate: "2020",
        //todayHighlight:true,
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 'decade',
        //todayBtn:true,
    }).on('changeDate',function(){
      var startTime=$(this).val();
      $("#endDate").datetimepicker('setStartDate',startTime);
      $("#endDate").datetimepicker('hide');
    });

    $("#endDate").datetimepicker({
        format: "yyyy",
        startView: 'decade',
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 'decade',

    }).on("change", function (ev) {

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
        autoclose: true,
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
        autoclose: true,
        language: 'zh-CN',
        minView: 2,

    }).on("change", function (ev) {
        var end = $('#endDate').val();

        $('#endDate').datetimepicker('hide');
    });
    $('#startDate').datetimepicker('update', new Date());
    $('#endDate').datetimepicker('update', new Date());
}
// 单位初始
$.ajax({
    type: 'POST',
    url: pathurl + 'user/initDeptAndRole',
    success: function (data) {
        var dListData = data.result.dList;//dList    rName  rId
        console.log(dListData);
        for (var i = 0; i < dListData.length; i++) {
            $('#u_unit_id').append('<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>');
        }

    }
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
	
    var departname = $("#u_unit_id").find("option:selected").text();
    var province = $("#distpicker select[name='province']").val();
    var city = $("#distpicker select[name='city']").val();
    var area = $(" #distpicker select[name='area']").val();
    getTable3(startDate, endDate, departname, choesnType, province, city, area);
}
function getTable3(startDate, endDate, departname, choesnType, province, city, area) {
    $("#proportion").bootstrapTable('destroy');
    $("#proportion").bootstrapTable({
        method: "post",
        url: pathurl + "syslog/chosenresult?startDate=" + startDate + "&endDate=" + endDate + "&choesnType=" + choesnType + "&departname=" + departname + "&province=" + province + "&city=" + city + "&area=" + area,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        //paginationPreText : "上一页",
        //paginationNextText : "下一页",
        searchOnEnterKey: true,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        responseHandler: function (data) {//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
            //在ajax后我们可以在这里进行一些事件的处理
            var dataObj = data.result;
            return dataObj;
        },
    });
}
function reset3() {
    $(".face-form input").val("");
    $(".face-form select").val("-1");
    $('.mydate').show()
	$('.mydateQ').hide()
    getMessage3();
}
$('#proportionbd').on('click', 'td', function () {
    var text = $(this).text();
    var index = $(this).index()
    var date = $(this).siblings().first().text()
    if (text == 0) {
        return false;
    } else {
        $.ajax({
            type: 'POST',
            data: {
                date: date,
                type: index
            },
            url: pathurl + 'syslog/crDetails',
            success: function (data) {
                var dListData = data.result, str = '';
                $.each(dListData, function (index, item) {
                    str += '<tr><td>' + item.name + '</td><td>' + item.idno + '</td><td>' + item.carno + '</td><td>' + item.phoneno + '</td><td>' + item.harmful + '</td><td>' + item.dispose + '</td><td>' + item.username + '</td><td>' + item.userdepart + '</td><td>' + item.userorgan + '</td><td>' + item.creattime + '</td></tr>'
                })
                $('#countbody').html(str)
            }
        })
        $('#countModal').modal()
    }


})