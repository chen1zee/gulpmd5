define('page/test/testEchart', function(require, exports, module){ require("jquery");
require("common");
var echarts = require("echarts");
$(function(){
    // ----创建echats 实例
    window.myChart = echarts.init(document.getElementById("main"));
    // -----实例配置项
    var option = {
        title:{
            text:'实打实大师大师',
        },
        tooltip:{},
        legend:{
            data:["销量","单价"],
        },
        xAxis:{
            data:["阿萨德","公司的","个我","分期付","请问"],
        },
        yAxis:{},
        series:[
            {
                name:"销量",
                type:"bar",
                data:[5,10,20,20,30],
            },
            // {
            //     name:"单价",
            //     type:""
            // }

        ],

    };
    // ----显示图表
    myChart.setOption(option);

}); 
});