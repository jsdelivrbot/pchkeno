import $ from "vendor/zepto";
import URL from "url-parse";
import routesConfig from "app/config/routes";
import renderTemplate from "app/modules/templateLoader";

let $genericError;
let $technicalDifficulties;

/*
* Base Controller class
* can also be used as a generic view controller
* when there is no controller logic needed, just
* view mount/unmount
*/
class Controller {
	constructor ( appModel, view ) {
		this.appModel = appModel;
		this.view = view;
		this.init();
		// set when the controller is routed to
		// and unset once the controller is routed away from
		this.routedUrl = null;
		this.isActive = false;
	}

	init () {
		if ( this.view && this.view.init ) {
			this.view.init();
		}
	}

	/**
	 * This method should be called when the router routes to the
	 * controller's page
	 */
	route ( ctx, next ) {
		this.routedUrl = ctx.canonicalPath;
		this.isActive = true;
		if ( this.view ) {
			this.view.mount( ctx );
			ctx.handled = true;
		}
		next();
	}

	/**
	 * This method should be called when the router leaves
	 * the controller's page
	 */
	exitRoute ( ctx, next ) {
		this.routedUrl = null;
		this.isActive = false;
		if ( this.view ) {
			this.view.unmount( ctx );
		}
		next();
	}

	/**
	 * Routes a given url through the router
	 * Can use this for link clicks that should be routed
	 */
	navigate ( url, forcePjax = true ) {
		let forced = false;

		// for QA/testing purposes, propagate any _* GET params
		const currUrl = new URL( this.routedUrl, null, true );
		const nextUrl = new URL( url, null, true );

		if ( currUrl.query ) {
			for ( const qk in currUrl.query ) {
				if ( currUrl.query.hasOwnProperty( qk ) && qk[0] === `_` ) {
					nextUrl.query = nextUrl.query || {};
					if ( !( qk in nextUrl.query )) {
						nextUrl.query[qk] = currUrl.query[qk];
					}
				}
			}
		}
		url = nextUrl.toString();

		if ( forcePjax && this.appModel.pjaxWhitelistUrls.indexOf( url ) === -1 ) {
			this.appModel.pjaxWhitelistUrls.push( url );
			forced = true;
		}
		this.appModel.router.routeUrl( url );
		if ( forced ) {
			this.appModel.pjaxWhitelistUrls = this.appModel.pjaxWhitelistUrls.filter(
				u => u !== url
			);
		}
	}

	navigateToRegistration () {
		this.navigate( routesConfig.REGISTRATION, false );
	}

	/**
	 * Shows a generic error modal
	 */
	showGenericError () {
		if ( !$genericError ) {
			$genericError = $( renderTemplate( `shared/generic-error.html` ));
			$genericError.appendTo( document.body );
		}
		$genericError.modal({ backdrop: false });
	}
	showTechnicalDifficulties () {
		if ( !$technicalDifficulties ) {
			$technicalDifficulties = $(
				renderTemplate( `shared/kenocard-oops-backend.html` )
			);
			$technicalDifficulties.appendTo( document.body );
		}
		$technicalDifficulties.modal({ backdrop: false });
	}
}

export default Controller;
