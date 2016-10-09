define('page/user/upmembertelstep1', function(require, exports, module){ require("common");
require("jquery.form.min");
way = require("way.min");

$(function () {
    baseJS.App.initPage('手机号', 0, 1, 0, '', 1, 0, '');
    var serverUrl = server + "/member/getphone.smg";
    $.post(serverUrl, function (data) {
        if (data.status == "success") {
            way.set("member", data.data);
        } else if (data.status == 'fail') {
            $(".showerror").text(data.message);
            $(".showerror").css("display", "block");
        } else {
            $(".showerror").text("服务器繁忙,请稍后重试");
            $(".showerror").css("display", "block");
        }
    });
    $("form").submit(function (e) {
        var serverUrl = server + "/member/checkoldphone.smg";
        var data = $("form").serialize();
        $.post(serverUrl, data, function (data) {
            if (data.status == "success") {
                window.location = "/wap/user/upmembertelstep2.html";
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