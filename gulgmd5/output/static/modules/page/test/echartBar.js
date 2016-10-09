define('page/test/echartBar', function(require, exports, module){ require('common');
require('jquery');
var echarts = require("echarts");
$(function(){
    var dataForChart = [
        10,52,200,344,390,330,220
    ];//---要显示的数据
    var myChart = echarts.init(document.getElementById("chart"));
    var option = {
        title:{
            text:'直线图asdasd',
            x:'center',
            y:'15px',
        },
        color:['#37ce87'],
        tooltip:{
            trigger:'axis',
            triggerOn:'click',
            axisPointer:{
                type:'line',
            },
        },
        grid:{
            left:'3%',
            right:'4%',
            bottom:'10%',
            containLabel:true,//---图表是否包含 坐标轴刻度，，，true可防止溢出

        },
        dataZoom:{
            type:'slider',
            startValue:0,
            endValue:4,

        },
        xAxis:[
            {
                type:'category',
                data:['Mon','Tue','Wed','Thu','Fir','Sat','Sun'],
                axisTick:{
                    alignWithLabel:true,//---坐标刻度中间对齐
                },
                splitLine:{//---显示 x 轴的栅格线
                    show:true,
                },



            }
        ],
        yAxis:[
            {
                type:'value',
            }
        ],
        series:[
            {
                type:'bar',
                name:'直接访问',
                barWidth:'60%',
                data:dataForChart,
                label:{
                    normal:{
                        show:true,
                        position:'top',
                        textStyle:{
                            color:'#333',
                        }

                    }
                }
            }
        ],
        backgroundColor:'#fff',

    };

    myChart.setOption(option);
}); 
});