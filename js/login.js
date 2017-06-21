jQuery.support.cors = true;
var pathurl = 'http://192.168.0.169:8080/FaceManage/';


$(function () {

    localStorage.setItem('username', '');
    localStorage.setItem('token', '');

    if (!!$.cookie('username') && !!$.cookie('password')) {
        $('#username').val($.cookie('username'));
        $('#password').val(Base64.decode($.cookie('password')));
        $('#remember').prop('checked', true);
    } else {
        $('#username').val('');
        $('#password').val('');
        $('#remember').prop('checked', false);
    }


    function browserRedirect() {    //判断是pc端还是移动端
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (!(bIsIpad || bIsMidp || bIsIphoneOs || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            console.log('PC端')
            return '0';
        } else {
            console.log('移动端')
            return '1';
        }
    }

    // browserRedirect();
    var deviceType = browserRedirect();

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $('button').click(function (e) {

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

                var formData = $("#userLoginForm").serializeObject();

                formData.password = md5(formData.password).toUpperCase();//Base64.encode(formData.password);//md5(formData.password);
                formData.devicetype = deviceType;
                // console.log(formData.serializeArray())
                jQuery("form").serialize(); //"username=&password="
                jQuery("form").serializeArray(); //[{name:"username",value:""},{name:"password",value:""}]
                jQuery("form").serializeObject(); //{username:"",password:""}
                console.log($("#userLoginForm").serializeObject());
                $.ajax({
                    type: 'post',
                    url: pathurl + 'login',
                    data: formData,
                    cache: false,
                    success: function (data) {
                        console.log(data)
                        if (data.code == 0) {
                            //    console.log(data.token);
                            // alert('登陆成功');
                            localStorage.setItem('username', data.result);
                            localStorage.setItem('token', data.token);
                            var cUsername = $('#username').val();
                            var cPassword = $('#password').val();
                            if ($('#remember').is(':checked')) {
                                //Base64.encode,Base64.decode
                                $.cookie('username', cUsername, {expires: 7});
                                $.cookie('password', Base64.encode(cPassword), {expires: 7});
                            } else {
                                $.cookie('username', '');
                                $.cookie('password', '');
                            }
                            window.location.href = "./index.html";
                        } else {
                            alert(data.msg);
                            window.location.href = "./login.html";
                        }

                    },
                    error: function () {
                        alert('系统出错');
                        return false;
                    }
                });

            }
        });
        // e.preventDefault();
    })

})
