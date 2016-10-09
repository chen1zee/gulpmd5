define('slider', function(require, exports, module){ /*
	by ifindever 2013/03/12
	website: http://ifindever.com
*/
var $ = jQuery = require("jquery");
var slideImg = function(opt) {
	this.opt = opt; // id:要轮播对象的id , imgWidth:图片宽   ,time:轮播间隔时间 , dec: 锁定触摸方向的冒泡 true|false
	var status = {
		'curNum': 0, // 当前轮播位置
		'len': 0, //  原本元素个树
		't': null, //  定时执行句柄
		'xStart': 0, // 触摸开始x位置
		'yStart': 0, // 触摸开始y位置
		'curDec': false // 当前触摸方向: false x y; 
	};
	var obj = $(opt.id);
	var _this = this;

	// 初始化
	this.init = function() {
		status.len = obj.children('div').children('a').length;
		if (status.len < 2) return; // 只有一张图时，不轮播
		obj.children('div').width((status.len + 2) * opt.imgWidth + 'px');
		obj.children('div').append(obj.children('div').children('a').eq(0).clone());
		obj.children('div').append(obj.children('div').children('a').eq(status.len - 1).clone().css({
			'position': 'absolute',
			'z-index': 999,
			'left': (obj.children('div').children('a').width()) * -1 + 'px'
		}));

		// 增加原点标识图片张数
		var nav_warp = $('<p>').css({
			'position': 'absolute',
			'bottom': '15px',
			'right': '20px'
		});
		var nav_item = $('<i>').css({
			'display': 'inline-block',
			'width': '8px',
			'height': '8px',
			'background': '#ddd',
			'border-radius': '4px',
			'margin-left': '5px'
		});
		for (var i = 0; i < status.len; i++) {
			nav_warp.append(nav_item.clone());
		}
		nav_warp.children(':eq(0)').css('background', '#ff5a5f');
		obj.css('position', 'relative').append(nav_warp);

		// 绑定手指滑动事件
		obj.bind('touchstart', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.moveStart(e);
		});
		obj.bind('touchmove', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.move(e);
		});
		obj.bind('touchend', function(e) {
			if ('originalEvent' in e) {
				e = e.originalEvent;
			}
			_this.moveEnd(e);
		});
		// 开始自动轮播
		this.start();
	};

	// 自动轮播开始
	this.start = function() {
		status.t = setInterval(this.next, opt.time);
	};

	// 自动轮播结束
	this.stop = function() {
		clearInterval(status.t);
	};

	// 手指滑动开始
	this.moveStart = function(e) {
		_this.stop();
		obj.children('div').css('-webkit-transition', '0ms');
		status.xStart = e.changedTouches[0].clientX;
		status.yStart = e.changedTouches[0].clientY;
	};

	// 手指滑动
	this.move = function(e) {
		var x = -1 * status.curNum * opt.imgWidth; // 触摸开始时的位置
		var _x = e.changedTouches[0].clientX - status.xStart; // x偏移量
		var _y = e.changedTouches[0].clientY - status.yStart; // y偏移量

		if (!status.curDec) {
			if (Math.abs(_x) > Math.abs(_y)) { // 横向触摸
				status.curDec = 'x';
				e.preventDefault();
			} else {
				status.curDec = 'y'; // 纵向触摸
			}
		}
		if (status.curDec == 'x') { // 横向触摸
			obj.children('div').css('-webkit-transform', 'translate3d(' + (x + _x) + 'px, 0, 0)');
			if (opt.dec) {
				e.stopPropagation();
				return false;
			} // 停止冒泡
		}
	};

	// 手指滑动结束
	this.moveEnd = function(e) {
		status.curDec = false; //清除触摸方向标志
		obj.children('div').css('-webkit-transition', '500ms');
		var x = -1 * status.curNum * opt.imgWidth; // 触摸开始时的位置

		if (Math.abs(e.changedTouches[0].clientX - status.xStart) >= 10) { // 偏移量大于10像素，则移动一张图
			if (e.changedTouches[0].clientX - status.xStart > 0)
				_this.pre();
			else
				_this.next();
		} else {
			obj.children('div').css('-webkit-transform', 'translate3d(' + x + 'px, 0, 0)');
		}
		_this.start();
	};

	// 前一张图
	this.pre = function() {
		obj.children('div').css('-webkit-transition', '500ms'); // 放在前面防止0ms动画失效
		status.curNum--;
		//console.log(status.curNum);
		var x = -1 * status.curNum * opt.imgWidth;
		obj.children('div').css('-webkit-transform', 'translate3d(' + x + 'px, 0, 0)');
		if (status.curNum <= -1) {
			obj.children('div').bind('webkitTransitionEnd', function() {
				obj.children('div').css({
					'-webkit-transition': '0ms',
					'-webkit-transform': 'translate3d(' + (3 * opt.imgWidth - obj.children('div').width()) + 'px, 0, 0)'
				});
				obj.children('div').unbind('webkitTransitionEnd');
			});
			status.curNum = status.len - 1;
		}
		obj.find('i').css('background','#ddd').eq(status.curNum).css('background','#ff5a5f');
	};

	// 后一张图
	this.next = function() {
		status.curNum++;
		var x = -1 * status.curNum * opt.imgWidth;
		obj.children('div').css({
			'-webkit-transition': '500ms',
			'-webkit-transform': 'translate3d(' + x + 'px, 0, 0)'
		});
		if (status.curNum >= status.len) {
			obj.children('div').bind('webkitTransitionEnd', function() {
				obj.children('div').css({
					'-webkit-transition': '0ms',
					'-webkit-transform': 'translate3d(0px, 0, 0)'
				});
				obj.children('div').unbind('webkitTransitionEnd');
			});
			status.curNum = 0;
		}
		obj.find('i').css('background','#ddd').eq(status.curNum).css('background','#ff5a5f');
	};
};

if ( "object"==typeof module&&"object"==typeof module.exports ) {
	module.exports = slideImg;
} 
});