'use strict';var _require=require('path'),resolve=_require.resolve;var merge=require('webpack-merge');var themes=require('../Themes');var common=require('./webpack.common');var plugins=require('./plugins/prod');var THEME_PATH=themes.getPath();module.exports=merge(common,{entry:{app:[resolve(THEME_PATH,'index.jsx'),resolve(__dirname,'./modules/cache')]},devtool:'cheap-module-source-map',output:{filename:'[name].[chunkhash].js',chunkFilename:'[name].[chunkhash].js',path:resolve(THEME_PATH,'public'),publicPath:'./'},plugins:plugins,stats:'errors-only'});