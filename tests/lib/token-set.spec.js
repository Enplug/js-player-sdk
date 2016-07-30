
import test from 'tape';
import tokenSetFactory from '../../src/lib/token-set';


test( 'Factory function creates an Empty Token Set', function( assert ) {
  var theSet = tokenSetFactory();

  assert.equals( theSet.size, 0, 'the set has a size 0' );
  assert.equals( theSet.keys, [], 'keys is an empty array' );
  assert.equals( theSet.entries, [], 'entries is an empty array' );
  assert.end();
});

test( 'tokenSet.create', function( assert ) {
  var
    currentToken,
    theSet = tokenSetFactory();

  assert.equals( theSet.size, 0, 'started with empty set' );

  currentToken = theSet.create();
  assert.equals( theSet.size, 1, 'create adds an entry' );
  assert.equals( theSet.get( currentToken ), null, 'no-args create sets data to null' );

  currentToken = theSet.create( 'some data' );
  assert.equals( theSet.get( currentToken ), 'some data', 'single argument to create sets entry data' );

  assert.end();
});

test( 'tokenSet.delete', function( assert ) {});

test( 'tokenSet.has', function( assert ) {});

test( 'tokenSet.get', function( assert ) {});

test( 'tokenSet.set', function( assert ) {});

test( 'tokenSet.keys', function( assert ) {});

test( 'tokenSet.entries', function( assert ) {});

