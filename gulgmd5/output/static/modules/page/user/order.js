define('page/user/order', function(require, exports, module){ 

require("common");
require("plugins/md5");
var Loadmore = require("loadmore");
var Dialog = require("dialog");
var DateUtil = require("DateUtil");


$(function() {
	baseJS.App.initPage('我的订单', 0, '', 0, '', 1, 0, '');
	init();
});

window.payPasswordSet = null;
var not_set_paycode = {};
var thisObject = {};
var topicId = 0;
var buttonObject;

window.init = function() {
	not_set_paycode = new Dialog({
		'id': '#not_set_paycode',
		'position': 'middle',
		'close_btn': '.paycode_close_btn',
		'close_callback': function() {
			if ($(".payment").hasClass('disabled'))
				$(".payment").removeClass('disabled');
		}
	});
	
	$('#choosePayWay').on('change', 'input', function() {
		if ($(this).attr('readonly')) return false;
		checkedCallback();
	});

	tabNav();
	loadMoreData1();
	loadMoreData2();
	bindBtn();

    //todo 添加APP页充值跳转操作
    if(location.hash.substr(1) == 'gopay'){
        $('.nav li:eq(1)').click();
    }
};

window.deleteCallBack = function() {};

window.paySuccessCallback = function() {
	window.location.reload(true);
};

/**
 * 我的订单
 */
window.myOrder = function() {
	baseJS.util.doRequest('', server + '/order/dealOrderNum.cf', {}, function(backData) {

		if (backData.data.paymentOrderNum !== '') {
			if (parseInt(backData.data.paymentOrderNum) > 0) {
				$("#payment").html(backData.data.paymentOrderNum);
				$("#payment").addClass("new_notice");
			} else {
				$("#payment").html("");
				$("#payment").removeClass("new_notice");
			}
		}

		if (backData.data.confirmOrderNum !== '') {
			if (parseInt(backData.data.confirmOrderNum) > 0) {
				$("#confirmReceipt").html(backData.data.confirmOrderNum);
				$("#confirmReceipt").addClass("new_notice");
			} else {
				$("#confirmReceipt").html("");
				$("#confirmReceipt").removeClass("new_notice");
			}
		}

		/* //更新待处理的退货数量
		 if (backData.data.dealReturnNum !== '') {
		 	if (parseInt(backData.data.dealReturnNum) > 0) {
		 		$("#dealReturn").html(backData.data.dealReturnNum);
		 		$("#dealReturn").addClass("new_notice");
		 	} else {
		 		$("#dealReturn").html("");
		 		$("#dealReturn").removeClass("new_notice");
		 	}
		 }*/
	});
};

window.loadOrders = function(backData) {
	myOrder(); //加载订单数量
	var appendHtml = "";
	$.each(backData, function(i, item) {
		var order = item[0],
			orderItems = item[1],
			orderItemNum = item[1].length;

		// 订单
		var orderHtml = "<li data_order_id='{0}'><div class='order_title'><p><span class='order_status {1}'>{2}</span><input class='orderId' type='hidden' value='{3}' /><input class='topicId' type='hidden' value='{4}' />订单号:<span class='orderNum'>{5}</span><br />下单时间：{6} </p></div>";

		// 处理订单项
		var orderItemHtml = "<a target='_blank' href='/app/user/order/orderItemPage.html?orderId=" + order.id + "'>";
		var imageHtml = "";
		if (orderItems.length > 0) {
			if (orderItems.length > 1) {
				$.each(orderItems, function(i, item) {
					if (i < 3) {
						imageHtml += baseJS.util.formatString("<img class='multi_product_img' src='{0}' />", item.url);
					}
				});
				orderHtml += orderItemHtml + imageHtml + "</a>";
			} else {
				orderItemHtml += "<img src='{0}' /><div class='row_list_right'><div class='product_name'>{1}</div></div></a>";
				orderHtml += baseJS.util.formatString(
					orderItemHtml, orderItems[0].url,
					orderItems[0].goodsName);
			}
		}

		orderHtml += "<div class='order_result'><p>共{7}件商品，实付：<span class='red'>￥<span class='totalMoney'>{8}</span></span>{9}</p></div></li>";

		var orderStatus = btnStatus(order);
		var statusColor = orderStatus.statusColor;
		var statusText = orderStatus.statusText; // 获取订单状态
		var btnHtml = buildBtn(orderStatus.btnStatus); // 生成订单对应的按钮

		appendHtml += baseJS.util.formatString(
			orderHtml,
			order.id,
			statusColor,
			statusText,
			order.id,
			order.topicId,
			order.orderNum,
			DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", new Date(order.orderTime)),
			orderItemNum, (toMoney(parseFloat(order.goodsPrice ) + parseFloat( order.deliveryPrice))), btnHtml);
	});
	return appendHtml;
};

/**
 * 订单按钮
 *
 * @param order
 */
window.btnStatus = function(order) {
	var statusColor = "yellow",
		statusText = " ",
		btnStatus = 0;
	switch (order.tradeStatus) {
		case -1:
        case 3:
			statusColor = "grey";
			statusText = "订单取消";
			btnStatus = -1;
			break;
		case 0:
			if (order.receiptStatus == "0" && order.deliveryStatus == "1") {
				statusText = "已发货";
				btnStatus = 3;
			} else if (order.paymentStatus == "0") {
				statusText = "待付款";
				btnStatus = 1;
			} else if (order.deliveryStatus == "0") {
				statusText = "待发货";
				btnStatus = 2;
			} else {
				statusText = "交易完成";
				btnStatus = 4;
			}
			break;
		case 1:
			statusColor = "green";
			statusText = "交易完成";
			btnStatus = 4;
			break;
	}
	return {
		statusColor: statusColor,
		statusText: statusText,
		btnStatus: btnStatus
	};
};



window.buildBtn = function(btnStatus) {
	// 动态产生按钮
	var btnHtml = "<a href='javascript:void(0);' class='{0} button'>{1}</a>";
	var btnClass = "",
		btnText = "";
	switch (btnStatus) {
		case -1:
			btnClass = "delete_order grey_button";
			btnText = "删除订单";
			break;
		case 1:
			btnClass = "payment red_button";
			btnText = "去支付";
			break;
		case 2:
			break;
		case 3:
			btnClass = "confirmReceipt red_button";
			btnText = "确认收货";
			break;
		case 4:
			btnClass = "delete_order grey_button";
			btnText = "删除订单";
			break;
	}
	return baseJS.util.formatString(btnHtml, btnClass, btnText);
};

//退货
window.btnApplicationStatus = function(returnGoods) {
	var statusColor = "yellow",
		statusText = " ",
		btnStatus = 0;
	switch (returnGoods.status) {
		case 0:
			statusColor = "green";
			statusText = "审核中";
			btnStatus = 0;
			break;
		case 1:
			statusColor = "green";
			statusText = "系统已拒绝";
			btnStatus = 1;
			break;
		case 2:
			statusColor = "green";
			statusText = "寄还商品";
			btnStatus = 2;
			break;
		case 3:
			statusColor = "green";
			statusText = "处理中";
			btnStatus = 3;
			break;
		case 4:
			statusColor = "grey";
			statusText = "已退货";
			btnStatus = 4;
			break;
        case 5:
            statusColor = "grey";
            statusText = "已退款";
            btnStatus = 4;
            break;
	}
	return {
		statusColor: statusColor,
		statusText: statusText,
		btnStatus: btnStatus
	};
};

window.btnApplication = function(btnStatus, id) {
	// 动态产生按钮
	var btnHtml = "<a target='_blank' href='/app/user/order/returnGoodsProgress.html?id=" + id + "' class='{0} button'>{1}</a>";
	var btnClass = "",
		btnText = "";
	switch (btnStatus) {
		case 0:
			btnClass = "red_button";
			btnText = "查看进度";
			break;
		case 1:
			btnClass = "red_button";
			btnText = "查看详情";
			break;
		case 2:
			btnClass = "red_button";
			btnText = "寄还商品";
			break;
		case 3:
			btnClass = "red_button";
			btnText = "查看进度";
			break;
		case 4:
			btnClass = "red_button";
			btnText = "查看详情";
			break;
	}
	return baseJS.util.formatString(btnHtml, btnClass, btnText);
};

/**
 * 加载更多数据
 */
var loadMoreArr = new Array();
var loadMoreData1 = function() {
	// 与多tab切换同顺序
	loadMoreArr[0] = new Loadmore({
		'id': 'all_order',
		'initUrl': server + '/order/orders.cf?orderType=1&pageNo={pageValue}',
		'queryCallback': orders
	}).init();
	loadMoreArr[1] = new Loadmore({
		'id': 'wait_buyer_pay_order',
		'initUrl': server + '/order/orders.cf?orderType=2&pageNo={pageValue}',
		'queryCallback': orders
	}).init();
	loadMoreArr[2] = new Loadmore({
		'id': 'wait_buyer_confirm_goods_order',
		'initUrl': server + '/order/orders.cf?orderType=3&pageNo={pageValue}',
		'queryCallback': orders
	}).init();
};

//为了实现退货时，填写寄还商品后，回退重新加载退货数据
window.loadMoreData2 = function() {
	// 与多tab切换同顺序
	loadMoreArr[3] = new Loadmore({
		'id': 'wait_buyer_return_goods',
		'initUrl': server + '/returngoods/getReturnGoods.cf?pageNo={pageValue}',
		'queryCallback': returnGoods
	}).init();

	// 对非当前活动项的加载更多事件进行锁定
	for (var i in loadMoreArr) {
		//锁 的作用是：滚动事件发生时，只加载选中的tab的数据，其他tab的数据不加载
		if (i != $('.nav li.hover').index()) {
			loadMoreArr[i].temploadlock = true;
		} else {
			loadMoreArr[i].temploadlock = false;
			loadMoreArr[i].checkStatus();
		}
	}
};


window.returnGoods = function(backData) {
	//myOrder();  //加载待处理的退货数量
	//console.info(backData);
	var appendHtml = "";
	$.each(
		backData,
		function(i, returnGoods) {

			// 订单
			var liHtml = "<li data_return_application_id='{0}'><div class='order_title'><p><span class='order_status {1}'>{2}</span><input class='orderId' type='hidden' value='{3}' />退货单号:<span class='orderNum'>{4}</span><br />申请时间：{5} </p></div>";

			// 处理订单项
			var orderItemHtml = "<a href='javascript:void(0);' class='no_arrow' >";
			var imageHtml = "";
			imageHtml += "<img src='{6}' />";
			liHtml += orderItemHtml + imageHtml + "<div class='row_list_right'><div class='product_name'>" + returnGoods.goodName + "</div></div></a>";

			liHtml += "<div class='order_result'><p>共{7}件商品，实付：<span class='red'>￥<span class='totalMoney'>{8}</span></span>{9}</p></div></li>";

			var applicationStatus = btnApplicationStatus(returnGoods);
			var statusColor = applicationStatus.statusColor;
			var statusText = applicationStatus.statusText; // 获取订单状态
			var btnHtml = btnApplication(applicationStatus.btnStatus, returnGoods.id); // 生成订单对应的按钮

			appendHtml += baseJS.util.formatString(
				liHtml,
				returnGoods.id,
				statusColor,
				statusText,
				returnGoods.returnNum,
				returnGoods.returnNum,
				DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", new Date(returnGoods.createTime)),
				returnGoods.url,
				"1", (toMoney(returnGoods.totalPrice)), btnHtml);
		});
	return appendHtml;
};

/**
 * 加载订单
 *
 * @param data
 */
window.orders =function(data) {
	return loadOrders(data);
};

window.tabNav = function() {
	$('.nav').delegate('li', 'click', function() {
		slideOrderList($(this).index());
	});

	/*
	 * @param int|string toIndex 序号|pre|next 从当前位置滑动到指定序号
	 */
	function slideOrderList(toIndex) {
		var currIndex = $('.nav li.hover').index();
		if (currIndex !== toIndex) {

			// 导航状态更改
			$('.nav li:eq(' + toIndex + ')').addClass('hover').siblings()
				.removeClass('hover');
			// 恢复要显示的项的高度
			$('.order_list ul:eq(' + toIndex + ')').css('height', 'auto')
				.siblings().css('height',
					$(window).height() - $('.nav').outerHeight());
			// 执行动画
			$('.order_list').css({
				'transform': 'translateX(' + ($('.order_list ul:eq(0)').outerWidth() * toIndex * -1) + 'px)'
			});

			// 对非当前活动项的加载更多事件进行锁定,并执行数据加载
			for (var i in loadMoreArr) {
				if (i != $('.nav li.hover').index()) {
					loadMoreArr[i].temploadlock = true;
				} else {
					loadMoreArr[i].temploadlock = false;
					loadMoreArr[i].checkStatus();
				}
			}
		}
	}
};

window.bindBtn = function() {
	$('.order_list').delegate('.delete_order', 'click', function() {
		if (confirm('是否删除订单？')) {
			var orderId = $(this).parents('li').attr('data_order_id');
			baseJS.util.doRequest('', server + '/order/deleteOrder.cf', {
				orderId: orderId
			}, function(backData) {
				if (backData.data == 'true' || backData.data == true) {
					window.location.reload();
				} else {
					alert("删除订单失败！");
				}
			});
		}
		return false;
	});

	$('.order_list').delegate('.confirmReceipt', 'click', function() {
		if (confirm('是否确认收货？')) {
			var orderId = $(this).parents('li').attr('data_order_id');
			baseJS.util.doRequest('', server + '/order/confirmReceiptAll.cf', {
				orderId: orderId
			}, function(backData) {
				if (backData.data == 'true' || backData.data == true) {
					window.location.reload();
				} else {
					alert('确认收货失败！');
				}
			});
		}
		return false;
	});
};

var confirm_action_dialog;
var orderNum = 0,
	totalMoney = 0,
	userWalletMoney = 0,
	orderId = 0,
	topicId = 0;
	
$(function() {
	// 对话框初始化和绑定
	confirm_action_dialog = new Dialog({
		'id': '#confirm_action_dialog',
		'position': 'middle',
		'close_btn': '#confirm_action_dialog_cancle_btn',
		'close_callback': function() {
			if ($(".payment").hasClass('disabled'))
				$(".payment").removeClass('disabled');
		}
	});

	//绑定确定按钮
	$('#confirm_action_dialog button.enogh').click(function() {

		// 禁用按钮，防止多次提交
		if ($(this).hasClass('disabled')) return;

		var payPassword = $("#payPassword").val();

		if (payPassword == "") {
			baseJS.App.sendToApp('flushAlert', '{"text":"请输入支付密码","position":"bottom","time":"3000"}');
			return false;
		}

		var reg = /^\d{6}$/i;
		if (!$.trim(payPassword).match(reg)) {
			baseJS.App.sendToApp('flushAlert', '{"text":"支付密码格式不正确","position":"bottom","time":"3000"}');
			return false;
		}

		var chooseWayArray = $("#choosePayWay").find("input:checked");

		if (chooseWayArray.size() == 0) {
			baseJS.App.sendToApp('flushAlert', '{"text":"请选择兑换方式","position":"bottom","time":"3000"}');
			return false;
		}

		$(this).text('支付处理中..').addClass('disabled');
		buttonObject = $(this);

		var topicIdArray = [];
		$.each(chooseWayArray, function(i, n) {
			topicIdArray.push(n.value);
		});

		var authArray = [];
		authArray.push('orderId=');
		authArray.push(orderId);
		authArray.push('&');
		authArray.push('payPassword=');
		authArray.push(hex_md5(payPassword));
		authArray.push('&topicIdArrayStr=');
		authArray.push(topicIdArray.toString());
		baseJS.App.sendToApp('encrypt', '{"data":"' + authArray.join('') + '","callback":"aesEncryptJS"}');

	});

	$('#confirm_action_dialog button.notenogh').click(function() {
        if(isNewVersion()){
            baseJS.App.sendToApp("toRecharge", "{\"callback\": \"recharge\"}", ""); // 在线充值
        }else{
            baseJS.App.sendToApp("recharge", "{\"callback\": \"recharge\"}", ""); // 卡充值
        }
	});

	$('.order_list').delegate('.payment', 'click', function() {
		// 禁用按钮，防止多次提交
		if ($(this).hasClass('disabled'))return;
		
		$(this).addClass('disabled');
		thisObject = $(this);

		orderNum = $(this).parents("li").find('.orderNum').html();
		totalMoney = $(this).parents("li").find(".totalMoney").html();
		orderId = $(this).parents("li").find('input.orderId').val();
		topicId = $(this).parents("li").find('input.topicId').val();
		userWalletMoney = 0;

		$('#order_Num').text(orderNum);
		$('#real_price').text(totalMoney);

		confirmAction(orderId, totalMoney, topicId);
		return false;
	});

});

window.checkedCallback = function() {
	var chooseWayArray = $("#choosePayWay").find("input:checked");

	var chooseMoney = 0;
	$.each(chooseWayArray, function(i, n) {
		var perMoney = n.dataset['availableMoney'];
		chooseMoney += parseFloat(perMoney);
	});
	if (chooseMoney >= totalMoney) {
		$('#confirm_action_dialog button.enogh').text('确认兑换').removeClass('disabled');
	} else {
		$('#confirm_action_dialog button.enogh').text('确认兑换').addClass('disabled');
	}
};


window.confirmAction = function(orderId, totalMoney, topicId) {
	baseJS.util.doRequest('', server + '/wallet/availableWallet.cf', {
		topicId: topicId,
		payMoney: totalMoney
	}, function(backData) {
		if (!passwordSetStatus()) {
			not_set_paycode.show();
			return false;
		}

		var availableWalletList = backData.data;
		var walletHtml = [];
		var userMoney = 0;
		for (var i = 0; i < availableWalletList.length; i++) {
			userMoney += parseFloat(availableWalletList[i].availableMoney);
			var check = availableWalletList[i].checked ? ' checked="checked" readOnly disabled="disabled" onclick="return false;"  ' : '';
			walletHtml += '<label class="pay_cards_item" ><input type="checkbox" value=' + availableWalletList[i].topicId + check + ' data-available-money=' + availableWalletList[i].availableMoney + ' />' + availableWalletList[i].industryCardName + ' 余额：￥' + availableWalletList[i].availableMoney + '</label>';
		}
		$("#choosePayWay").html(walletHtml);

		$("#payPassword").val("");

        //初始化支付弹窗内容
        var $confirm_action_dialog = $('#confirm_action_dialog');
        if($confirm_action_dialog.hasClass('rechargeOnline')){
            $confirm_action_dialog.removeClass('rechargeOnline');
            $('#confirm_action_dialog_notice').text('余额不足，请先充值');
            $confirm_action_dialog.find('.button.notenogh').text('去充值');
        }

		if (parseFloat(totalMoney) <= parseFloat(userMoney)) {

            // 余额足够
			$('#confirm_action_dialog .enogh').show();
			$('#confirm_action_dialog .notenogh').hide();
			checkedCallback();
		} else {

            // 余额不足
            $('#confirm_action_dialog .enogh').hide();
            $('#confirm_action_dialog .notenogh').show();

            //APP版本是扫码购2.0
            if(isNewVersion()){
                $('#confirm_action_dialog').addClass('rechargeOnline');
                $('.diffMoney').text(toMoney(parseFloat(totalMoney) - parseFloat(userMoney)));
                $('#confirm_action_dialog_notice').text('限时专享 不容错过');
                $('#confirm_action_dialog').find('.button.notenogh').text('马上去充值');
            }
		}
		confirm_action_dialog.show();
	}, false);
};

//判断app系统版本
window.isNewVersion = function() {
    baseJS.App.getAppInfo();
    if(window.appInfo){
        var appInfo = typeof window.appInfo == 'object' ? window.appInfo : $.parseJSON(window.appInfo);
        var version = appInfo.version.split('.');
        if(appInfo.name == '扫码购' && version[0] >= 2 && version[1] >= 0){
            return 1;
        }
    }
    return 0;
    
};
window.getAppInfo = function(appInfo) {
    window.appInfo = appInfo;
};


//设置密码回调函数
window.passwordSetCallback = function() {
	payPasswordSet = true;
	thisObject.removeClass('disabled');
	not_set_paycode.hide();
	passwordSetStatus(true);
};

window.aesEncryptJS =function(authCode) {
	baseJS.util.doRequest('', server + '/order/payment.cf', {
		auth: authCode
	}, function(backData) {
		var resultInfo = backData.data.resultInfo;
		if (resultInfo == "paid_success") {
			newtab("/app/user/order/paymentResult.html?success=true");
		} else {
			if (resultInfo == "password_incorrect") {
				buttonObject.text('确认兑换').removeClass('disabled');
				baseJS.App.sendToApp('flushAlert', '{"text":"支付密码不正确！","position":"bottom","time":"3000"}');
				return false;
			} else {
				var resultMessage = backData.data.resultMessage;
				newtab("/app/user/order/paymentResult.html?success=false&resultMessage=" + resultMessage);
			}
		}
	});
};

/**
 * 获取支付密码设置状态
 * @param {Boolean} focus 是否强制从服务器刷新 默认false
 * @return {Boolean} 返回支付密码设置状态
 */
window.passwordSetStatus = function(focus){
	if(!focus && payPasswordSet !== null){
		return payPasswordSet;
	}
	baseJS.util.doRequest('', server + '/paypassword/checkHavePayPassword.cf', {}, function(backData) {
		if (backData.data) 
			payPasswordSet = true;
		else
			payPasswordSet = false;
	},false);
	return payPasswordSet;
};

window.recharge = function() {
	confirmAction(orderId, totalMoney, topicId);
};

window.onresume = function() {
	window.location.reload();
};

window.orderOverCallback = function() {
	onresume();
};

//回退按钮关闭之前的activity触发的回调函数
window.closeAutoCallback = function() {
	//回退时判断是否是填写寄件公司后返回的，如果是，则重新加载退货列表
	var reloadReturnList = localStorage.getItem('reloadReturnList');
	if (reloadReturnList == "true") {
		//window.location.reload();
		//清空退货列表的数据，但是要保留最后一个li【样式是load_more】
		$("#wait_buyer_return_goods li:not(.load_more)").remove();
		loadMoreData2();
		//	localStorage.setItem('reloadReturnList','');
		localStorage.removeItem('reloadReturnList');
	}
}; 
});