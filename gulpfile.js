// ***************************************************************************
// Gulpfile.js
// Contains basic Uneet tasks
// edit at your own peril
// ***************************************************************************

// config
var vars = require('./gulp-config.js')

// general packages
var gulp = require('gulp')
var doNothing = require('gulp-empty')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var livereload = require('gulp-livereload')
var exec = require('child_process').exec

// sass related packages
var sass = require('gulp-sass')
var autoprefixer = (vars.scss.config.autoprefix)
    ? require('gulp-autoprefixer')
    : doNothing
var cleanCSS = (vars.scss.config.minify)
    ? require('gulp-clean-css')
    : doNothing
var renameSass = (vars.scss.config.minify)
    ? rename
    : doNothing

// html / handlebars related packages
var handlebars = require('gulp-compile-handlebars')

// js related packages
var standard = (vars.js.config.useStandard)
  ? require('gulp-standard')
  : doNothing
var babel = (vars.js.config.useBabel)
    ? require('gulp-babel')
    : doNothing
babel.babelPreset = vars.js.config.babelConfig

// process html / handlebars

gulp.task('hbs', function () {
  return gulp.src(vars.hbs.src + '*.html')
    .pipe(handlebars({}, vars.hbs.config.hbsOpts))
    .pipe(gulp.dest(vars.hbs.outputFolder))
})

// Process SCSS style files.
gulp.task('sass', function () {
  var mapsDir = './'
  var customSrcs = [
    vars.scss.src + 'custom/vars.scss',
    vars.scss.src + 'custom/mixins/**/*.scss',
    (function (useReset) {
      return (useReset)
                ? vars.scss.src + 'custom/common/reset.scss'
                : ''
    })(vars.scss.config.useReset),
    (function (useNormalize) {
      return (useNormalize)
                ? vars.scss.src + 'custom/common/normalize.scss'
                : ''
    })(vars.scss.config.useNormalize),
    vars.scss.src + 'custom/common/global.scss',
    vars.scss.src + 'custom/modules/**/*.scss',
    vars.scss.src + 'custom/_shame.scss'
  ]
  var libSrcs = [vars.scss.src + 'libs/**/*.css']
  var outputFile = vars.scss.outputFilename + '.css'
  var libsOutputFile = 'libs.css'
  var destDir = vars.scss.outputFolder
  console.log('Writing ' + destDir + libsOutputFile)
  gulp.src(libSrcs)
      .pipe(sourcemaps.init())
      .pipe(concat(libsOutputFile))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
  console.log('Writing ' + destDir + outputFile)
  return gulp.src(customSrcs)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'nested'})
        .on('error', sass.logError))
      .pipe(autoprefixer(vars.scss.config.autoprefixerSettings))
      .pipe(concat(outputFile))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(renameSass({suffix: '.min'}))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
      .pipe(livereload())
})

// Process JS
gulp.task('js', function () {
  var mapsDir = './'
  var customSrc = [vars.js.src + 'custom/**/*.js']
  var outputFile = vars.js.outputFilename + '.js'
  var destDir = vars.js.outputFolder
  var libsSrc = [vars.js.src + 'libs/**/*.js']
  var libsOutputFile = 'libs.js'

  var lintResult = gulp.src(customSrc)

  exec('standard --fix', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
  })

  gulp.src(libsSrc)
      .pipe(concat(libsOutputFile))
      .pipe(gulp.dest(destDir))
  return gulp.src(customSrc)
      .pipe(standard())
      .pipe(standard.reporter('default', vars.js.config.standardOpts))
      .pipe(sourcemaps.init())
      .pipe(babel(vars.js.config.babelConfig))
      .pipe(concat(outputFile))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
})

// Process assets
gulp.task('assets', function () {
  gulp.src(vars.assets.src + '**/*.*').pipe(gulp.dest(vars.assets.output))
})

// Task: gulp watch
gulp.task('watch', function () {
  gulp.watch(vars.source.folder + vars.source.sass.folder + '**/*.scss', ['sass'])
  gulp.watch(vars.source.folder + vars.source.js.folder + '**/*.js', ['js'])
  gulp.watch(vars.source.folder + vars.source.assets.folder + '**/*.*', ['assets'])
})
