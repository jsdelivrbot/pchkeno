import KenoCountdownView from "app/views/KenoCountdown";

const factory = {
	countdown: function () {
		const view = new KenoCountdownView();
		//view.setClockOffset(window.KENO_GLOBALS && window.KENO_GLOBALS.CLIENT_TIME_OFFSET || 0);

		return view;
	}
};

export default factory;
