import Controller from "app/mobile/controllers/Controller";
import LeaderboardViewMobile from "app/mobile/views/Leaderboard";
import TokenBalanceService from "app/services/TokenBalance";

class LeaderboardControllerMobile extends Controller {
	constructor ( appModel ) {
		super( appModel, new LeaderboardViewMobile());
	}

	init () {
		console.log( `Leaderboard Controlller Mobile Initialized!` );
		this.view.addEvent(
			this.view.EVENTS.UPDATE_DAILY_TOKEN,
			this.onUpdateDailyTokenBalance.bind( this )
		);
	}
	onUpdateDailyTokenBalance () {
		const service = new TokenBalanceService();

		service.dailyTokenBalance(( err, resp ) => {
			if ( resp ) {
				this.appModel.dailyTokenBalance = resp.earned_today;
				this.view.updateFromAppState( this.appModel );
			} else {
				this.appModel.dailyTokenBalance = 0;
				this.view.updateFromAppState( this.appModel );
			}
		});
	}
}

export default LeaderboardControllerMobile;
