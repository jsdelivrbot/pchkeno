import Controller from "app/controllers/Controller";
import ResultsView from "app/views/Results";
import pjax, { loadScripts } from "app/modules/pjax";
import PlayService from "app/services/Play";

class ResultsController extends Controller {
	constructor ( appModel, view = new ResultsView()) {
		super( appModel, view );
		this.playService = new PlayService();
	}

	init () {
		super.init();
		this.view.addEvent(
			this.view.EVENTS.DATE_PICKED,
			this.onDatePicked.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.DATETIME_SUBMIT,
			this.onDateTimeSubmit.bind( this )
		);
		this.view.addEvent(
			this.view.EVENTS.PLATFORM_PICKED,
			this.onPlatformPicked.bind( this )
		);
	}

	// when user changes date selection in calendar
	// we need to fetch their played times for that date
	// to highlight the time dropdown
	onDatePicked ( selectedDate ) {
		this.fetchPlayTimes( selectedDate, this.view.getSelectedPlatform());
	}

	fetchPlayTimes ( selectedDate, platform ) {
		this.pendingPlayTimesResponseDate = selectedDate;
		this.pendingPlayTimesResponsePlatform = platform;
		const today = new Date();
		const useCache =
			selectedDate.getYear() != today.getYear() ||
			selectedDate.getMonth() != today.getMonth() ||
			selectedDate.getDate() != today.getDate();

		this.view.setTimeOptionsLoading();
		this.playService.getUserPlayTimes(
			platform,
			selectedDate,
			( err, resp ) => {
				if ( !this.isActive ) {
					return;
				} // user has since navigated away
				if (
					selectedDate !== this.pendingPlayTimesResponseDate ||
					platform !== this.pendingPlayTimesResponsePlatform
				) {
					return; //user since picked a different date or platform
				}
				if ( err ) {
					// fail silently, update view to show no highlighted times
					this.view.updateTimeOptionsWithUserPlays([]);
				} else {
					this.view.updateTimeOptionsWithUserPlays( resp.playedTimes );
				}
				this.view.unsetTimeOptionsLoading();
			},
			{ cache: useCache, cacheScope: this.appModel.currentUser.gmt }
		);
	}

	fetchResultsMarkup ( selectedDate, selectedPlatform ) {
		const url = this.appModel.router.absUrl( this.routedUrl );

		url.query[`date`] = Math.floor( selectedDate.getTime() / 1000 );
		url.query[`platform`] = selectedPlatform;
		url.query[`offset`] = this.view.getSelectedTimezoneOffset();
		this.view.disableSubmit();
		pjax.get( url.toString(), this.view.getPjaxSelector(), ( err, response ) => {
			this.view.enableSubmit();
			// user is still on this page
			if ( this.isActive ) {
				if ( err ) {
					this.showGenericError();
				} else {
					loadScripts( response.scripts, null, () => {
						// @TODO: this is duplicated logic from PageShellController essentially, we need a better way of handling this
						// in one central spot, we should maybe send these results requests through the routing system with the different params
						if (
							this.appModel.isUserStateMismatch(
								window.KENO_GLOBALS.RESULTS_PAGE.isRecognizedUser,
								window.KENO_GLOBALS.RESULTS_PAGE.userGMT
							)
						) {
							window.location.reload();
						} else {
							this.view.updateResultsDisplay( response, selectedPlatform );
						}
					});
				}
			}
		});
	}

	onDateTimeSubmit ( selectedDate ) {
		this.fetchResultsMarkup( selectedDate, this.view.getSelectedPlatform());
	}

	onPlatformPicked ( platform ) {
		this.fetchResultsMarkup( this.view.getSelectedDateTime(), platform );
		this.fetchPlayTimes( this.view.getSelectedDateTime(), platform );
	}
}

export default ResultsController;
