/* some extensions to the uninav script */
( function () {
	// need this to ensure we are only running this for logged in users, or else a js error is thrown.
	if ( PCH.uniExp.tokenCenter ) {
		PCH.uniExp.tokenCenter.updateTokenBalanceCallbacks.push( function () {
			PCH.uniExp.tokenCenter.tokenBalanceLoaded = true;
		});
	}
})();
