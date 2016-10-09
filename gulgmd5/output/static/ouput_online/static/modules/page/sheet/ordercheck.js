define("page/sheet/ordercheck",function(e){e("common"),e("jquery"),e("plugins/md5"),e("jquery.dataTables.min");{var t=getUrlParam("tid"),a=getUrlParam("mid"),s=getUrlParam("gid"),i=getUrlParam("uid");$(window).width()/100}$(function(){var e=$(window).height(),n={tenantid:t,systemid:"k8",sheetid:"",remark:"",state:1,retflag:"",moduleid:a,timestep:"",sign:""},l={tenantid:t,moduleid:a,sheetguid:s,username:i,timestep:"",sign:""},c={data:[]},o="",h={tenantid:t,moduleid:a,guid:s,timestep:"",sign:""};h.timestep=(new Date).valueOf(),h.sign=hex_md5("kingbos"+t+h.timestep+"getsheetheadinfo"),$.ajax({url:server+"/getsheetheadinfo.kb",dataType:"json",async:!1,data:h,type:"post",success:function(e){"success"==e.status?(c=e,n.sheetid=e.data[0].fieldvalue,o=c.data.splice(1,1)[0].fieldvalue,$("#sheet").css({height:41*c.data.length})):"fail"==e.status?(console.log(e.message),alert(e.message)):alert("服务器繁忙,请稍后重试")},error:function(){console.log("请求失败")}}),$("#mask").css({height:e+10,"min-height":500}),$("#checkMask").css({height:e+10,"min-height":500});var r=(new Vue({el:"#html",data:{headTitle:1,sheetDatas:c.data,checkFlagState:o,openCloseSheetFlag:!0,openCloseSheetMsg:"折叠",sheetHeightOrigin:41*c.data.length,sheetHeightNow:this.sheetHeightOrigin,checkFlag:!1,checkBtnFlag:!1,checkResult:"",checkResultFlag:1,checkDenyType:"",checkOpinion:"",checkComfirmWord:"审批",checkComfirmFlag:!1,checkOpinionArr:[],viewCheckOpenFlag:!1},methods:{headTitleShow:function(e){switch(e){case 1:return"采购订单"}},sheetTransiteTitle:function(e){switch(e){case"sheetid":return"单据编号";case"creater":return"用户类型";case"createdate":return"开单日期";case"channelno":return"仓库编号";case"channelname":return"仓库名称";case"venderno":return"供应商编号";case"vendername":return"供应商名称";case"costvalue":return"价格";case"costvalue2":return"价格2";case"remark":return"备注"}},sheetTransitePara:function(e){return"flag"==e.fieldname?0==e.fieldvalue?"未审批":1==e.fieldvalue?"已审批":"作废":e.fieldvalue},showCheckState:function(e){return 1==e?(this.checkComfirmFlag=!0,this.checkResultFlag=!0,"已审"):-1==e?(this.checkComfirmFlag=!0,this.checkResultFlag=!1,"作废"):void 0},openCloseSheet:function(){1==this.openCloseSheetFlag?(this.openCloseSheetMsg="展开",this.openCloseSheetFlag=!1,this.sheetHeightNow=0):(this.openCloseSheetMsg="折叠",this.openCloseSheetFlag=!0,this.sheetHeightNow=this.sheetHeightOrigin)},openCheck:function(){this.checkFlag=!0},closeCheck:function(){this.checkFlag=!1},passCheck:function(){this.checkComfirmFlag||(n.state=1,this.checkResultFlag=1,this.checkDenyType&&(this.checkDenyType=""))},unpassCheck:function(){this.checkComfirmFlag||(n.state=0,this.checkResultFlag=-1,this.checkDenyType||(this.checkDenyType=-1))},sendCheck:function(){var e=server+"/approvebills.kb";n.remark=this.checkOpinion,n.retflag=this.checkDenyType,n.timestep=(new Date).valueOf(),n.sign=hex_md5("kingbos"+t+n.timestep+"approvebills"),$.ajax({context:this,url:e,data:n,type:"POST",success:function(e){"success"==e.status?this.checkComfirmFlag=!0:alert("fail"==e.status?e.message:"服务器繁忙,请稍后重试")},error:function(){console.log("请求失败")}})},viewCheckOpinion:function(){this.viewCheckOpenFlag=!0,l.timestep=(new Date).valueOf(),l.sign=hex_md5("kingbos"+t+l.timestep+"checksheetlog"),$.ajax({url:server+"/checksheetlog.kb",type:"post",dataType:"json",data:l,success:function(e){"success"==e.status?this.checkOpinionArr=e.data:alert("fail"==e.status?e.message:"服务器繁忙,请稍后重试")}})},closeCheckOpinion:function(){this.viewCheckOpenFlag=!1},showCheckFlag:function(e){return 1==e?"通过":(e=-1)?"返回上级":void 0}},watch:{checkComfirmFlag:function(e){e&&(this.checkComfirmWord="已审",this.checkBtnFlag=!0)},checkFlagState:function(e){},checkDenyType:function(e){console.log(e),console.log(this.checkDenyType)}}}),{tenantid:t,moduleid:a,guid:s,timestep:"",sign:""});r.timestep=(new Date).valueOf(),r.sign=hex_md5("kingbos"+t+r.timestep+"getsheetgoodsinfo");var d=($("#dataTable").dataTable({autoWidth:!1,paging:!0,scrollY:"200px",language:{search:"",info:"共_TOTAL_ 条信息",lengthMenu:"_MENU_",infoFiltered:"",infoEmpty:"没有匹配的数据信息",emptyTable:"没有相关数据",zeroRecords:"没有相关数据信息"},stripeClasses:[,"gray"],dom:'<"body"rt><"pagination"l><"teller"i><"info"f>',ajax:{url:server+"/getsheetgoodsinfo.kb",type:"post",data:r,dataSrc:"data.goodslist"},columns:[{data:"id",width:5,className:"dataTable__normal-cell"},{data:"goodsno",width:85,className:"dataTable__normal-cell"},{data:"goodsname",width:85,className:"dataTable__normal-cell"},{data:"approvalCode",width:85,className:"dataTable__normal-cell"},{data:"spec",width:5,className:"dataTable__normal-cell"},{data:"unitname",width:5,className:"dataTable__normal-cell"},{data:"qty",width:5,className:"dataTable__normal-cell"},{data:"cost",width:35,className:"dataTable__normal-cell"},{data:"costvalue",width:5,className:"dataTable__normal-cell"},{data:"remark",width:30,className:"dataTable__normal-cell"}],footerCallback:function(){var e=this.api();console.log(e.column(6).data().length),0!=e.column(6).data().length&&($(e.column(6).footer()).html(e.column(6).data().reduce(function(e,t){return e+t},0)),$(e.column(8).footer()).html(e.column(8).data().reduce(function(e,t){return e+t},0)))}}),$("#dataTable").width()),g=$("#dataTable").height(),u=$(window).width(),m=(window.setInterval(function(){var e=$("#dataTable").height();e!=g&&(g=e,f=parseInt(m*m/g),f>300&&(f=0),$("#scrollBarY").height(f-5))},500),200),p=parseInt(u*u/d),f=parseInt(m*m/g);f>300&&(f=0),$("#scrollBarX").width(p-5),$("#scrollBarY").height(f-5),$("#dataTable_wrapper").on("scroll",function(){$("#scrollBarX").css({left:-(u-p)*$("#dataTable_wrapper>.body").offset().left/(d-u)+2}),$(".dataTables_scrollBody").on("scroll",function(){$("#scrollBarY").css({top:-(m-f)*$("#dataTable").position().top/(g-m)+2})})})})});