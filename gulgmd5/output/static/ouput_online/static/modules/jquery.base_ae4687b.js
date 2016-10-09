define("jquery.base",function(require,exports,module){var $=jQuery=require("jquery"),baseJS=baseJS||{};!function($){var objectPrototype=Object.prototype,toString=objectPrototype.toString;baseJS.core={isEmpty:function(t,n){return null===t||void 0===t||(n?!1:""===t)||this.isArray(t)&&0===t.length},isArray:"isArray"in Array?Array.isArray:function(t){return"[object Array]"===toString.call(t)},isDate:function(t){return"[object Date]"===toString.call(t)},isObject:"[object Object]"===toString.call(null)?function(t){return null!==t&&void 0!==t&&"[object Object]"===toString.call(t)&&void 0===t.ownerDocument}:function(t){return"[object Object]"===toString.call(t)},isSimpleObject:function(t){return t instanceof Object&&t.constructor===Object},isPrimitive:function(t){var n=typeof t;return"string"===n||"number"===n||"boolean"===n},isFunction:"undefined"!=typeof document&&"function"==typeof document.getElementsByTagName("body")?function(t){return"[object Function]"===toString.call(t)}:function(t){return"function"==typeof t},isNumber:function(t){return"number"==typeof t&&isFinite(t)},isNumeric:function(t){return!isNaN(parseFloat(t))&&isFinite(t)},isString:function(t){return"string"==typeof t},isBoolean:function(t){return"boolean"==typeof t},isDefined:function(t){return"undefined"!=typeof t}},baseJS.string={urlAppend:function(t,n){return baseJS.core.isEmpty(n)?t:t+(-1===t.indexOf("?")?"?":"&")+n},trim:function(t){var n=/^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;return t.replace(n,"")},capitalize:function(t){return t.charAt(0).toUpperCase()+t.substr(1)},uncapitalize:function(t){return t.charAt(0).toLowerCase()+t.substr(1)},ellipsis:function(t,n,e){if(t&&t.length>n){if(e){var r=t.substr(0,n-2),i=Math.max(r.lastIndexOf(" "),r.lastIndexOf("."),r.lastIndexOf("!"),r.lastIndexOf("?"));if(-1!==i&&i>=n-15)return r.substr(0,i)+"..."}return t.substr(0,n-3)+"..."}return t},toggle:function(t,n,e){return t===n?e:n},repeat:function(t,n,e){for(var r=[],i=n;i--;)r.push(t);return r.join(e||"")},leftPad:function(t,n,e){var r=String(t);for(e=e||" ";r.length<n;)r=e+r;return r}},baseJS.form={serializeObject:function(t){var n={};return $.each(t.serializeArray(),function(){n[this.name]=n[this.name]?n[this.name]+","+this.value:this.value}),n}},baseJS.util={formatString:function(t){for(var n=0;n<arguments.length-1;n++)t=t.replace("{"+n+"}",arguments[n+1]);return t},doPost:function(t,n,e){$.post(t,n,function(t){e.call(this,t)})},doRequest:function(form,url,param,fn,async){var params=form||param||{};"string"==typeof form&&(params=$.extend(param||{},baseJS.form.serializeObject($("#"+form)))),"undefined"==typeof async&&(async=!0),$.ajax({type:"POST",url:url,data:params,async:async,dataType:"json",cache:!1,success:function(t){"function"==typeof fn&&("unlogin"==t.status?baseJS.App.sendToApp("reload",'""'):fn.call(this,t))},error:function(xhr){return"200"==xhr.status?(console.log(xhr),void this.success(eval("("+xhr.responseText+")"),xhr.statusText)):void alert("请求失败!")},beforeSend:function(){},complete:function(){}})},HashMap:function(){function t(n){var e=new Array;if("string"==typeof n)return'"'+n.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+'"';if("object"==typeof n){for(var r in n)e.push('"'+r+'":'+t(n[r]));return document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(n.toString)&&e.push("toString:"+n.toString.toString()),e="{"+e.join()+"}"}return n.toString()}var n=0,e=new Object;this.put=function(t,r){e[t]=r,n++},this.putAll=function(t){if("object"!=typeof t||t.sort)throw"input type error,must HashMap type！";for(var n in t)this.put(n,t[n])},this.get=function(t){return e[t]},this.remove=function(t){0!=n&&(delete e[t],n--)},this.containsKey=function(t){return e[t]?!0:!1},this.containsValue=function(t){for(var n in e)if(e[n]==t)return!0;return!1},this.clear=function(){e=new Object,n=0},this.isEmpty=function(){return 0==n},this.size=function(){return n},this.keySet=function(){var t=new Array;for(var n in e)t.push(n);return t},this.entrySet=function(){var t=new Array;for(var n in e){var r=new Object;r[n]=e[n],t.push(r)}return t},this.values=function(){var t=new Array;for(var n in e)t.push(e[n]);return t},this.each=function(t){for(var n in e)t.call(this,n,e[n])},this.toString=function(){return t(e)}}},baseJS.App={initPage:function(t,n,e,r,i,o,a,s){var u=baseJS.App.getSystem(),c='{"title":"'+t+'","backShow":"'+o+'","carItemCount":"'+a+'","isShow":"'+n+'","selectedIndex":"'+e+'","rightBtnType":"'+r+'","rightBtnText":"'+i+'","callback":"'+s+'"}';if(1==r&&(window.initPageParam=c),!u.xs)return void this._callplus("initPage","",c);if(u.android)window.AndroidToJs.jsPushDataToAndroid("index",c);else if(u.ios){var f=encodeURI('http://xs/{"dataType":"changebtnType","jsonData":'+c+"}");baseJS.App.iosCall(f)}},sendToApp:function(t,n){var e=baseJS.App.getSystem();if(!e.xs)return void this._callplus("sendToApp",t,n);if(e.android)window.AndroidToJs.jsPushDataToAndroid(t,n);else if(e.ios){n='{"dataType":"'+t+'","jsonData":'+n+"}";var r=encodeURI("http://xs/"+n);baseJS.App.iosCall(r)}},showPicture:function(t){var n=baseJS.App.getSystem();if(n.xs)if(n.android)window.AndroidToJs.showGoodsImgs(t);else if(n.ios){t='{"dataType":"zoomPicture","jsonData":'+t+"}";var e=encodeURI("http://xs/"+t);baseJS.App.iosCall(e)}},showToast:function(t){var n=baseJS.App.getSystem();if(!n.xs)return void this._callplus("showToast",!1,t);if(n.android)window.AndroidToJs.showToast(t);else if(n.ios){t='{"dataType":"showToast","jsonData":'+t+"}";var e=encodeURI("http://xs/"+t);baseJS.App.iosCall(e)}},getAppInfo:function(){var t=baseJS.App.getSystem();if(!t.xs)return void this._callplus("getAppInfo",!1,"");if(t.android)window.appInfo=window.AndroidToJs.getAppInfo();else if(t.ios){var n='{"callback": "getAppInfo"}';n='{"dataType":"getAppInfo","jsonData":'+n+"}";var e=encodeURI("http://xs/"+n);baseJS.App.iosCall(e)}},iosCall:function(t){iosCallFrame=$('<iframe id="iosCallFrame" src="'+t+'" style="display:none;"  ></iframe>').prependTo("body")},getSystem:function(){var t={versions:function(){var t=navigator.userAgent;return{android:t.indexOf("Android")>-1||t.indexOf("Adr")>-1,ios:t.indexOf("iPh")>-1||t.indexOf("iOS")>-1||t.indexOf("iPad")>-1,xs:t.indexOf("SMG_")>-1}}()};return t.versions},_callplus:function(t,n,e){"undefined"==typeof plus&&(plus=require("plugins/plus"));var r;t in plus&&(r=plus[t],n&&n in r&&(r=plus[t][n]),r.call(plus,[e]))}}}(jQuery),"object"==typeof module&&"object"==typeof module.exports&&(module.exports=baseJS)});