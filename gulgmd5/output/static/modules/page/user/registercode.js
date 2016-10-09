define('page/user/registercode', function(require, exports, module){ 
require("common");

$(function() {
	baseJS.App.initPage('验证码', 0, 1, 0, '', 1, 0, '');
	/*请输入验证码*/
	window.registerCode=function(){
		var serverUrl=server+"/member/registercode.smg";
		//$(".btn_submit").click(function(){
			var code=$("#id_tel").val().trim();
			if(code==""){
				alert("验证码不能为空");
				$("#id_tel").focus();
				return;
			}
			var data=$("form").serialize();
			$.post(serverUrl,data,function(data){
				if(data.status=='success'){
					window.location='/wap/user/registerpassword.html';
				}else if(data.status=='fail'){
					alert(data.message);
				}else{
					alert("服务器繁忙,请稍后重试");
				}

			});
	 //  });
	};


});

 
});