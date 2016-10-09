define('page/user/registerpassword', function(require, exports, module){ 
require("common");
require("jquery.form.min");

$(function(){

	baseJS.App.initPage('手机注册', 0, 1, 0, '', 1, 0, '');

	var serverUrl=server+"/member/registermember.smg";
	$(".btn_submit").click(function(){
		var passwd=$("#id_tel").val().trim();
		if(passwd==""){
			alert("密码不能为空");
			$("#id_tel").focus();
			return;
		}
		var data=$("form").serialize();
		$.post(serverUrl,data,function(data){
			if(data.status=='success'){
				window.location='/wap/user/memberinfo.html';
			}else if(data.status=='fail'){
				alert(data.message);
			}else{
				alert("服务器繁忙,请稍后重试");
			}

		});
	});
});


 
});