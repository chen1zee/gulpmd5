define('page/home/index', function(require, exports, module){ 
require("common");
require("countdown");
var Loadmore = require("loadmore");
var slideImg = require("slider");
var Imglazyload = require("imglazyload");
var goTop = require("gotop");
require("DateUtil");
var wxid=getUrlParam("id");


$(function() {
	baseJS.App.initPage(getShopName(), 1, 1, 1, '', 0, getCartItemCount(), 'gotoCart');
	uerInfo();
	loadMoreData();
	goTop.init();
});

var initSlide = function() {
	//图片大小修正
	var wfull = $(window).width();
	$('.wfull img').width(wfull + 'px');
	$('.wfull img').height(wfull / 3 + 'px');
	$('.wfull').width(wfull + 'px');
	$('.wfull').height(wfull / 3 + 'px');

	// 图片轮播
	var slide = new slideImg({
		'id': '#ad_slide',
		'imgWidth': wfull,
		'time': 5000,
		'dec': false
	});
	slide.init();
};

/**
 * 加载首页信息
 */
var uerInfo = function() {

	var url="/profile/quick2Mall.cf";
	var param={id:wxid};
	if (wxid===null||wxid==""||wxid=="null"){
		url="/profile/userInfo.cf";
		param={};
	}

	// 默认图片
	baseJS.util.doRequest('', server + url, param, function(backData) {
//	baseJS.util.doRequest('', server + '/profile/userInfo.cf', {}, function(backData) {
		data = backData.data;
    	
    	// 保存用户手机号
    	localStorage.setItem("userphone",backData.data.userPhone);
    	
		//刷新购物车数量
		baseJS.App.initPage(getShopName(), 1, 1, 1, '', 1, getCartItemCount(), 'gotoCart');
		
		// ---广告模块
		if (backData.data.adList !== '') {
			var appendHtml = "";
			$.each(backData.data.adList.items, function(i, item) {
				var aHtml = "<a target=\"_blank\" href='{0}'><img src='{1}' width='320px' height='150px' /></a>";
				appendHtml += baseJS.util.formatString(aHtml, item.linkUrl, item.url);
			});
			if ("" == appendHtml) {
				$("#ad_slide").hide();
			} else {
				$("#ad_slide .ind_gt").html(appendHtml);
			}
			initSlide();
		}
		
		// ---小专场模块
		if(data.smallSpecialActivity && data.smallSpecialActivity.length > 0 ){
			var len = data.smallSpecialActivity.length;
			var output = "";
			len = (len%2 === 0)? len :len -1;
			for(var i=0;i<len;i++){
				var item = data.smallSpecialActivity[i];
				var aHtml = '<li><a href="/app/special/list.html?id={0}&title={1}" target="_blank"><img src="'+defaultImg_300_170+'" _src="{2}" /></a></li>';
				output += baseJS.util.formatString(aHtml,item.id,item.name,item.imageUrl);
			}
			$('#small_special_activity_list').html(output);
			Imglazyload.update('#small_special_activity_list');
			// 修正宽和边距
			$('#small_special_activity_list').css('padding-bottom','10px').find('li').css({'margin-left':10,'margin-right':0,'margin-bottom':0,'width':Math.ceil($(window).width()/2-15)});
		}
		
		// ---秒杀模块
		if (data.secondkill && data.secondkill.items && data.secondkill.items.length) {
			$('#secondkill .cl_title').click(function(){
				newtab('/app/seckill/index.html');
			});
        	if(!data.secondkill.hasStart){
        		$("#secondkill_tips").hide().html("<span class='grey'>即将开始&nbsp;&nbsp;</span><span id='secondkill_countdown'></span>");
        		daojishiNum('secondkill_countdown', function(){
        			$("#secondkill_tips").show();
        			if($("#hour_secondkill_countdown").text() == "00" && $("#min_secondkill_countdown").text() == "00" && $("#sec_secondkill_countdown").text() == "00")
        				$("#secondkill_tips").html("疯抢中！");
        		}, data.secondkill.startTime, data.secondkill.nowTime);
        	}else{
        		$("#secondkill_tips").html("疯抢中！");
        	}
        	
        	var output = "";
			for(var i in data.secondkill.items){
				var item = data.secondkill.items[i];
				var aHtml = '<li><a href="/app/goods/seckill.html?type=0&sid={0}" target="_blank" title="{1}"><img src="'+defaultProImg+'" _src="{2}" /></a><div class="price_area"><span class="discount_price">￥{3}</span><br/><span class="market_price">￥{4}</span></div></li>';

				output += baseJS.util.formatString(aHtml,item.id,item.name,item.imageUrl,toMoney(item.salesPrice), toMoney(item.originalPrice));
			}
			
			$("#secondkill_list").html(output);
			Imglazyload.update('#secondkill_list');
			$("#secondkill").show();
        }
		
		// ---大专场模块
		if(data.bigSpecialActivity && data.bigSpecialActivity.length > 0 ){
			var len = data.bigSpecialActivity.length;
			var output = "";
			var showMoreBigSpecialActivity = false;
			if(len > 30){
				len = 30;
				showMoreBigSpecialActivity = true;
			}
			for(var i=0;i<len;i++){
				var item = data.bigSpecialActivity[i];
				var aHtml = '<li><a href="/app/special/list.html?id={0}&title={1}" target="_blank"><img src="'+defaultImg_612_250+'" _src="{2}" /><div class="big_special_activity_title"><span>{3}</span><span class="fr">{4}</span></div></a></li>';
				output += baseJS.util.formatString(aHtml,item.id,item.name,item.imageUrl,item.name,item.description);
			}
			
			if(showMoreBigSpecialActivity){
				output += '<li class="more_big_special_activity"><a href="/app/special/index_big.html" target="_blank">更多专场</a></li>';
			}
			
			$('#big_special_activity_list').html(output);
			Imglazyload.update('#big_special_activity_list');
			$('#big_special_activity').show();
		}

	});
};
function toTwo(n){
    return n < 10?'0'+n:+n;
}
var toListHtml = function(backData) {
	var apendHtml = "";
	$.each(backData, function(i, item) {
		var sale_out_class = item.stock <= 0 ? " class = 'sale_out' ":"";
		var liHtml = "<li><a"+sale_out_class+" href='{0}' target=\"_blank\" title='{1}'><img _src='{2}' src='"+ defaultProImg +"' />" +
					"<div class='product_name'>{3}</div>" + "<div class='price_area'>" +
					"<span class='discount_price'>￥{4}</span>" +
					"<span class='old_price'>{5}</span></div>" +
					"</a></li>";
		item.originalPrice = (item.originalPrice == item.salesPrice || item.originalPrice==0) ? "" : "￥" + toMoney(item.originalPrice);
		apendHtml += baseJS.util.formatString(liHtml, "/app/goods/index.html?id=" + item.id, item.name, item.thumbnail, item.name, toMoney(item.salesPrice), item.originalPrice);
	});
	return apendHtml;
};

var selectDiscount = function(data){
	$('#may_you_like').show();
	Imglazyload.update('#select_discount_list');
	return toListHtml(data);
};

/**
 * 加载更多数据
 */
var loadMoreArr = new Array();
var loadMoreData = function() {
	loadMoreArr[0] = new Loadmore({
		'id': 'select_discount_list',
		'initUrl': server + '/goods/goodsForAdPosition.cf?adPosition=2&pageSize=4&pageNo={pageValue}',
		'queryCallback': selectDiscount
	}).init().checkStatus();
};

//回退按钮关闭之前的activity触发的回调函数
window.closeAutoCallback = function() {
	baseJS.App.initPage(getShopName(), 1, 1, 1, '', 1, getCartItemCount(), 'gotoCart');
};

//购买支付成功之后的回调函数
window.paySuccessCallback = function() {
	window.location.href = "order/myOrder.cf";
}; 
});