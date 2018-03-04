/* global PCH */
import BonusService from "app/services/BonusService";
import DailyTokenBonusView from "app/views/DailyTokenBonus";
import LatestTokenActivityView from "app/views/LatestTokenActivity";
import GenericErrorView from "app/views/GenericError";

/**
 * This is a self contained module composed of a view
 * and the handler for the view submit
 *
 * Promise returned from showing it resolves after the server request returns
 * after submission
 *
 * @usage
 *   import dailyBonus from "app/modules/dailyBonus";
 *   dailyBonus.show(appModel).then(() => { console.log("done"); });
 *   // or
 *   globalDisplayQueue.enqueu(dailyBonus.show.bind(dailyBonus, appModel));
 */

let dailyTokenBonusView;
let promise, promiseResolve, promiseReject;
let submitted = false;
let appModel;
let showToast = true;

/**
 * Hide bonus popup
 */
const hide = function () {
	if ( dailyTokenBonusView ) {
		dailyTokenBonusView.hide();
	}
};

/**
 * Handler for when user submits the popup
 * will submit to the server and resolve the promise once response is returned
 */
const onDailyBonusSubmit = function () {
	submitted = true;
	const service = new BonusService();

	service.dailyBonusCredit(( err, resp ) => {
		if ( err ) {
			GenericErrorView.show();
			promiseReject( err );
		} else if ( resp.tokens > 0 && appModel.tokenCenter ) {
			if ( showToast ) {
				LatestTokenActivityView.showTokensAwarded(
					resp.tokens,
					resp.message,
					appModel.currentUser,
					PCH.uniExp.tokenCenterOptions
				).then( function () {
					promiseResolve();
				});
			} else {
				promiseResolve();
			}
			appModel.tokenCenter.updateTokenBalance();
		} else {
			promiseResolve();
		}
		hide();
	});
};

/**
 * Creates the daily bonus view instance
 */
const createInstance = function () {
	dailyTokenBonusView = new DailyTokenBonusView();
	dailyTokenBonusView.addEvent(
		dailyTokenBonusView.EVENTS.SUBMIT,
		onDailyBonusSubmit
	);
	dailyTokenBonusView.init();
	dailyTokenBonusView.mount();
};

/**
 * Show the daily bonus popup
 *
 * @param AppModel
 *
 * @return Promise Resolves once token submission has returned
 */
const show = function ( _appModel ) {
	appModel = _appModel;
	if ( !dailyTokenBonusView ) {
		createInstance();
	}

	if ( !promise ) {
		// this is our final promise to resolve after token submission
		promise = new Promise(( resolve, reject ) => {
			promiseResolve = resolve;
			promiseReject = reject;
			dailyTokenBonusView.show().then(() => {
				// once the view closes, if we havent submitted, then
				// resolve now, otherwise we are waiting on the submission response
				if ( !submitted ) {
					promiseResolve();
				}
			});
		});
	}

	return promise;
};

const disableToast = function () {
	showToast = false;
};

const dailyBonusModule = {
	show: show,
	disableToast: disableToast
};

export default dailyBonusModule;
