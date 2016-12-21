'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
EnplugError.prototype = (0, _create2.default)(Error.prototype, {
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