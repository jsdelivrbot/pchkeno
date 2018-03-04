import LiveDrawingController from "app/controllers/LiveDrawing";
import LiveDrawingViewMobile from "app/mobile/views/LiveDrawing";

class LiveDrawingControllerMobile extends LiveDrawingController {
	constructor ( appModel ) {
		super( appModel, new LiveDrawingViewMobile());
		this.gameService.platform = `mobile`;
	}

	init () {
		this.view.init();
		this.view.addEvent(
			this.view.EVENTS.LOCKDOWN_MESSAGE,
			this.onLockdown.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.DRAWING_START,
			this.onDrawingStart.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.DRAWING_COMPLETE,
			this.onDrawingComplete.bind( this )
		);
		this.totals = [];
		this.unrecognizedUser = false;
		this.activeTimeStamp = this.appModel.previousGameTimestampId;
		this.gameData = [];
	}

	onDrawingStart () {
		this.appModel.isLockdown = false;
		this.appModel.previousGameTimestampId = this.activeTimeStamp;
		this.getDrawingNumbers( this.activeTimeStamp );
	}

	onDrawingComplete () {
		if ( this.view.liveDrawingTime ) {
			window.setTimeout(
				this.showGameOverScreen.bind( this, this.totals, this.gameData ),
				2000
			);
		}

		window.setTimeout(() => {
			window.location.replace( this.appModel.routes.HOME );
		}, 15000 );
	}
}

export default LiveDrawingControllerMobile;
