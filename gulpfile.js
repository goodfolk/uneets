// ***************************************************************************
// Gulpfile.js
// Contains basic Uneet tasks
// edit at your own peril
// ***************************************************************************

// config
var vars = require('./gulp-config.js')
var allSources = {}

// general packages
var gulp = require('gulp')
var doNothing = require('gulp-empty')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var connect = require('gulp-connect')
var gutil = require('gulp-util')
var gulpIf = require('gulp-if')
var exec = require('child_process').exec

// uneet related packages
var fs = require('fs');
var argv = require('yargs').argv;
var makeFiles = require('./gulp-src/uneet-base-files.js')

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
var handlebars = (!vars.hbs.ignore)
    ? require('gulp-compile-handlebars')
    : doNothing
var hbsData = (!vars.hbs.ignore)
    ? require('./handlebars.js')
    : doNothing

// js related packages
var eslint = (vars.js.config.useESLint)
    ? require('gulp-eslint')
    : doNothing
var babel = (vars.js.config.useBabel)
    ? require('gulp-babel')
    : doNothing
babel.babelPreset = vars.js.config.babelConfig
var uglify = (vars.js.config.minify)
    ? require('gulp-uglify')
    : doNothing

// Task: hbs -- process html / handlebars
gulp.task('hbs', function () {
  var hbsSources = [ vars.hbs.src + '*.html' ]

  allSources.hbs = hbsSources
  allSources.hbs.push(vars.hbs.src + '**/*.handlebars')

  vars.hbs.config.hbsOpts.helpers = hbsData.helpers

  var hbsStream = gulp.src(hbsSources)
    .pipe(handlebars(hbsData.templateData, vars.hbs.config.hbsOpts)
      .on('error', function (e) {
        console.warn('Error in handlebars processing')
        gutil.log(e)
        hbsStream.end()
      }))
    .pipe(gulp.dest(vars.hbs.outputFolder))

  return hbsStream
})

// Task: sass -- Process SCSS style files.
gulp.task('sass', function () {
  var mapsDir = './'
  var customSrcs = [
    vars.scss.src + 'custom/vars.scss',
    vars.scss.src + 'custom/mixins/*.scss',
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
    vars.scss.src + 'custom/uneets/**/*.scss',
    vars.scss.src + 'custom/modules/**/*.scss',
    vars.scss.src + 'custom/shame.scss'
  ]
  var libSrcs = [vars.scss.src + 'libs/**/*.css']
  var outputFile = vars.scss.outputFilename + '.css'
  var libsOutputFile = 'libs.css'
  var destDir = vars.scss.outputFolder

  allSources.sass = []
  allSources.sass = allSources.sass.concat(customSrcs, libSrcs)

  console.log('Writing ' + destDir + libsOutputFile)
  gulp.src(libSrcs)
      .pipe(sourcemaps.init())
      .pipe(concat(libsOutputFile))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
  console.log('Writing ' + destDir + outputFile)
  return gulp.src(customSrcs)
      .pipe(sourcemaps.init())
      .pipe(concat(outputFile))
      .pipe(sass({outputStyle: 'nested'})
        .on('error', sass.logError))
      .pipe(autoprefixer(vars.scss.config.autoprefixerSettings))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(renameSass({suffix: '.min'}))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
})

// Process JS
gulp.task('js', function () {
  var mapsDir = '.'
  var customSrc = [ vars.js.src + 'custom/**/*.js' ]
  var customSrcFolder = vars.js.src + 'custom/'
  var outputFile = vars.js.outputFilename + '.min.js'
  var destDir = vars.js.outputFolder
  var libsSrc = [vars.js.src + 'libs/**/*.js', 'node_modules/babel-polyfill/dist/polyfill.js']
  var libsOutputFile = 'libs.js'

  allSources.js = []
  allSources.js = allSources.js.concat(customSrc, libsSrc)

  isFixed = function (file) {
    return file.eslint != null && file.eslint.fixed
  }

  gulp.src(customSrc)
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    //.pipe(eslint.failAfterError())
    .pipe(gulpIf(isFixed, gulp.dest(customSrcFolder)))

  gulp.src(libsSrc)
      .pipe(concat(libsOutputFile))
      .pipe(gulp.dest(destDir))
  return gulp.src(customSrc)
      //.pipe(eslint())
      //.pipe(eslint.format())
      //.pipe(eslint.failAfterError())
      .pipe(sourcemaps.init())
      .pipe(babel(vars.js.config.babelConfig).on('error', function (e) {
        gutil.log(e)
      }))
      .pipe(concat(outputFile).on('error', function (e) {
        gutil.log(e)
      }))
      .pipe(uglify({ mangle: false }))
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
})

// Process assets
gulp.task('assets', function () {
  var assetSrcs = [ vars.assets.src + '**/*.*' ]

  allSources.assets = assetSrcs

  gulp.src(assetSrcs).pipe(gulp.dest(vars.assets.output))
})

// Task php-partials
gulp.task('php-partials',function(){
  var phpSrcs = [ vars.php.src + '**/*.php' ]

  allSources.php = phpSrcs

  gulp.src(phpSrcs).pipe(gulp.dest(vars.php.output))
})

// Task: gulp watch
gulp.task('watch', function () {
  var reportChange = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
  }
  gulp.watch(allSources.sass, ['sass']).on('change',reportChange)
  gulp.watch(allSources.hbs, ['hbs']).on('change',reportChange)
  gulp.watch(allSources.php, ['php-partials']).on('change',reportChange)
  gulp.watch(allSources.js, ['js']).on('change',reportChange)
  gulp.watch(allSources.assets, ['assets']).on('change',reportChange)
})

// Task: Serve (serves the dist folder)
gulp.task('serve', function () {
  connect.server({
    root: vars.baseDist,
    livereload: vars.server.useServer,
    port: vars.server.serverPort
  })
})

// Task: uneets -- newUneet new uneet files
// usage: "gulp uneets --make unitName"
const MAKE_NAME = 'make'
gulp.task('uneets',function(){
  var force = argv.f
  var newUneet = { scss: {}, js: {}, php: {}, hbs: {} }
  var newUneetName = 'u_' + argv[MAKE_NAME];
  // scss
  newUneet.scss.name = newUneetName + '.scss'
  newUneet.scss.dest = vars.scss.uneetsFolder + '/'
  newUneet.scss.file = newUneet.scss.dest + newUneet.scss.name
  newUneet.scss.content = makeFiles.scssBase(newUneetName)
  if ((!vars.scss.ignore) && (( !fs.existsSync(newUneet.scss.file) ) || ( force ))) {
    fs.writeFile(newUneet.scss.file, newUneet.scss.content, null);
  }
  // js
  newUneet.js.name = newUneetName + '.js'
  newUneet.js.dest = vars.js.uneetsFolder + '/'
  newUneet.js.file = newUneet.js.dest + newUneet.js.name
  newUneet.js.content = makeFiles.jsBase(newUneetName)
  if ((!vars.js.ignore) && (( !fs.existsSync(newUneet.js.file) ) || ( force ))) {
    fs.writeFile(newUneet.js.file, newUneet.js.content, null);
  }
  // php
  newUneet.php.name = newUneetName + '.tpl.php'
  newUneet.php.dest = vars.php.uneetsFolder + '/'
  newUneet.php.file = newUneet.php.dest + newUneet.php.name
  newUneet.php.content = makeFiles.phpBase(newUneetName)
  if ((!vars.php.ignore) && (( !fs.existsSync(newUneet.php.file) ) || ( force ))) {
    fs.writeFile(newUneet.php.file, newUneet.php.content, null);
  }
  // hbs
  newUneet.hbs.name = newUneetName + '.handlebars'
  newUneet.hbs.dest = vars.hbs.uneetsFolder + '/'
  newUneet.hbs.file = newUneet.hbs.dest + newUneet.hbs.name
  newUneet.hbs.content = makeFiles.hbsBase(newUneetName)
  if ((!vars.hbs.ignore) && (( !fs.existsSync(newUneet.hbs.file) ) || ( force ))) {
    fs.writeFile(newUneet.hbs.file, newUneet.hbs.content, null);
  }
});

// Task: modules -- new modules creator
// usage: "gulp modules --make unitName"
gulp.task('modules',function(){
  var force = argv.f
  var newModule = { scss: {}, js: {}, php: {} }
  // scss
  newModule.scss.name = 'm_' + argv[MAKE_NAME] + '.scss'
  newModule.scss.dest = vars.scss.modulesFolder + '/'
  newModule.scss.file = newModule.scss.dest + newModule.scss.name
  newModule.scss.content = '.m_' + argv[MAKE_NAME] + ' {\n' + '}'
  if ((!vars.scss.ignore) && (( !fs.existsSync(newModule.scss.file) ) || ( force ))) {
    fs.writeFile(newModule.scss.file, newModule.scss.content, null);
  }
});

// Process EVEYRHTING and then watch.
var tasks = []
var noWatch = []
if (!vars.hbs.ignore) {
  tasks.push('hbs')
  noWatch.push('hbs')
}
if (!vars.php.ignore) {
  tasks.push('php-partials')
  noWatch.push('php-partials')
}
if (!vars.scss.ignore) {
  tasks.push('sass')
  noWatch.push('sass')
}
if (!vars.js.ignore) {
  tasks.push('js')
  noWatch.push('js')
}
if (!vars.assets.ignore) {
  tasks.push('assets')
  noWatch.push('assets')
}
if (vars.server.useServer) {
  tasks.push('serve')
}
tasks.push('watch')
gulp.task('default', tasks)
gulp.task('dist', noWatch)
