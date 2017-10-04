'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

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

var epBridge = null;
var responseMap = new _map2.default();
var appToken = null;
var isZoningApp = false;
var delayedMessages = [];

/**
 * Creates a unique token used to identify apprpriate message response function.
 * @return {string} - A unique token.
 */
function createToken() {
  var token = Math.random().toString(36).substr(2);
  // Make sure a unique token is created. If created token already exists, create a different one.
  if (responseMap.has(token)) {
    return createToken();
  }
  return token;
}

// Check for the existence of the global bridge object. If it doesn't, create one so that it can
// send and receive messages from the Web Player.
try {
  (function () {
    isZoningApp = !!window.location.href && window.location.href.indexOf('zoning=true') >= 0;
    console.log('[Player SDK] Zoning App detected: ' + isZoningApp);
    var $global = Function('return this')(); // eslint-disable-line

    // _epBridge exists: Java Player
    if ($global.hasOwnProperty('_epBridge')) {
      console.log('[Player SDK] Creating bridge from standard implementation.');
      epBridge = $global._epBridge;
    }
    // _epBridge doesn't exist but _epBridgeSend exists: Windows (CEF) Player
    else if ($global.hasOwnProperty('_epBridgeSend')) {
        console.log('[Player SDK] Creating bridge from CEF implementation.', $global._epBridge);
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
    var data = {};

    if (typeof json === 'string') {
      data = JSON.parse(json);
    } else {
      data = json;
    }

    var isReload = data.action === 'reload';
    var isError = data.action === 'error';
    var service = data.service;
    var action = data.action;
    var payload = data.payload || {};
    var meta = data.meta || {};
    var token = data.token;

    console.log('[Player SDK] Received message with action ' + action, data);

    if (data && data.action === 'set-app-token') {
      console.log('[Player SDK] Storing appToken ' + data.appToken);
      appToken = data.appToken;

      if (delayedMessages.length) {
        while (delayedMessages.length) {
          var msg = delayedMessages.shift();
          msg.appToken = appToken;
          console.log('[Player SDK] Message to be sent: ' + (0, _stringify2.default)(msg));
          epBridge.send((0, _stringify2.default)(msg));
        }
      }
    }

    // if there is a token we can just resolve the promise and be done
    // if it was an error the payload has been transformed to an error
    //    so we can just reject the promise with that error
    if (token && responseMap.has(token)) {
      var responseFunctions = responseMap.get(token);
      responseFunctions[isError ? 1 : 0](payload);
      responseMap.delete(token);
      return;
    }

    // todo make this less weird (not hacky)
    // if we pass more info in the payload this will
    // need to be changed to not throw that data away
    if (isError) {
      console.log('[Player SDK] Error received: ' + payload.message, payload);
      // tweak payload to be the error object
      payload = new _EnplugError2.default(payload.message || '');
    }

    if (isReload) {
      console.log('[Player SDK] App reload requested.');
      window.location.reload();
      return;
    }

    // this is for any "public" event (these are consumed by third parties)
    if (service === 'event') {
      (0, _events.processEvent)(action, payload, meta);
    }
  } catch (err) {
    console.error('[Player SDK] Error receiving and processing message in _epBridge.receive');
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

    var msg = (0, _extends3.default)({
      isNewSdk: true
    }, message);
    var url = window.location.href;

    console.log('[Player SDK] Sending message to URL ' + url + ' with appToken ' + appToken);

    // appToken identifies specific instance of the App.
    if (!appToken) {
      var match = url.match(/apptoken=([^&]*[a-z|0-9])/);
      appToken = match && match[1] || '';
    }
    msg.appToken = appToken;

    // We need to send app url with the message so that Web Player knows which application sent
    // a message.
    var queryIndex = url.indexOf('?');
    var appUrl = url.slice(0, queryIndex);
    msg.appUrl = appUrl;

    if (!msg.hasOwnProperty('service') || typeof msg.service !== 'string') {
      return _promise2.default.reject(new TypeError('[Player SDK] Bridge message requires a service property (string)'));
    }

    if (!msg.hasOwnProperty('action') || typeof msg.action !== 'string') {
      return _promise2.default.reject(new TypeError('[Player SDK] Bridge message requires an action property (string)'));
    }

    if (noReturn) {
      console.log('[Player SDK] Message to be sent (noReturn = true): ' + (0, _stringify2.default)(msg));
      if (!appToken) {
        delayedMessages.push(msg);
      } else {
        epBridge.send((0, _stringify2.default)(msg));
      }
      return;
    }

    return new _promise2.default(function (resolve, reject) {
      var token = createToken();
      responseMap.set(token, [resolve, reject]);
      msg.token = token;

<<<<<<< HEAD
      console.log('[Player SDK] Sending message from an App outside of Zoning: ' + (0, _stringify2.default)(msg), msg);
      epBridge.send((0, _stringify2.default)(msg));
=======
      if (isZoningApp && !appToken) {
        console.log('[Player SDK] Sending message from an App inside Zoning: ' + (0, _stringify2.default)(msg), msg);
        delayedMessages.push(msg);
      } else {
        console.log('[Player SDK] Sending message from an App outside of Zoning: ' + (0, _stringify2.default)(msg), msg);
        epBridge.send((0, _stringify2.default)(msg));
      }
>>>>>>> 3b14b7b6e09f428eb9a95b6aa97e0de67fce1824
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