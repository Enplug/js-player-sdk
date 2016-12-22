/**
 * Web Development Player.
 * @author Michal Drewniak (michal@enplug.com)
 */

'use strict';


export default class Player {
    constructor() {

        /**
         * Mapping of message services and actions to the Player method.
         * @type {Object}
         */
        this.enplug = {
            asset: {
                'get-list': this.getList,
                'get-next': this.getNext
            }
        }

    }


    /**
     * Calls approprate Player method based on the message data.
     */
    processMessage(msg) {
        try {
            this.enplug[msg.service][msg.action].call(this, msg.token, msg.payload);
        } catch (e) {
        	console.error(e);
        	console.error('Unable to send message. Message appropriate for service name:',
        		msg.service, 'and action:', msg.action, 'not found in', this.enplug);
        }
    }


    // Assets //

    /**
     * The getList function can be called to return an Array of all assets configured for given 
     * player. 
     * @return {Promise.<Array>} - A Promise that resolves to an Array of asset value objects.
     */
    getList(token) {
        console.log('enplug.assets.getList')
    }


    /**
     * Iterates through the list of asset values defined in the Dashboard part of your application 
     * for this display. Each time when called will get the next asset in the list of assets. 
     * @return {Promise} - A Promise that resolves to the single asset value (an Object).
     */
    getNext(token) {
        console.log('enplug.assets.getNext')
    }
}