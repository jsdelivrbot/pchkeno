// main.js just bootstraps everything

import "babel-polyfill";

import router, { bindController } from "app/modules/router";
import routes, { addRoute } from "app/config/routes";
import Clock from "app/modules/Clock";
import { setDefaultSelector as setPjaxSelector } from "app/modules/pjax";
import * as uninav from "vendor/pch-uninav";
import AppModel from "app/models/App";
import { globalDisplayQueue } from "app/modules/DisplayQueue";
import KenoService from "app/services/Service";
import PjaxLoaderMiddleware from "app/middleware/PjaxLoader";
import AdLoaderMiddleware from "app/middleware/AdMiddleware";
import gaLoaderMiddleware from "app/middleware/gaMiddleware";
import PageShellController from "app/controllers/PageShell";
import KenoCardController from "app/controllers/KenoCard";
import LiveDrawingController from "app/controllers/LiveDrawing";
import PreviousDrawingsController from "app/controllers/PreviousDrawings";
import ResultsController from "app/controllers/Results";
import TimewasterController from "app/controllers/Timewaster";
import AdController from "app/controllers/Ad";
import PathGamesController from "app/controllers/PathGames";
// dev only
import LocalApiSimulator from "app/services/LocalApiSimulator";

//Set completed state
if ( sessionStorage.getItem( `gameCompletedTriggerOnce` ) === null ) {
	sessionStorage.setItem( `gameCompletedTriggerOnce`, true );
}

// setup our services
KenoService.baseUrl = KENO_GLOBALS.API_BASE_URL;
// simulator only available in dev env
if ( KENO_GLOBALS.LOCAL_API_SIMULATOR === true ) {
	console.log( `using local api simulator` );
	KenoService.ajax = LocalApiSimulator.ajax;
}

// setup our shared Clock
Clock.setClockOffset(
	window.KENO_GLOBALS && window.KENO_GLOBALS.CLIENT_TIME_OFFSET || 0
);
Clock.startTicking();

// setup our router
//var basePath = "/"; //window.location.pathname.replace(/\/[^\/]*$/, '');
//router.base(basePath);
addRoute( `REGISTRATION`, PCH.registrationUrl );

/**
 * our App model holds shared state for the app
 * and some data will be updated from loaded pjax pages
 * as the user progresses through the site. Change events
 * will fire allowing the page shell to update as new pages are loaded
 */
const appModel = AppModel.create({
	pjaxWhitelistUrls: [],
	pjaxBlacklistUrls: routes.PJAX_BLACKLIST,
	currentUser: PCHUSER || {},
	router: router,
	routes: routes,
	gameTimestampId: parseInt( KENO_GLOBALS.CURRENT_GAME || 0, 10 ) || 0,
	// end timestamp of the current game
	previousGameTimestampId: parseInt( KENO_GLOBALS.PREVIOUS_GAME || 0, 10 ) || 0,
	// end timestamp of the previous game
	gameEnd: parseInt( KENO_GLOBALS.CURRENT_GAME_END || 0, 10 ) || 0,
	// end time stamp for the countdown
	countdownEnd: parseInt( KENO_GLOBALS.COUNTDOWN_END || 0, 10 ) || 0,
	// user is playing next set of keno cards
	isPlayingNext: !!KENO_GLOBALS.IS_PLAYING_NEXT,
	// user is playing scratch card
	isScratchCard: KENO_GLOBALS.IS_SCRATCHCARD,
	// just a place to inject globals needed for various cases
	// app model also provides a more convenient getter for these
	GLOBALS: {
		PCH: window.PCH || {},
		KENO: window.KENO_GLOBALS || {}
	},
	globalDisplayQueue: globalDisplayQueue
});

// setup our controllers to handle routes
// page shell, handles the main nav, sidebar, footer (the stuff outside the main content pane)
const pageShellController = new PageShellController( appModel );

// configure pjax
setPjaxSelector( pageShellController.view.getPjaxNodeSelector());

// setup our routes
router(
	`*`,
	PjaxLoaderMiddleware(
		appModel,
		pageShellController.view.renderPage.bind( pageShellController.view ),
		{
			skipFirstDispatch: true,
			containerSelector: pageShellController.view.getPjaxNodeSelector()
		}
	)
);
bindController( `*`, pageShellController );
bindController(
	[ routes.HOME, routes.GAME_CHOICES ],
	new KenoCardController( appModel )
);
bindController( routes.LIVE_DRAWING, new LiveDrawingController( appModel ));
//bindController(routes.LIVE_DRAWING_LOCKDOWN, new LiveDrawingLockdownController(appModel));
bindController( routes.PREV_DRAWING, new PreviousDrawingsController( appModel ));
bindController( routes.RESULTS, new ResultsController( appModel ));
bindController( routes.TIME_WASTER, new TimewasterController( appModel ));
bindController( routes.AD, new AdController( appModel ));
bindController( routes.PATH_GAMES, new PathGamesController( appModel ));
bindController( routes.PATH_GAMES_DYNAMIC_JS, new PathGamesController( appModel ));
router( `*`, AdLoaderMiddleware( `.ad` ));
router( `*`, gaLoaderMiddleware());
/*
router("*", function(ctx, next) {
    //console.log("end point", ctx.handled, ctx);
    ctx.handled = true;
    next();
});
*/

// kick off the routing
router.start({
	dispatch: true, // dispatch the initial url
	click: false // dont bind to click events, our views will be responsible for that
});

console.log( `started` );
