# Enplug Dashboard SDK

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
### Events
[Enplug JS Player SDK Events API](https://developers.enplug.com/api-reference/javascript-player-api/events/)

### Notifications
[Enplug JS Player SDK Notifications API](https://developers.enplug.com/api-reference/javascript-player-api/notifications/)

### Application Status
[Enplug JS Player SDK App Status API](https://developers.enplug.com/api-reference/javascript-player-api/application-status/)

### Assets
[Enplug JS Player SDK Assets API](https://developers.enplug.com/api-reference/javascript-player-api/assets/)

### Settings
[Enplug JS Player SDK Settings API](https://developers.enplug.com/api-reference/javascript-player-api/settings/)

### Play Recorder
[Enplug JS Player SDK Play Recorder API](https://developers.enplug.com/api-reference/javascript-player-api/play-recorder/)

## License
MIT License

Copyright (c) 2016 Enplug

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

