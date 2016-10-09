define('tapdelete', function(require, exports, module){ /*
	by ifindever 2013/09/05
	website: http://ifindever.com
*/
var $ = jQuery = require("jquery");
var Tapdelete = function(opt) {
	this.opt = opt; // id:盒子id , xPos:x轴最大偏移量, dtap:预判方向位移
	var status = {
		'xStart': 0, // 触摸开始x位置
		'yStart': 0,
		'curDec': false // 当前触摸方向: false x y; 
	};
	var obj = $(opt.id);
	var dtap = opt.dtap || 0; // tap预判断方向位移

	var _this = this;

	// 初始化
	this.init = function() {
		// 绑定手指滑动事件

		obj.delegate('li', 'touchstart', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.moveStart(e,$(this));
		});
		obj.delegate('li', 'touchmove', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.move(e,$(this));
		});
		obj.delegate('li', 'touchend', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.moveEnd(e,$(this));
		});
	};

	// 手指滑动开始
	this.moveStart = function(e,o) {
		obj.children().css('transition', '0ms');
		status.xStart = e.changedTouches[0].clientX;
		status.yStart = e.changedTouches[0].clientY;
		o.data('allow_des') || o.data('allow_des',1);
		status.curDec = false; //清除触摸方向标志
	};

	// 手指滑动
	this.move = function(e,o) {
		var allow_des = parseInt(o.data('allow_des')); // 触摸允许的方向
		var _x = e.changedTouches[0].clientX - status.xStart; // x偏移量
		var _y = e.changedTouches[0].clientY - status.yStart; // y偏移量
		if (!status.curDec) {
			if (Math.abs(_x) < dtap && Math.abs(_y) < dtap){
				e.preventDefault();
				return; // 前dtap个像素不处理，预留判断触摸方向
			}else {
				if (Math.abs(_x) > Math.abs(_y)) { // 横向触摸
					status.curDec = 'x';
					e.preventDefault();
				} else {
					status.curDec = 'y'; // 纵向触摸
				}
			}
		}
		if (status.curDec == 'x' ) { // 横向触摸
			if( allow_des < 0 ) _x = -1 * opt.xPos + _x; 
			o.css('transform', 'translateX(' + (_x) + 'px)');
		}
	};

	// 手指滑动结束
	this.moveEnd = function(e,o) {
		var allow_des = parseInt(o.data('allow_des')); // 触摸允许的方向
		o.css('transition', '300ms');			
		if (status.curDec == 'x' && allow_des * (e.changedTouches[0].clientX - status.xStart) <= -2*dtap) { // 偏移量大于2*dtap像素，则移动
			if(allow_des > 0){
				this.pre(o);
			}else{
				this.back(o);
			}
		} else {
			if(allow_des < 0){
				this.pre(o);
			}else{
				this.back(o);
			}
		}
	};

	// 向前
	this.pre = function(o) {
		o.css('transition', '300ms'); // 放在前面防止0ms动画失效
		var x = -1*opt.xPos;
		o.css('transform', 'translateX(' + x + 'px)');
		o.data('allow_des',-1);
	};

	// 向后
	this.back = function(o) {
		o.css({
			'transition': '300ms',
			'transform': 'translateX(0px)'
		});
		o.data('allow_des',1);
	};
};

if ( "object"==typeof module&&"object"==typeof module.exports ) {
	module.exports = Tapdelete;
} 
});