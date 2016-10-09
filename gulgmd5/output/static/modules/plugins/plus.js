define('plugins/plus', function(require, exports, module){ /*
 * 附加库
 * 在没有app支持的设备上提供基础模拟支持
 * @require style/plus.css
 */
var $ = jQuery = require("jquery");
var plus = {
	initPage: function(json) { // 初始化整体显示

		json = eval('(' + json + ')');

		// 初始化底部导航
		if (json['isShow'] == 1) {
			$('#plus_footer').remove();
			var tabbar_json = localStorage.getItem('tabbar_json');
			tabbar_json = eval('(' + tabbar_json + ')');

			var tabbar = '<div id="plus_footer">';
			tabbar += '<a href="' + tabbar_json[0].url + '" class="tabbar_home" ><span>'+tabbar_json[0].pageName+'</span></a>';
			tabbar += '<a href="' + tabbar_json[1].url + '" class="tabbar_search" ><span>'+tabbar_json[1].pageName+'</span></a>';
			tabbar += '<a href="' + tabbar_json[2].url + '" class="tabbar_user" ><span>'+tabbar_json[2].pageName+'</span></a>';
			tabbar += '</div>';

			$('body').css('padding-bottom', '60px').append($(tabbar));

			// 高亮
			var index = parseInt(json['selectedIndex']) - 1;
			if (index >= 0 && index <= 2) {
				$('#plus_footer a:eq(' + index + ')').addClass('hover');
			}
		}

		// 初始化顶部标题栏
		$('#plus_header').remove();
		var header = '<div id="plus_header">';
		
		if (json['backShow'] == 1)
			header += '<div class="head_back" onclick="history.go(-1);//window.open(\'\',\'_self\');window.close();"></div>';
		header += '<div class="head_title">' + json['title'] + '</div>';
		if (json['rightBtnType'] == 1)
			header += '<div class="head_cart" onclick="' + json['callback'] + '();"></div>';
		if (json['rightBtnType'] == 2)
			header += '<div class="head_delete" onclick="' + json['callback'] + '();">' + (json['rightBtnText'] || '删除') + '</div>';
		header += '</div>';
		$('body').css('padding-top', '50px').append($(header));

	},
	sendToApp: {
		init: function(json) { // 初始化底部导航
			if ($('#plus_footer').size() > 0)
				return;

			localStorage.setItem('tabbar_json', json);
			json = eval('(' + json + ')');
			window.location.href = json[0].url;

		},
		close: function(json) { // 关闭标签页
			window.close();
		},
		flushAlert: function(json) {
			json = eval('(' + json + ')');
			alert(json['text']);
			//var toast = $('#toast');
		},
		encrypt: function(json) {
			json = eval('(' + json + ')');
			var callback = json['callback'];
			var data = "auth=232323232323222222"; //json['data'];
			window[callback](data);
		},
		recharge: function(json) {
			json = eval('(' + json + ')');
			var callback = json['callback'];
			window[callback]();
		},
		reload: function() {
			alert("session超时，未登录");
		}
	},
	showPicture: function() { // @todo
		return;
	},
    getAppInfo: function() {
        // 获取app名及版本号
        window.appInfo = "{\"name\": \"扫码购\", \"version\": \"2.0.0\"}";
    }
};

if ("object" == typeof module && "object" == typeof module.exports) {
	module.exports = plus;
} 
});