import { without, includes } from "lodash";

const EventsMixin = {
	getEvents: function ( type ) {
		if ( !this._customEventHandlers ) {
			this._customEventHandlers = {};
		}
		if ( !!type ) {
			return this._customEventHandlers[this.getEventName( type )] || [];
		}
		return this._customEventHandlers;
	},

	getEventName: function ( type ) {
		return type.replace( /^on/, `` ).toLowerCase();
	},

	addEvent: function ( type, func ) {
		const evs = this.getEvents();

		type = this.getEventName( type );
		if ( evs[type] === undefined ) {
			evs[type] = [];
		}
		evs[type].push( func );
	},

	removeEvent: function ( type, fn ) {
		type = this.getEventName( type );
		const evs = this.getEvents();

		if ( evs[type] === undefined ) {
			return;
		}
		evs[type] = without( evs[type], fn );
	},

	fireEvent: function ( type, args, observersToSkip ) {
		type = this.getEventName( type );
		const evs = this.getEvents()[type];

		if ( evs === undefined ) {
			return;
		}
		let _evs = [],
			i = evs.length;

		while ( i-- ) {
			_evs[i] = evs[i];
		} // fastest for short arrays, http://jsperf.com/new-array-vs-splice-vs-slice/72
		for ( let i = 0, n = _evs.length; i < n; i++ ) {
			if ( !observersToSkip || !includes( observersToSkip, _evs[i])) {
				_evs[i].apply( null, args );
			}
		}
	}
};

export default EventsMixin;
