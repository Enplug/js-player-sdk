import bridge from './bridge';

// todo populate from Java?
const
  TRANSITIONS = {
    SLIDE_LEFT: 'SLIDE_LEFT',
    SLIDE_RIGHT: 'SLIDE_RIGHT',
    SLIDE_DOWN: 'SLIDE_DOWN',
    SLIDE_UP: 'SLIDE_UP',
    FADE: 'FADE',
    NONE: 'NONE'
  },
  settingsSender = bridge.senderForService('settings');

var is4KCache = null;

// settings API
export default {
  get TRANSITIONS() {
    return TRANSITIONS;
  },

  get is4K() {
    if (is4KCache != null) {
      return is4KCache;
    }

    return (is4KCache = settingsSender({
      action: 'is4K'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting is4k: ${payload && payload.value}`);
      return payload && payload.value ? payload.value : false;
    }));
  },

  get all() {
    return settingsSender({
      action: 'get-all'
    }).then(function (payload) {
      console.log('[Player SDK] Settings: Returning all settings: ' + (payload));
      return payload;
    });
  },

  // todo cache this
  // if I'm remembering right when this changes the whole player is restarted
  // so it is safe to assume this will not change at run-time
  get transitionType() {
    return settingsSender({
      action: 'transition-type'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting transition: ${payload && payload.value}`);
      return payload && payload.value ? payload.value : TRANSITIONS.NONE;
    });
  },

  hideWhitelabel() {
    return settingsSender({
      action: 'hide-whitelabel'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting hide whitelabel: ${payload && payload.success}`);
      return payload && payload.success ? payload.success : true;
    });
  },

  get whitelabel() {
    return settingsSender({
      action: 'get-whitelabel'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting whitelabel: ${payload && payload.value}`);
      return payload && payload.value ? payload.value : '';
    });
  },

  get deviceId() {
    return settingsSender({
      action: 'get-deviceid'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting deviceId: ${payload && payload.value}`);
      return payload && payload.value ? payload.value : '';
    });
  },

  get locale() {
    return settingsSender({
      action: 'get-locale'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting get-locale: ${payload && payload.value}`);
      return payload && payload.value ? payload.value : 'en';
    });
  },

  get orientation() {
    return settingsSender({
      action: 'get-orientation'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting get-orientation: ${payload && payload.value}`);
      return payload && payload.value;
    });
  },

  get zoning() {
    return settingsSender({
      action: 'get-zoning-info'
    }).then(function (payload) {
      console.log(`[Player SDK] Settings: Returning setting get-zoning-info: ${payload && payload.value}`);
      return payload && payload.value;
    });
  }
};
