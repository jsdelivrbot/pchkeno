import { compareUrl } from "app/modules/router";
import pjax from "app/modules/pjax";

/**
 * The middleware that runs on all routes, matches against specified pjax urls
 * and loads the content for that page
 *
 * @param {App} The app model
 * @param {function} renderFunc The function to call with the response from the pjax request,
 *   it is responsible for rendering the response, and should call the next() callback function that is passed it when it is done rendering
 * @param {object} opts Additional config options
 *   @param {bool} skipFirstDispatch True if the first route dispatch should be ignored
 *   @param {string} containerSelector The selector of the parent DOM element of the pjax content that should be returned
 */
const PjaxLoaderMiddleware = function ( appModel, renderFunc, opts ) {
	this.appModel = appModel;
	this.renderFunc = renderFunc;
	this.opts = opts || {};
	this.startPath = window.location.pathname; //+ window.location.search;
	this.routeCount = 0;
};

Object.assign( PjaxLoaderMiddleware.prototype, {
	route: function ( ctx, next ) {
		if ( this.routeCount++ === 0 && this.opts.skipFirstDispatch ) {
			next();
			return;
		}

		if ( this.isPjaxRoute( ctx )) {
			//console.log("is pjax url");
			pjax.get(
				ctx.canonicalPath,
				this.opts.containerSelector,
				( err, response ) => {
					if ( err ) {
						window.location.href = ctx.canonicalPath;
					} else {
						this.renderPage( response, ctx, next );
					}
				}
			);
		} else {
			window.location.href = ctx.canonicalPath;
		}
		/*
        else if(next) {
            //console.log("is not pjax url");
            next();
        }
        */
	},

	isPjaxRoute: function ( ctx, url ) {
		if ( this.appModel.pjaxBlacklistUrls.find( this.matchRoute.bind( this, ctx ))) {
			return false;
		}
		return this.appModel.pjaxWhitelistUrls.find(
			this.matchRoute.bind( this, ctx )
		);
	},

	matchRoute: function ( ctx, url ) {
		if ( url instanceof RegExp ) {
			return url.test( ctx.canonicalPath );
		}
		return compareUrl( ctx.canonicalPath, url );
	},

	renderPage: function ( response, ctx, next ) {
		ctx.handled = true;
		this.renderFunc( ctx, response, next );
	}
});

function routeFactory ( appModel, view, opts ) {
	const mw = new PjaxLoaderMiddleware( appModel, view, opts );

	return mw.route.bind( mw );
}

export default routeFactory;
