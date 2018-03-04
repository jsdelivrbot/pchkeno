import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

/**
 * Represents a "/game/unrecognizeduser" resource request
 */
class UnrecognizedUserRequest extends KenoServiceRequest {
	constructor () {
		super( routesConfig.API.GAME_UNRECOGNIZED_USER, METHODS.GET );
	}
}

/**
 * Represents a "/game/current" resource request
 */
class GameRequest extends KenoServiceRequest {
	constructor () {
		super( routesConfig.API.CURRENT_GAME, METHODS.GET );
	}
}

class NextGameRequest extends KenoServiceRequest {
	constructor () {
		super( routesConfig.API.NEXT_GAME, METHODS.GET );
	}
}

class GamesPlayedRequest extends KenoServiceRequest {
	constructor ( timestamp ) {
		const resource = routesConfig.API.MATCHES + `/` + timestamp;

		console.log( `GamesPlayedRequest`, resource );
		//let resource = routesConfig.API.MATCHES + "/matches.json";
		super( resource, METHODS.GET );
	}
}

class GamesPlayedRequestMobile extends KenoServiceRequest {
	constructor ( timestamp ) {
		const resource = routesConfig.API.MATCHES + `/` + timestamp + `/mobile`;

		console.log( `GamesPlayedRequest`, resource );
		//let resource = routesConfig.API.MATCHES + "/matches.json";
		super( resource, METHODS.GET );
	}
}

/**
 * Represents a game/unrecognizeduser response
 */
class UnrecognizedUserResponse extends KenoServiceResponse {
	get playSubmissionData () {
		if ( this.body ) {
			if ( typeof this.body === `object` ) {
				return this.body;
			} else {
				try {
					return JSON.parse( this.body );
				} catch ( e ) {
					return null;
				}
			}
		}
		return null;
	}
}

/**
 * Represents a response from a "/game" resource request
 */
class GameResponse extends KenoServiceResponse {
	constructor ( body, statusCode ) {
		super( body, statusCode );

		let bodyData = this.body;

		if ( typeof bodyData === `string` ) {
			try {
				bodyData = JSON.parse( bodyData );
			} catch ( e ) {
				bodyData = [];
			}
		}

		if ( Array.isArray( bodyData )) {
			this.games = bodyData;
		} else if ( typeof bodyData === `object` ) {
			this.games = [ bodyData ];
		} else {
			this.games = [];
		}
	}

	get firstGame () {
		return this.games[0];
	}
}

/**
 * Represents a response from "/game/matches" response
 */
class GamesPlayedResponse extends KenoServiceResponse {
	constructor ( body, statusCode ) {
		super( body, statusCode );

		const bodyData = this.body;

		if ( Array.isArray( bodyData.cards )) {
			this.games = bodyData.cards;
		} else if ( typeof bodyData.cards === `object` ) {
			this.games = [ bodyData.cards ];
		} else {
			this.games = [];
		}
	}
	get firstGame () {
		return this.games[0];
	}
}

/**
 * Service for handling games related resource requests
 */
class GameService extends KenoService {
	/**
	 * Returns the currently active game instance id and details for it
	 *
	 * @param function Callback function that accepts Error (if failed) as first arg, or GameResponse param as second arg (for success)
	 */
	unrecognizedUserGame ( callback ) {
		return this.doRequest(
			new UnrecognizedUserRequest(),
			callback,
			UnrecognizedUserResponse
		);
	}

	game ( callback ) {
		return this.doRequest( new GameRequest(), callback, GameResponse );
	}

	gamesPlayed ( timestamp, callback ) {
		if ( this.platform === `mobile` ) {
			return this.doRequest(
				new GamesPlayedRequestMobile( timestamp ),
				callback,
				GamesPlayedResponse
			);
		} else {
			return this.doRequest(
				new GamesPlayedRequest( timestamp ),
				callback,
				GamesPlayedResponse
			);
		}
	}

	/**
	 * Returns the next game dates (start, end, etc) after the current active game
	 */
	nextGame ( callback ) {
		return this.doRequest( new NextGameRequest(), callback, GameResponse );
	}

	/**
	 * Returns a list of active game instances for the date range specified
	 *
	 * @param string|Date The start date, if it is a Date instance it will be formatted, otherwise it is expected to be formatted correctly already
	 * @param string|Date the end date, if it is a Date instance it will be formatted, otherwise it is expected to be formatted correctly already
	 * @param function Callback function that accepts Error (if failed) as first arg, or KenoServiceResponse param as second arg (for success)
	 */
	games ( startDate, endDate, callback ) {
		return this.doRequest(
			new GamesRequest( startDate, endDate ),
			callback,
			GameResponse
		);
	}
}

export default GameService;
