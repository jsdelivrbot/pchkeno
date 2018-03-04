import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

class MatchRequest extends KenoServiceRequest {
	constructor ( timestamp ) {
		const resource = routesConfig.API.MATCHES + `/` + timestamp;

		console.log( `MatchRequest`, resource );
		//let resource = routesConfig.API.MATCHES + "/matches.json";
		super( resource, METHODS.GET );
	}
}

class MatchResponse extends KenoServiceResponse {
	get games () {
		return this.body;
	}
}

class MatchService extends KenoService {
	getMatches ( timestamp, callback ) {
		return this.doRequest( new MatchRequest( timestamp ), callback, MatchResponse );
	}
}

export default MatchService;
