import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

/**
 * Represents a "/game/unrecognizeduser" resource request
 */
class DailyBonusCreditRequest extends KenoServiceRequest {
	constructor () {
		super( routesConfig.API.DAILY_BONUS_CREDIT, METHODS.POST );
	}
}

/**
 * Represents a game play submission response (successful)
 */
class DailyBonusCreditResponse extends KenoServiceResponse {
	get message () {
		return this.body[0] && this.body[0].message || ``;
	}

	get tokens () {
		return this.body[0] && this.body[0].tokens || 0;
	}
}

/**
 * Service for handling bonus related requests
 */
class BonusService extends KenoService {
	/**
	 * Submit daily bonus reward
	 *
	 * @param function Callback function that accepts Error (if failed) as first arg, or KenoServiceResponse param as second arg (for success)
	 */
	dailyBonusCredit ( callback ) {
		return this.doRequest(
			new DailyBonusCreditRequest(),
			callback,
			DailyBonusCreditResponse
		);
	}
}

export default BonusService;
