define("page/sheet/check",function(e){e("common"),e("jquery.form.min"),e("jquery.jqGrid.min"),e("grid.locale-cn"),e("jquery.fmatter");var t=getUrlParam("tid"),a=getUrlParam("mid"),o=getUrlParam("gid");$(function(){$.post(server+"/getsheetheadinfo.kb",{tenantid:t,moduleid:a,guid:o},function(e){if("success"!=e.status)return"fail"==e.status?void showMsg(e.message):void showMsg("服务器繁忙,请稍后重试");var e=e.data,r='<label><span>{0}：</span><input type="text" name="{1}" id="{2}" readonly="true" value="{3}" /></label>',i="";for(var d in e){var n=e[d],s=n.fieldcaption,l=n.fieldname.toLowerCase();"sheetid"==l?s="单据编号":"manualid"==l?s="手工编号":"sheetdate"==l?s="单据日期":"operator"==l?s="业务员":"channelname"==l?s="店铺名称":"creater"==l?s="制单人":"createdate"==l?s="制单日期":"checker"==l?s="审核人":"checkdate"==l?s="审核日期":"remark"==l&&(s="备注"),i+=baseJS.util.formatString(r,s,n.fieldname,n.fieldname,n.fieldvalue)}$("#addrForm").html(i),$("#gridTable").jqGrid({url:server+"/getsheetgoodsinfo.smg",postData:{tenantid:t,moduleid:a,guid:o},datatype:"json",height:200,colNames:["序","商品编号","商品名称","数量","进价","金额","备注"],colModel:[{name:"id",index:"id",width:20,sorttype:"int",align:"center"},{name:"goodsno",index:"goodsno",width:70,align:"left"},{name:"goodsname",index:"goodsname",width:100,align:"left"},{name:"qty",index:"qty",width:50,sorttype:"float"},{name:"cost",index:"cost",width:50,sorttype:"float"},{name:"costvalue",index:"costvalue",width:70,sorttype:"float"},{name:"remark",index:"remark",width:150}],jsonReader:{root:"data.goodslist",repeatitems:!1},totalSummary:{align:"center",type:"sum",render:function(e){return"<div>总数："+e.sum+"</div>"}},sortname:"id",sortorder:"asc",viewrecords:!0,align:"left",rowNum:10,shrinkToFit:!1,autoScroll:!1,rowList:[10,20,30,50,100],pager:"#gridPager",caption:"商品明细"}).navGrid("#pager2",{edit:!1,add:!1,del:!1}),$("#gridTable").jqGrid({url:server+"/getsheetgoodsinfo.smg",postData:{tenantid:t,moduleid:a,guid:o},datatype:"json",height:200,width:400,colNames:["序","商品编号","商品名称","数量","进价","金额","备注"],colModel:[{name:"id",index:"id",width:20,sorttype:"int",align:"center"},{name:"goodsno",index:"goodsno",width:70,align:"left"},{name:"goodsname",index:"goodsname",width:100,align:"left"},{name:"qty",index:"qty",width:50,sorttype:"float"},{name:"cost",index:"cost",width:50,sorttype:"float"},{name:"costvalue",index:"costvalue",width:70,sorttype:"float"},{name:"remark",index:"remark",width:150}],jsonReader:{root:"data.goodslist",repeatitems:!1},sortname:"id",sortorder:"asc",viewrecords:!0,align:"left",rowNum:10,shrinkToFit:!1,autoScroll:!1,rowList:[10,20,30],pager:"#gridPager",caption:"商品明细"}).navGrid("#pager2",{edit:!1,add:!1,del:!1})})}),window.savecheckCard=function(){var e=$("#CustomerName").val().trim();if(""==e)return showMsg("请输入个人姓名！"),$("#CustomerName").focus(),!1;var t=server+"/addcheckfile.smg";$("form").attr("enctype","multipart/form-data");var a=$("#saleInvoice")[0].files[0];null==a&&($("form").attr("enctype","application/x-www-form-urlencoded"),t=server+"/addcheck.smg");$("#addrForm").ajaxSubmit({type:"post",url:t,data:{tenantid:tenantid},success:function(e){"success"==e.status?(showMsg("提交成功，感谢您登记！"),$("#addrForm").clearForm()):showMsg(e.message)},error:function(e,t,a){showMsg("提交时出错！"+t+a)}})},window.close2=function(){try{window.opener=window;var e=window.open("","_self");e.close(),top.close()}catch(t){}}});