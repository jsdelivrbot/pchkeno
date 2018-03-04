// just a collection of html related utilities

const CSS_CLASS_RE = /[^a-zA-Z0-9\-_]/g;

function cssClassName ( str ) {
	return ( `` + str ).toLowerCase().replace( CSS_CLASS_RE, `` );
}

export { cssClassName };
