'use strict';

// import
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import pleeease from 'gulp-pleeease';
import browserify from 'browserify';
import babelify from 'babelify';
import uglifyify from 'uglifyify';
import readConfig from 'read-config';
import watch from 'gulp-watch';


// const
const SRC = './src';
const CONFIG = './src/config';
const DEST = './template';


// css
gulp.task('sass', () => {
    const config = readConfig(`${CONFIG}/pleeease.json`);
    return gulp.src(`${SRC}/scss/core.scss`)
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(pleeease(config))
        .pipe(gulp.dest(DEST));
});

gulp.task('css', gulp.series('sass'));


// js
gulp.task('browserify', () => {
    return browserify(`${SRC}/js/core.js`)
        .transform(babelify)
        .transform(uglifyify)
        .bundle()
        .pipe(source('core.js'))
        .pipe(gulp.dest(DEST));
});

gulp.task('js', gulp.parallel('browserify'));


// watch
gulp.task('watch', () => {
    watch([`${SRC}/scss/**/*.scss`], gulp.series('sass'));
    watch([`${SRC}/js/**/*.js`], gulp.series('browserify'));
});


// default
gulp.task('build', gulp.parallel('css', 'js'));
gulp.task('default', gulp.series('build', 'watch'));
