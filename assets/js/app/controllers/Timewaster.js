import PathGamesController from "app/controllers/PathGames";
import TimewasterView from "app/views/Timewaster";
import GameService from "app/services/Game";

class TimewasterConroller extends PathGamesController {
	constructor ( appModel, view = new TimewasterView()) {
		super( appModel, view );
		this.gameService = new GameService();
	}

	init () {
		super.init();
		this.view.addEvent(
			this.view.EVENTS.UPDATE_USER_NUMBERS,
			this.handleUpdateUserNumbers.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.AD_STARTED,
			this.onPathAdStarted.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.AD_COMPLETED,
			this.onPathAdCompleted.bind( this )
		);
	}

	handleUpdateUserNumbers () {
		this.gameService.gamesPlayed( this.appModel.gameTimestampId, ( err, resp ) => {
			if ( err ) {
				return;
			}

			this.view.updateUserNumbersHTML( resp.games );
		});
	}

	onPathAdStarted () {
		this.appModel.isAdPlaying = true;
	}
	onPathAdCompleted () {
		window.KENO_GLOBALS.IS_SCRATCHCARD_AD = false;
		this.appModel.isAdPlaying = false;
	}

	route ( ctx, next ) {
		super.route( ctx, next );
	}
}

export default TimewasterConroller;
