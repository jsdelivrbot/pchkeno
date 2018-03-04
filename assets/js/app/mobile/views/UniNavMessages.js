/* GLOBAL */
import { globalDisplayQueue } from "app/modules/DisplayQueue";

/**
 * View class responsible for showing the passed in message list
 * one after the other
 *
 * @param object[] An array of messages as returned from the backend UniNavMessages class
 */
const UniNavMessagesView = {
	/**
	 * Show the messages one after the other
	 *
	 * @param object[] Messages list to show as returned by the UniNavMessages backend class
	 *
	 * @return Promise a promise that will resolve once the last message has been shown and closed
	 */
	show: function ( messages ) {
		messages = messages || [];
		if ( messages.length === 0 ) {
			return;
		}

		let promiseResolve;
		const promise = new Promise( resolve => {
			promiseResolve = resolve; 
		});

		globalDisplayQueue.enqueue( function () {
			return promise; 
		});
		const _doneCallback = function () {
			promiseResolve(); 
		};

		for ( let i = 0, n = messages.length - 1; i <= n; i++ ) {
			const doneCallback = i === n ? _doneCallback : null;
			const message = messages[i];

			if ( message.type === `tokens` ) {
				window.PCH.notify.showWithMessage(
					`You've earned ` +
						message.value +
						` Tokens!<br/>` +
						message.description,
					doneCallback
				);
			} else {
				window.PCH.notify.showWithMessage( message.text, doneCallback );
			}
		}
	}
};

export default UniNavMessagesView;
