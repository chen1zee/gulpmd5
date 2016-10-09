define('loadmore', function(require, exports, module){ /*
	by ifindever 2014/09/04
	website: http://ifindever.com
    depend on jquery.min.js
*/

var $ = jQuery = require("jquery");
var Loadmore = function(_opt) {
	// 默认参数
	var opt = {
		'id': '', // 必须  要加载更多的容器id
		'initUrl': '', // 可选  初始化数据请求url 如果为空，则初始化时不会加载内容,initurl和moreurl必须至少定义一个
		'loadButtonClass': 'load_more', //  可选  加载更多按钮的类名 默认为load_more
		'moreUrl': '', // 可选  加载更多的url  默认为initUrl(翻页的参数值位置请用{pageValue}替代)
		'page': 1, // 可选  起始页面 默认为1
		'queryType': 'get', // 可选  发送请求方式get|post  默认get（预留，当前固定使用get）
		'loadType': 'both', // 可选  加载更多的触发方式both|button|scroll 默认both(button必选)
		'queryCallback': '' // 可选  请求回调函数，成功请求到数据后触发
	};

	// 合并参数
	opt = $.extend(opt, _opt);
	
	// 当前对象
	var _this = this;
	
	// 滚动事件处理函数
	var srcollHandler = function(){
		if (_this.loadlock || _this.temploadlock || _this.srcollloadlock) return;
		var scrollTop = $(window).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(window).height();

		// 提前100px进行判断，解决部分机型sroll事件发送间隔太长的问题，增强体验
		if (scrollTop + windowHeight + 100 >= scrollHeight) {
			_this.load();
		}
	};
	
	// 初始化
	this.init = function() {
		// 数据初始化
		var wrapBox = $('#' + opt.id);
		_this.loadlock = false; // 锁
		_this.temploadlock = false; // 临时锁
		_this.srcollloadlock = false; // 滚动加载锁
		_this.loadMoreButton = wrapBox.find('.' + opt.loadButtonClass);
		if (opt.moreUrl == '') opt.moreUrl = opt.initUrl;
		_this.changeLoadLayer(0, '');

		// 绑定滚动事件
		if ('both' == opt.loadType || 'scroll' == opt.loadType) {
			$(window).bind('scroll', srcollHandler);
		}

		// 绑定按钮点击事件
		if ('both' == opt.loadType || 'button' == opt.loadType) {
			$(_this.loadMoreButton).bind('click', function() {
				if (_this.loadlock || _this.temploadlock) return;
				_this.load();
			});
		}
		return _this;
	};

	// 加载内容
	this.load = function() {
		_this.loadlock = true;
		_this.changeLoadLayer(1, '');

		// 如果有初始化url则使用初始化url
		var url = opt.initUrl ? opt.initUrl : opt.moreUrl;
		url = url.replace(/\{pageValue\}/gi, opt.page);

		// 开始加载,返回json，包含status(int 状态)、data（string 数据）两个属性
		$.getJSON(url, function(data) {

			// 判断是否加载到数据
			if (data.data && data.data.length > 0) {
				// 成功请求到数据后，回调方法,并得到处理后的值
				if (opt.queryCallback && "function" == typeof opt.queryCallback) {
					data.data = opt.queryCallback(data.data);
				}
				$(data.data).insertBefore(_this.loadMoreButton);
				opt.initUrl = null;
				opt.page++;
			}

			// 未登录判断
			if (data.status == 'unlogin') {
				_this.changeLoadLayer(2, '');
				_this.loadlock = false;
				_this.srcollloadlock = true;
				baseJS.App.sendToApp("reload", "\"\"");
				return false;
			}
			// 判断是否需要继续加载
			if (data.status < 0) { // 阻止继续加载
				_this.changeLoadLayer(3, data.message);
			} else if (data.status == 0 || typeof(data.status) === "undefined") { // 加载失败，不阻止继续加载
				_this.changeLoadLayer(2, data.message);
				_this.loadlock = false;
				_this.srcollloadlock = true;
			} else { // 加载成功，继续加载
				_this.changeLoadLayer(0, '');
				_this.loadlock = false;
				_this.srcollloadlock = false;
				_this.checkStatus();
			}

		}).error(function() {
			_this.changeLoadLayer(2, '');
			_this.loadlock = false;
			_this.srcollloadlock = true;
		});

	};

	// 检查内容是否已填满屏幕，如未填满，则继续加载
	this.checkStatus = function() {
		if (_this.loadlock || _this.temploadlock) return;
		if ($('body').height() <= $(window).height()) {
			_this.load();
		}
	};

	// 更改load状态
	this.changeLoadLayer = function(type, txt) {
		var html = '';
		switch (type) {
			case 0: // 等待触发加载
				html = '<img src="' + '/static/img/ico/loadmore.png' + '" alt="加载更多" /><span>' + (txt || '点击加载更多') + '</span>';
				break;
			case 1: // 加载中
				html = '<img src="' + '/static/img/ico/loading.png' + '" alt="加载中" /><span>' + (txt || '加载中...') + '</span>';
				break;
			case 2: // 加载失败 refresh.png
				html = '<img src="' + '/static/img/ico/loadmore.png' + '" alt="加载失败" /><span>' + (txt || '加载失败，点击重试') + '</span>';
				break;
			case 3: // 加载完成
				html = '<span>' + (txt || '没有数据了哦，亲') + '</span>';
				break;
			default:
				html = '<img src="' + '/static/img/ico/loadmore.png' + '" alt="加载更多" /><span>' + (txt || '点击加载更多') + '</span>';
				break;
		}

		_this.loadMoreButton.html(html);
	};
	
	// 解绑事件
	this.unbindEventHandler = function(){
		$(window).unbind('scroll', srcollHandler);
		_this.loadMoreButton.unbind('click');
	};

};

if ( "object"==typeof module&&"object"==typeof module.exports ) {
	module.exports = Loadmore;
} 
});