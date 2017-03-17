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
var exec = require('child_process').exec

// uneet related packages
var fs = require('fs');
var argv = require('yargs').argv;

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
var hbsData = require('./handlebars.js')

// js related packages
var standard = (vars.js.config.useStandard)
    ? require('gulp-standard')
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
  var customSrc = [vars.js.src + 'custom/**/*.js']
  var outputFile = vars.js.outputFilename + '.min.js'
  var destDir = vars.js.outputFolder
  var libsSrc = [vars.js.src + 'libs/**/*.js']
  var libsOutputFile = 'libs.js'

  allSources.js = []
  allSources.js = allSources.js.concat(customSrc, libsSrc)

  exec('standard --fix', function (err, stdout, stderr) {
    console.log(stdout)
    console.log(stderr)
  })

  gulp.src(libsSrc)
      .pipe(concat(libsOutputFile))
      .pipe(gulp.dest(destDir))
  return gulp.src(customSrc)
      .pipe(standard())
      .pipe(sourcemaps.init())
      .pipe(babel(vars.js.config.babelConfig).on('error', function (e) {
        gutil.log(e)
      }))
      .pipe(concat(outputFile).on('error', function (e) {
        gutil.log(e)
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write(mapsDir))
      .pipe(gulp.dest(destDir))
      .pipe(standard.reporter('default', vars.js.config.standardOpts))
})

// Process assets
gulp.task('assets', function () {
  var assetSrcs = [ vars.assets.src + '**/*.*' ]

  allSources.assets = assetSrcs

  gulp.src(assetSrcs).pipe(gulp.dest(vars.assets.output))
})

// Task: gulp watch
gulp.task('watch', function () {
  var reportChange = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
  }
  gulp.watch(allSources.sass, ['sass']).on('change',reportChange)
  gulp.watch(allSources.hbs, ['hbs']).on('change',reportChange)
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

// Task: uneet -- newUneet new uneet files
const MAKE_NAME = 'make'
gulp.task('uneets',function(){
  var force = argv.f
  var newUneet = { scss: {}, js: {}}
  // scss
  newUneet.scss.name = argv[MAKE_NAME] + '.scss'
  newUneet.scss.dest = vars.scss.uneetsFolder + '/'
  newUneet.scss.file = newUneet.scss.dest + newUneet.scss.name
  newUneet.scss.content = '.u_' + argv[MAKE_NAME] + ' {\n' + '}'
  if ((!vars.scss.ignore) && (( !fs.existsSync(newUneet.scss.file) ) || ( force ))) {
    fs.writeFile(newUneet.scss.file, newUneet.scss.content, null);
  }
  // js
  newUneet.js.name = argv[MAKE_NAME] + '.js'
  newUneet.js.dest = vars.js.uneetsFolder + '/'
  newUneet.js.file = newUneet.js.dest + newUneet.js.name
  newUneet.js.content = '//.u_' + argv[MAKE_NAME] + '\n'
  if ((!vars.js.ignore) && (( !fs.existsSync(newUneet.js.file) ) || ( force ))) {
    fs.writeFile(newUneet.js.file, newUneet.js.content, null);
  }
});

// Process EVEYRHTING and then watch.
var tasks = []
if (!vars.hbs.ignore) { tasks.push('hbs') }
if (!vars.scss.ignore) { tasks.push('sass') }
if (!vars.js.ignore) { tasks.push('js') }
if (!vars.assets.ignore) { tasks.push('assets') }
if (vars.server.useServer) { tasks.push('serve') }
tasks.push('watch')
gulp.task('default', tasks)
