define('gotop', function(require, exports, module){ var $ = jQuery = require("jquery");

var goTop = function(_opt){
    var def = {
        'dom': 'gotop',     //dom元素标识
        'right': 10,        //距屏幕右边距离
        'bottom': 20,       //距屏幕底部距离
        'showGoTop': $(window).height() // 多远距离后才显示
    }
    var opt = $.extend(def, _opt);
    /**
     * 回到顶部
     * @param acceleration 速度
     * @param time 时间间隔 (毫秒)
     **/
    var go = function () {
        var acceleration = 0.1;
        var time = 10;
        var y = $(window).scrollTop() || 0;

        // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
        var speeding = 1 + acceleration;
        window.scrollTo(0, Math.floor(y / speeding));

        // 如果距离不为零, 继续调用函数
        if( y > 0) {
            window.setTimeout(go, time);
        }
    };

    //元素显示、隐藏
    var showhide = function(el){
        if($(window).scrollTop() < opt.showGoTop){
            el.hide();
        }else{
            el.show();
        }
    };

    /**
     *  创建dom元素
     */
    this.createE = function(){
        if($('.'+opt.dom).size() == 0){
            var el = $('<span></span>');
            var right = opt.right+'px',
                bottom = (opt.bottom + $('.footer_nav').outerHeight() + $('#plus_footer').outerHeight()) + 'px';
            el.css({'position': 'fixed', 'right': right, 'bottom': bottom, 'display': 'none'}).addClass(opt.dom).bind('click', go).appendTo($('body'));
        }
        return $('.'+opt.dom);
    };

    this.init = function(){
        var el = this.createE();
        $(window).bind('scroll', function(){
            showhide(el);
        });
    };
    //this.init();
}

if ("object" == typeof module && "object" == typeof module.exports) {
    module.exports = new goTop();
} 
});