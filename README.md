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
[Enplug JS Player SDK Events API](https://developers.enplug.com/api-reference/javascript-player-api/events/)

## Notifications
[Enplug JS Player SDK Notifications API](https://developers.enplug.com/api-reference/javascript-player-api/notifications/)

## Application Status
[Enplug JS Player SDK App Status API](https://developers.enplug.com/api-reference/javascript-player-api/application-status/)

## Assets
The Asset API for Enplug Player is the way to get assets previously created by Dashboard API.

### `enplug.assets.getList() : Promise<Array<Object>>`
If you wish to consume a group of assets at once the getList function can be called to return an Array of all assets configured for given player.
Returns a Promise that resolves to an Array of asset value objects.

### `enplug.assets.getNext() : Promise<Object>`
Iterates through the list of asset values defined in the Dashboard part of your application for this display. Each time when called will get the next asset in the list of assets.
Returns a promise that resolves to the single asset value (an Object).

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

