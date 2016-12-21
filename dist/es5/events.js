'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processEvent = exports.eventProcessor = undefined;

var _eventEmitter = require('./lib/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _eventTransform = require('./lib/event-transform');

var _eventTransform2 = _interopRequireDefault(_eventTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = (0, _eventEmitter2.default)(),
    eventProcessor = (0, _eventTransform2.default)();

function processEvent(eventName, payload, meta) {
  // eslint-disable-line
  var eventData = payload;

  if (eventProcessor.has(eventName)) {
    eventData = eventProcessor.runTransforms(eventName, payload);
  }

  events.dispatch(eventName, eventData);
}

exports.default = events;
exports.eventProcessor = eventProcessor;
exports.processEvent = processEvent;