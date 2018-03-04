import EventsMixin from "app/mixins/events";
import DrawingView from "app/views/Drawing";
import SelectDrawingTimeView from "app/views/SelectDrawingTime";
import DrawingAdView from "app/views/DrawingAd";
import animUtil from "app/modules/animationUtil";
/**
 * This view class represents the Live Drawings Page
 
 */
const PreviousDrawingsView = function () {};

Object.assign( PreviousDrawingsView.prototype, EventsMixin, {
	EVENTS: {
		AD_END: `onAdend`,
		DATE_CLICK: `onDateClick`
	},

	init: function () {
		this.drawingView = new DrawingView();
		this.drawingView.init();
		this.selectDrawingTimeView = new SelectDrawingTimeView();
		this.selectDrawingTimeView.init();
		this.selectDrawingTimeView.addEvent(
			this.selectDrawingTimeView.EVENTS.PLAYED_DRAW_CLICK,
			this.onPlayedDrawClick.bind( this )
		);
		this.drawingView.addEvent(
			this.drawingView.EVENTS.DRAWING_ANIM_COMPLETE,
			this.onDrawingEnd.bind( this )
		);
		this.adView = new DrawingAdView();
		this.adView.addEvent( this.adView.EVENTS.AD_END, this.onAdEnd.bind( this ));
	},

	mount: function ( ctx ) {
		this.drawingView.mount( ctx, `/js/json/winningnumbers.json` );
		this.activeTimestamp = ``;
		this.displayTime = $( `.drawing-time h2 span` );
		//this.drawingView.startDrawing();
		this.selectDrawingTimeView.mount( ctx );
		this.numberPad = document.getElementById( `drawing__number-pad` );
		this.drawingTimes = $( `.drawing-times` );
		this.adContainer = document.getElementById( `previous-drawing-ad-container` );
		this.drawingShowing = false;
		this.loadInitialDrawing();
	},

	unmount: function ( ctx ) {
		this.drawingView.unmount( ctx );
	},
	updateSideMatches: function ( gameData ) {
		this.drawingView.updateSideMatches( gameData );
	},
	onPlayedDrawClick: function () {
		if ( !this.drawingShowing ) {
			this.drawingShowing = true;
			this.activeTimestamp = this.selectDrawingTimeView.getActiveTimestamp();
			this.fireEvent( this.EVENTS.DATE_CLICK );

			this.showAd();
		}
	},
	showAd: function () {
		this.adView.loadVideoPlayer();
		this.hideNumberPad();
		this.showAdContainer();
	},
	onAdEnd: function () {
		console.log( `on ad end!` );
		this.fireEvent( this.EVENTS.AD_END );
	},
	showDrawing: function ( drawingNumbers ) {
		this.hideAdContainer();
		this.showNumberPad();
		this.startDrawingAnimation( drawingNumbers );
	},
	startDrawingAnimation: function ( drawingNumbers ) {
		this.drawingView.startDrawing( drawingNumbers );
	},
	hideNumberPad: function () {
		animUtil.animateFast(
			this.numberPad,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.numberPad.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	showNumberPad: function () {
		this.numberPad.style.visibility = `visible`;
		animUtil.animateFast(
			this.numberPad,
			animUtil.ANIMS.FADE_IN,
			function () {}.bind( this ),
			true
		);
	},
	showAdContainer: function () {
		this.adContainer.style.visibility = `visible`;
		animUtil.animateFast(
			this.adContainer,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	hideAdContainer: function () {
		animUtil.animateFast(
			this.adContainer,
			animUtil.ANIMS.FADE_OUT,
			function () {
				this.adContainer.style.visibility = `hidden`;
			}.bind( this ),
			true
		);
	},
	getActiveTimestamp: function () {
		return this.activeTimestamp;
	},
	getActiveDisplayTime: function () {
		return this.selectDrawingTimeView.getActiveDisplayTime();
	},
	updateDrawingTime: function ( time ) {
		this.displayTime.html( time );
	},
	showMaintenanceMessage: function ( cashTime ) {
		this.showNumberPad();
		if ( cashTime ) {
			var template = `shared/maintenance-cash.html`;
		} else {
			var template = `shared/maintenance-tokens.html`;
		}
		this.drawingView.showMaintenanceMessage( template );
		this.drawingShowing = false;
		this.selectDrawingTimeView.drawingShowing = false;
	},
	onDrawingEnd: function () {
		console.log( `drawing ended!` );
		this.drawingShowing = false;
		this.selectDrawingTimeView.drawingShowing = false;
	},
	loadInitialDrawing: function () {
		this.activeTimestamp = this.selectDrawingTimeView.getInitialTimestamp();
		this.drawingShowing = true;
		this.selectDrawingTimeView.drawingShowing = true;
		this.fireEvent( this.EVENTS.DATE_CLICK );
		this.showAd();
	}
});

export default PreviousDrawingsView;
