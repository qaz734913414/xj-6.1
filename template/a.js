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
var zTree;
var selectNode;
var load = false;
var setting = {  //zTree设置文件
    async: {
        enable: true,
        dataType: "json",
        type: "post",
        url: pathurl+'department/queryAll', //请求节点生成的servlet
        autoParam: ["id"]
        //每次异步加载传给服务器的参数
    },
    view: {
        dblClickExpand: true,
        selectedMulti: false,
        // addHoverDom: addHoverDom, //ZTree添加按钮
        // removeHoverDom: removeHoverDom //ZTree删除按钮
    },
    edit: {
        // enable: true, //编辑节点必须设置该字段，并且编辑状态包括修改和删除，所以如果设置true
        // editNameSelectAll: true, //删除按钮和修改按钮都会出现，添加按钮需要自己额外添加
        // showRenameBtn: true, //如果只要删除功能，所以修改按钮设置为false,默认值为true
        // showRemoveBtn: showRemoveBtn, //选做，可以删除这一行
        //高级用法就是为showRemoveBtn 设置函数，函数体内判断节点来为某一些节点禁用删除按钮,比如这里禁止删除跟节点。
    },
    data: {
        key: {
            name: "nodeName" // 取后台传过来的json数据中 nodeName 字段值作为节点名称
        },
        simpleData: {
            enable: true,
            idKey: "did", //节点的id,注意此处要对应你后台传过来的节点的属性名id
            pIdKey: "dDid", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId
            rootPId: 0
            //根节点的pId = 0
        }
    },
    callback: {
        beforeRemove: beforeRemove, //删除前的回调函数
        beforeRename: beforeRename, //修改前的回调函数
        //		beforeClick : beforeClick,
        // 			onRename : onRename,
        // 			onRemove : onRemove,
        onClick: onClick, //点击事件
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
};

$(function() {
    zTree = $.fn.zTree.init($("#treeDemo"), setting);    //生成ZTree
    $("#treeDemo").css("height", $(document).height() - 320);
    getTable();                                       //生成表格
    $(".face-table-group button[title='Export data']").removeClass(
        "btn-default");
    $(".face-table-group button[title='Export data']").addClass(
        "face-button");
});

//	function beforeClick(treeId, treeNode, clickFlag) {
// 			if(treeNode.isParent){
// 			$('.zTree li a ').css("cursor","pointer");
// 			$('.zTree li a span').css("cursor","pointer");
// 			}else{
// 			$('.zTree li a').css("cursor","default");
// 			$('.zTree li a span').css("cursor","default");
// 			}
//		return (!treeNode.isParent); //不能点击父节点
//	};
function onClick(event, treeId, treeNode) {       //点击ZTree触发Fn
    var url;
    if (treeNode.isParent && treeNode.id != 1) {
        url = pathurl+'department/listAll?dId=' + treeNode.id;
    } else if (treeNode.isParent && treeNode.id == 1) {
        url = pathurl+'department/listAll';
    } else {
        url = pathurl+'department/listAll?cId=' + treeNode.id;
    }
    $("#deptTable").bootstrapTable('destroy');
    $("#deptTable").bootstrapTable({
        method: "post",
        url: url,
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        buttonsClass: "face",
        height: $(document).height() - 202
        // 			showExport : true, //是否显示导出
        // 			exportDataType : "basic"//basic', 'all', 'selected'.
    });
}

// function showRemoveBtn(treeId, treeNode) {
//     return !treeNode.level == 0; //跟节点返回false,所以跟节点不显示删除按钮。
// }

function beforeRemove(treeId, treeNode) {       //Ztree删除的回调
    if (treeNode.pId == 0) { //如果删除的是根节点，也提示无法删除
        $("#modal-body-text").text("根节点无法删除!");
        $("#myModalLabel").modal();
        return false; //返回false 就会使前端的节点还保持存在，
        //  如果是true,则会在前端界面删除，但数据库中还会有，刷新一下即可再次出现
    } else {
        $('#modal-body-text').text("确定删除?");
        $("#deptModel").modal();

        $("#deptModel #cancel").click(function() {
            //	zTree = $.fn.zTree.init($("#treeDemo"), setting);
            var node = treeNode.getParentNode();
            zTree.reAsyncChildNodes(node, "refresh");
            $("#deptTable").bootstrapTable('refresh');
        });

        $("#deptModel #continue").click(function() {
            $.ajax({
                type: 'POST',
                url: pathurl+'department/delete',
                data:{
                  dId:treeNode.id
                },
                success: function() {
                    $("#modal-body-text").text("删除成功!");
                    $("#deptModel").modal();
                    zTree.removeNode(treeNode);
                    var node = treeNode.getParentNode();
                    zTree.reAsyncChildNodes(node, "refresh");
                    $("#deptTable").bootstrapTable('refresh');
                    // LoadAjaxContent('http://192.168.0.239:8080/FaceManage/department/initDeptList');
                },
                error: function() {
                    $("#modal-body-text").text("处理失败!");
                    $("#deptModel").modal();
                    return false;
                }
            });
        });
    }
    return;
}

function beforeRename(treeId, treeNode, newName, isCancel) {   //ZTree修改的回调
    var oldName = treeNode.nodeName; //首先取原始的节点值
    if (newName == "") { // 新名称为空的情况
        var node = treeNode.getParentNode(); //获取父节点
        zTree.reAsyncChildNodes(node, "refresh"); //重新访问数据库更新父节点，即可回到旧名称
        $("#modal-body-text").text("名称不能为空!");
        $("#myModalLabel").modal();
    } else if (newName != oldName) { // 如果新名称与旧名称一致，什么也不做
        $.ajax({
            type: 'post',
            url: pathurl+'department/editDepartment', //更改请求
            data: {
                did: treeNode.id,
                name: newName,
                dpId: treeNode.pId
            },
            cache: false,
            dataType: 'JSON',
            success: function(data) {
                var node = treeNode.getParentNode();
                zTree.reAsyncChildNodes(node, "refresh");
                if(data.code==200){
                  $("#modal-body-text").text(data.msg);
                  $("#deptModel").modal();
                  var node = treeNode.getParentNode();
                  zTree.reAsyncChildNodes(node, "refresh");
                  $("#deptTable").bootstrapTable('refresh');
                }else if(data.code==-1){
                  $("#modal-body-text").text(data.msg);
                  $("#deptModel").modal();
                  var node = treeNode.getParentNode();
                  zTree.reAsyncChildNodes(node, "refresh");
                  $("#deptTable").bootstrapTable('refresh');
                }

            },
            error: function(data) {
                //treeNode.nodeName = oldName;
                //zTree.updateNode(treeNode);
                var node = treeNode.getParentNode();
                zTree.reAsyncChildNodes(node, "refresh");
                $("#deptTable").bootstrapTable('refresh'); //回到旧名称

                $("#modal-body-text").text('出错');
                $("#deptModel").modal();
            }
        });
    }
}
//
// function addHoverDom(treeId, treeNode) {
//   // console.log(treeId)
//   // console.log(treeNode)
//     var sObj = $("#" + treeNode.tId + "_span"); //获取删除修改span
//     if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
//         return;
//     var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
//         "' title='add node' onfocus='this.blur();'></span>"; //添加add  span
//     sObj.after(addStr); // 把删除修改 span 放到 add 后面
//     var btn = $("#addBtn_" + treeNode.tId);
//     if (btn)
//         btn.bind("click", function() {
//             var nodes = zTree.addNodes(treeNode, {
//                 pId: treeNode.id,
//                 nodeName: "新建"
//             }); //前端添加成功
//             // console.log(nodes)
//             var formData=$("#departmentForm").serialize();
//
//             $.ajax({ //后端添加！！！！   必须有，要不数据库还是没添加，否则刷新页面后节点就会消失！
//                     url: pathurl+'department/addDepartment',
//                     data:formData, //传给后台当前节点的父Id和名称
//                     cache: false,
//                     type: 'post',
//                     dataType: 'JSON',
//                     success: function(data) {
//                         console.log(data);
//                         if (data.code == 200) {
//                             $("#modal-body-text").html("添加成功");
//                             $('#deptModel').modal('show');
//                             var node = treeNode.getParentNode();
//                             zTree.reAsyncChildNodes(node, "refresh");
//                             $("#deptTable").bootstrapTable('refresh');
//                         } else {
//                             $("#modal-body-text").text(
//                                 "添加失败，同一级下该名称已存在，请尝试修改为其它名称！");
//                             $('#deptModel').modal('show');
//                             zTree.updateNode(nodes[0]); //如果失败，则返回原始状态！
//                             var node = treeNode.getParentNode();
//                             zTree.reAsyncChildNodes(node, "refresh");
//                         }
//                     },
//                     error: function() {
//                         $("#modal-body-text").text(
//                             "添加失败，同一级下该名称已存在，请尝试修改为其它名称！");
//                         $('#deptModel').modal('show');
//                         zTree.updateNode(nodes[0]); //如果失败，则返回原始状态！
//                         var node = treeNode.getParentNode();
//                         zTree.reAsyncChildNodes(node, "refresh");
//                     }
//                 });
//             return false;
//         });
// };
//
// function removeHoverDom(treeId, treeNode) { // 去除
//   // console.log(treeNode)
//     $("#addBtn_" + treeNode.tId).unbind().remove();
// };

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) { //这个函数仅仅是为了 初始化时展开 1级菜单
    // console.log(treeId)
    // console.log(treeNode)
    // console.log(msg)
    if (!load) {
        var nodes = zTree.getNodesByParam("pId", 0, null);
        $.each(nodes, function(i, n) {
            zTree.expandNode(n, true, false, true);
        });
        load = true;
    } else {
      console.log(treeNode.id)
        var nodes = zTree.getNodesByParam("pId", treeNode.id, null);
        $.each(nodes, function(i, n) {
            zTree.expandNode(n, true, false, true);
        });
    }

}
// 新增修改初始化下拉框

$.ajax({
    type: 'POST',
    url: pathurl+'department/initDeptList',
    success: function(data) {
        var data=data.list, len=data.length,str='';
        for (var i = 0; i <len; i++) {
            str+=' <option value=' + data[i].did +'>'+data[i].dname+'</option>'

        };
        $('#dPId').append(str)

    },
    error: function() {
        $("#modal-body-text").text("删除失败!");
        $("#myModalLabel").modal();
    }
});
// 	table
function getTable() {
    $("#deptTable").bootstrapTable('destroy');
    $("#deptTable").bootstrapTable({
        method: "post",
        url: pathurl+'department/listAll',
        pagination: true,
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: " limit",
        paginationDetailHAlign: "left",
        searchOnEnterKey: true,
        buttonsClass: "face",

        height: $(document).height() - 202
        // 			showExport : true, //是否显示导出
        // 			exportDataType : "basic"//basic', 'all', 'selected'.
    });
}

function operateFormatter(value, row, index) {
    return [
            '<button type="button" id="normal" class="updateBtn btn-sm btn face-button" style="margin-right:15px;">修改</button>',
            '<button type="button" id="normal" class="removeBtn btn-sm btn face-button2" style="margin-right:15px;">删除</button>'
        ]
        .join('');
}
window.operateEvents = {
    'click .removeBtn': function(e, value, row, index) {
        deleteDept(row);
        $("#deptTable").bootstrapTable('refresh');
    },
    'click .updateBtn': function(e, value, row, index) {
        deptEdit(row);
        //	$("#deptTable").bootstrapTable('refresh');
    }
};

function deleteDept(row) {     //点击删除按钮方法
    $("#modal-body-text").text("确定将该机构删除吗?");
    $("#deptModel").modal();

    $("#deptModel #cancel").click(function() {
        // LoadAjaxContent(pathurl+'department/initDeptList');

        $("#deptModel").modal('hide');
    });
    $("#deptModel #continue").click(function() {
        $.ajax({
            type: 'POST',
            url: pathurl+'department/delete?dId=' + row.did,
            success: function() {
                $("#modal-body-text").text("删除成功!");
                $("#myModalLabel").modal();
                // LoadAjaxContent(pathurl+'department/initDeptList');
                $("#deptTable").bootstrapTable('refresh');
            },
            error: function() {
                $("#modal-body-text").text("删除失败!");
                $("#myModalLabel").modal();
            }
        });
    });
}

function deptEdit(row) {
  // row.dDidconsole.log(row.dDid)
    $("#name").val(row.cName);
    $("#dPId").val(row.dDid);
    //	alert($("#dPId").val()+"----"+row.dDid);
    $("#modifyInfoModal .modal-title").html("修改");
    $("#modifyInfoModal").modal();
    $("#modifyInfoModal #cancel").click(function() {
        $("#deptTable").bootstrapTable('refresh');
        $("#departmentForm")[0].reset();
    });

    $("#modifyInfoModal #continue").click(function() {    //添加按钮
        var name = $("#name").val();
        var dpId = $("#dPId").val();
        var did = row.did;
        $.ajax({
            type: 'post',
            url: pathurl+'department/initDeptList',
            data: {
                name: name,
                dpId: dpId,
                did: did
            },
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    $("#myModalLabelLabel").html("提示");
                    $("#modal-body-text").html(data.msg);
                    $('#myModalLabel').modal('show');
                    $("#deptTable").bootstrapTable('refresh');
                    // LoadAjaxContent(pathurl+'department/initDeptList');
                } else {
                    $("#myModalLabelLabel").html("提示");
                    $("#modal-body-text").html("修改失败，名称不能相同！");
                    $('#myModalLabel').modal('show');
                }
            },
            error: function() {
                $("#myModalLabelLabel").html("提示");
                $("#modal-body-text").html('系统出错请稍后再试');
                $('#myModalLabel').modal('show');
            }
        });
    });
}

function addDepartment() {
    $("#deptInfoModal .modal-title").html("添加");
    $("#deptInfoModal").modal();
    $("#deptInfoModal #continue").click(function(form) {
        var formData = $("#departmentForm").serialize();    //添加或修改按钮  点击后获取的form表单
        console.log(formData);
        $.ajax({
            type: 'post',
            url: pathurl+'department/addDepartment',
            data: formData,
            cache: false,
            dataType: 'json',
            success: function(data) {
              console.log(data)
                if (data.code == 200) {
                    $("#myModalLabelLabel").html("提示");
                    $("#modal-body-text").html("添加成功");
                    $('#deptModel').modal('show');
                    $("#deptTable").bootstrapTable('refresh');
                    // LoadAjaxContent(pathurl+'department/selectAll');
                } else {
                    $("#myModalLabelLabel").html("提示");
                    $("#modal-body-text").html(data.msg);
                    $('#deptModel').modal('show');
                }
            },
            error: function() {
                $("#myModalLabelLabel").html("提示");
                $("#modal-body-text").html('系统出错请稍后再试');
                $('#myModalLabel').modal('show');
            }
        });
    });
}
