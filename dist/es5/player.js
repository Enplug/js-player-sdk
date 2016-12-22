/**
 * Web Development Player.
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Player = function () {
    function Player() {
        (0, _classCallCheck3.default)(this, Player);


        /**
         * Mapping of message services and actions to the Player method.
         * @type {Object}
         */
        this.enplug = {
            asset: {
                'get-list': this.getList,
                'get-next': this.getNext
            }
        };
    }

    /**
     * 
     */


    (0, _createClass3.default)(Player, [{
        key: 'processMessage',
        value: function processMessage(msg) {
            try {
                this.enplug[msg.service][msg.action].call(this, msg.token, msg.payload);
            } catch (e) {
                console.error(e);
                console.error('Unable to send message. Message appropriate for service name:', msg.service, 'and action:', msg.action, 'not found in', this.enplug);
            }
        }

        // Assets //

        /**
         * The getList function can be called to return an Array of all assets configured for given 
         * player. 
         * @return {Promise.<Array>} - A Promise that resolves to an Array of asset value objects.
         */

    }, {
        key: 'getList',
        value: function getList(token) {
            console.log('enplug.assets.getList');
        }

        /**
         * Iterates through the list of asset values defined in the Dashboard part of your application 
         * for this display. Each time when called will get the next asset in the list of assets. 
         * @return {Promise} - A Promise that resolves to the single asset value (an Object).
         */

    }, {
        key: 'getNext',
        value: function getNext(token) {
            console.log('enplug.assets.getNext');
        }
    }]);
    return Player;
}();

exports.default = Player;