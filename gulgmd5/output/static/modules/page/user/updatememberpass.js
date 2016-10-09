define('page/user/updatememberpass', function(require, exports, module){ 
require("common");
require("jquery.form.min");

$(function(){

	baseJS.App.initPage('修改密码', 0, 1, 0, '', 1, 0, '');

	$("form").submit(function(e){
	   var pass1= $("input[name='newpass']").val();
	   var pass2=$("input[name='newpass2']").val();
		if(pass1!=pass2){
		   $(".showerror").text("密码前后不一致");
			$(".showerror").css("display","block");
			return false;
		}
		var serverUrl=server+"/member/changepass.smg";
		var data=$("form").serialize();
		$.post(serverUrl,data,function(data){
			if(data.status=="success"){
				alert("修改成功");
				history.back();
			}else if(data.status=="fail"){
				$(".showerror").text(data.message);
				$(".showerror").css("display","block");
			}else{
				$(".showerror").text("服务器繁忙,请稍后重试");
				$(".showerror").css("display","block");
			}
		});
		return false;
	});
});
 
});