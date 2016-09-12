const webpack = require('webpack')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')
const path = require('path')

const config = {
  entry: {
    app: [
      'webpack/hot/only-dev-server',
      './src/index.js'
    ]
  },
  externals: {
    // Needed for js-ipfs-api
    net: '{}',
    fs: '{}',
    tls: '{}',
    console: '{}',
    mkdirp: '{}',
    'require-dir': '{}'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|vendor/,
        loader: 'babel'
      },
      {  
        test: /\.json?$/,
        loader: 'json-loader'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.scss$/, loaders: ['style', 'css', 'sass']},
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
    ],
  postLoaders: [{
    include: /ipfs/,
    test: /\.js$/,
    loader: 'transform?brfs'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules',
      path.join(__dirname, 'node_modules')
    ],
    alias: {
      'node_modules': path.join(__dirname + '/node_modules'),
      'fs': path.join(__dirname + '/node_modules', 'html5-fs')
    }
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
    new webpack.IgnorePlugin(new RegExp("^(ipc)$"))
  ]
}

// This causes error
//config.target = webpackTargetElectronRenderer(config)

module.exports = config
