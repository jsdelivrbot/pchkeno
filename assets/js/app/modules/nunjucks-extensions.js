/**
 * Format a number with comma thousands separator
 * and optional fixed decimals
 *
 * @param string|number the number to format
 * @param int|null number of fixed decimals
 *
 * @return string
 */
function numberFormat ( val, decimals ) {
	val = parseFloat( val, 10 );
	if ( decimals ) {
		val = val.toFixed( decimals );
	}
	val = `` + val;
	const x = val.split( `.` );
	let x1 = x[0];
	const x2 = x.length > 1 ? `.` + x[1] : ``;
	const rgx = /(\d+)(\d{3})/;

	while ( rgx.test( x1 )) {
		x1 = x1.replace( rgx, `$1` + `,` + `$2` );
	}
	return x1 + x2;
}

export default function ( env ) {
	env.addFilter( `numberFormat`, numberFormat );
}
