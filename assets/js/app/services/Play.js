import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

/**
 * Represents a game play submission request
 */
class PlayRequest extends KenoServiceRequest {
	constructor ( gameTimestamp, cardNum, pickedNumbers ) {
		super( routesConfig.API.CARDPLAY_SUBMIT, METHODS.POST, {
			game: gameTimestamp,
			card_number: cardNum,
			numbers: ( pickedNumbers || []).join( `,` )
		});
	}
}

class MoveNextRequest extends KenoServiceRequest {
	constructor ( gameTimestamp ) {
		super( routesConfig.API.MOVE_NEXT, METHODS.POST, {
			game: gameTimestamp
		});
	}
}

class SelectChoiceRequest extends KenoServiceRequest {
	constructor ( gameTimestamp, choiceId ) {
		super( routesConfig.API.SELECT_CHOICE, METHODS.POST, {
			game: gameTimestamp,
			choice_id: choiceId
		});
	}
}

class CompleteChoiceRequest extends KenoServiceRequest {
	constructor ( gameTimestamp, pathId ) {
		super( routesConfig.API.COMPLETE_CHOICE, METHODS.POST, {
			game: gameTimestamp,
			path_id: pathId
		});
	}
}

class UserPlayTimesRequest extends KenoServiceRequest {
	constructor ( platform, dateVal ) {
		let resource = routesConfig.API.USER_PLAY_TIMES;

		resource = resource.replace(
			`[DATE]`,
			KenoServiceRequest.getDateRequestParam( dateVal, false )
		);
		resource = resource.replace( `[PLATFORM]`, platform );
		super( resource, METHODS.GET );
	}
}

/**
 * Represents a game play submission response (successful)
 */
class PlayResponse extends KenoServiceResponse {
	get nextUrl () {
		if ( this.body.next ) {
			let nextUrl = this.body.next.match( /^(\/\/|http)/ )
				? this.body.next
				: `/` + this.body.next.replace( /^\//, `` );

			if ( nextUrl === `/index` ) {
				nextUrl = `/`;
			}
			return nextUrl;
		}
		return null;
	}

	get contestEntryStatus () {
		if ( this.body.contest_entry && this.body.contest_entry.success ) return true;
		return false;
	}

	get contestEntryTokens () {
		if ( this.body.contest_entry && this.body.contest_entry.tokens ) {
			return this.body.contest_entry.tokens[0].tokens;
		}
	}

	get showLastActivity () {
		if ( this.body.showLastActivity ) {
			return this.body.showLastActivity;
		}
		return false;
	}
	get eventContestEntry () {
		if (
			this.body.event_contest_entry &&
			this.body.event_contest_entry.success
		) {
			return true;
		}
		return false;
	}

	get showfirstCardBonusEntry () {
		if (
			this.body.firstCardBonusEntry &&
			this.body.firstCardBonusEntry.success
		) {
			return true;
		}
		return false;
	}

	get firstCardBonusDescription () {
		if (
			this.body.firstCardBonusEntry &&
			this.body.firstCardBonusEntry.description
		) {
			return this.body.firstCardBonusEntry.description;
		}
		return ``;
	}

	get firstCardBonusTokens () {
		if ( this.body.firstCardBonusEntry && this.body.firstCardBonusEntry.tokens ) {
			return this.body.firstCardBonusEntry.tokens;
		}
		return 0;
	}
}

/**
 * Represents a successful user play times request response
 */
class UserPlayTimesResponse extends KenoServiceResponse {
	/**
	 * parses the response and returns just a flat array of only times that were played, eg [1200,2400,...]
	 *
	 * @return int[]
	 */
	get playedTimes () {
		// {"0":{"time":0},"1200":{"time":1200,"hasPlayed":true},"2400":{"time":2400,"hasPlayed":true}, ...
		const playTimes = [];

		if ( this.body && typeof this.body === `object` ) {
			for ( const i in this.body ) {
				if ( this.body.hasOwnProperty( i ) && this.body[i].hasPlayed ) {
					playTimes.push( parseInt( this.body[i].time, 10 ));
				}
			}
		}
		return playTimes;
	}
}

/**
 * Service for handling requests for plays related resources
 */
class PlayService extends KenoService {
	/**
	 * Saves the game play
	 *
	 * @param int the game timestamp
	 * @param int the card number
	 * @param int[] the array of selected numbers
	 * @param function Callback function that accepts Error (if failed) as first arg, or PlayResponse param as second arg (for success)
	 */
	play ( gameInstanceId, cardNum, pickedNumbers, callback ) {
		return this.doRequest(
			new PlayRequest( gameInstanceId, cardNum, pickedNumbers ),
			callback,
			PlayResponse
		);
	}

	/**
	 * Moves to the next element in the path and returns a response with that next element
	 *
	 * @param int the game timestamp
	 * @param function Callback function that accepts Error (if failed) as first arg, or PlayResponse param as second arg (for success)
	 */
	moveNext ( gameInstanceId, callback ) {
		return this.doRequest(
			new MoveNextRequest( gameInstanceId ),
			callback,
			PlayResponse
		);
	}

	/**
	 * Submit choice selection
	 *
	 * @param int the game timestamp id
	 * @param int choice id
	 * @param function callback function thtat accepts Error (if failed) as first arg, or KenoServiceResponse as second arg (for success)
	 */
	selectChoice ( gameInstanceId, choiceId, callback ) {
		return this.doRequest(
			new SelectChoiceRequest( gameInstanceId, choiceId ),
			callback,
			PlayResponse
		);
	}

	/**
	 * Complete choice/path selection
	 *
	 * @param int the game id
	 * @param int path id
	 * @param function callback function thtat accepts Error (if failed) as first arg, or KenoServiceResponse as second arg (for success)
	 * */
	completeChoice ( gameInstanceId, pathId, callback ) {
		return this.doRequest(
			new CompleteChoiceRequest( gameInstanceId, pathId ),
			callback,
			PlayResponse
		);
	}

	/**
	 * Get the user played times for a given day
	 *
	 * @param string platform "app", or "desktop"
	 * @param string|Date the selected date
	 * @param function callback function that accepts Error (if failed) as first arg, or UserPlayTimesResponse as second arg (for success)
	 * @param object Additional request options (see Service base class for general options available)
	 */
	getUserPlayTimes ( platform, dateVal, callback, opts ) {
		this.doRequest(
			new UserPlayTimesRequest( platform, dateVal ),
			callback,
			UserPlayTimesResponse,
			opts
		);
	}
}

export { PlayRequest, PlayResponse };
export default PlayService;
