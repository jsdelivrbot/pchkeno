import ToastView from "app/views/Toast";
import LatestTokenActivityView from "app/views/LatestTokenActivity";
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
	show: function ( messages, user, opts ) {
		messages = messages || [];
		for ( let i = 0, n = messages.length; i < n; i++ ) {
			switch ( messages[i].type ) {
			case `tokens`:
				this.showTokensMessage( messages[i], user, opts );
				break;
			case `entry`:
				this.showContestEntry( messages[i].text );
				break;
			default:
				this.showToastMessage( messages[i]);
				break;
			}
		}
		const promise = new Promise(( resolve, reject ) => {
			resolve();
		});

		globalDisplayQueue.enqueue(() => {
			return promise;
		});
		return promise;
	},

	showToastMessage: function ( message ) {
		const toastView = new ToastView(
			`shared/generic-uninav-message.html`,
			message
		);

		globalDisplayQueue.enqueue( toastView.show.bind( toastView ));
	},

	showTokensMessage: function ( message, user, tokenCenterOpts ) {
		const view = new LatestTokenActivityView();

		globalDisplayQueue.enqueue(
			view.show.bind( view, message, user, tokenCenterOpts )
		);
	},

	showContestEntry ( amount ) {
		const view = new ToastView( `shared/entry-confirmed.html`, {
			prizeAmount: amount
		});

		globalDisplayQueue.enqueue( view.show.bind( view ));
	},
	showEventContestEntry () {
		const view = new ToastView( `shared/promotion-entry-confirmed.html` );

		globalDisplayQueue.enqueue( view.show.bind( view ));
	},
	showSweepstakesContestEntry ( amount ) {
		const view = new ToastView( `shared/entry-confirmed-sweepstakes.html`, {
			prizeAmount: amount
		});

		globalDisplayQueue.enqueue( view.show.bind( view ));
	}
};

export default UniNavMessagesView;
