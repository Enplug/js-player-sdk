
// So because of the way ES6 modules are compiled down to
// ES5 (CJS/AMD/UMD) the "default" export is not the module,
// but a property 'default' on the module export.
// To mitigate this until ES6 modules are the norm this file will
// be used as the bundled build entry point.
// it should be noted that the enplug.js file is the actual ES6 api
// this file is just a shim for current bundle tools

// note that this is only for the browserify build

import enplug from './enplug.js';

var
  {
    on,
    once,
    off,
    notifications,
    appStatus,
    settings,
    assets,
    playRecorder
  } = enplug;


export {
  on,
  once,
  off,
  notifications,
  appStatus,
  settings,
  assets,
  playRecorder
};
