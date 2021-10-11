const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  vendor: [
    'react',
    'react-dom',
    'whatwg-fetch'
  ]
});