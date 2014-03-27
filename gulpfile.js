var gulp = require('gulp');

var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jshintstlish = require("jshint-stylish");

gulp.task('lint', function () {
	gulp.src('./src/Quiz.js')
		.pipe(jshint('.jshintrc'))
    	.pipe(jshint.reporter(jshintstlish));
});

gulp.task('mocha', function () {
	gulp.src('./test/**/*.js')
    	.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'mocha']);
