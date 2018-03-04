/* global Modernizr */
import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";

const SKIP_LINK_CLASS = `tutorial__controls__skip`;
const SKIP_LINK_ACTIVE_CLASS = `tutorial__controls__skip--active`;
const SCREEN_IMAGE_CLASS = `tutorial__screen__img`;

/**
 * This view handles the multiple individual KenoBar views
 */
const TutorialView = function () {};

Object.assign( TutorialView.prototype, EventsMixin, {
	EVENTS: {},

	init: function () {},

	mount: function () {
		this.rootNode = $( `.tutorial` );
		this.rootNode.on(
			`click touchstart`,
			`.tutorial__controls__btn--prev`,
			this.goBack.bind( this )
		);
		this.rootNode.on(
			`click touchstart`,
			`.tutorial__controls__btn--next`,
			this.goForward.bind( this )
		);
		this.rootNode.on(
			`click touchstart`,

			`.` + SKIP_LINK_CLASS,
			this.onSkipToPage.bind( this )
		);
		this.screensContainer = this.rootNode.find( `.tutorial__screens` );
		this.screenImages = this.rootNode.find( `.` + SCREEN_IMAGE_CLASS );
		this.skipLinks = this.rootNode.find( `.` + SKIP_LINK_CLASS );
		this.numPages = this.skipLinks.length;

		this.closeBinded = false;

		// @TODO dev only
		//this.show();
	},

	unmount: function () {
		this.rootNode.off( `click` );
		this.rootNode = null;
		this.skipLinks = null;
		this.screensContainer = null;
	},

	show: function ( backdrop = true, onClose = null ) {
		/* lazy load all images on show */
		this.screenImages.forEach( img => {
			if ( img.src === `` ) {
				img.src = img.dataset.srcset;
			}
		});
		this.rootNode.modal({
			backdrop: backdrop
		});

		//prevent close button binded twice, causes issues when showing tutorial multiple times

		if ( onClose && !this.closeBinded ) {
			$( `.close` ).on( `click`, () => {
				onClose();
			});
			this.closeBinded = true;
		}
	},

	getActivePageNum: function () {
		return parseInt(
			this.skipLinks.filter( `.` + SKIP_LINK_ACTIVE_CLASS ).attr( `data-page` ),
			10
		);
	},

	goBack: function ( e ) {
		if ( e ) {
			e.preventDefault();
		}
		this.goToPage( this.getActivePageNum() - 1 );
	},

	goForward: function ( e ) {
		if ( e ) {
			e.preventDefault();
		}
		this.goToPage( this.getActivePageNum() + 1 );
	},

	onSkipToPage: function ( e ) {
		e.preventDefault();
		let $targ = $( e.target );

		if ( !$targ.hasClass( SKIP_LINK_CLASS )) {
			$targ = $targ.parents( `.` + SKIP_LINK_CLASS );
		}
		this.goToPage( parseInt( $targ.attr( `data-page` ), 10 ));
	},

	goToPage: function ( pageNum ) {
		if ( !pageNum || pageNum < 1 || pageNum > this.numPages ) {
			return;
		}
		//note: zepto.css doesnt seem to work with "transform", thus using .style instead
		//this.screensContainer.css(Modernizr.prefixed("transform"), "translateX(" + ((pageNum - 1) * -100) + "%)");
		this.screensContainer.get( 0 ).style[Modernizr.prefixed( `transform` )] =
			`translateX(` + ( pageNum - 1 ) * -100 + `%)`;
		this.skipLinks
			.removeClass( SKIP_LINK_ACTIVE_CLASS )
			.filter( `[data-page="` + pageNum + `"]` )
			.addClass( SKIP_LINK_ACTIVE_CLASS );
	}
});

export default TutorialView;
