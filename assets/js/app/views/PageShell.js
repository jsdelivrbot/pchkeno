/* global PCHVIP, PCH, Modernizr:false */

import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import router, { compareUrl } from "app/modules/router";
import animationUtil from "app/modules/animationUtil";
import KenoBarsView from "app/views/KenoBars";
import TokenLeaderboardView from "app/views/TokenLeaderboard";
import TokenLeadersView from "app/views/TokenLeaders";
import UniNavMessagesView from "app/views/UniNavMessages";
import PageLoaderView from "app/views/PageLoader";
import SSOLightboxView from "app/views/SSOLightbox";
import OptInLightBox from "app/views/OptInLightBox";
import DailyBonus from "app/modules/dailyBonus";
import Clock from "app/modules/Clock";
import { cssClassName } from "app/modules/htmlUtil";
import { loadScripts } from "app/modules/pjax";

const PageShellView = function () {};
const MIN_LOAD_TIME = 0;

const PAGE_CLASS_RE = /page--[^\s]+/;

const PJAX_ROOT_SELECTOR = `#pjax-root`;
const ACTIVE_CLASS = `mainnav__link--active`;
const MAGICLINE_ACTIVE_CLASS = `mainnav__magicline--active`;
const LOCKDOWN_CLASS = `site--lockdown`;
const PLAYING_NEXT_CLASS = `site--playnext`;
const EG_BANNER_CLASS = `page--with-evergage-banner`;

const isEvergageShown = function ( egElem ) {
	return egElem && egElem.style.visible === `visible`;
};

/**
 * View responsible for handling the main page shell/container
 * that is not handled by the individual views for each page specific content
 *
 * The pjax elements MUST have a ".pjax-element" class AND an id attribute
 * in order for them to be properly updated on pjax requests
 */
Object.assign( PageShellView.prototype, EventsMixin, {
	EVENTS: {
		NAVIGATE: `navigate`,
		GO_LIVE: `golive`,
		UPDATE_DAILY_TOKEN: `onUpdateDailyToken`,
		SSO_LIGHTBOX_LINK_SUBMIT: `onSSOLightboxLinkSubmit`
	},

	init: function ( appModel ) {
		// store the start content, we will dispatch that when user presses back to the start page
		this.$rootNode = $( `#main-content` );

		// we need to update the active link in the navbar ourselves
		this.$navBar = $( `.mainnav__nav` );

		this.$entryBanner = $( `.entry-banner .entry-banner__img` );
		// this is the animated active link
		this.initMagicLine();
		this.appModel = appModel;
		this.appModel.isLockdown = false;

		// handle clicks on elements that should be pjax routed
		$( document.body ).on( `click`, `.pjax-route`, this.onNavigate.bind( this ));

		// this view is composed of some others
		this.kenoBarsView = new KenoBarsView();
		this.kenoBarsView.addEvent(
			this.kenoBarsView.EVENTS.GO_LIVE,
			this.onGoLive.bind( this )
		);
		this.kenoBarsView.init();
		this.kenoBarsView.mount();

		this.tokenLeaderboardView = new TokenLeaderboardView();
		this.tokenLeaderboardView.addEvent(
			this.tokenLeaderboardView.EVENTS.UPDATE_DAILY_TOKEN,
			this.onUpdateDailyToken.bind( this )
		);
		this.tokenLeaderboardView.init();
		this.tokenLeaderboardView.mount();

		this.tokenLeadersView = new TokenLeadersView();
		this.tokenLeadersView.init();
		this.tokenLeadersView.mount();

		// show daily bonus
		const enableBonus = appModel.getGlobal(
			`KENO.DAILY_TOKEN_BONUS.ENABLE_MODAL`,
			false
		);

		if ( enableBonus ) {
			appModel.globalDisplayQueue.enqueue(
				DailyBonus.show.bind( DailyBonus, appModel )
			);
		}

		// show latest token activity
		const lastActivity = appModel.getTokenCenterGlobals().lastActivity;

		if (
			( window.showLastActivity || sessionStorage.getItem( `showLastActivity` )) &&
			lastActivity
		) {
			sessionStorage.removeItem( `showLastActivity` );
			UniNavMessagesView.showTokensMessage(
				lastActivity,
				lastActivity,
				appModel.currentUser,
				appModel.getTokenCenterGlobals()
			);
		}

		// show nav messages
		if ( window.UniNavMessages && window.UniNavMessages.length > 0 ) {
			UniNavMessagesView.show(
				window.UniNavMessages,
				appModel.currentUser,
				appModel.getTokenCenterGlobals()
			);
		}

		$( `#sso-create-password-lightbox` ).on(
			`click`,
			function () {
				this.SSOLightboxView = new SSOLightboxView();
				this.SSOLightboxView.init();
				this.SSOLightboxView.mount();
				this.SSOLightboxView.showLink();
			}.bind( this )
		);

		// Set up global email optin lightbox
		this.optIn = new OptInLightBox(
			this.appModel._data.GLOBALS.KENO.OPTIN_PAGES
		);
	},

	showLoader: function () {
		if ( !this.pageLoaderView ) {
			this.pageLoaderView = new PageLoaderView();
		}
		this.pageLoaderView.show( this.$rootNode );
	},

	getPjaxNodeSelector: function () {
		return PJAX_ROOT_SELECTOR;
	},

	getPjaxUrls: function () {
		const links = [];

		this.$navBar.find( `a` ).each( function ( i, link ) {
			links.push( link.getAttribute( `href` ));
		});
		return links;
	},

	/**
	 * called by middleware that has fetched new content to render
	 *
	 * @param ctx Context the route context object that initiated the page render
	 * @param {object} response The pjax response (see the pjax.js module)
	 * @param {function} next The callback to call once rendering is done
	 */
	renderPage: function ( ctx, response, next ) {
		const timeWait =
			MIN_LOAD_TIME > 0 ? this.loadTime + MIN_LOAD_TIME - Date.now() : 0;

		if ( timeWait > 0 ) {
			setTimeout( this.renderPage.bind( this, response, next ), timeWait );
			return;
		}

		const pjaxEls = [],
			pjaxHtml = {};

		$( `<div></div>` )
			.html( response.body )
			.find( `.pjax-element` )
			.each(( i, el ) => {
				if ( el.id ) {
					pjaxEls.push( document.getElementById( el.id ));
					pjaxHtml[el.id] = el.innerHTML;
				}
			});

		// update the page title
		if ( response.title ) {
			$( `title` ).text( response.title );
		}

		// update each element, fade out, change content, fade back in
		let numDone = 0;
		const hasScripts = response.scripts && response.scripts.length > 0;

		animationUtil.animateFast( pjaxEls, animationUtil.ANIMS.FADE_OUT, el => {
			numDone++;
			const isLast = numDone >= pjaxEls.length;
			// update the element content

			el.innerHTML = pjaxHtml[el.id];
			// call next() once the last element is fade in, only if there are no scripts to load
			// if there are scripts to load, we will load those first then call next, in case the
			// view/controller class that will be mounted depends upon them
			animationUtil.animateFast(
				el,
				animationUtil.ANIMS.FADE_IN,
				isLast && !hasScripts ? next : null
			);
			// update the page content once the last element has been animated
			if ( isLast ) {
				// if we have scripts to load, load them first before returning
				if ( hasScripts ) {
					loadScripts(
						[].concat( response.scripts ),
						this.$rootNode.get( 0 ),
						() => {
							this.renderPageDone( ctx, next );
						}
					);
				} else {
					this.renderPageDone( ctx );
				}
			}
		});

		if ( this.kenoBarsView ) {
			this.kenoBarsView.hidePaytable();
		}
	},

	renderPageDone: function ( ctx, next ) {
		if ( this.pageLoaderView ) {
			this.pageLoaderView.hide();
		}
		this.setActiveLink( ctx.canonicalPath );
		this.setPageClass( ctx.canonicalPath );
		if ( next ) {
			next();
		}
	},

	// called after each route handled, this
	// is the view's opportunity to hook into any new content in the
	// page as needed
	mount: function () {
		this.currentCardDataHook = $( `#current-card-data-hook` );
		this.waitOnEvergage();
		// show VIP
		if ( this.appModel.getGlobal( `KENO.DISPLAY_VIP` ) !== false ) {
			this.showVIP();
		}

		if ( this.optIn.exists() && this.optIn.isEnabled( window.location.pathname )) {
			this.appModel.globalDisplayQueue.enqueue(
				this.optIn.show.bind( this.optIn )
			);
		}
	},

	showVIP: function () {
		if ( this._vipBootstrapped ) {
			return;
		}
		this._vipBootstrapped = true;

		if (
			PCH.uniExp.tokenCenter &&
			PCH.uniExp.tokenCenter.updateTokenBalanceCallbacks
		) {
			// we need to reserve a spot in the queue now,
			// this is a hack as this promise will resolve in the /resources/assets/js/app/modules/levelUp.js file
			let promiseResolve;
			const promise = new Promise( resolve => {
				promiseResolve = resolve;
			});

			this.appModel.globalDisplayQueue.enqueue(() => {
				return promise;
			});
			PCH.uniExp.tokenCenter.levelupQueueResolve = promiseResolve;
			if ( PCH.uniExp.tokenCenter.tokenBalanceLoaded ) {
				// balance is already loaded
				this.appModel.globalDisplayQueue.enqueue( PCHVIP.bootstrap );
				PCH.uniExp.tokenCenter.levelupQueueResolve();
				PCH.uniExp.tokenCenter.levelupQueueResolve = null;
			} else {
				// must wait for balance to load
				PCH.uniExp.tokenCenter.updateTokenBalanceCallbacks.push(() => {
					this.appModel.globalDisplayQueue.enqueue( PCHVIP.bootstrap );
					if ( PCH.uniExp.tokenCenter.levelupQueueResolve ) {
						PCH.uniExp.tokenCenter.levelupQueueResolve();
						PCH.uniExp.tokenCenter.levelupQueueResolve = null;
					}
				});
			}
		} else {
			this.appModel.globalDisplayQueue.enqueue( PCHVIP.bootstrap );
		}

		// bind listener for page visibility to fire when browser is closed and restored after drawing.
		document.addEventListener(
			`visibilitychange`,
			this.checkDrawingTime.bind( this )
		);
	},

	/**
	 * Handlers evergage, adding class to body for when banners are shown, or waiting for popup to close
	 *
	 * @return bool True if an evergage banner or popup is shown
	 */
	waitOnEvergage: function () {
		// look for evergage element in the page
		const egElem = document.querySelector( `.evergage-tooltip` );
		const isEgShown = isEvergageShown( egElem );

		// banner, just adjust position of messages via body class
		if ( egElem && !egElem.hasAttribute( `is-modal-qtip` ) && isEgShown ) {
			document.body.classList.add( EG_BANNER_CLASS );
			return isEgShown;
		}
		document.body.classList.remove( EG_BANNER_CLASS );

		// popups, we must wait for them to close before showing VIP
		// queue up our promise to resolve when evergage is done, or no evergage at all
		let promiseResolve;
		const promise = new Promise( resolve => {
			promiseResolve = resolve;
		});

		this.appModel.globalDisplayQueue.enqueue( function () {
			return promise;
		});

		// popups
		if ( !isEvergageShown( egElem )) {
			// no element, resolve immediately
			promiseResolve();
		} else {
			const egObserver = new MutationObserver( function () {
				if ( !isEvergageShown( egElem )) {
					promiseResolve();
				}
			});

			egObserver.observe( egElem, { attributes: true });
		}
		return isEgShown;
	},

	checkForEvergage: function () {
		return !!$( `.evergage-tooltip` )[0];
	},

	addEvergageToBody: function () {
		$( `body` ).addClass( `evergage` );
	},

	removeEvergageFromBody: function () {
		$( `body` ).removeClass( `evergage` );
	},

	/**
	 * A special element is returned in pjax requests that has data attributes
	 * with the current state of the gameplay
	 * These getters below provide that data which can be used to update
	 * the app state to detect changes and update views to reflect the new state
	 * accordingly
	 */
	getCurrentCardDataVal: function ( attribName ) {
		if ( this.currentCardDataHook && this.currentCardDataHook.length > 0 ) {
			return this.currentCardDataHook.attr( attribName );
		}
		return ``;
	},

	getCurrentCardDataNumVal: function ( attribName ) {
		if ( this.currentCardDataHook && this.currentCardDataHook.length > 0 ) {
			return parseInt( this.currentCardDataHook.attr( attribName ) || `0`, 10 );
		}
	},

	/**
	 * Get the last completed card number
	 */
	getCurrentCardDataCompletedNum: function () {
		return this.getCurrentCardDataNumVal( `data-completednum` );
	},

	/**
	 * Get the unlocked card number
	 * if the next card has not been unlocked yet, this will return 0
	 */
	getCurrentCardDataUnlockedNum: function () {
		return this.getCurrentCardDataNumVal( `data-unlockednum` );
	},

	/**
	 * Returns whether it is cash time or not
	 */
	getCurrentCardDataIsCashTime: function () {
		return this.getCurrentCardDataNumVal( `data-cashtime` ) > 0;
	},

	/**
	 * Returns the current game timestamp id
	 */
	getCurrentCardDataGameTimestampId: function () {
		return this.getCurrentCardDataNumVal( `data-gameid` );
	},

	/**
	 * Get the the current game end timestamp
	 */
	getCurrentCardDataGameEnd: function () {
		return this.getCurrentCardDataNumVal( `data-gameend` );
	},

	/**
	 * Get the current game countdowne end timestamp
	 */
	getCurrentCardDataCountdownEnd: function () {
		return this.getCurrentCardDataNumVal( `data-countdownend` );
	},

	/**
	 * Get whether the current game is the next set of keno cards to be played
	 * or the current drawing cards
	 */
	getCurrentCardDataIsPlayingNext: function () {
		return this.getCurrentCardDataNumVal( `data-is-playing-next` ) > 0;
	},

	getCurrentCardDataIsRecognizedUser: function () {
		return this.getCurrentCardDataNumVal( `data-user-recognized` ) > 0;
	},

	getCurrentCardDataUserGMT: function () {
		return this.getCurrentCardDataVal( `data-user-gmt` );
	},

	initMagicLine: function () {
		this.$navBarMagicLine = $( `.mainnav__magicline` );
		const activeLink = this.$navBar.find( `.` + ACTIVE_CLASS );

		this.$navBarMagicLine.width( activeLink.width());
		this.positionMagicLine( activeLink, true );
	},

	positionMagicLine: function ( linkRef, init = false ) {
		const $linkRef = $( linkRef );

		if ( $linkRef.length > 0 ) {
			this.$navBarMagicLine.css(
				Modernizr.prefixed( `transform` ),
				`translateX(` + $linkRef.position().left + `px)`
			);
			if ( init ) {
				$linkRef.addClass( ACTIVE_CLASS );
			}
		}
	},

	setActiveLink: function ( path ) {
		if ( this.$navBar ) {
			this.$navBar.find( `.` + ACTIVE_CLASS ).removeClass( ACTIVE_CLASS );
			this.$navBar.find( `a` ).each(( i, link ) => {
				if ( compareUrl( path, link.getAttribute( `href` ))) {
					const linkParent = $( link ).parent();
					// animate the magic line element, which mimics the active link styling,
					// but is separate so we can animate the position of it towards the new active class

					this.$navBarMagicLine
						.width( linkParent.width())
						.addClass( MAGICLINE_ACTIVE_CLASS );
					this.positionMagicLine( linkParent );
					// once the animation is done, set the active class on the actual link
					animationUtil.offTransitionEnd( this.$navBarMagicLine );
					animationUtil.onTransitionEnd( this.$navBarMagicLine, true, () => {
						linkParent.addClass( ACTIVE_CLASS );
						this.$navBarMagicLine.removeClass( MAGICLINE_ACTIVE_CLASS );
					});
				}
			});
		}
	},

	setPageClass: function ( path ) {
		const cname =
			`page--` + ( cssClassName( router.absUrl( path ).pathname ) || `home` );

		for ( let i = 0; i < document.body.classList.length; i++ ) {
			if ( document.body.classList[i].match( PAGE_CLASS_RE )) {
				document.body.classList.remove( document.body.classList[i]);
				break;
			}
		}
		document.body.classList.add( cname );
	},

	onNavigate: function ( ev ) {
		if ( this.appModel.isLockdown ) {
			ev.preventDefault();
		} else {
			const url = ev.target.getAttribute( `href` );

			if ( url ) {
				ev.preventDefault();
				//this.showLoader();//business requested to disable, leaving in case they change their mind
				this.loadTime = Date.now();
				this.fireEvent( this.EVENTS.NAVIGATE, [ url ]);
			}
		}
	},

	onGoLive: function () {
		this.fireEvent( this.EVENTS.GO_LIVE );
		document.body.classList.add( LOCKDOWN_CLASS );
	},

	updateFromAppState: function ( appModel ) {
		this.kenoBarsView.updateFromAppState( appModel );
		if ( !this.kenoBarsView.isLockdownTime()) {
			document.body.classList.remove( LOCKDOWN_CLASS );
		}
		if ( appModel.isPlayingNext ) {
			document.body.classList.add( PLAYING_NEXT_CLASS );
		} else {
			document.body.classList.remove( PLAYING_NEXT_CLASS );
		}
		this.tokenLeaderboardView.updateFromAppState( appModel );
		if ( !appModel._data.GLOBALS.KENO.CONTEST_ENTRIES.enableSweepsBanner ) {
			this.hideSweepstakesBanner();
		}
	},

	onUpdateDailyToken: function () {
		this.fireEvent( this.EVENTS.UPDATE_DAILY_TOKEN );
	},

	hideSweepstakesBanner: function () {
		animationUtil.animate(
			this.$entryBanner,
			animationUtil.ANIMS.FADE_OUT,
			() => {
				this.$entryBanner.hide();
			},
			true
		);
		$( `body` ).removeClass( `sweeps-banner-showing entry-banner-showing` );
		this.appModel.getGlobal(
			`KENO.CONTEST_ENTRIES`,
			{}
		).enableSweepsBanner = false;
	},

	showSweepstakesBanner: function () {
		this.$entryBanner.show();
		animationUtil.animate( this.$entryBanner, animationUtil.ANIMS.FADE_IN );
	},

	/* handler for leaving app and returning after a period of time */
	checkDrawingTime: function () {
		if ( document.visibilityState === `visible` ) {
			const now = Clock.now();
			const gameEnd = this.getCurrentCardDataGameEnd();

			if ( gameEnd - now <= 0 ) {
				location.replace( `/` );
			}
		}
	}
});

export default PageShellView;
