$(function(){
    var select = $('#city-picker-search').cityPicker({
        dataJson: cityData,
        renderMode: true,
        search: true,
        linkage: false
    });
	getTable()

})

$('#userdiv input').on('input propertychange', function () {
    getTable()
})
$('#userdiv select').on('input propertychange', function () {
    getTable()
})
$('#userdiv .selector-item').on('input propertychange', function () {
    getTable()
})

$('#userdiv a.selector-name').on('click', function () {
    $('#userdiv .selector-item ul li').each(function (i, val) {
        $(val).on('click', function () {
            setTimeout(function () {
                getTable()
            })
        })
    })
})


function getTable(){
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

	$('#systemStateTable').bootstrapTable("destroy");
	$('#systemStateTable').bootstrapTable({
	  url: pathurl + 'facelog/queryFaceLog?areacode=' + areacode, /*还未开发的*/

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
        //      search: true,
        //		height:$(document).height()-130,
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
	  paginationDetailHAlign: "left"
	});
}
