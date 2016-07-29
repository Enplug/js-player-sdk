
import bridge from './bridge';

const playRecSender = bridge.senderForService( 'play-recorder' );

// note play duration is in seconds
export default {
  report( referenceId, playDuration, additionalInfo = '' ) {
    var payload = {
      referenceId,
      playDuration
    };

    if ( additionalInfo !== '' ) {
      payload.additionalInfo = additionalInfo;
    }

    playRecSender({
      action: 'report',
      payload
    }, true );

    // todo should this actually return something?
  }
};
