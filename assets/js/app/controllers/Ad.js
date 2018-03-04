import Controller from "app/controllers/Controller";
import AdView from "app/views/Ad";
import PlayService from "app/services/Play";
import routesConfig from "app/config/routes";

class AdController extends Controller {
	constructor ( appModel, view = new AdView()) {
		super( appModel, view );
		this.playService = new PlayService();
	}

	init () {
		this.view.addEvent(
			this.view.EVENTS.CONTINUE_SUBMIT,
			this.handleContinue.bind( this )
		);
	}

	route ( ctx, next ) {
		super.route( ctx, next );
		this.appModel.isAdPlaying = true;
	}

	exitRoute ( ctx, next ) {
		this.appModel.isAdPlaying = false;
		this.hasPendingContinue = false;
		super.exitRoute( ctx, next );
	}

	handleContinue () {
		if ( !this.isActive || this.hasPendingContinue ) {
			return;
		}
		this.appModel.isAdPlaying = false;
		this.hasPendingContinue = true;
		this.playService.moveNext( this.appModel.gameTimestampId, ( err, resp ) => {
			this.hasPendingContinue = false;
			if ( !this.isActive ) {
				// user has since been navigated to another page
				return;
			}
			if ( err ) {
				this.showGenericError();
			} else if ( resp.nextUrl ) {
				this.navigate( resp.nextUrl );
			} else {
				// shouldnt get here, but just fallback to going back to homepage
				this.navigate( routes.HOME );
			}
		});
	}
}

export default AdController;
