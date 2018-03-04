import $ from "vendor/zepto";
import ViewFactory from "app/views/ViewFactory";
import TimewasterView from "app/views/Timewaster";

const TimewasterViewMobile = function () {};

Object.assign( TimewasterViewMobile.prototype, TimewasterView.prototype, {
	init: function ( appModel ) {
		this.countdownView = ViewFactory.countdown();
		this.appModel = appModel;
	},
	mount: function () {
		this.rootNode = $( `.timewaster` );
		this.game = $( `#game` );
		this.countdownView.mount( this.rootNode, {
			animateFinalCountdown: true
		});
	},
	unmount: function () {},
	eventTracker: function ( eventAction, url, category ) {
		// Track event
		if ( typeof window.PCHGA !== `undefined` ) {
			let newUrl = ``;
			let newCategory = ``;

			// Set urldefault
			if ( typeof url !== `undefined` ) {
				newUrl = url;
			} else {
				newUrl = `${window.location.href}/card${
					this.appModel.completedCardNumber
				}`;
			}

			// Set cateogory default
			if ( typeof category !== `undefined` ) {
				newCategory = category;
			} else {
				newCategory = `Keno/Instant-Win`;
			}
			window.PCHGA.trackEvent( newCategory, eventAction, newUrl );
		}
	}
});

export default TimewasterViewMobile;
