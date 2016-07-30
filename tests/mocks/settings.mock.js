
import registerMock from './register-mock';

const SERVICE_NAME = 'settings';

// settings, is4K
registerMock(
  SERVICE_NAME,
  'is4K',
  function( payload ) {

  }
);

// settings, transition-type
registerMock(
  SERVICE_NAME,
  'transition-type',
  function() {
    return {
      value: 'SLIDE_LEFT'
    };
  }
);

// settings, hide-whitelabel
registerMock(
  SERVICE_NAME,
  'hide-whitelabel',
  function() {
    return {
      success: true
    };
  }
);

// settings, get-whitelabel
registerMock(
  SERVICE_NAME,
  'get-whitelabel',
  function() {
    return {
      value: 'Powered by Display OS'
    };
  }
);

