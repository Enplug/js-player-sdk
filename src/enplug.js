
import events from './events';
import notifications from './notifications';
import appStatus from './status';
import settings from './settings';
import assets from './assets';
import playRecorder from './play-recorder';

var
  enplug = {
    on: events.on,
    once: events.once,
    off: events.off,
    notifications,
    appStatus,
    settings,
    assets,
    playRecorder
  };

export default enplug;
export { notifications, appStatus, settings, assets, playRecorder };
