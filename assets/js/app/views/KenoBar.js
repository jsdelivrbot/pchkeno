import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import ViewFactory from "app/views/ViewFactory";

const LIVE_CLASS = `kenobar--live`;
const CARD_CLASS = `kenobar__card`;
const ACTIVE_CARD_CLASS = `kenobar__card--active`;
const COMPLETE_CARD_CLASS = `kenobar__card--complete`;
const LOCKED_CARD_CLASS = `kenobar__card--locked`;

/**
 * This view handles the keno bar
 */
const KenoBarView = function () {};

Object.assign( KenoBarView.prototype, EventsMixin, {
	EVENTS: {
		GO_LIVE: `goLive`
	},

	init: function () {
		this.countdownView = ViewFactory.countdown();
	},

	mount: function ( rootNode ) {
		// nav links to change platform
		this.barRoot = $( rootNode );

		// for the regular (ie. non LIVE bar), listen for it to tick down to 0
		// so we can fire the GO_LIVE event
		if ( this.barRoot.hasClass( LIVE_CLASS )) {
			this.isLiveBar = true;
		}

		this.countdownView.mount( this.barRoot, { animateFinalCountdown: true });

		// regular bar still has time remaining, listen for its tick event and remaining time
		if ( !this.isLiveBar ) {
			this.listenForGoLiveEvent();

			this.unlockedCardNumber =
				parseInt(
					this.barRoot.find( `.` + ACTIVE_CARD_CLASS ).attr( `data-cardnum` ),
					10
				) || 0;
			this.completedCardNumber = 0;
			this.barRoot.find( `.` + COMPLETE_CARD_CLASS ).each(( i, el ) => {
				const num = parseInt( $( el ).attr( `data-cardnum` ), 10 ) || 0;

				if ( num > this.completedCardNumber ) {
					this.completedCardNumber = num;
				}
			});
		}
	},

	unmount: function () {
		if ( this.barRoot ) {
			this.barRoot.off( `click` );
			this.barRoot = null;
		}
		if ( this.countdownView ) {
			this.countdownView.unmount();
		}
	},

	listenForGoLiveEvent: function () {
		if ( this.countdownView.getRemainingSeconds() > 0 ) {
			this._onCountdownTickCallback = this.onCountdownTick.bind( this );
			this.countdownView.addEvent(
				this.countdownView.EVENTS.TICK,
				this._onCountdownTickCallback
			);
		} else {
			// regular bar already past its countdown, so fire the GO_LIVE event now
			this.onCountdownTick( 0 );
		}
	},

	unlistenForGoLiveEvent: function () {
		if ( this._onCountdownTickCallback ) {
			this.countdownView.removeEvent(
				this.countdownView.EVENTS.TICK,
				this._onCountdownTickCallback
			);
			this._onCountdownTickCallback = null;
		}
	},

	onCountdownTick: function ( remainingTime ) {
		if ( !this.isLiveBar && remainingTime <= 0 ) {
			this.fireEvent( this.EVENTS.GO_LIVE );
			this.unlistenForGoLiveEvent();
		}
	},

	hide: function () {
		this.barRoot.css( `display`, `none` );
	},

	unhide: function () {
		this.barRoot.css( `display`, `` );
	},

	updateFromAppState: function ( appModel ) {
		// update the active card
		if (
			!this.isLiveBar &&
			( appModel.completedCardNumber !== this.completedCardNumber ||
				appModel.unlockedCardNumber !== this.unlockedCardNumber )
		) {
			this.updateActiveCardNum(
				appModel.completedCardNumber,
				appModel.unlockedCardNumber
			);
		}
		// update countdown timer
		if (
			this.isLiveBar &&
			this.countdownView.getExpiresTime() !== appModel.gameEnd
		) {
			this.countdownView.resetExpiration( appModel.gameEnd );
		} else if (
			!this.isLiveBar &&
			this.countdownView.getExpiresTime() !== appModel.countdownEnd
		) {
			this.countdownView.resetExpiration( appModel.countdownEnd );
			this.unlistenForGoLiveEvent();
			this.listenForGoLiveEvent();
		}
	},

	updateActiveCardNum: function ( completedCardNumber, unlockedCardNumber ) {
		this.completedCardNumber = completedCardNumber;
		this.unlockedCardNumber = unlockedCardNumber;
		this.barRoot.find( `.` + CARD_CLASS ).each(( i, el ) => {
			const $el = $( el );
			const cardNum = parseInt( $el.attr( `data-cardnum` ), 10 );

			if ( cardNum <= completedCardNumber ) {
				$el
					.removeClass( ACTIVE_CARD_CLASS + ` ` + LOCKED_CARD_CLASS )
					.addClass( COMPLETE_CARD_CLASS );
			} else if ( cardNum === unlockedCardNumber ) {
				$el
					.removeClass( COMPLETE_CARD_CLASS + ` ` + LOCKED_CARD_CLASS )
					.addClass( ACTIVE_CARD_CLASS );
			} else {
				$el
					.removeClass( COMPLETE_CARD_CLASS + ` ` + ACTIVE_CARD_CLASS )
					.addClass( LOCKED_CARD_CLASS );
			}
		});
	},

	hasRemainingTime: function () {
		return this.countdownView.getRemainingSeconds() > 0;
	}
});

export default KenoBarView;
