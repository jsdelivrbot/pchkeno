import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";

const SelectDrawingTimeView = function () {};

Object.assign( SelectDrawingTimeView.prototype, EventsMixin, {
	EVENTS: {
		PLAYED_DRAW_CLICK: `onPlayedDrawClick`
	},
	init: function () {},

	mount: function () {
		this.rootNode = $( `.drawing-times` );
		this.leftArrow = this.rootNode.find( `.left-arrow` );
		this.leftArrow.addClass( `disabled` ); //default state is left arrow disabled
		this.rightArrow = this.rootNode.find( `.right-arrow` );
		this.scroller = this.rootNode.find( `.drawing-times-scroller` );
		this.rootNode.on( `click`, `.left-arrow`, this.onLeftArrowClick.bind( this ));
		this.rootNode.on(
			`click`,
			`.right-arrow`,
			this.onRightArrowClick.bind( this )
		);
		this.rootNode.on(
			`click`,
			`.previous-drawing-time a`,
			this.dateClick.bind( this )
		);
		this.drawingShowing = false;
		this.drawingTimes = this.rootNode.find( `.drawing-times-container ul li a` );
	},
	onLeftArrowClick: function () {
		if ( !this.leftArrow.hasClass( `disabled` )) {
			this.leftArrow.addClass( `disabled` );
			this.rightArrow.removeClass( `disabled` );
			this.scrollRight();
		}
	},
	onRightArrowClick: function () {
		if ( !this.rightArrow.hasClass( `disabled` )) {
			this.leftArrow.removeClass( `disabled` );
			this.rightArrow.addClass( `disabled` );
			this.scrollLeft();
		}
	},
	scrollLeft: function () {
		this.scroller.addClass( `scroll-left` );
	},
	scrollRight: function () {
		this.scroller.removeClass( `scroll-left` );
	},
	dateClick: function ( e ) {
		e.preventDefault();

		if ( !this.drawingShowing ) {
			if ( e.currentTarget.className.indexOf( `unavailable` ) == -1 ) {
				this.drawingShowing = true;
				$( `.drawing-times .previous-drawing-time a.active` ).removeClass(
					`active`
				);
				this.gameTimestampId = e.currentTarget.getAttribute( `data-timestamp` );
				this.activeDisplayTime = e.currentTarget.innerHTML + ` ET`;
				this.fireEvent( this.EVENTS.PLAYED_DRAW_CLICK );
				e.currentTarget.classList.add( `active` );
			}
		}
	},
	getActiveTimestamp: function () {
		return this.gameTimestampId;
	},
	getInitialTimestamp: function () {
		this.drawingTimes.each(( index, drawingTime ) => {
			if ( !drawingTime.classList.contains( `unavailable` )) {
				this.gameTimestampId = drawingTime.getAttribute( `data-timestamp` );
				this.activeDisplayTime = drawingTime.innerHTML + ` ET`;
				drawingTime.classList.add( `active` );
				return false;
			}
		});
		return this.gameTimestampId;
	},
	getActiveDisplayTime: function () {
		return this.activeDisplayTime;
	}
});

export default SelectDrawingTimeView;
