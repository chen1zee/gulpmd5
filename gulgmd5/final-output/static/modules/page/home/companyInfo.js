define("page/home/companyInfo",function(i,n,t){i("common"),i("jquery");var e=i("slider");$(function(){function i(){var i=!0;this.rolling=function(e){function o(){0!=i&&(d++,d%5==0&&(t+=2,t>=n&&(t=-40),$(e.id).css({left:-t+"px"})),window.requestAnimationFrame(o))}n=$(e.id).width()-$(e.wrap).width()+100,t=-40,d=0,o()},this.clearRolling=function(){i=!1}}var n=0,t=0,d=0;$("td").height(.25*$(window).width()),$(".slider-img").width($(window).width());var o=new e({id:".slider-wrap",imgWidth:$(window).width(),time:5e3,dec:!1,num:4});o.init();var a="经常在微信图文中看到一些特别棒的排版,很想知道这些精美的样式都是从哪里找到的,我也是做微信运营的 ";$("#companyMessage").width(16*a.length).html(a);var r=new i;r.rolling({id:"#companyMessage",wrap:".roll-wrap .para"})})});