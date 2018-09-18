'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _WebpackConfigurator = require('../webpackConfig/WebpackConfigurator');

var _WebpackConfigurator2 = _interopRequireDefault(_WebpackConfigurator);

var _Themes = require('../Themes');

var _Themes2 = _interopRequireDefault(_Themes);

var _indexes = require('../webpackConfig/helpers/indexes');

var _indexes2 = _interopRequireDefault(_indexes);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebpackProcess = function () {
  function WebpackProcess() {
    _classCallCheck(this, WebpackProcess);

    this.configurator = new _WebpackConfigurator2.default();
    this.webpackConfig = null;
    this.compiler = null;
    this.logger = _logger2.default;
  }

  _createClass(WebpackProcess, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _Themes2.default.init(function () {
        _logger.logHelper.logLogoBuild();

        (0, _indexes2.default)().then(function () {
          if (process.env.indexOnly === 'true') {
            process.exit(0);
            return;
          }

          _logger2.default.log('');

          _this.configurator.setConfigPath(_Themes2.default.getConfig()).loadThemeConfig();

          _this.webpackConfig = _this.configurator.getConfig();
          _this.compiler = (0, _webpack2.default)(_this.webpackConfig);

          (0, _rimraf2.default)(_this.webpackConfig.output.path, function () {
            _this.compiler.run(_this.handleOutput.bind(_this));
          });
        });
      });
    }
  }, {
    key: 'handleOutput',
    value: function handleOutput(err, stats) {
      if (err) {
        this.logger.error(err.stack || err);

        if (err.details) {
          this.logger.error(err.details);
        }

        throw new Error(err);
      }

      if (stats.hasErrors()) {
        throw new Error(stats.toString({
          colors: true,
          warnings: false,
          chunks: false
        }));
      }

      _logger.logHelper.logBuildFinished();
    }
  }]);

  return WebpackProcess;
}();

exports.default = new WebpackProcess();