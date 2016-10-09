define('page/report/search', function(require, exports, module){ require("common");
require("jquery");
require("jquery.dataTables.min");

$(function(){

    var option = {
        "autoWidth":false,
        //scrollY:"300px",
        language:{
            "lengthMenu":"每页显示：_MENU_",
            "infoFiltered":"",//---搜索后显示的信息
            "infoEmpty":"没有匹配的数据信息",//---无搜索结果
            "emptyTable":"没有相关数据",//---表格没有数据显示
            "zeroRecords":"没有相关数据信息",//---搜索结果为0
        },
        stripeClasses:[,'gray'],
        dom:'<"body"rt><"pagination"l>',
        columns:[//---行数据样式
            {data:"id",width:25,className:"dataTable__normal-cell"},
            {data:"goodsname",width:100,className:"dataTable__normal-cell"},
            {data:"productDate",width:100,className:"dataTable__normal-cell"},
            {data:"valueDate",width:100,className:"dataTable__normal-cell"},
            {data:"productor",width:100,className:"dataTable__normal-cell"},

        ],
        data:[
            {id:1,goodsname:"药品1",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:2,goodsname:"药品2",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:3,goodsname:"药品3",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:4,goodsname:"药品4",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:5,goodsname:"药品5",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:6,goodsname:"药品6",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:7,goodsname:"药品7",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:8,goodsname:"药品8",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:9,goodsname:"药品9",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
            {id:10,goodsname:"药品10",productDate:"2010-01-01",valueDate:"2016-01-01",productor:"一厂"},
        ],


    };
    var table = $("#dataTable").dataTable(option);
}); 
});