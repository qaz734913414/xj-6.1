$('button').click(function () {

    $('#userLoginForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }

                }
            }
        },

        submitHandler: function (data) {
            var formData = $("#userLoginForm").serialize();
            $.ajax({
                type: 'post',
                url: 'http://192.168.0.169:8080/FaceManage/login',
                data: formData,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
//    console.log(data.token);
                        localStorage.setItem('token', data.token)
                        window.location.href = "index.html";
                    } else {
                        alert("用户名或密码错误");
                    }

                },
                error: function () {

                }
            });

        }
    });
})