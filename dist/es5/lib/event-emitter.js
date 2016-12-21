'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.default = function () {
  var instance,
      handlerMap = (0, _create2.default)(null),
      maxListeners = 10;

  /*eslint no-extra-parens: "off"*/
  return instance = {
    get maxListeners() {
      return maxListeners;
    },
    set maxListeners(newMax) {
      if (!(0, _isInteger2.default)(newMax)) {
        throw new TypeError('Max Listeners must be a valid Integer');
      }

      return maxListeners = newMax;
    },

    on: function on(eventName, handler) {
      typeCheckArgs(eventName, handler);

      // todo check max listeners
      if (eventName in handlerMap) {
        handlerMap[eventName].push(handler);
      } else {
        handlerMap[eventName] = [handler];
      }
    },
    once: function once(eventName, handler) {
      var _tmpFn;

      typeCheckArgs(eventName, handler);

      // todo maybe check max listeners

      _tmpFn = function tmpFn() {
        instance.off(eventName, _tmpFn);
        handler.apply(undefined, arguments);
      };

      return instance.on(eventName, _tmpFn);
    },
    off: function off(eventName, handler) {
      var handlerIndex = -1;

      typeCheckArgs(eventName, handler);

      if (eventName in handlerMap) {
        handlerIndex = handlerMap[eventName].indexOf(handler);
      }

      if (handlerIndex >= 0) {
        handlerMap[eventName].splice(handlerIndex, 1);
      }
    },
    dispatch: function dispatch(eventName, event) {
      if (!Object.hasOwnProperty.call(event, 'type')) {
        event.type = eventName;
      }

      if (eventName in handlerMap && Array.isArray(handlerMap[eventName])) {
        handlerMap[eventName].slice().forEach(function (handler) {
          return handler(event);
        });
      }
    }
  };
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeCheckArgs = function typeCheckArgs(eventName, handler) {
  if (eventName == null || typeof eventName !== 'string') {
    throw new TypeError('An event name is required to attach an event handler');
  }

  if (handler == null || typeof handler !== 'function') {
    throw new TypeError('A handler function is required for .on');
  }
};

/**
 * @typedef {object|function} Event
 * @property {string} type -- the name of this event (should match what was used to bind the handler)
 */

/**
 * The EventEmitter class used for enplug event handling
 * @typedef {object} EventEmitter
 * @property {number} maxListeners -- the maximum number of listeners that can be attached (not currently used)
 * @property {function} on -- used to bind event handlers by name
 * @property {function} once -- used to bind event handlers by name that are removed after the first event they see
 * @property {function} off -- used to unbind event handlers
 * @property {function} dispatch -- used to dispatch event data to the registered handlers
 */

/**
 * @returns {EventEmitter} -- a factory for creating an event emitter like object
 */