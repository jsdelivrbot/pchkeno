/* global $, PCHUSER */

import DrawingView from "app/views/Drawing";
import renderTemplate from "app/modules/templateLoader";
const DrawingViewMobile = function () {};

class DrawingBall {
	constructor ( drawingNumber, container ) {
		this.drawingNumber = drawingNumber;
		this.container = container;
		this.drawingBall = container;
	}

	animate () {
		this.drawingBall.append(( `0` + this.drawingNumber ).slice( -2 ));
		this.drawingBall.addClass( `drawn` );
	}

	destroyBall () {
		this.drawingBall.remove();
	}
}

Object.assign( DrawingViewMobile.prototype, DrawingView.prototype, {
	init: function () {
		this.drawingNumbers = ``;
		this.drawingNumberBalls = [];
		this.promises = [];
		this.drawingBallAnimationTime = 2000;
		this.gameData = {};

		this.flipAnimationTime = 0.6;
	},
	mount: function () {
		this.drawnNumbers = $( `.live-drawing-numbers ul li` );
		this.matchCards = $( `.drawing__side-game-match-card` );
		this.cardFlipViews = [];
		this.matchAnimationTime = 2500;
		this.isLastDrawingNumber = false;
		this.unmountUnderway = false;
		this.lockdownContainer = document.getElementById( `live-drawing__lockdown` );
	},
	createNewDrawingBall: function ( drawingNumber, ballNumber ) {
		const ballContainer = this.drawnNumbers.eq( ballNumber );

		return new DrawingBall( drawingNumber, ballContainer );
	},
	startDrawing: function ( drawingNumbers ) {
		this.setDrawingNumbers( drawingNumbers );
		this.resetDrawing();
		this.draw();
		if ( PCHUSER.type === `Guest` ) {
			this.showSideMatchOverlay();
		}
	},
	showSideMatchOverlay: function () {
		const matchOverlay = $(
			renderTemplate( `shared/mobile-live-drawing-unrecognized-overlay.html`, {
				loginURL: this.lockdownContainer.dataset.loginUrl,
				registerURL: this.lockdownContainer.dataset.registrationUrl
			})
		);

		matchOverlay.modal({ show: true, backdrop: false });
		matchOverlay.css( `top`, `250px` );
	}
});

//represents a drawing ball on the left number pad

export default DrawingViewMobile;
