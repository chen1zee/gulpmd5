var gulp = require("gulp");
var minifyCss = require('gulp-minify-css');//- 压缩CSS
var minJS = require('gulp-uglify');//----下载 压缩 js插件
var minHTML = require('gulp-htmlmin');//----压缩 html文件

var rev = require("gulp-rev");//---添加版本后缀
var revCollector = require("gulp-rev-collector");//---修改html引入文件+版本后缀

var minHTMLOptions = {//---minHTML参数设置
    collapseWhitespace:true,//---清除 空格
    //collapseBooleanAttributes:true,//----省略布尔属性值
    removeComments:true,//---清除注释
    //removeEmptyAttributes:true,//---清除 空属性
    //removeScriptTypeAttributes:true,//---清除 所有script标签上的 type属性
    //removeStyleLinkTypeAttributes:true,//---清除所有link标签上的 type属性
    //minifyJS:true,//---压缩 html中的 内联js代码
    //minifyCSS:true//---压缩html中的 内俩css代码
};

//----压缩版发布 文件夹 min-output

//************看 glob 简化 src文件 匹配
gulp.task("minHTML",function(){//---压缩html 文件任务
    return gulp.src('./output/wap/{*.html,**/*.html}',{base:'./output/'})
        .pipe(minHTML(minHTMLOptions))
        .pipe(gulp.dest('./min-output1/'));
});


gulp.task("cloneHTML",function(){//---复制 html 文件，暂不压缩
    return gulp.src('./output/wap/{*.html,**/*.html}',{base:'./output/'})
        .pipe(gulp.dest('./min-output/'));
})

gulp.task("minifyCss",function(){//---压缩css文件任务
    return gulp.src('./output/static/style/{*.css,**/*.css}',{base:'./output/'})
        .pipe(minifyCss())
        .pipe(gulp.dest('./min-output/'));
});
gulp.task("minJS",function(){//---压缩 js文件任务
    return gulp.src('./output/static/{modules/*.js,modules/**/*.js,lib/*.js}',{base:'./output/'})
        .pipe(minJS())
        .pipe(gulp.dest('./min-output/'));
});
gulp.task("cloneImg",function(){//---复制图片，不压缩
    return gulp.src('./output/static/img/**/*.{png,jpg}',{base:'./output/'})
        .pipe(gulp.dest('./min-output/'));

});


//---加md5版本后缀
gulp.task("md5",['cloneHTML','minifyCss','minJS','cloneImg'],function(){
    return gulp.src('./min-output/**/*.{js,css,png,jpg}')
        .pipe(rev())
        .pipe(gulp.dest('./final-output/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./map/'));
});


//---修改html 文件引用
gulp.task("rev",function(){//---["md5"],依赖md5先运行，，不过实际中 ，，运行完md5 任务 生成的　map.json 文件 读取不到，，，所以分开成2个任务
    return gulp.src(['./map/*.json','./min-output/wap/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./final-output/wap/'));
});

//---'minHTML',有问题 暂时 不运行
gulp.task("step1",['cloneHTML','minifyCss','minJS','cloneImg','md5']);//---压缩 js ,css, html 文件 ，直接 复制 img
//---然后 标记 版本号

//gulp.task("step2",['md5']);//---加版本后缀

gulp.task("step2",['rev']);//---html文件更新 资源 版本后缀





