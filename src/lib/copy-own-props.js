
/**
 * Copies all "own properties" from one instance to another.
 * It does not return anything since the changes are made directly on the instance.
 *
 * @param {*} instance -- the instance to copy to
 * @param {*} superInstance -- the instance to copy from
 * @returns {undefined}
 */
export default function copyOwnProps( instance, superInstance ) {
  Object.getOwnPropertyNames( superInstance ).forEach( function( prop ) {
    var descriptor = Object.getOwnPropertyDescriptor( superInstance, prop );

    if ( descriptor ) {
      Object.defineProperty( instance, prop, descriptor );
    } else {
      instance[ prop ] = superInstance[ prop ];
    }
  });
}
