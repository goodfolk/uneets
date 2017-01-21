// ***************************************************************************
// gulp-config.js
// Contains gulp vars
// I recommend you only edit the output vars
// ***************************************************************************

// Variables
// Edit these to customize your project.
var baseDistFolder = './dist/'
var baseSrcFolder = './src/'
var vars = {
  baseDist: baseDistFolder,
  baseSrc: baseSrcFolder,
  server: {
    useServer: true,
    serverPort: 7777
  },
  hbs: {
    ignore: false, // completely turns off handlebars processing for this project
    src: baseSrcFolder + 'html/',
    outputFolder: baseDistFolder,
    config: {
      hbsOpts: {
        ignorePartials: false,
        partials: {},
        batch: [baseSrcFolder + 'html/partials'],
        helpers: {}
      }
    }
  },
  scss: {
    ignore: false, // completely turns off sass processing for this project
    src: baseSrcFolder + 'sass/',                // folder where CSS is
    uneetsFolder: baseSrcFolder + 'sass/custom/uneets',
    outputFolder: baseDistFolder + 'css/',       // what folder does CSS and maps go?
    outputFilename: 'styles',         // do not include the extension
    config: {
      autoprefixerSettings: {
        browsers: [ 'iOS 8', 'iOS 9', 'last 2 ChromeAndroid versions', 'last 2 Android versions', 'last 2 ExplorerMobile versions',
          'ie 11', 'last 2 Edge versions',
          'last 2 Chrome versions', 'last 2 Firefox versions', 'last 2 Safari versions'],
        cascade: false,
        flexbox: 'no-2009'
      },
      minify: true,
      autoprefix: true,
      useReset: true,
      useNormalize: true
    }
  },
  js: {
    ignore: false, // completely turns off js processing for this project
    src: baseSrcFolder + 'js/',
    uneetsFolder: baseSrcFolder + 'js/custom/uneets',
    outputFolder: baseDistFolder + 'js/',
    outputFilename: 'all',        // do not include the extension
    config: {
      useBabel: true,
      babelConfig: {
        presets: ['es2015']
      },
      useStandard: true,
      standardOpts: {
        breakOnError: false,
        quiet: false
      },
      minify: true
    }
  },
  assets: {
    ignore: false, // completely turns off asset copying for this project
    src: baseSrcFolder + 'assets/',              // where are the assets?
    output: baseDistFolder + 'assets/'           // output folder
  }
}

module.exports = vars
