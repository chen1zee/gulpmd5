define('page/test/showWin', function(require, exports, module){ require("common");
require("jquery.form.min");

$(function () {

});

window.showWin=function (){
    /*找到div节点并返回*/
    var winNode = $("#win");
    //方法一：利用js修改css的值，实现显示效果
    // winNode.css("display", "block");
    //方法二：利用jquery的show方法，实现显示效果
    // winNode.show("slow");
    //方法三：利用jquery的fadeIn方法实现淡入
    //winNode.fadeIn("slow");


    //$("#win").modal();

    //<script type='text/javascript' src='http://blog.163.com/wenchangqing_live/blog/js/jquery.simplemodal.js'></script>
    //http://blog.163.com/wenchangqing_live/blog/static/1737223092015375484937/
    $.modal("<div><h1>SimpleModal</h1></div>");
}

window.hide=function (){
    var winNode = $("#win");
    //方法一：修改css的值
    //winNode.css("display", "none");
    //方法二：jquery的fadeOut方式
    winNode.fadeOut("slow");
    //方法三：jquery的hide方法
    winNode.hide("slow");
} 
});