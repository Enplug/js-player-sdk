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
  report: function report(assetId, referenceId, playDuration) {
    var additionalInfo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var payload = {
      assetId: assetId,
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