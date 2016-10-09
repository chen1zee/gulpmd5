define('page/user/warranty', function(require, exports, module){ require("common");
require("jquery.form.min");
var RefreshAddress = require("page/user/refreshaddress");
var DateUtil=require("DateUtil");
var tenantid = getUrlParam("tid");//商户ID
var tenantname = getUrlParam("tname");//商户名称

$(function () {
    document.getElementById('saleDate').valueAsDate = new Date();

    var maxdate=DateUtil.dateToStr("yyyy-MM-dd",new Date())
    $("#saleDate").attr("max",maxdate);

    var getGoodsStyle = function (_goodsid) {
        //读取商品资料
        baseJS.util.doRequest('', server + "/getlistgoodsstyle.smg", {
            tenantid: tenantid,
            goodsid: _goodsid
        }, function (data) {
            if (data.status == "success") {
                var data = data.data;
                $("select[name='styleid']").empty();
                $(data).each(function () {
                    $("select[name='styleid']").append("<option value='" + this.styleid + "'>" + this.stylename + "</option>");
                });
            } else if (data.status == "fail") {
                return;
            } else {
                showMsg("服务器繁忙,请稍后重试");
                return;
            }
        });
    };

    $.post(server + "/getheadurl.smg", {tenantid: tenantid}, function (data) {
        if (data.status == "success") {
            var data = data.data;
            //页头&图标Logo
            var ArrayExtImage=data.extimage;
            for(var i=0;i<ArrayExtImage.length;i++){
                if (ArrayExtImage[i].imgid=="1"){
                    //公司logo
                    $("#warranty").html(ArrayExtImage[i].tenantName);
                    $(".grey_img").css("background-image", "url(" + ArrayExtImage[i].imgPath + ")");
                }
                if (ArrayExtImage[i].imgid=="2"){
                    //页头部图片
                    //页头取图片显示data.imgPath
                    //var impath="http://114.55.57.145:8090/smg/image/ef3b263bc91444e29a6b30ca1d84fdc6.jpg";
                    $("#user_info").html("<img src='"+ArrayExtImage[i].imgPath+"' width='100%' HEIGHT='60px'/>");
                    //$("#user_info").html("<img src='/static/img/products/head450_60.jpg' HEIGHT='60px'/>");
                }
            }
            var linkTemplate="<li><a href='{0}'><b><img src='{1}' /></b><span>{2}</span></a></li>";
            /*var ahref="http://www.baidu.com";
            var imgsrc="/static/img/products/200_35.jpg";
            var caption="新闻中心";*/
            var mainmenuHtml="";
            for(var i in data.extlink){
                var item=data.extlink[i];
                mainmenuHtml+=baseJS.util.formatString(linkTemplate,item.linkurl,item.imageurl,item.caption);
            }
            $(".mainmenu").html(mainmenuHtml);
            //var mainmenulist=linktemplate+linktemplate;
               /* "<li><a href="http://www.baidu.com" ><b><img src="/static/img/products/weidi200_35.jpg" /></b><span>联系我们</span></a></li>"
                +"<li><a href="/" ><b><img src="/static/img/products/200_35.jpg" /></b><span>新闻中心</span></a></li>"
                +"<li><a href="/" ><b><img src="images/tb03.png" /></b><span>产品展示</span></a></li>"
                +"<li><a href="/" ><b><img src="images/tb04.png" /></b><span>防伪查询</span></a></li>";*/
            //$(".mainmenu").html(mainmenulist);

        } else if (data.status == "fail") {
            return;
        } else {
            showMsg("服务器繁忙,请稍后重试");
            return;
        }
    });
    $.post(server + "/getlistgoods.smg", {tenantid: tenantid}, function (data) {
        if (data.status == "success") {
            var data = data.data;
            var goodsid = data[0].goodsid;
            getGoodsStyle(goodsid);
            /*省*/
            $("select[name='goodsid']").empty();
            $(data).each(function () {
                $("select[name='goodsid']").append("<option value='" + this.goodsid + "'>" + this.goodsname + "</option>");
            });

        } else if (data.status == "fail") {
            return;
        } else {
            showMsg("服务器繁忙,请稍后重试");
            return;
        }
    });

    /*dom加载地址*/
    $.post(server + "/common/getaddress.smg", {type: 2, parentid: 1}, function (data) {
        if (data.status == "success") {
            var data = data.data;
            var taobaoid = data[0].taobaoid;
            RefreshAddress.refreshCityAndDistrict(server + "/common/getaddress.smg", taobaoid);
            /*省*/
            $("select[name='provinceid']").empty();
            $(data).each(function () {
                $("select[name='provinceid']").append("<option value='" + this.taobaoid + "'>" + this.name + "</option>");
            });
        } else if (data.status == "fail") {
            showMsg(data.message);
            return;
        } else {
            showMsg("服务器繁忙,请稍后重试");
            return;
        }
    });

    $("select[name='provinceid']").change(function () {
        var taobaoid = parseInt($(this).val());
        RefreshAddress.refreshCityAndDistrict(server + "/common/getaddress.smg", taobaoid);
    });
    $("select[name='cityid']").change(function () {
        var taobaoid = parseInt($(this).val());
        RefreshAddress.refreshDistrict(server + "/common/getaddress.smg", taobaoid);
    });
    $("select[name='goodsid']").change(function () {
        var goodsid = $(this).val();
        $("select[name='styleid']").empty();
        getGoodsStyle(goodsid);
    });
});

window.saveWarrantyCard = function () {
    var CustomerName = $("#CustomerName").val().trim();
    var phone = $("#phone").val().trim();
    var mail = $("#mail").val().trim();
    var qq = $("#qq").val().trim();
    var goodsid = $("#goodsid").val().trim();
    var styleid = $("#styleid").val().trim();
    var barcode = $("#barcode").val().trim();
    var price = $("#price").val().trim();
    var saleShop = $("#saleShop").val().trim();
    var address = $("#address").val().trim();
    var saleDate = $("#saleDate").val().trim();
    var saleInvoice = $("#saleInvoice").val().trim();
    var remark = $("#remark").val().trim();

    if (CustomerName == "") {
        showMsg("请输入个人姓名！");
        $("#CustomerName").focus();
        return false;
    }
    if (phone == "") {
        showMsg("请输入联系电话！");
        $("#phone").focus();
        return false;
    }
    if (goodsid == "") {
        showMsg("请选择产品！");
        $("#goodsid").focus();
        return false;
    }
    if (styleid == "") {
        showMsg("请选择商品型号！");
        $("#styleid").focus();
        return false;
    }
    if (barcode == "") {
        showMsg("请输入唯一码！");
        $("#barcode").focus();
        return false;
    }
    if (!checkFileSize($("#saleInvoice"), 2048)) {
        showMsg("上传文件不能大于2M");
        return;
    }

    var serverUrl = server + "/addwarrantyfile.smg";
    $("form").attr("enctype", "multipart/form-data");
    var myfile = $("#saleInvoice")[0].files[0];
    if (myfile == null) {
        $("form").attr("enctype", "application/x-www-form-urlencoded");
        serverUrl = server + "/addwarranty.smg";
    }

    /**
     * 将form表单元素值序列化成对象
     *的
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

    //var sss=getFormJson($('#addrForm'),tenantjson);
    //sss.push(tenantjson);
    //var sss=$.extend(tenantjson,sss);
    //showMsg(JSON.stringify(sss));

    /*
     var tenantjson = { "tenantid": tenantid };
     var param = $.extend(tenantjson || {}, serializeObject($("#addrForm")));
     */
    //json.newval.push(tenantjson);
    //showMsg(json);

    //var serverUrl2 = "/smg_server/addwarrantyfile.smg";
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

    /*
     $.ajax({
     type: "POST",
     url: serverUrl,
     dataType: "json",
     //contentType:"application/json",
     data: param,//object
     //data:{warrantyVO:param,saleInvoice:myfile},
     error: function (XMLHttpRequest, error, errorThrown) {
     showMsg("提交时出错！" + error + errorThrown);
     },
     success: function (data) {
     if (data.status == "success") {
     showMsg("提交成功");
     $("#addrForm").clearForm();
     } else {
     showMsg(data.message);
     }
     }
     });
     */

    /*

     $("#addrForm").ajaxSubmit({
     type:"post",
     url:serverUrl,
     success:function(){
     showMsg("提交成功");
     $("#addrForm").clearForm();
     },
     error:function(){
     showMsg("提交失败");
     }
     });
     */

    /*	var data={"customername":CustomerName,"phone":phone,"mail":mail,"qq":qq,"productno":productNo
     ,"productname":productName,"price":price,"saleshop":saleShop,"address":address,"saledate":saleDate
     ,"saleinvoice":saleInvoice,"remark":remark
     };

     $.ajax({
     type:"POST",
     url:server + '/smg_server/addwarranty.smg',
     dataType:"Text",
     //contentType:"application/json",
     data:{data:JSON.stringify(data)},//object
     error: function(XMLHttpRequest, error, errorThrown){
     showMsg("提交时出错！"+error+errorThrown);
     },
     success:function(data){
     if (data=="1")
     {
     showMsg("提交成功！");
     $("#CustomerName").val("");
     $("#phone").val("");
     $("#mail").val("");
     $("#qq").val("");
     $("#productNo").val("");
     $("#productName").val("");
     $("#price").val("");
     $("#saleShop").val("");
     $("#address").val("");
     $("#saleDate").val("");
     $("#saleInvoice").val("");
     $("#remark").val("");
     }else{
     showMsg("提交失败！");
     }
     }
     });*/
};

/**
 * 读取最大值
 * @returns {string}
 */
function getMaxSaleDate(){
    var curr = new Date().getFullYear();
    var currM = new Date().getMonth()+1;
    var currD = new Date().getDate();
    var maxdate = curr+"-"+currM+"-"+currD;
    return maxdate;
} 
});