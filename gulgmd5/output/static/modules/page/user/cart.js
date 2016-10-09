define('page/user/cart', function(require, exports, module){ require("common");
var Tapdelete = require("tapdelete");
var Imglazyload = require("imglazyload");

var Dialog = require("dialog");
window.baidu = require("baiduTemplate");

var tapdelete = null;
var cartItemNum = 0;

var cartItem = {};//用于保存商品属性
$(function() {
	// 复制一份底部功能，确保页面滚动到底部不会被遮挡
	//$('.footer_nav:last').clone().css({
	//	'position': 'relative',
	//	'visibility': 'hidden',
	//	'height': $('.footer_nav:last').height()
	//}).empty().appendTo('section[role=main]');


	loadCartItem();

	initFunction();
});

window.loadCartItem = function() {
	baseJS.App.sendToApp('flushAlert', '{"text":"购物车数据更新中..","position":"bottom","time":"1000"}');
	baseJS.util.doRequest('', server + '/cart/getCartItem.cf', {}, function(backData) {
		// 移除旧的
		$("#cart_list_content .cart_list").remove();

		var dataList = backData.data;
		if (dataList.length > 0) {
			var allTopicDiv = '';
			for (var index = 0; index < dataList.length; index++) {
				var deliveryPrice = parseInt(dataList[index].deliveryPrice);
				var deliveryHtml = "邮费：￥";
				if (0 === deliveryPrice) {
					deliveryHtml = "免邮";
				} else {
					deliveryHtml += toMoney(deliveryPrice);
				}
				cartItemNum += parseInt(dataList[index].itemSize);
				var divHtml = '<div class="cart_list row_list">' +
					'<div class="cart_list_title">' +
					'<span>' + dataList[index].topicName + '</span><span class="fr grey">' + deliveryHtml + '</span>' +
					'</div>' +
					'<ul style="overflow:hidden;">';
				var appendHtml = "";

				$.each(dataList[index].cartItemList, function(i, item) {
					var liHtml = "<li data_item_id='{0}' data-online-status='{1}' data-goods-stock='{2}'><div class=\"sh_num_adjust_btn\">" +
						'<i class="sh_num_adjust_btn_minus"></i>' +
						'<i class="sh_num_adjust_btn_text" id="goodsNum">{3}</i>' +
						'<i class="sh_num_adjust_btn_plus"></i>' +
						'<input type="hidden" value="{4}" name="prodeuct_param_num" id="prodeuct_param_num" class="param_p_item_value" /></div>' +
						'<a href="javascript:void(0)" title="{5}"><i class="list_radio"></i>' +
						'<img _src="{6}"'+
						'src='+defaultProImg+
						' alt="产品"/>' +
						'<div class="row_list_right">' +
						'<div class="sh_car_product_name">{7}</div><span class="number">&times; <span class="number_in">{8}</span></span>' +
						'<div class="clear"></div>' +
						'<div class="price_area">' +
						'<p class="attrValue grey"  data-goods-id="{11}" data-goods-price="{12}" data-item-id="{13}"><span>{9}</span><i class="down-arrow"></i></p>' +
						'<span class="discount_price">￥{10}</span>' +
						'</div>' +
						'</div>' +
						'</a>' +
						'<div class="operation">刪除</div>';

                    //判断是否为单一规格
                    item.attributeValue = item.attributeValue != '' ? item.attributeValue : '单一规格';

					appendHtml += baseJS.util.formatString(liHtml, item.id, item.online, item.stock, item.quantity, item.quantity, item.goods, item.images, item.goods, item.quantity, item.attributeValue, toMoney(item.price), item.goodsId, item.price, item.id);});
				divHtml += appendHtml;
				divHtml += '</ul>																	' +
					'<div class="footer_nav bg_white cart_list_footer">						' +
					'	<div class="select_all">全选</div>									' +
					'	<div class="foot_right">											' +
					'		<p class="total_money">											' +
					'			合计：￥<span class="total_money_num">00.00</span>			' +
					'		</p>															' +
					'		<a class="red_button settle_btn disabled" href="javascript:void(0)">结算</a>	' +
					'		<a class="sh_delete_button delete_btn" href="javascript:void(0)"></a>				' +
					'	</div>																					' +
					' </div>																					' +
					'</div>';
				allTopicDiv += divHtml;
			}

			$("#cart_list_content .cart_product_status_notice").after(allTopicDiv);
			//图片预加载
			Imglazyload.update('.cart_list');

			tapdelete = tapdelete || new Tapdelete({
				'id': '#cart_list_content',
				'xPos': $('.operation').width(),
                dtap: 0
			}).init();

		} else {
			$('#empty_cart').show();
		}
		// 初始化
		changeSettleStatus();
		productStatusNotice();
		rightAppAction(); //设置标题栏
	});
};

// 动画删除元素
window.aniRemoveItem = function(o, style, callback) {
    $(o).bind('webkitTransitionEnd', callback).css($.extend({
        'transition': '0.5s'
    }, style));
};

window.deleteItem = function(o) {
	var removeStyle = {
		'z-index': 0,
		'margin-bottom': $(o).outerHeight() * -1,
		'margin-top': 0
	};
	aniRemoveItem(o, removeStyle, function() {
        $(this).remove();
		changeSettleStatus();
		productStatusNotice();
	});
    $(o).animate(removeStyle, 600, function(){
        $(o).trigger('webkitTransitionEnd');
    });
};

//滑动删除相关js开始
$('#cart_list_content').delegate('.operation', 'click', function() {
	if (confirm('确认删除？')) {
		var itemId = $(this).parent('li').attr('data_item_id');
		var _this = $(this).parent('li');
		baseJS.util.doRequest('', server + '/cart/deleteCartItem.cf', {
			itemId: itemId
		}, function(backData) {
			if (backData.data === 'true' || backData.data === true) {
				deleteItem(_this);
				cartItemNum--;
			} else {
				alert('删除失败！');
			}
		});
	}
	return false;
});


// 多选删除
window.removeCartItem = function() {
	$('.cart_list li.selected').each(function() {
		var itemId = $(this).attr('data_item_id');
		var _this = this;
		baseJS.util.doRequest('', server + '/cart/deleteCartItem.cf', {
			itemId: itemId
		}, function(backData) {
			if (backData.data === 'true' || backData.data === true) {
				deleteItem(_this);
				cartItemNum--;
			} else {
				alert('删除失败！');
			}
		});
	});
};
//<!-- 滑动删除相关js结束 -->

//<!-- 选择相关js开始 -->

// 结算判断
window.changeSettleStatus = function(cart) {

    cart = cart || $('.cart_list');

	// 判断整个购物车是否为空
	if ($('#cart_list_content').find('li[data_item_id]').size() === 0) {
        var removeStyle = {
			'z-index': 0,
			'margin-bottom': $('#cart_list_content').outerHeight() * -1,
			'margin-top': 0
		};
		aniRemoveItem($('#cart_list_content'), removeStyle, function() {
			$('#cart_list_content').remove();
			$('#empty_cart').show();
			rightAppAction();
			$(this).remove();
		});

        $('#cart_list_content').trigger('webkitTransitionEnd');

		return;
	} else {
		$('#empty_cart').hide();
	}

	$.each(cart, function() {

		var all_both_item = $(this).find('li');
		var all_item = all_both_item.not('[data-online-status="0"],[data-goods-stock="0"]');
		var all_size = all_item.size();
		var selected_size = all_item.filter('.selected').size();

		// 判断当前专区是否为空，如是则隐藏当前专区
		if (all_both_item.size() === 0) {
			var $obj = $(this);
			var removeStyle = {
				'z-index': 0,
				'margin-bottom': $obj.outerHeight() * -1,
				'margin-top': 0
			};
			aniRemoveItem($obj, removeStyle, function() {
				$(this).remove();
			});
			return true;
		}

		// 判断当前选择的是否为0，如是则隐藏结算栏
		if (all_size === 0) {
			var $obj = $(this).find('.footer_nav');
			var removeStyle = {
				'z-index': 0,
				'margin-bottom': $obj.outerHeight() * -1,
				'margin-top': 0
			};
			aniRemoveItem($obj, removeStyle, function() {
				$(this).hide();
				$(this).find('.select_all').addClass('selected');
			});
			return true;
		}

		if (selected_size === 0) {
			$(this).find('.select_all').removeClass(('selected'));
			$(this).find('.settle_btn,.delete_btn').addClass('disabled');
		} else {
			$(this).find('.settle_btn,.delete_btn').removeClass('disabled');
		}
		if (selected_size === all_size) {
			$(this).find('.select_all').addClass('selected');
		} else {
			$(this).find('.select_all').removeClass('selected');
		}

		// 价格修改
		var total_money = 0;
		var selected_item = all_item.filter('.selected');

		$.each(selected_item, function() {
			var toNumPreg = /^[^\d]/;
			var price = $(this).find('.discount_price').size() > 0 ? $(this).find('.discount_price').text() : $(this).find('.old_price').text();
			price = price.replace(toNumPreg, '');

			var num = $(this).find('.number').size() > 0 ? $(this).find('.number').text() : 1;
			num = num.replace(toNumPreg, '');

			total_money += price * num;
		});
		$(this).find('.total_money_num').text(toMoney(total_money));

	});

	// 处理全局的全选
	if ($('.cart_list .select_all').size() === $('.cart_list .select_all.selected').size()) {
		$('.select_all:last').addClass('selected');
	} else {
		$('.select_all:last').removeClass('selected');
	}

};

// 下架商品提醒
window.productStatusNotice = function() {
	var noticeBlock = $('.cart_product_status_notice');
	if ($('li[data-online-status="0"],li[data-goods-stock="0"]').size() > 0) {
		$('li[data-online-status="0"],li[data-goods-stock="0"]').addClass("disabled");
		noticeBlock.show();
	} else {
		noticeBlock.hide();
	}
};

window.initFunction = function() {

	// 全选
	$('#cart_list_content').on('click', '.select_all', function() {
		var o = $(this);
		var cart_list = $(this).parents('.cart_list');
		cart_list.size() == 0 && (cart_list = $('.cart_list'));

		if (o.hasClass('selected')) {
			o.removeClass('selected');
			cart_list.find('li').removeClass('selected');
		} else {
			o.addClass('selected');
			cart_list.find('li').not('[data-online-status="0"],[data-goods-stock="0"]').addClass('selected');
		}
		changeSettleStatus(cart_list);
	});


	//// 单选绑定
	//$('#cart_list_content').on('click', 'li .list_radio,li a img', function() {
	$('#cart_list_content').on('click', 'li[data_item_id]', function(e) {
        e.stopPropagation();
        var li = $(this);
		if (li.data('online-status') == 0||li.data('goods-stock')<=0) return;
        li.toggleClass('selected');
		var cart_list = li.parents('.cart_list');
		changeSettleStatus(cart_list);
	});


	// 删除按钮响应事件
	$('#cart_list_content').on('click', '.delete_btn', function() {
		if($('.cart_list li.selected').size() === 0){
			baseJS.App.sendToApp('flushAlert', '{"text":"请选择要删除的商品","position":"middle","time":"1000"}');
			return;
		}
		if (confirm('确认删除？')) removeCartItem();
	});

	// 结算按钮响应事件
	$('#cart_list_content').on('click', '.settle_btn', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		} else {
			
			if (!confirm('确认结算？')) return false;

			var topicDivObject = $(this).parents("div.cart_list");
			var cartItemIdStr = getCartItemId(topicDivObject);
			var ids = decodeURI(cartItemIdStr);
			
			//判断商品库存是否足够
			baseJS.util.doRequest('', server + '/order/judgeStockEnoughOrNot.cf', {ids: cartItemIdStr}, function(backData) {
				if (backData.status == "success") {
					newtab("/app/user/order/confirm/cart.html?ids=" + ids);
				} else {
					baseJS.App.sendToApp('flushAlert', '{"text":"'+backData.message+'","position":"middle","time":"1000"}');
				}
			});
		}
	});


	// 调整商品购买数量
	$('#cart_list_content').on('click', '.sh_num_adjust_btn_plus, .sh_num_adjust_btn_minus', function(e) {
        e.stopPropagation();
		var currCartItem = $(this).parents('li');
		var goodsStock = currCartItem.data('goods-stock');
		//var oNum = currCartItem.find('.number_in').text();
		var oNum = parseInt(currCartItem.find('.sh_num_adjust_btn_text').text()); //取值错误
		$(this).hasClass('sh_num_adjust_btn_plus') ? oNum++ : oNum--;

		oNum < 1 && (oNum = 1);
		if (oNum > goodsStock) {
			oNum = goodsStock;
			baseJS.App.sendToApp('flushAlert', '{"text":"该宝贝库存不足啦","position":"middle","time":"1000"}');
		}

		$(this).siblings('.sh_num_adjust_btn_text').text(oNum);
		$(this).parents('li').find('.number_in').text(oNum);
	});

};


window.getCartItemId = function(currentCart) {
	var selected_item = $(currentCart[0]).find('li').filter('.selected');

	var ids = "";
	$.each(selected_item, function(i) {
		var itemId = $(this).attr('data_item_id');
		if (i === 0) {
			ids += "" + itemId;
		} else {
			ids += "," + itemId;
		}
	});
	return ids;
};



//<!-- 选择相关js结束 -->
//
//<!--进入编辑模式-->
/**
 * edit（obj）函数是进入编辑模式和返回购物车。
 * 前端开发调用
 */
var flag = true;

window.edit = function() {
	if (flag) {
		//编辑状态
		baseJS.App.initPage('我的购物车', 0, '', 2, '完成', 1, 0, 'editCallBack');
		rightBtnCallEnableEdit();
	} else {
		//购物车状态
		baseJS.App.initPage('我的购物车', 0, '', 2, '编辑', 1, 0, 'editCallBack');
		rightBtnCallDisableEdit();
	}
	flag = !flag;
	return false;
};

/**
 * app调用编辑和完成
 */
window.rightBtnCallEnableEdit = function() {
	$('.sh_num_adjust_btn, .sh_delete_button').css('display', 'inline-block');
	$('li[data-online-status="0"],li[data-goods-stock="0"]').find('.sh_num_adjust_btn, .sh_delete_button').hide();

    //隐藏商品标题及数量
    $('.sh_car_product_name').hide();
    $('.number').hide();
    $('.footer_nav_opt').show();


    $('.cart_list_footer').css({
		'visibility': 'hidden'
	});
    $('.attrValue i').css({'visibility': 'visible'});

    var clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click";

    //商品规格修改
    $("li:not('.disabled') .price_area").on('click', function(e){
        e.stopPropagation();
        var $this = $('.attrValue', this);
        var goodId = $this.data('goods-id');

        baseJS.util.doRequest('', server + '/goods/goodsMessagesById.cf', {id: goodId}, function(backData) {
            if(backData.status != "success"){
                alert(backData.message?backData.message:backData.status);
                baseJS.App.sendToApp('close', '{"callback":"console.log"}'); //这里关闭是什么鬼？？
                return false;
                //var msg = backData.message ? backData.message : backData.status;
                //baseJS.App.sendToApp('flushAlert', '{"text":msg,"position":"middle","time":"1000"}');
                //location.reload();
            }

            var goodsMessagesDTO = backData.data.goodsMessagesDTO;
            var attributeGroupList = goodsMessagesDTO.attributesMessageMap.attributeGroupList;

            $('#product_param_dialog').html(baidu.template("_product_param_dialog", backData.data));


            // 初始化规格可选项
            flushAttributeStatus(attributeGroupList);

            // 绑定选择项事件
            $('.param_p_items').on(clickEvent, 'li', function() {
                if ($(this).hasClass('disabled')) return;
                if($(this).hasClass('hover')){
                    $(this).removeClass('hover');
                }else{
                    $(this).addClass('hover').siblings('li.hover').removeClass('hover');
                }

                var matchItem = {"gavId":"","stock":goodsMessagesDTO.stock,"salesPrice":goodsMessagesDTO.salesPrice}; //默认值
                var paramObj = {}; // 保存已选择的规格，并将未选择的项的disabled状态清除
                $(".attribute_content").each(function(){
                    var selectedItem = $(this).find("li.hover");
                    if(selectedItem.length > 0){
                        paramObj[$(this).data("title")] = selectedItem.text();
                    }else{
                        $(this).find("li.disabled").removeClass("disabled");
                    }
                });

                // 调整库存及单价和总价
                if($(".attribute_content").length === $(".attribute_content li.hover").length){ // 所有项均已选择
                    matchItem.stock = 0; // 无匹配时库存为0
                    for(var i in attributeGroupList){
                        if( isChildObj(paramObj, attributeGroupList[i]["groupInfo"]) ){
                            matchItem = attributeGroupList[i];
                            break;
                        }
                    }
                }
                // 刷新规格可选项
                flushAttributeStatus(attributeGroupList,paramObj);


                // 刷新产品信息
                flushProductData(matchItem);

                return false;
            });


            //将规格参数保存在对象中
            var p_attrValue = {};
            var p_attrValue_keys = [];
            var _p_attrValue = $this.children('span').text().split(','); //规格参数临时对象

            //规格弹窗初始化开始

            //数量
            $('#p_goodsNum').text($this.parents('li').find('.sh_num_adjust_btn_text').text());

            if($this.children('span').text() != '单一规格'){
                //原规格不是单一规格
                if(goodsMessagesDTO.standard == 1){
                    //初始化数量
                    $('#p_goodsNum').text(1);
                    if(goodsMessagesDTO.stock == 0){
                        $('#p_goodsNum').text(0);
                    }
                    //总价
                    $("#orderform [name='totalPrice']").val(toMoney(goodsMessagesDTO.salesPrice * parseInt($('#p_goodsNum').text())));
                    $('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
                    //弹窗内为多规格
                    for(var i in _p_attrValue){
                        var __p_attrValue = _p_attrValue[i].split(':');
                        p_attrValue[__p_attrValue[0]] = __p_attrValue[1];
                        p_attrValue_keys.push(__p_attrValue[0]);
                    }
                    //计算数组或对象的长度
                    function count(o){
                        var t = typeof o;
                        if(t == 'string'){
                            return o.length;
                        }else if(t == 'object'){
                            var n = 0;
                            for(var z in o){
                                n++;
                            }
                            return n;
                        }
                        return false;
                    }
                    var p_attrValue_len = count(p_attrValue),
                        groupInfo_len = count(attributeGroupList[0].groupInfo);
                    if(p_attrValue_len == groupInfo_len){
                        //判断当前规格是否在最新的规格列表中
                        function isEqual (){
                            for(var j in attributeGroupList){
                                var n = 0;
                                var currGroupInfo = attributeGroupList[j].groupInfo;
                                for(var k in p_attrValue_keys){
                                    if(p_attrValue[p_attrValue_keys[k]] == currGroupInfo[p_attrValue_keys[k]]){
                                        n++;
                                    }
                                }
                                if(n == p_attrValue_len){
                                    return j;
                                }
                            }
                            return false;
                        }

                        if(isEqual() !== false){
                            var attributeGroup = attributeGroupList[parseInt(isEqual())];

                            //默认选中
                            if(attributeGroup.stock != 0){
                                $('.attribute_content').each(function(){
                                    var $this = $(this);
                                    var key = $this.data('title');
                                    $this.find('li').each(function(){
                                        if($(this).text() == p_attrValue[key]){
                                            $(this).trigger(clickEvent);
                                            // @todo  奇怪啊
                                        }
                                    });
                                });


                                //价格
                                $("#orderform [name='price']").val(toMoney(attributeGroup.salesPrice));

                                //数量
                                $('#p_goodsNum').text($this.parents('li').find('.sh_num_adjust_btn_text').text());
                                if(attributeGroup.stock == 0){
                                    $('#p_goodsNum').text(0);
                                }
                                if($this.parents('li').find('.sh_num_adjust_btn_text').text() > attributeGroup.stock){
                                    $('#p_goodsNum').text(attributeGroup.stock);
                                }

                                //库存
                                $('#product_total_num').text(attributeGroup.stock);

                                //总价
                                $("#orderform [name='totalPrice']").val(toMoney(attributeGroup.salesPrice * parseInt($('#p_goodsNum').text())));
                                $('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
                            }else{
                                $("#orderform [name='price']").val(toMoney(goodsMessagesDTO.salesPrice));
                                $('#p_goodsNum').text(1);
                                if(goodsMessagesDTO.stock == 0){
                                    $('#p_goodsNum').text(0);
                                }
                                $('#product_total_num').text(goodsMessagesDTO.stock);
                                //总价
                                $("#orderform [name='totalPrice']").val(toMoney(goodsMessagesDTO.salesPrice * parseInt($('#p_goodsNum').text())));
                                $('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
                            }
                        }
                    }
                }
                //弹窗内是单规格
                if(goodsMessagesDTO.standard == 0){
                    $('#p_goodsNum').text(1);
                    if(goodsMessagesDTO.stock == 0){
                        $('#p_goodsNum').text(0);
                        $("#confirmButton").attr("disabled",true).addClass("disabled");
                    }
                    ////总价
                    //$("#orderform [name='totalPrice']").val(toMoney(goodsMessagesDTO.salesPrice * parseInt($('#p_goodsNum').text())));
                    //$('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
                }
            }else{
                //原规格是单一规格
                //弹窗内是否单一规格
                if(goodsMessagesDTO.standard == 0){
                    $('#p_goodsNum').text($this.parents('li').find('.sh_num_adjust_btn_text').text());
                    if(goodsMessagesDTO.stock < parseInt($this.parents('li').find('.sh_num_adjust_btn_text').text())){
                        $('#p_goodsNum').text(goodsMessagesDTO.stock);
                    }
                    $('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
                }else{
                    $('#p_goodsNum').text(1);
                }
                if(goodsMessagesDTO.stock == 0){
                    $('#p_goodsNum').text(0);
                    $("#confirmButton").attr("disabled",true).addClass("disabled");
                }
                //总价
                $("#orderform [name='totalPrice']").val(toMoney(goodsMessagesDTO.salesPrice * parseInt($('#p_goodsNum').text())));
                $('.p_total_money').text('￥' + $("#orderform [name='totalPrice']").val());
            }

            //规格弹窗初始化结束

            //将商品初始属性写入cartItem
            cartItem = {cartId: $this.data('item-id'), quantity: parseInt($('#p_goodsNum').text()), attributeValue: p_attrValue};



            //规格选择弹窗
            var attrDialog = new Dialog({
                'id': '#product_param_dialog',
                'position': 'bottom',
                'close_btn': '.close_btn',
                'ani_show': true,
                'cover_hide': true
            });
            attrDialog.show();


            //去除莫名奇妙的选项滑动BUG
            $('.param_p_items').on('touchmove', 'li', function(e){
                if ('originalEvent' in e) {
                    e = e.originalEvent;
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });




            //选中只有一个值的项(屏蔽规格单选型自动选中)
            //$('.param_p_items').each(function(){
            //    if($(this).children('li').size() === 1){
            //        $(this).children('li').trigger(clickEvent);
            //    }
            //});


            //首次禁用确定按钮
            //$("#confirmButton").attr("disabled",true).addClass("disabled");

            // 判断一个对象A是否是另一个对象B的子集
            function isChildObj(objA,objB){
                var flag = true;
                for(var i in objA){
                    if(objA[i] != objB[i]){
                        flag = false;
                        break;
                    }
                }
                return flag;
            }

            // 设置各区域值（单价、总结、数量、库存等）
            function flushProductData(matchItem){
                var attrNum = $('#product_param_dialog').find('.attribute_content').size();
                if($('.param_p_items .hover').size() ==  attrNum){
                    $('#p_goodsNum').text('1');
                }
                var curNum = parseInt($('#p_goodsNum').text());

                $('#quantity').val(curNum);
                $("#product_total_num").text(matchItem.stock);
                $('#gavIds').val(matchItem.gavId);
                $('.p_total_money').text('￥' + toMoney(matchItem.salesPrice * curNum) );
                $("#orderform [name='price']").val(matchItem.salesPrice);
                $("#orderform [name='totalPrice']").val( $('.p_total_money').text());

                if(matchItem.groupInfo != 'undefined'){
                    cartItem.attributeValue = matchItem.groupInfo;
                    cartItem.quantity = parseInt($('#p_goodsNum').text());
                }
            }

            /**
             * 刷新规格参数的可选状态，仅在只剩一项未选时决策
             * @param {Object} attributeGroupList 规格组合列表
             * @param {Object} paramObj 已选择的规格（可选）
             */
            function flushAttributeStatus(attributeGroupList,paramObj){

                var totalLength = $(".attribute_content").length;
                var selectedLength = $(".attribute_content li.hover").length;
                $("#confirmButton").attr("disabled",true).addClass("disabled");
                if(totalLength > selectedLength + 1) {
                    return;
                }
                paramObj = paramObj || {};

                // 等待刷新的元素列表
                var waitFlushItems = $(".attribute_content");
                if(totalLength === selectedLength + 1){
                    waitFlushItems = waitFlushItems.not($("li.hover").parents(".attribute_content"));
                }else{
                    if(parseInt($('#product_total_num').text()) != 0){
                        $("#confirmButton").attr("disabled",false).removeClass("disabled");
                    }
                }
                waitFlushItems.each(function(){

                    var newParamObj = $.extend({},paramObj);
                    var waitFlushList = $(this).find("li");
                    var waitFlushTitle = $(this).data("title");

                    // 禁用不在规格组合列表中或库存为0的选项
                    waitFlushList.each(function(){
                        var flag = false;
                        newParamObj[waitFlushTitle] = $(this).text();
                        for(var i in attributeGroupList){
                            if(isChildObj(newParamObj, attributeGroupList[i]["groupInfo"]) && attributeGroupList[i].stock > 0){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            $(this).addClass("disabled");
                        }else{
                            $(this).removeClass("disabled");
                        }
                    });
                });
            }

            // 规格弹窗调整购买数量
            window.numAjust = function (ajustNum) {
                // 当前数量
                var curNum = parseInt($('#p_goodsNum').text());
                // 总库存数
                var totalNum = parseInt($('#product_total_num').text());
                // 商品单价
                var price = $("#orderform [name='price']").val();
                price = price.replace(/^[^\d]/, '');
                var newNum = ajustNum + curNum;

                // 控制数量不能超过库存，也不能低于1
                if (newNum > totalNum || newNum < 1) {
                    return;
                }
                // 开始调整数量和总价
                $('.num_adjust_btn_text').text(newNum);
                $('#quantity').val(newNum);
                $('.p_total_money').text('￥' + toMoney(newNum * price));
                $("#orderform [name='totalPrice']").val( toMoney(newNum * price));
                cartItem.quantity = parseInt($('#p_goodsNum').text());
            };
            //防止重复绑定事件
            $('#confirmButton').off('click');

            //规格弹窗确定事件
            $('#confirmButton').on('click', function(e){
                e.preventDefault();
                if(parseInt($('#p_goodsNum').text()) > parseInt($('#product_total_num').text())){
                    baseJS.App.sendToApp('flushAlert', '{"text":"库存不足，保存失败!","position":"bottom","time":"2000"}');
                    return false;
                }
                var p_attr = '';
                if(count(cartItem.attributeValue) != 0){
                    $.each(cartItem.attributeValue, function(k, v){
                        p_attr += k + ':' + v + ',';
                    });
                    p_attr = p_attr.substring(0,  p_attr.length-1);
                    $this.attr('data-attr-value', p_attr);
                    $this.children('span').text(p_attr);
                }else{
                    $this.attr('data-attr-value', '单一规格');
                    $this.children('span').text('单一规格');
                }

                // @todo 更新弹窗外库存
                $this.parents('li').data('goods-stock', $('#product_total_num').text());
                $this.parents('li').find('.sh_num_adjust_btn_text').text(cartItem.quantity);
                $this.parents('li').find('.number_in').text(cartItem.quantity);
                $this.parents('li').find('.discount_price').text('￥' + toMoney($("[name='price']").val()));
                attrDialog.hide();
            });
        });
    });
};

window.rightBtnCallDisableEdit = function() {
    //关闭规格弹窗
    $('#product_param_dialog').hide();
    $('#cover').hide();

    $('.footer_nav_opt').hide();


	$('.sh_num_adjust_btn, .sh_delete_button').hide();

    //卸载规格选择点击事件
    $("li:not('.disabled') .price_area").off('click');


    //显示商品标题及数量
    $('.sh_car_product_name').show();
    $('.number').show();
    $('.attrValue i').css({'visibility': 'hidden'});


	$('.cart_list_footer').css({
		'visibility': 'visible'
	});

    //减少多余的提示语
	//baseJS.App.sendToApp('flushAlert', '{"text":"购物车数据更新中,请稍候..","position":"bottom","time":"1000"}');

	var all_item = $('.cart_list li');
	var udata = new Array();
	$.each(all_item, function() {
		var aa = {};
		aa.cartItemId = $(this).attr('data_item_id');
        aa.attributeValue = $('.attrValue', this).find('span').text();
        if($('.attrValue', this).attr('data-attr-value') != undefined){
            aa.attributeValue = $('.attrValue', this).attr('data-attr-value');
        }
        if(aa.attributeValue == '单一规格'){
            aa.attributeValue = '';
        }
        //if($('.attrValue', this).find('span').text() != '单一规格'){
        //    aa.attributeValue = $('.attrValue', this).find('span').text();
        //}
		aa.quantity = $(this).find('.sh_num_adjust_btn_text').text();
		udata.push(aa);
	});
	//var a = {};
	//a.dataList = udata;
	var dataList = JSON.stringify(udata);
	$.ajax({
		type: 'POST',
		url: server + "/cart/updateCarGoodsQuantity.cf",
		data: dataList,
		async: false,
		dataType: 'json',
		contentType: 'application/json',
		cache: false,
		success: function(backData) {
			if (backData.status == 'success') {
                baseJS.App.sendToApp('flushAlert', '{"text":"保存成功!","position":"bottom","time":"2000"}');
			} else {
				baseJS.App.sendToApp('flushAlert', '{"text":"保存失败!","position":"bottom","time":"2000"}');
                setTimeout(function(){
                    location.reload();
                }, 2000);
            }
		}
	});

	changeSettleStatus();
};

window.rightAppAction = function() {
	if (cartItemNum > 0) {
		baseJS.App.initPage('我的购物车', 0, '', 2, '编辑', 1, 0, 'editCallBack');
	} else {
		baseJS.App.initPage('我的购物车', 0, '', 0, '', 1, 0, '');
	}
};

window.editCallBack = function() {
	edit(); //删除选择的购物车项
};

//订单确认后的回调函数
window.orderOverCallback = function() {
	window.location.href = "/app/user/order.html";
};

//回退按钮关闭之前的activity触发的回调函数
window.closeAutoCallback = function() {
	if (!localStorage.getItem('needUpdateCart')) return;
	localStorage.setItem('needUpdateCart', '');

	//图片预加载
	Imglazyload.update('.cart_list');
	cartItemNum = 0;
	loadCartItem();
}; 
});