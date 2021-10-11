const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  devServer: {
    port: 8000,
    hot: "only",
    static: path.resolve(__dirname, 'public'),
    proxy: {
      '/api/**': {
        target: 'http://localhost:3000'
      }
    }
  },
  entry: {
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr'
    ]
  },
  output: {
    hotUpdateChunkFilename: 'js/hot-update.js',
    hotUpdateMainFilename: 'js/hot-update.json',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});