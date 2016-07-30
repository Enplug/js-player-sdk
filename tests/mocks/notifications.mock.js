
import registerMock from './register-mock';

const
  SERVICE_NAME = 'notification',
  TIMEOUT_LENGTH = 30000,
  notificationMap = new Map();

/**
 *
 * @param message
 * @returns {*}
 */
function createNotification( message ) {
  var id;

  do {
    id = Math.random().toString( 36 ).substr( 2 );
  } while ( notificationMap.has( id ));

  notificationMap.set( id, {
    message,
    timeoutId: setTimeout( function() {
      var msg;

      if ( !notificationMap.has( id )) {
        console.log( `[Enplug SDK Mocks] Notification for id ${ id } did not exist at time to show` );

        return;
      }

      msg = notificationMap.get( id ).message;
      console.log( '[Enplug SDK Mocks] "Showing" Notification with message %s', msg );
      notificationMap.delete( id );

    }, TIMEOUT_LENGTH )
  });

  return id;
}

// post mock
registerMock(
  SERVICE_NAME,
  'post',
  function( payload ) {
    var { message = 'No message found' } = payload;

    console.group( '[Enplug SDK Mocks] Creating Notification' );
    console.log( `message: ${ message }` );
    console.groupEnd();

    return {
      notificationId: createNotification( message )
    };
  }
);

// update mock
registerMock(
  SERVICE_NAME,
  'update',
  function( payload ) {
    var {
      notificationId,
      message
      } = payload;

    if ( notificationId && notificationMap.has( notificationId )) {
      let previous = notificationMap.get( notificationId );

      console.log( `[Enplug SDK Mocks] Updating notification message, id: ${ notificationId }, message: ${ message }` );
      previous.message = message;
      notificationMap.set( notificationId, previous );

    } else if ( notificationId == null ) {

      console.log( '[Enplug SDK Mocks] Notification Id did not exist on update notification payload' );

    } else {

      console.log( `[Enplug SDK Mocks] Notification did not exist for id: ${ notificationId }` );
    }

    return {
      notificationId
    };
  }
);

// delete mock
registerMock(
  SERVICE_NAME,
  'delete',
  function( payload ) {
    var {
      notificationId
      } = payload;

    if ( notificationId && notificationMap.has( notificationId )) {
      let {
        message,
        timeoutId
        } = notificationMap.get( notificationId );

      clearTimeout( timeoutId );
      console.log( `[Enplug SDK Mocks] Deleted Notification with id: ${ notificationId } and message ${ message }` );

      return {
        success: true
      };

    } else if ( notificationId == null ) {

      console.log( '[Enplug SDK Mocks] Notification Id did not exist on delete notification payload' );

    } else {

      console.log( `[Enplug SDK Mocks] Notification did not exist for id: ${ notificationId }. It had probably already been displayed` );
    }

    return {
      success: false
    };
  }
);

