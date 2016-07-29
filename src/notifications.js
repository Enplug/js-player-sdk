
import bridge from './bridge';

const notificationSender = bridge.senderForService( 'notification' );

export default {
  post( message ) {
    return notificationSender({
      action: 'post',
      payload: {
        message
      }
    }).then( function( payload ) {
      return payload.notificationId;
    });
  }
};
