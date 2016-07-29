
import eventEmitter from './lib/event-emitter';

var
  events = eventEmitter(),
  dispatch = events.dispatch;

export default events;
export { dispatch };
