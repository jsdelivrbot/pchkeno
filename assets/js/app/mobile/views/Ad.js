import AdView from "app/views/Ad";

const AdViewMobile = function () {};

Object.assign( AdViewMobile.prototype, AdView.prototype, {
	init: function () {
		console.log( `Ad View Mobile Initialized!` );
	},
	mount: function () {
		console.log( `Ad View Mobile Mounted!` );

		window,
			setTimeout(() => {
				console.log( `fire ad continue event!` );
				this.fireEvent( this.EVENTS.CONTINUE_SUBMIT );
			}, 5000 );
		//temporary fire ad event for now until we do the actual ad implemention for mobile
	}
});

export default AdViewMobile;
