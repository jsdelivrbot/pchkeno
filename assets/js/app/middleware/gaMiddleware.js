import $ from "vendor/zepto";

export default function () {
	return function ( ctx, next ) {
		if ( ctx.handled && !ctx.init ) {
			// Track page view
			if ( typeof window.PCHGA !== `undefined` ) {
				window.PCHGA.setUri( window.location.href );
				window.PCHGA.trackPageView();
				window.PCHGA.trackEvent( `pageNavigation`, `click`, `EventTrigger` );
			}
			if ( typeof PCH.TAGMANAGER !== `undefined` ) {
				PCH.TAGMANAGER.utagview();
			}
		}
		next();
	};
}
