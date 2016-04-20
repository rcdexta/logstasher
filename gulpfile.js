var gulp = require('gulp'),
  gulpNgConfig = require('gulp-ng-config');

var paths = {
  index: 'src/index.html',
  config: 'src/config/config.json'
};

gulp.task('config', function () {
  return gulp.src(paths.config)
    .pipe(gulpNgConfig('LogstasherApp', {environment: 'staging', createModule: false}))
    .pipe(gulp.dest('src/js'))
});

gulp.task('config-prod', function () {
  return gulp.src(paths.config)
    .pipe(gulpNgConfig('LogstasherApp', {environment: 'production', createModule: false}))
    .pipe(gulp.dest('src/js'))
});

gulp.task('build', ['config']);
gulp.task('build-prod', ['config-prod']);

gulp.task('default', ['build']);
