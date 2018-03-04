import EventsMixin from "app/mixins/events";

const COMPLETE_CARDNUMBER = `completedCardNumber`;
const UNLOCKED_CARDNUMBER = `unlockedCardNumber`;
const CASHTIME = `cashTime`;
const GAME_TIMESTAMP = `gameTimestampId`;
const PREVIOUS_GAME_TIMESTAMP = `previousGameTimestampId`;
const GAME_END = `gameEnd`;
const COUNTDOWN_END = `countdownEnd`;
const CURRENT_USER = `currentUser`;
const ROUTER = `router`;
const ROUTES = `routes`;
const PJAX_WHITE = `pjaxWhitelistUrls`;
const PJAX_BLACK = `pjaxBlacklistUrls`;
const AD_PLAYING = `isAdPlaying`;
const IS_PLAYING_NEXT = `isPlayingNext`;
const GLOBALS = `GLOBALS`;
const DAILY_TOKEN_BALANCE = `dailyTokenBalance`;
const IS_SCRATCHCARD = `isScratchCard`;
const IS_LOCKDOWN = `isLockdown`;
const CURRENT_URL = `currentURL`;
const COACHING_SCREENS = `coachingEnabled`;

/**
 * AppModel
 * A shared state container for our app, the be shared across the controllers
 *
 * @param array<string> pjaxWhitelistUrls
 *   A list of urls that are whitelisted to be loaded via pjax.
 *   Controllers can update this property to add/remove urls as needed
 * @param object router
 *   The router instance
 */
class AppModel {
	constructor ( opts ) {
		this._data = Object.assign({}, opts || {});
		this._data.pjaxWhitelistUrls = this._data.pjaxWhitelistUrls || [];
		this._data.pjaxBlacklistUrls = this._data.pjaxBlacklistUrls || [];
		this.EVENTS = {
			STATE_CHANGE: `onStateChange`,
			STATE_ADD: `onStateAdded`,
			AD_COMPLETE: `onAdComplete`
		};
		Object.assign( this, EventsMixin );
	}

	_setData ( name, val ) {
		if ( !this._data[name]) {
			this._data[name] = val;
			this.fireEvent( this.EVENTS.STATE_ADD, [ name, val ]);
		} else if ( this._data[name] !== val ) {
			this._data[name] = val;
			this.fireEvent( this.EVENTS.STATE_CHANGE, [ name, val ]);
		}
	}

	set dailyTokenBalance ( num ) {
		this._setData( DAILY_TOKEN_BALANCE, num );
	}
	get dailyTokenBalance () {
		return this._data[DAILY_TOKEN_BALANCE];
	}

	set completedCardNumber ( num ) {
		this._setData( COMPLETE_CARDNUMBER, num );
	}
	get completedCardNumber () {
		return this._data[COMPLETE_CARDNUMBER];
	}

	set unlockedCardNumber ( num ) {
		this._setData( UNLOCKED_CARDNUMBER, num );
	}
	get unlockedCardNumber () {
		return this._data[UNLOCKED_CARDNUMBER];
	}

	set cashTime ( isCashTime ) {
		this._setData( CASHTIME, isCashTime );
	}
	get cashTime () {
		return this._data[CASHTIME];
	}

	set gameTimestampId ( id ) {
		this._setData( GAME_TIMESTAMP, id );
	}
	get gameTimestampId () {
		return this._data[GAME_TIMESTAMP];
	}

	set previousGameTimestampId ( id ) {
		this._setData( PREVIOUS_GAME_TIMESTAMP, id );
	}
	get previousGameTimestampId () {
		return this._data[PREVIOUS_GAME_TIMESTAMP];
	}

	set gameEnd ( endTime ) {
		this._setData( GAME_END, endTime );
	}
	get gameEnd () {
		return this._data[GAME_END];
	}

	set countdownEnd ( endTime ) {
		this._setData( COUNTDOWN_END, endTime );
	}
	get countdownEnd () {
		return this._data[COUNTDOWN_END];
	}

	set isPlayingNext ( isPlayingNext ) {
		this._setData( IS_PLAYING_NEXT, isPlayingNext );
	}
	get isPlayingNext () {
		return this._data[IS_PLAYING_NEXT];
	}

	set currentUser ( user ) {
		this._setData( CURRENT_USER, user );
	}
	get currentUser () {
		return this._data[CURRENT_USER];
	}

	set router ( router ) {
		this._setData( ROUTER, router );
	}
	get router () {
		return this._data[ROUTER];
	}

	set routes ( routes ) {
		this._setData( ROUTES, routes );
	}
	get routes () {
		return this._data[ROUTES];
	}

	set pjaxWhitelistUrls ( urls ) {
		this._setData( PJAX_WHITE, urls );
	}
	get pjaxWhitelistUrls () {
		return this._data[PJAX_WHITE];
	}

	set pjaxBlacklistUrls ( urls ) {
		this._setData( PJAX_BLACK, urls );
	}
	get pjaxBlacklistUrls () {
		return this._data[PJAX_BLACK];
	}

	set isAdPlaying ( isPlaying ) {
		const wasPlaying = this.isAdPlaying;

		this._setData( AD_PLAYING, isPlaying );
		if ( !isPlaying && wasPlaying ) {
			this.fireEvent( this.EVENTS.AD_COMPLETE );
		}
	}
	get isAdPlaying () {
		return this._data[AD_PLAYING];
	}

	// helper method to dot into global objects
	getGlobal ( key, defaultVal ) {
		const keys = ( `` + key ).split( `.` );

		if ( keys.length === 0 ) {
			return defaultVal;
		}
		let val = this._data[GLOBALS] || {};

		for ( let i = 0, n = keys.length; i < n; i++ ) {
			if ( val.hasOwnProperty( keys[i])) {
				val = val[keys[i]];
			} else {
				return defaultVal;
			}
		}
		return val;
	}

	get tokenCenter () {
		return this.getGlobal( `PCH.uniExp.tokenCenter` );
	}

	getTokenCenterGlobals () {
		return this.getGlobal( `PCH.uniExp.tokenCenterOptions`, {});
	}

	get globalDisplayQueue () {
		return this._data.globalDisplayQueue;
	}

	isUserStateMismatch ( isRecognized, gmt ) {
		return (
			this.currentUser.isRecognizedUser !== isRecognized ||
			this.currentUser.gmt !== gmt
		);
	}

	get isScratchCard () {
		return this._data.isScratchCard;
	}

	set isScratchCard ( isScratchCard ) {
		this._setData( IS_SCRATCHCARD, isScratchCard );
	}

	get isLockdown () {
		return this._data.isLockdown;
	}

	set isLockdown ( isLockdown ) {
		this._setData( IS_LOCKDOWN, isLockdown );
	}

	get coachingEnabled () {
		return this._data.coachingEnabled;
	}
	set coachingEnabled ( coachingEnabled ) {
		this._setData( COACHING_SCREENS );
	}

	set currentURL ( url ) {
		this._setData( CURRENT_URL, url );
	}

	get currentURL () {
		return this._data[CURRENT_URL];
	}
}

const factory = {
	create: function ( opts ) {
		/*
        let model = new AppModel(opts);
        let proxy = proxyFactory.createProxy(model, {
            setter: function(propName, value, prevValue) {
                if(prevValue === undefined) {
                    model.fireEvent(model.EVENTS.STATE_ADD, [propName, value]);
                }
                else {
                    model.fireEvent(model.EVENTS.STATE_CHANGE, [propName, value]);
                }
            }
        });
        return proxy;
        */
		return new AppModel( opts );
	}
};

export default factory;
