
import test from 'tape';
import enplug from '../src/enplug';

test( 'enplug.appStatus.STATES is an enum of states', function( assert ) {
  var STATES = enplug.appStatus.STATES;

  assert.equals( STATES.UNKNOWN, 0, 'unknown state exists' );
  assert.equals( STATES.ERROR, 1, 'error state exists' );
  assert.equals( STATES.LOADING, 2, 'loading state exists' );
  assert.equals( STATES.LOADED, 3, 'loaded state exists' );
  assert.equals( STATES.START, 4, 'start state exists' );
  assert.equals( STATES.FINISHED, 6, 'finished state exists' );

  assert.end();
});


// todo finish status tests
