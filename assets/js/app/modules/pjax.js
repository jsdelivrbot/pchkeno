import $ from "vendor/zepto";

let defaultSelector = ``;

const scriptRE = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
const srcRE = /src=['"]([^'"]+)['"]/;
const attribsRE = /\b([a-zA-Z\-0-9]+)=['"]([^'"]+)['"]/g;
const attribRE = /\b([a-zA-Z\-0-9]+)=['"]([^'"]+)['"]/;

/**
 * Configure a default selector to use with this module
 * with the getDefault() method
 */
function setDefaultSelector ( selector ) {
	defaultSelector = selector;
}

/**
 * Make a pjax request
 *
 * @param string url
 * @param string The DOM selector for the element whose content should be returned in the response
 * @param function callback that takes an error first arg, or {title, body} object on success
 */
function get ( url, contentSelector, callback ) {
	$.ajax({
		type: `GET`,
		url: url,
		headers: {
			"X-CSRF-TOKEN": $( `meta[name="csrf-token"]` ).attr( `content` ),
			"X-PJAX": `true`,
			"X-PJAX-Container": contentSelector
		},
		success: response => {
			const parts = { title: ``, body: response };
			const title = response.match( /^\s*<title>([\s\S]*?)<\/title>/m );
			// update the page title

			if ( title && title.length > 1 ) {
				parts.title = title[1];
				parts.body = response.substring( title[0].length );
			}
			// remove script tags from the body, and return those separately
			// they will need to be loaded specially, since setting innerHTML doesnt
			// load or execute scripts
			const scripts = [];

			parts.body = ( parts.body || `` ).replace( scriptRE, function () {
				const script = { body: arguments[2] };
				let attribs = arguments[1];

				if ( attribs ) {
					const src = attribs.match( srcRE );

					if ( src ) {
						script.src = src[1];
					}
				}
				if ( attribs ) {
					script.attribs = {};
					attribs = attribs.match( attribsRE );
					if ( attribs ) {
						for ( let i = 0, n = attribs.length; i < n; i++ ) {
							const attrib = attribs[i].match( attribRE );

							if ( attrib && attrib[1] !== `src` && attrib[1] !== `type` ) {
								script.attribs[attrib[1]] = attrib[2];
							}
						}
					}
				}
				scripts.push( script );
				return ``;
			});
			parts.scripts = scripts;
			callback( null, parts );
		},
		error: xhr => {
			callback( xhr );
		}
	});
}

/**
 * Same as the pjax request above, but does not
 * ask for a container selector, will use the configured default selector instead
 *
 * @param string
 * @param function
 */
function getDefault ( url, callback ) {
	return get( url, defaultSelector, callback );
}

/**
 * this will load a set of scripts, one by one in series in the order they are given,
 * we cant do them asynchronously because later scripts might depend on earlier ones
 *
 * Scripts will be loaded in the head and then removed, but this can behaviour can
 * be modified via attributes on the script tag.
 *   async - The script will not be waited upon before the next script is loaded
 *   data-bodyscript - The script will be appended to the nonHeadParentNode element and will not be removed when loaded
 *
 * @param Array Array of scripts passed from a pjax response, This array is modified
 * @param HTMLElement|null If a script is not to be loaded in the head, it will be appended to this element
 * @param function callback fired once all scripts loaded
 */
function loadScripts ( scripts, nonHeadParentNode, callback ) {
	const script = scripts.shift();
	// no more scripts, fire callback

	if ( !script ) {
		if ( callback ) {
			callback();
		}
		return;
	}
	const head = document.querySelector( `head` );
	const scriptEl = document.createElement( `script` );

	scriptEl.type = `text/javascript`;
	const addToHead =
		!script.attribs || script.attribs[`data-bodyscript`] !== `true`;
	const removeScript = addToHead;
	let isAsync = false;
	// load external script

	if ( script.src ) {
		scriptEl.src = script.src;
		scriptEl.async = `async`;
		isAsync = script.attribs && `async` in script.attribs;
		if ( !isAsync ) {
			scriptEl.onload = function () {
				if ( removeScript ) {
					this.parentNode.removeChild( this );
				}
				loadScripts( scripts, nonHeadParentNode, callback );
			};
		}
	} else if ( script.body ) {
		// load inline script
		isAsync = true;
		try {
			scriptEl.appendChild( document.createTextNode( script.body ));
		} catch ( e ) {
			scriptEl.text = script.body;
		}
	}
	// any other attributes
	if ( script.attribs ) {
		for ( const k in script.attribs ) {
			if ( script.attribs.hasOwnProperty( k )) {
				scriptEl.setAttribute( k, script.attribs[k]);
			}
		}
	}
	//head.insertBefore(scriptEl, head.firstChild);
	if ( addToHead ) {
		head.appendChild( scriptEl );
	} else {
		nonHeadParentNode.appendChild( scriptEl );
	}
	// if we dont need to wait for external script, then
	// load next script now
	if ( isAsync ) {
		if ( removeScript ) {
			head.removeChild( scriptEl );
		}
		loadScripts( scripts, nonHeadParentNode, callback );
	}
}

const pjax = {
	get,
	getDefault
};

export { setDefaultSelector, loadScripts };
export default pjax;
