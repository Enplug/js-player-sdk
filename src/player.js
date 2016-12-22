/**
 * Web Development Player.
 * @author Michal Drewniak (michal@enplug.com)
 */

 'use strict';


 export default class Player() {
 	constructor() {

 		/**
 		 * Mock API.
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
 	 * 
 	 */
 	 processMessage(msg) {
 	 	this.enplug[msg.service][msg.action].call(this, msg.token, msg.payload);
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