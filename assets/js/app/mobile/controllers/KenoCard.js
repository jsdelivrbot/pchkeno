/* global PCH, PCHVIP */
import KenoCardController from "app/controllers/KenoCard";
import KenoCardViewMobile from "app/mobile/views/KenoCard";
import routesConfig from "app/config/routes";
import PlayService, { PlayRequest } from "app/services/Play";
import Cookies from "js-cookie";
import GameService from "app/services/Game";
import { globalDisplayQueue } from "app/modules/DisplayQueue";
import UniNavMessageView from "app/mobile/views/UniNavMessages";

const STORE_COOKIE_NAME = `keno-gamestore`;
/**
 * This controller handles a playable Keno Card
 * It creates a corresponding KenoCard view which it receives
 * the user events for selecting numbers and submitting the card
 */

class KenoCardControllerMobile extends KenoCardController {
	constructor ( appModel ) {
		super( appModel, new KenoCardViewMobile());
		this.playService = new PlayService();
		this.gameService = new GameService();
	}

	init () {
		this.view.init( this.appModel );
		this.view.addEvent(
			this.view.EVENTS.SUBMIT,
			this.handleCardSubmit.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.CHOICE_SELECT,
			this.handleGameChoiceSelect.bind( this )
		);
	}

	route ( ctx, next ) {
		this.checkUnrecognizedSubmission();
		super.route( ctx, next );
		// window.setTimeout(() => {
		// 	this.handleGoLive();
		// }, 5000);
	}
	handleGoLive () {
		this.navigate( routesConfig.LIVE_DRAWING );
	}

	/**
	 * Will look for the cookie set when an unrecognized user submitted the card
	 * and has returned once signed in. If this is the case, request will be made to
	 * the api to submit their prior submission
	 */
	checkUnrecognizedSubmission () {
		if (
			this.appModel.currentUser.isRecognizedUser &&
			Cookies.get( STORE_COOKIE_NAME )
		) {
			this.view.disableIntroAnims();
			this.gameService.unrecognizedUserGame(( err, resp ) => {
				if ( err ) {
					return;
				} // fail silently
				const data = resp.playSubmissionData;

				if ( data && !this.submitPending ) {
					this.handleCardSubmit(
						this.view.getGameTimestampId(),
						data.card_number,
						( data.numbers || `` ).split( `,` )
					);
				}
			});
		}
	}

	handleSSOLightBoxSubmit ( gameInstanceId, cardNum, selectedNumbers ) {
		this.appModel._data.currentUser.isFullyRegistered = true;
		this.refreshOnSubmit = true;
		this.handleCardSubmit( gameInstanceId, cardNum, selectedNumbers );
	}

	handleCardSubmit ( gameInstanceId, cardNum, selectedNumbers ) {
		if ( cardNum === 1 ) {
			sessionStorage.removeItem( `pathStarted`, true );
			sessionStorage.setItem( `gameCompletedTriggerOnce`, false );
		}
		this.view.disableSubmit();
		this.submitPending = true;
		if (
			this.appModel._data.currentUser &&
			!this.appModel._data.currentUser.isFullyRegistered &&
			this.appModel._data.currentUser.isRecognizedUser &&
			!this.appModel._data.currentUser.isMiniReg &&
			!this.appModel._data.currentUser.isSocialReg
		) {
			this.handleCardSubmitUserWithoutPassword(
				gameInstanceId,
				cardNum,
				selectedNumbers
			);
		} else if (
			this.appModel.currentUser.isFullyRegistered &&
			this.appModel.currentUser.isRecognizedUser &&
			!this.appModel.currentUser.isSocialReg &&
			!this.appModel.currentUser.isMiniReg
		) {
			Cookies.remove( STORE_COOKIE_NAME );
			this.handleCardSubmitRecognized( gameInstanceId, cardNum, selectedNumbers );
		} else {
			this.handleCardSubmitUnrecognized(
				gameInstanceId,
				cardNum,
				selectedNumbers
			);
		}
	}

	handleCardSubmitRecognized ( gameInstanceId, cardNum, selectedNumbers ) {
		this.playService.play(
			gameInstanceId,
			cardNum,
			selectedNumbers,
			this.handlePlaySubmitResponse.bind( this )
		);
	}
	handleCardSubmitUserWithoutPassword (
		gameInstanceId,
		cardNum,
		selectedNumbers
	) {
		//bypassing router, was stripping out the accounts.dev.pch.com part of the url and replacing with local url
		const req = new PlayRequest( gameInstanceId, cardNum, selectedNumbers );

		Cookies.set( STORE_COOKIE_NAME, req.serializedBody );
		window.location.replace( PCH.createPasswordUrl );
	}

	handleContestEntry ( resp ) {
		let returnVal = false;

		if ( resp.contestEntryStatus ) {
			UniNavMessageView.show([ { text: `$10 Million Entry Confirmed!` } ]);
			returnVal = true;
		}

		if ( resp.showfirstCardBonusEntry ) {
			UniNavMessageView.show([ { text: resp.firstCardBonusDescription } ]);
			returnVal = true;
		}

		if ( resp.eventContestEntry ) {
			const eventEntry = resp.body.event_contest_entry.settings;

			if ( eventEntry.circleImage ) {
				globalDisplayQueue.enqueue(
					this.view.showEntryConfirmedCircle.bind( this, eventEntry.circleImage )
				);
			} else if ( eventEntry.toastImage || eventEntry.contestMessage ) {
				globalDisplayQueue.enqueue(
					this.view.showPromotionEntryConfirmed.bind(
						this,
						eventEntry.toastImage,
						eventEntry.contestMessage
					)
				);
			}
		}

		return returnVal;
	}

	handleCardSubmitUnrecognized ( gameInstanceId, cardNum, selectedNumbers ) {
		const req = new PlayRequest( gameInstanceId, cardNum, selectedNumbers );

		Cookies.set( STORE_COOKIE_NAME, req.serializedBody );
		this.navigateToRegistration();
	}

	handleGlitchSubmit () {
		window.location.reload();
	}

	handleGameChoiceSelect ( choiceId ) {
		this.view.disableSubmit();
		this.playService.selectChoice(
			this.appModel.gameTimestampId,
			choiceId,
			this.handlePlaySubmitResponse.bind( this )
		);
	}

	handlePlaySubmitResponse ( err, resp ) {
		PCHVIP.controller.clearCachedStatusWithoutActivity(); // ensure on next page load new status is fetched, not from cache

		if ( err ) {
			if ( err.body.status === `duplicated` ) {
				this.view.onDuplicateNumbers();
				this.view.onClear();
				this.view.enableSubmit();
			} else if ( err.body.status === `timeout` ) {
				this.showTimeoutError();
			} else {
				this.showTechnicalDifficulties();
				this.view.enableSubmit();
			}
		} else if ( this.refreshOnSubmit ) {
			//if page refresh necessary, ie, for create password lightbox on game submit scenario
			window.location.reload();
			sessionStorage.setItem( `showLastActivity`, `true` );
		} else if ( resp.nextUrl ) {
			// if contest entry, wait to navigate so user has time to read message
			if ( this.handleContestEntry( resp )) {
				globalDisplayQueue.addEmptiedCallback(() => {
					this.navigate( resp.nextUrl );
				});
			} else {
				//no entry so redirect immediately
				this.navigate( resp.nextUrl );
			}
		} else {
			this.navigate( routesConfig.TIME_WASTER );
		}

		this.submitPending = false;
		if ( !this.isActive ) {
			// user has since been navigated to another page
			return;
		}
	}
}

export default KenoCardControllerMobile;
