// ***************************************************************************
// gulp-config.js
// Contains gulp vars
// I recommend you only edit the output vars
// ***************************************************************************

// Variables
// Edit these to customize your project.
module.exports = {
  scss: {
    src: 'src/sass/',                // folder where CSS is
    outputFolder: './dist/css/',       // what folder does CSS and maps go?
    outputFilename: 'styles',         // do not include the extension
    config: {
      autoprefixerSettings: {
        browsers: [  'iOS 8','iOS 9', 'last 2 ChromeAndroid versions', 'last 2 Android versions', 'last 2 ExplorerMobile versions',
                     'ie 11','last 2 Edge versions',
                     'last 2 Chrome versions', 'last 2 Firefox versions', 'last 2 Safari versions'],
        cascade: false,
        flexbox: 'no-2009'
      },
      minify: true,
      useReset: true,
      useNormalize: true
    },
  },
  js: {
    src: 'src/js/',
    outputFolder: './dest/js/',
    outputFilename: 'all'        // do not include the extension
  },
  assets: {
    src: 'src/assets/',              // where are the assets?
    output: './dist/assets/'           // output folder
  }
}
