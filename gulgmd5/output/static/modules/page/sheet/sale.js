define('page/sheet/sale', function(require, exports, module){ require("common");
require("jquery");
var echarts = require("echarts");
var LCalendar = require("LCalendar.min");//----日期选择插件

$(function(){
    var chartBtn = document.querySelector("#chartBtn");
    var selectDay = document.querySelector("#selectDay");
    var selectWeek = document.querySelector("#selectWeek");
    var selectMonth = document.querySelector("#selectMonth");
    //*********************
    //*********************
    //-----日期选择
    //*********************
    //*********************


    var dateInput = new LCalendar();
    var dateOption = {//---日及周  设置项
        'trigger':'#date',
        'type':'date',
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
    };
    dateInput.init(dateOption);

    var ymInput = new LCalendar();
    var ymOption = {//--- 月设置项
        'trigger':'#ym',
        'type':'ym',
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) //最大日期
    };
    ymInput.init(ymOption);

    //---点击 日 周  月  显示 不同 的  input 框

    $("#selectDay").on("touchstart",function(){
        $("#date").addClass("active");
        $("#ym").removeClass("active");
        $(this).addClass("active").siblings().removeClass("active");
    });
    $("#selectWeek").on("touchstart",function(){
        $("#date").addClass("active");
        $("#ym").removeClass("active");
        $(this).addClass("active").siblings().removeClass("active");
    });
    $("#selectMonth").on("touchstart",function(){
        $("#date").removeClass("active");
        $("#ym").addClass("active");
        $(this).addClass("active").siblings().removeClass("active");
    });



    //*********************
    //*********************
    //查询 ，，ajax 表单
    //*********************
    //*********************
    chartBtn.addEventListener('touchstart',function(){
        console.log(111);
    },false);

    //---发送 ajax 改变 echarts 数据 函数
    function changeEchart(){
        //----
        console.log("发送ajax,修改echart数据");
    }






    //初始化 图表高度

    //********************************s****
    //************************************
    //---------模拟数据-------------------
    //************************************
    //************************************

    var postDataForChart = {//---接收 ajax 后台传过来的数据，并 格式化
        head:["店T","店S","店R","店Q","店P","店O","店N","店M","店L","店K","店J","店I","店H","店G","店F","店E","店D","店C","店B","店A"],
        saleVal:[],//---销量
        pureVal:[],//---毛利
        numVal:[],//---数量
        customVal:[],//---客单数
        purePerVal:[],//---毛利率
    };
    function rnd(a,b){
        return (parseInt(Math.random() * (b - a + 1) + a));
    }
    for(var i = 0;i < 20;i++){
        postDataForChart.saleVal.push(rnd(1,50));
        postDataForChart.pureVal.push(rnd(1,50));
        postDataForChart.numVal.push(rnd(1,50));
        postDataForChart.customVal.push(rnd(1,50));
        postDataForChart.purePerVal.push(rnd(1,50));
    }

    //************************************

    var myChart = echarts.init(document.getElementById("chart"));
    var option = {
        title:{
            text:"",
        },
        grid:{
            top:30,
        },
        tooltip: {
            trigger:"axis",//---跟踪点击 或 hover 最近的数据
        },
        legend: {//---各个系列(对应series的 name)的设置，，，显示 在表头
            data:['销量','毛利','数量','客单数','毛利率'],
            top:0,
        },
        xAxis: {
            data: postDataForChart.head,
            //min:"dataMin",//---设置 最大 最小值 为 显示 数据 的 最大 最小值
            //max:"dataMax",
            splitLine:{
                show:true,//----显示 x轴的网格
            },
            boundaryGap: false,//---顶格，，居中x轴
        },
        yAxis: {
            //min:"dataMin",
            //max:"dataMax",
        },
        backgroundColor:"#fff",
        dataZoom:{
            type:"slider",
            startValue:0,
            endValue:5,
            //handleSize:"100%",---slider控制手柄的高度

        },
        series: [
            {//----销售 曲线  的  设置
                name: '销量',
                type: 'line',
                data: postDataForChart.saleVal,
                symbolSize:5,
                lineStyle:{
                    normal:{
                        color:"#c23531",
                        width:1,
                    },
                },
                label:{//---显示坐标的值
                    normal:{
                        show:true,
                        textStyle:{
                            color:"#c23531",
                        },
                        position:'right',

                    },

                },
            },
            {//----毛利  曲线 的  设置
                name: '毛利',
                type: 'line',
                data:postDataForChart.pureVal,
                symbolSize:5,
                lineStyle:{
                    normal:{
                        color:"#2F4554",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            color:"#2F4554",
                        },
                        position:'right',

                    },

                },


            },
            {//----数量  曲线 的 设置
                name: '数量',
                type: 'line',
                data:postDataForChart.numVal,
                symbolSize:5,
                lineStyle:{
                    normal:{
                        color:"#37ce87",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            color:"#37ce87",
                        },
                        position:'right',

                    },

                },

            },
            {//----客单数  曲线 的 设置
                name: '客单数',
                type: 'line',
                data:postDataForChart.customVal,
                symbolSize:5,
                lineStyle:{
                    normal:{
                        color:"#E17731",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            color:"#E17731",
                        },
                        position:'right',

                    },

                },

            },
            {//----毛利率  曲线 的 设置
                name: '毛利率',
                type: 'line',
                data:postDataForChart.purePerVal,
                symbolSize:5,
                lineStyle:{
                    normal:{
                        color:"#8514BA",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            color:"#8514BA",
                        },
                        position:'right',

                    },

                },

            },

        ],


    };

    //myChart.showLoading();//---显示加载动画，，可用在ajax 发送过来之前
    //myChart.hideLoading();//---关闭加载动画，，，
    myChart.setOption(option);


    //********************************************
    //********************************************
    //报表  以 表单 形式显示
    //********************************************
    //********************************************

    //表头      |   | | 销量  | | 数量  | | 毛利  | | 客单数  | | 毛利率  |
    //表体      |店A| | 销量  | | 数量  | | 毛利  | | 客单数  | | 毛利率  |
    var tableData = {
        head:[],
        body:[],
    };
    function showSheet(){//---显示 表单 函数
        tableData.head = ["","销量","数量","金额","客单数","毛利率"];
        for(var i = 0,len = postDataForChart.head.length;i < len;i--){
            tableData.body[i][0] = postDataForChart.head[i];//---第一个 为 店名
            tableData.body[i][1] = postDataForChart.saleVal[i];//--销售量
            tableData.body[i][2] = postDataForChart.numVal[i];//--数量
            tableData.body[i][3] = postDataForChart.pureVal[i];//--毛利
            tableData.body[i][4] = postDataForChart.customVal[i];//--客单数
            tableData.body[i][5] = postDataForChart.purePerVal[i];//--毛利率
        }
        console.log(tableData);

    };
    showSheet();




}); 
});