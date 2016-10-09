define('dragload', function(require, exports, module){ /*
	by ifindever 2015/03/26
	website: http://ifindever.com
*/
var $ = jQuery = require("jquery");
var Dragload = function(callback) {
	var status = {
		'xStart': 0, // 触摸开始x位置
		'yStart': 0,
		'curDec': false, // 当前触摸方向: false x y; 
		'canLoad': false // 当前触摸方向: false x y; 
	};
	var dtap = 0; // tap预判断方向位移
	var _this = this;

	// 初始化
	this.init = function() {
		// 绑定手指滑动事件
		$('body').on('touchstart', _this.moveStart).on('touchmove', _this.move);
	};

	// 手指滑动开始
	this.moveStart = function(e) {
		e.originalEvent && (e = e.originalEvent);
		status.curDec = false;
		status.xStart = e.changedTouches[0].clientX;
		status.yStart = e.changedTouches[0].clientY;
		var scrollTop = $(window).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(window).height();
		if (scrollTop + windowHeight >= scrollHeight - 5) {
			status.canLoad = true;
		}else{
			status.canLoad = false;
		}
	};

	// 手指滑动
	this.move = function(e) {
		if(!status.canLoad) return;
		e.originalEvent && (e = e.originalEvent);
		var _x = e.changedTouches[0].clientX - status.xStart; // x偏移量
		var _y = e.changedTouches[0].clientY - status.yStart; // y偏移量

		if (!status.curDec) {
			if (Math.abs(_x) < dtap && Math.abs(_y) < dtap) {
				e.preventDefault();
				return; // 前dtap个像素不处理，预留判断触摸方向
			} else {
				if (Math.abs(_x) > Math.abs(_y)) { // 横向触摸
					status.curDec = 'x';
				} else {
					status.curDec = 'y'; // 纵向触摸
				}
			}
		}
		if (status.curDec == 'y' && _y < 0) { // 横向触摸,并向上拉
			e.preventDefault();
			if(Math.abs(_y) > 30) {
				callback();
				_this.distroy();
			}
		}
	};
	
	// 销毁自己（主要是移除事件绑定的影响）
	this.distroy = function(){
		$('body').off('touchstart', _this.moveStart).off('touchmove', _this.move);
	};
};

if ("object" == typeof module && "object" == typeof module.exports) {
	module.exports = Dragload;
} 
});