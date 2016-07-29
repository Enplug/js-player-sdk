
/**
 * A Constructor for creating "EnplugError" objects
 * @param {string} message -- the message for this error
 * @constructor
 */
function EnplugError( message = '' ) {
  this.message = message;

  if ( typeof Error.captureStackTrace === 'function' ) {
    Error.captureStackTrace( this, this.constructor );
  }
}

// properly set up prototype as an Error subclass
EnplugError.prototype = Object.create( Error.prototype, {
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
export default EnplugError;
