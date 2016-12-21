'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playRecorder = exports.assets = exports.settings = exports.appStatus = exports.notifications = exports.off = exports.once = exports.on = undefined;

var _enplug = require('./enplug.js');

var _enplug2 = _interopRequireDefault(_enplug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var on = _enplug2.default.on,
    once = _enplug2.default.once,
    off = _enplug2.default.off,
    notifications = _enplug2.default.notifications,
    appStatus = _enplug2.default.appStatus,
    settings = _enplug2.default.settings,
    assets = _enplug2.default.assets,
    playRecorder = _enplug2.default.playRecorder;
// So because of the way ES6 modules are compiled down to
// ES5 (CJS/AMD/UMD) the "default" export is not the module,
// but a property 'default' on the module export.
// To mitigate this until ES6 modules are the norm this file will
// be used as the bundled build entry point.
// it should be noted that the enplug.js file is the actual ES6 api
// this file is just a shim for current bundle tools

// note that this is only for the browserify build

exports.on = on;
exports.once = once;
exports.off = off;
exports.notifications = notifications;
exports.appStatus = appStatus;
exports.settings = settings;
exports.assets = assets;
exports.playRecorder = playRecorder;