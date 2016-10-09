define('page/seckill/index', function(require, exports, module){ require("common");
require("countdown");
var goTop = require("gotop");

$(function() {
	init();
	goTop.init();
});

var init = function() {
	baseJS.App.initPage('限时秒杀', 0, '', 1, '', 1, getCartItemCount(), 'gotoCart');
	loadBrandLogo();
	loadSeckillGoods();
};
var longTime = null;

var displayFitter = function() {
	var hasPreSeckillTitleFlag = false;
	$('.seckill_list').children('.cart_list_title').each(function(i, v){
		var $this = $(v),
			header = '';
		var oneHour = 1000*60*60;
		//秒杀时间测试
//		longTime = new Date().getTime();
//		var startTime = longTime-oneHour*24,
//			endTime = longTime+oneHour*18;
		var startTime = $this.data('stime'),
			endTime = $this.data('etime');
		var sHours = toTwo(new Date(startTime).getHours()),
			sMinutes = toTwo(new Date(startTime).getMinutes());
		if(longTime >= startTime){
			header = '<span>抢购中&nbsp; <i class="seckill_stime" style="font-size: .9em "><a href="javascript:void(0)">'+sHours+':'+sMinutes+'</a>开抢</i></span><span class="fr sec_action">距结束&nbsp; <span class="countdown">-- : -- : --</span></span>';
			$this.html(header);
			$this.find('.countdown').attr('id', $this.data('id'));
			var id = $this.find('.countdown').attr('id');
			window.daojishiNum(id, reload, endTime, longTime);
		}else{
			if(!hasPreSeckillTitleFlag){
				$this.before('<div class="seckill_type"><span class="middle_line"></span><span class="seckill_type_text">秒杀预告</span><span class="middle_line"></span></div>');
				hasPreSeckillTitleFlag = true;
			}
			$this.siblings('.sec_goodsList').find('button').hide();
			var sDate = new Date(startTime).getDate();
			
			var lDate = new Date(longTime);
			var lDateStr = lDate.getFullYear() + '/' + (lDate.getMonth()+1) + '/' + lDate.getDate();
			var todayEnd = new Date(lDateStr+' 23:59:59').getTime();
			if (startTime <= todayEnd) {
				header = '<span><i class="seckill_stime" style="font-size: .9em "><a href="javascript:void(0)">' + sHours + ':' + sMinutes + '</a>开抢</i></span><span class="fr sec_action">距开始&nbsp; <span class="countdown">-- : -- : --</span></span>';
			} else if (startTime <= (todayEnd + oneHour * 24)) {
				header = '<span><i class="seckill_stime" style="font-size: .9em ">明日 <a href="javascript:void(0)">' + sHours + ':' + sMinutes + '</a>开抢</i></span><span class="fr sec_action">距开始&nbsp; <span class="countdown">-- : -- : --</span></span>';
			} else {
				var sMonth = new Date(startTime).getMonth() + 1;
				header = '<span><i class="seckill_stime" style="font-size: .9em "><a href="javascript:void(0)">' + sMonth + '月' + sDate + '日 ' + sHours + ':' + sMinutes + '</a>开抢</i></span><span class="fr sec_action">距开始&nbsp; <span class="countdown">-- : -- : --</span></span>';
			}
			$this.html(header);
			$this.find('.countdown').attr('id', $this.data('id'));
			var id = $this.find('.countdown').attr('id');
			window.daojishiNum(id, reload, startTime, longTime);
		}
	})
};
function reload(tt){
	if(tt == 0){
		//window.location.replace(location.href);
		setTimeout(function(){
			window.location.reload();
		},1000);
	}
}

var loadSeckillGoods = function() {
	baseJS.util.doRequest('', server + '/seckill/seckillGoodsList.cf', {}, function(backData) {
		if (backData.data !== '') {
			// 秒杀提示
			$('#tipValue').html(backData.data.tipValue);

			longTime = backData.data.nowTime != null ? parseInt(backData.data.nowTime) : new Date().getTime();
			var appendHtml = "";
			for (var i = 0; i < backData.data.seckillMessageList.length; i++) {
				var seckillMessage = backData.data.seckillMessageList[i];
				if (seckillMessage.seckillConfigDetailList.length > 0) {
					var showItemFlag = false;
					var seckillMessageHtml = '<div class="cart_list row_list seckill_list">' +
						'<div class="cart_list_title" data-stime="'+seckillMessage.startTime+'" data-etime ='+seckillMessage.endTime+' data-id='+seckillMessage.seckillCategoryId+'>' +
						'</div>'+
						'<ul class="sec_goodsList">';
					$.each(seckillMessage.seckillConfigDetailList, function(i, item) {
						if(item.quantity <=0 )return;
						showItemFlag = true;
						var mButton = item.quantityLeft>0?'<button class="red_button">去抢购</button>':'<button class="grey_button">已售罄</button>';
						var ahtml =  '<li class="seckill_item">'+
						'<a href="/app/goods/seckill.html?type=0&sid={0}" target="_blank" title="想买个商品都不行">'+
						'<img src="{1}" alt="">'+
						'<div class="row_list_right">'+
						'<div class="sh_car_product_name">{2}</div>'+
						'<div class="clear"></div>'+
						'<div class="price_area">'+ mButton +
						'<p class="sec_limitNum">限量{3}件</p>'+
						'<p><span class="discount_price">￥{4}</span><span class="market_price">￥{5}</span></p>'+
						'</div>'+
						'</div>'+
						'</a>'+
						'</li>';
						var imageUrl = (item.goodsMessagesDTO != null && item.goodsMessagesDTO.imagesUrlList != null && item.goodsMessagesDTO.imagesUrlList.length > 0) ? item.goodsMessagesDTO.imagesUrlList[0] : defaultProImg;
						seckillMessageHtml += baseJS.util.formatString(ahtml, item.id,imageUrl,
							item.goodsMessagesDTO.name, item.quantity, toMoney(item.price), toMoney(item.goodsMessagesDTO.originalPrice));
					});
					seckillMessageHtml += '</ul></div>';
					if(showItemFlag){
						appendHtml += seckillMessageHtml;
					}
				};
			}
			$("#seckill_list").append(appendHtml);
			displayFitter();
			shopTip();
		};
	});
};

var shopTip = function() {
	$("div.sh_seconds_kill_tips").show();
};


var loadBrandLogo = function() {
	$("div.sh_cooperative_brand").hide();
	baseJS.util.doRequest('', server + '/brand/loadBrandLogo.cf', {}, function(backData) {
		if (backData.data !== '') {
			var appendHtml = "";
			$.each(backData.data, function(i, item) {
				var aHtml = '<li><a href="javascript:void(0)"><img src="{0}"  alt="" width="94" height="55"/></a></li>';
				appendHtml += baseJS.util.formatString(aHtml, item.logoUrl);
			});
			if (appendHtml != "") {
				$("ul.shcb_ul").html(appendHtml);
				$("div.sh_cooperative_brand").show();
			}
		}
	});
};

window.orderOverCallback = function() {
	window.location.href = "/app/user/order.html";
};

window.closeAutoCallback = function() {
	flushCarItemCount();
};

function flushCarItemCount() {
	baseJS.App.initPage('限时秒杀', 0, '', 1, '', 1, getCartItemCount(), 'gotoCart');
} 
});