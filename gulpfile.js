const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');//- 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');//- 路径替换
var clean = require('gulp-clean');
var minifyCSS = require('gulp-minify-css');

// gulp.src会指定源文件，然后通过pipe函数把内容传给下个处理方法，最后gulp.dest是输出处理后的文件内容。
gulp.task('es6', () =>{
    gulp.src(['./src/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
});
gulp.task('css', () =>{
    gulp.src(['./src/app.css'])
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./revcss'));
});
gulp.task('rev', function() {
    gulp.src(['./rev/*.json','./revcss/*.json', 'index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});
gulp.task('build-clean', function () {
    gulp.src(['./dist/','./application/'], { force: true }).pipe(clean());
});

//增加watch监听
// gulp.task('default', ()=> {
//     gulp.watch('src/app.js', ['es6','rev']);
// })
gulp.task('default', ['build-clean','es6','css','rev']);
