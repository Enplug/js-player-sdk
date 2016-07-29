
import test from 'tape';

import enplug from '../src/enplug';


test( 'notification.post creates a notification', function( assert ) {
  var noteIdPromise = enplug.notifications.post( 'Downloading Image' );

  assert.plan( 2 );
  assert.equals( typeof noteIdPromise.then, 'function', 'notification.post returns a promise' );

  noteIdPromise.then( function( noteId ) {
    assert.ok( noteId, 'notification id exists in resolved promise' );
  });
});

test( 'notification.update changes a notifications message', function( assert ) {
  var noteIdPromise = enplug.notifications.post( 'Downloading Image' );

  assert.plan( 2 );
  assert.equals( typeof noteIdPromise.then, 'function', 'notification.update returns a promise' );

  noteIdPromise.then( function( noteId ) {
    var updatePromise = enplug.notifications.update( noteId, 'Uploading Image' );

    updatePromise.then( function( updateNoteId ) {
      assert.equals( noteId, updateNoteId, 'both post and update return the same notification ID' );
    });
  });
});

test( 'notification.delete removes a notification', function( assert ) {
  var noteIdPromise = enplug.notifications.post( 'Downloading Image' );

  assert.plan( 2 );
  assert.equals( typeof noteIdPromise.then, 'function', 'notification.delete returns a promise' );

  noteIdPromise.then( function( noteId ) {
    var deletePromise = enplug.notifications.delete( noteId );

    deletePromise.then( function( success ) {
      assert.equals(
        success,
        true,
        'notification.delete promise resolves to true when notification is deleted'
      );
    });
  });
});
