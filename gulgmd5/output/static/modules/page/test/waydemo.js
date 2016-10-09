define('page/test/waydemo', function(require, exports, module){ require("common");
//require("jquery.form.min");
way = require("way.min");

way.w.ready(function () {

    way.watchAll(function (selector, value) {
        console.log("Something changed.", {
            selector: selector,
            value: value
        });
    });

});

$(function () {

//	baseJS.App.initPage('������Ϣ', 0, 1, 0, '', 1, 0, '');

    var data = {name: "name", age: 20, gender: "121212"};
    way.set("myFormData", data);

    $('#btnpost').click(function () {
        var data = way.get("myFormData");
        $.each(data, function (name, value) {
            alert(name + "-" + value);
        });
    });

});

 
});