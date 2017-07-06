$(function () {
    $.ajax({
        type: 'post',
        url: pathurl+'servicestatus/mysqlstatus',
        cache: false,
        success: function(data) {
            var item=data.rows,str='';

                str='<tr> <td>'+item.id+'</td> <td>'+item.sername+'</td><td>'+item.ip+'</td><td>'+item.port+'</td><td>'+item.username+'</td><td>'+item.pwd+'</td><td>'+item.status+'</td> </tr>'

            $('#servicebody').append(str)
        },

        error: function() {
            console.error("ajax error");
        }

    });
})

