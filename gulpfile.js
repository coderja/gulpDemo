let gulp = require('gulp')
// let concat = require('gulp-concat')
// let uglify = require('gulp-uglify')
// let rename = require('gulp-rename')
// let less = require('gulp-less')
// let cleanCss = require('gulp-clean-css')
// let htmlmin = require('gulp-htmlmin')
// let livereload = require('gulp-livereload') //半自动项目工具 解决手动构建 
// let connect = require('gulp-connect') 
let open = require('open') 

var $ = require('gulp-load-plugins')()//插件集合

gulp.task('js',function(){
    return gulp.src('src/js/*.js') //找到目标文件
    .pipe($.concat('build.js'))//合并文件
    .pipe(gulp.dest('dist/js'))//临时输出到dist/js下面
    .pipe($.uglify()) //压缩
    .pipe($.rename({suffix:'.min'})) //重命名
    .pipe(gulp.dest('dist/js/'))
    .pipe($.livereload())
    .pipe($.connect.reload())
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

gulp.task('default',['js','css','html'])