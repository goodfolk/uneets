const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cfg = require('./uneets.config')
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);

module.exports = {
  entry: `${cfg.js.src}/main.js`,
  output: {
    filename: './main.js',
    path: path.resolve(__dirname, `${cfg.js.dest}`)
  },
  context: path.resolve(__dirname, '.'),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: false,
          output: {
            comments: false
          },
          minify: {},
          compress: {
            booleans: true
          }
        }
      })
    ]
  },
  resolve: {
    plugins: [
      PnpWebpackPlugin,
    ],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  }
}
