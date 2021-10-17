const path = require('path');

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/App.jsx')],
  },
  output: {
    publicPath: '/js/',
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
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
                  version: '3',
                },
                targets: 'defaults',
              }],
              ['@babel/preset-react'],
            ],
          },
        },
      },
    ],

  },
};
