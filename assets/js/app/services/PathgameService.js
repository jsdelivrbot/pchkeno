import GameService, {
	GameServiceRequest,
	GameServiceResponse
} from "@pch/path-gamemanager-js/GameService";
import { KenoServiceRequest } from "app/services/Service";

class PathgameService extends GameService {
	constructor ( baseUrl ) {
		super();
		this.baseUrl = baseUrl;
	}

	// @override
	getFullResourceUrl ( req ) {
		const tpl = this.baseUrl.split( `?` );

		console.log( this.baseURL );
		tpl[0] =
			tpl[0].replace( /\/$/, `` ) + `/scratch-card/{event}/{itemID}/{token}`;
		console.log( `tpl`, tpl );
		return GameService.buildServiceUri( tpl.join( `` ), req.params );
	}

	// @override
	start ( jToken, gameId, gameData, serviceData, callback ) {
		return this.startItem( gameId, serviceData.token, callback );
	}

	// @override
	end ( jToken, gameId, gameData, serviceData, callback ) {
		return this.endItem( gameId, jToken, callback );
	}

	startItem ( itemId, securityToken, callback ) {
		//console.log("---------> start", arguments);
		const req = new GameServiceRequest( `startItem`, {
			itemID: itemId,
			token: securityToken,
			_token: KenoServiceRequest.csrfToken
		});

		req.jsonPosts = false;
		//req.timeout = 10000;
		return this.doRequest( req, callback, PathgameServiceResponse ); // eslint-disable-line no-use-before-define
	}

	endItem ( itemId, securityToken, callback ) {
		const req = new GameServiceRequest( `endItem`, {
			itemID: itemId,
			token: securityToken,
			_token: KenoServiceRequest.csrfToken
		});

		req.jsonPosts = false;
		req.timeout = 10;
		return this.doRequest( req, callback, PathgameServiceResponse ); // eslint-disable-line no-use-before-define
	}
}

class PathgameServiceResponse extends GameServiceResponse {
	get securityToken () {
		return (
			this.body && this.body.data && this.body.data.security_token ||
			this.body.security_token
		);
	}

	// @override
	isErrorResponse () {
		const isError = super.isErrorResponse();

		return isError || this.body && this.body.error === true;
	}

	get pathHasMoreGames () {
		return this.body && this.body.path && this.body.path.status === `progress`;
		//return this.body && this.body.path && this.body.path.status !== "completed";
	}

	get pathCanBePlayedAgain () {
		return this.body && this.body.path && this.body.path.status !== `finished`;
	}
}

export { PathgameServiceResponse };
export default PathgameService;
