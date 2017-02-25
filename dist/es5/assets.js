'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assetSender = _bridge2.default.senderForService('asset');

exports.default = {
  getNext: function getNext() {
    return assetSender({
      action: 'get-next'
    });
  },
  getAsset: function getAsset() {
    return assetSender({
      action: 'get-asset'
    });
  },
  getList: function getList() {
    return assetSender({
      action: 'get-list'
    });
  },
  getTheme: function getTheme() {
    return assetSender({
      action: 'get-theme'
    });
  }
};