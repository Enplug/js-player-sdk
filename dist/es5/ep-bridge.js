/**
 * @author Michal Drewniak (michal@enplug.com)
 */

'use strict';

// import Player from './player/player';


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EpBridge = function () {
    function EpBridge() {
        (0, _classCallCheck3.default)(this, EpBridge);

        this.player = new Player();
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
            var _this = this;

            if (typeof msg === 'string') {
                try {
                    msg = JSON.parse(msg);
                } catch (err) {
                    msg = msg;
                }
            }

            console.log('Sending message: ', msg);
            this.player.processMessage(msg).then(function (data) {
                return _this.receive(data);
            });
        }
    }]);
    return EpBridge;
}();

exports.default = EpBridge;
;