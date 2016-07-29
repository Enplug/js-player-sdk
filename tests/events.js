
import test from 'tape';

import enplug from '../src/enplug';
import { dispatch } from '../src/events';

var eventName = 'my-event';

test( 'enplug.on binds an event listener', function( assert ) {
  var handler = function( event ) {
    assert.equals( event.name, eventName, 'event.name equals original event name' );
  };

  assert.plan( 1 );

  enplug.on( eventName, handler );

  dispatch( eventName, {});

  enplug.off( eventName, handler );
});

test( 'enplug.off removes an event listener', function( assert ) {
  var
    callCount = 0,
    handler = function( event ) {
      callCount += 1;
      assert.equals( event.name, eventName, 'handler was fired' );
    };

  assert.plan( 2 );

  enplug.on( eventName, handler );
  dispatch( eventName, {});

  enplug.off( eventName, handler );
  dispatch( eventName, {});

  assert.equal( callCount, 1, 'handler was only called once' );
});

test( 'enplug.once automatically removes a handler after first event', function( assert ) {
  var
    callCount = 0,
    handler = function( event ) {
      callCount += 1;
      assert.equals( event.name, eventName, 'handler was fired' );
    };

  assert.plan( 2 );

  enplug.once( eventName, handler );
  dispatch( eventName, {});

  dispatch( eventName, {});
  assert.equals( callCount, 1, 'handler was only called once' );
});

