// import $ from "vendor/zepto";
// import ChoicesView from "app/views/Choices";
// const GAME_CLASS = "choices__games__page__game";
// import renderTemplate from "app/modules/templateLoader";
import TokenLeaderboardView from "app/views/TokenLeaderboard";
import TokenLeadersView from "app/views/TokenLeaders";
import EventsMixin from "app/mixins/events";

const LeaderboardViewMobile = function () {};

Object.assign( LeaderboardViewMobile.prototype, EventsMixin, {
	EVENTS: {
		UPDATE_DAILY_TOKEN: `onUpdateDailyToken`
	},

	mount: function () {
		this.tokenLeaderboardView = new TokenLeaderboardView();

		this.tokenLeaderboardView.init();
		this.tokenLeaderboardView.mount();
		this.fireEvent( this.EVENTS.UPDATE_DAILY_TOKEN );

		this.tokenLeadersView = new TokenLeadersView();
		this.tokenLeadersView.init();
		this.tokenLeadersView.mount();
	},
	unmount: function () {
		console.log( `unmount` );
	},
	updateFromAppState ( appModel ) {
		if ( this.tokenLeaderboardView ) {
			this.tokenLeaderboardView.updateFromAppState( appModel );
		}
	}
});

export default LeaderboardViewMobile;
