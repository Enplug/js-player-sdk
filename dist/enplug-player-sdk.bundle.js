(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.enplug = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playRecorder = exports.assets = exports.settings = exports.appStatus = exports.notifications = exports.off = exports.once = exports.on = undefined;

var _enplug = require('./enplug.js');

var _enplug2 = _interopRequireDefault(_enplug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var on = _enplug2.default.on,
    once = _enplug2.default.once,
    off = _enplug2.default.off,
    notifications = _enplug2.default.notifications,
    appStatus = _enplug2.default.appStatus,
    settings = _enplug2.default.settings,
    assets = _enplug2.default.assets,
    playRecorder = _enplug2.default.playRecorder;
// So because of the way ES6 modules are compiled down to
// ES5 (CJS/AMD/UMD) the "default" export is not the module,
// but a property 'default' on the module export.
// To mitigate this until ES6 modules are the norm this file will
// be used as the bundled build entry point.
// it should be noted that the enplug.js file is the actual ES6 api
// this file is just a shim for current bundle tools

// note that this is only for the browserify build

exports.on = on;
exports.once = once;
exports.off = off;
exports.notifications = notifications;
exports.appStatus = appStatus;
exports.settings = settings;
exports.assets = assets;
exports.playRecorder = playRecorder;

},{"./enplug.js":4}],2:[function(require,module,exports){
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
  getList: function getList() {
    return assetSender({
      action: 'get-list'
    });
  }
};

},{"./bridge":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*global _epBridge  _epBridgeSend*/

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

var _events = require('./events');

var _EnplugError = require('./errors/EnplugError');

var _EnplugError2 = _interopRequireDefault(_EnplugError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// todo finish reject timeout
var RESPONSE_TIMEOUT = 60 * 1000;

var epBridge,

// todo break token map and generator into own module
responseMap = Object.create(null),
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
    console.warn('[Enplug SDK] Error initializing SDK: ' + '_epBridge does not exist on global object. Failing stack follows.');
    console.warn(error.stack);

    // epBridge was not found. In such case, we assume that the application is iframed within
    // WebPlayer and communication has to proceed via posting and receiving messages between windows.
    // TODO(michal): generalize hardcoded player.enplug.loc URL.
    console.info('Initializing Web Development Player.');

    epBridge = {
        send: function send(msg) {
            return parent.postMessage(msg, 'http://player.enplug.loc');
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
        var isError = void 0,
            _JSON$parse = JSON.parse(json),
            service = _JSON$parse.service,
            action = _JSON$parse.action,
            _JSON$parse$payload = _JSON$parse.payload,
            payload = _JSON$parse$payload === undefined ? {} : _JSON$parse$payload,
            _JSON$parse$meta = _JSON$parse.meta,
            meta = _JSON$parse$meta === undefined ? {} : _JSON$parse$meta,
            token = _JSON$parse.token;

        isError = action === 'error';

        // todo make this less weird (not hacky)
        // if we pass more info in the payload this will
        // need to be changed to not throw that data away
        if (isError) {
            // tweak payload to be the error object
            payload = new _EnplugError2.default(payload.message || '');
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

        var msg = _extends({}, message);

        // We need to send app url with the message so that Web Player knows which application sent
        // a message.
        msg.appUrl = window.location.href;

        if (!msg.hasOwnProperty('service') || typeof msg.service !== 'string') {
            return Promise.reject(new TypeError('[Enplug SDK] Bridge message requires a service property (string)'));
        }

        if (!msg.hasOwnProperty('action') || typeof msg.action !== 'string') {
            return Promise.reject(new TypeError('[Enplug SDK] Bridge message requires an action property (string)'));
        }

        if (noReturn) {
            epBridge.send(JSON.stringify(msg));

            return;
        }

        return new Promise(function (resolve, reject) {
            var token = createToken();

            responseMap[token] = [resolve, reject];

            // todo add a timeout to reject?
            // would need to keep timeoutId around to stop timeout when the response comes in
            // probably want to move to object in responseMap instead of an array
            /*
            var timeoutId = setTimeout(function() {
              if ( token in responseMap ) {
                reject( new EnplugError( 'Message Timed Out' ));
                delete responseMap[ token ];
              }
            }, RESPONSE_TIMEOUT );
            */

            msg.token = token;
            epBridge.send(JSON.stringify(msg));
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

},{"./errors/EnplugError":5,"./events":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playRecorder = exports.assets = exports.settings = exports.appStatus = exports.notifications = undefined;

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _notifications = require('./notifications');

var _notifications2 = _interopRequireDefault(_notifications);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _playRecorder = require('./play-recorder');

var _playRecorder2 = _interopRequireDefault(_playRecorder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enplug = {
  on: _events2.default.on,
  once: _events2.default.once,
  off: _events2.default.off,
  notifications: _notifications2.default,
  appStatus: _status2.default,
  settings: _settings2.default,
  assets: _assets2.default,
  playRecorder: _playRecorder2.default
};

exports.default = enplug;
exports.notifications = _notifications2.default;
exports.appStatus = _status2.default;
exports.settings = _settings2.default;
exports.assets = _assets2.default;
exports.playRecorder = _playRecorder2.default;

},{"./assets":2,"./events":6,"./notifications":9,"./play-recorder":10,"./settings":11,"./status":12}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * A Constructor for creating "EnplugError" objects
 * @param {string} message -- the message for this error
 * @constructor
 */
function EnplugError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  this.message = message;

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor);
  }
}

// properly set up prototype as an Error subclass
EnplugError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: EnplugError,
    writeable: true,
    configurable: true
  },
  name: {
    value: 'EnplugError',
    writeable: true,
    configurable: true
  }
});

// export the constructor
exports.default = EnplugError;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processEvent = exports.eventProcessor = undefined;

var _eventEmitter = require('./lib/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _eventTransform = require('./lib/event-transform');

var _eventTransform2 = _interopRequireDefault(_eventTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var events = (0, _eventEmitter2.default)(),
    eventProcessor = (0, _eventTransform2.default)();

function processEvent(eventName, payload, meta) {
  // eslint-disable-line
  var eventData = payload;

  if (eventProcessor.has(eventName)) {
    eventData = eventProcessor.runTransforms(eventName, payload);
  }

  events.dispatch(eventName, eventData);
}

exports.default = events;
exports.eventProcessor = eventProcessor;
exports.processEvent = processEvent;

},{"./lib/event-emitter":7,"./lib/event-transform":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var instance,
      handlerMap = Object.create(null),
      maxListeners = 10;

  /*eslint no-extra-parens: "off"*/
  return instance = {
    get maxListeners() {
      return maxListeners;
    },
    set maxListeners(newMax) {
      if (!Number.isInteger(newMax)) {
        throw new TypeError('Max Listeners must be a valid Integer');
      }

      return maxListeners = newMax;
    },

    on: function on(eventName, handler) {
      typeCheckArgs(eventName, handler);

      // todo check max listeners
      if (eventName in handlerMap) {
        handlerMap[eventName].push(handler);
      } else {
        handlerMap[eventName] = [handler];
      }
    },
    once: function once(eventName, handler) {
      var _tmpFn;

      typeCheckArgs(eventName, handler);

      // todo maybe check max listeners

      _tmpFn = function tmpFn() {
        instance.off(eventName, _tmpFn);
        handler.apply(undefined, arguments);
      };

      return instance.on(eventName, _tmpFn);
    },
    off: function off(eventName, handler) {
      var handlerIndex = -1;

      typeCheckArgs(eventName, handler);

      if (eventName in handlerMap) {
        handlerIndex = handlerMap[eventName].indexOf(handler);
      }

      if (handlerIndex >= 0) {
        handlerMap[eventName].splice(handlerIndex, 1);
      }
    },
    dispatch: function dispatch(eventName, event) {
      if (!Object.hasOwnProperty.call(event, 'type')) {
        event.type = eventName;
      }

      if (eventName in handlerMap && Array.isArray(handlerMap[eventName])) {
        handlerMap[eventName].slice().forEach(function (handler) {
          return handler(event);
        });
      }
    }
  };
};

var typeCheckArgs = function typeCheckArgs(eventName, handler) {
  if (eventName == null || typeof eventName !== 'string') {
    throw new TypeError('An event name is required to attach an event handler');
  }

  if (handler == null || typeof handler !== 'function') {
    throw new TypeError('A handler function is required for .on');
  }
};

/**
 * @typedef {object|function} Event
 * @property {string} type -- the name of this event (should match what was used to bind the handler)
 */

/**
 * The EventEmitter class used for enplug event handling
 * @typedef {object} EventEmitter
 * @property {number} maxListeners -- the maximum number of listeners that can be attached (not currently used)
 * @property {function} on -- used to bind event handlers by name
 * @property {function} once -- used to bind event handlers by name that are removed after the first event they see
 * @property {function} off -- used to unbind event handlers
 * @property {function} dispatch -- used to dispatch event data to the registered handlers
 */

/**
 * @returns {EventEmitter} -- a factory for creating an event emitter like object
 */

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// todo write tests

/**
 * The Event Transform Pipeline can be used to run a collection of functions on some event data
 *
 * @typedef {object} EventTransformPipeline
 * @method {function} has -- takes an event name and returns true if transforms have been registered
 * @method {function} addTransform -- registers a transform function for the given event name
 * @method {function} removeTransform -- removes a transform function from the pipeline
 * @method {function} runTransforms -- takes an event name and event data, runs the transform functions returns the transformed data
 */

/**
 * @function EventTransformPipeline
 * This function returns a new pipeline instance that can be used
 * to transform data before it gets dispatched to the JavaScript App
 *
 * @returns {EventTransformPipeline}
 */


exports.default = function () {
  var transformMap = Object.create(null);

  /**
   * Returns true if eventName is in the transformMap
   * @param eventName
   * @returns {boolean}
   */
  function hasTransform(eventName) {
    return eventName in transformMap;
  }

  return {
    has: hasTransform,

    addTransform: function addTransform(eventName, transformFn) {
      if (!hasTransform(eventName)) {
        transformMap[eventName] = [];
      }

      return transformMap[eventName].push(transformFn) - 1;
    },
    removeTransform: function removeTransform(eventName, transformFn) {
      if (hasTransform(eventName)) {
        transformMap[eventName] = transformMap[eventName].filter(function (func) {
          return func !== transformFn;
        });
      }
    },
    runTransforms: function runTransforms(eventName, eventData) {
      if (!hasTransform(eventName)) {
        return eventData;
      }

      return transformMap[eventName].reduce(function (currData, transformFn) {
        return transformFn(currData) || currData;
      }, _extends({}, eventData));
    }
  };
};

},{}],9:[function(require,module,exports){
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

},{"./bridge":3}],10:[function(require,module,exports){
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

},{"./bridge":3}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// todo populate from Java?
var TRANSITIONS = {
  SLIDE_LEFT: 'SLIDE_LEFT',
  SLIDE_RIGHT: 'SLIDE_RIGHT',
  SLIDE_DOWN: 'SLIDE_DOWN',
  SLIDE_UP: 'SLIDE_UP',
  FADE: 'FADE',
  NONE: 'NONE'
},
    settingsSender = _bridge2.default.senderForService('settings');

var is4KCache = null;

// settings API
exports.default = {
  get TRANSITIONS() {
    return TRANSITIONS;
  },

  get is4K() {
    if (is4KCache != null) {
      return is4KCache;
    }

    return is4KCache = settingsSender({
      action: 'is4K'
    }).then(function (payload) {
      return payload.value;
    });
  },

  // todo cache this
  // if I'm remembering right when this changes the whole player is restarted
  // so it is safe to assume this will not change at run-time
  get transitionType() {
    return settingsSender({
      action: 'transition-type'
    }).then(function (payload) {
      return payload.value;
    });
  },

  hideWhitelabel: function hideWhitelabel() {
    return settingsSender({
      action: 'hide-whitelabel'
    }).then(function (payload) {
      return payload.success;
    });
  },


  get whitelabel() {
    return settingsSender({
      action: 'get-whitelabel'
    }).then(function (payload) {
      return payload.value;
    });
  }
};

},{"./bridge":3}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bridge = require('./bridge');

var _bridge2 = _interopRequireDefault(_bridge);

var _events = require('./events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATES = {
  ERROR: 'error',
  START: 'start',
  //    READY: 'ready',
  HIDE: 'hide',
  FINISHED: 'finished',
  //    RENDER: 'render',
  TRANSITION: 'transition'
},
    statusSender = _bridge2.default.senderForService('status');

// module local vars
var sendStateAction,
    createDoneCB,
    canInterrupt = true;

// internal helper for sending state update messages
sendStateAction = function sendStateAction(newState) {
  return statusSender({
    action: newState
  }).then(function (payload) {
    return payload.success || null;
  });
};

createDoneCB = function createDoneCB() {
  return function done() {
    statusSender({
      action: 'destroy-finished'
    }, true);
  };
};

// add event transform for destroy event
_events.eventProcessor.addTransform('destroy', function (eventData) {
  return _extends(createDoneCB(), eventData);
});

// appStatus API
exports.default = {
  get STATES() {
    return STATES;
  },

  start: function start() {
    return sendStateAction(STATES.START);
  },
  error: function error() {
    return sendStateAction(STATES.ERROR);
  },
  hide: function hide() {
    return sendStateAction(STATES.HIDE);
  },
  transition: function transition() {
    return sendStateAction(STATES.TRANSITION);
  },


  get canInterrupt() {
    return Promise.resolve(canInterrupt);
  },

  setCanInterrupt: function setCanInterrupt(newValue) {
    if (typeof newValue !== 'boolean') {
      return Promise.reject(new TypeError('[Enplug SDK] You can only set canInterrupt to a boolean value'));
    }

    // optimistic update
    canInterrupt = newValue;

    return statusSender({
      action: 'set-interrupt',
      payload: {
        canInterrupt: newValue
      }
    }).catch(function (error) {
      canInterrupt = !newValue;
      throw error;
    }).then(function () {
      return canInterrupt;
    });
  }
};

},{"./bridge":3,"./events":6}]},{},[1])(1)
});