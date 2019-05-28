const path = require('path');
const config = {};

config.base = {
  entry: {
    worker: './src/worker.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  }
}

config.dev = {
  name: 'dev',
  mode: 'development',
  devtool: 'source-maps',
  devServer: {
    contentBase: './public',
    port: 1227,
    historyApiFallback: {
      rewrites: [
        {from: /^\/@.*\..+/, to: '/index.html'}
      ]
    }
  },
  ...config.base
};

config.production = {
  name: 'production',
  mode: 'production',
  ...config.base
};

module.exports = [config.dev, config.production]
