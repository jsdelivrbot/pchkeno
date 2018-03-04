import Controller from "app/controllers/Controller";
import LiveDrawingView from "app/views/LiveDrawingLockdown";

class LiveDrawingLockdownController extends Controller {
	constructor ( appModel ) {
		super( appModel, new LiveDrawingLockdownView());
	}

	init () {
		this.view.init();
	}
}

export default LiveDrawingLockdownController;
