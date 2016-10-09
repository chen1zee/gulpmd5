define('jquery.base', function(require, exports, module){ /*
 * 项目公共JS类库
 */
var $ = jQuery = require("jquery");
var baseJS = baseJS || {};
(function ($) {
    var objectPrototype = Object.prototype, toString = objectPrototype.toString;

    baseJS.core = {
        isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined)
                || (!allowEmptyString ? value === '' : false)
                || (this.isArray(value) && value.length === 0);
        },
        isArray: ('isArray' in Array) ? Array.isArray : function (value) {
            return toString.call(value) === '[object Array]';
        },
        isDate: function (value) {
            return toString.call(value) === '[object Date]';
        },
        isObject: (toString.call(null) === '[object Object]') ? function (value) {
            return value !== null && value !== undefined
                && toString.call(value) === '[object Object]'
                && value.ownerDocument === undefined;
        }
            : function (value) {
            return toString.call(value) === '[object Object]';
        },
        isSimpleObject: function (value) {
            return value instanceof Object && value.constructor === Object;
        },
        isPrimitive: function (value) {
            var type = typeof value;
            return type === 'string' || type === 'number' || type === 'boolean';
        },
        isFunction: (typeof document !== 'undefined' && typeof document
            .getElementsByTagName('body') === 'function') ? function (value) {
            return toString.call(value) === '[object Function]';
        }
            : function (value) {
            return typeof value === 'function';
        },
        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },
        isNumeric: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        isString: function (value) {
            return typeof value === 'string';
        },
        isBoolean: function (value) {
            return typeof value === 'boolean';
        },
        isDefined: function (value) {
            return typeof value !== 'undefined';
        }
    };

    baseJS.string = {
        /**
         * Appends content to the query string of a URL, handling logic for
         * whether to place a question mark or ampersand.
         *
         * @param {String}
         *            url The URL to append to.
         * @param {String}
         *            string The content to append to the URL.
         * @return {String} The resulting URL
         */
        urlAppend: function (url, string) {
            if (!baseJS.core.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }
            return url;
        },
        /**
         * Trims whitespace from either end of a string, leaving spaces within
         * the string intact. Example: var s = ' foo bar '; alert('-' + s +
         * '-'); //alerts "- foo bar -" alert('-' + baseJS.string.trim(s) +
         * '-'); //alerts "-foo bar-"
         *
         * @param {String}
         *            string The string to escape
         * @return {String} The trimmed string
         */
        trim: function (string) {
            var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
            return string.replace(trimRegex, "");
        },
        /**
         * Capitalize the given string
         *
         * @param {String}
         *            string
         * @return {String}
         */
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        /**
         * Uncapitalize the given string
         *
         * @param {String}
         *            string
         * @return {String}
         */
        uncapitalize: function (string) {
            return string.charAt(0).toLowerCase() + string.substr(1);
        },
        /**
         * Truncate a string and add an ellipsis ('...') to the end if it
         * exceeds the specified length
         *
         * @param {String}
         *            value The string to truncate
         * @param {Number}
         *            length The maximum length to allow before truncating
         * @param {Boolean}
         *            word True to try to find a common word break
         * @return {String} The converted text
         */
        ellipsis: function (value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2), index = Math.max(vs
                        .lastIndexOf(' '), vs.lastIndexOf('.'), vs
                        .lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },
        /**
         * var sort = baseJS.string.toggle(sort, 'ASC', 'DESC');
         *
         * instead of conditional logic: var sort = (sort == 'ASC' ? 'DESC' :
         * 'ASC');
         *
         * @param string
         * @param value
         * @param other
         * @returns {String}
         */
        toggle: function (string, value, other) {
            return string === value ? other : value;
        },
        /**
         * var s = baseJS.string.repeat('---', 4); // = '------------' var t =
         * baseJS.string..repeat('--', 3, '/'); // = '--/--/--'
         *
         * @param pattern
         * @param count
         * @param sep
         * @returns {string}
         */
        repeat: function (pattern, count, sep) {
            for (var buf = [], i = count; i--;) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },
        /**
         * var s = Ext.String.leftPad('123', 5, '0'); //00123
         *
         * @param string
         * @param size
         * @param character
         * @returns {string}
         */
        leftPad: function (string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        }
    };

    baseJS.form = {
        /**
         * 将form表单元素的值序列化成对象
         *
         * @param form
         *            表单ID
         * @returns object
         */
        serializeObject: function (form) {
            var o = {};
            $.each(form.serializeArray(), function (index) {
                if (o[this['name']]) {
                    o[this['name']] = o[this['name']] + "," + this['value'];
                } else {
                    o[this['name']] = this['value'];
                }
            });
            return o;
        }
    };

    baseJS.util = {
        /**
         * 格式化字符串
         * 使用方法：baseJS.util.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
         *
         * @param str
         * @returns 格式化后的字符串
         */
        formatString: function (str) {
            for (var i = 0; i < arguments.length - 1; i++) {
                str = str.replace("{" + i + "}", arguments[i + 1]);
            }
            return str;
        },
        /**
         * $Post方法
         *
         */
        doPost: function (url, param, fn) {
            $.post(url, param, function (data) {
                fn.call(this, data);
            });
        },
        /**
         * 异步请求
         * baseJS.util.doRequest('myform',ctx+'/user/list',{username:'liming'},function(backDataz){})
         *
         * @param form
         *            表单ID
         * @param url
         *            请求路径
         * @param param
         *            参数对象，如：{a: 'test', b: 2}
         * @param fn
         *            回调函数
         */
        doRequest: function (form, url, param, fn, async) {
            var params = form || param || {};
            if (typeof form == 'string') {
                params = $.extend(param || {}, baseJS.form
                    .serializeObject($("#" + form)));
            }

            if ("undefined" === typeof async) async = true;

            $.ajax({
                type: 'POST',
                url: url,
                data: params,
                async: async,
                dataType: 'json',
                //contentType:"application/json",//;charset=UTF-8
                cache: false,
                success: function (data, textStatus) {
                    if (typeof (fn) == 'function') {
                        if (data.status == 'unlogin') {
                            baseJS.App.sendToApp("reload", "\"\"");
                            //alert("session超时，请重新进入商城");
                        } else {
                            fn.call(this, data);
                        }

                    }
                },
                error: function (xhr) {
                    if (xhr.status == "200") { // 兼容调试时301/302重定向导致触发error的问题
                        console.log(xhr);
                        this.success(eval('(' + xhr.responseText + ')'), xhr.statusText);
                        return;
                    }
                    alert("请求失败!");
                    return;
                },
                beforeSend: function () {
                },
                complete: function (event, request) {
//					var a = event.responseJSON.status;
//					if("unlogin"===a){
//						alert("需要重新登录");
//					}
                }
            });
        },
        /**
         * JS版Hashmap var userMap = new baseJS.util.HashMap();
         * userMap.put("username","zhangsha"); userMap.put("age",32);
         * alert(userMap.toString());
         *
         * @constructor
         */
        HashMap: function () {
            var size = 0;
            var entry = new Object();

            this.put = function (key, value) {
                entry[key] = value;
                size++;
            };

            this.putAll = function (map) {
                if (typeof map == "object" && !map.sort) {
                    for (var key in map) {
                        this.put(key, map[key]);
                    }
                } else {
                    throw "input type error,must HashMap type！";
                }
            };

            this.get = function (key) {
                return entry[key];
            };

            this.remove = function (key) {
                if (size == 0)
                    return;
                delete entry[key];
                size--;
            };

            this.containsKey = function (key) {
                if (entry[key]) {
                    return true;
                }
                return false;
            };

            this.containsValue = function (value) {
                for (var key in entry) {
                    if (entry[key] == value) {
                        return true;
                    }
                }
                return false;
            };

            this.clear = function () {
                entry = new Object();
                size = 0;
            };

            this.isEmpty = function () {
                return size == 0;
            };

            this.size = function () {
                return size;
            };

            this.keySet = function () {
                var keys = new Array();
                for (var key in entry) {
                    keys.push(key);
                }
                return keys;
            };

            this.entrySet = function () {
                var entrys = new Array();
                for (var key in entry) {
                    var et = new Object();
                    et[key] = entry[key];
                    entrys.push(et);
                }
                return entrys;
            };

            this.values = function () {
                var values = new Array();
                for (var key in entry) {
                    values.push(entry[key]);
                }
                return values;
            };

            this.each = function (cb) {
                for (var key in entry) {
                    cb.call(this, key, entry[key]);
                }
            };

            this.toString = function () {
                return obj2str(entry);
            };

            function obj2str(o) {
                var r = new Array();
                if (typeof o == "string")
                    return "\""
                        + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g,
                            "\\n").replace(/(\r)/g, "\\r").replace(
                            /(\t)/g, "\\t") + "\"";
                if (typeof o == "object") {
                    for (var i in o)
                        r.push("\"" + i + "\":" + obj2str(o[i]));
                    if (!!document.all
                        && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/
                            .test(o.toString)) {
                        r.push("toString:" + o.toString.toString());
                    }
                    r = "{" + r.join() + "}";
                    return r;
                }
                return o.toString();
            }
        }
    };
    baseJS.App = {
        /**
         * @param pageName: String ，标题名称
         * @param isShow: num ，0:不显示底部导航 ，1:显示底部导航
         * @param selectedIndex:num ，1:首页高亮显示 ，2:搜索高亮 3：我的高亮
         * @param rightBtnType: num ，0：空白 1：购物车 2：文字按钮，默认为删除
         * @param rightBtnText: string , 按钮文字， rightBtnType设置为2时需要
         * @param backShow：num, 0:头部回退按钮是否显示，0不显示，1显示
         * @param carItemCount：num   购物车货物数量
         * @param callback: String ，回调函数名称
         */
        initPage: function (pageName, isShow, selectedIndex, rightBtnType, rightBtnText, backShow, carItemCount,
                            callback) {
            var system = baseJS.App.getSystem();

            var json = "{\"title\":\"" + pageName
                + "\",\"backShow\":\"" + backShow
                + "\",\"carItemCount\":\"" + carItemCount
                + "\",\"isShow\":\"" + isShow
                + "\",\"selectedIndex\":\"" + selectedIndex
                + "\",\"rightBtnType\":\"" + rightBtnType
                + "\",\"rightBtnText\":\"" + rightBtnText
                + "\",\"callback\":\"" + callback + "\"}";

            if (rightBtnType == 1) {
                window.initPageParam = json;
            }
            if (!system.xs) {
                this._callplus('initPage', '', json);
                return;
            }

            if (system.android) {
                window.AndroidToJs.jsPushDataToAndroid("index", json);
            } else if (system.ios) {
                var url = encodeURI("http://xs/{\"dataType\":\"changebtnType\",\"jsonData\":"
                    + json + "}");
                baseJS.App.iosCall(url);
            }
        },
        sendToApp: function (tag, json) {
            var system = baseJS.App.getSystem();

            if (!system.xs) {
                this._callplus('sendToApp', tag, json);
                return;
            }

            if (system.android) {
//				alert("come in sendToApp");
                window.AndroidToJs.jsPushDataToAndroid(tag, json);
            } else if (system.ios) {
                json = "{\"dataType\":\"" + tag + "\"," + "\"jsonData\":"
                    + json + "}";
                var url = encodeURI("http://xs/" + json);
                baseJS.App.iosCall(url);
            }
        },
        showPicture: function (json) {
            var system = baseJS.App.getSystem();

            if (!system.xs) {
                return;
            }

            if (system.android) {
                window.AndroidToJs.showGoodsImgs(json);
            } else if (system.ios) {
                json = "{\"dataType\":\"zoomPicture\"," + "\"jsonData\":"
                    + json + "}";
                var url = encodeURI("http://xs/" + json);
                baseJS.App.iosCall(url);
            }
        },
        showToast: function (str) {
            var system = baseJS.App.getSystem();

            if (!system.xs) {
                this._callplus('showToast', false, str);
                return;
            }

            if (system.android) {
                window.AndroidToJs.showToast(str);
            } else if (system.ios) {
                str = "{\"dataType\":\"showToast\"," + "\"jsonData\":"
                    + str + "}";
                var url = encodeURI("http://xs/" + str);
                baseJS.App.iosCall(url);
            }
        },
        getAppInfo: function () {
            var system = baseJS.App.getSystem();
            if (!system.xs) {
                this._callplus('getAppInfo', false, "");
                return;
            }
            if (system.android) {
                window.appInfo = window.AndroidToJs.getAppInfo();
            } else if (system.ios) {
                var str = '{\"callback\": \"getAppInfo\"}';
                str = "{\"dataType\":\"getAppInfo\"," + "\"jsonData\":"
                    + str + "}";
                var url = encodeURI("http://xs/" + str);
                baseJS.App.iosCall(url);
            }
        },
        iosCall: function (url) {
            iosCallFrame = $('<iframe id="iosCallFrame" src="' + url + '" style="display:none;"  ></iframe>').prependTo('body');
            //setTimeout(iosCallFrame.remove(),3000);
        },
        getSystem: function () {
            var browser = {
                versions: function () {
                    var u = navigator.userAgent;
                    return {// 移动终端浏览器版本信息
                        android: u.indexOf('Android') > -1
                        || u.indexOf('Adr') > -1, // android终端
                        ios: u.indexOf('iPh') > -1 || u.indexOf('iOS') > -1
                        || u.indexOf('iPad') > -1, // 是否为iPhone
                        xs: u.indexOf('SMG_') > -1
                        // 是否是SMG
                    };
                }()
            };
            return browser.versions;
        },
        _callplus: function (func, tag, json) { // 调用附加库
            if ("undefined" == typeof (plus)) {
                plus = require("plugins/plus");
            }

            var call_func;
            if (func in plus) {
                call_func = plus[func];
            } else {
                return;
            }

            if (tag && tag in call_func) {
                call_func = plus[func][tag];
            }

            call_func.call(plus, [json]);
        }
    };
})(jQuery);

if ("object" == typeof module && "object" == typeof module.exports) {
    module.exports = baseJS;
} 
});