import PreviousDrawingsController from "app/controllers/PreviousDrawings";
import PreviousDrawingView from "app/views/PreviousDrawings";

class PreviousDrawingsControllerMobile extends PreviousDrawingsController {
	constructor ( appModel ) {
		super( appModel, new PreviousDrawingView());
	}

	init () {
		console.log( `Previous Drawings Controlller Mobile Initialized!` );
	}
}

export default PreviousDrawingsControllerMobile;
