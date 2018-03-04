import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import AdView from "app/views/Ad";
import PathGameOverView from "app/views/GameOver";

const PathGamesView = function () {};

Object.assign( PathGamesView.prototype, EventsMixin, {
	EVENTS: {
		PATH_COMPLETED: `onPathComplete`,
		AD_STARTED: `onAdStarted`,
		AD_COMPLETED: `onPathAdComplete`,
		GOS_CONTINUE: `onGOSClose`
	},

	init: function ( appModel ) {
		this.appModel = appModel;
	},
	existsInPage () {
		return (
			true || this.rootNode.length > 0
		); /* TODO: change to real condition */
	},
	onGameOverScreenContinue: function () {
		this.fireEvent( this.EVENTS.GOS_CONTINUE );
	},
	showMonetization: function () {
		this.adView = new AdView();
		this.adView.mount();
		this.adView.addEvent(
			this.adView.EVENTS.CONTINUE_SUBMIT,
			this.onAdEnd.bind( this )
		);
	},
	onAdEnd: function () {
		this.fireEvent( this.EVENTS.AD_COMPLETED );
	},

	mount: function () {
		this.game = $( `#game` );
		this.rootNode = $( `#pathgame-card` );
	},
	showGame: function () {
		this.game.show();
	},

	unmount: function () {},

	isAdPlaying: function () {
		return $( `#pathgame-ad` ).length > 0;
	},

	getGameOverScreen ( userData ) {
		if ( !this.pathGOS ) {
			userData.name = `${userData.firstName}`;
			userData.haspass = true;

			// switch ( this.appModel.completedCardNumber ) {
			// 	case
			// }
			this.pathGOS = new PathGameOverView({
				rootNode: document.querySelector( `.pathgame__htmlgame-outer` ),
				user: userData,
				cardData: {
					cardNum: this.appModel.completedCardNumber + 1,
					cardStyle: ( this.appModel.completedCardNumber + 10 ).toString( 36 )
				}
				// },
				// winMessages: {
				// 	top: ``,
				// 	main: ``,
				// 	youScored: `You Scored!`,
				// 	bottom: ``
				// }
			});

			//bind on game close event
			this.pathGOS.addEvent(
				this.pathGOS.EVENTS.CONTINUE,
				this.onGameOverScreenContinue.bind( this )
			);
		}
		return this.pathGOS;
	},

	eventTracker: function ( eventAction, url, category ) {
		// Track event
		if ( typeof window.PCHGA !== `undefined` ) {
			let newUrl = ``;
			let newCategory = ``;

			// Set urldefault
			if ( typeof url !== `undefined` ) {
				newUrl = url;
			} else {
				newUrl = `${window.location.href}/card${
					this.appModel.completedCardNumber
				}`;
			}

			// Set cateogory default
			if ( typeof category !== `undefined` ) {
				newCategory = category;
			} else {
				newCategory = `Keno/Instant-Win`;
			}
			window.PCHGA.trackEvent( newCategory, eventAction, newUrl );
		}
	}
});

export default PathGamesView;
