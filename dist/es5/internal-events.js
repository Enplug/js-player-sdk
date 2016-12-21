'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = undefined;

var _eventEmitter = require('./lib/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = (0, _eventEmitter2.default)(),
    dispatch = events.dispatch;

exports.default = events;
exports.dispatch = dispatch;