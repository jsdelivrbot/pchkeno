/* */

module.exports = System._nodeRequire
	? System._nodeRequire('buffer')
	: require('buffer');
