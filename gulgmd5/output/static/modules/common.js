define('common', function(require, exports, module){ /**
 * 通用函数，依赖jquery、jquery.base.js
 */

window.$ = window.jQuery = require("jquery");
window.baseJS = require("jquery.base");

// 是否开启调试
window.debugModel = true;

// 修复部分低端机不支持location部分属性的问题
window.location.origin = (window.location.origin || ( location.protocol + "//" + location.host));
// 后端服务接口地址
var serverPath = "/kbwx_server";
window.server = window.location.origin + serverPath;
//window.server = 'http://127.0.0.1:8877';

$(function () {

    // 使body高度不低于屏幕高
    $('body').css('min-height', $(window).height());
    $('.bg').css('min-height', $(window).height());

    // 阻止ios下默认双击 自动缩放/内容居中 事件
    var system = baseJS.App.getSystem();
    if (system.ios) {
        var action;
        $('body').bind('touchend', function (event) {
            var now = new Date().getTime();
            var lastTouch = $(this).data('lastTouch') || now + 1;
            var delta = now - lastTouch;
            clearTimeout(action);
            if (delta < 500 && delta > 0) {
                // 双击事件
                event.preventDefault();
            } else {
                $(this).data('lastTouch', now);
                action = setTimeout(function (e) {
                    clearTimeout(action);
                }, 500, [event]);
            }
            $(this).data('lastTouch', now);
        });
    }
});

var system = baseJS.App.getSystem();
if (!system.android) {
    /* 重写弹窗,解决ios webview下会显示网址的问题 */
    window.alert = function (str) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert("\n" + str);
        iframe.parentNode.removeChild(iframe);
    };

    window.confirm = function (str) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var rs = window.frames[0].window.confirm("\n" + str);
        iframe.parentNode.removeChild(iframe);

        return rs;
    };

    window.prompt = function (str) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        var rs = window.frames[0].window.prompt("\n" + str);
        iframe.parentNode.removeChild(iframe);

        return rs;
    };
}

/* 新窗口中打开页面 */
window.newtab = function (url) {
    if (url.indexOf("http:") !== 0 || url.indexOf("https:") !== 0) {
        var pathname = url.indexOf('/') === 0 ? "" : window.location.pathname;
        url = window.location.origin + pathname + url;
    }
    if (system.xs) {
        window.location.href = 'newtab:' + url;
    } else {
        window.open(url, '_blank');
    }
};

/* 绑定所有的_blank链接以新窗口方式打开 */
$('body').on("click", "a[target=_blank]", function () {
    newtab($(this).attr('href').replace(/^newtab:/, ""));
    return false;
});
// 防止app的新窗口事件先执行
$('a[target=_blank]').on("click", function () {
    newtab($(this).attr('href').replace(/^newtab:/, ""));
    return false;
});

// 系统异常监听
window.addEventListener('error', function (err) {
    if (debugModel) {
        alert("出错啦！\n" + err.message + "\n" + err.filename + " : " + err.lineno + "|" + err.colno);
    }
});

/** 获取url传参 **/
// 获取指定参数值
window.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    return r != null ? decodeURI(r[2]) : null;
};
// 获取整个参数字符串（无？符号）
window.getAllUrlParam = function () {
    return window.location.search.substr(1);
};
// 字符串参数转为对象
window.strParamToObj = function (strParam) {
    var objParam = {};
    strParam = strParam.replace(/^\?/, "");
    var arr = strParam.split("&");
    for (var i in arr) {
        item = arr[i].split("=");
        objParam[item[0]] = objParam[item[0]] ? (objParam[item[0]] + "," + item[1]) : item[1];
    }
    return objParam;
};
// 拼接url和参数字符串
window.getNewUrl = function (url, params) {
    var ex = url.indexOf("?") === -1 ? "?" : "&";
    return url + ex + params;
};

// 进入购物车
window.gotoCart = function () {
    window.location.href = "/app/user/cart.html";
};

/** cookies 操作 **/
window.getCookie = function (name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) return decodeURI(arr[1]);
    }
    return "";
};

// 获取商店名称
window.getShopName = function () {
    return getCookie("shopName") || "扫码购物";
};
// 获取购物车数量
window.getCartItemCount = function () {
    return getCookie("getCartItemCount") || 0;
};

// 金额格式化
window.toMoney = function (money) {
    return (parseFloat(money) || 0).toFixed(2);
};

// 默认全局app响应事件
window.onresume = window.onresume || function () {
        console.error("default onresume function !");
};

window.initPageParam = window.initPageParam || "";

window.closeAutoCallback = window.closeAutoCallback || function () {
        // 默认为自动更新购物车
        if (initPageParam) {
            var system = baseJS.App.getSystem();

            var json = initPageParam.replace(/carItemCount":"\d*"/, 'carItemCount":"' + getCartItemCount() + '"');
            if (!system.xs) {
                this._callplus('initPage', '', json);
                return;
            }

            if (system.android) {
                window.AndroidToJs.jsPushDataToAndroid("index", json);
            } else if (system.ios) {
                var url = encodeURI("http://smg/{\"dataType\":\"changebtnType\",\"jsonData\":" + json + "}");
                baseJS.App.iosCall(url);
            }
        }
        console.info("default closeAutoCallback function which update cart number!");
};

window.paySuccessCallback = window.paySuccessCallback || function () {
        console.error("default paySuccessCallback function !");
};

window.passwordSetCallback = window.passwordSetCallback || function () {
        console.error("default passwordSetCallback function !");
};

window.recharge = window.recharge || function () {
        console.error("default recharge function !");
};

window.orderOverCallback = window.closeAutoCallback || function () {
        console.error("default orderOverCallback function !");
};

// 默认图片
window.defaultProImg = "/static/img/products/default_pro.png"; // 默认产品图 290*290
window.defaultImg_612_250 = "/static/img/products/default_612_250.png"; // 大专场、宝贝详情
window.defaultImg_300_170 = "/static/img/products/default_300_170.png"; // 小专场

// 跳转到搜索
window.goSearch = function (str) {
    window.location.href = "/app/category/search.html?s=" + str;
};

// 检查文件大小
window.checkFileSize = function (obj, fileSize) {
    var filepath = $(obj).val();
    if (is_null(filepath)){
        return true;
    }
    var file_size = 0;
    if ($.support.leadingWhitespace) {
        var img = new Image();
        img.src = filepath;
        if (img.fileSize > 0) {
            if (img.fileSize > fileSize * 1024) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        file_size = $(obj)[0].files[0].size;
        var size = file_size / 1024;
        if (size > fileSize) {
            return false;
        } else {
            return true;
        }
    }
    return true;
};

// ps:注意将同名的放在一个数组里
/*
 var tenantjson={"tenantid":tenantid};
 var sss=getFormJson($('#addrForm'),tenantjson);
 //var sss=$.extend(tenantjson,sss);
 alert(JSON.stringify(sss));
 */
window.getFormJson = function (form, param) {
    var o = {};
    var a = $(form).serializeArray();
    a.push(param);
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

/**
 * 跳转到系统登录
 */
window.gotoLogin = function () {
    window.location = "/wap/user/login.html";
}

/**
 * 统一提示
 */
window.showMsg = function (msg) {
    alert(msg);
}

window.is_null=function (obj)
{
    return obj == null || obj == '' || obj == 'undefined' || obj == undefined;
}

window.is_not_null= function (obj)
{
    return obj != '' && obj != null && obj != undefined && obj != 'undefined';
} 
});