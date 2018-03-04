import AdController from "app/controllers/Ad";
import AdViewMobile from "app/mobile/views/Ad";

class AdControllerMobile extends AdController {
	constructor ( appModel ) {
		super( appModel, new AdViewMobile());
	}

	init () {
		console.log( `mobile ad controller initialized` );
		this.view.addEvent(
			this.view.EVENTS.CONTINUE_SUBMIT,
			this.handleContinue.bind( this )
		);
	}
}

export default AdControllerMobile;
