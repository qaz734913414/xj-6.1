var gulp = require('gulp');
var connect = require('gulp-connect');
var sass=require('gulp-sass');
gulp.task('watchHtml',function(){
 gulp.watch(['./*.html','./template/*.html'],['html']);
});
gulp.task('watchJs',function(){
 gulp.watch(['./js/*.js','./template/*.js'],['html']);
});
gulp.task('watchCss',function(){
 gulp.watch('./css/sass/*.scss',['html']);
});
gulp.task('watchSass',function(){
 gulp.watch('./css/sass/*.scss',['sass']);
});
 gulp.task('connect',function(){
     connect.server({
         root:'./',
         livereload: true,
         port: 8090
     })
 });

gulp.task('html', function(){
  gulp.src('./*.html')
      .pipe(connect.reload());
});
gulp.task('sass', function(){
  gulp.src('./css/sass/*.scss')
    .pipe( sass() ).pipe( gulp.dest( './css' ));
});
gulp.task('default',['connect','sass','watchHtml','watchCss','watchJs','watchSass']);
