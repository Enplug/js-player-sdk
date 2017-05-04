'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _events = require('./events');

var _EnplugError = require('./errors/EnplugError');

var _EnplugError2 = _interopRequireDefault(_EnplugError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// todo finish reject timeout
/*global _epBridge  _epBridgeSend*/

/*
Message Formatting: (as JSON string)
{
  service: ‘string’,        // required
  action: ‘string’,         // required
  payload: Object | Array,  // optional
  meta: Object,             // optional
  token: ‘string’           // required when a response is expected (internal use only)
}
 */

var RESPONSE_TIMEOUT = 60 * 1000;

var epBridge,

// todo break token map and generator into own module
responseMap = (0, _create2.default)(null),
    hasOwn = function hasOwn(obj, name) {
  return Object.prototype.hasOwnProperty.call(obj, name);
},
    createToken = function createToken() {
  var token = Math.random().toString(36).substr(2);

  if (token in responseMap) {
    return createToken();
  }

  return token;
};

// check for bridge existence
try {
  (function () {
    var $global = Function('return this')(); // eslint-disable-line

    if (hasOwn($global, '_epBridge')) {

      console.log('[Enplug SDK] Creating bridge from standard implementation.');
      epBridge = $global._epBridge;
    } else if (hasOwn($global, '_epBridgeSend')) {

      console.log('[Enplug SDK] Creating bridge from CEF implementation.');
      epBridge = $global._epBridge = {
        send: function send(message) {
          $global._epBridgeSend({
            request: message,
            persistent: false
          });
        }
      };
    } else {
      epBridge = _epBridge;
    }
  })();
} catch (error) {
  // epBridge was not found. In such case, we assume that the application is iframed within
  // WebPlayer and communication has to proceed via posting and receiving messages between windows.
  // TODO(michal): generalize hardcoded player.enplug.loc URL.
  console.info('Initializing Web Development Player.');

  epBridge = {
    send: function send(msg) {
      return parent.postMessage(msg, '*');
    }
  };

  window.addEventListener('message', function (event) {
    epBridge.receive(event.data);
  });
}

/*eslint no-implicit-globals: "off", no-unused-vars: "off" */
// global fn for Java bridge to call
epBridge.receive = function (json) {
  try {
    var isReload = void 0,
        isError = void 0,
        _JSON$parse = JSON.parse(json),
        service = _JSON$parse.service,
        action = _JSON$parse.action,
        _JSON$parse$payload = _JSON$parse.payload,
        payload = _JSON$parse$payload === undefined ? {} : _JSON$parse$payload,
        _JSON$parse$meta = _JSON$parse.meta,
        meta = _JSON$parse$meta === undefined ? {} : _JSON$parse$meta,
        token = _JSON$parse.token;


    console.log('[Player SDK] Received message with action ' + action);

    isError = action === 'error';
    isReload = action === 'reload';

    // todo make this less weird (not hacky)
    // if we pass more info in the payload this will
    // need to be changed to not throw that data away
    if (isError) {
      console.error('[Player SDK] Error received: ' + payload.message, payload);
      // tweak payload to be the error object
      payload = new _EnplugError2.default(payload.message || '');
    }

    if (isReload) {
      console.log('[Player SDK] App reload requested.');
      window.location.reload();
      return;
    }

    // if there is a token we can just resolve the promise and be done
    // if it was an error the payload has been transformed to an error
    //    so we can just reject the promise with that error
    if (token && token in responseMap) {
      responseMap[token][isError ? 1 : 0](payload);
      delete responseMap[token];
      return;
    }

    // this is for any "public" event (these are consumed by third parties)
    if (service === 'event') {
      (0, _events.processEvent)(action, payload, meta);
    }
  } catch (err) {
    console.error('[Enplug SDK] Error receiving and processing message in _epBridge.receive');
    console.error(err.stack);
  }

  // todo add message that call wasn't handled?
};

/**
 *  @module enplug.bridge
 */
exports.default = {
  /*eslint consistent-return: "off"*/
  /**
   * The function for sending messages to the Java layer
   *
   * @param {object} message -- the object containing the required message parameters
   * @param {string} message.service -- the service this call belongs to
   * @param {string} message.action -- the action being preformed on this service
   * @param {object} [message.payload] -- any data required for the action being performed
   * @param {object} [message.meta] -- not currently used for anything
   * @param {boolean} [noReturn=false] -- send true to skip adding a token and returning a promise
   * @returns {Promise|undefined}
   */
  send: function send(message) {
    var noReturn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var msg = (0, _extends3.default)({}, message);
    var url = window.location.href;

    console.log('[Player SDK] Sending message to URL ' + url);

    // appToken identifies specific instance of the App.
    var match = url.match(/token=([^&]*[a-z|0-9])/);
    msg.appToken = match && match[1] || '';

    // We need to send app url with the message so that Web Player knows which application sent
    // a message.
    var queryIndex = url.indexOf('?');
    var appUrl = url.slice(0, queryIndex);
    msg.appUrl = appUrl;

    if (!msg.hasOwnProperty('service') || typeof msg.service !== 'string') {
      return _promise2.default.reject(new TypeError('[Enplug SDK] Bridge message requires a service property (string)'));
    }

    if (!msg.hasOwnProperty('action') || typeof msg.action !== 'string') {
      return _promise2.default.reject(new TypeError('[Enplug SDK] Bridge message requires an action property (string)'));
    }

    if (noReturn) {
      console.log('[Player SDK] Message to be sent (noReturn = true): ' + (0, _stringify2.default)(msg));
      epBridge.send((0, _stringify2.default)(msg));
      return;
    }

    return new _promise2.default(function (resolve, reject) {
      var token = createToken();
      responseMap[token] = [resolve, reject];
      msg.token = token;
      console.log('[Player SDK] Message to be sent: ' + (0, _stringify2.default)(msg));
      epBridge.send((0, _stringify2.default)(msg));
    });
  },


  /**
   * A helper for creating a send function that automatically adds the "service" property
   * based on the original input.
   *
   * @param {string} service -- the service name to add to messages
   * @returns {SenderFunction} // todo typedef
   */
  senderForService: function senderForService(service) {
    var _this = this;

    return function () {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var noReturn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      message.service = service;

      return _this.send(message, noReturn);
    };
  }
};