import $ from "vendor/zepto";

const AdLoader = function ( selector ) {
	this.selector = selector;
};

Object.assign( AdLoader.prototype, {
	refreshAds: function () {
		if ( typeof headertag !== `undefined` && headertag.pubadsReady ) {
			headertag.pubads().refresh();
		}

		//console.log("-----> refresh ads");
		this.TriggerCriteoAds();
	},

	initAds: function () {
		//console.log("------> wait window load criteo");
		window.addEventListener( `load`, this.TriggerCriteoAds.bind( this ), false );
	},

	TriggerCriteoAds: function () {
		//console.log("------> trigger criteo ads");

		$( `#ad2-300x250, #ad1-728x90, #ad1-300x600` ).html( `` );

		if ( window.Criteo ) {
			this.ShowCriteoAd();
		}
	},

	ShowCriteoAd: function () {
		Criteo.DisplayAcceptableAdIfAdblocked({
			zoneid: 734944,
			containerid: `ad2-300x250`,
			overrideZoneFloor: false
		});
		Criteo.DisplayAcceptableAdIfAdblocked({
			zoneid: 735976,
			containerid: `ad1-728x90`,
			overrideZoneFloor: false
		});
		Criteo.DisplayAcceptableAdIfAdblocked({
			zoneid: 735974,
			containerid: `ad1-300x600`,
			overrideZoneFloor: false
		});
	},

	route: function ( ctx, next ) {
		if ( ctx.handled ) {
			if ( ctx.init ) {
				this.initAds();
			} else {
				this.refreshAds();
			}
		}
		next();
	}
});

function routeFactory ( domSelector ) {
	const mw = new AdLoader( domSelector );

	return mw.route.bind( mw );
}

export default routeFactory;
