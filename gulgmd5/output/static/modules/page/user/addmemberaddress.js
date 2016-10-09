define('page/user/addmemberaddress', function(require, exports, module){ require("common");
require("jquery.form.min");
way=require("way.min");


$(function () {
   var serverUrl=server+"/common/getaddress.smg";
   baseJS.App.initPage('添加收货地址', 0, 1, 0, '', 1, 0, '');
   /*dom加载地址*/
   $.post(serverUrl,{type:2,parentid:1}, function (data) {
	   if(data.status=="success"){
		   var data=data.data;
		   var taobaoid=data[0].taobaoid;
		   $.refreshCityAndDistrict(server,taobaoid);
		   /*省*/
		   $("select[name='provinceid']").empty();
		   $(data).each(function () {
			   $("select[name='provinceid']").append("<option value='"+this.taobaoid+"'>"+this.name+"</option>");
		   });
	   }else if(data.status=="fail"){
		   alert(data.message);
		   return;
	   }else{
		   alert("服务器繁忙,请稍后重试");
		   return;
	   }
   });

   $("select[name='provinceid']").change(function(){
	   var taobaoid=parseInt($(this).val());
	   $.refreshCityAndDistrict(server,taobaoid);
   });
   $("select[name='cityid']").change(function(){
	   var taobaoid=parseInt($(this).val());
	   $.refreshDistrict(server,taobaoid);
   });

   $("form").submit(function () {
	   var serverUrl=server+"/member/addadress.smg";
	   var data=$("form").serialize();
	   $.post(serverUrl,data, function (data) {
		   if(data.status=='success'){
			  window.location="/wap/user/memberaddress.html";
		   }else if(data.status=='fail'){
			   alert(data.message);
		   }else{
			   alert("服务器繁忙,请稍后重试");
		   }
	   });
	   return false;
   });
});

/**
 * Created by Administrator on 2016/3/22.
 */
$.extend({
    refreshCityAndDistrict: function (server,taobaoid) {
        var cityparentid=taobaoid;
        var districtparentid=cityparentid+100;
        /*市*/
        $.post(server,{type:3,parentid:cityparentid}, function (data) {
            if(data.status!="success") return;
            var data=data.data;
            $("select[name='cityid']").empty();
            $(data).each(function () {
                $("select[name='cityid']").append("<option value='"+this.taobaoid+"'>"+this.name+"</option>");
            });
        });
        /*区*/
        $.post(server,{type:4,parentid:districtparentid}, function (data) {
            if(data.status!="success") return;
            var data=data.data;
            $("select[name='districtid']").empty();
            $(data).each(function () {
                $("select[name='districtid']").append("<option value='"+this.taobaoid+"'>"+this.name+"</option>");
            });
        });
    },
    refreshDistrict: function (server,taobaoid) {
        var districtparentid=taobaoid;
        /*区*/
        $.post(server,{type:4,parentid:districtparentid}, function (data) {
            if(data.status!="success") return;
            var data=data.data;
            $("select[name='districtid']").empty();
            $(data).each(function () {
                $("select[name='districtid']").append("<option value='"+this.taobaoid+"'>"+this.name+"</option>");
            });
        });
    }
});
 
});