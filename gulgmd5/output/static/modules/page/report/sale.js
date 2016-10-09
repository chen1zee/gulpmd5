define('page/report/sale', function(require, exports, module){ require("common");
require("jquery");
require("jquery.dataTables.min");
var echarts = require("echarts");
var LCalendar = require("LCalendar.min");//----日期选择插件
var newline = require("newlineEcharts");//---坐标轴多字换行函数
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

    //---所有input框 取消默认 onfocus事件
    $("input").on("focus",function(e){
        e.preventDefault();
    });
    $("input").on("input",function(e){
        e.preventDefault();
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

    //---从后台传过来的数据
    var postDataFromServer = {
        data:[
            {shopName:'店一煞的家伙杀毒',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店二煞的家伙杀毒',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店C',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店D',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店E',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店F',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店G',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店H',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店I',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店J',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店K',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店L',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店M',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店N',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店O',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店P',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店Q',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店R',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店S',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
            {shopName:'店T',saleVal:0,pureVal:0,numVal:0,customVal:0,purePerVal:0},
        ],
    };
    //---模拟后台数据
    function rnd(a,b){
        return (parseInt(Math.random() * (b - a + 1) + a));
    }

    for(var i = postDataFromServer.data.length;i--;){
        postDataFromServer.data[i].saleVal = (rnd(1,50));
        postDataFromServer.data[i].pureVal = (rnd(1,50));
        postDataFromServer.data[i].numVal = (rnd(1,50));
        postDataFromServer.data[i].customVal = (rnd(1,50));
        postDataFromServer.data[i].purePerVal = (rnd(1,100));
    }
    //************************************



    //---后台数据转换成echart用的数据
    var postDataForChart = {//---接收 ajax 后台传过来的数据，并 格式化
        head:[],//----x坐标 ，点名
        saleVal:[],//---销量
        pureVal:[],//---毛利
        numVal:[],//---数量
        customVal:[],//---客单数
        purePerVal:[],//---毛利率
    };
    for(var i = postDataFromServer.data.length;i--;){//---postDataForChart赋值
        postDataForChart.head[i] = postDataFromServer.data[i].shopName;
        postDataForChart.saleVal[i] = postDataFromServer.data[i].saleVal;
        postDataForChart.pureVal[i] = postDataFromServer.data[i].pureVal;
        postDataForChart.numVal[i] = postDataFromServer.data[i].numVal;
        postDataForChart.customVal[i] = postDataFromServer.data[i].customVal;
        postDataForChart.purePerVal[i] = postDataFromServer.data[i].purePerVal;

    }


    var myChart = echarts.init(document.getElementById("chart"));
    var option = {
        animation:false,//---不开动画效果
        title:{
            text:"",
        },
        grid:{
            top:60,
            height:'74%',
        },
        tooltip: {
            trigger:"axis",//---跟踪点击 或 hover 最近的数据
        },
        legend: {//---各个系列(对应series的 name)的设置，，，显示 在表头
            data:['销量','毛利','数量','客单数','毛利率'],
            //data:[
            //    {name:'销量',textStyle:{color:'#c23531'}},
            //    {name:'毛利',textStyle:{color:'#c23531'}},
            //    {name:'数量',textStyle:{color:'#c23531'}},
            //    {name:'客单数',textStyle:{color:'#c23531'}},
            //    {name:'毛利率',textStyle:{color:'#c23531'}},
            //
            //],
            top:20,

        },
        xAxis: {
            data: postDataForChart.head,
            //min:"dataMin",//---设置 最大 最小值 为 显示 数据 的 最大 最小值
            //max:"dataMax",
                splitLine:{
                show:true,//----显示 x轴的网格
            },
            boundaryGap: false,//---顶格，，居中x轴
            axisLabel:{//---刻度 相关 设置
                //rotate:-45,


            },

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
            bottom:10,
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
                        //color:"#c23531",
                        width:1,
                    },
                },
                label:{//---显示坐标的值
                    normal:{
                        show:true,
                        textStyle:{
                            //color:"#c23531",
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
                        //color:"#2F4554",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            //color:"#2F4554",
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
                        //color:"#37ce87",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            //color:"#37ce87",
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
                        //color:"#E17731",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            //color:"#E17731",
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
                        //color:"#8514BA",
                        width:1,
                    }
                },
                label:{
                    normal:{
                        show:true,
                        textStyle:{
                            //color:"#8514BA",
                        },
                        position:'right',

                    },

                },

            },

        ],
        color:[//---调色盘 ，顺序从中抽取颜色
            '#c23531',
            '#2F4554',
            '#37ce87',
            '#E17731',
            '#8514BA',
        ],


    };
    newline(option,4,'xAxis');//---设置 换行
    //myChart.showLoading();//---显示加载动画，，可用在ajax 发送过来之前
    //myChart.hideLoading();//---关闭加载动画，，，
    myChart.setOption(option);


    //********************************************
    //********************************************
    //报表  以 表单 形式显示
    //********************************************
    //********************************************
    var tableOption = {
        "autoWidth": false,//---
        "paging": true,//---显示分页
        //        lengthChange:false,

        //scrollY:"200px",
        language:{
            "search":"",//---定义一些显示信息
            //"info":"_START_ 至_END_ 条数据  共_TOTAL_ 条数据",//---
            "info":"共_TOTAL_ 条信息",
            "lengthMenu":"_MENU_",
            "infoFiltered":"",//---搜索后显示的信息
            "infoEmpty":"没有匹配的数据信息",//---无搜索结果
            "emptyTable":"没有相关数据",//---表格没有数据显示
            "zeroRecords":"没有相关数据信息",//---搜索结果为0
        },
        stripeClasses:[,'gray'],
        dom:'<"body"rt><"pagination"l><"teller"i><"info"f>',
        //***************************************
        //---后台好了后获取*****************************
        //---发送 请求 ajax 数据
        //***************************************
        //ajax:{
        //
        //    url:'/wap/test/ajax.txt',
        //    type:"post",
        //    data: {},
        //    //dataSrc: '',
        //},
        data: postDataFromServer.data,
        columns:[
            {data:'shopName',className:"dataTable__normal-cell",width:'70px'},
            {data:'saleVal',className:"dataTable__normal-cell",width:'30px'},
            {data:'pureVal',className:"dataTable__normal-cell",width:'30px'},
            {data:'numVal',className:"dataTable__normal-cell",width:'30px'},
            {data:'customVal',className:"dataTable__normal-cell",width:'30px'},
            {data:'purePerVal',className:"dataTable__normal-cell",width:'40px'},
        ],
        "footerCallback":function( tfoot, data, start, end, display ) {

            var api = this.api();

            //---数量总和
            //----当 表格无数据时，，返回
            if(api.column( 1 ).data().length == 0) return;

            $( api.column( 1 ).footer()).html(//---销量
                api.column( 1 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );
            $( api.column( 2 ).footer()).html(//---毛利
                api.column( 2 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );
            $( api.column( 3 ).footer()).html(//---数量
                api.column( 3 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );
            $( api.column( 4 ).footer()).html(//---客单数
                api.column( 4 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );


        },
    };

    var table = $('#dataTable').dataTable(tableOption);





    //-----根据 ajax传来的数据 初始化 sheet-wrap 高度
    var foldSheetFlag = false;//---折叠表单标识
    $("#foldBtnImg").on("touchstart",function(){

        if(foldSheetFlag){//---折叠状态
            $("#foldBtn span").html("折叠表格");
            $("#foldBtnImg").attr("src","/static/img/ico/go_down.png");
            $("#sheetWrap").slideDown();


        }else{//---展开状态
            $("#foldBtn span").html("展开表格");
            $("#foldBtnImg").attr("src","/static/img/ico/go_up.png");
            $("#sheetWrap").slideUp();
        }
        foldSheetFlag = !foldSheetFlag;
    });







}); 
});