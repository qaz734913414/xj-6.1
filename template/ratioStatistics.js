

    $(function(){
      getMessage3();
      $(".mydate input").datetimepicker({
          format: 'yyyy-mm-dd hh:ii',
          language: 'zh-CN',
          autoclose: true,
          inputMask: true
      });
    })


    function getMessage3() {
        var start = $("#startDate").val();
        var end = $("#endDate").val();
        var type = $("#timestatus").find("option:selected").val();
        getTable3(start, end, type);
    }

    function getTable3(start, end, type) {
        $("#proportion").bootstrapTable('destroy');
        $("#proportion").bootstrapTable({
            method: "post",
            url: pathurl + "syslog/proportioncount?startDate=" + start + "&endDate=" + end + "&dateType=" + type,
            pagination: true,
            contentType: "application/x-www-form-urlencoded",
            queryParamsType: " limit",
            paginationDetailHAlign: "left",
            //paginationPreText : "上一页",
            //paginationNextText : "下一页",
            searchOnEnterKey: true,
            buttonsClass: "face",
            showExport: true, //是否显示导出
            responseHandler:function(data){//远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                                            //在ajax后我们可以在这里进行一些事件的处理
              var dataObj=data.result;
              return dataObj;
            },
        });
    }
    function reset3() {
        $(".face-form input").val("");
        $(".face-form select").val("-1");
        getMessage3();
    }
