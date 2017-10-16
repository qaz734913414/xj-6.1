$(function () {
    setTimeout(function () {
        $('#userdiv .fixed-table-container').css('height', 'auto');
        $('#userdiv .fixed-table-container').css('padding-bottom', '0px');
    }, 200)

});

$(window).resize(function () {
    console.log(1111)
    $('#userdiv .fixed-table-container').css('height', 'auto');
    $('#userdiv .fixed-table-container').css('padding-bottom', '0px');
});


var zTree;
var selectNode;
var load = false;
var setting = {
    async: {
        enable: true,
        dataType: "json",
        type: "post",
        url: pathurl + 'department/queryAll', //请求节点生成的servlet
        autoParam: ["id"]
        //每次异步加载传给服务器的参数
    },
    view: {
        dblClickExpand: true,
        selectedMulti: false,
        // addHoverDom : addHoverDom, //添加按钮
        // removeHoverDom : removeHoverDom
    },
    edit: {
        // enable : true, //编辑节点必须设置该字段，并且编辑状态包括修改和删除，所以如果设置true
        // editNameSelectAll : true, //删除按钮和修改按钮都会出现，添加按钮需要自己额外添加
        // showRenameBtn : true, //如果只要删除功能，所以修改按钮设置为false,默认值为true
        // showRemoveBtn : showRemoveBtn, //选做，可以删除这一行
        // 高级用法就是为showRemoveBtn 设置函数，函数体内判断节点来为某一些节点禁用删除按钮,比如这里禁止删除跟节点。
    },
    data: {
        key: {
            name: "nodeName" // 取后台传过来的json数据中 nodeName 字段值作为节点名称
        },
        simpleData: {
            enable: true,
            idKey: "id", //节点的id,注意此处要对应你后台传过来的节点的属性名id
            pIdKey: "pId", //节点的pId,注意此处要对应你后台传过来的节点的属性名pId
            rootPId: 0
            //根节点的pId = 0
        }
    },
    callback: {
        beforeRemove: beforeRemove, //删除前的回调函数
        beforeRename: beforeRename, //修改前的回调函数
        		// beforeClick : beforeClick,
        		// 	onRename : onRename,
        		// 	onRemove : onRemove,
        onClick: onClick, //点击事件
        onAsyncSuccess: zTreeOnAsyncSuccess
        //异步加载完毕的回调函数
    }
};

$(function () {
    zTree = $.fn.zTree.init($("#treeDemo"), setting);
    // $("#treeDemo").css("height", $(document).height() - 320);
    getTable();
    $(".face-table-group button[title='Export data']").removeClass(
        "btn-default");
    $(".face-table-group button[title='Export data']").addClass(
        "face-button");
});

// 新增修改组织机构初始化下拉框
function xiala() {
    $.ajax({
        type: 'POST',
        url: pathurl + 'department/initDeptList',

        success: function (data) {
            var data = data.list, len = data.length, str = '';
            for (var i = 0; i < len; i++) {
                str += ' <option value=' + data[i].did + '>' + data[i].dname + '</option>'

            }
            ;

            $('#modifyInfoModal #dPId').append(str);
            $('#deptInfoModal #dPId').append(str)

        },
        error: function () {
            $("#modal-body-text").text("删除失败!");
            $("#myModalLabel").modal();
        }
    });
}
xiala();

function onClick(event, treeId, treeNode) {
    var url, code = $('#u_depart').val(),
        cName = $('#u_name').val();

    if (treeNode.isParent && treeNode.id != 1) {
        url = pathurl + 'department/listAll?dId=' + treeNode.id + '&code=' + code + '&cName=' + cName;
    } else if (treeNode.isParent && treeNode.id == 1) {
        url = pathurl + 'department/listAll?code=' + code + '&cName=' + cName;
    } else {
        url = pathurl + 'department/listAll?cId=' + treeNode.id + '&code=' + code + '&cName=' + cName;
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
        height: '', /*(document).height() - 202*/
        pageList: [10, 25, 50, 100]
        // 			showExport : true, //是否显示导出
        // 			exportDataType : "basic"//basic', 'all', 'selected'.
    });
}
function showRemoveBtn(treeId, treeNode) {
    return !treeNode.level == 0; //跟节点返回false,所以跟节点不显示删除按钮。
}

function beforeRemove(treeId, treeNode) {
    if (treeNode.pId == 0) { //如果删除的是根节点，也提示无法删除
        $("#myModal #modal-body-id").text("根节点无法删除!");
        $("#myModal").modal();
        return false; //返回false 就会使前端的节点还保持存在，
        //  如果是true,则会在前端界面删除，但数据库中还会有，刷新一下即可再次出现
    } else {
        $('#modal-body-text').text("确定删除?");
        $("#deptModel").modal();

        $("#deptModel #cancel").click(function () {
            //	zTree = $.fn.zTree.init($("#treeDemo"), setting);
            var node = treeNode.getParentNode();
            zTree.reAsyncChildNodes(node, "refresh");
        });

        $("#deptModel #continue").click(function () {
            $.ajax({
                type: 'POST',
                url: pathurl + 'department/delete?dId=' + treeNode.id,
                success: function () {
                    $("#myModal #modal-body-id").text("删除成功!");
                    $("#myModal").modal();
                    zTree.removeNode(treeNode);
                    // LoadAjaxContent('${ctx }/department/selectAll');
                },
                error: function () {
                    $("#myModal #modal-body-id").text("处理失败!");
                    $("#myModal").modal();
                    return false;
                }
            });
        });
    }
    return;
}
function beforeRename(treeId, treeNode, newName, isCancel) {
    var oldName = treeNode.nodeName; //首先取原始的节点值
    if (newName == "") { // 新名称为空的情况
        var node = treeNode.getParentNode(); //获取父节点
        zTree.reAsyncChildNodes(node, "refresh"); //重新访问数据库更新父节点，即可回到旧名称
        $("#myModal #modal-body-id").text("名称不能为空!");
        $("#myModal").modal();
    } else if (newName != oldName) { // 如果新名称与旧名称一致，什么也不做
        $.ajax({
            type: 'post',
            url: pathurl + 'department/editDepartment', //更改请求
            data: {
                dId: treeNode.id,
                dName: newName,
                dPId: treeNode.pId
            },
            cache: false,
            dataType: 'JSON',
            success: function (data) {
                var node = treeNode.getParentNode();
                zTree.reAsyncChildNodes(node, "refresh");
                $("#myModal #modal-body-id").text("修改成功!");
                $("#myModal").modal();
                $("#deptTable").bootstrapTable('refresh');
            },
            error: function (data) {
                //treeNode.nodeName = oldName;
                //zTree.updateNode(treeNode);
                var node = treeNode.getParentNode();
                zTree.reAsyncChildNodes(node, "refresh"); //回到旧名称
                $("#myModal #modal-body-id").text("修改失败，同一级下该名称已存在，请尝试修改为其它名称！");
                $("#myModal").modal();
            }
        });
    }
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) { //这个函数仅仅是为了 初始化时展开 1级菜单

    if (!load) {
        var nodes = zTree.getNodesByParam("pId", 0, null);
        $.each(nodes, function (i, n) {
            zTree.expandNode(n, true, false, true);
        });
        load = true;
    } else {
        try {
            var nodes = zTree.getNodesByParam("pId", treeNode.id, null);
            $.each(nodes, function (i, n) {
                zTree.expandNode(n, true, false, true);
            });
        } catch (e) {

        }


    }

}
$('#table input').on('input propertychange', function () {
    getTable()
})

// 	table
function getTable() {
    var code = $('#u_depart').val()||'',
        cName = $('#u_name').val()||'';
    $("#deptTable").bootstrapTable('destroy');
    $("#deptTable").bootstrapTable({
        method: "post",
        url: pathurl + 'department/listAll?code=' + code + '&cName=' + cName,
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
        '<button type="button" id="normal" data-id="button1" class="pcode updateBtn btn-sm btn face-button" style="margin-right:15px;">修改</button>',
        '<button type="button" id="normal" data-id="button2" class="pcode removeBtn btn-sm btn face-button2" style="margin-right:15px;">删除</button>']
        .join('');
}
window.operateEvents = {
    'click .removeBtn': function (e, value, row, index) {
        deleteDept(row);

    },
    'click .updateBtn': function (e, value, row, index) {
        deptEdit(row);
        //	$("#deptTable").bootstrapTable('refresh');
    }
};
function deleteDept(row) {
    $("#modal-body-text").text("确定将该机构删除吗?");
    $("#deptModel").modal();

    $("#deptModel #cancel").click(function () {
        // LoadAjaxContent('${ctx }/department/selectAll');
        $("#deptModel").modal('hide');
    });
    $("#deptModel #continue").click(function () {
        $.ajax({
            type: 'POST',
            url: pathurl + 'department/delete?dId=' + row.did,
            success: function () {
                $("#myModal #modal-body-id").text("删除成功!");
                $("#myModal").modal();
                $("#deptTable").bootstrapTable('refresh');
                load = false;
                zTree = $.fn.zTree.init($("#treeDemo"), setting);
            },
            error: function () {
                $("#myModal #modal-body-id").text("删除失败!");
                $("#myModal").modal();
            }
        });
    });
}
function deptEdit(row) {

    $("#modifyInfoModal #name").val(row.cName);
    $("#modifyInfoModal #dPId").val(row.dDid);
    $("#modifyInfoModal #code").val(row.code);
    //	alert($("#dPId").val()+"----"+row.dDid);
    $("#modifyInfoModal .modal-title").html("修改");
    $("#modifyInfoModal").modal();
    $("#modifyInfoModal #cancel").click(function () {
        $("#deptTable").bootstrapTable('refresh');
        $("#departmentForm")[0].reset();
    });
    $("#modifyInfoModal #continue").off('click');
    $("#modifyInfoModal #continue").click(function () {
        var name = $("#modifyInfoModal #name").val();
        var dpId = $("#modifyInfoModal #dPId").val();
        var code = $("#modifyInfoModal #code").val();
        var did = row.did;
        // alert("name---"+name+"---dPid---"+dpId+"---did---"+did);
        $.ajax({
            type: 'post',
            url: pathurl + 'department/editDepartment',
            data: {
                name: name,
                dpId: dpId,
                did: did,
                code: code

            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.code == 200) {
                    $("#myModalLabel").html("提示");
                    $("#myModal #modal-body-id").html(data.msg);
                    $('#myModal').modal('show');
                    // LoadAjaxContent('${ctx }/department/selectAll');
                    $("#deptTable").bootstrapTable('refresh');
                    load = false;
                    zTree = $.fn.zTree.init($("#treeDemo"), setting);
                } else {
                    $("#myModalLabel").html("提示");
                    $("#myModal #modal-body-id").html("修改失败，名称不能相同！");
                    $('#myModal').modal('show');
                }
            },
            error: function () {
                $("#myModalLabel").html("提示");
                $("#myModal #modal-body-id").html('系统出错请稍后再试');
                $('#myModal').modal('show');
            }
        });
    });
}
function addDepartment() {
    xiala();
    $("#deptInfoModal .modal-title").html("添加");
    $("#deptInfoModal").modal();
    $('#deptInfoModal #code').val('');
    $("#deptInfoModal #name").val('');
    $("#deptInfoModal #dPId").val('');
}
$("#deptInfoModal #continue").click(function (form) {
    var formData = $("#departmentForm").serialize();
    $.ajax({
        type: 'post',
        url: pathurl + 'department/addDepartment',
        data: formData,
        cache: false,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data.code == 200) {
                $("#myModalLabel").html("提示");
                $("#myModal #modal-body-id").html("添加成功");
                $('#myModal').modal('show');
                // LoadAjaxContent('${ctx }/department/selectAll');
                $("#deptTable").bootstrapTable('refresh');
                load = false;
                zTree = $.fn.zTree.init($("#treeDemo"), setting);
            } else {
                $("#myModalLabel").html("提示");
                $("#myModal #modal-body-id").html(data.msg);
                $('#myModal').modal('show');
            }
            $("#deptTable").bootstrapTable('refresh');
        },
        error: function () {
            $("#myModalLabel").html("提示");
            $("#myModal #modal-body-id").html('系统出错请稍后再试');
            $('#myModal').modal('show');
        }
    });
});
function reset() {
    $('#u_depart').val(''),
    $('#u_name').val('');
    getTable();
}
