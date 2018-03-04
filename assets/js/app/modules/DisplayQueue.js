import EventsMixin from "app/mixins/events";

const DISPLAY_LIST = Symbol( `displayables` );
const CURRENT_PROMISE = Symbol( `currentDisplayable` );

/**
 * This module represents a class for queueing up
 * popups or "displayables" that should be shown in sequence.
 * Each popup will be shown one at a time in the order
 * they are added to the queue.
 * To display a popup, just enqueue your displayable function
 * and it will be shown when it is it's turn to be shown.
 */

class DisplayQueue {
	constructor () {
		this[DISPLAY_LIST] = [];
		Object.assign( this, EventsMixin, {
			EVENTS: {
				EMPTIED: `onEmpty`
			}
		});
	}

	/**
	 * Add a displayable to the queue.
	 * If the queue is currently empty, the displayable will be shown immediately
	 *
	 * @param function The Displayable should be a function that shows your popup and returns a Promise
	 *   that resolves once the popup is closed/hidden
	 * @param function callback when all displayables complete
	 */
	enqueue ( displayable, callback ) {
		this[DISPLAY_LIST].push( displayable );
		this.displayAllInSequence( callback );
	}

	/**
	 * Dequeue the next displayable and return it
	 */
	dequeue () {
		return this[DISPLAY_LIST].shift();
	}

	/**
	 * Returns current number of displayables waiting in the queue
	 * not including the one currently being shown
	 */
	count () {
		return this[DISPLAY_LIST].length;
	}

	/**
	 * Whether or not a displayable is currently being shown
	 * and waited on
	 */
	isCurrentlyDisplaying () {
		return !!this[CURRENT_PROMISE];
	}

	/**
	 * Add a one-time callback to fire the next time the queue
	 * empties out (all displayables finish showing)
	 */
	addEmptiedCallback ( callback ) {
		if ( !callback ) {
			return;
		}
		const _callback = () => {
			this.removeEvent( this.EVENTS.EMPTIED, _callback );
			callback();
		};

		this.addEvent( this.EVENTS.EMPTIED, _callback );
	}

	/**
	 * Display all the displayables in sequence
	 *
	 * @param function option callback to fire once all displayables are done
	 */
	displayAllInSequence ( callback ) {
		if ( this.count() > 0 ) {
			if ( !this.isCurrentlyDisplaying()) {
				this.displayNext( callback );
			} else {
				this.addEmptiedCallback( callback );
			}
		} else if ( callback ) {
			callback();
		}
	}

	/**
	 * Prefer calling displayAllInSequence over this
	 */
	displayNext ( callback ) {
		const displayable = this.dequeue();

		if ( displayable ) {
			const promise = displayable();

			this[CURRENT_PROMISE] = promise;
			promise
				.then(() => {
					this.displayNext( callback );
				})
				.catch( err => {
					this.displayNext( callback );
				});
		} else {
			this[CURRENT_PROMISE] = null;
			if ( callback ) {
				callback();
			}
			this.fireEvent( this.EVENTS.EMPTIED );
		}
	}
}

/**
 * A global shared display queue. This can
 * be used throughout the app for the main display
 * queue
 */
const globalDisplayQueue = new DisplayQueue();

export { globalDisplayQueue };
export default DisplayQueue;
