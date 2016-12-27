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

import { processEvent } from './events';
import EnplugError from './errors/EnplugError';

// todo finish reject timeout
const RESPONSE_TIMEOUT = ( 60 * 1000 );

var
  epBridge,
  // todo break token map and generator into own module
  responseMap = Object.create( null ),
  hasOwn = ( obj, name ) => Object.prototype.hasOwnProperty.call( obj, name ),
  createToken = function() {
    var token = Math.random().toString( 36 ).substr( 2 );

    if ( token in responseMap ) {
      return createToken();
    }

    return token;
  };

// check for bridge existence
try {
  let $global = Function( 'return this' )(); // eslint-disable-line

  if ( hasOwn( $global, '_epBridge' )) {

    console.log( '[Enplug SDK] Creating bridge from standard implementation.' );
    epBridge = $global._epBridge;

  } else if ( hasOwn( $global, '_epBridgeSend' )) {

    console.log( '[Enplug SDK] Creating bridge from CEF implementation.' );
    epBridge = $global._epBridge = {
      send( message ) {
        $global._epBridgeSend({
          request: message,
          persistent: false
        });
      }
    };
  } else {
    epBridge = _epBridge;
  }

} catch ( error ) {
  console.warn(
    '[Enplug SDK] Error initializing SDK: ' +
    '_epBridge does not exist on global object. Failing stack follows.'
  );
  console.warn( error.stack );

  // epBridge was not found. In such case, we assume that the application is iframed within 
  // WebPlayer and communication has to proceed via posting and receiving messages between windows.
  // TODO(michal): generalize hardcoded player.enplug.loc URL.
  console.info('Initializing Web Development Player.')
  epBridge = {
    send: (msg) => parent.postMessage(msg, 'http://player.enplug.loc')
  };

  window.addEventListener('message', function(event) {
    console.log('Data received from the Player', event.data);
    epBridge.receive(event.data);
  });
}


/*eslint no-implicit-globals: "off", no-unused-vars: "off" */
// global fn for Java bridge to call
epBridge.receive = function( json ) {
  try {
    let
      isError,
      {
        service,
        action,
        payload = {},
        meta = {},
        token
      } = JSON.parse( json );


    isError = ( action === 'error' );

    // todo make this less weird (not hacky)
    // if we pass more info in the payload this will
    // need to be changed to not throw that data away
    if ( isError ) {
      // tweak payload to be the error object
      payload = new EnplugError( payload.message || '' );
    }

    // if there is a token we can just resolve the promise and be done
    // if it was an error the payload has been transformed to an error
    //    so we can just reject the promise with that error
    if ( token && token in responseMap ) {
      responseMap[ token ][ isError ? 1 : 0 ]( payload );
      delete responseMap[ token ];

      return;
    }

    // this is for any "public" event (these are consumed by third parties)
    if ( service === 'event' ) {
      processEvent( action, payload, meta );
    }

  } catch ( err ) {
    console.error( '[Enplug SDK] Error receiving and processing message in _epBridge.receive' );
    console.error( err.stack );
  }

  // todo add message that call wasn't handled?
};

/**
 *  @module enplug.bridge
 */
export default {
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
  send( message, noReturn = false ) {
    var msg = Object.assign({}, message );

    if ( !msg.hasOwnProperty( 'service' ) || typeof msg.service !== 'string' ) {
      return Promise.reject(
        new TypeError( '[Enplug SDK] Bridge message requires a service property (string)' )
      );
    }

    if ( !msg.hasOwnProperty( 'action' ) || typeof msg.action !== 'string' ) {
      return Promise.reject(
        new TypeError( '[Enplug SDK] Bridge message requires an action property (string)' )
      );
    }

    if ( noReturn ) {
      epBridge.send( JSON.stringify( msg ));

      return;
    }

    return new Promise( function( resolve, reject ) {
      var token = createToken();

      responseMap[ token ] = [ resolve, reject ];

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
      epBridge.send( JSON.stringify( msg ));
    });
  },

  /**
   * A helper for creating a send function that automatically adds the "service" property
   * based on the original input.
   *
   * @param {string} service -- the service name to add to messages
   * @returns {SenderFunction} // todo typedef
   */
  senderForService( service ) {
    return ( message = {}, noReturn = false ) => {
      message.service = service;

      return this.send( message, noReturn );
    };
  }
};
