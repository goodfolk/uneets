/* ***************************************************************************
  gulpfile.js: Base gulp tasks
*************************************************************************** */

//# Imports

// config
const config        = require('./uneets-config')
const gulp          = require("gulp")
const gdebug        = require("gulp-debug");

// sass specific imports
const sass          = require("gulp-sass");
const sourcemaps    = require("gulp-sourcemaps")
const autoprefixer  = require("gulp-autoprefixer")
const cleanCSS      = require('gulp-clean-css')

//# Tasks

const allTasks = [];

//## SASS Task
gulp.task('sass', function () {
  const src = `${config.commonFolder}${config.scss.srcSubFolder}/${config.scss.entryFile}`
  const dist = `${config.dist}${config.scss.distSubFolder}/`
  console.log(src, dist)
  const mapsDir = './'
  return gulp
    .src(src)
    .pipe(gdebug({ title: "SASS task:" }))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "nested" }).on("error", sass.logError))
    .pipe(autoprefixer(config.scss.config.autoprefixerSettings))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sourcemaps.write(mapsDir))
    .pipe(gulp.dest(dist));
})
allTasks.push('sass')

//## WATCH Task
// Sources
const watchSources = {
  sass: [
    `${config.commonFolder}${config.scss.srcSubFolder}/**/*.scss`,
    `${config.uneetsFolder}/**/*.scss`
  ]
};
// task
gulp.task('watch', function() {
  var reportChange = function(event) {
    console.log(
      `File ${event.path} was ${event.type}, running tasks...`
    );
  };
  gulp.watch(watchSources.sass, ["sass"]).on("change", reportChange);
});

//## DIST Task
gulp.task('dist', allTasks)

//## DEFAULT Task
const doWatch = allTasks.slice(0)
doWatch.push('watch')
gulp.task('default', doWatch)