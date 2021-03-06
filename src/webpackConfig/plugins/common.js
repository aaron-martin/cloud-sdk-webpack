/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { resolve } from 'path';
import { blue, green } from 'chalk';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import StringReplacePlugin from 'string-replace-webpack-plugin';
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import themes from '../../Themes';
import convertLanguageToISO from '../helpers/convertLanguageToISO';
import getThemeLanguage from '../helpers/getThemeLanguage';
import getAppSettings from '../helpers/getAppSettings';
import getComponentsSettings from '../helpers/getComponentsSettings';
import getDevConfig from '../helpers/getDevConfig';
import getThemeConfig from '../helpers/getThemeConfig';
import { ENV_KEY_PRODUCTION, ENV, isStaging, isDev, isProd } from '../../environment';

const appConfig = getAppSettings();
const componentsConfig = getComponentsSettings();
const { ip, apiPort } = getDevConfig();
const themeConfig = getThemeConfig();

const PUBLIC_FOLDER = 'public';
const nodeEnv = isStaging ? ENV_KEY_PRODUCTION : ENV;

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
      APP_CONFIG: JSON.stringify(appConfig),
      COMPONENTS_CONFIG: JSON.stringify(componentsConfig),
      THEME_CONFIG: JSON.stringify(themeConfig),
      THEME: JSON.stringify(themes.getName()),
      // @deprecated Replaced by LOCALE and LOCALE_FILE - kept for now for theme compatibility.
      LANG: JSON.stringify(convertLanguageToISO(appConfig.language)),
      LOCALE: JSON.stringify(convertLanguageToISO(appConfig.language)),
      LOCALE_FILE: JSON.stringify(getThemeLanguage(themes.getLanguages(), appConfig.language)),
      IP: JSON.stringify(ip),
      PORT: JSON.stringify(apiPort),
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: (module, count) => (
      (module.resource && module.resource.indexOf('lodash') !== -1) ||
      (module.resource && module.resource.indexOf('gsap') !== -1) ||
      (module.resource && module.resource.indexOf('hammerjs') !== -1) ||
      (module.resource && module.resource.indexOf('swiper') !== -1) ||
      (module.resource && module.resource.indexOf('rxjs') !== -1) ||
      count >= 2
    ),
    name: 'common',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
  }),
  new StringReplacePlugin(),
  new HTMLWebpackPlugin({
    title: appConfig.shopName || themes.getName(),
    filename: resolve(themes.getPath(), PUBLIC_FOLDER, 'index.html'),
    template: resolve(__dirname, '../templates/index.ejs'),
    inject: false,
    cache: false,
    minify: false,
    prefetch: ['**/*.*'],
    preload: ['**/*.*'],
  }),
  new ScriptExtHtmlWebpackPlugin({
    sync: ['app', 'common'],
    defaultAttribute: 'async',
  }),
  new PreloadWebpackPlugin({
    rel: 'prefetch',
    as: 'script',
  }),
  new webpack.LoaderOptionsPlugin({
    debug: isDev,
    options: {
      context: themes.getPath(),
      output: {
        path: resolve(themes.getPath(), PUBLIC_FOLDER),
      },
    },
  }),
  new webpack.IgnorePlugin(),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.HashedModuleIdsPlugin(),
  new ProgressBarWebpackPlugin({
    format: `  building [${blue(':bar')}] [:msg] ${green(':percent')} (:elapsed seconds)`,
    clear: false,
  }),
];

export default plugins;
