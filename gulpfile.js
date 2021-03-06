const gulp = require('gulp')
const flatten = require('gulp-flatten')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const livereload = require('gulp-livereload')
const notify = require('gulp-notify')
const svgSprite = require('gulp-svg-sprite')
const postcss = require('gulp-postcss');
const postcssComment = require('postcss-comment');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssReporter = require('postcss-reporter');
const postcssPXtoRem = require('postcss-pxtorem');
const postcssColorMod = require('postcss-color-mod-function');
const postcssNested = require('postcss-nested');
const postcssAdvancedVariables = require('postcss-advanced-variables')
const postcssMapGet = require('postcss-map-get');

const cfg = require('./uneets.config')

// livereload 

const liveReloadStart = () => {
  if (cfg.livereload && cfg.livereload.enable) {
    livereload({
      start: true,
      port: 35729
    })
  }
}

// ASSETS copy
const assetsSrc = `${cfg.assets.src}/**/*`
const assetsDest = `${cfg.assets.dest}`
const processAssets = () => {
  return gulp.src([assetsSrc]).pipe(gulp.dest(assetsDest))
  .pipe(livereload())
}

const watchAssets = () => {
  gulp.watch([assetsSrc], processAssets)
}

const svgSrc = `${cfg.svgs.src}/*.svg`
const svgDest = `${cfg.svgs.dest}`
const processSVGs = () => {
  return gulp
    .src([svgSrc])
    .pipe(
      svgSprite({
        mode: {
          stack: true
        },
        svg: {
          // General options for created SVG files
          xmlDeclaration: false, // Add XML declaration to SVG sprite
          doctypeDeclaration: false
        }
      })
    ) // Activate Sass output (with default options) // Activate the «symbol» mode
    .pipe(gulp.dest(svgDest))
    .pipe(livereload())
}

const watchSVGs = () => {
  gulp.watch([svgSrc], processSVGs)
}

// Twig templates copying
const ext = cfg.templates.useTwig ? '.html.twig' : '.php'
const uneetsTplSrc = `${cfg.uneets.src}/**/*${ext}`
const tplDest = `${cfg.templates.dest}`
const processTemplates = () => {
  return gulp
    .src([uneetsTplSrc])
    .pipe(flatten())
    .pipe(gulp.dest(tplDest))
    .pipe(livereload())
}

const watchTemplates = () => {
  gulp.watch([uneetsTplSrc], processTemplates)
}

// CSS related tasks
const processCSS = () => {
  return gulp
    .src(`${cfg.css.src}/${cfg.css.entryFilename}`)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      postcssImport(),
      postcssAdvancedVariables(),
      postcssSimpleVars(),
      postcssMapGet(),
      postcssNested(),
      postcssColorMod(),
      postcssPXtoRem({
        selectorBlackList: ['html','body'],
        rootValue: 10,
        unitPrecision: 5,
        propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
      }),
      autoprefixer(),
      cssnano({
        preset: ['default', {
          normalizeUrl: false
        }]
      }),
      postcssReporter({
        throwError: true
      })
    ],{
      parser: postcssComment
    }))
    .on('error', notify.onError({
      message: "You made a boo boo.",
      title: "Error in CSS!"
    }))
    .pipe(
      rename(path => {
        const split = cfg.css.outputFilename.split('.')
        path.basename = split[0]
        path.extname = `.${split[1]}`
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${cfg.css.dest}`))
    .pipe(livereload())
}

const watchSass = () => {
  gulp.watch(
    [`${cfg.css.src}/**/*.pcss`, `${cfg.uneets.src}/**/*.pcss`],
    processCSS
  )
}

// JS related Tasks

function webpackScripts() {
  webpackConfig.mode = 'development'
  return new Promise(resolve =>
    webpack(webpackConfig, (err, stats) => {
      if (stats.compilation.errors.length > 0) {
        console.error('Webpack', stats.compilation.errors[0])
        notify.onError({
          message: "You made a boo boo.",
          title: "Error in JS!"
        })(stats.compilation.errors[0])
      } else {
        console.log(
          stats.toString({
            /* stats options */
          })
        )
      }
      resolve()
    })
  )
}

const livereloadJS = (done) => {
  livereload()
  done()
}

const processJS = gulp.series(webpackScripts,livereloadJS)
const watchJS = () => {
  gulp.watch([`${cfg.js.src}/**/*.js`, `${cfg.uneets.src}/**/*.js`], processJS)
}

// Watch
const watchTask = gulp.parallel(
  liveReloadStart,
  watchSass,
  watchJS,
  watchAssets,
  watchSVGs,
  watchTemplates
)
watchTask.description = 'watch for changes to all source'
// Process
const processTask = gulp.parallel(
  processCSS,
  processJS,
  processAssets,
  processSVGs,
  processTemplates
)

// default task
const defaultTask = gulp.series(processTask, watchTask)

gulp.task('default', defaultTask)
gulp.task('build', processTask)
gulp.task('watch', watchTask)
