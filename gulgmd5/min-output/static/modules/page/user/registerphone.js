define("page/user/registerphone",function(e,s,t){e("common"),$(function(){baseJS.App.initPage("会员注册",0,1,0,"",1,0,""),i(),$("input[type='checkbox']").change(function(){var e=$(this).prop("checked");1==e?$(".btn_submit").attr("disabled",!1):$(".btn_submit").attr("disabled",!0)})});var i=function(){$(".common_white_color").delegate(".btn_getcode","click",function(){var e=$("input[name='telphone']").val();baseJS.util.doPost(server+"/member/registerphone.smg",{telphone:e},function(e){"success"==e.status?showMsg("验证码已发送"):"fail"==e.status?showMsg(e.message):showMsg("服务器繁忙,请稍后重试")})}),$("#registermember").delegate(".btn_submit","click",function(){var e=$("#registermember").serialize();baseJS.util.doPost(server+"/member/registermember.smg",e,function(e){"success"==e.status?window.location="/wap/user/memberinfo.html":"fail"==e.status?showMsg(e.message):showMsg("服务器繁忙,请稍后重试")})})}});