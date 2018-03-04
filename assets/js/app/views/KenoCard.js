/* global KENO_GLOBALS */
import $ from "vendor/zepto";
import ToastView from "app/views/Toast";
import { random } from "lodash";
import EventsMixin from "app/mixins/events";
import KenoCardTabView from "app/views/KenoCardTab";
import ViewFactory from "app/views/ViewFactory";
import KenoIntroView from "app/views/KenoIntro";
import ChoicesView from "app/views/Choices";
import HomeGlitchView from "app/views/HomeGlitch";
import ButtonView from "app/views/Button";
import renderTemplate from "app/modules/templateLoader";
import animationUtil from "app/modules/animationUtil";
import CoachingLightBox from "app/views/CoachingLightBox";
import coachingMessages from "app/config/coaching-messages";
import SSOLightboxView from "app/views/SSOLightbox";
import UniNavMessagesView from "app/views/UniNavMessages";
import IdleMessageLightbox from "app/mobile/views/IdleMessage";

const UNLOCK_ANIM_CLASS = `card--unlocking`;
const UNLOCK_ANIM_DONE_CLASS = `cardplay--unlocked`;
const SELECTED_CLASS = `card__number--selected`;
const SUBMIT_DISABLED_CLASS = `card__controls__btn--disabled`;

//Delay for idle message
const IDLE_MESSAGE_SECONDS = 30000;

//how long to idle message for -
const IDLE_MESSAGE_SHOW_FOR = 10000;

/**
 * This view class represents a playable Keno Card.
 * It is composed of other sub-views to handle other sections like the card tabs listing to the side
 * This view handles the events to select/deselect numbers and submit the card
 */
const KenoCardView = function () {};

Object.assign( KenoCardView.prototype, EventsMixin, {
	EVENTS: {
		SUBMIT: `submit`,
		GLITCH_SUBMIT: `glitchSubmit`,
		CHOICE_SELECT: `choiceSelect`,
		UPDATE_USER_NUMBERS: `updateUserNumbers`,
		SSO_LIGHTBOX_SUBMIT: `SSOLightboxSubmit`
	},

	init: function ( appModel ) {
		this.selectedNumbers = new Set();
		this.tabView = new KenoCardTabView();
		this.countdownView = ViewFactory.countdown();
		this.introView = new KenoIntroView();
		this.choicesView = new ChoicesView();

		this.glitchView = new HomeGlitchView();
		this.entryConfirmed = $( `.entry-confirmed` );

		this.tabView.addEvent(
			this.tabView.EVENTS.UNLOCK_ANIM_OUT,
			this.animateUnlock.bind( this )
		);
		this.tabView.addEvent(
			this.tabView.EVENTS.UNLOCK_ANIM_RESET,
			this.animateUnlockReset.bind( this )
		);
		this.tabView.addEvent(
			this.tabView.EVENTS.UNLOCK_ANIM_DONE,
			this.animateUnlockDone.bind( this )
		);
		this.tabView.addEvent(
			this.tabView.EVENTS.UPDATE_USER_NUMBERS,
			this.updateUserNumbers.bind( this )
		);
		this.introView.addEvent(
			this.introView.EVENTS.REVEALED,
			this.onIntroReveal.bind( this )
		);
		this.introView.addEvent(
			this.introView.EVENTS.OUT_ANIM_START,
			this.onIntroOut.bind( this )
		);
		this.choicesView.addEvent(
			this.choicesView.EVENTS.CHOICE_SELECT,
			this.onGameChoiceSelect.bind( this )
		);
		this.glitchView.addEvent(
			this.glitchView.EVENTS.SUBMIT,
			this.onGlitchSubmit.bind( this )
		);
		this._onCountdownTick = this.onCountdownTick.bind( this );

		this.globalDisplayQueue = appModel.globalDisplayQueue;
		this.appModel = appModel;

		this.coaching = new CoachingLightBox();
		this.idleMessage = new IdleMessageLightbox( true );
	},

	// called after each route handled, this
	// is the view's opportunity to hook into any new content in the
	// page as needed
	mount: function ( ctx ) {
		this.rootNode = $( `.cardplay` );
		this.gameTimestampId = parseInt( this.rootNode.attr( `data-gameid` ), 10 );
		this.cardNumber = parseInt( this.rootNode.attr( `data-cardnum` ), 10 );
		this.numToSelect = parseInt( this.rootNode.attr( `data-numbers` ), 10 );

		this.cardRootNode = $( `.card` );
		this.cardRootNode.on(
			`click`,
			`.card__number`,
			this.onNumberClicked.bind( this )
		);
		this.cardRootNode.on(
			`click`,
			`.card__controls__btn--clear`,
			this.onClear.bind( this )
		);
		this.cardRootNode.on(
			`click`,
			`.card__controls__btn--quick`,
			this.onQuickPick.bind( this )
		);
		this.submitBtn = this.cardRootNode.find( `.card__controls__btn--submit` );
		this.submitBtn.on( `click`, this.onSubmit.bind( this ));

		const tabShadows = this.cardRootNode.hasClass( `card--withshadow` );

		this.tabView.mount( ctx, tabShadows );

		this.countdownView.mount( this.rootNode );
		if ( KENO_GLOBALS.IS_PLAYING_NEXT ) {
			this.countdownView.hide();
		}

		this.introView.mount( ctx );
		this.choicesView.mount( ctx );
		this.glitchView.mount( ctx );

		this.entryConfirmedWrapper = $( `.kenobar__paytable__drawer` );
		this.submitEntryContainer = $( `.submit-entry-confirmed-slider-container` );
		this.submitEntryWrapper = $( `.submit-entry-confirmed-slider` );

		this.entryBannerContest = $( `.entry-banner-contest` );

		// wait for display queue to clear before running animations
		if ( this.globalDisplayQueue.isCurrentlyDisplaying()) {
			this.globalDisplayQueue.addEmptiedCallback( this.startAnims.bind( this ));
		} else {
			this.startAnims();
		}

		// check the countdown timer for if we have enough time left to play a choice game
		if (
			!this.choicesView.hasEnoughTimeToPlay(
				this.countdownView.getRemainingSeconds()
			)
		) {
			this.onChoicesOutOfTime();
		} else {
			this.addTickListener();
		}

		this.idleTimeout = this.setIdleTimeout();

		this.numberRange = null;
		this.idleMessageShowing = false;

		// Coaching screens
		if ( this.appModel.completedCardNumber > 0 && !this.isShownChoices()) {
			this.coaching.show(
				coachingMessages.default.msg,
				coachingMessages.default.top,
				coachingMessages.default.left
			);
		}
	},

	unmount: function ( ctx ) {
		if ( this.cardRootNode ) {
			this.cardRootNode.off( `click` );
		}
		if ( this.submitBtn ) {
			this.submitBtn.off( `click` );
		}

		this.cardRootNode = null;
		this.submitBtn = null;
		this.selectedNumbers.clear();
		this.numberRange = null;

		this.tabView.unmount( ctx );
		this.removeTickListener();
		this.countdownView.unmount();
		this.introView.unmount( ctx );
		this.choicesView.unmount( ctx );
		this.glitchView.unmount( ctx );
		clearTimeout( this.idleTimeout );
		this.isSubmitDisabled = false;
		this.idleMessageShowing = false;
		this.coaching.hideLightbox();
	},
	setIdleTimeout: function () {
		return window.setTimeout(() => {
			this.showIdleMessage();
		}, IDLE_MESSAGE_SECONDS );
	},
	/* clear idletimeout and hide idle message, reset idle timer */
	clearIdleTimeout: function () {
		this.idleMessage.hideLightbox();
		this.idleMessageShowing = false;
		clearTimeout( this.idleTimeout );
		this.idleTimeout = this.setIdleTimeout();
	},
	showIdleMessage: function () {
		this.idleMessage.show(
			coachingMessages.idleMessage.msg,
			coachingMessages.idleMessage.top,
			coachingMessages.idleMessage.left,
			coachingMessages.idleMessage.class,
			`#main-content`
		);
		this.idleMessageShowing = true;

		this.idleMessageShowTimeout = window.setTimeout(() => {
			this.clearIdleTimeout();
		}, IDLE_MESSAGE_SHOW_FOR );
	},
	showCreatePasswordLightbox: function () {
		this.SSOLightboxView = new SSOLightboxView();
		this.SSOLightboxView.mount();
		this.SSOLightboxView.addEvent(
			this.SSOLightboxView.EVENTS.SSO_LIGHTBOX_SUBMIT,
			this.handleSSOLightBoxSubmit.bind( this )
		);
		this.SSOLightboxView.showSubmit();
	},
	handleSSOLightBoxSubmit: function () {
		this.SSOLightboxView.hide();
		this.fireEvent( this.EVENTS.SSO_LIGHTBOX_SUBMIT, [
			this.gameTimestampId,
			this.cardNumber,
			Array.from( this.selectedNumbers.values())
		]);
		//now fire the submit event to the controller since user has successfully created a password
	},
	updateUserNumbers: function () {
		this.fireEvent( this.EVENTS.UPDATE_USER_NUMBERS );
	},
	updateUserNumbersHTML: function ( games ) {
		this.tabView.updateUserNumbersHTML( games );
	},

	startAnims: function () {
		if ( !this.introView.hasIntro() && !this.glitchView.hasError()) {
			this.tabView.runAnimation();
		} else {
			this.introView.runAnimation( 2000 );
		}
	},

	onSubmit: function ( ev ) {
		if ( this.isSubmitDisabled ) {
			return;
		}
		ev.preventDefault();
		if ( this.hasSelectedAllNumbers()) {
			this.fireEvent( this.EVENTS.SUBMIT, [
				this.gameTimestampId,
				this.cardNumber,
				Array.from( this.selectedNumbers.values())
			]);

			this.eventTracker( `Submit` );
			//this.showSweepstakesEntryConfirmed();
			//this.showSubmitEntryConfirmed();
		} else {
			this.$oops = this.$oops || $( renderTemplate( `shared/kenocard-oops.html` ));
			document.body.appendChild( this.$oops.get( 0 ));
			this.$oops.modal({
				backdrop: false
			});
		}
	},
	onDuplicateNumbers: function () {
		this.$oopsDuplicate =
			this.$oopsDuplicate ||
			$( renderTemplate( `shared/kenocard-oops-duplicate.html` ));
		document.body.appendChild( this.$oopsDuplicate.get( 0 ));

		this.$oopsDuplicate.modal({
			backdrop: false
		});
	},

	onClear: function ( ev ) {
		if ( ev ) {
			ev.preventDefault();
		}
		this.cardRootNode.find( `.` + SELECTED_CLASS ).removeClass( SELECTED_CLASS );
		this.selectedNumbers.clear();
		this.disableSubmitBtn();
		this.coaching.show(
			coachingMessages.default.msg,
			coachingMessages.default.top,
			coachingMessages.default.left
		);
	},

	disableSubmit: function () {
		this.isSubmitDisabled = true;
		ButtonView.disableForSubmitPending( this.submitBtn );
		if ( this.choicesView && this.choicesView.isShown()) {
			this.choicesView.disableSubmit();
		}
	},

	enableSubmit: function () {
		this.isSubmitDisabled = false;
		ButtonView.enableFromSubmitPending( this.submitBtn );
		if ( this.choicesView.isShown()) {
			this.choicesView.enableSubmit();
		}
	},

	disableSubmitBtn: function () {
		this.submitBtn.addClass( SUBMIT_DISABLED_CLASS );
	},

	enableSubmitBtn: function () {
		this.submitBtn.removeClass( SUBMIT_DISABLED_CLASS );
	},

	getNumberRange: function () {
		if ( this.numberRange === null ) {
			this.numberRange = [
				parseInt(
					this.cardRootNode
						.find( `.card__number:first-child` )
						.attr( `data-number` ),
					10
				),
				parseInt(
					this.cardRootNode
						.find( `.card__number:last-child` )
						.attr( `data-number` ),
					10
				)
			];
		}
		return this.numberRange;
	},

	getCardNumber: function () {
		return this.cardNumber;
	},

	getGameTimestampId: function () {
		return this.gameTimestampId;
	},

	onQuickPick: function ( ev ) {
		if ( this.isSubmitDisabled ) {
			return;
		}
		this.onClear( ev );
		const range = this.getNumberRange();
		const randomNum = random.bind( null, range[0], range[1]);
		let num;

		for ( let i = 0; i < this.numToSelect; i++ ) {
			do {
				num = randomNum();
			} while ( this.selectedNumbers.has( num ));
			this.selectedNumbers.add( num );
			this.cardRootNode
				.find( `.card__number[data-number="` + num + `"]` )
				.addClass( SELECTED_CLASS );
		}
		this.enableSubmitBtn();
		this.eventTracker( `QuickPick` );
		this.coaching.show(
			coachingMessages.submit.msg,
			coachingMessages.submit.top,
			coachingMessages.submit.left
		);
	},

	onNumberClicked: function ( ev ) {
		ev.preventDefault();
		this.handleNumberClicked( ev );

		if ( this.selectedNumbers.size >= this.numToSelect ) {
			this.coaching.show(
				coachingMessages.submit.msg,
				coachingMessages.submit.top,
				coachingMessages.submit.left
			);
		} else {
			this.coaching.show(
				coachingMessages.default.msg,
				coachingMessages.default.top,
				coachingMessages.default.left
			);
		}
	},
	handleNumberClicked: function ( ev ) {
		let $targ = $( ev.target );

		$targ = $targ.hasClass( `.card__number` )
			? $targ
			: $targ.parents( `.card__number` );
		if ( $targ.length === 0 ) {
			return;
		}
		const num = parseInt( $targ.attr( `data-number` ), 10 );

		// deselect the number
		if ( this.selectedNumbers.has( num )) {
			this.selectedNumbers.delete( num );
			$targ.removeClass( SELECTED_CLASS );
			this.disableSubmitBtn();
		} else if ( !this.hasSelectedAllNumbers()) {
			// select tje number
			this.selectedNumbers.add( num );
			$targ.addClass( SELECTED_CLASS );
			if ( this.hasSelectedAllNumbers()) {
				this.enableSubmitBtn();
			}
		}
	},

	hasSelectedAllNumbers: function () {
		return this.selectedNumbers.size >= this.numToSelect;
	},

	animateUnlock: function () {
		this.cardRootNode.addClass( UNLOCK_ANIM_CLASS );
	},

	animateUnlockDone: function () {
		this.rootNode.addClass( UNLOCK_ANIM_DONE_CLASS );
	},

	animateUnlockReset: function () {
		this.cardRootNode.removeClass( UNLOCK_ANIM_CLASS );
		this.rootNode.removeClass( UNLOCK_ANIM_DONE_CLASS );
	},

	onIntroOut: function () {
		this.tabView.runAnimation();
	},

	onIntroReveal: function () {
		this.rootNode.removeClass( `cardplay--intro` );
	},

	addTickListener: function () {
		this.countdownView.addEvent(
			this.countdownView.EVENTS.TICK,
			this._onCountdownTick
		);
	},

	removeTickListener: function () {
		this.countdownView.removeEvent(
			this.countdownView.EVENTS.TICK,
			this._onCountdownTick
		);
	},

	onCountdownTick: function ( remainingSeconds ) {
		if (
			this.choicesView &&
			this.choicesView.isShown() &&
			!this.choicesView.hasEnoughTimeToPlay( remainingSeconds )
		) {
			this.onChoicesOutOfTime();
			this.removeTickListener();
		}
	},

	onChoicesOutOfTime: function () {
		if (
			this.choicesView &&
			this.choicesView.isShown() &&
			!KENO_GLOBALS.IS_PLAYING_NEXT
		) {
			this.choicesView.showOutOfTimeOverlay();
		}
	},

	onGlitchSubmit: function () {
		if ( !this.isSubmitDisabled ) {
			this.fireEvent( this.EVENTS.GLITCH_SUBMIT );
		}
	},

	onGameChoiceSelect: function ( choiceId ) {
		if ( !this.isSubmitDisabled ) {
			this.fireEvent( this.EVENTS.CHOICE_SELECT, [ choiceId ]);
		}
	},

	showSweepstakesEntryConfirmed: function () {
		UniNavMessagesView.showSweepstakesContestEntry( `$10 Million` );
	},
	showPromotionEntryConfirmed: function ( imgPath, textContent ) {
		let onClose = null,
			view = null;

		const promise = new Promise( resolve => {
			view = new ToastView( `shared/promotion-entry-confirmed.html`, {
				imgPath: imgPath,
				textContent: textContent
			});
			onClose = () => {
				view.removeEvent( view.EVENTS.CLOSED, onClose );
				resolve();
			};

			view.addEvent( view.EVENTS.CLOSED, onClose );
			view.show();
		});

		return promise;
	},
	hidePromotionEntryBanner: function () {
		animationUtil.animate(
			this.entryBannerContest,
			animationUtil.ANIMS.FADE_OUT,
			() => {
				this.entryBannerContest.hide();
			}
		);
		$( `body` ).removeClass( `entry-banner-showing sweeps-banner-showing` );
	},

	hideEntryConfirmed: function () {
		animationUtil.animate(
			this.entryConfirmedWrapper,
			animationUtil.ANIMS.SLIDE_OUT_DOWN,
			function () {
				this.entryConfirmed.appendTo( document.body );
				this.entryConfirmed.hide();
				this.submitEntryContainer.hide();
			}.bind( this )
		);
	},

	showSubmitEntryConfirmed: function () {
		this.submitEntryContainer.show();
		animationUtil.animateFast(
			this.submitEntryWrapper,
			animationUtil.ANIMS.SLIDE_IN_UP,
			function () {
				window.setTimeout(
					function () {
						this.hideSubmitEntryConfirmed();
					}.bind( this ),
					2000
				);
			}.bind( this ),
			true
		);
	},

	hideSubmitEntryConfirmed: function () {
		animationUtil.animateFast(
			this.submitEntryWrapper,
			animationUtil.ANIMS.SLIDE_OUT_DOWN,
			function () {}.bind( this )
		);
	},

	eventTracker: function ( eventAction ) {
		// Track event
		if ( typeof window.PCHGA !== `undefined` ) {
			const url = `${window.location.href}card${this.appModel
				.completedCardNumber + 1}`; // start the card at 1

			window.PCHGA.trackEvent( `Keno`, eventAction, url );
		}
	},
	isShownChoices: function () {
		const rootNode = $( `.choices__games` );

		return !!rootNode && rootNode.length > 0;
	}
});

export default KenoCardView;
