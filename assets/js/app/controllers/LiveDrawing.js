/* global PCHUSER */

import Controller from "app/controllers/Controller";
import LiveDrawingView from "app/views/LiveDrawing";
import GameService from "app/services/Game";
import DrawingService from "app/services/Drawing";
import MatchService from "app/services/Match";
//import DrawingService from "app/services/Drawing";

class LiveDrawingController extends Controller {
	constructor ( appModel, view = new LiveDrawingView()) {
		super( appModel, view );
		this.gameService = new GameService();
		this.drawingService = new DrawingService();
		this.matchService = new MatchService();
	}

	init () {
		this.view.init( this.drawingNumbers, this.appModel );

		this.view.addEvent(
			this.view.EVENTS.LOCKDOWN_MESSAGE,
			this.onLockdown.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.DRAWING_COMPLETE,
			this.onDrawingComplete.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.GLITCH_MESSAGE,
			this.onGlitch.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.DRAWING_START,
			this.onDrawingStart.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.GET_USER_DATA,
			this.onGetUserData.bind( this )
		);
		this.unrecognizedUser = false;
		this.activeTimeStamp = ``;
		this.gameData = [];
		this.totals = [];

		if ( PCHUSER.type === `Guest` ) {
			this.unrecognizedUser = true;
		}
	}

	onDrawingComplete () {
		//only show Game Over Screen for Live drawing, not latest
		if ( this.view.liveDrawingTime ) {
			window.setTimeout(
				this.showGameOverScreen.bind( this, this.totals, this.gameData ),
				2000
			);
		}

		this.gameService.game(( err, resp ) => {
			if ( err ) {
				return;
			}
			// response returned a new game instance, update the app model
			const game = resp.firstGame;

			if ( game && game.game !== this.appModel.gameTimestampId ) {
				this.appModel.completedCardNumber = 0; // reset to first card
				this.appModel.unlockedCardNumber = 1;
				this.appModel.cashTime = !!game.cash;
				this.appModel.gameTimestampId = game.game;
				this.appModel.gameEnd = game.end_timestamp;
				this.appModel.countdownEnd = game.countdown_end_timestamp;
				this.gameData = [];
			}
		});
	}

	showGameOverScreen ( totals, gameData ) {
		//tell view to show Game Over Screen
		this.view.showGameOverScreen( totals, gameData );
	}

	onGetUserData () {
		this.getUserPlayedGames();
	}
	onDrawingStart () {
		this.appModel.isLockdown = false;
		this.appModel.previousGameTimestampId = this.activeTimeStamp;

		this.getDrawingNumbers( this.activeTimeStamp );
	}

	getDrawingNumbers ( timestamp ) {
		//put into correct date format to pull json file from storage directory
		this.drawingService.drawingWinningNumbers( timestamp, ( err, resp ) => {
			if ( resp.DrawingStatus === `Completed` ) {
				this.view.glitch = false;
				this.getUserPlayedGames( timestamp, () => {
					this.view.startDrawingAnimation( resp.WinningNumbers );
				});
			} else if (
				resp.DrawingStatus === `NotStarted` ||
				resp.DrawingStatus === `Delayed`
			) {
				if ( !this.view.glitch ) {
					this.onGlitch();
				}

				window.setTimeout(() => {
					if ( this.view.mounted ) {
						//don't keep checking for drawing numbers if user has left this page
						this.getDrawingNumbers( timestamp );
					}
				}, 10000 );
			} else {
				//drawing failed, show maintenance message
				this.view.showMaintenanceMessage();
			}
		});
	}
	getUserPlayedGames ( timestamp, callback ) {
		if ( !this.unrecognizedUser ) {
			let timestamp;

			if ( this.view.lockdown ) {
				//we are in lockdown, use current gamestamp
				timestamp = this.appModel.gameTimestampId;
			} else {
				//we are in latest/live drawing and in next time period so use previous timestamp
				timestamp = this.appModel.previousGameTimestampId;
			}
			this.gameService.gamesPlayed( timestamp, ( err, resp ) => {
				if ( err ) {
					callback();
				} else {
					this.gameData = resp.games;
					if ( resp.body.totals ) {
						this.totals.cashTotal = resp.body.totals.cash;
						this.totals.tokenTotal = resp.body.totals.tokens;
					}
					this.view.updateGetUserPlayedGames( resp.games );
					callback( resp.games );
				}
			});
		} else {
			callback();
		}
	}

	onLockdown () {
		if ( this.view.liveDrawingTime ) {
			//use current game timestamp since we are in live drawing
			this.appModel.isLockdown = true;
			this.activeTimeStamp = this.appModel.gameTimestampId;
		} else {
			this.activeTimeStamp = this.appModel.previousGameTimestampId;
		}

		this.getUserPlayedGames(
			this.activeTimeStamp,
			function ( gameData ) {
				this.gameData = gameData;
				this.view.onLockDownMessage( this.appModel, gameData );
			}.bind( this )
		);
	}

	onGlitch () {
		this.view.glitch = true;
		this.view.onLockDownMessage( this.appModel, this.gameData );
	}
}

export default LiveDrawingController;
