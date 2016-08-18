const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')
const path = require('path')

const config = {
  entry: {
    app: ['webpack/hot/dev-server', './src/index.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {  
        test: /\.json?$/,
        loader: 'json-loader'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.scss$/, loaders: ['style', 'css', 'sass']},
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/app/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
  	contentBase: './app/dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}

//config.target = webpackTargetElectronRenderer(config)

module.exports = config
