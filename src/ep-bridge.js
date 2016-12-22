/**
 * @author Michal Drewniak (michal@enplug.com)
 */

'use strict';

import Player from './player';


/**
 * A mapping of service names to appropriate player function.
 * @type {Object}
 */
const Service = {
	'get-next': 'enplug.assets.getNext',
	'get-list': 'enplug.assets.getList'
};


export default class EpBridge {
    constructor() {
    	this.player = new Player();
    }


    /**
     * Sends a request to the server.
     * @param  {Object} msg
     * @param {string} msg.action
     * @param {string} msg.service
     * @param {string} msg.token
     * @param {string} msg.payload
     */
    send(msg) {
        if (typeof msg === 'string') {
            try {
                msg = JSON.parse(msg);
            } catch (err) {
                msg = msg;
            }
        }

        console.log('Sending message: ', msg);
    	this.player.processMessage(msg);
    }
};