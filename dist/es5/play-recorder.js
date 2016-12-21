'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playRecSender = _bridge2.default.senderForService('play-recorder');

// note play duration is in seconds
exports.default = {
  report: function report(referenceId, playDuration) {
    var additionalInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var payload = {
      referenceId: referenceId,
      playDuration: playDuration
    };

    if (additionalInfo !== '') {
      payload.additionalInfo = additionalInfo;
    }

    playRecSender({
      action: 'report',
      payload: payload
    }, true);

    // todo should this actually return something?
  }
};