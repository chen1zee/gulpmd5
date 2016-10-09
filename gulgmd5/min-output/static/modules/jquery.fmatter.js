define("jquery.fmatter",function(e,t,i){!function(e){"use strict";e.fmatter={},e.extend(e.fmatter,{isBoolean:function(e){return"boolean"==typeof e},isObject:function(t){return t&&("object"==typeof t||e.isFunction(t))||!1},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e&&isFinite(e)},isValue:function(e){return this.isObject(e)||this.isString(e)||this.isNumber(e)||this.isBoolean(e)},isEmpty:function(t){return!(!this.isString(t)&&this.isValue(t))&&(!this.isValue(t)||(t=e.trim(t).replace(/\&nbsp\;/gi,"").replace(/\&#160\;/gi,""),""===t))}}),e.fn.fmatter=function(t,i,r,o,n){var a=i;r=e.extend({},e.jgrid.formatter,r);try{a=e.fn.fmatter[t].call(this,i,r,o,n)}catch(e){}return a},e.fmatter.util={NumberFormat:function(t,i){if(e.fmatter.isNumber(t)||(t*=1),e.fmatter.isNumber(t)){var r,o=t<0,n=String(t),a=i.decimalSeparator||".";if(e.fmatter.isNumber(i.decimalPlaces)){var l=i.decimalPlaces,d=Math.pow(10,l);if(n=String(Math.round(t*d)/d),r=n.lastIndexOf("."),l>0)for(r<0?(n+=a,r=n.length-1):"."!==a&&(n=n.replace(".",a));n.length-1-r<l;)n+="0"}if(i.thousandsSeparator){var s=i.thousandsSeparator;r=n.lastIndexOf(a),r=r>-1?r:n.length;var f,u=n.substring(r),c=-1;for(f=r;f>0;f--)c++,c%3===0&&f!==r&&(!o||f>1)&&(u=s+u),u=n.charAt(f-1)+u;n=u}return n=i.prefix?i.prefix+n:n,n=i.suffix?n+i.suffix:n}return t}},e.fn.fmatter.defaultFormat=function(t,i){return e.fmatter.isValue(t)&&""!==t?t:i.defaultValue||"&#160;"},e.fn.fmatter.email=function(t,i){return e.fmatter.isEmpty(t)?e.fn.fmatter.defaultFormat(t,i):'<a href="mailto:'+t+'">'+t+"</a>"},e.fn.fmatter.checkbox=function(t,i){var r,o=e.extend({},i.checkbox);void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(o=e.extend({},o,i.colModel.formatoptions)),r=o.disabled===!0?'disabled="disabled"':"",(e.fmatter.isEmpty(t)||void 0===t)&&(t=e.fn.fmatter.defaultFormat(t,o)),t=String(t),t=(t+"").toLowerCase();var n=t.search(/(false|f|0|no|n|off|undefined)/i)<0?" checked='checked' ":"";return'<input type="checkbox" '+n+' value="'+t+'" offval="no" '+r+"/>"},e.fn.fmatter.link=function(t,i){var r={target:i.target},o="";return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(r=e.extend({},r,i.colModel.formatoptions)),r.target&&(o="target="+r.target),e.fmatter.isEmpty(t)?e.fn.fmatter.defaultFormat(t,i):"<a "+o+' href="'+t+'">'+t+"</a>"},e.fn.fmatter.showlink=function(t,i){var r,o={baseLinkUrl:i.baseLinkUrl,showAction:i.showAction,addParam:i.addParam||"",target:i.target,idName:i.idName},n="";return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(o=e.extend({},o,i.colModel.formatoptions)),o.target&&(n="target="+o.target),r=o.baseLinkUrl+o.showAction+"?"+o.idName+"="+i.rowId+o.addParam,e.fmatter.isString(t)||e.fmatter.isNumber(t)?"<a "+n+' href="'+r+'">'+t+"</a>":e.fn.fmatter.defaultFormat(t,i)},e.fn.fmatter.integer=function(t,i){var r=e.extend({},i.integer);return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(r=e.extend({},r,i.colModel.formatoptions)),e.fmatter.isEmpty(t)?r.defaultValue:e.fmatter.util.NumberFormat(t,r)},e.fn.fmatter.number=function(t,i){var r=e.extend({},i.number);return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(r=e.extend({},r,i.colModel.formatoptions)),e.fmatter.isEmpty(t)?r.defaultValue:e.fmatter.util.NumberFormat(t,r)},e.fn.fmatter.currency=function(t,i){var r=e.extend({},i.currency);return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(r=e.extend({},r,i.colModel.formatoptions)),e.fmatter.isEmpty(t)?r.defaultValue:e.fmatter.util.NumberFormat(t,r)},e.fn.fmatter.date=function(t,i,r,o){var n=e.extend({},i.date);return void 0!==i.colModel&&void 0!==i.colModel.formatoptions&&(n=e.extend({},n,i.colModel.formatoptions)),n.reformatAfterEdit||"edit"!==o?e.fmatter.isEmpty(t)?e.fn.fmatter.defaultFormat(t,i):e.jgrid.parseDate(n.srcformat,t,n.newformat,n):e.fn.fmatter.defaultFormat(t,i)},e.fn.fmatter.select=function(t,i){t=String(t);var r,o,n=!1,a=[];if(void 0!==i.colModel.formatoptions?(n=i.colModel.formatoptions.value,r=void 0===i.colModel.formatoptions.separator?":":i.colModel.formatoptions.separator,o=void 0===i.colModel.formatoptions.delimiter?";":i.colModel.formatoptions.delimiter):void 0!==i.colModel.editoptions&&(n=i.colModel.editoptions.value,r=void 0===i.colModel.editoptions.separator?":":i.colModel.editoptions.separator,o=void 0===i.colModel.editoptions.delimiter?";":i.colModel.editoptions.delimiter),n){var l,d=i.colModel.editoptions.multiple===!0,s=[];if(d&&(s=t.split(","),s=e.map(s,function(t){return e.trim(t)})),e.fmatter.isString(n)){var f,u=n.split(o),c=0;for(f=0;f<u.length;f++)if(l=u[f].split(r),l.length>2&&(l[1]=e.map(l,function(e,t){if(t>0)return e}).join(r)),d)e.inArray(l[0],s)>-1&&(a[c]=l[1],c++);else if(e.trim(l[0])===e.trim(t)){a[0]=l[1];break}}else e.fmatter.isObject(n)&&(d?a=e.map(s,function(e){return n[e]}):a[0]=n[t]||"")}return t=a.join(", "),""===t?e.fn.fmatter.defaultFormat(t,i):t},e.fn.fmatter.rowactions=function(t){var i=e(this).closest("tr.jqgrow"),r=i.attr("id"),o=e(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/,"$1"),n=e("#"+o),a=n[0],l=a.p,d=l.colModel[e.jgrid.getCellIndex(this)],s=d.frozen?e("tr#"+r+" td:eq("+e.jgrid.getCellIndex(this)+") > div",n):e(this).parent(),f={extraparam:{}},u=function(t,i){e.isFunction(f.afterSave)&&f.afterSave.call(a,t,i),s.find("div.ui-inline-edit,div.ui-inline-del").show(),s.find("div.ui-inline-save,div.ui-inline-cancel").hide()},c=function(t){e.isFunction(f.afterRestore)&&f.afterRestore.call(a,t),s.find("div.ui-inline-edit,div.ui-inline-del").show(),s.find("div.ui-inline-save,div.ui-inline-cancel").hide()};void 0!==d.formatoptions&&(f=e.extend(f,d.formatoptions)),void 0!==l.editOptions&&(f.editOptions=l.editOptions),void 0!==l.delOptions&&(f.delOptions=l.delOptions),i.hasClass("jqgrid-new-row")&&(f.extraparam[l.prmNames.oper]=l.prmNames.addoper);var m={keys:f.keys,oneditfunc:f.onEdit,successfunc:f.onSuccess,url:f.url,extraparam:f.extraparam,aftersavefunc:u,errorfunc:f.onError,afterrestorefunc:c,restoreAfterError:f.restoreAfterError,mtype:f.mtype};switch(t){case"edit":n.jqGrid("editRow",r,m),s.find("div.ui-inline-edit,div.ui-inline-del").hide(),s.find("div.ui-inline-save,div.ui-inline-cancel").show(),n.triggerHandler("jqGridAfterGridComplete");break;case"save":n.jqGrid("saveRow",r,m)&&(s.find("div.ui-inline-edit,div.ui-inline-del").show(),s.find("div.ui-inline-save,div.ui-inline-cancel").hide(),n.triggerHandler("jqGridAfterGridComplete"));break;case"cancel":n.jqGrid("restoreRow",r,c),s.find("div.ui-inline-edit,div.ui-inline-del").show(),s.find("div.ui-inline-save,div.ui-inline-cancel").hide(),n.triggerHandler("jqGridAfterGridComplete");break;case"del":n.jqGrid("delGridRow",r,f.delOptions);break;case"formedit":n.jqGrid("setSelection",r),n.jqGrid("editGridRow",r,f.editOptions)}},e.fn.fmatter.actions=function(t,i){var r,o={keys:!1,editbutton:!0,delbutton:!0,editformbutton:!1},n=i.rowId,a="";return void 0!==i.colModel.formatoptions&&(o=e.extend(o,i.colModel.formatoptions)),void 0===n||e.fmatter.isEmpty(n)?"":(o.editformbutton?(r="id='jEditButton_"+n+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",a+="<div title='"+e.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+r+"><span class='ui-icon ui-icon-pencil'></span></div>"):o.editbutton&&(r="id='jEditButton_"+n+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ",a+="<div title='"+e.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+r+"><span class='ui-icon ui-icon-pencil'></span></div>"),o.delbutton&&(r="id='jDeleteButton_"+n+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",a+="<div title='"+e.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+r+"><span class='ui-icon ui-icon-trash'></span></div>"),r="id='jSaveButton_"+n+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",a+="<div title='"+e.jgrid.edit.bSubmit+"' style='float:left;display:none' class='ui-pg-div ui-inline-save' "+r+"><span class='ui-icon ui-icon-disk'></span></div>",r="id='jCancelButton_"+n+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ",a+="<div title='"+e.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+r+"><span class='ui-icon ui-icon-cancel'></span></div>","<div style='margin-left:8px;'>"+a+"</div>")},e.unformat=function(t,i,r,o){var n,a,l=i.colModel.formatter,d=i.colModel.formatoptions||{},s=/([\.\*\_\'\(\)\{\}\+\?\\])/g,f=i.colModel.unformat||e.fn.fmatter[l]&&e.fn.fmatter[l].unformat;if(void 0!==f&&e.isFunction(f))n=f.call(this,e(t).text(),i,t);else if(void 0!==l&&e.fmatter.isString(l)){var u,c=e.jgrid.formatter||{};switch(l){case"integer":d=e.extend({},c.integer,d),a=d.thousandsSeparator.replace(s,"\\$1"),u=new RegExp(a,"g"),n=e(t).text().replace(u,"");break;case"number":d=e.extend({},c.number,d),a=d.thousandsSeparator.replace(s,"\\$1"),u=new RegExp(a,"g"),n=e(t).text().replace(u,"").replace(d.decimalSeparator,".");break;case"currency":d=e.extend({},c.currency,d),a=d.thousandsSeparator.replace(s,"\\$1"),u=new RegExp(a,"g"),n=e(t).text(),d.prefix&&d.prefix.length&&(n=n.substr(d.prefix.length)),d.suffix&&d.suffix.length&&(n=n.substr(0,n.length-d.suffix.length)),n=n.replace(u,"").replace(d.decimalSeparator,".");break;case"checkbox":var m=i.colModel.editoptions?i.colModel.editoptions.value.split(":"):["Yes","No"];n=e("input",t).is(":checked")?m[0]:m[1];break;case"select":n=e.unformat.select(t,i,r,o);break;case"actions":return"";default:n=e(t).text()}}return void 0!==n?n:o===!0?e(t).text():e.jgrid.htmlDecode(e(t).html())},e.unformat.select=function(t,i,r,o){var n=[],a=e(t).text();if(o===!0)return a;var l=e.extend({},void 0!==i.colModel.formatoptions?i.colModel.formatoptions:i.colModel.editoptions),d=void 0===l.separator?":":l.separator,s=void 0===l.delimiter?";":l.delimiter;if(l.value){var f,u=l.value,c=l.multiple===!0,m=[];if(c&&(m=a.split(","),m=e.map(m,function(t){return e.trim(t)})),e.fmatter.isString(u)){var p,v=u.split(s),h=0;for(p=0;p<v.length;p++)if(f=v[p].split(d),f.length>2&&(f[1]=e.map(f,function(e,t){if(t>0)return e}).join(d)),c)e.inArray(f[1],m)>-1&&(n[h]=f[0],h++);else if(e.trim(f[1])===e.trim(a)){n[0]=f[0];break}}else(e.fmatter.isObject(u)||e.isArray(u))&&(c||(m[0]=a),n=e.map(m,function(t){var i;if(e.each(u,function(e,r){if(r===t)return i=e,!1}),void 0!==i)return i}));return n.join(", ")}return a||""},e.unformat.date=function(t,i){var r=e.jgrid.formatter.date||{};return void 0!==i.formatoptions&&(r=e.extend({},r,i.formatoptions)),e.fmatter.isEmpty(t)?e.fn.fmatter.defaultFormat(t,i):e.jgrid.parseDate(r.newformat,t,r.srcformat,r)}}(jQuery)});