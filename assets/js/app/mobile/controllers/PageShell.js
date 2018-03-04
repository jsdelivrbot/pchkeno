/* global PCH */

import PageShellController from "app/controllers/PageShell";
import PageShellViewMobile from "app/mobile/views/PageShell";

class PageShellControllerMobile extends PageShellController {
	constructor ( appModel ) {
		super( appModel, new PageShellViewMobile());
	}

	init () {
		this.view.addEvent( this.view.EVENTS.NAVIGATE, this.navigate.bind( this ));
		this.view.addEvent( this.view.EVENTS.GO_LIVE, this.onGoLive.bind( this ));
		this.view.init( this.appModel );
		this.appModel.addEvent(
			this.appModel.EVENTS.STATE_CHANGE,
			this.onAppStateChange.bind( this )
		);
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

		next();
		//need to add back once we have isUserStateMismatch
		// if (this.appModel.isUserStateMismatch(this.view.getCurrentCardDataIsRecognizedUser(), this.view.getCurrentCardDataUserGMT())) {
		//     window.location.reload();
		// } else {
		//     next();
		// }
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
				PCH.gameProxy.interruptGame();
			} else if (
				window.location.pathname !== this.appModel.routes.LIVE_DRAWING
			) {
				//don't redirect when on live drawing page, we're already here
				this.navigate( this.appModel.routes.LIVE_DRAWING );
			}
		}
	}
}

export default PageShellControllerMobile;
