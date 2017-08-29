$(function(){
	var unitData = [];
  var roleData = [];
	getTable()
	mainSelectInit()
	var select = $('#city-picker-search').cityPicker({dataJson: cityData, renderMode: true, search: true, linkage: false});

})
$('#mainSearch select').on('input propertychange', function() {
  getTable()
})

$('#mainSearch a.selector-name').on('click', function() {
  $('#mainSearch .selector-item ul li').each(function(i, val) {
    console.log($(val))
    $(val).on('click', function() {
      console.log('点击了')
      setTimeout(function() {
        getTable()
      })
    })
  })
})
function mainSelectInit() {
  var unitHtml = $('#mainSearch #uUnitId').html();
  var roleHtml = $('#mainSearch #uRoleId').html();
  $.ajax({
    type: 'post',
    url: pathurl + 'user/initDeptAndRole',
		async:false,
    success: function(res) {
      unitData = res.result.dList;
      roleData = res.result.rList;
      for (var i = 0; i < unitData.length; i++) {
        unitHtml += '<option value="' + unitData[i].did + '">' + unitData[i].dname + '</option>';
      }
      for (var i = 0; i < roleData.length; i++) {
        roleHtml += '<option value="' + roleData[i].id + '">' + roleData[i].name + '</option>';
      }
      $('#mainSearch #uUnitId').html(unitHtml);
      $('#mainSearch #uRoleId').html(roleHtml);
    }
  })
}


function getTable(){
	var areacodeArr = [],
    areanameArr = [];

  var pr = $("#mainSearch input[name='userProvinceId']").val() || '';
  areacodeArr.push(pr)
  var ci = $("#mainSearch input[name='userCityId']").val() || '';
  areacodeArr.push(ci)
  var di = $("#mainSearch input[name='userDistrictId']").val() || '';
  areacodeArr.push(di)
  var prn = $("#mainSearch .province>a").text() || '';
  areanameArr.push(prn)
  var cin = $("#mainSearch .city>a").text() || '';
  areanameArr.push(cin)
  var din = $("#mainSearch .district>a").text() || '';
  areanameArr.push(din)
  var areacode = regk(areacodeArr).substr(1)
  var areaname = regk(areanameArr).substr(1)
	var depart=$('#mainSearch #uUnitId').val();
	$('#systemStateTable').bootstrapTable("destroy");
	$('#systemStateTable').bootstrapTable({
	  url: pathurl + 'syslog/systemstatusbyhour?departname='+depart+"&areacode="+areacode,
	  method: "post",
	  contentType: "application/x-www-form-urlencoded",
	  // queryParams: function (queryParams) {
		// 	var obj={}
		// 	obj.areacode=areacode;
		// 	obj.depart=$('#mainSearch #uRoleId').val();
	  // 	console.log(queryParams)
	  //   return obj
	  // },
	  queryParamsType: " limit",
	  paginationPreText: "上一页",
	  paginationNextText: "下一页",
	  striped: true,
	  sortable: true,
	  sortOrder:'asc',
	  sidePagination:'client',
	  pagination: true, //是否显示分页（*）
	  pageNumber: 1, //初始化加载第一页，默认第一页
	  pageSize: 10, //每页的记录行数（*）
	  pageList: [
	    10, 25, 50, 100
	  ],
	  paginationDetailHAlign: "left",
		responseHandler: function (res) {
				//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
				//在ajax后我们可以在这里进行一些事件的处理
				return res.result;
		},
		columns:[
			// {
			// 	field: 'id',
			// 	title: '序号',
			// 	sortable:false,
			// 	formatter: function (value, row, index) {
			// 			return ++index;
			// 	}
			// }
		]
	});
}
function reset(){
  $('#mainSearch #uRoleId').val("");
  $('#mainSearch #city-picker-search .province a').html('请选择省份')
  $('#mainSearch #city-picker-search .city a').html('请选择省份')
  $('#mainSearch #city-picker-search .district a').html('请选择区县')
  $('#mainSearch #city-picker-search input').val("");
	getTable()
}
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
