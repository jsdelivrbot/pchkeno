import ToastView from "app/views/Toast";
import { cssClassName } from "app/modules/htmlUtil";
import { globalDisplayQueue } from "app/modules/DisplayQueue";

let store;

try {
	store = window.sessionStorage;
} catch ( e ) {}
// simple in-memory replacement if no session storage
if ( !store ) {
	store = {
		setItem: function ( key, val ) {
			this[key] = val;
		},
		getItem: function ( key, val ) {
			return this[key];
		}
	};
}

// this is the uninav/token-scenter hook that gets called
// when a levelup flag is returned from the api and the celebration should be
// shown. on Keno, we just want to show a toast notification and not interrupt gameplay
window.PCH = window.PCH || {};
window.PCH.LEVELS = window.PCH.LEVELS || {};
PCH.LEVELS.triggerLevelUpCelebration = function ( opts, data ) {
	let levelName =
		data &&
			data.iw_response &&
			data.iw_response.data &&
			data.iw_response.data.level &&
			data.iw_response.data.level.level ||
		``;

	levelName = levelName || PCHUSER.level; // mobile doesnt pass us anything
	const levelClass = cssClassName( levelName );
	const key = `levelupToast.` + levelClass;

	opts = opts || {};
	const _celebrationEndCallback =
		typeof opts.celebrationEndCallback === `function`
			? opts.celebrationEndCallback
			: function () {};

	if ( !levelName || !store.getItem( key )) {
		const user = PCHUSER || { fullname: `Guest` };
		let message = PCH.uniExp.tokenCenterOptions.levelUpToast;

		if ( levelName ) {
			store.setItem( key, `1` );
		}
		message = message.replace(
			`[NAME]`,
			user.firstName || user.fullname || user.email
		);
		message = message.replace( `[LEVEL_NAME]`, levelName );
		message = message.replace( `[LEVEL_CLASS]`, levelClass );
		globalDisplayQueue.enqueue(() => {
			const toastView = ToastView.show( `shared/levelUp.html`, {
				message: message
			});

			return toastView.pendingPromise;
		});
		globalDisplayQueue.enqueue(() => {
			return new Promise(( resolve, reject ) => {
				_celebrationEndCallback();
				resolve();
			});
		});
		if ( PCH.uniExp.tokenCenter.levelupQueueResolve ) {
			PCH.uniExp.tokenCenter.levelupQueueResolve();
			PCH.uniExp.tokenCenter.levelupQueueResolve = null;
		}
	} else {
		_celebrationEndCallback();
	}
};

export default PCH.LEVELS.triggerLevelUpCelebration;
