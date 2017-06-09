var gulp = require('gulp');
var connect = require('gulp-connect');
gulp.task('watchHtml',function(){
 gulp.watch(['./*.html','./template/*.html'],['html']);
});
gulp.task('watchJs',function(){
 gulp.watch(['./js/*.js','./template/*.js'],['html']);
});
gulp.task('watchCss',function(){
 gulp.watch('./css/*.css',['html']);
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
gulp.task('default',['connect','watchHtml','watchCss','watchJs']);
