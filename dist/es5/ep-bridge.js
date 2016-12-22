'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Service = {
    'get-next': ''
};

var EpBridge = function () {
    function EpBridge() {
        (0, _classCallCheck3.default)(this, EpBridge);
    }

    /**
     * Sends a request to the server.
     * @param  {Object} msg
     * @param {string} msg.action
     * @param {string} msg.service
     * @param {string} msg.token
     * @param {string} msg.payload
     */


    (0, _createClass3.default)(EpBridge, [{
        key: 'send',
        value: function send(msg) {
            console.log('Sending message: ', msg);

            if (typeof message === 'string') {
                try {
                    msg = JSON.parse(message);
                } catch (err) {
                    msg = message;
                }
            }

            console.warn('Failing for send call with message: %o', msg);
        }
    }]);
    return EpBridge;
}();

exports.default = EpBridge;
;