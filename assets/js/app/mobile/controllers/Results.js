import ResultsController from "app/controllers/Results";
import ResultsViewMobile from "app/mobile/views/Results";

class ResultsControllerMobile extends ResultsController {
	constructor ( appModel ) {
		super( appModel, new ResultsViewMobile());
	}

	init () {
		super.init();
		console.log( `Results Controller Mobile Initialized` );
	}
}

export default ResultsControllerMobile;
