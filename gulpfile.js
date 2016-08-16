var gulp				= require("gulp");
var browserify	= require("browserify");
var source			= require('vinyl-source-stream');
var tsify				= require("tsify");

gulp.task("default", function () {
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