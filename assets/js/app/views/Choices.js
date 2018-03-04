import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import animationUtil from "app/modules/animationUtil";
import ButtonView from "app/views/Button";
import CoachingLightBox from "app/views/CoachingLightBox";
import coachingMessages from "app/config/coaching-messages";

const GAME_CLASS = `choices__games__page__game`;

/**
 * This view handles the choices between keno cards
 */
const ChoicesView = function () {};

Object.assign( ChoicesView.prototype, EventsMixin, {
	EVENTS: {
		CHOICE_SELECT: `choiceSelect`
	},

	init: function () {},

	mount: function () {
		this.rootNode = $( `.choices__games` );
		this.minPlayTimeRequired =
			parseInt( this.rootNode.attr( `data-minplaytime` ), 10 ) || 0;
		this.screensContainer = this.rootNode.find( `.choices__games__pages` );

		this.rootNode.on(
			`click`,
			`.` + GAME_CLASS + `--playable`,
			this.onChoiceSelect.bind( this )
		);

		// Coaching screens
		if ( this.isShown()) {
			const coaching = new CoachingLightBox();

			coaching.show(
				coachingMessages.instantWin.msg,
				coachingMessages.instantWin.top,
				coachingMessages.instantWin.left,
				coachingMessages.instantWin.class,
				`#main-content`
			);
		}
	},

	unmount: function () {
		if ( this.rootNode ) {
			this.rootNode.off( `click` );
			this.rootNode = null;
		}
		this.screensContainer = null;
		this.selectedChoiceButton = null;

		if ( this.isShown()) {
			coaching.hide();
		}
	},

	isShown: function () {
		return !!this.rootNode && this.rootNode.length > 0;
	},

	// show time out overlay when not enough time to place a game
	showOutOfTimeOverlay: function () {
		if ( !this.rootNode || this.rootNode.length === 0 ) {
			return;
		}
		const overlay = $( `.choices__notime` ).addClass( `choices__notime--active` );

		animationUtil.animateFast( overlay, animationUtil.ANIMS.FADE_IN, null, true );
		animationUtil.animateFast(
			this.rootNode,
			animationUtil.ANIMS.FADE_OUT,
			null,
			true
		);
	},

	onChoiceSelect: function ( e ) {
		e.preventDefault();
		if ( this.isSubmitDisabled ) {
			return;
		}
		const $targ = $( e.target ).closest( `.` + GAME_CLASS );

		this.selectedChoiceButton = $targ.find( `.btn` );
		const choiceId = parseInt(
			this.selectedChoiceButton.attr( `data-choiceid` ),
			10
		);

		this.fireEvent( this.EVENTS.CHOICE_SELECT, [ choiceId ]);
	},

	//returns whether user has enough time to play a path
	hasEnoughTimeToPlay: function ( remainingSeconds ) {
		return (
			remainingSeconds > 0 && remainingSeconds >= this.getMinTimeRequired()
		);
	},

	getMinTimeRequired: function () {
		return this.minPlayTimeRequired || 0;
	},

	setMinTimeRequired: function ( minSecondsRemaining ) {
		this.minPlayTimeRequired = minSecondsRemaining;
	},

	disableSubmit: function () {
		this.isSubmitDisabled = true;
		if ( this.selectedChoiceButton ) {
			ButtonView.disableForSubmitPending( this.selectedChoiceButton );
		}
	},

	enableSubmit: function () {
		this.isSubmitDisabled = false;
		if ( this.selectedChoiceButton ) {
			ButtonView.enableFromSubmitPending( this.selectedChoiceButton );
		}
	}
});

export default ChoicesView;
