define("dragload",function(t,o,e){var a=jQuery=t("jquery"),c=function(t){var o={xStart:0,yStart:0,curDec:!1,canLoad:!1},e=0,c=this;this.init=function(){a("body").on("touchstart",c.moveStart).on("touchmove",c.move)},this.moveStart=function(t){t.originalEvent&&(t=t.originalEvent),o.curDec=!1,o.xStart=t.changedTouches[0].clientX,o.yStart=t.changedTouches[0].clientY;var e=a(window).scrollTop(),c=a(document).height(),n=a(window).height();e+n>=c-5?o.canLoad=!0:o.canLoad=!1},this.move=function(a){if(o.canLoad){a.originalEvent&&(a=a.originalEvent);var n=a.changedTouches[0].clientX-o.xStart,r=a.changedTouches[0].clientY-o.yStart;if(!o.curDec){if(Math.abs(n)<e&&Math.abs(r)<e)return void a.preventDefault();Math.abs(n)>Math.abs(r)?o.curDec="x":o.curDec="y"}"y"==o.curDec&&r<0&&(a.preventDefault(),Math.abs(r)>30&&(t(),c.distroy()))}},this.distroy=function(){a("body").off("touchstart",c.moveStart).off("touchmove",c.move)}};"object"==typeof e&&"object"==typeof e.exports&&(e.exports=c)});