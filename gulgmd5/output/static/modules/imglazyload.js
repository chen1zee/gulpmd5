define('imglazyload', function(require, exports, module){ /*
	by ifindever 2015/03/26
	website: http://ifindever.com
    depend on jquery.min.js
*/

var $ = jQuery = require("jquery");
var Imglazyload = function() {
	var imgsObj = $('img[_src]');
	var _this = this;
	var maxScroll = 0; // 已经滚动的最大距离

	/**
	 * 判断是否满足条件，满足则加载图片
	 */
	this.doLoad = function() {
		var currScroll = $(window).scrollTop();
		maxScroll = Math.max(currScroll, maxScroll);
		maxScroll = currScroll;
		imgsObj.each(function() {
			var imgItem = $(this);

			// 排除已经加载过的或已经在dom节点中删除的
			if (!imgItem.attr('_src') || imgItem.parent().length === 0) {
				imgsObj = imgsObj.not(imgItem);
				return;
			}
			// 图片进入可视区域
			if (imgItem.offset().top <= maxScroll + $(window).height() - 10) {
				var tmpImg = new Image();
				tmpImg.src = imgItem.attr('_src');
				imgItem.removeAttr('_src');

				if (tmpImg.complete) {
					imgItem.attr('src', tmpImg.src);
				} else {
					// 加载成功，渲染到实际图片
					tmpImg.onload = function() {
						imgItem.attr('src', tmpImg.src);
					};
				}
			}
		});
	};

	/**
	 * 更新图片对象资源
	 * @param {null|String} selecter 需要更新的dom选择器，为空时会更新所有的图片
	 */
	this.update = function(selecter) {
		setTimeout(function() {
			if (!selecter) {
				maxScroll = 0;
				imgsObj = $('img[_src]');
			} else {
				imgsObj = imgsObj.add($(selecter + " img[_src]"));
			}
			_this.doLoad();
		}, 10);
	};

	// 初始化
	this.update();
	$(window).on("scroll", this.doLoad);
};

if ("object" == typeof module && "object" == typeof module.exports) {
	module.exports = new Imglazyload();
} 
});