define('page/user/registerphone', function(require, exports, module){ require("common");

$(function () {

    baseJS.App.initPage('会员注册', 0, 1, 0, '', 1, 0, '');

    bindBtn();

    $("input[type='checkbox']").change(function () {
        var check = $(this).prop("checked");
        if (check == true) {
            $(".btn_submit").attr("disabled", false);
        } else {
            $(".btn_submit").attr("disabled", true);
        }
    });

});


var bindBtn = function () {

    //获取验证码
    $('.common_white_color').delegate('.btn_getcode', 'click', function () {

        var telphone = $("input[name='telphone']").val();
        baseJS.util.doPost(server + "/member/registerphone.smg", {telphone: telphone}, function (backData) {
            if (backData.status == 'success') {
                showMsg("验证码已发送");
            } else if (backData.status == 'fail') {
                showMsg(backData.message);
            } else {
                showMsg("服务器繁忙,请稍后重试");
            }
        });

    });

    //确认
    $('#registermember').delegate('.btn_submit', 'click', function () {

        var param = $("#registermember").serialize();
        baseJS.util.doPost(server + "/member/registermember.smg", param, function (backData) {
            if (backData.status == 'success') {
                window.location = '/wap/user/memberinfo.html';
            } else if (backData.status == 'fail') {
                showMsg(backData.message);
            } else {
                showMsg("服务器繁忙,请稍后重试");
            }

        });
    });

};
 
});