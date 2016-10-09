define('page/sheet/ordercheck', function(require, exports, module){ require("common");
require("jquery");
require("plugins/md5");
require("jquery.dataTables.min");
//require("jquery.form.min");
//require("jquery.jqGrid.min");
//require("grid.locale-cn");
//require("jquery.fmatter");
//var dataTable = require("jquery.dataTables.min");
var tid = getUrlParam("tid");//商户ID
var mid = getUrlParam("mid");//模块ID
var gid = getUrlParam("gid");//单据Guid
var uid = getUrlParam("uid");//----用户的id 暂时自己先加上去
//console.log(uid);
//hex_md5(str);//----md5加密函数
//(new Date()).valueOf()---时间戳
//md5(kingbos+tenantid+timestep+接口名称)//加密字段
//sign = hex_md5("kingbos"+tid+postDataForSheet.timestep+"getsheetheadinfo");
var onePercent = $(window).width() / 100;//---1 / 100 的屏幕 宽度

$(function () {

    //**********************************************************
    //**********************************************************
    //**********************************************************
    //---------上面表单的 显示，及 VM 层------------------
    //**********************************************************
    //**********************************************************
    //**********************************************************

    var windowH = $(window).height();
    // 请求审批的 postDataForCheck
    var postDataForCheck = {
        tenantid:tid,
        systemid:"k8",//---k8 or k9
        sheetid:"",//--在ajax单据信息请求里面已获取
        remark:"",
        state:1,//---通过1，不通过0
        retflag:"",//---通过为空，不通过：-1 返回上一级、 -2 返回草稿
        moduleid:mid,
        timestep:"",//---时间戳
        sign:"",
        //sign:hex_md5("kingbos"+tid+(new Date()).valueOf()+"approvebills"),
        };


    //---请求  查看 审核记录 的ajax
    var postDataForChecklog = {
        tenantid:tid,
        moduleid:mid,
        sheetguid:gid,
        username:uid,
        timestep:"",
        sign:"",
    };

    //把 location.search 转成对象函数
    function formatSearch(se){
        if (typeof se !== "undefined") {
            se = se.substr(1);
            var arr = se.split("&"),
                obj = {},
                newarr = [];
            $.each(arr, function(i, v){
                newarr = v.split("=");
                if(typeof obj[newarr[0]] === "undefined"){
                    obj[newarr[0]] = newarr[1];
                }
            });
            return obj;
        };
    };
    var sheetdata = {//后台传过来的单据信息
        data:[],
    };
    //console.log(server.split("/").pop());

    //---
    var checkFlagState = "";//---审批状态

    //获取地址 及传参  生成表单数据
    var postDataForSheet = {
        tenantid:tid,
        moduleid:mid,
        guid:gid,
        timestep:"",//---时间戳
        sign:"",
    };
    postDataForSheet.timestep = (new Date()).valueOf();
    postDataForSheet.sign = hex_md5("kingbos"+tid+postDataForSheet.timestep+"getsheetheadinfo");
    $.ajax({
        url:(server + "/getsheetheadinfo.kb"),

        dataType:"json",
        async:false,
        //data:(formatSearch(window.location.search)),
        data:postDataForSheet,
        type:"post",
        //async:false,
        success:function(data){
            if(data.status == "success"){//---
                sheetdata = data;
                //审批提交数据获取订单编号
                postDataForCheck.sheetid = data.data[0].fieldvalue;
                //根据传来数据定 sheet 高度
                checkFlagState = sheetdata.data.splice(1,1)[0].fieldvalue;
                $("#sheet").css({
                    height:(sheetdata.data.length * 41),
                });
            }else if(data.status == "fail"){
                console.log(data.message);
                alert(data.message);
            }else{
                alert("服务器繁忙,请稍后重试");
            }

        },
        error:function(){
            console.log("请求失败");
        },
    });

    //    模拟传来的数据，，之后改掉

    //data = {
    //    "status": "success",
    //    "errorCode": null,
    //    "message": "",
    //    "type": "json",
    //    "data": [
    //        {
    //            "fieldname": "sheetid",
    //            "fieldvalue": "FBJR0000000002",
    //            "fieldcaption": "sheetid"
    //        },
    //        {
    //            "fieldname": "creater",
    //            "fieldvalue": "超级用户",
    //            "fieldcaption": "creater"
    //        },
    //        {
    //            "fieldname": "createdate",
    //            "fieldvalue": "2015-08-08 00:00:00.0",
    //            "fieldcaption": "createdate"
    //        },
    //        {
    //            "fieldname": "channelno",
    //            "fieldvalue": "001",
    //            "fieldcaption": "channelno"
    //        },
    //        {
    //            "fieldname": "channelname",
    //            "fieldvalue": "总部合格仓",
    //            "fieldcaption": "channelname"
    //        },
    //        {
    //            "fieldname": "venderno",
    //            "fieldvalue": "0001",
    //            "fieldcaption": "venderno"
    //        },
    //        {
    //            "fieldname": "vendername",
    //            "fieldvalue": "广州金博信息技术有限公司",
    //            "fieldcaption": "vendername"
    //        },
    //        {
    //            "fieldname": "costvalue",
    //            "fieldvalue": "50.000000",
    //            "fieldcaption": "costvalue"
    //        },
    //        {
    //            "fieldname": "costvalue2",
    //            "fieldvalue": "50.000000",
    //            "fieldcaption": "costvalue2"
    //        },
    //        {
    //            "fieldname": "remark",
    //            "fieldvalue": "",
    //            "fieldcaption": "remark"
    //        }
    //    ]
    //};

    //----调试用，，，根据自己想要结果调试
    //sheetdata = {
    //    "status": "success",
    //    "errorCode": null,
    //    "message": "",
    //    "type": "json",
    //    "data": [
    //        {
    //            "fieldname": "sheetid",
    //            "fieldvalue": "FBJR0000000002",
    //            "fieldcaption": "sheetid"
    //        },
    //        //{
    //        //    "fieldname": "flag",
    //        //    "fieldvalue": "0",
    //        //    "fieldcaption": "flag"
    //        //},
    //        {
    //            "fieldname": "creater",
    //            "fieldvalue": "超级用户",
    //            "fieldcaption": "creater"
    //        },
    //        {
    //            "fieldname": "createdate",
    //            "fieldvalue": "2015-08-08 00:00:00.0",
    //            "fieldcaption": "createdate"
    //        },
    //        {
    //            "fieldname": "channelno",
    //            "fieldvalue": "001",
    //            "fieldcaption": "channelno"
    //        },
    //        {
    //            "fieldname": "channelname",
    //            "fieldvalue": "总部合格仓",
    //            "fieldcaption": "channelname"
    //        },
    //        {
    //            "fieldname": "venderno",
    //            "fieldvalue": "0001",
    //            "fieldcaption": "venderno"
    //        },
    //        {
    //            "fieldname": "vendername",
    //            "fieldvalue": "广州金博信息技术有限公司",
    //            "fieldcaption": "vendername"
    //        },
    //        {
    //            "fieldname": "costvalue",
    //            "fieldvalue": "50.000000",
    //            "fieldcaption": "costvalue"
    //        },
    //        {
    //            "fieldname": "costvalue2",
    //            "fieldvalue": "50.000000",
    //            "fieldcaption": "costvalue2"
    //        },
    //        {
    //            "fieldname": "remark",
    //            "fieldvalue": "",
    //            "fieldcaption": "remark"
    //        }
    //    ]
    //};


    //---jquery 初始化一些数据
    // 初始化mask 的高度
    $("#mask").css({
        "height": (windowH + 10),
        "min-height": 500,
    });
    $("#checkMask").css({
        "height": (windowH + 10),
        "min-height": 500,
    });


    //用VUE绑定 数据
    var vue = new Vue({//---每个vue实例都会代理其中的data数据
        //此中，sheetVM.sheetDatas = data.data
        el:"#html",//指定vm作用域
        data:{//vm层的data

            //----sheet表单相关数据--------开始--------------------------
            headTitle:1,//---1:采购订单
            sheetDatas:sheetdata.data,//---表单数据


            //----等下给回来--------------******
            //*****************************
            checkFlagState:checkFlagState,//---审批状态，1,已审，-1作废，0未审
            //checkFlagState:0,//---审批状态，1,已审，-1作废，0未审
            //*********************
            openCloseSheetFlag:true,//---单据信息为展开状态
            openCloseSheetMsg:"折叠",//---表单折叠 / 展开的标题
            sheetHeightOrigin:(sheetdata.data.length * 41),//---表单应有高度
            sheetHeightNow:this.sheetHeightOrigin,//---随展开，折叠变化的高
            //----sheet表单相关数据-------结束--------------------------

            //--------审批事件流相关数据-----------开始--------------
            checkFlag:false,//---是否打开审批界面
            checkBtnFlag:false,//---审批按钮背景颜色标识，根据checkComfirmFlag变化
            checkResult:"",//---审批的结果,pass通过，unpass 作废
            checkResultFlag:1,//---审批结果，，默认同意  1  不同意 -1

            checkDenyType:"",//--不同意， 返回上级 -1 返回草稿 -2
            checkOpinion:"",//---审批意见
            checkComfirmWord:"审批",
            checkComfirmFlag:false,//---标识当前表单是否已经审批

            //--------审批事件流相关数据-----------结束--------------

            //------查看审批意见
            checkOpinionArr:[],//----之前的审批意见
            viewCheckOpenFlag:false,//---查看审批界面 显示 标识

        },
        methods:{//---事件列表
            //---单据类型显示
            headTitleShow:function(headTitle){
                switch(headTitle){
                    case 1:
                        return "采购订单";
                };
            },
            //---表单数据转义
            sheetTransiteTitle:function(fieldname){
                switch (fieldname) {
                    case "sheetid":
                        return "单据编号";
                        break;

                    case "creater":
                        return "用户类型";
                        break;
                    case "createdate":
                        return "开单日期";
                        break;
                    case "channelno":
                        return "仓库编号";
                        break;
                    case "channelname":
                        return "仓库名称";
                        break;
                    case "venderno":
                        return "供应商编号";
                        break;
                    case "vendername":
                        return "供应商名称";
                        break;
                    case "costvalue":
                        return "价格";
                        break;
                    case "costvalue2":
                        return "价格2";
                        break;
                    case "remark":
                        return "备注";
                        break;
                    default:
                        break;
                };

            },
            sheetTransitePara:function(sheetData){
                if(sheetData.fieldname == "flag"){//---审批状态  0,未审批，1已审批，-1作废
                    if(sheetData.fieldvalue == 0){
                        return "未审批";
                    }else if(sheetData.fieldvalue == 1){
                        return "已审批";
                    }else{
                        return "作废";
                    }
                }else{
                    return sheetData.fieldvalue;
                }
            },
            showCheckState:function(flag){//---在header显示过审,作废状态

                if(flag == 1){//---过审
                    this.checkComfirmFlag = true;
                    this.checkResultFlag = true;
                    return "已审";
                }else if(flag == -1){
                    this.checkComfirmFlag = true;
                    this.checkResultFlag = false;
                    return "作废";
                }
            },
            //------表单折叠，展开函数---------------
            openCloseSheet:function(){
                if(this.openCloseSheetFlag == true){//---展开状态
                    this.openCloseSheetMsg = "展开";
                    this.openCloseSheetFlag = false;
                    this.sheetHeightNow = 0;
                }else{
                    this.openCloseSheetMsg = "折叠";
                    this.openCloseSheetFlag = true;
                    this.sheetHeightNow = this.sheetHeightOrigin;

                }
            },
            //--------审批事件流相关数据-----------开始--------------

            //---打开审批界面，按钮
            openCheck:function(){
                this.checkFlag = true;
            },
            //---关闭审批界面
            closeCheck:function(){
                this.checkFlag = false;
            },
            //---选择 通过 or 作废 按钮
            passCheck:function(){
                if(this.checkComfirmFlag) return;//---已过审的不能操作按钮
                postDataForCheck.state = 1;
                this.checkResultFlag = 1;
                //---同意时，给不通过类型赋值 空
                if(this.checkDenyType){//---有赋值时
                    this.checkDenyType = "";//---默认给他选上-1
                }


            },
            unpassCheck:function(){
                if(this.checkComfirmFlag) return;//---已过审的不能操作按钮
                postDataForCheck.state = 0;
                this.checkResultFlag = -1;
                //----不同意时，，默认给不通过类型选上-1
                if(!this.checkDenyType){//---没赋值时
                    this.checkDenyType = -1;//---默认给他选上-1
                }
            },
            //---审核按钮，发送  审核 ajax 请求
            sendCheck:function(){
                var url = (server + "/approvebills.kb");
                postDataForCheck.remark = this.checkOpinion;
                postDataForCheck.retflag = this.checkDenyType;
                postDataForCheck.timestep = (new Date()).valueOf();
                postDataForCheck.sign = hex_md5("kingbos"+tid+postDataForCheck.timestep+"approvebills"),
                    //*********************
                    //*********************
                    //---审批接口，，后台完成后完善接口
                    //*********************
                    //*********************
                    $.ajax({
                        context:this,//---ajax回调上下文
                        url:url,
                        data:postDataForCheck,
                        type:"POST",
                        success:function(data){

                            if(data.status == "success"){//---成功审批
                                this.checkComfirmFlag = true;//--过审标识变true

                            }else if(data.status == "fail"){
                                alert(data.message);
                            }else{
                                alert("服务器繁忙,请稍后重试");
                            }
                        },
                        error:function(){
                            console.log("请求失败");
                        }

                    })
            },

            //--------审批事件流相关数据-----------结束--------------

            //-------------查看审批记录--------------------
            viewCheckOpinion:function(){

                this.viewCheckOpenFlag = true;
                //*********************
                //*********************
                //-----此处等后台调用好后完善数据
                //*********************
                //*********************
                postDataForChecklog.timestep = (new Date()).valueOf();
                postDataForChecklog.sign  = hex_md5("kingbos"+tid+postDataForChecklog.timestep+"checksheetlog");
                $.ajax({
                    url:(server + "/checksheetlog.kb"),
                    type:"post",
                    dataType:"json",
                    data:postDataForChecklog,
                    success:function(data){
                        if(data.status == "success"){
                            this.checkOpinionArr = data.data;
                        }else if(data.status == "fail"){
                            alert(data.message);
                        }else{
                            alert("服务器繁忙,请稍后重试");
                        }
                    },
                });



            },
            //----------------关闭审批记录-----------------------------
            closeCheckOpinion:function(){
                this.viewCheckOpenFlag = false;
            },
            //----------------显示审批状态------------------
            showCheckFlag:function(checkflag){//---审批状态，1,已审，-1作废，0未审
                if(checkflag == 1){//---已审
                    return "通过";
                }else if(checkflag = -1){
                    return "返回上级";
                }
            }

        },
        watch:{//-----监控列表
            "checkComfirmFlag":function(val,oldVal){
                if(val){//---已经审批过了,多种选项不能再修改
                    this.checkComfirmWord = "已审";
                    this.checkBtnFlag = true;
                    //---解绑事件
                }
            },
            "checkFlagState":function(val,oldVal){
                if(val == "1"){

                }
            },
            "checkDenyType":function(val,oldVal){
                console.log(val);
                console.log(this.checkDenyType);
            }
        },

    });
    //---------------审批事件流操作----结束----------------




    //**********************************************************
    //**********************************************************
    //**********************************************************
    //---------下层表格的 显示，------------------
    //**********************************************************
    //**********************************************************
    //**********************************************************
    //---表格 ajax 发送数据
    var postDataForTable = {
        tenantid:tid,
        moduleid:mid,
        guid:gid,
        timestep:"",
        sign:"",
    }
//sign = hex_md5("kingbos"+tid+postDataForSheet.timestep+"getsheetheadinfo");

    postDataForTable.timestep = (new Date()).valueOf();
    postDataForTable.sign = hex_md5("kingbos"+tid+postDataForTable.timestep+"getsheetgoodsinfo");
    var table = $('#dataTable').dataTable({
        "autoWidth": false,//---
        "paging": true,//---显示分页
        //        lengthChange:false,

        scrollY:"200px",
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
        ajax:{

            url:(server + "/getsheetgoodsinfo.kb"),
            type:"post",
            data: postDataForTable,
            dataSrc:"data.goodslist",
        },


        columns:[
            {data:"id",width:5,className:"dataTable__normal-cell"},
            {data:"goodsno",width:85,className:"dataTable__normal-cell"},
            {data:"goodsname",width:85,className:"dataTable__normal-cell"},
            {data:"approvalCode",width:85,className:"dataTable__normal-cell"},
            {data:"spec",width:5,className:"dataTable__normal-cell"},
            {data:"unitname",width:5,className:"dataTable__normal-cell"},
            {data:"qty",width:5,className:"dataTable__normal-cell"},
            {data:"cost",width:35,className:"dataTable__normal-cell"},
            {data:"costvalue",width:5,className:"dataTable__normal-cell"},
            {data:"remark",width:30,className:"dataTable__normal-cell"},

        ],
        "footerCallback":function( tfoot, data, start, end, display ) {

            var api = this.api();
            //---数量总和
            //----当 表格无数据时，，返回
            if(api.column( 6 ).data().length == 0) return;

            $( api.column( 6 ).footer()).html(
                api.column( 6 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );
            $( api.column( 8 ).footer()).html(
                api.column( 8 ).data().reduce( function ( a, b ) {
                    return a + b;
                }, 0 )
            );







            //var len = api.column(6).data().length,
            //    sum7 = 0,//进货价总和
            //    sum8 = 0;//销售价总和
            //
            //
            ////进货价总和
            //for(var i = 0;i<len;i++){
            //    sum7 += api.column(6).data()[i] * api.column(7).data()[i];
            //}
            //$(api.column( 7 ).footer()).html(sum7);
            //
            ////销售价总和
            //for(var i = 0;i<len;i++){
            //    sum8 += api.column(6).data()[i] * api.column(8).data()[i];
            //}
            //$(api.column( 8 ).footer()).html(sum8);


        },
    });

//******************************
//******************************
//******************************
//--------滚动条相关设置
//******************************
//******************************
//******************************


    var tableW = $("#dataTable").width();
    var tableH = $("#dataTable").height();
    var windowW = $(window).width();

//---监听高度
    var timer = window.setInterval(function(){
        var newH = $("#dataTable").height();
        if(newH == tableH) return;//---高度没变化
        //高度变化
        tableH = newH;
        scrollH = parseInt(wrapH * wrapH / tableH);
        if(scrollH > 300) scrollH = 0;
        $("#scrollBarY").height(scrollH - 5);
    },500);

    var wrapH = 200;



    var scrollW = parseInt(windowW * windowW / tableW);
    var scrollH = parseInt(wrapH * wrapH / tableH);
    if(scrollH > 300) scrollH = 0;


//windowW / tableW = scrollBarW / windowW
//wrapH / tableH = scrollBarH / wrapH;
    $("#scrollBarX").width(scrollW - 5);
    $("#scrollBarY").height(scrollH - 5);



//(tableW - windowW) / scrollX = (windowW - scrollW) / left;
//left = (windowW - scrollW) * scrollX / (tableW - windowW);
//---图表 x轴  || y轴 滚动
    $("#dataTable_wrapper").on("scroll",function(){
        $("#scrollBarX").css({
            left:( -(windowW - scrollW) * $("#dataTable_wrapper>.body").offset().left / (tableW - windowW) + 2),
        });

        //----此处scrollY需要调整
//(tableH - wrapH)/ dataTableOffsetTop = (wrapH - scrollH)/ top
//    top = (wrapH - scrollH) * dataTableOffsetTop / (tableH - wrapH)
        $(".dataTables_scrollBody").on("scroll",function(){
            $("#scrollBarY").css({
                top:( -(wrapH - scrollH) * $("#dataTable").position().top / (tableH - wrapH) + 2),
            });
        });

        //$("#scrollBarY").css({
        //    top:( -(wrapH - scrollH) * $("#dataTable").offset().top / (tableH - wrapH) + 2),
        //});
        //console.log($("#dataTable").offset().top);



    });















});





 
});