/* global PCHUSER */
import EventsMixin from "app/mixins/events";
import DrawingView from "app/views/Drawing";
import animUtil from "app/modules/animationUtil";
import Clock from "app/modules/Clock";
import ViewFactory from "app/views/ViewFactory";
import $ from "vendor/zepto";
import renderTemplate from "app/modules/templateLoader";
import LiveDrawingAdView from "app/views/DrawingAd";

/**
 * This view class represents the Live Drawings Page
 
 */
const LiveDrawingView = function () {};

const getSearchParams = function ( k ) {
	const p = {};

	location.search.replace( /[?&]+([^=&]+)=([^&]*)/gi, function ( s, k, v ) {
		p[k] = v;
	});
	return k ? p[k] : p;
};

Object.assign( LiveDrawingView.prototype, EventsMixin, {
	EVENTS: {
		DRAWING_COMPLETE: `onDrawingComplete`,
		LOCKDOWN_MESSAGE: `onLockdown`,
		GLITCH_MESSAGE: `onGlitch`,
		SHOW_AD: `onShowAd`,
		DRAWING_START: `onDrawingStart`,
		GET_USER_DATA: `onGetUserData`
	},

	init: function () {
		this.countdownView = ViewFactory.countdown();

		this.drawingView = new DrawingView();
		this.drawingView.init();
		this.adView = new LiveDrawingAdView();

		this.adShowing = false;
		this.adShown = false;
		this.drawingAnimationShowing = false;
		this.unrecognizedUser = false;
		this.playKenoSideButtonShowing = true;
		this.drawingView.addEvent(
			this.drawingView.EVENTS.DRAWING_ANIM_COMPLETE,
			this.onDrawingAnimComplete.bind( this )
		);
		this.adView.addEvent( this.adView.EVENTS.AD_END, this.onAdEnd.bind( this ));
	},

	mount: function ( ctx ) {
		this.drawingView.mount( ctx, `/js/json/winningnumbers.json` );
		this.adView.mount( ctx );
		this.rootNode = document.querySelector( `.drawing--live` );
		this.adShowing = false;
		this.adShown = false;
		this.messageShowing = false;
		this.drawingAnimationShowing = false;
		this.lockdown = false;
		this.glitch = false;
		this.liveDrawingTime = false;
		this.isLatestDrawing = false;
		this.mounted = true;
		this.title = document.querySelector( `.live-drawing__banner__title` );
		this.bannerTimeContainer = document.querySelector(
			`.live-drawing__banner__time`
		);
		this.bannerTime = document.querySelector(
			`#live-drawing__banner__time--hours-minutes`
		);
		this.bannerTimezone = document.querySelector(
			`.live-drawing__banner__timezone`
		);
		this.playKenoSideBarButton = document.querySelector(
			`.live-drawing__play-keno`
		);
		this.lockdownContainer = document.getElementById( `live-drawing__lockdown` );
		this.adContainer = document.getElementById( `live-drawing-ad-container` );
		this.sideMatches = document.getElementById( `drawing__side-game-matches` );
		this.numberPad = document.getElementById( `drawing__number-pad` );
		this.unrecognizedOverlay = document.getElementById( `unrecognized-overlay` );
		//needs to be toggled based on timing or url parameter
		if ( this.rootNode ) {
			this.drawingTime = parseInt(
				this.rootNode.getAttribute( `data-drawtime` ) || `0`,
				10
			);
			if ( this.drawingTime > 0 ) {
				this.addClockListener();
			}
		}

		if ( PCHUSER.type === `Guest` ) {
			this.unrecognizedUser = true;
			this.drawingView.updateSideMatches();
		}

		if ( getSearchParams( `glitch` ) === `true` ) {
			this.glitch = true;
			this.fireEvent( this.EVENTS.GLITCH_MESSAGE );
			this.setLatestDrawingTitle();
			this.setLatestDrawingTime();
		}
	},

	unmount: function ( ctx ) {
		this.drawingView.unmount( ctx );
		this.removeClockListener();
		this.rootNode = null;
		this.mounted = false;
	},

	addClockListener: function () {
		this._onClockTick = this.onClockTick.bind( this );
		Clock.addEvent( Clock.EVENTS.TICK, this._onClockTick );
	},
	onGetUserData: function () {},
	updateGetUserPlayedGames: function ( gameData ) {
		this.drawingView.updateSideMatches( gameData );
	},
	removeClockListener: function () {
		if ( this._onClockTick ) {
			Clock.removeEvent( Clock.EVENTS.TICK, this._onClockTick );
			this._onClockTick = null;
		}
	},

	onClockTick: function ( nowTime ) {
		//last minute/lockdown scenario
		if ( nowTime >= this.drawingTime - 70 ) {
			//changed to 70 to give a buffer to avoid latest drawing issue
			//first time entering lockdown, build message and show
			if ( !this.lockdown ) {
				this.lockdown = true;
				this.liveDrawingTime = true;
				this.fireEvent( this.EVENTS.LOCKDOWN_MESSAGE );

				this.setLiveDrawingTitle();
				this.setLiveDrawingTime();
				this.hideSidePlayKenoButton();
				this.showAdTime = nowTime + 10; //show lockdown message for 10 seconds
			} else if (
				!this.adShowing &&
				!this.adShown &&
				nowTime >= this.showAdTime
			) {
				//if ad isn't showing and hasn't been show and 10 seconds have passed since message first shown
				this.adShowing = true;
				this.showAd();
			} else if (
				!this.drawingAnimationShowing &&
				!this.adShowing &&
				nowTime >= this.drawingTime
			) {
				//if not showing animation or ad, and countdown has expired, show drawing (also need drawing status at this point once ready)
				this.fireEvent( this.EVENTS.DRAWING_START );
				this.drawingAnimationShowing = true;

				this.removeClockListener();
				//show lockdown by default, message has been already built so just need to show message
			} else if ( !this.messageShowing ) {
				this.showLockdownMessage();
				this.messageShowing = true;
			}
		} else if ( this.isLatestDrawing ) {
			if ( !this.adShowing && !this.adShown && nowTime >= this.showAdTime ) {
				this.adShowing = true;

				this.showAd();
			}
		} else if ( !this.drawingAnimationShowing && !this.glitch ) {
			//first time entering latest drawing, show message with user numbers
			this.fireEvent( this.EVENTS.LOCKDOWN_MESSAGE );

			this.isLatestDrawing = true;
			this.showAdTime = nowTime + 10;

			this.setLatestDrawingTitle();
			this.setLatestDrawingTime();
		}
	},

	onDrawingAnimComplete: function () {
		//set banner from live to latest drawing if during live drawing

		if ( this.liveDrawingTime ) {
			this.setLatestDrawingTitle(
				function () {
					this.fireEvent( this.EVENTS.DRAWING_COMPLETE );
				}.bind( this )
			);
		} else {
			this.fireEvent( this.EVENTS.DRAWING_COMPLETE );
		}
	},

	onLockDownMessage: function ( appModel, gameData ) {
		this.playKenoSideButtonShowing = false;

		const lockdownMessage = this.buildLockdownMessage( appModel, gameData );

		this.lockdownContainer.innerHTML = ``;
		this.lockdownContainer.appendChild( lockdownMessage.get( 0 ));

		this.hideAdContainer();
		this.showMessage();

		this.sideMatches.style.visibility = `visible`;
		this.showCountdownClock( appModel );
	},
	buildLockdownMessage: function ( appModel, gameData ) {
		let lockdownMessage = null;

		if ( this.unrecognizedUser === true ) {
			lockdownMessage = $(
				renderTemplate( `shared/lockdown-unrecognized.html`, {
					previousDrawing: this.lockdownContainer.dataset.previousDrawTime,
					currentDrawing: this.lockdownContainer.dataset.currentDrawTime,
					nextDrawing: this.lockdownContainer.dataset.nextDrawTime,
					routeHome: this.lockdownContainer.dataset.home,
					loginURL: this.lockdownContainer.dataset.loginUrl,
					registerURL: this.lockdownContainer.dataset.registrationUrl,
					isLiveDrawing: this.liveDrawingTime,
					glitch: this.glitch
				})
			);
		} else if ( typeof gameData === `undefined` || gameData.length === 0 ) {
			//did not play scenario
			lockdownMessage = $(
				renderTemplate( `shared/lockdown-did-not-play.html`, {
					firstName: PCHUSER.firstName,
					previousDrawing: this.lockdownContainer.dataset.previousDrawTime,
					currentDrawing: this.lockdownContainer.dataset.currentDrawTime,
					nextDrawing: this.lockdownContainer.dataset.nextDrawTime,
					routeHome: this.lockdownContainer.dataset.home,
					loginURL: this.lockdownContainer.dataset.loginUrl,
					registerURL: this.lockdownContainer.dataset.registrationUrl,
					isLiveDrawing: this.liveDrawingTime,
					glitch: this.glitch
				})
			);
		} else {
			//default lockdown
			lockdownMessage = $(
				renderTemplate( `shared/lockdown.html`, {
					firstName: PCHUSER.firstName,
					cardsCompleted: gameData.length,
					previousDrawing: this.lockdownContainer.dataset.previousDrawTime,
					currentDrawing: this.lockdownContainer.dataset.currentDrawTime,
					nextDrawing: this.lockdownContainer.dataset.nextDrawTime,
					routeHome: this.lockdownContainer.dataset.home,
					isLiveDrawing: this.liveDrawingTime,
					glitch: this.glitch
				})
			);
		}
		return lockdownMessage;
	},
	showCountdownClock: function ( appModel ) {
		this.lockdownCountdownClock = this.rootNode.querySelector(
			`.live-drawing__lockdown_countdown-clock`
		);
		if ( this.lockdownCountdownClock !== null ) {
			this.countdownView.mount( this.lockdownCountdownClock, {
				animateFinalCountdown: true
			});
			this.countDownClockContainer = this.rootNode.querySelector(
				`.live-drawing__lockdown_countdown-clock-container`
			);
			if ( this.countDownClockContainer !== null ) {
				this.countDownClockContainer.appendChild( this.lockdownCountdownClock );
				this.countdownView.resetExpiration( appModel.gameEnd );
				this.lockdownCountdownClock.style.visibility = `visible`;
				this.lockdownCountdownClock.style.display = `block`;
			}
		}
	},
	showAd: function () {
		this.adView.loadVideoPlayer();
		this.hideMessage();
		this.showAdContainer();
	},
	showLockdownMessage: function ( appModel, gameData ) {
		this.onLockDownMessage( appModel, gameData );
		this.hideAdContainer();
		this.showMessage();

		this.sideMatches.style.visibility = `visible`;
	},

	setLiveDrawingTitle: function ( callback ) {
		animUtil.fadeOutInFast(
			this.title,
			function () {
				document
					.querySelector( `.live-drawing__banner` )
					.classList.remove( `live-drawing__banner--latest` );
				this.title.innerText = this.title.getAttribute( `data-live-title` );
				if ( typeof callback !== `undefined` ) {
					callback();
				}
			}.bind( this ),
			function () {},
			true
		);
	},
	setLiveDrawingTime: function () {
		animUtil.fadeOutInFast(
			this.bannerTimeContainer,
			function () {
				this.bannerTime.innerHTML = this.bannerTimeContainer.getAttribute(
					`data-drawing-time`
				);
				this.bannerTimezone.style.display = `inline-block`;
			}.bind( this ),
			function () {},
			true
		);
	},
	setLatestDrawingTime: function () {
		animUtil.fadeOutInFast(
			this.bannerTimeContainer,
			function () {
				this.bannerTime.innerHTML = this.bannerTimeContainer.getAttribute(
					`data-prev-drawing-time`
				);
				this.bannerTimezone.style.display = `inline-block`;
			}.bind( this ),
			function () {},
			true
		);
	},
	setLatestDrawingTitle: function ( callback ) {
		animUtil.fadeOutInFast(
			this.title,
			function () {
				document
					.querySelector( `.live-drawing__banner` )
					.classList.add( `live-drawing__banner--latest` );
				this.title.innerText = this.title.getAttribute( `data-latest-title` );
				if ( callback ) {
					callback();
				}
			}.bind( this ),
			function () {},
			true
		);
	},
	startDrawingAnimation: function ( drawingNumbers ) {
		if ( this.unrecognizedUser ) {
			animUtil.animateFast(
				this.unrecognizedOverlay,
				animUtil.ANIMS.FADE_IN,
				function () {},
				true
			);
		}

		this.hideMessage();
		this.hideAdContainer();
		this.showNumberPad();
		if ( this.playKenoSideButtonShowing === false ) {
			this.showSidePlayKenoButton();
		}

		this.drawingView.startDrawing( drawingNumbers );
	},
	onAdEnd: function () {
		this.adShowing = false;
		this.adShown = true;
		this.hideAdContainer();
		this.showMessage();
		if ( this.isLatestDrawing ) {
			this.fireEvent( this.EVENTS.DRAWING_START );
			this.drawingAnimationShowing = true;

			this.removeClockListener();
		}
	},
	hideAdContainer: function () {
		if ( this.adContainer.classList.contains( `fadeIn` )) {
			animUtil.animateFast(
				this.adContainer,
				animUtil.ANIMS.FADE_OUT,
				function () {
					this.adContainer.style.visibility = `hidden`;
				}.bind( this ),
				true
			);
		}
	},
	showAdContainer: function () {
		this.adContainer.style.visibility = `visible`;
		animUtil.animateFast(
			this.adContainer,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	hideSideMatches: function () {
		animUtil.animateFast(
			this.sideMatches,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.sideMatches.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	showSideMatches: function () {
		this.sideMatches.style.visibility = `visible`;
		animUtil.animateFast(
			this.sideMatches,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	hideMessage: function () {
		animUtil.animateFast(
			this.lockdownContainer,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.lockdownContainer.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	showMessage: function () {
		this.lockdownContainer.style.visibility = `visible`;
		animUtil.animateFast(
			this.lockdownContainer,
			animUtil.ANIMS.FADE_IN,
			function () {
				//callback goes here
			},
			true
		);
		this.messageShowing = true;
	},
	hideNumberPad: function () {
		animUtil.animateFast(
			this.numberPad,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.numberPad.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	showNumberPad: function () {
		this.numberPad.style.visibility = `visible`;
		animUtil.animateFast(
			this.numberPad,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	hideSidePlayKenoButton: function () {
		animUtil.animateFast(
			this.playKenoSideBarButton,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.playKenoSideBarButton.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	showSidePlayKenoButton: function () {
		this.playKenoSideBarButton.style.visibility = `visible`;
		animUtil.animateFast(
			this.playKenoSideBarButton,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	showMaintenanceMessage: function () {
		this.showNumberPad();
		this.hideSidePlayKenoButton();
		this.drawingView.showMaintenanceMessage( `shared/maintenance.html` );
	},
	showGameOverScreen: function ( totals, gameData ) {
		const gameOverScreen = $(
			renderTemplate( `shared/live-drawing-game-over-screen.html`, {
				firstName: PCHUSER.firstName,
				numGames: gameData.length,
				tokenAmount: totals.tokenTotal,
				cashAmount: totals.cashTotal
			})
		);

		$( `#drawing__number-pad` ).append( gameOverScreen[0]);

		this.liveDrawingTime = false;
	}
});

export default LiveDrawingView;
