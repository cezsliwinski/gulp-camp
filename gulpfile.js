var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var injectPartials = require('gulp-inject-partials');
var htmlbeautify = require('gulp-html-beautify');
var importify = require('gulp-importify');
var livereload = require('gulp-livereload');
var gulpCopy = require('gulp-copy');
var concat = require('gulp-concat');
var conf = require('./source/config.json');

function compile_html() {
    gulp.src(conf.compile.html.paths)
        .pipe(injectPartials())
        .pipe(htmlbeautify({indentSize: 4}))
        .pipe(gulp.dest(conf.compile.html.folder));
}

function compile_files() {
    gulp.src(conf.compile.files.forStyles.paths)
        .pipe(gulpCopy(conf.compile.files.forStyles.folder, { prefix: 5 }));
    gulp.src(conf.compile.files.forHtml.paths)
        .pipe(gulpCopy(conf.compile.files.forHtml.folder, { prefix: 5 }));
}

function compile_sass() {
    gulp.src(conf.compile.plugin_styles.paths.concat(conf.compile.main_styles.paths), { base: process.cwd() })
        .pipe(importify(conf.compile.main_styles.file, {
            cssPreproc: 'scss'
        }))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(conf.compile.main_styles.folder))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

function compile_js() {
    gulp.src(conf.compile.main_scripts.paths)
        .pipe(concat(conf.compile.main_scripts.file))
        .pipe(gulp.dest(conf.compile.main_scripts.folder))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

function compile_plugins() {
    gulp.src(conf.compile.plugins_scripts.paths)
        .pipe(concat(conf.compile.plugins_scripts.file))
        .pipe(gulp.dest(conf.compile.plugins_scripts.folder))
        .pipe(livereload())
        .pipe(browserSync.stream());
}

function copy_items() {
    gulp.src(conf.copy.paths)
        .pipe(gulpCopy('./dist/js', { prefix: 5 }));
}

gulp.task("serve", function () {
    compile_html();
    compile_files();
    copy_items();
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
    compile_plugins();
    gulp.watch(conf.compile.main_styles.paths, function(){compile_sass()});
    gulp.watch(conf.compile.main_scripts.paths, function(){compile_js()});
    gulp.watch(conf.compile.html.paths, function(){compile_html()});
});