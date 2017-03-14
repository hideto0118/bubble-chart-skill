var browserSync = require('browser-sync');

// 'gulp' means the folder in the node_modules
var gulp = require('gulp');

// saerching 'gulp-sass' folder
var sass = require('gulp-sass');

// "pipe" means chain sth together
gulp.task('sass', function(){
 return gulp.src('app/scss/base.scss')
     .pipe(sass())
     .pipe(gulp.dest('app/css'))
});

//auto reload//
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes then reload
gulp.task('serve', function() {
 browserSync({
   server: {
     baseDir: 'app'
   }
 });

 gulp.watch(['*.html', 'css/*.css', 'js/*.js'], {cwd: 'app'}, reload);
 gulp.watch(['scss/*.scss'], {cwd: 'app'}, ['sass']);
});