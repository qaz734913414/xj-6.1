//var roleList = ${list};
$('.roleList').show();
$('.roleList').siblings().hide();

$('#delComfirmModal #sureSubmit').on('click', function() {
    $('#myComfirmModal').modal('hide');
    $.ajax({
        type: 'post',
        url: pathurl + 'role/roleDelete',
        //		url:'./true.json',''
        data: {
            rid: $("#comfirm_modal_hidden_id").val()
        },
        cache: false,
        async: false,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if (data.code == 200) {
                console.log(data.code)
                $("#PromptModalLabel").html("提示");
                $("#Prompt-body-text").html("角色删除成功");
                $('#PromptModal').modal('show');
            } else {
                $("#PromptModalLabel").html("提示");
                $("#Prompt-body-text").html(data.msg);
                $('#PromptModal').modal('show');
            }
            $("#roleTable").bootstrapTable('refresh');
        },
        error: function() {
            // alert('系统出错请稍后再试');
            $("#Prompt-body-text").html('系统出错');
            $('#PromptModal').modal('show');
        }
    });
});
$('#PromptModal #sure').on('click', function() {
    $('#PromptModal').modal('hide');
})
$(function() {
    getTable();
});

// 	table
function getTable() { //表格初始化
    $('.roleList').siblings().hide();
    $("#roleTable").bootstrapTable('destroy');
    $("#roleTable").bootstrapTable({
        method: "post",
        url: pathurl + "role/listAll",
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        buttonsClass: "face",
        pageNumber: 1, //初始化加载第一页，默认第一页
        cardView: false, //是否显示详细视图
        pageList: [10, 25, 50, 100],
        //	height : $(document).height() - 200
        //			queryParams: function queryParams(params) {   //设置查询参数
        //            var param = {
        //                pageNumber: params.pageNumber,
        //                pageSize: params.pageSize,
        //                orderNum : $("#orderNum").val()
        //            };
        //            return param;
        //          },
        onLoadSuccess: function(data) { //加载成功时执行
            console.log(data)


        },
    });
}

function operateFormatter(value, row, index) {
    return [
        '<button type="button" data-id="button1" class="pcode updateBtn btn-sm btn face-button" style="margin-right:15px;">修改</button>',
        '<button type="button" data-id="button2" class="pcode removeBtn btn-sm btn face-button2" style="margin-right:15px;">删除</button>'
    ]
        .join('');
}
window.operateEvents = {
    'click .removeBtn': function(e, value, row, index) {
        roleDelete(row);
        // $("#roleTable").bootstrapTable('refresh');
    },
    'click .updateBtn': function(e, value, row, index) {
        console.log(row)
        $('.roleEdit').show();
        $('.roleEdit').siblings().hide();
        // roleEditZtree(row.rId, row.rName);
        // $()
        $('#rolerId').val(row.rId);
        changeNodeVal = "";
        var zTree;
        var selectNode;
        var changeNodeVal;
        var load = false;
        var rIdVal=$('#rolerId').val();
        console.log(rName);
        $("#xrName").val(row.rName);
        var menus;
        var setting = {
            async: {
                enable: true,
                dataType: "json",
                type: "post",
                url: pathurl + "menu/initZTree?rName=" + $("#xrName").val(), //请求节点生成的servlet
                autoParam: ["id"] //每次异步加载传给服务器的参数
            },
            view: {
                dblClickExpand: true,
                selectedMulti: false,
            },
            data: {
                key: {
                    name: "nodeName" // 取后台传过来的json数据中 nodeName 字段值作为节点名称
                },
                simpleData: {
                    enable: true,
                    idKey: "id", //节点的id,注意此处要对应你后台传过来的节点的属性名id
                    pIdKey: "pId", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId
                    rootPId: 0 //根节点的pId = 0
                }
            },
            check: {
                enable: true, //每个节点上是否显示 CheckBox
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                },
                chkStyle: "checkbox", //复选框类型
            },
            callback: {
                onAsyncSuccess: zTreeOnAsyncSuccess, //异步加载完毕的回调函数
                onCheck: onCheck
            }
        };

        function onCheck(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("streeDemo");
            var cnodes = treeObj.getCheckedNodes(true);
            changeNodeVal = "";
            for (var i = 0; i < cnodes.length; i++) {
                changeNodeVal += cnodes[i].id + ","; //获取选中节点的值
            }

            $('#changeNodes').val(changeNodeVal);
        }



        function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) { //这个函数仅仅是为了 初始化时展开 1级菜单
            if (!load) {
                var nodes = zTree.getNodesByParam("pId", 0, null);
                $.each(nodes, function(i, n) {
                    zTree.expandNode(n, true, false, true);
                });
                load = true;
            } else {
                var nodes = zTree.getNodesByParam("pId", treeNode.id, null);
                $.each(nodes, function(i, n) {
                    zTree.expandNode(n, true, false, true);
                });
            }

        }

        $(function() {
            zTree = $.fn.zTree.init($("#streeDemo"), setting);
        });
        // Run Datables plugin and create 3 variants of settings
        //				function AllTables(){
        //					TestTable2();
        //					LoadSelect2Script(MakeSelect2);
        //				}
        function MakeSelect2() {
            $('select').select2();
            $('.dataTables_filter').each(function() {
                $(this).find('label input[type=text]').attr('placeholder', '请输入关键字');
            });
        }

        // Load Datatables and run plugin on tables
        //					LoadDataTablesScripts(AllTables);
        // Add Drag-n-Drop feature
        //					LoadBootstrapValidatorScript(addFormVali);
        addFormVali()
        //					WinMove();


        function addFormVali() {
            $('#sroleInfoForm').bootstrapValidator({
                fields: {
                    // 			rLevel: {
                    // 				validators: {
                    // 					notEmpty: {
                    // 						message: '请输入角色级别'
                    // 					},
                    // 				}
                    // 			},
                    rName: {
                        validators: {
                            notEmpty: {
                                message: '请输入角色名称'
                            },
                        }
                    }
                },
                submitHandler: function(form) {
                    var formData = $("#sroleInfoForm").serialize();
                    $.ajax({
                        url: pathurl + 'role/editRole',
                        type: 'post',
                        data: {
                            changeNodes: $('#changeNodes').val(),
                            rId: $('#rolerId').val(),
                            rName: $("#xrName").val()
                        },
                        success: function(data) {
                            console.log(data);
                            console.log(!data.code);
                            if(!data.code){
                                $("#myComfirmModal #myComfirmModalLabel").html("提示");
                                $("#myComfirmModal #confirm_modal-body-id").html("修改成功");
                                $('#myComfirmModal').modal('show');
                                $('.roleList').show();
                                $('.roleList').siblings().hide();
                                $("#roleTable").bootstrapTable('refresh');
                            }else if (data.code == 200) {
                                console.log('修改成功')
                                $("#myComfirmModal #myComfirmModalLabel").html("提示");
                                $("#myComfirmModal #confirm_modal-body-id").html("修改成功");
                                $('#myComfirmModal').modal('show');
                                $('.roleList').show();
                                $('.roleList').siblings().hide();
                                $("#roleTable").bootstrapTable('refresh');

                            } else {

                                $("#myComfirmModal #myComfirmModalLabel").html("提示");
                                $("#myComfirmModal #confirm_modal-body-id").html(data.msg);
                                $('#myComfirmModal').modal('show');
                            }
                            var rIdVal=null;
                            changeNodes='';
                        },
                        error: function() {
                            console.log('系统出错请稍后再试')
                            $("#myComfirmModal #myComfirmModalLabel").html("提示");
                            $("#myComfirmModal #confirm_modal-body-id").html('系统出错请稍后再试');
                            $('#myComfirmModal').modal('show');
                        }
                    })
                    changeNodes='';
                }
            });
        }
    }
};
// $('#roleTable').on('click','button.removeBtn',function(){
// 	console.log('11111111111111')
// 	roleDelete(row);
// 	$("#roleTable").bootstrapTable('refresh');
// })
function roleDelete(row) { //删除盒子提示信息
    $('#comfirm_modal_hidden_id').val(row.rId);
    $("#delComfirmModal #confirm_modal-body-id").html("确定要删除角色名:<span style=\"color: red;\">" + row.rName + "</span>吗?");
    $("#delComfirmModal").modal('show');
}

function addRole() { //新建角色
    // $('.roleList').hide();
    $('.roleAdd').show();
    $('.roleAdd').siblings().hide();
    addRoleZtree();
    //http://192.168.0.239:8080/FaceManage/role/addRole
    //字段	                含义
    //checkNodes	返回的下拉框渲染数据
    //rName	                新增的用户名
    //		LoadAjaxContent("${ctx }/role/roleAdd");
}

// function roleEdit(row) {
//
// 	//		LoadAjaxContent("${ctx }/role/roleEdit/"+row.rId);
// }

//	function searchFormSubmit(){
//		LoadAjaxContent("${ctx }/admin/inituserlist",
//						"role="+$("#role_condition").val()
//						+"&wes="+$("#wes_condition").val()
//						+"&cds="+$("#cds_condition").val()
//						+"&qms="+$("#qms_condition").val()
//						+"&delete="+$("#delete_condition").val()
//						);
//	}
function goback() {
    $('.roleList').show();
    $('.roleList').siblings().hide();
    getTable()
}

    function addRoleZtree() {
        var zTree;
        var selectNode;
        var load = false;
        var checkNodes;
        var setting = {
            async: {
                enable: true,
                dataType: "json",
                type: "post",
                url: pathurl + 'menu/initZTree',
                autoParam: ["id"] //每次异步加载传给服务器的参数
            },
            view: {
                dblClickExpand: true,
                selectedMulti: false,
            },
            data: {
                key: {
                    name: "nodeName" // 取后台传过来的json数据中 nodeName 字段值作为节点名称
                },
                simpleData: {
                    enable: true,
                    idKey: "id", //节点的id,注意此处要对应你后台传过来的节点的属性名id
                    pIdKey: "pId", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId
                    rootPId: 0 //根节点的pId = 0
                }
            },
            check: {
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                },
                chkStyle: "checkbox", //复选框类型
                enable: true //每个节点上是否显示 CheckBox
            },
            callback: {
                onAsyncSuccess: zTreeOnAsyncSuccess, //异步加载完毕的回调函数
                onCheck: zTreeOnCheck
            }
        };

        function zTreeOnCheck(event, treeId, treeNode) {

            var treeObj = $.fn.zTree.getZTreeObj('treeDemo');
            var cnodes = treeObj.getCheckedNodes(true);
            checkNodes = "";
            for (var i = 0; i < cnodes.length; i++) {
                checkNodes += cnodes[i].id + ","; //获取选中节点的值
            }

        };

        function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
            //这个函数仅仅是为了 初始化时展开 1级菜单
            console.log(msg)
            if (!load) {
                var nodes = zTree.getNodesByParam("pId", 0, null);
                $.each(nodes, function(i, n) {
                    zTree.expandNode(n, true, false, true);
                });
                load = true;
            } else {
                var nodes = zTree.getNodesByParam("pId", treeNode.id, null);
                $.each(nodes, function(i, n) {
                    zTree.expandNode(n, true, false, true);
                });
            }

        }
        $(document).ready(function() {
            // Load Datatables and run plugin on tables
            //				LoadDataTablesScripts(AllTables);
            // Add Drag-n-Drop feature
            //				LoadBootstrapValidatorScript(addFormVali);
            addFormVali()
            //				WinMove();
        });
        $(function() {
            zTree = $.fn.zTree.init($('#treeDemo'), setting);
        });
        // Run Datables plugin and create 3 variants of settings
        //			function AllTables() {
        //				TestTable2();
        //				LoadSelect2Script(MakeSelect2);
        //			}

        function MakeSelect2() {
            $('select').select2();
            $('.dataTables_filter').each(
                function() {
                    $(this).find('label input[type=text]').attr('placeholder',
                        '请输入关键字');
                });
        }

        //			$('.btn.face-button').on('click',function(){
        //				return false;
        //			})

        function addFormVali() {
            // $('#roleInfoForm').bootstrapValidator({
            //     fields: {
            //         // 				rLevel : {
            //         // 					validators : {
            //         // 						notEmpty : {
            //         // 							message : '请输入角色级别'
            //         // 						},
            //         // 					}
            //         // 				},
            //         // 	rName: {
            //         // 		validators: {
            //         // 			notEmpty: {
            //         // 				message: '请输入角色名称'
            //         // 			},
            //         // 		}
            //         // 	}
            //     },
            //     submitHandler: function(form) { //新增角色跳转后的页面提交
            //         //						alert('asdkljaskldjl;a')
            //         //						$
                $('#addbtn').on('click',function(){
                    var rName = $("#rName").val();
                    var formData = $("#roleInfoForm").serialize();
                    console.log(checkNodes);
                    console.log(rName)
                    if($('.roleAdd #rName').val()==''){
                        $("#myComfirmModal #myComfirmModalLabel").html("提示");
                        $("#myComfirmModal #confirm_modal-body-id").html("请输入角色名");
                        $('#myComfirmModal').modal('show');
                    }else if (!checkNodes) {
                        console.log("请选择权限授权")

                        $("#myComfirmModal #myComfirmModalLabel").html("提示");
                        $("#myComfirmModal #confirm_modal-body-id").html("请选择权限授权");
                        $('#myComfirmModal').modal('show');
                    } else {
                        $.ajax({
                            url: pathurl + 'role/addRole',
                            type: 'post',
                            data: {
                                checkNodes: checkNodes,
                                rName: rName
                            },
                            success: function(data) {
                                console.log(data)
                                if (data.code == 200) {
                                    console.log("添加成功")
                                    $("#myComfirmModal #myComfirmModalLabel").html("提示");
                                    $("#myComfirmModal #confirm_modal-body-id").html("添加成功");
                                    $('#myComfirmModal').modal('show');
                                    $('.roleList').show();
                                    $('.roleList').siblings().hide();
                                    $("#roleTable").bootstrapTable('refresh');
                                    //									LoadAjaxContent('${ctx }/role/list');
                                } else {
                                    console.log(data.msg)
                                    $("#myComfirmModal #myComfirmModalLabel").html("提示");
                                    $("#myComfirmModal #confirm_modal-body-id").html(data.msg);
                                    $('#myComfirmModal').modal('show');
                                }
                            },
                            error: function() {
                                console.log('系统出错请稍后再试');
                                $("#myModalLabel").html("提示");
                                $("#modal-body-id").html('系统出错请稍后再试');
                                $('#myModal').modal('show');
                            }
                        })
                    }
                })


        }
        //     });
        // }
    }