
import registerMock from './register-mock';

const SERVICE_NAME = 'play-recorder';

// play-recorder, report
registerMock(
  SERVICE_NAME,
  'report',
  function({ referenceId, playDuration, additionalInfo = '' }) {
    console.log( `[Enplug SDK Mocks] Reporting play time of ${ playDuration } for asset with id: ${ referenceId }, with additional info: ${ additionalInfo }`)

    return null;
  }
);
