//初始化Table
var token = window.localStorage.getItem('token');
// console.log(token)
if (token) {
    $.ajaxSetup({
        headers: {
            'x-access-token': token
        }
    });
}

$(function() {
    getTable();
    $(".face-table-group button[title='Export data']").removeClass(
        "btn-default");
    $(".face-table-group button[title='Export data']").addClass(
        "face-button");
    $('#expireTime').datetimepicker({
        format: "yyyy-mm-dd",
        showMeridian: true,
        autoclose: true,
        language: 'zh-CN',
        minView: 2
    });
    addFormVali();
    init(); /*初始化单位和角色的下拉框 dList rList*/
});

function addFormVali() {
    $('#userForm')
        .bootstrapValidator({
            fields: {
                uName: {
                    validators: {
                        notEmpty: {
                            message: '请输入用户名'
                        }
                    }
                },
                uCardId: {
                    validators: {
                        notEmpty: {
                            message: '请输入身份证'
                        },
                        regexp: {
                            regexp: /^\d{17}(\d|x)$/,
                            message: '身份证输入不正确，请输入18位正确格式的身份证'
                        }

                    }
                },
                uRealName: {
                    validators: {
                        notEmpty: {
                            message: '请输入真实姓名'
                        }
                    }
                },
                expireTime: {
                    validators: {
                        notEmpty: {
                            message: '请输入账户过期时间'
                        }
                    }
                },
                uPhone: {
                    validators: {
                        notEmpty: {
                            message: '手机号码不能为空'
                        },
                        regexp: {
                            regexp: /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
                            message: '手机格式不正确'
                        }
                    }
                }
            }
        });
}
/*初始化单位和角色的下拉框 dList rList*/
function init() {
    var dname,rName;
    $.ajax({
        type: 'POST',
        url: pathurl+'user/initDeptAndRole',
        // url: './testJson/initDeptAndRole.json',
        success: function(data) {

            var unitStr = '';
            var roleStr = '';
            var dListData = data.result.dList;//dList    rName  rId
            var rListData = data.result.rList;
            console.log(data.result)
            dname=dListData;
            rname=rListData;
            for (var i = 0; i < dListData.length; i++) {
                unitStr += '<option value="' + dListData[i].did + '">' + dListData[i].dname + '</option>';
            }
            for (var i = 0; i < rListData.length; i++) {
                roleStr += '<option value="' + rListData[i].id + '">' + rListData[i].name + '</option>';
            }
            $('#uUnitId option').eq(0).after(unitStr);
            $('#uunitId').html(unitStr);
            $('#uRoleId').html(roleStr);


        },
        error: function() {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
}

function getTable1() {
    console.log($("#uRealName").val() + '__' + $("#uUnitId").val())
    $("#userTable").bootstrapTable('destroy');
    $("#userTable").bootstrapTable({
        method: "post",
        url: pathurl+'user/usersList',
        queryParams:{

          uRealName: $("#uRealName").val(),
          uUnitId: $("#uUnitId").val()
        },
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        toolbar: "#userdiv",
        searchOnEnterKey: true,
        //		height:$(document).height()-130,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        onLoadSuccess: function(data){  //加载成功时执行
            console.log(data)
        }
    });
}
function getTable() {
    console.log($("#uRealName").val() + '__' + $("#uUnitId").val())
    $("#userTable").bootstrapTable('destroy');
    $("#userTable").bootstrapTable({
        method: "post",
        url: pathurl+'user/usersList',
        // queryParams:{
        //   pageSize:this.pageSize,
        //   pageNumber:this.pageNumber,
        //   uRealName: $("#uRealName").val(),
        //   uUnitId: $("#uUnitId").val()
        // },
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        clickToSelect: true,
        toolbar: "#userdiv",
        searchOnEnterKey: true,
        //		height:$(document).height()-130,
        buttonsClass: "face",
        showExport: true, //是否显示导出
        exportDataType: "basic", //basic', 'all', 'selected'.
        onLoadSuccess: function(data){  //加载成功时执行
            console.log(data)
        }
    });
}
//重置按钮
function reset() {
    $("#uUnitId").val(0);
    $("#uRealName").val("");
    // var aa=$('#uUnitId option').eq(0).props('selected','selected')
    // console.log(aa);
    getTable();
}
$('#userModal #cancel').on('click',function(){
  $('#userModal').modal('hide');
})
function statusFormatter(value, row, index) {

    if (row.uStatus == 'Y') {
        return ['<button class="reset btn-sm btn face-button " style="margin-right:15px;">正常</button>']
            .join();
    } else {
        return ['<button class="reset btn-sm btn face-button2" style="margin-right:15px;">停用</button>']
            .join();
    }
}

function updateStatus(row) {
  console.log(row.uId)
    $.ajax({
        type: 'POST',
        url: pathurl+'user/status',
        data:{
          uId:row.uId
        },
        success: function() {
            $("#modal-body-id").text("用户状态已改变!");
            $("#myModal").modal();
        },
        error: function() {
            $("#modal-body-id").text("处理失败!");
            $("#myModal").modal();
        },
        dataType: 'json'
    });
    $("#userTable").bootstrapTable('refresh');
}
window.statusEvents = {
    'click .reset': function(e, value, row, index) {
        updateStatus(row);
        $("#userTable").bootstrapTable('refresh');
    }
};

function operateFormatter(value, row, index) {
    return [
            '<button type="button" class="resetPwd btn-sm btn  face-button" style="margin-right:15px;">重置密码</button>',
            '<button type="button" class="update btn-sm btn face-button " style="margin-right:15px;">修改</button>',
            '<button type="button" class="delete btn-sm btn face-button2" style="margin-right:15px;">删除</button>'
        ]
        .join('');
}
window.operateEvents = {
    'click .resetPwd': function(e, value, row, index) {
        resetPwd(row);
        $("#userTable").bootstrapTable('refresh');
    },
    'click .update': function(e, value, row, index) {
        userEdit(row);
    },
    'click .delete': function(e, value, row, index) {
        deleteUser(row);
        $("#userTable").bootstrapTable('refresh');
    }
};
//表格批量删除
function toRemove() {
    var ids = getSelectedRowsIds('userTable');
    if (ids) {
        $("#modal-body-text").text("删除后数据不可恢复，确定要删除吗?");
        $("#deptModel").modal();
        $("#deptModel #cancel").click(function() {
            $("#userTable").bootstrapTable('refresh');
        });
        $("#deptModel #continue").click(function() {
            console.log(111)
            $.ajax({
                type: 'POST',
                url: pathurl+'user/deleteByIds',
                data:{
                  ids:ids
                },
                success: function() {
                  console.log('多表删除成功')
                    $("#modal-body-id").text("删除成功!");
                    $("#myModal").modal();
                    $("#userTable").bootstrapTable('refresh');
                },
                error: function() {
                  console.log('多表删除失败')
                    $("#modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                }
            });
        });
    } else {
        $("#modal-body-id").text("请选择一条数据进行操作!");
        $("#myModal").modal();
    }
}
//操作删除
function deleteUser(row) {
  console.log(row)
    $("#modal-body-text").text("确定将该用户删除?");
    $("#deptModel").modal();
    $("#deptModel #cancel").click(function() {
        $("#userTable").bootstrapTable('refresh');
    });
    $("#deptModel #continue").click(function() {
        console.log(2222)
        $.ajax({
            type: 'POST',
            url: pathurl+'user/delete',
            data:{
              id:row.uId
            },
            success: function() {
              console.log('删除成功!')
                $("#modal-body-id").text("删除成功!");
                $("#myModal").modal();
                $("#userTable").bootstrapTable('refresh');
            },
            error: function() {
              console.log('处理失败!!')
                $("#modal-body-id").text("处理失败!");
                $("#myModal").modal();
            }
        });
    });
}

function resetPwd(row) {
    $("#modal-body-text").text("确定将密码重置为123456吗?");
    $("#deptModel").modal();
    $("#deptModel #cancel").click(function() {
        $("#userTable").bootstrapTable('refresh');
    });
    $("#deptModel #continue").click(function() {
        console.log(3333)
        $.ajax({
            type: 'POST',
            url: pathurl+'user/resetpwd',
            data: {
                uId: row.uId
            },
            success: function() {
                $("#modal-body-id").text("密码重置成功!");
                $("#myModal").modal();
                console.log('密码重置成功!')
            },
            error: function() {
                $("#modal-body-id").text("处理失败!");
                $("#myModal").modal();
                console.log('密码重置失败!')
            },
            dataType: 'json'
        });
    });
}

function userEdit(row) {
    $(".bs-checkbox input[name='btSelectItem']").attr("checked", false);

    //	$("#userForm")[0].reset();
    $("#uName").val(row.uName);
    $("#urealName").val(row.uRealName);
    var uSex = row.uSex;
    console.log(uSex);
    if (uSex == 0) {
        $("#userModal input[name='uSex'][value='0']").attr("checked", true);
        $("#userModal input[name='uSex'][value='1']")
            .attr("checked", false);
        $("#userModal input[name='uSex'][value='2']")
            .attr("checked", false);
    } else if (uSex == 1) {
        $("#userModal input[name='uSex'][value='1']").attr("checked", true);
        $("#userModal input[name='uSex'][value='0']")
            .attr("checked", false);
        $("#userModal input[name='uSex'][value='2']")
            .attr("checked", false);
    } else {
        $("#userModal input[name='uSex'][value='2']").attr("checked", true);
        $("#userModal input[name='uSex'][value='1']")
            .attr("checked", false);
        $("#userModal input[name='uSex'][value='0']")
            .attr("checked", false);
    }
    $("#uCardId").val(row.uCardId);
    $("#uType").val(row.uType);
    $("#uStatus").val(row.uStatus);
    $("#uPhone").val(row.uPhone);
    $("#uTelephone").val(row.uTelephone);
    $("#uPolicyNum").val(row.uPolicyNum);
    $("#uDuty").val(row.uDuty);
    $("#uRoleId").val(row.uRoleId);
    $("#uunitId").val(row.uUnitId);
    $("#expireTime").val(row.expireTime);
    $(".modal-title").html("修改用户");
    $("#userModal").modal();

    $("#userModal #cancel").click(function() {
        $("#userTable").bootstrapTable('refresh');
        $("#userForm")[0].reset();
    });
    var uId = row.uId;
    $("#userModal #continue").click(function() {
        console.log(44444)
        $.ajax({
            type: 'post',
            url: pathurl+'user/edit',
            data: {
                uId: uId,
                uName: $("#uName").val(),
                uRealName: $("#urealName").val(),
                uSex: $("#userModal input[name='uSex']:checked").val(),
                uCardId: $("#uCardId").val(),
                uType: $("#uType").val(),
                uStatus: $("#uStatus").val(),
                uPhone: $("#uPhone").val(),
                uTelephone: $("#uTelephone").val(),
                uPolicyNum: $("#uPolicyNum").val(),
                uDuty: $("#uDuty").val(),
                uRoleId: $("#uRoleId").val(),
                uUnitId: $("#uunitId").val(),
                expireTime: $("#expireTime").val()
            },
            cache: false,
            dataType: 'json',
            success: function(data) {
              console.log(data)
                if (data.code == 0) {
                  console.log('修改成功')
                    $("#myModalLabel").html("提示");
                    $("#modal-body-id").html(data.msg);
                    $('#myModal').modal('show');
                    LoadAjaxContent(pathurl+'user/list');
                } else {
                    $("#myModalLabel").html("提示");
                    $("#modal-body-id").html(data.msg);
                    $('#myModal').modal('show');
                }
            },
            error: function() {
              console.log('修改失败')
                $("#myModalLabel").html("提示");
                $("#modal-body-id").html('系统出错请稍后再试');
                //	$('#myModal').modal('show');
            }
        });
    });
}

function addUser() {
    $("#userForm")[0].reset();
    $(".modal-title").html("添加用户");
    $("#userModal").modal();
    $("#userModal #cancel").click(function() {
      $('#userModal').modal('hide');
    });

    $("#userModal #continue").click(function(form) {
        console.log(555555555)
        $.ajax({
            type: 'post',
            url: pathurl+'user/new',
            data: {
                uName: $("#uName").val(),
                uRealName: $("#urealName").val(),
                uSex: $("#userModal input[name='uSex']:checked").val(),
                uCardId: $("#uCardId").val(),
                uType: $("#uType").val(),
                uStatus: $("#uStatus").val(),
                uPhone: $("#uPhone").val(),
                uTelephone: $("#uTelephone").val(),
                uPolicyNum: $("#uPolicyNum").val(),
                uDuty: $("#uDuty").val(),
                uRoleId: $("#uRoleId").val(),
                uUnitId: $("#uunitId").val(),
                expireTime: $("#expireTime").val()
            },
            cache: false,
            dataType: 'json',
            success: function(data) {
                console.log(data)
                if (data.code == 0) {
                    $('userModal').modal('hide');
                    $("#myModalLabel").html("提示");
                    $("#modal-body-text").html(data.msg);
                    $('#deptModel').modal('show');
                    $("#userForm")[0].reset();
                    LoadAjaxContent(pathurl+'user/list');
                } else {
                    $('#userModal').modal('hide');
                    $("#myModalLabel").html("提示");
                    $("#modal-body-text").html(data.msg);
                    $('#deptModel').modal('show');
                }
            },
            error: function() {
                $("#myModalLabel").html("提示");
                $("#modal-body-id").html('系统出错请稍后再试');
                //	$('#myModal').modal('show');
            }
        });
    });

}
// setInterval(function(){
//   data = new FormData()
//   data.append('key1',"value1");
//   console.log(data)
// },100)
function doUpload() {
    $("#modal-text").text("请上传后缀为'.xlsx'的表格,可以点击下载模板参考");
    $("#fileinputModal").modal();
    $("#fileinputModal #cancel").click(function() {
        $("#userTable").bootstrapTable('refresh');
    });
    $("#fileinputModal #continue").click(function() {
        console.log(66666)

        var formData = new FormData($( "#uploadForm" )[0]);
        console.log(formData.get("file"));
        if(formData.get("file").name){
          $.ajax({
              url: pathurl+'fileUpload',
              type: 'POST',
              data: formData,
              async: false,
              cache: false,
              contentType: false,
              processData: false,
              success: function(data) {
                  if (data.code == 200) {

                      $("#modal-body-id").text(data.msg);
                      $("#myModal").modal();
                      $("#userTable").bootstrapTable('refresh');
                  } else {
                      $("#modal-body-id").text(data.msg);
                      $("#myModal").modal();
                  }
              },
              error: function(data) {
                  $("#modal-body-id").text("上传文件失败,请重新尝试!");
                  $("#myModal").modal();
              }
          });
        }else{
          $("#modal-body-id").text('请选择要上传的文件');
          $("#myModal").modal();
          $("#userTable").bootstrapTable('refresh');
        }

    });
}




//
//
// // Run Datables plugin and create 3 variants of settings
// 	function AllTables() {
// 		TestTable1();
// 		LoadSelect2Script(MakeSelect2);
// 	}
// 	function MakeSelect2() {
// 		//$('select').select2();
// 		$("select").select2({
// 			minimumResultsForSearch : -1
// 		});
// 		$('.dataTables_filter').each(
// 				function() {
// 					$(this).find('label input[type=text]').attr('placeholder',
// 							'用户名、姓名');
// 				});
// 	}
//
// 	$(document).ready(function() {
// 		// Load Datatables and run plugin on tables
// 		LoadDataTablesScripts(AllTables);
// 		// Add Drag-n-Drop feature
// 		//	LoadBootstrapValidatorScript(addFormVali);
// 		WinMove();
//
// 		getEcharts();
// 	});
//
// 	function getEcharts() {
// 		var roleChart = echarts.init(document.getElementById('roleEchart'));
// 		var departmentChart = echarts.init(document
// 				.getElementById('departmentEchart'));
// 		// var rname = ${nList};
// 		// var rvaluelist = ${value};
// 		var rtemplist = [];
// 		for (var i = 0; i < rname.length; i++) {
// 			var temp = {
// 				value : rvaluelist[i],
// 				name : rname[i]
// 			}
// 			rtemplist.push(temp);
// 		}
// 		console.log(rtemplist);
// 		// var dname = ${dnList};
// 		// var dvaluelist = ${dvalueList};
// 		var dtemplist = [];
// 		for (var i = 0; i < dname.length; i++) {
// 			var temp = {
// 				value : dvaluelist[i],
// 				name : dname[i]
// 			}
// 			dtemplist.push(temp);
// 		}
// 		roleChart.setOption(getOption("角色", rname, rtemplist));
// 		departmentChart.setOption(getOption("单位", dname, dtemplist));
// 	}
// 	function getOption(title, name, templist) {
// 		option = {
// 			title : {
// 				text : title + '统计',
// 				x : 'center'
// 			},
// 			tooltip : {
// 				trigger : 'item',
// 				formatter : "{a} <br/>{b} : {c} ({d}%)"
// 			},
// 			legend : {
// 				orient : 'vertical',
// 				left : 'left',
// 				data : name
// 			},
// 			series : [ {
// 				name : title,
// 				type : 'pie',
// 				radius : '55%',
// 				center : [ '50%', '60%' ],
// 				data : templist,
// 				itemStyle : {
// 					emphasis : {
// 						shadowBlur : 10,
// 						shadowOffsetX : 0,
// 						shadowColor : 'rgba(0, 0, 0, 0.5)'
// 					}
// 				}
// 			} ]
// 		};
// 		return option;
// 	}
