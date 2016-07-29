
import bridge from './bridge';
import { eventProcessor } from './events';

const
  STATES = {
    ERROR: 'error',
    START: 'start',
//    READY: 'ready',
    HIDE: 'hide',
    FINISHED: 'finished',
//    RENDER: 'render',
    TRANSITION: 'transition'
  },
  statusSender = bridge.senderForService( 'status' );

// module local vars
var
  sendStateAction,
  createDoneCB,
  canInterrupt = true;

// internal helper for sending state update messages
sendStateAction = function( newState ) {
  return statusSender({
    action: newState
  }).then( function( payload ) {
    return payload.success || null;
  });
};

createDoneCB = function() {
  return function done() {
    statusSender({
      action: 'destroy-finished'
    }, true );
  };
};

// add event transform for destroy event
eventProcessor.addTransform( 'destroy', function( eventData ) {
  return Object.assign( createDoneCB(), eventData );
});

// appStatus API
export default {
  get STATES() {
    return STATES;
  },

  start() {
    return sendStateAction( STATES.START );
  },

  error() {
    return sendStateAction( STATES.ERROR );
  },

  hide() {
    return sendStateAction( STATES.HIDE );
  },

  transition() {
    return sendStateAction( STATES.TRANSITION );
  },

  get canInterrupt() {
    return Promise.resolve( canInterrupt );
  },

  setCanInterrupt( newValue ) {
    if ( typeof newValue !== 'boolean' ) {
      return Promise.reject( new TypeError( '[Enplug SDK] You can only set canInterrupt to a boolean value' ));
    }

    // optimistic update
    canInterrupt = newValue;

    return statusSender({
      action: 'set-interrupt',
      payload: {
        canInterrupt: newValue
      }
    })
      .catch( function( error ) {
        canInterrupt = !newValue;
        throw error;
      })
      .then( function() {
        return canInterrupt;
      });
  }
};
