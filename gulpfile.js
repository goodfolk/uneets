// ***************************************************************************
// Gulpfile.js
// Contains basic Uneet tasks
// edit at your own peril
// ***************************************************************************

var vars = require('./gulp-config.js');

var gulp          = require('gulp');
var doNothing     = require('gulp-empty');
var sourcemaps    = require('gulp-sourcemaps');
var concat        = require('gulp-concat');
var rename        = require('gulp-rename')
var livereload    = require('gulp-livereload');

var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var cleanCSS      = (vars.scss.config.minify) ? require('gulp-clean-css') : doNothing;

var babel         = require('gulp-babel');
babel.babelPreset = { presets: ['es2015'] };

var uglify        = require('gulp-uglify');

// Process SCSS style files.
gulp.task('sass',function(){
  var mapsDir = './';
  var customSrcs = [  vars.scss.src+'custom/vars.scss',
                      vars.scss.src+'custom/mixins/**/*.scss',
                      (function(useReset){
                        return (useReset) ? vars.scss.src+'custom/common/reset.scss' : '';
                      })(vars.scss.config.useReset),
                      (function(useNormalize){
                        return (useNormalize) ? vars.scss.src+'custom/common/normalize.scss' : ''
                      })(vars.scss.config.useNormalize),
                      vars.scss.src+'custom/common/global.scss',
                      vars.scss.src+'custom/modules/**/*.scss',
                      vars.scss.src+'custom/_shame.scss'
                   ];
  var libSrcs = [ vars.scss.src+'libs/**/*.css' ];
  var outputFile = vars.scss.outputFilename + '.css';
  var destDir = vars.scss.outputFolder;
  gulp.src(libSrcs)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.css'))
    .pipe(sourcemaps.write(mapsDir))
    .pipe(gulp.dest(destDir));
  console.log('Writing ' + destDir + outputFile);
  return gulp.src(customSrcs)
  .pipe(sourcemaps.init())
  .pipe(  sass( { outputStyle: 'nested' } )
          .on('error', sass.logError) )
  .pipe(autoprefixer(vars.scss.config.autoprefixerSettings))
  .pipe(concat(outputFile))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write(mapsDir))
  .pipe(gulp.dest(destDir))
  .pipe(livereload());
});

// Process JS
gulp.task('js',function(){

});

// Process assets
gulp.task('assets',function(){
  gulp.src(vars.assets.src + '**/*.*')
    .pipe(gulp.dest(vars.assets.output));
});

// Task: gulp watch
gulp.task('watch', function () {
  gulp.watch( vars.source.folder + vars.source.sass.folder + '**/*.scss', ['sass']);
  gulp.watch( vars.source.folder + vars.source.js.folder + '**/*.js',   ['js']);
  gulp.watch( vars.source.folder + vars.source.assets.folder + '**/*.*',   ['assets']);
})
