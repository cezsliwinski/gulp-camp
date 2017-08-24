var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var injectPartials = require('gulp-inject-partials');
var htmlbeautify = require('gulp-html-beautify');
var importify = require('gulp-importify');
var livereload = require('gulp-livereload');
var gulpCopy = require('gulp-copy');
var concat = require('gulp-concat');

function compile_html() {
    gulp.src('./source/html/*.html')
        .pipe(injectPartials())
        .pipe(htmlbeautify({indentSize: 4}))
        .pipe(gulp.dest('./dist'));
}

function compile_files() {
    gulp.src("./source/modules/*/css/files/*")
        .pipe(gulpCopy('./dist/css/files', { prefix: 5 }));
    gulp.src("./source/modules/*/files/*")
        .pipe(gulpCopy('./dist/files', { prefix: 5 }));
}

function compile_sass() {
    gulp.src(["source/styles/**/*.scss","source/modules/**/css/*.scss"], { base: process.cwd() })
        .pipe(importify('main.scss', {
            cssPreproc: 'scss'
        }))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest("dist/css"))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

function compile_js() {
    gulp.src("source/modules/*/js/*.js")
        .pipe(concat("main.min.js"))
        .pipe(gulp.dest("./dist/js/"))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

function compile_plugins() {
    gulp.src("")
        .pipe(concat("plugins.min.js"))
        .pipe(gulp.dest("./dist/js"))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

gulp.task("serve", function () {
    compile_html();
    compile_files();
    browserSync.init({
        logConnections: true,
        injectChanges: true,
        open: false,
        server: {
            baseDir: "./dist"
        }
    });
    compile_sass();
    compile_js();
    // compile_plugins();
    gulp.watch(["source/styles/**/*.scss","source/modules/**/css/*.scss"], function(){compile_sass()});
    gulp.watch("source/modules/*/js/*.js", function(){compile_js()});
    gulp.watch("source/modules/*/html/*.html", function(){compile_html()});
});