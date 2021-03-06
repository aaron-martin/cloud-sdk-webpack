'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requireUncached = require('require-uncached');

var _requireUncached2 = _interopRequireDefault(_requireUncached);

var _Themes = require('../../Themes');

var _Themes2 = _interopRequireDefault(_Themes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getAppSettings = function getAppSettings() {
  try {
    return (0, _requireUncached2.default)(_Themes2.default.getPath() + '/config/app.json');
  } catch (e) {
    return {};
  }
};

exports.default = getAppSettings;