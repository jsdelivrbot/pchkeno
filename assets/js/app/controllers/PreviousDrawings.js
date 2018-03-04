import Controller from "app/controllers/Controller";
import PreviousDrawingView from "app/views/PreviousDrawings";
import DrawingService from "app/services/Drawing";
import GameService from "app/services/Game";

class PreviousDrawingsController extends Controller {
	constructor ( appModel ) {
		super( appModel, new PreviousDrawingView());
	}

	init () {
		this.view.init( this.drawingNumbers );
		this.view.addEvent( this.view.EVENTS.AD_END, this.onAdEnd.bind( this ));
		this.view.addEvent(
			this.view.EVENTS.DATE_CLICK,
			this.onDateClick.bind( this )
		);
		this.drawingService = new DrawingService();
		this.gameService = new GameService();
		this.activeTimeStamp = ``;
	}
	formatTimeStampHoursMinutes ( timestamp ) {
		const date = new Date( timestamp * 1000 );

		let hours = date.getHours();
		const minutes = ( `0` + date.getMinutes()).slice( -2 );
		const ampm = hours < 12 ? `AM` : `PM`;

		if ( hours > 12 ) {
			hours = hours % 12; //convert from 24 to 12 hour
		}
		if ( hours == 0 ) {
			hours = 12;
		}

		return hours + `:` + minutes + ` ` + ampm + ` ET`;
	}

	onDateClick () {
		console.log( `on date click!` );
		this.activeTimeStamp = this.view.getActiveTimestamp();
		this.getUserPlayedGames( this.activeTimeStamp, () => {});
		const currentDrawTime = this.view.getActiveDisplayTime();

		this.view.updateDrawingTime( currentDrawTime );
	}

	onAdEnd () {
		this.getDrawingNumbers( this.activeTimeStamp );
	}
	getDrawingNumbers ( timestamp ) {
		//put into correct date format to pull json file from storage directory
		this.drawingService.drawingWinningNumbers( timestamp, ( err, resp ) => {
			if ( err ) {
				console.log( err );
			} else if ( resp.DrawingStatus === `Completed` ) {
				this.view.glitch = false;
				this.view.showDrawing( resp.WinningNumbers );
			} else {
					//show maintenance message
				this.view.showMaintenanceMessage( this.appModel.cashTime );
			}
		});
	}
	getUserPlayedGames ( timestamp, callback ) {
		console.log( `get user played games called`, timestamp );
		this.gameService.gamesPlayed( timestamp, ( err, resp ) => {
			if ( err ) {
				console.log( err );

				callback();
			} else {
				console.log( `getUserPlayedGames Reponse: `, resp.games );
				this.gameData = resp.games;

				this.view.updateSideMatches( resp.games );
				callback( resp.games );
			}
		});
	}
	startDrawing ( drawingNumbers ) {
		console.log( `start drawing`, drawingNumbers );

		this.view.showDrawing( drawingNumbers );
	}
}

export default PreviousDrawingsController;
