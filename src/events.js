
import eventEmitter from './lib/event-emitter';
import transformPipeline from './lib/event-transform';

var
  events = eventEmitter(),
  eventProcessor = transformPipeline();

function processEvent( eventName, payload, meta ) { // eslint-disable-line
  var eventData = payload;

  if ( eventProcessor.has( eventName )) {
    eventData = eventProcessor.runTransforms( eventName, payload );
  }

  events.dispatch( eventName, eventData );
}

export default events;
export { eventProcessor, processEvent };
