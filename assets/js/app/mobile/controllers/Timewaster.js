import TimewasterController from "app/controllers/Timewaster";
import TimewasterViewMobile from "app/mobile/views/Timewaster";

class TimewasterControllerMobile extends TimewasterController {
	constructor ( appModel ) {
		super( appModel, new TimewasterViewMobile());
	}

	init () {
		super.init();
	}
}

export default TimewasterControllerMobile;
