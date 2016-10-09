define('page/test/echartPi', function(require, exports, module){ require("common");
require("jquery");
var echarts = require("echarts");

$(function(){

    var dataForChart = [
        {value:335,name:'直接访问'},
        {value:310,name:'邮件营销'},
        {value:234,name:'联盟广告'},
        {value:135,name:'视频广告'},
        {value:1548,name:'搜索引擎'},

    ]

    //---echart 表格 ---- 开始-----
    var myChart = echarts.init(document.getElementById("chart"));
    var option = {
        backgroundColor:'#fff',
        title:{
            text:'某站点用户访问来源',
            //subtext:'aaaaa',
            x:'center'
        },
        tooltip:{
            trigger:'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            triggerOn:'click',


        },
        legend:{
            orient:'vertical',
            left:'left',
            data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],

            //formatter: 'Legend {name}',
            top:'30px',
            left:'30px',



        },
        series:[
            {
                name:'访问来源',
                type:'pie',
                radius:'55%',
                center:['50%',200],//---饼图中心点坐标
                data:dataForChart,
                itemStyle:{
                    emphasis:{
                        shadowBlur:10,
                        shadowOffsetX:0,
                        shadowColor:'rgba(0,0,0,0.5)',
                    }
                },
                label:{
                    normal:{
                        show:true,
                        position:'outside',
                        formatter: "{b}\n{c}\n({d}%)",
                    }
                }
            },
        ]



    };

    myChart.setOption(option);

    //----echart 表格 -----结束--------

}); 
});