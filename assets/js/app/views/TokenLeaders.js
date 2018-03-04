import $ from "vendor/zepto";
import animUtil from "app/modules/animationUtil";

const TokenLeadersView = function () {};

Object.assign( TokenLeadersView.prototype, {
	init: function () {
		this.messageShowing = false;
	},
	mount: function () {
		this.helpIcon = $( `.token-leaders__help-icon` );
		this.helpMessage = $( `#dw_popup` );
		this.helpIcon.on(
			`mouseenter touchstart`,
			function () {
				this.showHelpMessage();
				this.hideHelpMessageOnBodyClick();
			}.bind( this )
		);
		this.helpIcon.on(
			`mouseleave`,
			function () {
				this.hideHelpMessage();
			}.bind( this )
		);
	},
	showHelpMessage: function () {
		this.helpMessage.show();
		animUtil.animateFast(
			this.helpMessage,
			animUtil.ANIMS.FADE_IN,
			function () {
				this.messageShowing = true;
			}.bind( this ),
			true
		);
	},
	hideHelpMessage: function () {
		animUtil.animateFast(
			this.helpMessage,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.helpMessage.hide();
				this.messageShowing = false;
			}.bind( this ),
			true
		);
	},
	hideHelpMessageOnBodyClick: function () {
		//handle tablet click
		$( document ).on(
			`touchstart`,
			function () {
				if ( this.messageShowing ) {
					this.hideHelpMessage();
				}
			}.bind( this )
		);
	}
});

export default TokenLeadersView;
