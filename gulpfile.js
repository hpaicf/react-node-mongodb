var gulp=require('gulp').
    minjs=require('ulp-uglify'),
    minifycss=require('gulp-minify-css'),
    mRename = require('gulp-rename');//重命名

var babel = require('gulp-babel'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer');

var plumber = require('gulp-plumber');//阻止报错强制终止程序
var notify = require('gulp-notify');//报错提示

// 压缩js开始
gulp.task("minjs",function(){
	gulp.src('app.jsx')
	.pipe(minjs({
		preserveComments:"all"
	}))
	.pipe(mRename({
		extname:".min.jsx"
	}))
	.pipe(gulp.dest('/'));
});

// // es6 转化为 es6
// gulp.task('es6', () => {
//     gulp.src('/*.es6')
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(mRename({
// 			extname:".min.jsx"
// 		}))
//         .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//         .pipe(gulp.dest('/public/js/man.js'))//html引用此处的js就行
// });

// // less 编译
// gulp.task('less',function(){
//     gulp.src('less/*.less')
//         .pipe(less({compress:true}))
//         .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('css/'));//html引用此处的css就行
// });

// gulp.task('default',function(){
//     gulp.watch(['es6/*.es6','less/*.less'],['es6','less']);
// });
gulp.task("default",['minjs']);

