var gulp         = require('gulp');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var tsify        = require('tsify');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var buffer       = require('vinyl-buffer');
var cssmin       = require('gulp-cssmin');
var rename       = require('gulp-rename');
var watch        = require('gulp-watch');
var browserSync  = require('browser-sync');
var runSequence  = require('run-sequence');

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch('js/**/*.ts', function () {
    runSequence('develop', browserSync.reload);  
  });

  watch('css/**/*.css', function () {
    runSequence('style', browserSync.reload);  
  });  
});

gulp.task("develop", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['js/app.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest("dist"));
});

gulp.task("production", function() {
    return browserify({
        basedir: '.',
        debug: false,
        entries: ['js/app.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));    
});

gulp.task("style", function() {
    gulp.src("css/main.css")
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("dist/style"));
});
