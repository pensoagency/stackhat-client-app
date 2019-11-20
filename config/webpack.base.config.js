var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')

module.exports = {

  /* exclude jquery for react slider dep */
  externals: {
    jquery: 'jQuery'
  },

  entry: [
    "babel-polyfill", "./src/index.js"
  ],  

  module: {  
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        exclude: /Print\.scss/,        
        use: [ "style-loader", "css-loader", "sass-loader" ]
      }, 
      {
        test: /Print\.scss$/,    
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [ "css-loader", "sass-loader" ]
        })        
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },             
      {
        test: /\.(png|jpg|gif|json)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      },      
      { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "url-loader?limit=10000&mimetype=application/font-woff" 
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "file-loader" 
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      }      
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      title: 'New App',
      template: './src/index.html', 
      filename: './index.html',
      favicon: './src/assets/icon.png'
    }),
    new ExtractTextPlugin('print.css'), 
    new WebpackAutoInject({  }),       
  ]
}