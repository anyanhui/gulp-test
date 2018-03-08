const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');//- 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');//- 路径替换
const clean = require('gulp-clean');
const minifyCSS = require('gulp-minify-css');
const concat = require('gulp-concat');
const less = require('gulp-less');

// gulp.src会指定源文件，然后通过pipe函数把内容传给下个处理方法，最后gulp.dest是输出处理后的文件内容。
gulp.task('dev-js', () =>{
    return gulp.src(['./src/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('dist.js'))
        .pipe(gulp.dest('./src/jsmin'));
});
gulp.task('dev-css', () =>{
    return gulp.src(['./src/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./src/css'))
        .pipe(concat('dist.css'))
        .pipe(gulp.dest('./src/cssmin'));
});
gulp.task('dev-clean', function () {
    gulp.src(['./src/cssmin/*','./src/jsmin/*'], { force: true,read:false }).pipe(clean());
});
gulp.task('dev-rev', function() {
    return gulp.src(['index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件                                 //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});
gulp.task('build-js', () =>{
    return gulp.src(['./src/js/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('dist.js'))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./src/jsmin'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
});
gulp.task('build-css', () =>{
    return gulp.src(['./src/less/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./src/css'))
        .pipe(concat('dist.css'))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest('./src/cssmin'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./revcss'));
});
gulp.task('build-rev', function() {
    return gulp.src(['./rev/*.json','./revcss/*.json', 'index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});
gulp.task('build-clean', function () {
    gulp.src(['./application/**','./src/cssmin/*','./src/jsmin/*'], { force: true,read:false }).pipe(clean());
});

//增加watch监听
gulp.task('watch', ()=> {
    gulp.watch(['src/css/*','src/js/*'], ['dev-clean','dev-js','dev-css','dev-rev']);
})

gulp.task('default', ['build-clean','build-js','build-css','build-rev']);
