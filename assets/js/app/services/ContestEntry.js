import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

class ContestEntryRequest extends KenoServiceRequest {
	constructor ( cardNumber ) {
		let resource = routesConfig.API.CONTEST_ENTRY;

		resource += `/` + cardNumber;

		super( resource, METHODS.POST );
	}
}

class ContestEntryResponse extends KenoServiceResponse {
	get status () {
		return this.body.success;
	}
}

/**
 * Service for handling bonus related requests
 */
class ContestEntryService extends KenoService {
	/**
	 * Submit daily bonus reward
	 *
	 * @param function Callback function that accepts Error (if failed) as first arg, or KenoServiceResponse param as second arg (for success)
	 */
	submitContestEntry ( cardNumber, callback ) {
		return this.doRequest(
			new ContestEntryRequest( cardNumber ),
			callback,
			ContestEntryResponse
		);
	}
}

export default ContestEntryService;
