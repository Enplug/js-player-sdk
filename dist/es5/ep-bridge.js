/**
 * @author Michal Drewniak (michal@enplug.com)
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A mapping of service names to appropriate player function.
 * @type {Object}
 */
var Service = {
    'get-next': 'enplug.assets.getNext',
    'get-list': 'enplug.assets.getList'
};

var EpBridge = function () {
    function EpBridge() {
        (0, _classCallCheck3.default)(this, EpBridge);

        this.player = new _player2.default();
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
            if (typeof msg === 'string') {
                try {
                    msg = JSON.parse(msg);
                } catch (err) {
                    msg = msg;
                }
            }

            console.log('Sending message: ', msg);
            this.player.processMessage(msg);
        }
    }]);
    return EpBridge;
}();

exports.default = EpBridge;
;