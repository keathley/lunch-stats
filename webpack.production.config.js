var webpack = require('webpack')
  , path = require('path')
  , node_modules_dir = path.resolve(__dirname, 'node_modules')
  , ExtractTextPlugin = require('extract-text-webpack-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [ path.resolve(__dirname, 'app/index.jsx') ]
  },
  output: {
    path: __dirname + '/static',
    filename: "bundle.js",
    hash: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [ node_modules_dir ],
        loaders: [ 'babel']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!autoprefixer-loader!ruby-sass-loader?'
          + 'includePaths[]='
          + (path.resolve(__dirname, './node_modules/bourbon/app/assets/stylesheets'))
          + '&includePaths[]='
          + (path.resolve(__dirname, './node_modules/bourbon-neat/app/assets/stylesheets'))
        )
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      title: 'Lunch Stats',
      filename: path.resolve(__dirname, 'index.html')
    })
  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.scss', '.css']
  }
};
