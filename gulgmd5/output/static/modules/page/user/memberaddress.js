define('page/user/memberaddress', function(require, exports, module){ 
require("common");
require("jquery.form.min");
way=require("way.min");

function del(obj){
	if(window.confirm('你确定要删除该地址吗？')){
		var serverUrl=server+"/member/deleteaddress.smg";
		var id=$(obj).find("input").val();
		$.post(serverUrl,{id:id}, function (data) {
			if(data.status=='success'){
				location.reload();
			}else if(data.status=='fail'){
				alert(data.message);
			}else{
				alert("服务器繁忙,请稍后重试");
			}
		});
		return true;
	}else{
		return false;
	}
}

$(function () {
	baseJS.App.initPage('添加收货地址', 0, 1, 0, '', 1, 0, '');

	var serverUrl=server+"/common/getdisplayaddress.smg";
	$.post(serverUrl, function (data) {
		if(data.status=='success'){
		   var data=data.data;
			way.set("addresslist",data);
		}else if(data.status=='fail'){
			alert(data.message);
		}else{
			alert("服务器繁忙,请稍后重试");
		}
	});

	$(".addreditmenu").click(function () {
		var id=$(this).find("input").val();
		alert(id)
	});
}); 
});