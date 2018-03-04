import page from "page";
import URL from "url-parse";
import { isEqual } from "lodash";

page.absUrl = function ( url ) {
	const base = window.location.origin + this.base();

	url = ( url == `/` ? base : url ).replace( /\/$/, `` );
	const nurl = new URL( url, base, true );

	return nurl;
};

function compareUrl ( a, b ) {
	const aUrl = page.absUrl( a );
	const bUrl = page.absUrl( b );

	return (
		aUrl.host == bUrl.host &&
		aUrl.pathname == bUrl.pathname &&
		isEqual( aUrl.query, bUrl.query )
	);
}

page.routeUrl = function ( url ) {
	// normalize the url
	const absUrl = this.absUrl( url );
	// remove the protocol/host, and keep just path/query
	let path = absUrl
		.toString()
		.substring(
			absUrl.protocol.length +
				( absUrl.slashes ? 2 : 0 ) +
				( absUrl.port != 80 ? absUrl.host : absUrl.hostname ).length
		);

	path = path === `` ? `/` : path;
	// route the path
	return this.show( path );
};

/**
 * Bind a Controller instance to a url
 * The Controller's route() method will be called when entering that url
 * and exitRoute() will be called when leaving that url
 */
function bindController ( url, controller ) {
	if ( !Array.isArray( url )) {
		url = [ url ];
	}
	for ( let i = 0, n = url.length; i < n; i++ ) {
		page( url[i], controller.route.bind( controller ));
		page.exit( url[i], controller.exitRoute.bind( controller ));
	}
}

export { compareUrl, bindController };
export default page;
