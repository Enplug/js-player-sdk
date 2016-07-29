
import test from 'tape';
import enplug from '../src/enplug';


test( 'enplug.asset.getNext returns a promise', function( assert ) {
  var assetPromise = enplug.assets.getNext();

  assert.plan( 2 );
  assert.equals( typeof assetPromise.then, 'function', 'asset.getNext returns a promise' );

  assetPromise.then( function( asset ) {
    assert.equals( typeof asset, 'object', 'asset.getNext promise resolves to a single object' );
  });
});

test( 'enplug.asset.getList returns a promise', function( assert ) {
  var assetPromise = enplug.assets.getList();

  assert.plan( 2 );
  assert.equals( typeof assetPromise.then, 'function', 'asset.getList returns a promise' );

  assetPromise.then( function( assetList ) {
    assert.true( Array.isArray( assetList ), 'asset.getList promise resolves to an array' );
  });
});
