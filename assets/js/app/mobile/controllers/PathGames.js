import PathGamesController from "app/controllers/PathGames";
import PathGamesView from "app/views/PathGames";

class PathGamesControllerMobile extends PathGamesController {
	constructor ( appModel ) {
		super( appModel, new PathGamesView());
	}
}

export default PathGamesControllerMobile;
