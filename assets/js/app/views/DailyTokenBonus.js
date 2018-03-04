import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import ButtonView from "app/views/Button";

const DailyTokenBonusView = function () {};

/**
 * View responsible for handling the daily token bonus view modal
 */
Object.assign( DailyTokenBonusView.prototype, EventsMixin, {
	EVENTS: {
		SUBMIT: `onSubmit`,
		CLOSED: `onClose`
	},

	init: function () {},

	mount: function () {
		this.rootNode = $( `.dailybonus` );
		this.submitBtn = this.rootNode.find( `.btn--submit` );
		this.submitBtn.on( `click`, this.onSubmit.bind( this ));
		this.timeoutSeconds = parseInt( this.rootNode.attr( `data-timeout` ), 10 ) || 0;
	},

	unmount: function () {
		if ( this.rootNode ) {
			if ( this._shownPromise ) {
				this.hide();
			}
			this.rootNode.off( `click` );
			this.rootNode.off( `hiddenbsmodal` );
			this.rootNode = null;
		}
		if ( this.submitBtn ) {
			this.submitBtn.off( `click` );
			this.submitBtn = null;
		}
	},

	show: function () {
		this._shownPromise = new Promise( resolve => {
			this.rootNode.modal({ backdrop: `static` }); // static means the backdrop click wont close it, see: http://getbootstrap.com/javascript/#modals
			this.rootNode.on( `hiddenbsmodal`, () => {
				this.rootNode.off( `hiddenbsmodal` );
				this._shownPromise = null;
				this.fireEvent( this.EVENTS.CLOSED );
				resolve();
			});
			if ( !!this.timeoutSeconds ) {
				this.autoSubmitTimer = window.setTimeout(
					this.fireSubmit.bind( this ),
					this.timeoutSeconds * 1000
				);
			}
		});
		return this._shownPromise;
	},

	hide: function () {
		this.rootNode.modal( `hide` );
	},

	fireSubmit: function () {
		this.fireEvent( this.EVENTS.SUBMIT );
		ButtonView.disableForSubmitPending( this.submitBtn );
		if ( this.autoSubmitTimer ) {
			window.clearTimeout( this.autoSubmitTimer );
			this.autoSubmitTimer = null;
		}
	},

	onSubmit: function ( e ) {
		e.preventDefault();
		this.fireSubmit();
	}
});

export default DailyTokenBonusView;
