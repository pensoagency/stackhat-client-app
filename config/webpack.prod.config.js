// Todo: unsure why but was unable to get the merge working here
// See webpack.prodtemp.config.js for full configuration file

var webpack = require('webpack');
var merge = require('webpack-merge');

var baseConfig = require('./webpack.base.config');
var optimizationConfig = require('./webpack.opt.config');

const productionConfiguration = function (env) {
  const NODE_ENV = env.NODE_ENV ? env.NODE_ENV : 'development';
  return {
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) })
    ]
  };
}

module.exports = merge.smart(baseConfig, optimizationConfig, productionConfiguration);