

// 普通用户注销退出
$("#logout_btn").on("click", function() {
	window.location.href = basePath + "/logout";
});

$("#modifyPass").on("click", function() {
	LoadAjaxContent(basePath + "/userinfo");
});

$("#admin_modifyPass").on("click", function() {
	LoadAjaxContent(basePath + "/admin/info");
});

//管理员注销退出
$("#admin_logout_btn").on("click", function() {
	window.location.href = basePath + "/adminLogout";
});

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



