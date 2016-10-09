define('page/home/manager', function(require, exports, module){ require("common");
require("jquery");
var slideImg = require("slider");
var Imglazyload = require("imglazyload");//---懒加载

$(function () {
    //声明变量区
    var len = 0,
        nowX = 0,
        timeControl = 0,
        windowW = $(window).width();


    //----懒加载

    //初始化懒加载图片 的 宽高
    $("#sliderInner img").css({//------ slider 轮播图 图片 初始宽高
        width:(windowW),
        height:(windowW * 0.45),
    });

    var paraWrapImg = $("#paraWrap img");
    paraWrapImg.css({
        height: paraWrapImg.width(),
    });

    Imglazyload.update();

    ////---此处联合以后，改成ajax请求
    ////模拟后台传来的初始数据，制作九宫格
    //var initialJson = {
    //    data:[//---总九宫格
    //        {//--一行九宫格的数据
    //            title:"数据报表",//---行头
    //            paraBtn:[//---按钮内容
    //                "销售速报",
    //                "销售哎哎",
    //                "销售订单",
    //            ]
    //
    //        },{//--一行九宫格的数据
    //            title:"数据二表",//---行头
    //            paraBtn:[//---按钮内容
    //                "销售速二",
    //                "销售哎二",
    //            ]
    //
    //        },{//--一行九宫格的数据
    //            title:"数据二表",//---行头
    //            paraBtn:[//---按钮内容
    //                "销售速二",
    //                "销售哎二",
    //            ]
    //
    //        },{//--一行九宫格的数据
    //            title:"数据二表",//---行头
    //            paraBtn:[//---按钮内容
    //                "销售速二",
    //                "销售哎二",
    //            ]
    //
    //        }
    //
    //    ]
    //}
    //
    //    //<div class="cell">
    //    //<div class="title-wrap clearfix">
    //    //<div class="left"></div>
    //    //<p>数据报表</p>
    //    //<div class="right"></div>
    //    //</div>
    //    //
    //    //<div class="para-wrap">
    //    //
    //    //<a href="###" class="btn-wrap clearfix">
    //    //<div class="icon"></div>
    //    //<p>销售 <br/> 速报</p>
    //    //</a>
    //    //</div>
    //    //</div>
    ////---此处联合以后，改成ajax请求
    //function creLists(){
    //    var str = "";
    //    var data = initialJson.data;
    //    for(var i = 0,lenI = data.length; i < lenI; i++){
    //        str += '<div class="cell"><div class="title-wrap clearfix"><div class="left"></div><p>'+data[i].title+'</p><div class="right"></div></div><div class="para-wrap">';
    //        for(var j = 0,lenJ = data[i].paraBtn.length;j < lenJ; j++){
    //            str += '<a href="###" class="btn-wrap clearfix"><div class="icon"></div><p>'+data[i].paraBtn[j].slice(0,2)+' <br/> '+data[i].paraBtn[j].slice(2,4)+'</p></a>';
    //        }
    //        str += '</div>';
    //        str += '</div>';
    //    }
    //
    //    $(".option-wrap").html(str);
    //};
    //creLists();

    //初始化九宫格的td 的height
    $("td").height($(window).width() * 0.25);




    $(".slider-img").width($(window).width());//--修改滚图宽度；

    //上面轮播图
    var slide = new slideImg({
        'id':".slider-wrap"
        ,'imgWidth':($(window).width())
        ,'time':5000
        ,'dec':false
        ,'num':4
    });
    slide.init();

    //公司快报滚动显示
    //var serverUrl = "请求地址";
    //$.post(serverUrl,{key:value,key:value},function(data){
    //    if(data.status=='success'){
    //        //--响应成功回调
    //    }else if(data.status=='fail'){
    //        //--响应失败回调
    //    }else{
    //        //--响应繁忙回调
    //    }
    //});
    //$.post(serverUrl,function(data){
    //    if(data.status=='success'){
    //        //
    //    }
    //
    //})


    //---初始化 文字包裹框的宽度
    var rollingWord = "经常在微信图文中看到一些特别棒的排版";

    $("#companyMessage").width(rollingWord.length * 10).html(rollingWord);

    //滚动公司快报, 构造函数,,
    function Rolling(){
        var flag = true;//---控制文字标识
        this.rolling = function (opt){
            //opt.id 要滚动的文字条id,, opt.wrap 滚动文字条的显示区域元素
            len = $(opt.id).width() - 0 + 60;
            nowX = -20;//---文字滚动位置
            timeControl = 0;//---动画计时控制

            function roll(){
                if(flag == false) return;
                timeControl++;
                if(timeControl % 5 == 0){
                    nowX+=2;
                    if(nowX >= len) nowX = -40;
                    $(opt.id).css({
                        left:(-nowX + "px"),
                    });
                }
                window.requestAnimationFrame(roll);
            };
            roll();
        };

        this.clearRolling = function(){//---清除文字滚动函数
            flag = false;
        };


    };


    var rolling = new Rolling();
    rolling.rolling({
        id:"#companyMessage"
        ,wrap:".roll-wrap .para"
    });

//    ******************************
//    ******************************
//    ******************************
//---发送 ajax 更新对比盈利框数据
//    ******************************
//    ******************************
//    ******************************
    var incomeWrapFlag = true;//---先加个flag，让他没事件，后台好了去掉flalg 弄ajax
    $("#incomeWrap").on("click",function(){

        if (!incomeWrapFlag) return;//----有后台时删掉这句
        console.log(1);
        incomeWrapFlag = false;//---让flag 变flase禁止点击

        window.setTimeout(function(){//---5s后恢复点击功能s
            incomeWrapFlag = true;
        },5000);

        //$.ajax({
        //    url:'',//---发送请求地址
        //    type:'post',
        //    data:{
        //
        //    },
        //    dataType:'json',
        //    success:function(data){
        //        console.log(data);
        //        //-----处理传来的 数据
        //    },
        //});
    });









}); 
});