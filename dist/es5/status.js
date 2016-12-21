'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _events = require('./events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATES = {
  ERROR: 'error',
  START: 'start',
  //    READY: 'ready',
  HIDE: 'hide',
  FINISHED: 'finished',
  //    RENDER: 'render',
  TRANSITION: 'transition'
},
    statusSender = _bridge2.default.senderForService('status');

// module local vars
var sendStateAction,
    createDoneCB,
    canInterrupt = true;

// internal helper for sending state update messages
sendStateAction = function sendStateAction(newState) {
  return statusSender({
    action: newState
  }).then(function (payload) {
    return payload.success || null;
  });
};

createDoneCB = function createDoneCB() {
  return function done() {
    statusSender({
      action: 'destroy-finished'
    }, true);
  };
};

// add event transform for destroy event
_events.eventProcessor.addTransform('destroy', function (eventData) {
  return (0, _extends3.default)(createDoneCB(), eventData);
});

// appStatus API
exports.default = {
  get STATES() {
    return STATES;
  },

  start: function start() {
    return sendStateAction(STATES.START);
  },
  error: function error() {
    return sendStateAction(STATES.ERROR);
  },
  hide: function hide() {
    return sendStateAction(STATES.HIDE);
  },
  transition: function transition() {
    return sendStateAction(STATES.TRANSITION);
  },


  get canInterrupt() {
    return _promise2.default.resolve(canInterrupt);
  },

  setCanInterrupt: function setCanInterrupt(newValue) {
    if (typeof newValue !== 'boolean') {
      return _promise2.default.reject(new TypeError('[Enplug SDK] You can only set canInterrupt to a boolean value'));
    }

    // optimistic update
    canInterrupt = newValue;

    return statusSender({
      action: 'set-interrupt',
      payload: {
        canInterrupt: newValue
      }
    }).catch(function (error) {
      canInterrupt = !newValue;
      throw error;
    }).then(function () {
      return canInterrupt;
    });
  }
};