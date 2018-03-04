import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

class DailyTokenBalanceRequest extends KenoServiceRequest {
	constructor ( gmt, oat ) {
		super( routesConfig.API.DAILY_TOKEN_BALANCE, METHODS.GET );
	}
}

class DailyTokenBalanceResponse extends KenoServiceResponse {
	get earned_today () {
		return (
			this.body &&
			this.body.earned_today &&
			this.body.earned_today.toLocaleString()
		);
	}
}

/**
 * Service for handling bonus related requests
 */
class TokenBalanceService extends KenoService {
	/**
	 * Submit daily bonus reward
	 *
	 * @param function Callback function that accepts Error (if failed) as first arg, or KenoServiceResponse param as second arg (for success)
	 */
	dailyTokenBalance ( callback ) {
		return this.doRequest(
			new DailyTokenBalanceRequest(),
			callback,
			DailyTokenBalanceResponse
		);
	}
}

export default TokenBalanceService;
