// Подключение пакетов
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var less = require('gulp-less');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var pug = require("gulp-pug");
var del = require("del");
var runSequence = require("run-sequence");

gulp.task('clean:build', function() {
    return del('./build');
});


// обноление страници
gulp.task('server', function() {
	browserSync.init({
       server: {baseDir: "./build/"}
	});


        // // слежка за изменениями в html
    gulp.watch('src/**/*.html', ['copy:html']);

            // // слежка за изменениями в css
    gulp.watch('src/css/*.css', ['copy:css']);

	// // слежка за изменениями в less
	gulp.watch('src/less/**/*.less', ['less']);

		// слежка за изменениями в scss
	// gulp.watch('src/scss/**/*.scss', ['scss']);

	// copy js
	gulp.watch('src/js/**/*.js', ['copy:js']);

        // copy libs
    gulp.watch('src/libs/**/*.*', ['copy:libs']);
        // copy img
    gulp.watch('src/img/**/*.*', ['copy:img']);


});


gulp.task('copy:html', function() {
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('copy:css', function() {
    return gulp.src('src/css/*.css')
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('copy:js', function() {
    return gulp.src('src/js/**/*.*')
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});

gulp.task('copy:libs', function() {
    return gulp.src('src/libs/**/*.*')
    .pipe(gulp.dest('./build/libs'))
    .pipe(browserSync.stream());
});


gulp.task('copy:img', function() {
    return gulp.src('src/img/**/*.*')
    .pipe(gulp.dest('./build/img'))
    .pipe(browserSync.stream());
});



                   // Для любителей LESS
// compiling less
gulp.task('less', function() {
     return gulp.src('./src/less/*.less')

// -------------------------------------
// ошибки
     .pipe( plumber({
     	errorHandler: notify.onError( function(err){
     		return {
     			title: 'styles',
     			message: err.message
     		}
     	})
     }))
// --------------------------------------
        
        .pipe(sourcemaps.init())
// обрабтка Лесс
     	.pipe(less())

     	// автопрефиксы
		.pipe( autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}) )
         
         .pipe(sourcemaps.write())

     	// записьв в файл
     	.pipe(gulp.dest('./build/css/style'))

     	// точечное обновление
     	.pipe(browserSync.stream());
});



//           // Для любителей SCSS
// // compiling scss
// gulp.task('scss', function() {
//      return gulp.src('./src/scss/main.scss')

// // -------------------------------------
// // ошибки
//      .pipe( plumber({
//      	errorHandler: notify.onError( function(err){
//      		return {
//      			title: 'styles',
//      			message: err.message
//      		}
//      	})
//      }))
// // --------------------------------------
        
//         .pipe(sourcemaps.init())
// // обрабтка Лесс
//      	.pipe(scss())

//      	// автопрефиксы
// 		.pipe( autoprefixer({
// 			browsers: ['last 3 versions'],
// 			cascade: false
// 		}) )
         
//          .pipe(sourcemaps.write())

//      	// записьв в файл
//      	.pipe(gulp.dest('./build/css'))

//      	// точечное обновление
//      	.pipe(browserSync.stream());
// });

//             PUG
// ---------------------------------
gulp.task('pug', function() {
   return gulp.src('./src/pug/pages/**/*.pug')
   .pipe(plumber({
       errorHandler: notify.onError(function(err){
          return {
              title: 'Pug' ,
              message: err.message
          }
       })
   }))
   .pipe(pug({
       pretty: true
   }))
   .pipe(gulp.dest('./build'))
   .pipe(browserSync.stream());
  });     
  // --------------------------------      

// вызов сервера дефолтно
gulp.task('default', function(callback){
      runSequence(
          'clean:build', 
          ["less","pug", "copy:js", "copy:libs", "copy:img", "copy:html", "copy:css"],
          'server',
         callback
        )
});