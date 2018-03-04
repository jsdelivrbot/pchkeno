import $ from "vendor/zepto";
import ChoicesView from "app/views/Choices";
const GAME_CLASS = `choices__games__page__game`;

import renderTemplate from "app/modules/templateLoader";
import coachingMessages from "app/mobile/config/coaching-messages";
import CoachingLightBox from "../../views/CoachingLightBox";
const ChoicesViewMobile = function () {};

Object.assign( ChoicesViewMobile.prototype, ChoicesView.prototype, {
	showOutOfTimeOverlay: function () {
		this.timeUpModal = $( renderTemplate( `shared/mobile-iw-timeup.html` ));
		$( `body` ).append( this.timeUpModal );
		this.timeUpModal.modal({
			show: true,
			backdrop: false
		});
	},
	mount: function () {
		this.rootNode = $( `.choices__games` );
		this.minPlayTimeRequired =
			parseInt( this.rootNode.attr( `data-minplaytime` ), 10 ) || 0;
		this.screensContainer = this.rootNode.find( `.choices__games__pages` );
		this.rootNode.on(
			`click`,
			`.` + GAME_CLASS + `--playable`,
			this.onChoiceSelect.bind( this )
		);
		this.timeUpModal = $( `#instant-win-time-up-modal` );
		if ( this.isShown()) {
			const coaching = new CoachingLightBox();

			coaching.show(
				coachingMessages.instantWin.msg,
				coachingMessages.instantWin.top,
				coachingMessages.instantWin.left,
				coachingMessages.instantWin.class,
				`#main-content`,
				true
			);

			// window.setTimeout(() => {
			// 	coaching.hideLightbox();
			// }, 5000);
		}
	},
	unmount: function () {
		if ( this.rootNode ) {
			this.rootNode.off( `click` );
			this.rootNode = null;
		}
		this.screensContainer = null;
		this.selectedChoiceButton = null;
		if ( this.timeUpModal ) {
			this.timeUpModal.modal( `hide` );
		}
	}
});

export default ChoicesViewMobile;
