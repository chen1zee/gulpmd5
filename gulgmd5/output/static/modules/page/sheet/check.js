define('page/sheet/check', function(require, exports, module){ require("common");
require("jquery.form.min");
require("jquery.jqGrid.min");
require("grid.locale-cn");
require("jquery.fmatter");
var tid = getUrlParam("tid");//商户ID
var mid = getUrlParam("mid");//模块ID
var gid = getUrlParam("gid");//单据Guid

$(function () {

/*    var headHtmlTemplate="<label><span>{0}：</span><input type=\"text\" name=\"{1}\" id=\"{2}\" readonly=\"true\" value=\"{3}\" /></label>";
    var headHtml=baseJS.util.formatString(headHtmlTemplate,"单据编号","sheetid","sheetid","A00A201608020001");
    headHtml+=baseJS.util.formatString(headHtmlTemplate,"渠道编号","channelid","sheetid","A00A");
    $("#addrForm").html(headHtml);*/

    var paramdata={tenantid:tid,moduleid:mid,guid:gid};

    $.post(server + "/getsheetheadinfo.kb", {tenantid:tid,moduleid:mid,guid:gid}, function (data) {
        if (data.status == "success") {
            var data = data.data;
            var headHtmlTemplate="<label><span>{0}：</span><input type=\"text\" name=\"{1}\" id=\"{2}\" readonly=\"true\" value=\"{3}\" /></label>";
            var headHtml="";
            for(var i in data){
                var item=data[i];
                var caption=item.fieldcaption;
                var fieldname=item.fieldname.toLowerCase();
                if ("sheetid"==fieldname){
                    caption="单据编号";
                }else if ("manualid"==fieldname){
                    caption="手工编号";
                }else if ("sheetdate"==fieldname){
                    caption="单据日期";
                }else if ("operator"==fieldname){
                    caption="业务员";
                }else if ("channelname"==fieldname){
                    caption="店铺名称";
                }else if ("creater"==fieldname){
                    caption="制单人";
                }else if ("createdate"==fieldname){
                    caption="制单日期";
                }else if ("checker"==fieldname){
                    caption="审核人";
                }else if ("checkdate"==fieldname){
                    caption="审核日期";
                }else if ("remark"==fieldname){
                    caption="备注";
                }
                headHtml+=baseJS.util.formatString(headHtmlTemplate,caption,item.fieldname,item.fieldname,item.fieldvalue);
            }
            $("#addrForm").html(headHtml);

            //http://polaris.blog.51cto.com/1146394/259336/
            $("#gridTable").jqGrid({
                url:server + "/getsheetgoodsinfo.smg",
                postData :{tenantid:tid,moduleid:mid,guid:gid},
                datatype: "json",
                height:200,
                //width:400,
                colNames:['序','商品编号', '商品名称', '数量', '进价','金额','备注'],
                colModel:[
                    {name:'id',index:'id', width:20, sorttype:"int",align: 'center'},
                    {name:'goodsno',index:'goodsno', width:70,align: 'left'},
                    {name:'goodsname',index:'goodsname', width:100,align: 'left'},
                    {name:'qty',index:'qty', width:50,sorttype:"float"},
                    {name:'cost',index:'cost', width:50,sorttype:"float"},
                    {name:'costvalue',index:'costvalue', width:70,sorttype:"float"},
                    {name:'remark',index:'remark', width:150}
                ],
                jsonReader : {
                    root:"data.goodslist",//json中代表实际模型数据的入口
                    //page: "page",//json中代表当前页码的数据
                    //total: "total",//json中代表页码总数的数据
                    //records: "records",//json中代表数据行总数的数据
                    repeatitems: false // 如果设为false，则jqGrid在解析json时，
                    // 会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。
                },
                //列汇总
                totalSummary: {
                    align: 'center',   //汇总单元格内容对齐方式:left/center/right
                    type: 'sum',     //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {  //汇总渲染器，返回html加载到单元格 e 汇总Object(包括sum,max,min,avg,count)
                        return "<div>总数：" + e.sum + "</div>";
                    }
                },
                sortname:'id',
                sortorder:'asc',
                viewrecords:true,
                align:'left',
                rowNum:10,
                //toolbar: [false,"top"],
                shrinkToFit:false,
                autoScroll: false,
                rowList:[10,20,30,50,100],
                pager:"#gridPager",
                caption: "商品明细"
            }).navGrid('#pager2',{edit:false,add:false,del:false});//http://polaris.blog.51cto.com/1146394/259336/
            $("#gridTable").jqGrid({
                url:server + "/getsheetgoodsinfo.smg",
                postData :{tenantid:tid,moduleid:mid,guid:gid},
                datatype: "json",
                height:200,
                width:400,
                colNames:['序','商品编号', '商品名称', '数量', '进价','金额','备注'],
                colModel:[
                    {name:'id',index:'id', width:20, sorttype:"int",align: 'center'},
                    {name:'goodsno',index:'goodsno', width:70,align: 'left'},
                    {name:'goodsname',index:'goodsname', width:100,align: 'left'},
                    {name:'qty',index:'qty', width:50,sorttype:"float"},
                    {name:'cost',index:'cost', width:50,sorttype:"float"},
                    {name:'costvalue',index:'costvalue', width:70,sorttype:"float"},
                    {name:'remark',index:'remark', width:150}
                ],
                jsonReader : {
                    root:"data.goodslist",//json中代表实际模型数据的入口
                    //page: "page",//json中代表当前页码的数据
                    //total: "total",//json中代表页码总数的数据
                    //records: "records",//json中代表数据行总数的数据
                    repeatitems: false // 如果设为false，则jqGrid在解析json时，
                    // 会根据name来搜索对应的数据元素（即可以json中元素可以不按顺序）；而所使用的name是来自于colModel中的name设定。
                },
                //列汇总
/*                totalSummary: {
                    align: 'center',   //汇总单元格内容对齐方式:left/center/right
                    type: 'sum',     //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {  //汇总渲染器，返回html加载到单元格 e 汇总Object(包括sum,max,min,avg,count)
                        return "<div>总数：" + e.sum + "</div>";
                    }
                },
                showSummaryOnHide : true,*/
                sortname:'id',
                sortorder:'asc',
                viewrecords:true,
                align:'left',
                rowNum:10,
                //toolbar: [false,"top"],
                shrinkToFit:false,
                autoScroll: false,
                rowList:[10,20,30],
                pager:"#gridPager",
                caption: "商品明细"
            }).navGrid('#pager2',{edit:false,add:false,del:false});

        } else if (data.status == "fail") {
            showMsg(data.message);
            return;
        } else {
            showMsg("服务器繁忙,请稍后重试");
            return;
        }
    });

/*    var mydata = [
        {id:"1",goodsno:"D021",goodsname:"男啊男啊d男啊d",qty:"10.00",cost:"3.50",costvalue:"35.00",remark:"补货商品。"}
    ];
    for(var i=0;i<=mydata.length;i++)
        jQuery("#gridTable").jqGrid('addRowData',i+1,mydata[i]);*/


});

window.savecheckCard = function () {
    var CustomerName = $("#CustomerName").val().trim();
    if (CustomerName == "") {
        showMsg("请输入个人姓名！");
        $("#CustomerName").focus();
        return false;
    }
    var serverUrl = server + "/addcheckfile.smg";
    $("form").attr("enctype", "multipart/form-data");
    var myfile = $("#saleInvoice")[0].files[0];
    if (myfile == null) {
        $("form").attr("enctype", "application/x-www-form-urlencoded");
        serverUrl = server + "/addcheck.smg";
    }

    /**
     * 将form表单元素的值序列化成对象
     *
     * @param form
     *            表单ID
     * @returns object
     */
    var serializeObject = function (form) {
        var o = {};
        $.each(form.serializeArray(), function (index) {
            if (o[this['name']]) {
                o[this['name']] = o[this['name']] + "," + this['value'];
            } else {
                o[this['name']] = this['value'];
            }
        });
        return o;
    }

    // ps:注意将同名的放在一个数组里
    function getFormJson(form, param) {
        var o = {};
        var a = $(form).serializeArray();
        a.push(param);
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

    $("#addrForm").ajaxSubmit({
        type: "post",
        url: serverUrl,
        data: {tenantid: tenantid},
        success: function (data) {
            if (data.status == "success") {
                showMsg("提交成功，感谢您登记！");
                $("#addrForm").clearForm();
            } else {
                showMsg(data.message);
            }
        },
        error: function (XMLHttpRequest, error, errorThrown) {
            showMsg("提交时出错！" + error + errorThrown);
        }
    });
};

window.close2 = function(){
    //window.open("","_self").close();
    try {
        window.opener = window;
        var win = window.open("","_self");
        win.close();
        //frame的时候
        top.close();
    } catch (e) {
    }
}

 
});