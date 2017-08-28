/**
 * 使用过案例
 *  var t=1347497754133;
 *    var d=    new Date();
 *    d.setTime(t);
 *    var s=d.format('yyyy-MM-dd HH:mm:ss');
 *    alert(s)
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var dateUtil = {
    dateDiff: function (d1, d2) {//两个日期差
        var day = 24 * 60 * 60 * 1000;
        try {
            var dateArr = d1.split("-");
            var checkDate = new Date();
            checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
            var checkTime = checkDate.getTime();

            var dateArr2 = d2.split("-");
            var checkDate2 = new Date();
            checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
            var checkTime2 = checkDate2.getTime();

            var cha = (checkTime - checkTime2) / day;
            return cha;
        } catch (e) {
            return false;
        }
    },
    timeDifference: function (startDate, endDate) {//向下浮动  日期差
        var day = 24 * 60 * 60 * 1000;
        var timeDifference = endDate.getTime() - startDate.getTime();//时间差
        return Math.floor(timeDifference / day);
    },
    setFlag: function (start, end) {//设置周期内的日期(数组)
        var self = this;
        var cdate = Array();
        cdate = start.split("-");
        var cd = cdate[1] + "/" + cdate[2] + "/" + cdate[0];
        var dayNum = this.dateDiff(end, start);
        for (var i = 0; i <= dayNum; i++) {
            flag.push(self.addDays(cd, i));
        }
    },
    addDays: function (date, days) {//日期加上天数后的新日期.
        var nd = new Date(date);
        nd = nd.valueOf();
        nd = nd + days * 24 * 60 * 60 * 1000;
        nd = new Date(nd);
        //alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日");
        var y = nd.getFullYear();
        var m = nd.getMonth() + 1;
        var d = nd.getDate();
        if (m <= 9) m = "0" + m;
        if (d <= 9) d = "0" + d;
        var cdate = y + "-" + m + "-" + d;
        return cdate;
    },
    dateAdd: function (interval, number, date) {//  使用案例  var newDate = DateAdd("d注意空格", 5, now);注意空格
        number = Number(number);
        switch (interval) {
            case "y ": {
                date.setFullYear(date.getFullYear() + number);
                return date;
                break;
            }
            case "q ": {
                date.setMonth(date.getMonth() + number * 3);
                return date;
                break;
            }
            case "m ": {
                date.setMonth(date.getMonth() + number);
                return date;
                break;
            }
            case "w ": {
                date.setDate(date.getDate() + number * 7);
                return date;
                break;
            }
            case "d ": {
                date.setDate(date.getDate() + number);
                return date;
                break;
            }
            case "h ": {
                date.setHours(date.getHours() + number);
                return date;
                break;
            }
            case "min ": {
                date.setMinutes(date.getMinutes() + number);
                return date;
                break;
            }
            case "s ": {
                date.setSeconds(date.getSeconds() + number);
                return date;
                break;
            }
            default: {
                date.setDate(date.getDate() + number);
                return date;
                break;
            }
        }
    }

}
// 使用案例  var newDate = DateAdd("d ", 5, now);
// console.log(dateUtil.dateAdd('m ', 6, new Date));
// 去掉地区选择插件的请选择
function regk(data) {
    var str = ''
    for (var i = 0; i < data.length; i++) {

        if (!data[i] || !data[i].search(/请选择/g)) { //为空就进来

        } else {
            str += '-' + data[i]
        }
    }
    return str || ''
}

function compareDate(strDate1, strDate2){
	if (new Date(strDate1.replace(/\-/g, "\/")) >= new Date(strDate2.replace(/\-/g, "\/"))) {
		return 1;
	}
	return -1;
}

/**
 * ====================================================
 * 使文本输入框只能输入数字,小数点,负数
 * @param event
 * @param obj
 */
function clearNoNum(event,obj){ 
    // 响应鼠标事件，允许左右方向键移动
    event = window.event||event; 
    if(event.keyCode == 37 | event.keyCode == 39){ 
        return; 
    } 
    var t = obj.value.charAt(0); 
    //先把非数字的都替换掉，除了数字和. 
    obj.value = obj.value.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是. 
    obj.value = obj.value.replace(/^\./g, "");
    //保证只有出现一个.而没有多个. 
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    //保证.只出现一次，而不能出现两次以上 
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    
    var dotIndex = obj.value.indexOf(".");
    if (dotIndex > 0) {
    	if(obj.value.substring(0, dotIndex).length > 16) {
    		obj.value = obj.value.substring(0, dotIndex).substring(0, 16) + "." + obj.value.substring(dotIndex + 1);
    	} 
    } else{
    	if(obj.value.length > 16) {
    		obj.value = obj.value.substring(0, 16);
    	} 
    }
    //如果第一位是负号，则允许添加   如果不允许添加负号 可以把这块注释掉
    if (t == '-') {
        obj.value = '-' + obj.value;
    }
}

function checkNum(obj){ 
    // 为了去除最后一个.
    obj.value = obj.value.replace(/\.$/g,""); 
}
/**
 * =====================================================
 */

// 只能输入正整数
function onlyInt(arr){
	for (var i in arr) {
	    $("#" + arr[i]).bind("keyup", {index: arr[i]}, intHandler);
	    $("#" + arr[i]).bind("blur", {index: arr[i]}, intHandler);
	}
}

function intHandler(event) {
    var obj = event.data.index;
	$("#"+obj).val($("#"+obj).val().replace(/\D/g,''));
}

/**
*  ==============================================================
*/
function Select2All(){
	 $("select").each(function(i){
			$(this).select2();
	});
}

/**
 * ------------------------------------------
 */

function setBigDecimalType(){
	 $("input").each(function(i){
			$(this).bind("keyup",{id: $(this).attr("id")}, clearNoNumthis);
			$(this).bind("blur",{id: $(this).attr("id")}, checkNumthis);
	});
}


function clearNoNumthis(event){ 
    // 响应鼠标事件，允许左右方向键移动
    event = window.event||event; 
    var id = event.data.id;
    if(event.keyCode == 37 | event.keyCode == 39){ 
        return; 
    } 
    var t =  $("#"+id).val().charAt(0); 
    //先把非数字的都替换掉，除了数字和. 
    $("#"+id).val(  $("#"+id).val().replace(/[^\d.]/g, ""));
    //必须保证第一个为数字而不是. 
    $("#"+id).val(   $("#"+id).val().replace(/^\./g, "") );
    //保证只有出现一个.而没有多个. 
    $("#"+id).val(   $("#"+id).val().replace(/\.{2,}/g, ".") );
    //保证.只出现一次，而不能出现两次以上 
    $("#"+id).val(   $("#"+id).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
    
    var dotIndex =  $("#"+id).val().indexOf(".");
    if (dotIndex > 0) {
    	if( $("#"+id).val().substring(0, dotIndex).length > 16) {
    		 $("#"+id).val(  $("#"+id).val().substring(0, dotIndex).substring(0, 16) + "." +  $("#"+id).val().substring(dotIndex + 1) );
    	} 
    } else{
    	if( $("#"+id).val().length > 16) {
    		 $("#"+id).val(  $("#"+id).val().substring(0, 16));
    	} 
    }
    //如果第一位是负号，则允许添加   如果不允许添加负号 可以把这块注释掉
    if (t == '-') {
    	 $("#"+id).val( '-' + $("#"+id).val());
    }
}

function checkNumthis(event){ 
    // 为了去除最后一个.
	 var id = event.data.id;
	 $("#"+id).val( $("#"+id).val().replace(/\.$/g,"")); 
}

/**
 * 所有的输入框选择框置为disabled
 */
function setAllReadOnly(){
	 $("input").each(function(i){
			$(this).attr("readonly","readonly");
	 });
	 $("textarea").each(function(i){
			$(this).attr("readonly","readonly");
	 });
	 $("select").each(function(i){
			$(this).attr("disabled","disabled");
	 });
	 $("input[type='file']").each(function(i){
			$(this).hide();
	});
}

/**
 * 判断提交状态
 */
function checkSubmited(){
	if($("#subState").val() == "1"){
		$("form button").attr("disabled","disabled");
	}
}


/**
 * 自定义Map
 */
function Map(){
	this.container = new Object();
}

Map.prototype.put = function(key, value){
	this.container[key] = value;
};

Map.prototype.get = function(key){
	return this.container[key];
};

Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
			continue;
		}
		keyset[count] = key;
		count++;
	}
	return keyset;
};

Map.prototype.size = function() {
	var count = 0;
	for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend'){
			continue;
		}
		count++;
	}
	return count;
};

Map.prototype.remove = function(key) {
	delete this.container[key];
};

Map.prototype.toString = function(){
	var str = "";
	for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
		str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
	}
	return str;
};


function disableForm(formId) {  
    $("form[id='"+formId+"'] input").attr("disabled", "disabled");  
    $("form[id='"+formId+"'] textarea").attr("disabled", "disabled");  
    $("form[id='"+formId+"'] select").attr("disabled", "disabled");  
} 

function futureSeason(year,season){
	var _currentDate = new Date();
	var _currentYear = _currentDate.getFullYear();
	var _currentMonth = _currentDate.getMonth();
	var _currentSeason = (_currentMonth/3)+1;
	return ( _currentYear*4 + _currentSeason - year*4 - season ) < 0
}

var national = [
    "汉族", "壮族", "满族", "回族", "苗族", "维吾尔族", "土家族", "彝族", "蒙古族", "藏族", "布依族", "侗族", "瑶族", "朝鲜族", "白族", "哈尼族",
    "哈萨克族", "黎族", "傣族", "畲族", "傈僳族", "仡佬族", "东乡族", "高山族", "拉祜族", "水族", "佤族", "纳西族", "羌族", "土族", "仫佬族", "锡伯族",
    "柯尔克孜族", "达斡尔族", "景颇族", "毛南族", "撒拉族", "布朗族", "塔吉克族", "阿昌族", "普米族", "鄂温克族", "怒族", "京族", "基诺族", "德昂族", "保安族",
    "俄罗斯族", "裕固族", "乌孜别克族", "门巴族", "鄂伦春族", "独龙族", "塔塔尔族", "赫哲族", "珞巴族"
];


