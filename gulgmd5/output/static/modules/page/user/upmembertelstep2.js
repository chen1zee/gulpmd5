define('page/user/upmembertelstep2', function(require, exports, module){ require("common");
require("jquery.form.min");

$(function () {

    baseJS.App.initPage('绑定手机', 0, 1, 0, '', 1, 0, '');

    $("#btn_getCode").click(function () {
        var serverUrl = server + "/member/registerphone.smg";
        var telphone = $("#phoneNumber").val();
        if (telphone == "") {
            alert("请先输入手机号");
            return;
        }
        $.post(serverUrl, {telphone: telphone, change: 1}, function (data) {
            if (data.status == 'success') {
                alert("验证码已发送");
            } else if (data.status == 'fail') {
                $(".showerror").text(data.message);
                $(".showerror").css("display", "block");
            } else {
                $(".showerror").text("服务器繁忙,请稍后重试");
                $(".showerror").css("display", "block");
            }
        });
    });

    $("form").submit(function (e) {
        var serverUrl = server + "/member/updatephone.smg";
        var data = $("form").serialize();
        $.post(serverUrl, data, function (data) {
            if (data.status == "success") {
                alert("手机号更换成功");
                window.location = "/wap/user/memberdetail.html";
            } else if (data.status == 'fail') {
                $(".showerror").text(data.message);
                $(".showerror").css("display", "block");
            } else {
                $(".showerror").text("服务器繁忙,请稍后重试");
                $(".showerror").css("display", "block");
            }
        });
        return false;
    });
});

 
});