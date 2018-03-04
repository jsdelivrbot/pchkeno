/* global PCH */

import Controller from "app/controllers/Controller";
import PageShellView from "app/views/PageShell";
import TokenBalanceService from "app/services/TokenBalance";

class PageShellController extends Controller {
	constructor ( appModel, view = new PageShellView()) {
		super( appModel, view );
	}

	init () {
		this.view.addEvent( this.view.EVENTS.NAVIGATE, this.navigate.bind( this ));
		this.view.addEvent( this.view.EVENTS.GO_LIVE, this.onGoLive.bind( this ));
		this.view.addEvent(
			this.view.EVENTS.UPDATE_DAILY_TOKEN,
			this.onUpdateDailyTokenBalance.bind( this )
		);
		this.view.init( this.appModel );
		this.appModel.pjaxWhitelistUrls = this.appModel.pjaxWhitelistUrls.concat(
			this.view.getPjaxUrls()
		);
		// listen for app state change events, so we can update our views
		// which dont change across pjax page loads, so we need to update them when
		// new pjax pages show that state has changed
		this.appModel.addEvent(
			this.appModel.EVENTS.STATE_CHANGE,
			this.onAppStateChange.bind( this )
		);
		this.appModel.addEvent(
			this.appModel.EVENTS.STATE_ADD,
			this.onAppStateAdded.bind( this )
		);
		if ( this.appModel._data.GLOBALS.KENO.CONTEST_ENTRIES.enableSweepsBanner ) {
			this.view.showSweepstakesBanner();
		}

		// if (KENO_GLOBALS.IS_SCRATCHCARD_AD) {
		//     window.setTimeout(() => {
		//         console.log('spoof go live!');
		//         this.onGoLive();
		//     }, 5000)
		// }
	}

	route ( ctx, next ) {
		this.routedUrl = ctx.canonicalPath;

		this.view.mount( ctx );

		// update the app state as returned in the page response
		this.appModel.isPlayingNext = this.view.getCurrentCardDataIsPlayingNext();
		this.appModel.unlockedCardNumber = this.view.getCurrentCardDataUnlockedNum();
		this.appModel.completedCardNumber = this.view.getCurrentCardDataCompletedNum();
		this.appModel.cashTime = this.view.getCurrentCardDataIsCashTime();
		this.appModel.gameTimestampId = this.view.getCurrentCardDataGameTimestampId();
		this.appModel.gameEnd = this.view.getCurrentCardDataGameEnd();
		this.appModel.countdownEnd = this.view.getCurrentCardDataCountdownEnd();

		// user login status change check
		// @TODO: this probably better implemented as a separate middleware component
		if (
			this.appModel.isUserStateMismatch(
				this.view.getCurrentCardDataIsRecognizedUser(),
				this.view.getCurrentCardDataUserGMT()
			)
		) {
			window.location.reload();
		} else {
			next();
		}
	}

	exitRoute ( ctx, next ) {
		// do nothing
		next();
	}

	onGoLive () {
		if (
			!window.KENO_GLOBALS ||
			window.KENO_GLOBALS.COUNTDOWN_AUTO_REDIRECT !== false
		) {
			if ( this.appModel.isPlayingNext ) {
				return;
			}
			this.appModel.isLockdown = true;
			if ( window.KENO_GLOBALS.IS_SCRATCHCARD ) {
				//is scratchcard, don't redirect
				//fire game end interrupt message to reveal all
				PCH.interruptAction = function () {
					console.log( `interrupt action!!` );
					this.navigate( this.appModel.routes.LIVE_DRAWING );
				}.bind( this );

				PCH.gameProxy.interruptGame();
				sessionStorage.removeItem( `pathStarted`, true );
				console.log( `sendinterrupt Message sent!` );
			} else if ( window.KENO_GLOBALS.IS_SCRATCHCARD_AD ) {
				console.log( `is scratchcard ad` );
				this._onAdComplete = this.goLiveOnAdComplete.bind( this );
				this.appModel.addEvent(
					this.appModel.EVENTS.AD_COMPLETE,
					this._onAdComplete
				);
			} else if ( !this.appModel.isAdPlaying ) {
				//if ad is not playing, redirect now
				this.navigate( this.appModel.routes.LIVE_DRAWING );
			} else {
				//ad is playing, redirect on complete
				this._onAdComplete = this.goLiveOnAdComplete.bind( this );
				this.appModel.addEvent(
					this.appModel.EVENTS.AD_COMPLETE,
					this._onAdComplete
				);
			}
		}
	}

	goLiveOnAdComplete () {
		if ( !this.appModel.isAdPlaying ) {
			this.appModel.removeEvent(
				this.appModel.EVENTS.AD_COMPLETE,
				this._onAdComplete
			);
			this._onAdComplete = null;
			this.onGoLive();
		}
	}

	onAppStateChange () {
		this.view.updateFromAppState( this.appModel );
	}

	onAppStateAdded ( propName ) {
		if ( propName === `allCardsComplete` ) {
			this.view.updateFromAppState( this.appModel );
		} else if ( propName === `dailyTokenBalance` ) {
			this.view.updateFromAppState( this.appModel );
		}
	}

	onUpdateDailyTokenBalance () {
		const service = new TokenBalanceService();

		service.dailyTokenBalance(( err, resp ) => {
			if ( resp ) {
				this.appModel.dailyTokenBalance = resp.earned_today;
			} else {
				this.appModel.dailyTokenBalance = 0;
			}
		});
	}
}

export default PageShellController;
