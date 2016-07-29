
import test from 'tape';
import enplug from '../src/enplug';

test( 'enplug.playRecorder.report works without additionalInfo', function( assert ) {
  var playCountPromise = enplug.playRecorder.report( 'some-reference', 60 );

  assert.plan( 2 );
  assert.equals( typeof playCountPromise.then, 'function', 'report returns a promise' );

  playCountPromise.then( function( idkWhat ) {
    assert.equals( idkWhat, 60, 'total duration is returned from report?' );
  });
});
