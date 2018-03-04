import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import ViewFactory from "app/views/ViewFactory";
import animationUtil from "app/modules/animationUtil";

const CARD_CLASS = `kenobar__card`;
const ACTIVE_CARD_CLASS = `kenobar__card--active`;
const COMPLETE_CARD_CLASS = `kenobar__card--complete`;
const LOCKED_CARD_CLASS = `kenobar__card--locked`;

const KenoBarViewMobile = function () {};

Object.assign( KenoBarViewMobile.prototype, EventsMixin, {
	EVENTS: {
		GO_LIVE: `goLive`
	},
	init: function () {
		this.countdownView = ViewFactory.countdown();
		this.liveDrawingCountdownView = ViewFactory.countdown();
	},
	mount: function () {
		this.barRoot = $( `.keno-bar` );
		this.kenoBarCards = $( `.kenobar__cards-container` );
		this.kenoBarLiveDrawingBanner = $( `.keno-bar__live-drawing` );

		this.countdownView.mount( this.kenoBarCards, {
			animateFinalCountdown: true
		});

		this.liveDrawingCountdownView.mount( this.kenoBarLiveDrawingBanner, {
			animateFinalCountdown: true
		});

		this.isLiveBar = false;
		if ( this.countdownView.getRemainingSeconds() <= 0 ) {
			this.isLiveBar = true;
		}
		// regular bar still has time remaining, listen for its tick event and remaining time
		if ( !this.isLiveBar ) {
			this.listenForGoLiveEvent();
			this.show();
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
		} else {
			this.showLiveDrawingBar();
		}
	},
	slideDown: function ( callback ) {
		this.barRoot.show();
		animationUtil.animateFast(
			this.barRoot,
			animationUtil.ANIMS.SLIDE_IN_DOWN,
			() => {
				if ( callback ) {
					callback();
				}
			},
			true
		);
	},
	slideUp: function ( callback ) {
		animationUtil.animateFast(
			this.barRoot,
			animationUtil.ANIMS.SLIDE_OUT_UP,
			() => {
				if ( callback ) {
					callback();
				}
			},
			true
		);
	},
	show: function () {
		this.slideDown(() => {
			window.setTimeout(() => {
				this.slideUp();
			}, 4000 );
		});
	},
	unmount: function () {
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
	onCountdownTick: function ( remainingTime ) {
		if ( remainingTime <= 0 ) {
			this.fireEvent( this.EVENTS.GO_LIVE );
			this.showLiveDrawingBar();
			this.unlistenForGoLiveEvent();
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
	showLiveDrawingBar: function () {
		this.kenoBarCards.hide();
		this.kenoBarLiveDrawingBanner.show();
		this.show();
	}
});

export default KenoBarViewMobile;
