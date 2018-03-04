import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import ViewFactory from "app/views/ViewFactory";
//import GameOverView from "app/views/GameOver";
import CompletedTabView from "app/views/CompletedTab";
import PathGamesView from "app/views/PathGames";
/**
 * This view handles the timewaster page
 */
const TimewasterView = function () {};

Object.assign( TimewasterView.prototype, PathGamesView.prototype, EventsMixin, {
	EVENTS: {
		UPDATE_USER_NUMBERS: `updateUserNumbers`,
		AD_STARTED: `onAdStarted`,
		AD_COMPLETED: `onPathAdComplete`,
		PATH_COMPLETED: `onPathComplete`,
		GOS_CONTINUE: `onGOSClose`
	},

	init: function ( appModel ) {
		this.countdownView = ViewFactory.countdown();
		this.appModel = appModel;
	},

	mount: function () {
		// nav links to change platform
		this.rootNode = $( `.timewaster` );
		this.game = $( `#game` );
		this.countdownView.mount( this.rootNode, {
			animateFinalCountdown: true
		});
		this.completedTabViews = [];

		$( `.card-tab--completed ul.card-tab__completed__nums` ).forEach( el => {
			const completedTabView = new CompletedTabView();

			completedTabView.mount( el );
			this.completedTabViews.push( completedTabView );
		});

		this.fireEvent( this.EVENTS.UPDATE_USER_NUMBERS );
	},

	unmount: function () {
		this.rootNode = null;
		this.countdownView.unmount();
		this.completedTabViews.forEach( view => {
			view.unmount();
		});
	},
	isAdPlaying: function () {
		return $( `#pathgame-ad` ).length > 0;
	},
	updateUserNumbersHTML: function ( games ) {
		games.forEach(
			function ( game, index ) {
				const numbers = game.Picks;

				this.completedTabViews[index].processNumbersHTML( numbers );
			}.bind( this )
		);
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

export default TimewasterView;
