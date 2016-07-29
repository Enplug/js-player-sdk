
import test from 'tape';
import enplug from '../src/enplug';


test( 'enplug.settings.TRANSITIONS is an enum of possible transition types', function( assert ) {
  var TRANSITIONS = enplug.settings.TRANSITIONS;

  assert.equals( TRANSITIONS.SLIDE_LEFT, 0, 'SLIDE_LEFT === 0' );
  assert.equals( TRANSITIONS.SLIDE_RIGHT, 1, 'SLIDE_RIGHT === 1' );
  assert.equals( TRANSITIONS.SLIDE_DOWN, 2, 'SLIDE_DOWN === 2' );
  assert.equals( TRANSITIONS.SLIDE_UP, 3, 'SLIDE_UP === 3' );
  assert.equals( TRANSITIONS.FADE, 4, 'FADE === 4' );
  assert.equals( TRANSITIONS.NONE, 5, 'NONE === 5' );

  assert.end();
});
