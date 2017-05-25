var HTMLWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + '/public/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: __dirname + '/public/index.js',
  module:{
    loaders:[
      {
        test: /\.js$/,
        exclude:/node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' 
      }
    ]
  },
  output : {
    filename: 'transformed.js',
    path: __dirname + '/build'
  },

  plugins:[HTMLWebpackPluginConfig, new ExtractTextPlugin("styles.css") ]
};
