define("page/user/updatememberpass",function(s,e,r){s("common"),s("jquery.form.min"),$(function(){baseJS.App.initPage("修改密码",0,1,0,"",1,0,""),$("form").submit(function(s){var e=$("input[name='newpass']").val(),r=$("input[name='newpass2']").val();if(e!=r)return $(".showerror").text("密码前后不一致"),$(".showerror").css("display","block"),!1;var o=server+"/member/changepass.smg",a=$("form").serialize();return $.post(o,a,function(s){"success"==s.status?(alert("修改成功"),history.back()):"fail"==s.status?($(".showerror").text(s.message),$(".showerror").css("display","block")):($(".showerror").text("服务器繁忙,请稍后重试"),$(".showerror").css("display","block"))}),!1})})});