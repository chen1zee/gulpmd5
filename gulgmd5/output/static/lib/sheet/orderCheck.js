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


// 修复部分低端机不支持location部分属性的问题
window.location.origin = (window.location.origin || ( location.protocol + "//" + location.host));
// 后端服务接口地址
var serverPath = "/kbwx_server";
window.server = window.location.origin + serverPath;
//window.server = 'http://127.0.0.1:8877';

var postDataForTable = formatSearch(window.location.search);
postDataForTable.sign = hex_md5("kingbos"+postDataForTable.tid+(new Date()).valueOf()+server.split("/").pop()+"getsheetgoodsinfo");
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
        {data:"id",width:10,className:"dataTable__normal-cell"},
        {data:"goodsno",width:60,className:"dataTable__normal-cell"},
        {data:"goodsname",width:60,className:"dataTable__normal-cell"},
        {data:"approvalCode",width:60,className:"dataTable__normal-cell"},
        {data:"spec",width:20,className:"dataTable__normal-cell"},
        {data:"unitname",width:20,className:"dataTable__normal-cell"},
        {data:"qty",width:20,className:"dataTable__normal-cell"},
        {data:"cost",width:20,className:"dataTable__normal-cell"},
        {data:"costvalue",width:20,className:"dataTable__normal-cell"},
        {data:"remark",width:30,className:"dataTable__normal-cell"},

    ],
    "footerCallback":function( tfoot, data, start, end, display ) {

        var api = this.api();
        //---数量总和
        $( api.column( 6 ).footer()).html(
            api.column( 6 ).data().reduce( function ( a, b ) {
                return a + b;
            }, 0 )
        );
        //进货价总和

        //    -------------看文档补上
        //    -------------看文档补上
        //    -------------看文档补上
        console.log(api.column(6).data());

        //销售价总和
        //    -------------看文档补上
        //    -------------看文档补上
        //    -------------看文档补上

    },
});


//--------滚动条相关设置

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

    $("#onclick").on("click",function(){
        postDataForTable.sign = hex_md5("kingbos"+postDataForTable.tid+(new Date()).valueOf()+server.split("/").pop()+"getsheetgoodsinfo");
        $.ajax({
            url:(server + "/getsheetgoodsinfo.kb"),
            type:"post",
            data:postDataForTable,
            dataType:"json",
            success:function(data){
                console.log(data.data.goodslist);
            }


        });
    });

});





