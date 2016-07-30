
import registerMock from './register-mock';

const SERVICE_NAME = 'status';

// status, update-state
// ready, error, finished, transition?
registerMock(
  SERVICE_NAME,
  'update-state',
  function({ newState }) {
    console.log( `[Enplug SDK Mocks] Updating state to: ${ newState }` );

    return {
      success: true
    };
  }
);

// status, transition

// status, hide
registerMock(
  SERVICE_NAME,
  'hide',
  function() {
    return {
      success: true
    };
  }
);

// status, set-interrupt
registerMock(
  SERVICE_NAME,
  'set-interrupt',
  function({ canInterrupt }) {
    console.log( `[Enplug SDK Mocks] Setting canInterrupt to: ${ canInterrupt }` );

    return {
      success: true
    };
  }
);
