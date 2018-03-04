/* */ 
"format cjs";
/**
* Pub/Sub mixin
*
* @usage
*   Object.assign(myClass.prototype, EventsMixin)
*   or, Object.assign(this, EventsMixin)
*
*   let myCallback = (arg1, arg2) => { ... }
*   myClassInstance.addEvent("foo", myCallback);
*   this.fireEvent("foo", arg1, arg2);
*/
var EventsMixin = {

    getEvents: function(type) {
        if(!this._customEventHandlers) {
            this._customEventHandlers = {};
        }
        if(!!type) {
            return this._customEventHandlers[this.getEventName(type)] || [];
        }
        return this._customEventHandlers;
    },

    getEventName: function(type) {
        return type.replace(/^on/, '').toLowerCase();
    },

    /**
    * listen to an event
    *
    * @param string the event name. Event names are normalized eg) 'onFoo', 'foo', 'onfoo' are equivalent
    * @param function The callback
    */
    addEvent: function(type, func) {
        var evs = this.getEvents();
        type = this.getEventName(type);
        if(evs[type] === undefined) { 
            evs[type] = [];
        }
        evs[type].push(func);
    },

    // alias to addEvent
    addEventListener: function() {
        return this.addEvent.apply(this, arguments);
    },

    /**
    * Stop listening to an event
    *
    * @param string the event name. Event names are normalized eg) 'onFoo', 'foo', 'onfoo' are equivalent
    * @param function The previously added listener to remove
    */
    removeEvent: function(type, fn) {
        type = this.getEventName(type);
        var evs = this.getEvents();
        if(evs[type] === undefined) { return; }

        var index = evs[type].indexOf(fn);
        if(index > -1) {
            evs[type].splice(index, 1);
        }
    },

    // alias to removeEvent
    removeEventListener: function() {
        return this.removeEventListener.apply(this, arguments);
    },

    /**
    * Fires an event send the arguments to all subscribed listeners to that event
    *
    * Any additional arguments you pass after the event name are passed to the listener callbacks
    *
    * @param string the event name. Event names are normalized eg) 'onFoo', 'foo', 'onfoo' are equivalent
    */
    fireEvent: function(type/*[, arg1[, arg2[, ...]]]*/) {
        var args = Array.prototype.slice.call(arguments, 1);
        type = this.getEventName(type);
        var evs = this.getEvents()[type];
        if(evs === undefined) { return; }
        var _evs = [], n = evs.length, i = n;
        while(i--) { _evs[i] = evs[i]; } // fastest for short arrays, http://jsperf.com/new-array-vs-splice-vs-slice/72
        for(i = 0; i < n; i++) {
            _evs[i].apply(null, args);
        }
    },

    /**
    * Attach a listener that simply refires the event on the listener object
    *
    * @param string the event name. Event names are normalized eg) 'onFoo', 'foo', 'onfoo' are equivalent
    * @param Object The target object to fire the event on
    */
    propagateEvent: function(type, obj) {
        this.addEvent(type, this.fireEvent.bind(obj, type));
    }

};

export default EventsMixin;
