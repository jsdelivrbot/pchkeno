// main.js just bootstraps everything
/* global KENO_GLOBALS, PCH, PCHUSER, LocalApiSimulator */
import 'babel-polyfill';

import router, { bindController } from 'app/modules/router';
import routes, { addRoute } from 'app/config/routes';
import Clock from 'app/modules/Clock';
import { setDefaultSelector as setPjaxSelector } from 'app/modules/pjax';

// eslint-disable-next-line
import * as uninav from 'vendor/pch-uninav-mobile';
import AppModel from 'app/models/App';
import { globalDisplayQueue } from 'app/modules/DisplayQueue';
import pjaxLoaderMiddleware from 'app/middleware/PjaxLoader';

import gaLoaderMiddleware from 'app/middleware/gaMiddleware';
import PageShellControllerMobile from 'app/mobile/controllers/PageShell';
import LiveDrawingControllerMobile from 'app/mobile/controllers/LiveDrawing';
import KenoCardControllerMobile from 'app/mobile/controllers/KenoCard';
import AdControllerMobile from 'app/mobile/controllers/Ad';
import TimewasterControllerMobile from 'app/mobile/controllers/Timewaster';
import ResultsControllerMobile from 'app/mobile/controllers/Results';
import KenoService from 'app/services/Service';
import PathGamesController from 'app/controllers/PathGames';
import LeaderboardControllerMobile from 'app/mobile/controllers/Leaderboard';

// setup our services
KenoService.baseUrl = KENO_GLOBALS.API_BASE_URL;
// simulator only available in dev env
if ( KENO_GLOBALS.LOCAL_API_SIMULATOR === true ) {
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
addRoute( `REGISTRATIONWITHOUTPASSWORD`, PCH.createPasswordUrl );
//
// setup our shared Clock
Clock.setClockOffset(
	window.KENO_GLOBALS && window.KENO_GLOBALS.CLIENT_TIME_OFFSET || 0
);
Clock.startTicking();

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
	isPlayingNext: !!KENO_GLOBALS.IS_PLAYING_NEXT || false,
	// user is playing scratch card
	isScratchCard: KENO_GLOBALS.IS_SCRATCHCARD || false,

	coachingEnabled: KENO_GLOBALS.COACHING_SCREENS.enabled || false,
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
const pageShellControllerMobile = new PageShellControllerMobile( appModel );

// configure pjax
setPjaxSelector( pageShellControllerMobile.view.getPjaxNodeSelector());

// setup our routes
router(
	`*`,
	pjaxLoaderMiddleware(
		appModel,
		pageShellControllerMobile.view.renderPage.bind(
			pageShellControllerMobile.view
		),
		{
			skipFirstDispatch: true,
			containerSelector: pageShellControllerMobile.view.getPjaxNodeSelector()
		}
	)
);

bindController(
	[ routes.HOME, routes.GAME_CHOICES ],
	new KenoCardControllerMobile( appModel )
);
bindController( routes.LIVE_DRAWING, new LiveDrawingControllerMobile( appModel ));

// bindController(routes.PREV_DRAWING, new PreviousDrawingsController(appModel));
bindController( routes.RESULTS, new ResultsControllerMobile( appModel ));
bindController( routes.TIME_WASTER, new TimewasterControllerMobile( appModel ));
bindController( routes.AD, new AdControllerMobile( appModel ));
bindController( routes.PATH_GAMES, new PathGamesController( appModel ));
bindController( routes.LEADERBOARD, new LeaderboardControllerMobile( appModel ));
bindController( `*`, pageShellControllerMobile );
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
