# Enplug Player SDK

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Enplug/dashboard-sdk/blob/master/LICENSE)

The official Enplug JavaScript SDK for the player interface of apps built for Enplug displays.

<!---
// TODOS
1. Better (read: actual) Tests
2. Test Coverage
3. DocumentJS
4. Travis-CI
5. Badges
6. Contributing.md?
--->


## Install
See the enplug app seed project for an example of using this SDK for an enplug app.
https://github.com/enplug/app-seed

```sh
$ npm install --save @enplug/player-sdk
```

## Usage

In an ES6 Module environment
```js
import enplug from '@enplug/player-sdk';

enplug.notifications.post( 'path-to-icon.png', 'Hello World!' );
```

Via a CommonJS style `require`
```js
var enplug = require( '@enplug/player-sdk' );

enplug.assets.getNext().then(function( theAsset ) {
  // do magic
});
```

See the current documentation at: https://developers.enplug.com/api-reference/javascript-player-api/events/ (listed under "Player JS API")

## Tests
`npm test`

## API Reference
## Events
The Event API for Player Apps has methods for adding and removing event handlers. Events include system events as well as custom app events generated via push notifications. The JavaScript Player SDK has a few events that are fired during specific moments of the application life-cycle. Below you can find the various events and what to expect to be passed to the event handler.

###‘destroy’ Event
The “destroy” event is fired anytime the application is going to be disposed by the player. When developing a player application with the JavaScript SDK you should be prepared for your app to destroyed anytime it is taken off of the display. The player will fire the “destroy” event and then wait for a small amount of time to allow you to do any cleanup. To notify the player you are done with any final processes a callback is passed to the event handler. If you do not call the callback, your app will still be removed once the allotted cleanup time has passed. Every JavaScript Player application should attach a handler, if only to call the done callback.

```js
enplug.on( 'destroy', function( done ) {
  // maybe save some state information
  localStorage.setItem( 'last-viewed', view.id );

  done(); // ok! I'm ready to be destroyed...
});
```

### `enplug.on( eventName, handler ) : undefined`
The on function can be used to attach a new handler for a specific event by that event’s name. If you wish to remove this event handler at any time you will need to keep a reference to the handler function and pass it into the off function (described below).

- **eventName:** The name of the event the handler should be bound to.
- **handler:** The function to handle incoming events of type “eventName”.

### `enplug.off( eventName, handler ) : undefined`
The off function is used to remove existing event handlers. It is important to note that a reference to the original event handler must be passed to off for the handler to be removed.

- **eventName:** The name of the event this handler is bound to.
- **handler:** The original function bound to the event.

### `enplug.once( eventName, handler ) : undefined`
The once function is a connivence function for adding an event handler that gets automatically removed after the first time it is fired. The code below is the functional equivalent of the once function’s functionality.

```js
function handler( eventData ) {
  enplug.off( 'my-event', handler );
}
enplug.on( 'my-event', handler );
```

## Notifications
The notifications API is for launching alerts to the Enplug Player. You may have noticed these types of alerts created by the Enplug Social App when new posts are received by the Player. A notification consists of an icon and a message. It is important to note that if the user has disabled alerts for their display your notifications will be automatically suppressed by the Enplug Player.

### `enplug.notifications.post( message ) : Promise<NotificationId>`
The post function will take a single argument, the message to display. The message should be as simple as possible to keep the notification short and sweet. The icon used when registering the application in the Enplug App Store will be used as the icon for the notification.

- **message:** The message to display in the notification.

## Application Status
The App Status API is for telling the player what state your application is currently in. Most of these functions relate to the application’s life-cycle.

### `enplug.appStatus.start() : Promise<Boolean>`
When an app is first started by the Enplug Player it will not be shown on screen until it explicitly tells the player that it is **ready to be rendered**. Note that initially apps are loaded off screen so they can be given time to properly initialize. When you have set up your application and are ready to be shown on the Enplug Player call the **start** function to be entered into the current rotation of active Player Applications.
Returns a Promise that resolves to true if the operation has completed successfully.

### `enplug.appStatus.error() : Promise<Boolean>`
It is important to notify the player if your application has reached an unresolvable error. Calling the error function will notify the Enplug Player that your application is not operating properly and should be removed from the current rotation of Player Applications. Calling error will typically end up with your application being disposed and destroyed from working memory.
Returns a Promise that resolves to true if the operation has completed successfully.

### `enplug.appStatus.transition() : Promise<Boolean>`
The transition function is for delegating transition animations to the built in native player animations. In watching an Enplug Player run you will notice a consistent transition between applications. To enable this style transition within your application use the transition function. Calling transition will cause the Enplug Player to pause rendering of you application while still showing the last state on screen. A new instance of your application will be created while the old one is destroyed. Once you call start in the new application, the Enplug Player will preform a transition from the “previous” state that is currently on screen to the new state currently rendered by the application.
Returns a Promise that resolves to true when the app has entered the transition state.

### `enplug.appStatus.hide() : Promise<Boolean>`
If ever you want to immediately hide your application the hide function can be called to do so. Calling this function will hide your application until it comes up in the normal application rotation cycle. If you app is the only app playing on the display it will not be hidden.
A Promise that resolves to true when the app has been hidden from the screen.

### `enplug.appStatus.setCanInterrupt( boolean ) : Promise`
Sometimes your app will be displaying a video or some other content that should not be interrupted. If you wish to stop the Enplug Player from replacing your app on screen use the canInterrupt property and setCanInterrupt function of the enplug.appStatus object. The canInterrupt property is returned as a promise resolving to a boolean value. The setCanInterrupt function takes the new boolean value and returns a Promise resolving to the new value. It is safe to assume that this value takes hold as soon as it is set. Typically you will only set the value when needed.

```js
myVideo.addEventListener( 'play', function( playEvent ) {
  enplug.appStatus.setCanInterrupt( false ); // returns a Promise
});

myVideo.addEventListener( 'ended', function( endEvent ) {
  enplug.appStatus.setCanInterrupt( true ); // returns a Promise
});

myVideo.play();
```

### `enplug.appStatus.canInterrupt: Promise<Boolean>`
Checks the current state of canInterrupt property. Returns promise resolving to true if the app had requested not to be interrupted and false otherwise.

```js
enplug.appStatus.canInterrupt.then(function( canInterrupt ) {
  // here the value of canInterrupt will be true or false
  // depending on the previously set value
  // this value always initializes as true
});
```

## Assets
The Asset API for Enplug Player is the way to get assets previously created by Dashboard API.

### `enplug.assets.getAsset() : Promise<Object>`
Iterates through the list of asset values defined in the Dashboard part of your application for this display. Each time when called will get the next asset in the list of assets.
Returns a promise that resolves to the single asset value (an Object).

### `enplug.assets.getList() : Promise<Array<Object>>`
The getList function can be called to return an Array of all assets configured for given player.
Returns a Promise that resolves to an Array of asset value objects.

### `.enplug.assets.getTheme() : Promise<Object>`
Returns a promise that resolves to the theme (an Object) of the asset.

## Settings
The Settings API can be used to retrieve various settings that were set by the user of the Enplug Player your application is currently playing on.

### `.enplug.settings.is4k {Promise<Boolean>}`
This Promise property can be checked to know if the Enplug Player is connected to a 4K display so you can update your application accordingly, possibly with high resolution graphics or different font settings, etc.
```js
enplug.settings.is4K.then(function( is4K ) {
  // is4K will be:
  //   true when connected to a 4K display
  //   false when connected to a non-4K display
});
```

### `.enplug.settings.transitionType {Promise<String>}`
This Promise property will resolve to a String value as listed in the code sample below. This value can be referenced if you wish to match the animations used by the Enplug Player to transition between applications.

```js
enplug.settings.transitionType.then(function( type ) {
  // type will be a string and one of the following
  //  'SLIDE_LEFT'
  //  'SLIDE_RIGHT'
  //  'SLIDE_DOWN'
  //  'SLIDE_UP'
  //  'FADE'
  //  'NONE'
});
```

### `.enplug.settings.whitelabel {Promise<String>}`
Many Enplug apps show a small white label overlay at the bottom of the display. This can be customized for certain users. This property can be checked to get the value of the white label as set for given Enplug Player.

```js
enplug.settings.whitelabel.then(function( value ) {
  // here value will be a string representing the white label for this display
});
```

## Play Recorder
The Play Recorder API can be used to record how long a particular screen was shown on a display. An example would be recording how long an advertisement was displayed on screen to properly pay the screen provider.

### `.enplug.playRecorder.report( referenceId, playDuration[, additionalInfo ])`
The report function can be used to record the time that an item was displayed. The reference id is used to identify the item for which you are reporting. The play duration is a Number value representing the number of seconds the item was displayed. If you wish to store some additional information, it can be passed as a string as an optional third argument to the report function.

- **referenceId:** A unique identifier to track which asset we are recording a play time for.
- **playDuration:** A time in seconds that represents how long this item was displayed.
- **additionalInfo:** A optional string of extra information to be saved with the recorded value.

## License
This SDK is distributed under the MIT License, see [LICENSE](https://github.com/Enplug/dashboard-sdk/blob/master/LICENSE) for more information.

