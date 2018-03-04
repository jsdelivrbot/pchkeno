import $ from "vendor/zepto";
import URL from "url-parse";

const BASE_URL = Symbol( `baseUrl` );
const AJAX = Symbol( `ajax` );
const PLATFORM = Symbol( `platform` );

const METHOD_POST = `post`;
const METHOD_GET = `get`;
const METHODS = {
	POST: METHOD_POST,
	GET: METHOD_GET
};

/**
 * Base class for services
 * You should extend this class for each keno resource
 */
class KenoService {
	// this should be configured in the app entry point
	static set baseUrl ( url ) {
		this[BASE_URL] = ( `` + url ).replace( /\/$/, `` );
	}
	static get baseUrl () {
		return this[BASE_URL];
	}

	// can inject a mocked ajax method for testing using
	static set ajax ( func ) {
		this[AJAX] = func;
	}
	static get ajax () {
		return this[AJAX] || $.ajax;
	}

	static set platform ( platform ) {
		this[PLATFORM] = platform;
	}
	static get platform () {
		return this[PLATFORM] || `desktop`;
	} //setting desktop as default to reduce risk of breaking things

	constructor () {}

	/**
	 * Pass a resource endpoint and returns a full api url
	 *
	 * @param string resource (eg "/plays")
	 *
	 * @return string
	 */
	getFullResourceUrl ( resource, json = false ) {
		if ( json ) {
			return `/` + resource.replace( /^\//, `` );
		} else {
			return KenoService.baseUrl + `/` + resource.replace( /^\//, `` );
		}
	}

	/**
	 * Make an api request
	 *
	 * @param KenoServiceRequest
	 * @param function Callback, first arg will be KenoServiceError if failed, or a KenoServiceResponse as the second arg
	 * @param Class<KenoServiceResponse> The class to instantiate for the response, should extend KenoServiceResponse
	 * @param object Additional options, these include
	 *   cache - bool - True if the request should be cached for this session
	 *   cacheScope - string - A scope key to distinguish this from identical requests (eg separated by user gmt)
	 *   jsonFile - bool - if true look for json file stored on the server, not an API call
	 */
	doRequest (
		serviceRequest,
		callback,
		responseClass = KenoServiceResponse,
		opts = null
	) {
		if ( opts && opts.cache ) {
			if ( doCachedRequest( serviceRequest, callback, responseClass, opts )) {
				return;
			}
		}
		let json = false;

		if ( opts && opts.jsonFile ) {
			json = true;
		}
		KenoService.ajax({
			type: serviceRequest.method,
			url: this.getFullResourceUrl( serviceRequest.resource, json ),
			headers: serviceRequest.headers,
			data: serviceRequest.serializedBody,
			contentType: `application/json`,
			//dataType: 'json',
			success: ( data, statusCode, xhr ) => {
				const resp = new responseClass( data, xhr.status );
				// error response

				if (
					resp &&
					resp.body &&
					( resp.body.error || resp.body.status === `error` )
				) {
					callback( KenoServiceError.create( xhr ));
				} else {
					// success response
					if ( opts && opts.cache ) {
						cacheResponse( serviceRequest, resp, opts );
					}
					callback( null, resp );
				}
			},
			error: ( xhr, errorType, error ) => {
				callback( KenoServiceError.create( xhr ));
			}
		});
	}
}

function dateNum ( v ) {
	return ( v < 10 ? `0` : `` ) + v;
}

/**
 * Base class for requests. You should extend this for each resource
 */
class KenoServiceRequest {
	static get csrfToken () {
		return $( `meta[name="csrf-token"]` ).attr( `content` );
	}
	/**
	 * @param string (eg "/plays")
	 * @param string The request method, pass METHOD_POST or METHOD_GET constants
	 * @param object the request params
	 * @param object headers
	 */
	constructor ( resource, method, params, headers ) {
		this.resource = resource;
		this.method = method;
		this.params = params;
		if (
			this.method === METHODS.POST &&
			this.params &&
			!( `_token` in this.params )
		) {
			this.params._token = KenoServiceRequest.csrfToken;
		}
		this.headers = Object.assign(
			{
				"X-CSRF-TOKEN": KenoServiceRequest.csrfToken
			},
			headers || {}
		);
	}

	/**
	 * Returns the serialized request body
	 */
	get serializedBody () {
		return this.method == METHOD_POST
			? JSON.stringify( this.params || {})
			: URL.qs.stringify( this.params );
		//return URL.qs.stringify(this.params);
	}

	get hashKey () {
		return this.method + `.` + this.resource + `?` + this.serializedBody;
	}

	/**
	 * Get the general User request params required by many of the api calls
	 *
	 * @param string|object If a string, user GMT is expected, otherwise the user object is returned back to you
	 *
	 * @return object the full user request object
	 */
	static getUserRequestParams ( user ) {
		if ( typeof user === `string` ) {
			return {
				GlobalMemberToken: user,
				OnlineAccountToken: user,
				isTest: null
			};
		} else {
			return user || {};
		}
	}

	/**
	 * Get a date request value
	 *
	 * @param Date|string If you pass a date, the the date will be formated into the expected string value
	 *
	 * @return string
	 */
	static getDateRequestParam ( dateVal, includeTime = true ) {
		if ( dateVal instanceof Date ) {
			const y = dateVal.getFullYear();
			const m = dateVal.getMonth() + 1;
			const d = dateVal.getDate();
			const h = dateVal.getHours();
			const mm = dateVal.getMinutes();
			const ss = dateVal.getSeconds();
			const tz = -dateVal.getTimezoneOffset();
			const tzh = Math.abs( Math.floor( tz / 60 ));
			const tzm = Math.abs( tz % 60 );

			let v = y + `-` + dateNum( m ) + `-` + dateNum( d );

			if ( includeTime ) {
				v += `T` + dateNum( h ) + `:` + dateNum( mm ) + `:` + dateNum( ss );
				v += ( tz >= 0 ? `+` : `-` ) + dateNum( tzh ) + `:` + dateNum( tzm );
			}
			return v;
		}
		return dateVal;
	}
}

/**
 * Base class for responses
 * You can extend this for resource specific response functionality, and pass the class
 * to the service doRequest() method to have it returned when the request completes
 */
class KenoServiceResponse {
	/**
	 * @param object The response params
	 * @param int The response http status code
	 */
	constructor ( body, statusCode ) {
		this.body = body || {};
		this.statusCode = statusCode;
	}
}

/**
 * Base class for error responses
 */
class KenoServiceError {
	/**
	 * @param int The http status code
	 * @param string The message returned
	 * @param object The full response body
	 */
	constructor ( statusCode, message, body ) {
		this.statusCode = statusCode;
		this.message = message;
		this.body = body;
	}

	static create ( xhr ) {
		let body = {};

		try {
			body = xhr.responseText ? JSON.parse( xhr.responseText ) : {};
		} catch ( e ) {
			body.message = xhr.responseText;
		}
		return new KenoServiceError( xhr.status, body.message || ``, body );
	}
}

function getCacheKey ( serviceRequest, opts ) {
	const cacheScope = opts && opts.cacheScope || ``;
	const cacheKey =
		`keno.serviceRequest.` +
		( cacheScope ? cacheScope + `.` : `` ) +
		serviceRequest.hashKey;

	return cacheKey;
}

function getCacheStorage ( opts ) {
	return opts && opts.cacheStorage || sessionStorage;
}

/**
 * Attempt to find cached response for the given request and handle the callback
 *
 * @param KenoServiceRequest request instance
 * @param function The callback to accept the response if cached exists
 * @param KenoServiceResponse the response class to instantiate from the cached response data
 * @param object Additional options, related params include
 *   cacheScope - string - The scope to cache under to separate identical requests (eg for separate users, gmt)
 *   cacheStorage - object - The storage instance, defaults to native sessionStorage, but you can pass your own as long as it has the same interface
 *
 * @return bool True if cached response was found and handled, False otherwise
 */
function doCachedRequest ( serviceRequest, callback, responseClass, opts ) {
	const cacheKey = getCacheKey( serviceRequest, opts );
	const storage = getCacheStorage( opts );

	try {
		let cached = storage.getItem( cacheKey );

		cached = cached ? JSON.parse( cached ) : null;
		if ( cached ) {
			const resp = new responseClass( cached.body, cached.statusCode );

			callback( null, resp );
			return true;
		}
	} catch ( e ) {
		console.log( `ERROR`, e );
	}
	return false;
}

/**
 * Cache a response
 *
 * @param KenoServiceResponse
 * @param object Additional options, related params include
 *   cacheScope - string - The scope to cache under to separate identical requests (eg for separate users, gmt)
 *   cacheStorage - object - The storage instance, defaults to native sessionStorage, but you can pass your own as long as it has the same interface
 */
function cacheResponse ( serviceRequest, serviceResponse, opts ) {
	const cacheKey = getCacheKey( serviceRequest, opts );
	const storage = getCacheStorage( opts );

	storage.setItem(
		cacheKey,
		JSON.stringify({
			body: serviceResponse.body,
			statusCode: serviceResponse.statusCode
		})
	);
}

const KenoServiceCache = {
	getCacheKey: getCacheKey,
	doCachedRequest: doCachedRequest,
	cacheResponse: cacheResponse
};

export {
	KenoServiceRequest,
	KenoServiceResponse,
	KenoServiceError,
	METHODS,
	KenoServiceCache
};
export default KenoService;
