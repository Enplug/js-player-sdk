'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notificationSender = _bridge2.default.senderForService('notification');

exports.default = {
  post: function post(message) {
    return notificationSender({
      action: 'post',
      payload: {
        message: message
      }
    }).then(function (payload) {
      return payload.notificationId;
    });
  }
};