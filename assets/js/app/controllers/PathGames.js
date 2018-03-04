/* global PCHUSER */
import Controller from "app/controllers/Controller";
import PathGamesView from "app/views/PathGames";
import PathgameService from "app/services/PathgameService";
import PlayService from "app/services/Play";
import routesConfig from "app/config/routes";
import PathGameManagerInit, {
	GameManager as PathGameManager
} from "@pch/path-gamemanager-js";

const TYPE_MONETIZATION = `Monetization`;

class PathGamesController extends Controller {
	constructor ( appModel, view = new PathGamesView()) {
		super( appModel, view );
		this.gameItem = Object.assign({}, window.pathGameData || {});
		this.pathgameService = new PathgameService( window.location.origin );
		this.playService = new PlayService();
	}

	init () {
		this.view.init( this.appModel );
		this.view.addEvent(
			this.view.EVENTS.GOS_CONTINUE,
			this.onGameOverScreenContinue.bind( this )
		);
	}

	route ( ctx, next ) {
		super.route( ctx, next );
		//this.appModel.isAdPlaying = this.view.isAdPlaying();
		if ( this.view.existsInPage()) {
			this.initPathGameManager();
			// const gosScreen = this.getPathGameOverScreen();

			// gosScreen.addEvent(gosScreen.EVENTS.CONTINUE, this.onPathGameContinue.bind(this));
			// gosScreen.addEvent(gosScreen.EVENTS.FORFEIT, this.onPathGameForfeit.bind(this));
			// gosScreen.addEvent(gosScreen.EVENTS.BACK_HOME, this.onPathGameBackHome.bind(this));
		}
		if ( this.gameItem && this.gameItem.item_type === TYPE_MONETIZATION ) {
			this.startPathMonetizationItem();
		}
	}

	exitRoute ( ctx, next ) {
		this.appModel.isAdPlaying = false;
		super.exitRoute( ctx, next );
	}

	onPathAdStarted () {
		this.appModel.isAdPlaying = true;
	}
	onPathAdCompleted () {
		window.KENO_GLOBALS.IS_SCRATCHCARD_AD = false;
		this.appModel.isAdPlaying = false;
	}
	initPathGameManager () {
		const gameDataResponse = this.gameItem;
		const initJson = PathGameManager.constructGameJsonFromIWEResponse(
			gameDataResponse,
			{
				serviceUri: this.pathgameService.baseUrl,
				user: PCHUSER
			}
		);

		window.IW_BASE_PACKAGE_PATH = initJson.game.base_package_url; // @TODO: for old game pacakges, the final builds should just use base_package_url
		const pathGameConfig = {
			//preloader: $("#preload"),
			gos: this.getPathGameOverScreen(),
			service: this.pathgameService
		};

		// initJson.game.shouldDisplayGameCount = this.isOnboarding; TODO: if Needed, needs to come from php

		this.pathGameManager = PathGameManagerInit( initJson, pathGameConfig );
		this.view.showGame(); //only show html after game has been initialized
		this.pathGameManager.gameModel.onEnded.then( this.onGameEnded.bind( this ));
		this.pathGameManager.gameModel.onStarted.then(() => {
			window.KENO_GLOBALS.IS_SCRATCHCARD = true;
			this.view.eventTracker( `Start` );
		});

		this.pathGameManager.gameModel.onStarted.catch( errResp => {
			this.pathGameManager.gameModel.updateSecurityTokenFromResponse( errResp );
			this.pathgameService.endItem(
				this.pathGameManager.gameModel.getGameId(),
				this.pathGameManager.gameModel.getSecurityToken(),
				() => {
					window.KENO_GLOBALS.IS_SCRATCHCARD = false;
				}
			);
		});
		if ( sessionStorage.getItem( `pathStarted` ) === null ) {
			this.view.eventTracker( `PathBegin`, window.location.href );
			sessionStorage.setItem( `pathStarted`, true );
		}
	}
	getPathGameOverScreen () {
		// return this.view.getGameOverScreen();
		return this.view.getGameOverScreen( PCHUSER );
	}
	onGameEnded ( endResp ) {
		//allow redirect now that game is over
		window.KENO_GLOBALS.IS_SCRATCHCARD = false;
		this.view.eventTracker( `Complete` );
		this.endResp = endResp;
		//redirect user automatically is live drawing
		if ( this.appModel.isLockdown ) {
			window.setTimeout(() => {
				this.continueToNextGame( this.endResp );
			}, 10000 );
		}
	}
	onGameOverScreenContinue () {
		this.continueToNextGame( this.endResp );
	}
	startPathMonetizationItem () {
		if ( !this.gameItem || !this.gameItem.item ) {
			return;
		}
		window.KENO_GLOBALS.IS_SCRATCHCARD_AD = true;
		this.view.showMonetization();
		this.view.addEvent(
			this.view.EVENTS.AD_COMPLETED,
			this.onAdComplete.bind( this )
		);
		this.startMonetizationPromise = new Promise(( resolve, reject ) => {
			this.pathgameService.startItem(
				this.gameItem.item.id,
				this.gameItem.security_token,
				( err, resp ) => {
					if ( err ) {
						reject( err );
					} else {
						resolve( resp );
					}
				}
			);
		});
	}

	onAdComplete () {
		window.KENO_GLOBALS.IS_SCRATCHCARD_AD = false;
		if (
			!this.gameItem ||
			!this.gameItem.item ||
			!this.startMonetizationPromise
		) {
			return;
		}
		if ( this.adCompleteHandled ) {
			return;
		}
		this.adCompleteHandled = true;
		this.startMonetizationPromise
			.then( startResp => {
				this.pathgameService.endItem(
					this.gameItem.item.id,
					startResp.securityToken,
					( err, endResp ) => {
						this.continueToNextGame( endResp );
					}
				);
			})
			.catch(() => {
				window.location.reload();
			});
	}

	continueToNextGame ( resp ) {
		if ( this.pathGameManager && this.pathGameManager.gameModel.hasErrored ) {
			window.location.reload();
		} else if ( resp ) {
			if ( this.appModel.isLockdown ) {
				//lockdown time, go to live drawing instead of next game
				sessionStorage.removeItem( `pathStarted`, true );
				this.navigate( this.appModel.routes.LIVE_DRAWING );
			} else if ( resp.pathHasMoreGames ) {
				//more games, reload the page to load next game
				window.location.reload();
			} else {
				//path is over, move them to the next keno card
				this.handlePathEnd( resp );
			}
		} else {
			window.location.reload();
		}
	}
	handlePathEnd () {
		//call the completed choice, api, redirect to home on successful callback
		this.view.eventTracker( `PathFinish`, window.location.href );
		this.view.eventTracker(
			this.appModel.completedCardNumber,
			window.location.href,
			`Keno/CardsUnlocked`
		);
		sessionStorage.removeItem( `pathStarted`, true );

		this.playService.completeChoice(
			this.appModel.gameTimestampId,
			this.pathGameManager.gameModel.path.path_id,
			() => {
				window.location = routesConfig.HOME;
			}
		);
	}
}

export default PathGamesController;
