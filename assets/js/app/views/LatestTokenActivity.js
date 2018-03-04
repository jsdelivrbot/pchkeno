import ToastView from 'app/views/Toast';
import EventsMixin from 'app/mixins/events';

const TPL_NAME = `shared/latest-token-activity.html`;

const LatestTokenActivityView = function () {};

Object.assign( LatestTokenActivityView.prototype, EventsMixin, {
	EVENTS: {},

	/**
	 * Show token activity
	 *
	 * @param Object|string The activity, either a raw string/html message, or an object with these params:
	 *   type: string "cash", or "tokens"
	 *   value: int
	 *   description: string
	 * @param Object The PCH user object
	 * @param Object Additional options/data including
	 *   redeemUrl: string
	 *   historyUrl: string
	 */
	show: function ( activity, user, opts ) {
		const data = {};

		if ( typeof activity === `object` ) {
			Object.assign( data, activity );
		} else {
			data.message = activity;
		}
		data.user = user || {};
		data.userName = data.user.firstName || data.user.fullName;
		data.redeemUrl = opts.redeemUrl || ``;
		data.historyUrl = opts.historyUrl || ``;

		const view = new ToastView( TPL_NAME, data );

		return view.show();
	},

	showTokensAwarded: function ( amount, description, user, opts ) {
		return this.show(
			{ type: `tokens`, value: amount, description: description },
			user,
			opts
		);
	}
});

// static convenience method
LatestTokenActivityView.showTokensAwarded = function (
	amount,
	description,
	user,
	opts
) {
	const view = new LatestTokenActivityView();

	return view.showTokensAwarded( amount, description, user, opts );
};

export default LatestTokenActivityView;
