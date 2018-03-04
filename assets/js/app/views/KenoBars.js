import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import KenoBarView from "app/views/KenoBar";
import TutorialView from "app/views/Tutorial";
import animationUtil from "app/modules/animationUtil";

const GOLIVE_CLASS = `kenobars--golive`;
const REVERT_LIVE_CLASS = `kenobars--goprogress`;

/**
 * This view handles the multiple individual KenoBar views
 */
const KenoBarsView = function () {};

Object.assign( KenoBarsView.prototype, EventsMixin, {
	EVENTS: {
		GO_LIVE: `golive`
	},

	init: function () {
		this.kenoBarViews = [];
	},

	mount: function () {
		this.rootNode = $( `.kenobars` );
		this.rootNode.find( `.kenobar` ).forEach( el => {
			const barView = new KenoBarView();

			barView.init();
			barView.addEvent( barView.EVENTS.GO_LIVE, this.onGoLive.bind( this ));
			barView.mount( el );
			this.kenoBarViews.push( barView );
		});

		this.cashTime = parseInt( this.rootNode.attr( `data-cashtime` ), 10 ) > 0;

		this.paytableLink = this.rootNode.find( `.kenobar__controls__btn--paytable` );
		this.paytableLink.on( `click`, this.togglePaytable.bind( this ));
		this.paytableWrapper = $( `.kenobar__paytable__drawer` );
		this.paytableWrapper.on( `click`, `.close`, this.hidePaytable.bind( this ));

		this.tutorialView = new TutorialView();
		this.tutorialView.init();
		this.tutorialView.mount();
		this.rootNode.on(
			`click`,
			`.kenobar__controls__btn--howitworks`,
			this.tutorialView.show.bind( this.tutorialView )
		);
	},

	unmount: function () {
		this.rootNode.off( `click` );
		this.kenoBarViews.forEach( view => {
			view.unmount();
		});
		this.kenoBarViews = [];
		this.tutorialView.unmount();
		if ( this.paytableLink ) {
			this.paytableLink.off( `click` );
			this.paytableLink = null;
		}
	},

	// will flip the "Live Drawing Now" bar from the regular progress bar
	onGoLive: function () {
		// remove any open paytable in the current bar
		this.rootNode.addClass( GOLIVE_CLASS );
		animationUtil.onTransitionEnd( this.rootNode, true, () => {
			this.kenoBarViews.forEach( view => {
				if ( !view.isLiveBar ) {
					view.hide();
				}
			});
		});
		this.fireEvent( this.EVENTS.GO_LIVE );
	},

	// will flip back to the regular progress bar from the "Live Drawing Bar"
	showProgressBar: function () {
		this.kenoBarViews.forEach( view => {
			if ( !view.isLiveBar ) {
				view.unhide();
			}
		});
		this.rootNode.addClass( REVERT_LIVE_CLASS ).removeClass( GOLIVE_CLASS );
		animationUtil.onTransitionEnd( this.rootNode, true, () => {
			this.rootNode.removeClass( REVERT_LIVE_CLASS );
		});
	},

	isLockdownTime: function () {
		return this.rootNode.hasClass( GOLIVE_CLASS );
	},

	isCashTime: function () {
		return this.cashTime;
	},

	getPaytable: function () {
		return this.isCashTime() ? $( `.paytable--cash` ) : $( `.paytable--tokens` );
	},

	isPaytableOpen: function ( paytable ) {
		return paytable && paytable.parent().get( 0 ) == this.paytableWrapper.get( 0 );
	},

	togglePaytable: function ( e ) {
		e.preventDefault();
		const paytable = this.getPaytable();
		// close the paytable

		if ( this.isPaytableOpen( paytable )) {
			this.hidePaytable();
		} else {
			// open the paytable
			paytable.appendTo( this.paytableWrapper );
			animationUtil.animate(
				this.paytableWrapper,
				animationUtil.ANIMS.SLIDE_IN_UP
			);
		}
	},

	hidePaytable: function () {
		const paytable = this.getPaytable();

		if ( this.isPaytableOpen( paytable )) {
			animationUtil.animate(
				this.paytableWrapper,
				animationUtil.ANIMS.SLIDE_OUT_DOWN,
				() => {
					paytable.appendTo( document.body );
				}
			);
		}
	},

	/**
	 * Updates the view state based on the given app state
	 */
	updateFromAppState: function ( appModel ) {
		this.cashTime = appModel.cashTime;
		let returnToProgressState = false;

		this.kenoBarViews.forEach( view => {
			view.updateFromAppState( appModel );
			if ( !view.isLiveBar && view.hasRemainingTime()) {
				returnToProgressState = true;
			}
		});
		if ( returnToProgressState ) {
			this.showProgressBar();
		}
	}
});

export default KenoBarsView;
