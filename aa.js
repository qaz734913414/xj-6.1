/**
 * 使用过案例
 *  var t=1347497754133;
 *	var d=	new Date();
 *	d.setTime(t);
 *	var s=d.format('yyyy-MM-dd HH:mm:ss');
 *	alert(s)
 */
Date.prototype.format=function(fmt) {        
    var o = {        
    "M+" : this.getMonth()+1, //月份        
    "d+" : this.getDate(), //日        
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时        
    "H+" : this.getHours(), //小时        
    "m+" : this.getMinutes(), //分        
    "s+" : this.getSeconds(), //秒        
    "q+" : Math.floor((this.getMonth()+3)/3), //季度        
    "S" : this.getMilliseconds() //毫秒        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}

var dateUtil = {
	dateDiff: function(d1, d2) {//两个日期差
		 var day = 24 * 60 * 60 *1000;
		 try{  
		   var dateArr = d1.split("-");
		   var checkDate = new Date();
		     checkDate.setFullYear(dateArr[0], dateArr[1]-1, dateArr[2]);
		   var checkTime = checkDate.getTime();
		   
		   var dateArr2 = d2.split("-");
		   var checkDate2 = new Date();
		     checkDate2.setFullYear(dateArr2[0], dateArr2[1]-1, dateArr2[2]);
		   var checkTime2 = checkDate2.getTime();
		    
		   var cha = (checkTime - checkTime2)/day; 
		   return cha;
		 }catch(e){
		   return false;
		 }
	},
	timeDifference: function(startDate, endDate) {//向下浮动  日期差
		var day = 24 * 60 * 60 *1000;
		var timeDifference = endDate.getTime() - startDate.getTime();//时间差
		return Math.floor(timeDifference/day);
	},
	setFlag: function(start, end){//设置周期内的日期(数组)
		var self = this;
		var cdate = Array();
		cdate = start.split("-");
		var cd = cdate[1]+"/"+cdate[2]+"/"+cdate[0]; 
		var dayNum = this.dateDiff(end,start);
		for(var i=0; i<=dayNum; i++){
		  flag.push(self.addDays(cd,i));
		}
	},
	addDays: function(date, days){//日期加上天数后的新日期.
		var nd = new Date(date);
		nd = nd.valueOf();
		nd = nd + days * 24 * 60 * 60 * 1000;
		nd = new Date(nd);
		//alert(nd.getFullYear() + "年" + (nd.getMonth() + 1) + "月" + nd.getDate() + "日");
		var y = nd.getFullYear();
		var m = nd.getMonth()+1;
		var d = nd.getDate();
		if(m <= 9) m = "0"+m;
		if(d <= 9) d = "0"+d; 
		var cdate = y+"-"+m+"-"+d;
		return cdate;
	},
	dateAdd: function(interval, number, date) {//  使用案例  var newDate = DateAdd("d ", 5, now);
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
		    case "m": {
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
		    case "min": {
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
