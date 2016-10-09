define('dialog', function(require, exports, module){ /*
	by ifindever 2014/09/05
	website: http://ifindever.com
*/
var $ = jQuery = require("jquery");
var Dialog = function(opt) {
	var _opt = {
		'id': '', // 必须，对话框内要显示的内容id
		'close_btn': '', // 可选 关闭对话框的控件，多个使用 | 分割 如：'#a | .c .btn'
		'position': 'middle', // 可选，对话框在Y轴的位置 top|middle|bottom
		'style': '', // 可选，对话框额外的样式,可用来覆盖对话框设置的属性值，实现高度自由化 json格式 如：{'position':'absolute'}
		'ani_show': false, // 可选，是否动画显示
		'cover_hide': false, // 可选，点击非对话框位置时是否隐藏对话框,
		'close_callback': false // 可选，关闭对话框时的回调函数
	};

	_opt = $.extend(_opt, opt);
	var obj = $(opt.id);
	var cover;
	var resizeTimeout;

	// 初始化
	this.init = function() {
		var _this = this;

		// 创建遮罩层
		if ($('#cover').size() > 0) {
			cover = $('#cover');
		} else {
			cover = $('<div></div>').attr('id', 'cover').css({
				'position': 'fixed',
				'width': '100%',
				'opacity': 0.5,
				'background': 'black',
				'top': 0,
				'bottom': 0,
				'left': 0,
				'display': 'none',
				'z-index': 999
			});
			cover.appendTo($('body'));

			// 绑定点击遮罩隐藏对话框事件
			// data上保存所有cover_hide=true的对话框及其状态
			cover.data('elems', []);
			cover.bind('click', function(e) {
				var elems = cover.data('elems');
				for (var i in elems) {
					if (elems[i].isVisible) {
						elems[i].diallogObj.hide();
						e.stopPropagation();
					}
				}
			});
		}

		var elems = cover.data('elems');
		if(_opt.cover_hide){
			elems.push({
				'id': _opt.id,
				'diallogObj': _this,
				'isVisible': false
			});
		}

		// 调整位置和样式,并阻止click事件的冒泡
		obj.hide().css({
			'position': 'fixed',
			'max-height': window.innerHeight-20,
			'overflow-y': 'auto',
			'display': 'block',
			'visibility': 'hidden',
			'opacity': 0,
			'z-index': 1000,
			'box-sizing': 'border-box'
		}).unbind('click').bind('click', function(e) {
			e.stopPropagation();
		});

		// 使用动画变换
		if (_opt.ani_show) {
			obj.css({
				'transition-property': 'opacity, top, bottom',
				'transition-duration': '.1s'
			});
		}

		// 附加可选的样式
		if (_opt.style) {
			obj.css(_opt.style);
		}

		// 绑定关闭事件
		if (_opt.close_btn) {
			var btns = _opt.close_btn.split('|');
			for (var i in btns) {
				$(btns[i]).bind('click', _this.hide);
			}
		}

		if (!_opt.close_btn && !_opt.cover_hide) {
			// 创建默认的关闭按钮
			var dialog_close_btn = $('#dialog_close_btn');
			if (dialog_close_btn.size() < 1) {
				dialog_close_btn = $('<div>&Chi;</div>').attr('id', 'dialog_close_btn').css({
					'float': 'right',
					'color': '#161615',
					'font-size': '.5em',
                    'background': '#FFF',
					'border-radius': '15px',
					'width': '30px',
					'height': '30px',
					'text-align': 'center',
					'line-height': '30px',
					'margin': '10px 10px 0px 0px',
					'overflow': 'hidden'
				});
				dialog_close_btn.appendTo(cover);
			}
			dialog_close_btn.bind('click', function() {
				_this.hide();
			});
		}

		// 监听窗口变化，解决弹出键盘时看不见输入框的问题
		$(window).bind('resize', function() {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function(){
				if (_opt.position != 'top' && _opt.position != 'bottom') {
					obj.css({
						'bottom': (window.innerHeight - $(obj).outerHeight()) / 2
					});
				}
			},300);
		});


	};

	// 隐藏
	this.hide = function() {
		cover.hide();
		obj.css(obj.data('hide-css'));
		var elems = cover.data('elems');
		for (var i in elems) {
			if (elems[i].id === _opt.id) {
				elems[i].isVisible = false;
			}
		}

		// 执行回调
		if (_opt.close_callback) {
			_opt.close_callback();
		}
	};

	// 显示
	this.show = function() {
		switch (_opt.position) {
			case 'top':
				obj.css({
					'top': '-100%'
				}).data('hide-css', {
					'top': '-100%',
					'opacity': 0,
					'visibility': 'hidden'
				}).data('show-css', {
					'top': 0,
					'opacity': 1,
					'visibility': 'visible'
				});
				break;
			case 'bottom':
				obj.css({
					'bottom': '-100%'
				}).data('hide-css', {
					'bottom': '-100%',
					'opacity': 0,
					'visibility': 'hidden'
				}).data('show-css', {
					'bottom': 0,
					'opacity': 1,
					'visibility': 'visible'
				});
				break;
			case 'middle':
			default:
				obj.css({
					'bottom': (window.innerHeight - $(obj).outerHeight()) / 2
				}).data('hide-css', {
					'opacity': 0,
					'visibility': 'hidden'
				}).data('show-css', {
					'opacity': 1,
					'visibility': 'visible'
				});
				break;
		}
		cover.show();
		$(window).resize(); // 手动触发窗口大小改变，避免部分手机收起键盘不触发
		//getComputedStyle(obj.get(0)).bottom; // 触发css计算，避免动画失效
		obj.css(obj.data('show-css'));
		var elems = cover.data('elems');
		for (var i in elems) {
			if (elems[i].id === _opt.id) {
				elems[i].isVisible = true;
			}
		}
	};

	// 执行初始化
	this.init();
};

if ("object" == typeof module && "object" == typeof module.exports) {
	module.exports = Dialog;
} 
});