

// todo write tests

/**
 * The Event Transform Pipeline can be used to run a collection of functions on some event data
 *
 * @typedef {object} EventTransformPipeline
 * @method {function} has -- takes an event name and returns true if transforms have been registered
 * @method {function} addTransform -- registers a transform function for the given event name
 * @method {function} removeTransform -- removes a transform function from the pipeline
 * @method {function} runTransforms -- takes an event name and event data, runs the transform functions returns the transformed data
 */

/**
 * @function EventTransformPipeline
 * This function returns a new pipeline instance that can be used
 * to transform data before it gets dispatched to the JavaScript App
 *
 * @returns {EventTransformPipeline}
 */
export default function() {
  var transformMap = Object.create( null );

  /**
   * Returns true if eventName is in the transformMap
   * @param eventName
   * @returns {boolean}
   */
  function hasTransform( eventName ) {
    return eventName in transformMap;
  }

  return {
    has: hasTransform,

    addTransform( eventName, transformFn ) {
      if ( !hasTransform( eventName )) {
        transformMap[ eventName ] = [];
      }

      return transformMap[ eventName ].push( transformFn ) - 1;
    },

    removeTransform( eventName, transformFn ) {
      if ( hasTransform( eventName )) {
        transformMap[ eventName ] = transformMap[ eventName ]
          .filter( func => func !== transformFn );
      }
    },

    runTransforms( eventName, eventData ) {
      if ( !hasTransform( eventName )) {
        return eventData;
      }

      return transformMap[ eventName ].reduce( function( currData, transformFn ) {
        return transformFn( currData ) || currData;
      }, Object.assign({}, eventData ));
    }
  };
}
