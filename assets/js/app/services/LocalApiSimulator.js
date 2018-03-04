import $ from "vendor/zepto";

/**
 * map request urls/regexes to the local json file to request for the response
 * first array value can be a regex or string, it will match against the request url
 * second array value is the response url, that url will be requested and the response returned to the service
 * third param is optional, and if specified will match against the request method, otherwise all request methods match
 */
const resourceRoutes = [
	//[/\/play$/, "/resources/assets/json/play-error.json", "post"],
	//[/\/game$/, "/json/play.json", "post"],
	//[/\plays\/.*/, "/json/plays.json", "post"],
	//[/\/game$/, "/json/game.json"]
	[ /\/dailybonus\/credit/, `/json/dailybonuscredit.json`, `post` ]
];

/**
 * The simulated ajax request, will take the request url and return a response mapped above
 * If the response json contains a "_statusCode" field, that will be the simulated resoonse status code
 * that is returned, to allow simulating error responses (eg "_statusCode": 500)
 *
 * Use this by injecting it as the Service.ajax value
 */
const Ajax = function ( params ) {
	if ( !params ) {
		return;
	}

	let respUrl = null;

	for ( let i = 0, n = resourceRoutes.length; i < n; i++ ) {
		// match the method
		if ( resourceRoutes[i].length <= 2 || resourceRoutes[i][2] === params.type ) {
			// regex url match
			if ( resourceRoutes[i][0] instanceof RegExp ) {
				if ( resourceRoutes[i][0].test( params.url )) {
					respUrl = resourceRoutes[i][1];
					break;
				}
			} else if ( resourceRoutes[i][0] === params.url ) {
				// direct url string match
				respUrl = resourceRoutes[i][1];
				break;
			}
		}
	}

	if ( !!respUrl ) {
		return $.getJSON( respUrl, function ( data ) {
			let statusCode = 200;

			if ( data && data._statusCode ) {
				statusCode = parseInt( data._statusCode, 10 );
			}

			const xhr = {
				status: statusCode,
				responseText: JSON.stringify( data )
			};

			// success
			if ( statusCode >= 200 && statusCode < 300 ) {
				if ( params.success ) {
					params.success( data, statusCode, xhr );
				}
			} else if ( params.error ) {
				// error
				params.error( xhr, statusCode );
			}

			if ( params.complete ) {
				params.complete( xhr, statusCode );
			}
		});
	} else {
		console.log( `no matching simulator url, making actual request`, params );
		return $.ajax( params );
	}
};

const Simulator = {
	ajax: Ajax
};

export default Simulator;
