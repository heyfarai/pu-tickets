var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var shell = require('gulp-shell')
var sass = require('gulp-sass');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']

,
	'style': {
		all: './public/styles/**/*.less',
		output: './public/styles/'
	}

};

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.watch(paths.src, ['lint']);
});


gulp.task('watch:less', function () {
	gulp.watch(paths.style.all, ['less']);
});

gulp.task('sass', function() {
  gulp.src('./public/css/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
	.pipe(cleanCSS())
	.pipe(rename({
		extname: '.min.css'
	}))
    .pipe(gulp.dest('./public/css/'));
});


gulp.task('less', function(){
	gulp.src(paths.style.all)
		.pipe(less().on('error', less.logError))
		.pipe(gulp.dest(paths.style.output));
});


gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [

  'watch:less',

  'watch:lint'
]);

gulp.task('default', ['watch', 'runKeystone']);
