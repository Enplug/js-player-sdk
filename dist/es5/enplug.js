'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playRecorder = exports.assets = exports.settings = exports.appStatus = exports.notifications = undefined;

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _notifications = require('./notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _playRecorder = require('./play-recorder');

var _playRecorder2 = _interopRequireDefault(_playRecorder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enplug = {
  on: _events2.default.on,
  once: _events2.default.once,
  off: _events2.default.off,
  notifications: _notifications2.default,
  appStatus: _status2.default,
  settings: _settings2.default,
  assets: _assets2.default,
  playRecorder: _playRecorder2.default
};

exports.default = enplug;
exports.notifications = _notifications2.default;
exports.appStatus = _status2.default;
exports.settings = _settings2.default;
exports.assets = _assets2.default;
exports.playRecorder = _playRecorder2.default;