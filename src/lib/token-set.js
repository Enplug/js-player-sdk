/**
 *
 * @returns {string}
 */
function createToken() {
  return Math.random().toString( 36 ).substr( 2 );
}

/**
 *
 * @returns {TokenSet}
 */
export default function tokenSetFactory() {
  const
    tokenMap = Object.create( null ),
    instance = {

      has( token ) {
        return token in tokenMap;
      },

      get( token ) {
        return tokenMap[ token ];
      },

      set( token, data ) {
        var oldData;

        if ( instance.has( token )) {
          oldData = tokenMap[ token ];
        } else {
          oldData = null;
        }

        tokenMap[ token ] = data;

        return oldData;
      },

      create( data = null ) {
        var newToken = createToken();

        while ( instance.has( newToken )) {
          newToken = createToken();
        }

        instance.set( newToken, data );

        return newToken;
      },

      delete( token ) {
        var oldData = instance.get( token ) || null;

        delete tokenMap[ token ];

        return oldData;
      },

      size() {
        return instance.keys.length;
      },

      keys() {
        return Object.getOwnPropertyNames( tokenMap );
      },

      entries() {
        return instance.keys().map( function( token ) {
          return [
            token,
            instance.get( token )
          ];
        });
      }
    };

  return instance;
};
