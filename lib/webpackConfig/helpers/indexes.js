'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTrackingIndex = exports.createWidgetsIndex = undefined;

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _upperFirst = require('lodash/upperFirst');

var _upperFirst2 = _interopRequireDefault(_upperFirst);

var _environment = require('../../environment');

var _Themes = require('../../Themes');

var _Themes2 = _interopRequireDefault(_Themes);

var _path = require('path');

var _fs = require('fs');

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

var _getComponentsSettings = require('./getComponentsSettings');

var _getComponentsSettings2 = _interopRequireDefault(_getComponentsSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createIndex = function createIndex(config) {
  var imports = [];
  var exports = ['export default {'];

  Object.keys(config).forEach(function (componentId) {
    var component = config[componentId];
    var componentPath = _environment.isDev ? component.path.replace('/dist/', '/src/') : component.path;

    var componentVariableName = (0, _upperFirst2.default)((0, _camelCase2.default)(componentId.replace(/@/g, '').replace(/\//g, '-')));

    imports.push('import ' + componentVariableName + ' from \'' + componentPath + '\';');

    exports.push('  \'' + componentId + '\': ' + componentVariableName + ',');
  });

  exports.push('};');

  var importsString = imports.length ? imports.join('\n') + '\n\n' : '';
  return '' + importsString + exports.join('\n') + '\n';
};

var createWidgetsIndex = exports.createWidgetsIndex = function createWidgetsIndex() {
  var _getComponentsSetting = (0, _getComponentsSettings2.default)(),
      widgets = _getComponentsSetting.widgets;

  var indexString = createIndex(widgets);
  var extensionsFolder = (0, _path.resolve)(_Themes2.default.getPath(), 'extensions');

  if (!(0, _fs.existsSync)(extensionsFolder)) {
    (0, _fs.mkdirSync)(extensionsFolder);
  }

  _logger2.default.log('  Indexing widgets ...\n');
  var indexFile = (0, _path.resolve)(extensionsFolder, 'widgets.js');

  (0, _fs.writeFileSync)(indexFile, indexString, { flag: 'w+' });
};

var createTrackingIndex = exports.createTrackingIndex = function createTrackingIndex() {
  var _getComponentsSetting2 = (0, _getComponentsSettings2.default)(),
      tracking = _getComponentsSetting2.tracking;

  var indexString = createIndex(tracking);
  var extensionsFolder = (0, _path.resolve)(_Themes2.default.getPath(), 'extensions');

  if (!(0, _fs.existsSync)(extensionsFolder)) {
    (0, _fs.mkdirSync)(extensionsFolder);
  }

  _logger2.default.log('  Indexing trackers ...\n');
  var indexFile = (0, _path.resolve)(extensionsFolder, 'tracking.js');

  (0, _fs.writeFileSync)(indexFile, indexString, { flag: 'w+' });
};