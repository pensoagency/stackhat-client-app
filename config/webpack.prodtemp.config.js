const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractTextPlugin2 = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')

let package = require('../package.json')

function buildVersion(buffer) {
  // copy-webpack-plugin passes a buffer
  let ver = JSON.parse(buffer.toString())

  // make any modifications you like, such as
  ver.version = package.version

  // pretty print to JSON with two spaces
  let verJson = JSON.stringify(ver, null, 2)
  return verJson
}

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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [ "css-loader", "sass-loader" ]
        })
      },       
      {
        test: /Print\.scss$/,    
        use: ExtractTextPlugin2.extract({
          fallback: "style-loader",
          use: [ "css-loader", "sass-loader" ]
        })        
      },  
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
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
    new CleanWebpackPlugin("../dist/*.*", { allowExternal: true }),
    new HtmlWebpackPlugin({ 
      title: 'New App',
      template: './src/index.html', 
      filename: './index.html',
      hash: true,
      favicon: './src/assets/icon.png'
    }),
    new CopyWebpackPlugin([{ 
      from: './src/404.html', to: './404.html' 
    }]),
    new ExtractTextPlugin('style.[hash].css'),
    new ExtractTextPlugin2('print.css'),    
    new CopyWebpackPlugin([{ 
      from: './src/version.json', to: './version.json', 
      transform: (content, path) => {
        return buildVersion(content)
      }
    }]),    
    new WebpackAutoInject({  }),        
  ]
}