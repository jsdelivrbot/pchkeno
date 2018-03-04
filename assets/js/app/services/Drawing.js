import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";
/**
 * Represents a "/drawing/status" resource request
 */

function formatTimeStamp ( timestamp ) {
	const date = new Date( timestamp * 1000 );

	const year = date.getFullYear();
	const month = ( `0` + ( date.getMonth() + 1 )).slice( -2 ); //convert number to 2 digit format
	const day = ( `0` + date.getDate()).slice( -2 );

	const dateString = year + `-` + month + `-` + day;

	return dateString + `/` + timestamp;
}

class DrawingRequest extends KenoServiceRequest {
	constructor ( timestamp ) {
		// var resource = routesConfig.API.DRAWING_NUMBERS;
		// if (startDate && endDate) {
		//     resource += "/" + KenoServiceRequest.getDateRequestParam(startDate) + "/" + KenoServiceRequest.getDateRequestParam(endDate);
		// }
		const timestampString = formatTimeStamp( timestamp );
		const resource =
			routesConfig.API.DRAWING_NUMBERS +
			timestampString +
			`.json` +
			`?timestamp=` +
			Date.now(); //timestamp variable at end for cache busting purposes

		console.log( `starting drawing winning numbers request!`, resource );
		super( resource, METHODS.GET );
	}
}

class DrawingResponse extends KenoServiceResponse {
	get WinningNumbers () {
		if ( this.body ) {
			return this.body.WinningNumbers;
		}
	}
	get DrawingStatus () {
		if ( this.body ) {
			return this.body.Status;
		}
	}
}

/**
 * Service for handling requests for drawings related resources
 */
class DrawingService extends KenoService {
	drawingWinningNumbers ( timestamp, callback ) {
		const opts = {
			jsonFile: true
		};

		return this.doRequest(
			new DrawingRequest( timestamp ),
			callback,
			DrawingResponse,
			opts
		);
	}
}

export default DrawingService;
