
import registerMock from './register-mock';

const SERVICE_NAME = 'asset';

// asset, get-next
registerMock(
  SERVICE_NAME,
  'get-next',
  function() {
    // todo use faker
    return {
      name: 'Google',
      url: 'http://www.google.com'
    };
  }
);

// asset, get-list
registerMock(
  SERVICE_NAME,
  'get-list',
  function() {
    // todo use faker
    return [
      {
        name: 'asset 1: Google',
        url: 'http://www.google.com'
      },
      {
        name: 'asset 2: Bing',
        url: 'http://www.bing.com'
      }
    ];
  }
);
