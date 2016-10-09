define('page/user/refreshaddress', function(require, exports, module){ 
var $=jQuery=require("jquery");

var RefreshAddress=function($){
	this.refreshCityAndDistrict=function (server,taobaoid) {
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
    };
    this.refreshDistrict=function (server,taobaoid) {
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
    };
	return this;
}(jQuery);

if ("object" == typeof module && "object" == typeof module.exports) {
	module.exports = RefreshAddress;
} 
 
});