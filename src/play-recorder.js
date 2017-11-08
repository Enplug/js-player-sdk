
import bridge from './bridge';

const playRecSender = bridge.senderForService( 'play-recorder' );

// note play duration is in seconds
export default {
  report( assetId, referenceId, playDuration, additionalInfo = '' ) {
    var payload = {
      assetId,
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
