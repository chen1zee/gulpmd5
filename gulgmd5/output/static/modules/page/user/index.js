define('page/user/index', function(require, exports, module){ require("common");
way=require("way.min");
window.baidu = require("baiduTemplate");
window.payPassword_tp = baidu.template("payPassword_tp");

$(function() {
	baseJS.App.initPage('个人中心', 0, 3, 0, '', 1, 0, '');
	uerInfo();
	passwordSetStatus();
	//
	$(".nav_header img").attr("src","/static/img/user/userinfo.jpg");
	var serverUrl=server+"/member/memberinfo.smg";
	$.post(serverUrl,function(data){
		if(data.status=='success'){
		  way.set("member",data.data);
		}else if(data.status=='unlogin'){
			gotoLogin();
		}else if(data.status=='fail'){
			showMsg(data.message);
		}else{
			showMsg("服务器繁忙,请稍后重试");
		}
	});

});

// 设置密码后回调
window.passwordSetCallback = function() {
	passwordSetStatus();
};

// 密码设置状态
window.passwordSetStatus = function(){
/*
	baseJS.util.doRequest('', server + '/paypassword/checkHavePayPassword.cf', {}, function(backData) {
		$("#payPassword").html(payPassword_tp(backData));
	});
*/
};

/**
 * 加载用户信息
 */

var uerInfo = function() {
/*
	baseJS.util.doRequest('', server + '/profile/userData.cf', {}, function(backData) {
		setTimeout(function() {
			localStorage.setItem("userphone",backData.data.userPhone);
			$("#userPhone").append(backData.data.userPhone.replace(/^(\d{3})\d{4}(\d{4})$/g, '$1****$2'));//号码中间4位*隐藏
			$("#userMoney").append(toMoney(backData.data.userMoney));

			if (parseInt(backData.data.cartItemNum) > 0)
				$("#cartItemNum").html(backData.data.cartItemNum).addClass('new_notice');

			if (parseInt(backData.data.orderNum) > 0)
				$("#dealOrderNum").html(backData.data.orderNum).addClass('new_notice');
		}, 100);

	});
*/
}; 
});