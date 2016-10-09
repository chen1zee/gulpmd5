define('page/user/memberinfo', function(require, exports, module){ 
require("common");
//require("jquery.form.min");
way=require("way.min");

$(function(){
	
//	baseJS.App.initPage('个人信息', 0, 1, 0, '', 1, 0, '');

	$(".nav_header img").attr("src","/static/img/user/userinfo.jpg");
	var serverUrl=server+"/member/memberinfo.smg";
	$.post(serverUrl,function(data){
		if(data.status=='success'){
		  way.set("member",data.data);
		}else if(data.status=='unlogin'){
			gotoLogin();
		}else if(data.status=='fail'){
			alert("服务器繁忙,请稍后重试");
		}
	});
});

 
});