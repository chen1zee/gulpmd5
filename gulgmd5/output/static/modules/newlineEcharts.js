define('newlineEcharts', function(require, exports, module){ /**
 * Created by HanSon on 2016/1/24.
 */

//使用例子
//var option = {}//---echart的配置项
//option = newline(option,6,'yAxis');
// ---参数一：你的option
//---参数二：多少字数换行
//---参数三：'yAxis'||'xAxis'


function newline(option, number, axis){
    if(!option[axis]['axisLabel']){//---配置项不存在时
        option[axis]['axisLabel'] = {};
    }

    option[axis]['axisLabel']['interval'] = 0;
    option[axis]['axisLabel']['formatter'] = function(params){
        var newParamsName = "";
        var paramsNameNumber = params.length;
        var provideNumber = number;
        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
        if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                } else {
                    tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
            }
        } else {
            newParamsName = params;
        }
        return newParamsName
    }

    //return option;

}

if ( "object"==typeof module&&"object"==typeof module.exports ) {
    module.exports = newline;
}
 
});