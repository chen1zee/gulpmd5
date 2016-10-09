define('page/user/updatemembername', function(require, exports, module){ 
require("common");
require("jquery.form.min");

$(function(){

	baseJS.App.initPage('修改用户名', 0, 1, 0, '', 1, 0, '');

   $("form").submit(function(e){
	   var serverUrl=server+"/member/changename.smg";
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