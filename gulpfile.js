var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del'),
    browserSync = require('browser-sync'),
    fileinclude = require('gulp-file-include');

sass.compiler = require('node-sass'); // Переназначаем компилирование

//Обработка scss кода
function scss() {
  return gulp.src('./src/scss/main.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(gulp.dest('./build'))
  .pipe(browserSync.reload({stream: true}))
}
//Обработка js кода
function js() {
  return gulp.src('./src/js/*.js')
  .pipe(concat('script.js'))
  .pipe(uglify({toplevel: true}))
  .pipe(gulp.dest('./build'))
  .pipe(browserSync.reload({stream: true}))
}
//Инклудинг компонентов на страницы и последующая обработка html кода
function html() {
  return gulp.src('src/html/pages/*.html')
  .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
  .pipe(gulp.dest('./build'))
  .pipe(browserSync.reload({ stream: true }))
}
//Обработка шрифтов
function fonts() {
  return gulp.src('./src/fonts/*')
  .pipe(gulp.dest('./build/fonts'))
  .pipe(browserSync.reload({ stream: true }))
}
//Обработка img
function img() {
  return gulp.src('./src/image/*')
  .pipe(gulp.dest('./build/img'))
  .pipe(browserSync.reload({ stream: true }))
}
//Удалить всё в указанной папке
function clean() {
  return del(['./build/*'])
}

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  //Следить за SCSS файлами
  gulp.watch('./src/scss/**/*.scss', scss)
  //Следить за JS файлами
  gulp.watch('./src/js/*.js', js)
  //При изменении HTML запустить синхронизацию
  gulp.watch([
    "./src/html/components/*.html",
    "./src/html/pages/*.html"
  ], html).on('change', browserSync.reload);
}

gulp.task('scss', scss);
gulp.task('js', js);
gulp.task('html', html);
gulp.task('fonts', fonts);
gulp.task('img', img);
gulp.task('watch', watch);

//Запуск buld проекта
gulp.task('build', gulp.series(clean, gulp.parallel(scss, js, html, fonts, img)))
//Запуск dev проекта
gulp.task('dev', gulp.series('build', 'watch'));
