/* global PCHVIP, routes */
import Controller from "app/controllers/Controller";
import KenoCardView from "app/views/KenoCard";
import PlayService, { PlayRequest } from "app/services/Play";
import GameService from "app/services/Game";
import Cookies from "js-cookie";
import { globalDisplayQueue } from "app/modules/DisplayQueue";

const STORE_COOKIE_NAME = `keno-gamestore`;

/**
 * This controller handles a playable Keno Card
 * It creates a corresponding KenoCard view which it receives
 * the user events for selecting numbers and submitting the card
 */
class KenoCardController extends Controller {
	constructor ( appModel, view = new KenoCardView()) {
		super( appModel, view );
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
			this.view.EVENTS.GLITCH_SUBMIT,
			this.handleGlitchSubmit.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.CHOICE_SELECT,
			this.handleGameChoiceSelect.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.UPDATE_USER_NUMBERS,
			this.handleUpdateUserNumbers.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.SSO_LIGHTBOX_SUBMIT,
			this.handleSSOLightBoxSubmit.bind( this )
		);
		this.refreshOnSubmit = false;
	}

	route ( ctx, next ) {
		super.route( ctx, next );
		this.checkUnrecognizedSubmission();
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

	handleUpdateUserNumbers () {
		//console.log('controller: handleUpdateUserNumbers called...');
		if ( this.appModel._data.completedCardNumber > 0 ) {
			this.gameService.gamesPlayed(
				this.appModel.gameTimestampId,
				( err, resp ) => {
					if ( err ) {
						return;
					}
					this.appModel._data.completedGames = resp.games;
					this.view.updateUserNumbersHTML( resp.games );
				}
			);
		} else {
			this.appModel._data.completedGames = [];
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
		if (
			this.appModel._data.currentUser &&
			!this.appModel._data.currentUser.isFullyRegistered &&
			this.appModel._data.currentUser.isRecognizedUser &&
			!this.appModel._data.currentUser.isMiniReg &&
			!this.appModel._data.currentUser.isSocialReg
		) {
			//no password user, show lightbox
			this.view.showCreatePasswordLightbox();
		} else if ( this.duplicateNumbers( selectedNumbers ) === true ) {
			console.log( `duplicate numbers! show error message!` );
			this.view.onDuplicateNumbers();
		} else {
			this.view.disableSubmit();
			this.submitPending = true;
			if (
				this.appModel._data.currentUser &&
				this.appModel.currentUser.isRecognizedUser &&
				!this.appModel.currentUser.isSocialReg &&
				!this.appModel.currentUser.isMiniReg
			) {
				Cookies.remove( STORE_COOKIE_NAME );
				this.handleCardSubmitRecognized(
					gameInstanceId,
					cardNum,
					selectedNumbers
				);
			} else {
				this.handleCardSubmitUnrecognized(
					gameInstanceId,
					cardNum,
					selectedNumbers
				);
			}
		}
	}

	duplicateNumbers ( selectedNumbers ) {
		let isDuplicate = false;

		if ( this.appModel._data.completedGames ) {
			this.appModel._data.completedGames.forEach( game => {
				if ( JSON.stringify( game.Picks ) === JSON.stringify( selectedNumbers )) {
					isDuplicate = true;
				}
			});
		}

		return isDuplicate;
	}

	handleCardSubmitRecognized ( gameInstanceId, cardNum, selectedNumbers ) {
		this.playService.play(
			gameInstanceId,
			cardNum,
			selectedNumbers,
			this.handlePlaySubmitResponse.bind( this )
		);
	}

	handlePlaySubmitResponse ( err, resp ) {
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
			PCHVIP.controller.clearCachedStatusWithoutActivity(); // ensure on next page load new status is fetched, not from cache
			window.location.reload();
			sessionStorage.setItem( `showLastActivity`, `true` );
		} else {
			if ( resp.nextUrl ) {
				this.handleContestEntry( resp );
				this.navigate( resp.nextUrl );
			} else {
				// we shouldnt get here, but what should we do in the event that the next url isnt returned?
				this.handleContestEntry( resp );
				this.navigate( routes.TIME_WASTER );
			}

			// update VIP status
			if ( PCHVIP.controller && PCHVIP.controller.isMounted ) {
				this.appModel.globalDisplayQueue.enqueue(
					PCHVIP.controller.fetchAndUpdateStatus.bind( PCHVIP.controller )
				);
			}
		}

		this.submitPending = false;
		if ( !this.isActive ) {
			// user has since been navigated to another page
			return;
		}
	}
	handleContestEntry ( resp ) {
		console.log( `entering handlecontest entry: `, resp );
		if ( resp.contestEntryStatus ) {
			this.appModel._data.GLOBALS.KENO.CONTEST_ENTRIES.enableSweepsBanner = false;
			this.view.showSweepstakesEntryConfirmed();

			window.PCH.uniExp.tokenCenter.showLastActivity({
				description: ``,
				value: resp.contestEntryTokens
			});
		} else if ( resp.showfirstCardBonusEntry ) {
			window.PCH.uniExp.tokenCenter.showLastActivity({
				description: resp.firstCardBonusDescription,
				value: resp.firstCardBonusTokens
			});
		}

		if ( resp.eventContestEntry ) {
			const eventEntry = resp.body.event_contest_entry.settings;

			globalDisplayQueue.enqueue(
				this.view.showPromotionEntryConfirmed.bind(
					this,
					eventEntry.toastImage,
					eventEntry.contestMessage
				)
			);
			this.view.hidePromotionEntryBanner();
		}
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
}

export default KenoCardController;
