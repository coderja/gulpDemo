let gulp = require('gulp')
// let concat = require('gulp-concat')     //合并文件
// let uglify = require('gulp-uglify')
// let rename = require('gulp-rename')
// let less = require('gulp-less')
// let cleanCss = require('gulp-clean-css') //压缩css
// let htmlmin = require('gulp-htmlmin')    //压缩html
// let livereload = require('gulp-livereload') //半自动项目工具 解决手动构建 
// let connect = require('gulp-connect') 
let babel = require('gulp-babel') 
let pump = require('pump') 
let imagemin = require('gulp-imagemin'); //压缩图片
let cache = require('gulp-cache'); //缓存图片
let clean = require('gulp-clean'); 
let open = require('open') 

var $ = require('gulp-load-plugins')()//插件集合

gulp.task('js',['uglify_check'],function(){
    return gulp.src('src/js/*.js') //找到目标文件
    .pipe($.concat('build.js'))//合并文件
    .pipe(gulp.dest('dist/js'))//临时输出到dist/js下面
    /** 
     * 也可以在项目根目录中创建.babelrc 内容为：
     * {
     *   "presets": ["es2015"]  
     * }
     * 这样下面babel函数中里面就不需要传入参数
     * 
     * 还有安装gulp-babel一直报错提示babel-core not found 因为默认安装的是8.0.0版本 
     * 重新安装低版本即可这里安装的是 npm i gulp-babel@7 --save-dev
     **/
    .pipe(babel({
        "presets": ["es2015"]  
      }))
    .pipe($.uglify()) //压缩
    .pipe($.rename({suffix:'.min'})) //重命名
    .pipe(gulp.dest('dist/js/'))
    .pipe($.livereload())
    .pipe($.connect.reload())
})

/**
 * @description 检查压缩JS时的错误，作为'js'的依赖执行。
 * 
 * 1、解决js压缩出错的问题
 * 2、解决修改的代码有语法错误时，服务会终止的问题
 */
gulp.task('uglify_check', function (cb) {
    pump([
        gulp.src('src/js/*.js'),
        babel({
            "presets": ["es2015"]
          }),
        $.uglify(),
    ], cb);
});

gulp.task('image',function(){
    gulp.src('src/img/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
        optimizationLevel: 5, //类型：Number 默认：5 取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    })))
    .pipe(gulp.dest('dist/img'))
})

gulp.task('less',function(){
    return gulp.src('src/less/*.less')
    .pipe($.less()) //编译less为css
    .pipe(gulp.dest('src/css/'))
    .pipe($.livereload())
    .pipe($.connect.reload())
})

gulp.task('css',['less'],function(){
    return gulp.src('src/css/*.css')
    .pipe($.concat('build.css'))
    .pipe($.rename({suffix:'.min'}))
    .pipe($.cleanCss({compatibility:'ie8'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe($.livereload())
    .pipe($.connect.reload())
})
gulp.task('html',function(){
    return gulp.src('src/index.html')
    .pipe($.htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('dist/'))
    .pipe($.livereload())
    .pipe($.connect.reload())
})
//注册半自动监视任务
gulp.task('watch',['default'],function(){
    $.livereload.listen();//开始监听 确认监听的目标以及绑定的任务
    gulp.watch('src/js/*.js',['js'])
    gulp.watch(['src/less/*.less','src/css/*.css'],['css'])

})

// 清空dist文件夹
gulp.task('clean', function(){
    return gulp.src(['/dist/*'])
        .pipe(clean());
});

//注册全自动监视任务
gulp.task('server',['default'],function(){
    //配置服务器选项
    $.connect.server({
        root:'dist/', //输出的根目录
        livereload:true,
        port:5000
    })
    gulp.watch('src/js/*.js',['js'])
    gulp.watch(['src/less/*.less','src/css/*.css'],['css'])
    gulp.watch(['src/index.html'],['html'])
    open('http://localhost:5000/')
})

gulp.task('default',['clean'],function(){
    gulp.start(['js','css','html','image'])
})