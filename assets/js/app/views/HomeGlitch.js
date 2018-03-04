import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";

/**
 * This view represents the home page glitch view for unexpected failures
 * when the card cannot be played
 */
const HomeGlitchView = function () {};

Object.assign( HomeGlitchView.prototype, EventsMixin, {
	EVENTS: {
		SUBMIT: `submit`
	},

	mount: function ( ctx ) {
		this.rootNode = $( `.cardglitch` );
		this.rootNode.on(
			`click`,
			`.cardglitch__btn`,
			this.onSubmitClick.bind( this )
		);
	},

	unmount: function () {
		this.rootNode.off( `click` );
		this.rootNode = null;
	},

	hasError: function () {
		return this.rootNode != null && this.rootNode.length > 0;
	},

	onSubmitClick: function ( e ) {
		e.preventDefault();
		this.fireEvent( this.EVENTS.SUBMIT );
	}
});

export default HomeGlitchView;
