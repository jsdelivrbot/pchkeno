/* global KENO_GLOBALS, PCHUSER, nrvideo, $, PCH, KenoVideoAds */
import EventsMixin from "app/mixins/events";
import PchVideoPlayer from "@pch/pchvideoplayer";

let HTML5ADtag, flashADTag;
const DrawingAdView = function () {};
//vast tag variables

const getSearchParams = function ( k ) {
	const p = {};

	location.search.replace( /[?&]+([^=&]+)=([^&]*)/gi, function ( s, k, v ) {
		p[k] = v;
	});
	return k ? p[k] : p;
};

if ( KENO_GLOBALS.DEVICE_TYPE === `desktop` ) {
	HTML5ADtag = KenoVideoAds.desktop_drawing_html5 !== `undefined` && KenoVideoAds.desktop_drawing_html5 !== `` ? KenoVideoAds.desktop_drawing_html5 : `https://pubads.g.doubleclick.net/gampad/ads?sz=640x480|400x300&iu=/5499/PCHKeno_Desktop_Video&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]&ppid=[ppid]`;
	flashADTag = KenoVideoAds.desktop_drawing_flash !== `undefined` && KenoVideoAds.desktop_drawing_flash !== `` ? KenoVideoAds.desktop_drawing_flash : `https://pubads.g.doubleclick.net/gampad/ads?sz=400x300%7C640x480&iu=/5499/PCHLotto.com_Keno_Desktop_Video_FLASH&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]&ppid=[ppid]`;
} else {
	HTML5ADtag = KenoVideoAds.tablet_drawing_html5 !== `undefined` && KenoVideoAds.tablet_drawing_html5 !== `` ? KenoVideoAds.tablet_drawing_html5 : `https://pubads.g.doubleclick.net/gampad/ads?sz=400x300|640x480&iu=/5499/PCHKeno_Tablet_Video&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]&ppid=[ppid]`;
}

const updateADtag = function ( tag ) {
	let ADtag = tag;
	// replace brackets with default values

	ADtag = ADtag.replace( `[referrer_url]`, encodeURIComponent( location.href ));
	ADtag = ADtag.replace( `[description_url]`, encodeURIComponent( location.href ));
	ADtag = ADtag.replace( `[timestamp]`, Date.now());
	ADtag = ADtag.replace( `[ppid]`, PCHUSER.gmt || `` );
	// update the vast tag with params
	const urlParamObj = {};

	if ( window.PCHUSER ) {
		urlParamObj.a = PCHUSER.age || ``;
		if ( PCHUSER.gender !== `` ) {
			if ( PCHUSER.gender === `m` || PCHUSER.gender === `1` ) {
				urlParamObj.g = 1;
			} else {
				urlParamObj.g = 2;
			}
		}
		// urlParamObj.g =
		// 	PCHUSER.gender !== ``
		// 		? PCHUSER.gender === `m` || PCHUSER.gender === `1` ? `1` : `2`
		// 		: ``;
		urlParamObj.ar = PCHUSER.ageRange || ``;
		urlParamObj.seg = PCHUSER.segments || ``;
		urlParamObj.gmt = PCHUSER.gmt || ``;
		urlParamObj.level = PCHUSER.level || ``;
		urlParamObj.reglist = PCHUSER.reglist.join() || ``;
	}
	let urlParams = ``;

	urlParams =
		`a=` +
		urlParamObj.a +
		`&g=` +
		urlParamObj.g +
		`&seg=` +
		urlParamObj.seg +
		`&gmt=` +
		urlParamObj.gmt +
		`&level=` +
		urlParamObj.level +
		`&` +
		`reglist=` +
		urlParamObj.reglist;
	ADtag += `&cust_params=` + encodeURIComponent( urlParams );
	return ADtag;
};

HTML5ADtag = updateADtag( HTML5ADtag );

if ( KENO_GLOBALS.DEVICE_TYPE === `desktop` ) {
	flashADTag = updateADtag( flashADTag );
}

const timeoutDuration = 60000;

const setupParams = {
	playlist: [
		{
			file: `//cdn.pch.com/spectrum/ui/video/keno-black640.mp4`, // mp4 h264 encoded video url
			mediaid: `2UmYlr9D`
		}
	],
	adTags: {
		flashTag: flashADTag,
		html5Tag: HTML5ADtag // html5 specific ad tag
	},
	container: `jwplayer-ad`, // div ID for the container.
	device: PCH.ssoui, // optional device type. the dafault value is 'mobile' like 'desktop' or 'mobile'
	htmlFirst: true
};

Object.assign( DrawingAdView.prototype, EventsMixin, {
	EVENTS: {
		AD_END: `onAdEnd`
	},

	mount: function () {
		//console.log('drawing ad view mounted!');
	},

	unmount: function () {
		//console.log('drawing ad view unmounted!');
	},

	loadVideoPlayer: function () {
		this.jwplayerTimeout = window.setTimeout(
			this.onAdTimeout.bind( this ),
			timeoutDuration
		);

		if ( getSearchParams( `no_ad_timeout` ) !== `true` ) {
			const myjwplayer = new PchVideoPlayer( setupParams );

			nrvideo.Core.addTracker( new nrvideo.JwplayerTracker( myjwplayer.player ));
			this.JWPlayerNR = myjwplayer;

			myjwplayer.debugMode = true;

			myjwplayer.on( `adImpression`, () => {
				this.eventTracker( `Start` );
				console.log( `adImpression` );
				this.NRJWCustomEvent( `adImpression` );
				this.clearTimeout();
			});

			myjwplayer.on( `adComplete`, () => {
				this.eventTracker( `Complete` );
				console.log( `Ad Completed Callback fired!` );
				console.log( `adComplete` );
				this.NRJWCustomEvent( `adComplete` );
				this.adEndContinue();
			});

			myjwplayer.on( `noAd`, () => {
				window.clearTimeout( this.jwplayerTimeout );
				console.log( `No Ad fill` );
				this.NRJWCustomEvent( `NoAd` );
				this.adEndContinue();
			});

			myjwplayer.on( `adBlocker`, () => {
				this.eventTracker( `Error` );
				console.log( `Ad Blocker detected` );
				this.NRJWCustomEvent( `adBlocker` );
				$( `#jwplayer-ad` ).html(
					`<h2>Add Blocker Detected! Please disable to continue!</h2>`
				);
			});

			myjwplayer.on( `adSkipped`, () => {
				this.eventTracker( `adSkipped` );
				this.NRJWCustomEvent( `adSkipped` );
				this.adEndContinue();
			});
		} else {
			$( `#jwplayer-ad` ).html( `Test No Ad Timeout Scenario` );
		}
	},

	adEndContinue: function () {
		console.log( `firing ad end event!` );
		this.fireEvent( this.EVENTS.AD_END );
	},

	onAdTimeout: function () {
		this.fireEvent( this.EVENTS.AD_END );
	},

	clearTimeout: function () {
		if ( this.jwplayerTimeout ) {
			window.clearTimeout( this.jwplayerTimeout );
			this.jwplayerTimeout = null;
		}
	},

	eventTracker: function ( eventAction ) {
		// Track event
		if ( typeof window.PCHGA !== `undefined` ) {
			const url = `${location.href}`;

			window.PCHGA.trackEvent( `Keno/Video`, eventAction, url );
		}
	},

	NRJWCustomEvent: function ( e ) {
		if ( nrvideo && nrvideo.Core && nrvideo.Core.send ) {
			nrvideo.Core.send( e, {
				activeTag: this.JWPlayerNR.primary
			});
			return true;
		} else {
			return false;
		}
	}
});

export default DrawingAdView;
