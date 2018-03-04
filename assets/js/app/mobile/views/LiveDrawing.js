/* global PCHUSER, headertag, $ */
import LiveDrawingView from "app/views/LiveDrawing";
import ViewFactory from "app/views/ViewFactory";
import animUtil from "app/modules/animationUtil";
import renderTemplate from "app/modules/templateLoader";
import MobileDrawingView from "app/mobile/views/Drawing";
const LiveDrawingViewMobile = function () { };

Object.assign( LiveDrawingViewMobile.prototype, LiveDrawingView.prototype, {
	init: function () {
		this.countdownView = ViewFactory.countdown();
		this.unrecognizedUser = false;
		this.drawingAnimationShowing = false;
		this.drawingView = new MobileDrawingView();
		this.drawingView.init();
		this.drawingView.addEvent(
			this.drawingView.EVENTS.DRAWING_ANIM_COMPLETE,
			this.onDrawingAnimComplete.bind( this )
		);
	},

	mount: function () {
		this.drawingView.mount();
		this.rootNode = document.querySelector( `.drawing--live` );
		this.scene1 = document.querySelector( `.scene-1` );
		this.scene2 = document.querySelector( `.scene-2` );
		this.lockdown = false;
		this.glitch = false;
		this.liveDrawingTime = false;
		this.isLatestDrawing = false;
		this.mounted = true;
		this.adShowing = false;
		this.adShown = false;
		this.continueButton = document.querySelector(
			`.live-drawing__continue-button`
		);
		this.messageShowing = false;
		this.drawingAnimationShowing = false;
		this.showCountdownClock();
		this.bannerTimeContainer = document.querySelector(
			`.live-drawing__banner__time`
		);
		this.bannerTime = document.querySelector(
			`#live-drawing__banner__time--hours-minutes`
		);
		this.bannerTimezone = document.querySelector(
			`.live-drawing__banner__timezone`
		);
		this.lockdownContainer = document.getElementById( `live-drawing__lockdown` );
		this.title = document.querySelector( `.live-drawing__banner__title` );

		//grab data from the "drawing-live" article
		if ( this.rootNode ) {
			this.drawingTime = parseInt(
				this.rootNode.getAttribute( `data-drawtime` ) || `0`,
				10
			);
			if ( this.drawingTime > 0 ) {
				this.addClockListener();
			}

			// this.UrlMP = this.rootNode.getAttribute("data-urlmp");
			// this.seenMP = this.rootNode.getAttribute('data-seenmp') == "1" ? true : false;
		}

		if ( PCHUSER.type === `Guest` ) {
			this.unrecognizedUser = true;
			this.drawingView.updateSideMatches();
		}
	},

	onClockTick: function ( nowTime ) {
		//lockdown scenario
		if ( nowTime >= this.drawingTime - 70 ) {
			if ( !this.lockdown ) {
				this.lockdown = true;
				this.liveDrawingTime = true;
				this.fireEvent( this.EVENTS.LOCKDOWN_MESSAGE );

				this.setLiveDrawingTitle();
				this.setLiveDrawingTime();
			} else if ( nowTime >= this.drawingTime && !this.drawingAnimationShowing ) {
				//10 seconds have elapsed, redirect user to ad if they haven't seen it yet already
				//lockdown period is over, start that drawing!
				this.drawingAnimationShowing = true;
				this.setLiveDrawingTitle();
				this.setLiveDrawingTime();

				this.fireEvent( this.EVENTS.DRAWING_START );
			}
		} else if ( !this.drawingAnimationShowing ) {
			//we are outside of lockdown and animation is show showing so start latest drawing
			//first time through, set showAdtime to 10 seconds after current time
			if ( !this.lockdown && !this.glitch ) {
				this.showDrawingTime = nowTime + 10;
				this.setLatestDrawingTitle();
				this.setLatestDrawingTime();
				this.fireEvent( this.EVENTS.LOCKDOWN_MESSAGE );

				this.lockdown = true;

				this.isLatestDrawing = true;
			} else if (
				nowTime > this.showDrawingTime &&
				!this.drawingAnimationShowing
			) {
				this.lockdown = false;
				this.drawingAnimationShowing = true;

				this.isLatestDrawing = true;
				this.fireEvent( this.EVENTS.DRAWING_START );
			} //user is first coming to page, show lockdown message until ad show triggers
		}
	},
	onLockDownMessage: function ( appModel, gameData ) {
		const lockdownMessage = this.buildLockdownMessage( appModel, gameData );

		this.lockdownContainer.innerHTML = ``;
		this.lockdownContainer.appendChild( lockdownMessage.get( 0 ));
		this.showCountdownClock( appModel );
		window.setTimeout(() => {
			headertag.pubads().refresh();
		}, 2000 );
	},

	showScene2: function ( callback ) {
		animUtil.animateFast(
			this.scene1,
			animUtil.ANIMS.FADE_OUT,
			() => {
				this.scene1.style.display = `none`;
				this.scene2.style.visibility = `visible`;
				this.scene2.style.display = `block`;
				animUtil.animateFast(
					this.scene2,
					animUtil.ANIMS.FADE_IN,
					() => {
						callback();
					},
					true
				);
			},
			true
		);
	},
	startDrawingAnimation: function ( drawingNumbers ) {
		this.showScene2(() => {
			this.drawingView.startDrawing( drawingNumbers );
		});
	},
	showAd: function () {
		if ( !this.adShowing ) {
			this.adShowing = true;
			window.location.replace( this.UrlMP );
		}
	},
	onDrawingAnimComplete: function () {
		LiveDrawingView.prototype.onDrawingAnimComplete.call( this );
		animUtil.animateFast(
			this.continueButton,
			animUtil.ANIMS.FADE_IN,
			() => { },
			true
		);
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

		$( `body` ).addClass( `noScroll` ).append( gameOverScreen[0]);

		this.liveDrawingTime = false;
	}
});

export default LiveDrawingViewMobile;
