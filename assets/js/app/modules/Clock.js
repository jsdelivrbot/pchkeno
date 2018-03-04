import EventsMixin from "app/mixins/events";

const IS_TICKING = Symbol( `isTicking` );
const CLOCK_OFFSET = Symbol( `clockOffset` );
const LAST_TIME = Symbol( `lastClockTime` );

function tick () {
	const now = this.now();
	const nowSeconds = Math.floor( now );

	if ( !this[LAST_TIME] || nowSeconds > this[LAST_TIME]) {
		this[LAST_TIME] = nowSeconds;
		this.fireEvent( this.EVENTS.TICK, [ nowSeconds, now ]);
	}
	requestAnimationFrame( tick.bind( this ));
}

/**
 * This represents a shared clock for the app
 * that will give you the time synced to the backend server
 * based on the offset set on it.
 * You can subscribe to tick events for each second the clock increments
 */
const Clock = Object.assign({}, EventsMixin, {
	EVENTS: {
		// tick event will fire each distinct second
		TICK: `onTick`
	},

	setClockOffset: function ( offsetSeconds ) {
		// this is the discrepancy between the client time and the server time
		this[CLOCK_OFFSET] = offsetSeconds;
	},

	getClockOffset: function () {
		return this[CLOCK_OFFSET] || 0;
	},

	/**
	 * Returns timestamp in server time, in seconds (not js milliseconds)
	 */
	now: function () {
		return Date.now() / 1000 - this.getClockOffset();
	},

	startTicking: function () {
		if ( !this[IS_TICKING]) {
			this[IS_TICKING] = true;
			tick.call( this );
		}
	}
});

export default Clock;
