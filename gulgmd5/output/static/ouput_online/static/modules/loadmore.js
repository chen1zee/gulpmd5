define("loadmore",function(o,a,l){var e=jQuery=o("jquery"),t=function(o){var a={id:"",initUrl:"",loadButtonClass:"load_more",moreUrl:"",page:1,queryType:"get",loadType:"both",queryCallback:""};a=e.extend(a,o);var l=this,t=function(){if(!(l.loadlock||l.temploadlock||l.srcollloadlock)){var o=e(window).scrollTop(),a=e(document).height(),t=e(window).height();o+t+100>=a&&l.load()}};this.init=function(){var o=e("#"+a.id);return l.loadlock=!1,l.temploadlock=!1,l.srcollloadlock=!1,l.loadMoreButton=o.find("."+a.loadButtonClass),""==a.moreUrl&&(a.moreUrl=a.initUrl),l.changeLoadLayer(0,""),("both"==a.loadType||"scroll"==a.loadType)&&e(window).bind("scroll",t),("both"==a.loadType||"button"==a.loadType)&&e(l.loadMoreButton).bind("click",function(){l.loadlock||l.temploadlock||l.load()}),l},this.load=function(){l.loadlock=!0,l.changeLoadLayer(1,"");var o=a.initUrl?a.initUrl:a.moreUrl;o=o.replace(/\{pageValue\}/gi,a.page),e.getJSON(o,function(o){return o.data&&o.data.length>0&&(a.queryCallback&&"function"==typeof a.queryCallback&&(o.data=a.queryCallback(o.data)),e(o.data).insertBefore(l.loadMoreButton),a.initUrl=null,a.page++),"unlogin"==o.status?(l.changeLoadLayer(2,""),l.loadlock=!1,l.srcollloadlock=!0,baseJS.App.sendToApp("reload",'""'),!1):void(o.status<0?l.changeLoadLayer(3,o.message):0==o.status||"undefined"==typeof o.status?(l.changeLoadLayer(2,o.message),l.loadlock=!1,l.srcollloadlock=!0):(l.changeLoadLayer(0,""),l.loadlock=!1,l.srcollloadlock=!1,l.checkStatus()))}).error(function(){l.changeLoadLayer(2,""),l.loadlock=!1,l.srcollloadlock=!0})},this.checkStatus=function(){l.loadlock||l.temploadlock||e("body").height()<=e(window).height()&&l.load()},this.changeLoadLayer=function(o,a){var e="";switch(o){case 0:e='<img src="/static/img/ico/loadmore.png" alt="加载更多" /><span>'+(a||"点击加载更多")+"</span>";break;case 1:e='<img src="/static/img/ico/loading.png" alt="加载中" /><span>'+(a||"加载中...")+"</span>";break;case 2:e='<img src="/static/img/ico/loadmore.png" alt="加载失败" /><span>'+(a||"加载失败，点击重试")+"</span>";break;case 3:e="<span>"+(a||"没有数据了哦，亲")+"</span>";break;default:e='<img src="/static/img/ico/loadmore.png" alt="加载更多" /><span>'+(a||"点击加载更多")+"</span>"}l.loadMoreButton.html(e)},this.unbindEventHandler=function(){e(window).unbind("scroll",t),l.loadMoreButton.unbind("click")}};"object"==typeof l&&"object"==typeof l.exports&&(l.exports=t)});