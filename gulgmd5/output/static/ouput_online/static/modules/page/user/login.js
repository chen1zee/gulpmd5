define("page/user/login",function(e){e("common"),$(function(){baseJS.App.initPage("登录",0,1,0,"",1,0,""),o()});var o=function(){$(".login_method").delegate(".name-login","click",function(){$(".name-login").addClass("login_method-active"),$(".phone-login").removeClass("login_method-active"),$("#name_login_form").css({display:"block"}),$("#phone_login_form").css({display:"none"})}),$(".login_method").delegate(".phone-login","click",function(){$(".phone-login").addClass("login_method-active"),$(".name-login").removeClass("login_method-active"),$("#phone_login_form").css({display:"block"}),$("#name_login_form").css({display:"none"})}),$("#phone_login_form").delegate("#btn_getCode","click",function(){var e=server+"/member/registerphone.smg",o=$("#phoneNumber").val().trim();return""==o?(showMsg("手机号不能为空"),void $("#phoneNumber").focus()):void baseJS.util.doRequest("",e,{telphone:o,type:0},function(e){"fail"==e.status?showMsg(e.message):"success"==e.status&&showMsg("验证码已发送")})}),$("#name_login_form").delegate("#loginByName","click",function(){var e=$("#userName").val().trim(),o=$("#password").val().trim();if(""==e)return showMsg("用户名不能为空"),void $("#userName").focus();if(""==o)return showMsg("密码不能为空"),void $("#password").focus();var s=$("#name_login_form").serialize(),n=server+"/member/loginbyname.smg";baseJS.util.doPost(n,s,function(e){"success"==e.status?window.location="/wap/user/index.html":showMsg("fail"==e.status?e.message:"服务器繁忙,请稍后重试")})}),$("#name_login_form").delegate("#loginByPhone","click",function(){var e=$("#phoneNumber").val().trim(),o=$("#verifyCode").val().trim();if(""==e)return showMsg("手机号不能为空"),void $("#phoneNumber").focus();if(""==o)return showMsg("验证码不能为空"),void $("#verifyCode").focus();var s=$("#phone_login_form").serialize(),n=server+"/member/loginbyphone.smg";baseJS.util.doPost(n,s,function(e){"success"==e.status?window.location="/wap/user/index.html":showMsg("fail"==e.status?e.message:"服务器繁忙,请稍后重试")})})}});