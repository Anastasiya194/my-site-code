let gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  del = require("del"),
  browserSync = require("browser-sync"),
  fileinclude = require("gulp-file-include"),
  fs = require("fs"),
  path = require("path");

sass.compiler = require("node-sass"); // Переназначаем компилирование

// Функция удаление файлов
async function clean() {
  await del(["./build/*"]);
}
// Функция обработки html файлов
async function html(src, dest) {
  return await gulp
    .src(src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: path.join(__dirname, "src/components")
      })
    )
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}
// Функция обработки scss файлов
async function scss(src, dest) {
  return await gulp
    .src(src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(
      cleanCSS({
        level: 2
      })
    )
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}
// Функция обработки js файлов
async function js(src, dest) {
  return await gulp
    .src(src)
    .pipe(concat("script.js"))
    .pipe(uglify({ toplevel: true }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}
// Функция обработки шрифтов
async function fonts(src, dest) {
  return await gulp
    .src(src)
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}
// Функция обработки картинок
async function img(src, dest) {
  return await gulp
    .src(src)
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }));
}

// Собираем проект
async function buildProject() {
  // Обработка всех страниц (html, scss, js)
  const arrayPages = fs.readdirSync(path.join(__dirname, "src/pages"));
  let pathBuild = "";
  for (let folder of arrayPages) {
    if (folder === "main") {
      pathBuild = "build";
    } else {
      pathBuild = `build/pages/${folder}`;
    }
    await html(
      path.join(__dirname, `src/pages/${folder}/index.html`),
      path.join(__dirname, `${pathBuild}`)
    );
    await scss(
      path.join(__dirname, `src/pages/${folder}/style.scss`),
      path.join(__dirname, `${pathBuild}`)
    );
    await js(
      path.join(__dirname, `src/pages/${folder}/index.js`),
      path.join(__dirname, `${pathBuild}`)
    );
  }

  // Обработка стилей компонентов
  await scss("./src/components/common.scss", "./build");
  // Обработка картинок
  await img("./src/static/images/*", "./build/static/images");
  // Обработка шрифтов
  await fonts("./src/static/fonts/*", "./build/static/fonts");
}

// Перебрасываем доп. сайты в папку "build"
async function siteTransfer() {
  return await gulp
    .src("./src/others-sites/**")
    .pipe(gulp.dest("./build/others-sites"))
    .pipe(browserSync.reload({ stream: true }));
}

// Функция которая слушает изменения файлов в проекте
async function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
  // При изменении любого типа файлов пересобрать проект
  gulp.watch("./src/**/*.*", buildProject);
}

gulp.task("watch", watch);
gulp.task("buildProject", buildProject);
gulp.task("siteTransfer", siteTransfer);

// Сборка проекта
gulp.task("build", gulp.series(clean, buildProject, siteTransfer));
// Режим разработки
gulp.task("dev", gulp.series("build", "watch"));
