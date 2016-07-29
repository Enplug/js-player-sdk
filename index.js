/*eslint-env node*/
'use strict'; //eslint-disable-line

var enplug = require( './dist/es5/enplug' );

// the named exports are doubled on the default
// so exporting just the default for node works fine
module.exports = enplug.default;
