const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/App.jsx')],
    vendor: [
      'react',
      'react-dom',
      'whatwg-fetch'
    ]
  },
  output: {
    publicPath: '/js/',
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                corejs: {
                  version: "3",
                },
                targets: 'defaults'
              }],
              ['@babel/preset-react']
            ]
          }
        }
      }
    ]

  },
  devServer: {
    port: 8000,
    static: path.resolve(__dirname, 'public'),
    proxy: {
      '/api/**': {
        target: 'http://localhost:3000'
      }
    }
  }
};