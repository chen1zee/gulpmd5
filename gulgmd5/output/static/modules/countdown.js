define('countdown', function(require, exports, module){ /*倒计时图片*/
window.daojishi = function(opts) {
	var defaults = {
		pName: 'sh_time', //隐藏时间的name，用来获取时间字符串，sh_time
		timeId: '', //图片时间外层div的id
		setTime: '', //本地时间
		fn: '', //回调函数
		tipeObj: '', //回调函数参数
		serverTime: '' //服务器时间
	};
	/*用户覆盖默认参数*/
	for (var key in opts) {
		defaults[key] = opts[key];
	}
	var oP = document.getElementsByClassName(defaults.pName);
	var timer = null;
	var oTimer = document.getElementById(defaults.timeId);
	var aSpan = oTimer.getElementsByTagName('span');
	var t = Math.floor((defaults.setTime - defaults.serverTime) / 1000);
	var localEndTime = defaults.setTime - defaults.serverTime + new Date().getTime();
	//positionX值
	var aPosition = ["0px", "-18px", "-31px", "-45px", "-58px", "-71px", "-84px", "-97px", "-110px", "-123px", "-136px"]; 
	clearInterval(timer);
	timer = setInterval(function() {
		var t = Math.floor((localEndTime - new Date().getTime()) / 1000);
		if (t >= 0) {
			//设置一个隐藏的时间，用来获取时间字符串的长度
			var str = toTwo(Math.floor(t / 3600)) + ':' + toTwo(Math.floor(t % 3600 / 60)) + ':' + toTwo(Math.floor(t % 60));
			for (var p = 0; p < oP.length; p++) {
				oP[p].innerHTML = str;

			}

			for (var b = 0, len = aSpan.length; b < len; b++) {
				var ii = str.charAt(b) == ':' ? 0 : parseInt(str.charAt(b)) + 1;
				aSpan[b].style.backgroundPositionX = aPosition[ii];
			}

		} else {
			defaults.fn && defaults.fn(defaults.tipeObj);
			clearInterval(timer);
		}

	}, 1000);
};

/*倒计时数字*/
window.daojishiNum = function(obj, fn, setTime, serverTime) {
	var timer = null;
	var tt = 0;
	var reStr2 = null;
	var oNumTime = document.getElementById(obj);
	var localEndTime = setTime - serverTime + new Date().getTime();
	clearInterval(timer);
	timer = setInterval(function() {
		var tt = Math.floor((localEndTime - new Date().getTime()) / 1000);
		if(tt<0)tt=0;
		
		reStr2 = '<span id="hour_' + obj + '" class="hour">' + toTwo(Math.floor(tt / 3600)) + '</span>:<span id="min_' + obj + '">' + toTwo(Math.floor(tt % 3600 / 60)) + '</span>:<span id="sec_' + obj + '">' + toTwo(tt % 60) + '</span>';
			
		if (tt == 0) {
			clearInterval(timer);
		}
		oNumTime.innerHTML = reStr2; //设置一个隐藏的时间，用来获取时间字符串的长度
		fn && fn(tt);
	}, 1000);
	return daojishiNum;
};

/*补0函数*/
window.toTwo = function(n) {
	return n < 10 ? '0' + n : +n;
}; 
});