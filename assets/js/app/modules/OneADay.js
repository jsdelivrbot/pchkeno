/**
 * Class representing a once per day / device / user event.
 */
export default class OneADay {
	/**
	 * Create the run once per day checker.
	 * @param {number} uuid - This unique identifier of a user.
	 * @param {string} firstPlayKey - The key used to lookup the item in local storage.
	 * @param {number} numDays - The number of days to wait to display it again.
	 */
	constructor ( uuid = 0, firstPlayKey = `firstPlay`, numDays = 1 ) {
		this.uuid = uuid;
		this.firstPlayKey = firstPlayKey;
		this.numDays = numDays;
	}


	/**
	 * checks to see if this is the first play of the day based off a prop in local storage.
	 *
	 * @return {Promise} A promise that can be used to trigger some events, etc after resolving.
	 *                   Resolves as true if it is time to run the event, false if not.
	 */
	checkIfFirstPlay () {

		const p = new Promise(( resolve ) => {
			const lsItem = JSON.parse( localStorage.getItem( this.firstPlayKey ));
			let res = false;

			if (
					!lsItem ||
					lsItem.uuid !== this.uuid ||
					OneADay.testIsNextDate( lsItem.nextDate )
			) {
				const data = {
					uuid: this.uuid,
					nextDate: OneADay.buildNextDate( this.numDays )
				};

				localStorage.setItem( this.firstPlayKey, JSON.stringify( data ));
				res = true;
			}

			resolve( res );
		});

		return p;

	}


	/**
	 * Builds the start of the next day in unix time format (number) since epoch (January 1, 1970, 00:00:00 UTC).
	 *
	 * @example
	 * // returns 1517497956 when today is 1/31/2018
	 * buildNextDate(1);
	 *
	 * @param {number} adjustBy - The number of days to adjust the unix time value by.
	 *
	 * @return {number} The next unix time in number of seconds since epoch.
	 */
	static buildNextDate ( adjustBy ) {
		const now = new Date();

		return Math.round( now.setDate( now.getDate() + adjustBy ) / 1000.0 );
	}


	/**
	 * Tests if the current date, in unix time format (number), has passed the next date that was passed in.
	 *
	 * @example
	 * // returns true when today is 1/31/2018 (1517497956) and nextDate is 1/29/2018 (1517239407)
	 * buildNextDate(1);
	 *
	 * @example
	 * // returns false when today is 1/31/2018 (1517497956) and nextDate is 2/1/2018 (1517498837)
	 * buildNextDate(1);
	 *
	 * @param {number} nextDate - The unix time to compare to now. Use positive for future and negative for past.

	 * @return {Boolean} Returns true if nextDate has passed, false if it has not.
	 */
	static testIsNextDate ( nextDate ) {
		return Math.round( new Date().getTime() / 1000.0 ) > nextDate;
	}
}
