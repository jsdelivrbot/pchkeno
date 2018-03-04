/* global $, PCHVIP */

import PageShellView from "app/views/PageShell";
import RotateError from "@pch/pch_rotate_error";
import UniNavMessagesView from "app/mobile/views/UniNavMessages";
import KenoBarViewMobile from "app/mobile/views/KenoBar";
import TutorialView from "app/views/Tutorial";
import DailyBonus from "../../modules/dailyBonus";
import OptInLightBox from "app/views/OptInLightBox";
const PageShellViewMobile = function () {};

Object.assign( PageShellViewMobile.prototype, PageShellView.prototype, {
	init: function ( appModel ) {
		this.appModel = appModel;
		this.appModel.isLockdown = false;
		this.$rootNode = $( `#main-content` );
		// handle clicks on elements that should be pjax routed
		$( document.body ).on( `click`, `.pjax-route`, this.onNavigate.bind( this ));
		this.kenoBarView = new KenoBarViewMobile();
		this.kenoBarView.init();
		this.kenoBarView.addEvent(
			this.kenoBarView.EVENTS.GO_LIVE,
			this.onGoLive.bind( this )
		);

		RotateError.bind();

		if ( window.UniNavMessages && window.UniNavMessages.length > 0 ) {
			UniNavMessagesView.show( window.UniNavMessages );
		}

		// show daily bonus
		const enableBonus = appModel.getGlobal(
			`KENO.DAILY_TOKEN_BONUS.ENABLE_MODAL`,
			false
		);

		if ( enableBonus ) {
			appModel.globalDisplayQueue.enqueue(
				DailyBonus.show.bind( DailyBonus, appModel )
			);

			// DailyBonus.disableToast();
		}

		// Set up global email optin lightbox
		this.optIn = new OptInLightBox(
			this.appModel._data.GLOBALS.KENO.OPTIN_PAGES
		);
	},

	mount: function () {
		this.kenoBarView.mount();
		this.currentCardDataHook = $( `#current-card-data-hook` );
		const hasEvergage = this.waitOnEvergage();

		if ( hasEvergage ) {
			this.hideGTPAd();
		}
		// show VIP
		if ( this.appModel.getGlobal( `KENO.DISPLAY_VIP` ) !== false ) {
			this.showVIP();
		}
		// close vip when uninav menu opens
		$(
			`.uninav__burger, .uninav__multi-nav--tokens, .uninav__multi-nav--level`
		).on( `touchstart`, this.closeVIP.bind( this ));

		this.uniNavBurger = $( `.uninav__burger` );
		this.takeATourLink = this.findTakeATourLink();
		if ( this.takeATourLink ) {
			this.takeATourLink.on( `touchstart`, e => {
				e.preventDefault();

				this.showTutorial();
			});
		}

		if ( this.optIn.exists() && this.optIn.isEnabled( window.location.pathname )) {
			//this.optIn.show();
			this.appModel.globalDisplayQueue.enqueue(
				this.optIn.show.bind( this.optIn )
			);
		}
	},

	showTutorial: function () {
		if ( !this.tutorialView ) {
			this.tutorialView = new TutorialView();
			this.tutorialView.init();
			this.tutorialView.mount();
		}
		const controlBar = $( `.control-bar` );

		if ( controlBar ) {
			controlBar.hide();
		}

		this.tutorialView.show( false, () => {
			if ( controlBar ) {
				controlBar.show();
			}
		});
	},

	findTakeATourLink: function () {
		const uniNavMenu = $( `.uninav-nav__menu li a` );
		let takeATourLink;

		uniNavMenu.forEach( link => {
			const menuLink = $( link );

			if ( menuLink.attr( `href` ) === `/tour` ) {
				takeATourLink = menuLink;
				return;
			}
		});
		return takeATourLink;
	},

	onGoLive: function () {
		this.fireEvent( this.EVENTS.GO_LIVE );
	},

	hideGTPAd: function () {
		$( `#div-gpt-ad-keno-mobile-games` ).hide();
	},

	updateFromAppState: function ( appModel ) {
		this.kenoBarView.updateFromAppState( appModel );

		if ( !appModel._data.GLOBALS.KENO.CONTEST_ENTRIES.enableSweepsBanner ) {
			this.hideSweepstakesBanner();
		}
	},

	closeVIP: function () {
		if ( PCHVIP.controller ) {
			PCHVIP.controller.view.closeMessage();
		}
	}
});

export default PageShellViewMobile;
