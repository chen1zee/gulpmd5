define('page/user/login', function(require, exports, module){ require("common");

$(function () {
    baseJS.App.initPage('登录', 0, 1, 0, '', 1, 0, '');
    bindBtn();
});

var bindBtn = function () {

    //切换用户名登录显示
    $('.login_method').delegate('.name-login', 'click', function () {
        $(".name-login").addClass("login_method-active");
        $(".phone-login").removeClass("login_method-active");
        $("#name_login_form").css({display: 'block'});
        $("#phone_login_form").css({display: 'none'});
    });

    //切换手机号登录显示
    $('.login_method').delegate('.phone-login', 'click', function () {
        $(".phone-login").addClass("login_method-active");
        $(".name-login").removeClass("login_method-active");
        $("#phone_login_form").css({display: 'block'});
        $("#name_login_form").css({display: 'none'});
    });

    //验证码
    $('#phone_login_form').delegate('#btn_getCode', 'click', function () {
        var serverUrl = server + "/member/registerphone.smg";
        var phone = $("#phoneNumber").val().trim();
        if (phone == "") {
            showMsg("手机号不能为空");
            $("#phoneNumber").focus();
            return;
        }
        baseJS.util.doRequest('', serverUrl, {telphone: phone, type: 0}, function (backData) {
            if (backData.status == 'fail') {
                showMsg(backData.message);
            } else if (backData.status == 'success') {
                showMsg("验证码已发送");
            }
        });

    });

    //账号登录
    $('#name_login_form').delegate('#loginByName', 'click', function () {

        var username = $("#userName").val().trim();
        var password = $("#password").val().trim();
        if (username == "") {
            showMsg("用户名不能为空");
            $("#userName").focus();
            return;
        }
        if (password == "") {
            showMsg("密码不能为空");
            $("#password").focus();
            return;
        }
        var param = $("#name_login_form").serialize();
        var serverUrl = server + "/member/loginbyname.smg";

        baseJS.util.doPost(serverUrl, param, function (backData) {
            if (backData.status == 'success') {
                //window.location='/wap/user/memberinfo.html';
                window.location = '/wap/user/index.html';
            } else if (backData.status == 'fail') {
                showMsg(backData.message);
            } else {
                showMsg("服务器繁忙,请稍后重试");
            }
        });

    });

    //手机登录
    $('#name_login_form').delegate('#loginByPhone', 'click', function () {
        var phone = $("#phoneNumber").val().trim();
        var code = $("#verifyCode").val().trim();
        if (phone == "") {
            showMsg("手机号不能为空");
            $("#phoneNumber").focus();
            return;
        }
        if (code == "") {
            showMsg("验证码不能为空");
            $("#verifyCode").focus();
            return;
        }
        var data = $("#phone_login_form").serialize();
        var serverUrl = server + "/member/loginbyphone.smg";
        //$.post(serverUrl,data,function(data){
        baseJS.util.doPost(serverUrl, data, function (backData) {
            if (backData.status == 'success') {
                //window.location='/wap/user/memberinfo.html';
                window.location = '/wap/user/index.html';
            } else if (backData.status == 'fail') {
                showMsg(backData.message);
            } else {
                showMsg("服务器繁忙,请稍后重试");
            }
        });

    });
};
 
});