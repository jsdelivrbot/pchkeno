import $ from "vendor/zepto";

const SUBMIT_PENDING_CLASS = `btn--submit-pending`;
const DISABLED_CLASS = `btn--disabled`;

const ButtonView = {
	disableForSubmitPending: function ( btn ) {
		$( btn )
			.addClass( SUBMIT_PENDING_CLASS )
			.addClass( DISABLED_CLASS )
			.attr( `disabled`, `true` );
	},

	enableFromSubmitPending: function ( btn ) {
		$( btn )
			.removeClass( SUBMIT_PENDING_CLASS )
			.removeClass( DISABLED_CLASS )
			.attr( `disabled`, null );
	}
};

export default ButtonView;
