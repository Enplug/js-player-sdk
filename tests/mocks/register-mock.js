
var
  exists = false,
  registry = Object.create( null ),
  epBridge;


// check for existence
try {
  // this should fail, unless mocks are loaded in a "production" environment
  epBridge = _epBridge;

  // flag to suspend execution of mock bundle
  exists = true;
} catch ( error ) {
  // create mocked "send"
  console.log( 'creating mocked _epBridge Object' );

  // create epBridge
  epBridge = {
    send( json ) {
      // make it async
      setTimeout(function() {
        var message, service;

        try {
          // parse message
          message = JSON.parse( json );
          service = message.service || '';
        } catch ( err ) {
          // catch error during parsing
          console.group( '[Enplug SDK Mocks]');
          console.warn( 'Error parsing message' );
          console.warn( 'Failing Message: %o', json );
          console.groupEnd();

          return;
        }

        // check the registry for this service
        if ( service in registry ) {
          let
            serviceMap = registry[ service ],
            action = message.action || '';

          // check registered mock for this action
          if ( action in serviceMap ) {
            // call mock function to get response
            let response = serviceMap[ action ]( message.payload || {});

            // conditionally stringify response and call receive
            if ( response == null ) {
              console.log( `[Enplug SDK Mocks] Action, ${ action } for service, ${ service }, does not call _epBridge.receive` );
            } else {
              epBridge.receive( typeof response === 'string' ? response : JSON.stringify( response ));
            }
          } else {
            console.warn( `[Enplug SDK Mocks] No mocking function found for service: ${ service } with action: ${ action }` );
          }
        } else {
          console.warn( `[Enplug SDK Mocks] Service: ${ service }, was not found in mock registry` );
        }
      }, 100 );
    }
  };
}

if ( exists ) {
  console.warn( '[Enplug SDK Mocks] Player mocks could not be attached because _epBridge already exists' );
  throw new Error( '[Enplug SDK] SDK Mocking Library included in non-testing environment' );
}

// set bridge to mocked bridge
window._epBridge = epBridge;


export default function registerMock( service, action, mockFunction ) {
  var serviceRegistry = registry[ service ];

  if ( serviceRegistry == null ) {
    registry[ service ] = serviceRegistry = Object.create( null );
  }

  if ( action in serviceRegistry ) {

    throw new Error( `[Enplug SDK Mocks] A mocking function has already been registered for service: ${ service } and action: ${ action }` );

  } else {

    serviceRegistry[ action ] = mockFunction;

  }
}
