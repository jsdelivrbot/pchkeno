/* global PCHUSER,  $ */
import EventsMixin from "app/mixins/events";
import CardFlipView from "app/views/CardFlip";
import renderTemplate from "app/modules/templateLoader";
import animationUtil from "app/modules/animationUtil";
/**
 * This view class represents a Drawing
 
 */
const DrawingView = function () {};

class DrawingBall {
	constructor ( drawingNumber ) {
		this.drawingNumber = drawingNumber;
		this.drawingBall = this.createBall( drawingNumber );
		this.kenoBall = ``;
	}

	animate () {
		this.drawingBall.addClass( `drawing__ball--drop` );
	}
	createBall ( drawingNumber ) {
		const kenoBall = $(
			`<div class='drawing__ball'><span class='drawing__ball__num'>` +
				( `0` + drawingNumber ).slice( -2 ) +
				`</span></div>`
		);
		const kenoCardRoot = $( `#drawing__number-pad` );
		const targ = $( kenoCardRoot ).find(
			`ol li[data-number='` + drawingNumber + `']`
		);
		const position = targ.position();

		/* commenting for now, don't think this is necessary */
		// let offsetParent = targ.offsetParent();
		// while (offsetParent.length > 0 && offsetParent[0] != kenoCardRoot[0]) {
		// 	let parentPosition = offsetParent.position();
		// 	position.top += parentPosition.top;
		// 	position.left += parentPosition.left;
		// 	offsetParent = offsetParent.offsetParent();
		// }

		kenoBall.css( position );
		return kenoBall.appendTo( kenoCardRoot );
	}
	destroyBall () {
		this.drawingBall.remove();
	}
}

Object.assign( DrawingView.prototype, EventsMixin, {
	EVENTS: {
		DRAWING_ANIM_COMPLETE: `drawingAnimComplete`
	},

	init: function () {
		this.drawingNumbers = ``;
		this.drawingNumberBalls = [];
		this.promises = [];
		this.drawingBallAnimationTime = 2000;
		this.gameData = {};

		this.flipAnimationTime = 0.6;
	},
	setDrawingNumbers: function ( numbers ) {
		this.drawingNumbers = numbers;
	},
	getDrawingNumberBall: function ( index ) {
		return this.drawingNumberBalls[index];
	},

	pushDrawingNumberBall: function ( ball ) {
		this.drawingNumberBalls.push( ball );
	},

	draw: function () {
		this.drawNumbers();
	},
	mount: function ( ctx, url ) {
		this.hideLoader();
		this.url = url;

		this.matchAnimationTime = 2500;
		this.unmountUnderway = false;
		this.drawingPad = $( `#drawing__number-pad` );
		this.matchCards = $( `.drawing__side-game-match-card` );
		this.isLastDrawingNumber = false;
		this.sideMatchColumn = $( `#drawing__side-game-matches` );
		this.sideMatchOverlay = $( `#unrecognized-overlay` );
		// flip tabs
		this.cardFlipViews = [];
		this.maintenanceOverlay = $( `#maintenance-overlay` );
	},

	startDrawing: function ( drawingNumbers ) {
		this.setDrawingNumbers( drawingNumbers ); //need to fill in numbers

		if ( PCHUSER.type === `Guest` ) {
			this.showSideMatchOverlay();
		}

		this.resetDrawing();
		this.draw();
	},

	unmount: function () {
		this.showLoader();
		this.matchAnimationTime = 0;
		this.unmountUnderway = true;

		this.promises.forEach( function ( resolve ) {
			resolve();
		});
		this.drawingPad = null;
		this.matchBalls = null;
		this.matchCards = null;

		this.drawingNumberBalls.forEach( function ( ball ) {
			ball.drawingBall.remove();
		});
		this.drawingNumberBalls = [];

		if ( this.cardFlipViews ) {
			this.cardFlipViews.forEach( view => {
				view.unmount();
			});
			this.cardFlipViews = [];
		}

		//resolve all promises

		this.promises = [];
	},
	resetDrawing: function () {
		this.drawingNumberBalls.forEach( function ( ball ) {
			ball.drawingBall.remove();
		});
		this.drawingNumberBalls = [];
		this.promises = [];

		this.flipBackAllCards();
	},
	showSideMatchOverlay: function () {
		this.sideMatchColumn.css( `opacity`, `0.2` );
		this.sideMatchOverlay.show();
		animationUtil.animateFast(
			this.sideMatchOverlay,
			animationUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	updateSideMatches: function ( gamesPlayed ) {
		if ( typeof gamesPlayed !== `undefined` && gamesPlayed.length > 0 ) {
			gamesPlayed.forEach(
				function ( game ) {
					this.updateSideMatch( game );
				}.bind( this )
			);

			//populate did not play tabs
			for ( let x = gamesPlayed.length + 1; x <= 5; x++ ) {
				this.setDidNotPlaySideMatch( x );
			}
		} else {
			//populate all did not play tabs
			for ( let x = 1; x <= 5; x++ ) {
				this.setDidNotPlaySideMatch( x );
			}
		}
		if ( this.sideMatchesColumn ) {
			this.sideMatchColumn.css( `visibility`, `visible` );
		}

		this.buildFlipViews();
	},

	buildFlipViews: function () {
		this.cardFlipViews = [];
		const cardFlips = document.getElementsByClassName(
			`drawing__side-game-match-card cardflip`
		);

		if ( cardFlips.length ) {
			[ ...cardFlips ].forEach( el => {
				const cardFlipView = new CardFlipView();

				cardFlipView.mount( el, {
					useClickElements: true,
					disableClickAtStart: true
				});
				this.cardFlipViews.push( cardFlipView );
			});
		}
	},
	updateSideMatch: function ( game ) {
		const sideMatchHTML = $(
			renderTemplate( `shared/drawing-side-match.html`, {
				index: game.Card,
				picks: game.Picks,
				matches: game.NumberOfMatches,
				tokenPrize: parseInt( game.Tokens, 10 ).toLocaleString( `en-US` ),
				cashPrize: game.Cash,
				cashPrizeDisplay: parseInt( game.Cash, 10 ).toLocaleString( `en-US` )
			})
		);

		const sideMatchContainer = $( `.drawing__side-game-match-` + game.Card );
		const sideMatchContainerHTML = sideMatchContainer.find( `.side-match-data` );

		sideMatchContainerHTML.html( sideMatchHTML );
		if ( sideMatchContainer.hasClass( `drawing__side-game-match--did-not-play` )) {
			sideMatchContainer
				.removeClass( `drawing__side-game-match--did-not-play` )
				.addClass( `completed` );
		}
	},
	setDidNotPlaySideMatch: function ( cardNum ) {
		const sideMatchHTML = $(
			renderTemplate( `shared/drawing-side-match-did-not-play.html`, {
				index: cardNum
			})
		);
		const sideMatchContainer = $( `.drawing__side-game-match-` + cardNum );
		const sideMatchContainerHTML = sideMatchContainer.find( `.side-match-data` );

		sideMatchContainerHTML.html( sideMatchHTML );
		if ( sideMatchContainer.hasClass( `completed` )) {
			sideMatchContainer
				.removeClass( `completed` )
				.addClass( `drawing__side-game-match--did-not-play` );
		}
	},
	showLoader: function () {
		this.$drawingLoader =
			this.$drawingLoader || $( renderTemplate( `shared/pageLoader.html` ));
		if ( this.drawingPad ) {
			this.drawingPad.append( this.$drawingLoader );
		}

		animationUtil.animate( this.$drawingLoader, animationUtil.ANIMS.FADE_IN );
	},
	hideLoader: function () {
		animationUtil.animate(
			this.$drawingLoader,
			animationUtil.ANIMS.FADE_OUT,
			function () {
				this.$drawingLoader.remove();
			}.bind( this )
		);
	},

	//run the drawing animation, this is where the heavly lifting occurs
	drawNumbers: function () {
		const drawingNumbersLength = this.drawingNumbers.length;

		//loop through each drawingBall on the number pad
		for ( let x = 0; x < drawingNumbersLength; x++ ) {
			const drawingNumber = this.drawingNumbers[x];

			const drawingBall = this.createNewDrawingBall( drawingNumber, x );
			//add to collection of drawingballs

			this.pushDrawingNumberBall( drawingBall );

			let promiseResolve;
			//create a promise that will resolve when the previous ball has finished animating
			const promise = new Promise( resolve => {
				promiseResolve = resolve;
				if ( x > 0 ) {
					const previousBall = this.getDrawingNumberBall( x - 1 );

					animationUtil.onAnimationEnd(
						previousBall.drawingBall,
						true,
						function () {
							resolve();
						}
					);
				} else {
					//no previous ball so animate immediately
					resolve();
				}
			});

			//when resolved, animate the drawing ball and start the matching animation
			promise.then(() => {
				//animate drawing ball after this.drawingBallAnimationTime
				let ballAnimationTime = this.drawingBallAnimationTime;
				let matchAnimationTime = this.matchAnimationTime;
				//no delay for first ball

				if ( x === 0 ) {
					ballAnimationTime = 0;
					matchAnimationTime =
						matchAnimationTime - this.drawingBallAnimationTime;
				}
				if ( !this.unmountUnderway ) {
					setTimeout(
						function () {
							drawingBall.animate();
						}.bind( this ),
						ballAnimationTime
					);

					//animate matches after ball animation has completed
					setTimeout(
						function () {
							let lastBall = false;

							if ( x === drawingNumbersLength - 1 ) {
								lastBall = true;
							}
							if ( !this.unmountUnderway ) {
								this.matchGames( drawingNumber, lastBall );
							}
						}.bind( this ),
						matchAnimationTime
					);
				}
			});

			this.promises.push( promiseResolve );
		}
	},
	createNewDrawingBall: function ( drawingNumber, ballNumber ) {
		return new DrawingBall( drawingNumber, ballNumber );
	},

	drawNumber: function ( number ) {
		this.dropBall( number );
	},

	matchGames: function ( number, lastBall ) {
		//to make matches flip
		// option 1, create another promise, flip on then

		const matchBalls = $(
			`.drawing__side-game-match-card-numbers li div.drawing__side-game-match-card-numbers-ball`
		);
		const matchedBalls = [];
		const aliasThis = this;

		if ( lastBall ) {
			this.flipAllCards( this.onAnimationComplete.bind( this ));
			this.cardFlipViews.forEach( function ( cardFlipView ) {
				cardFlipView.enableHover();
				cardFlipView.enableClick();
			});
		}

		//look through all match balls on right side for matches
		matchBalls.each( function () {
			if ( parseInt( $( this ).text(), 10 ) === number ) {
				matchedBalls.push( $( this ));

				let promiseResolve;
				//create a promise that resolves when the previous ball animation has finished
				const promise = new Promise(
					function ( resolve ) {
						promiseResolve = resolve;
						if ( matchedBalls.length > 1 ) {
							const previousBall = matchedBalls[matchedBalls.length - 2];

							animationUtil.onAnimationEnd( previousBall, true, function () {
								resolve();
							});
						} else {
							//no previous ball so animate immediately
							resolve();
						}
					}.bind( this )
				);

				promise.then(
					function () {
						$( this ).addClass( `match` );
					}.bind( this )
				);

				aliasThis.promises.push( promiseResolve );
			}
		});
	},

	flipAllCards: function ( onComplete ) {
		let flipIndex = 0;
		const nextFlip = () => {
			if ( this.unmountUnderway ) {
				return;
			} else if ( flipIndex >= this.cardFlipViews.length ) {
				if ( onComplete ) {
					onComplete();
				}
				return;
			}
			this.cardFlipViews[flipIndex++].flipInDirection(
				CardFlipView.DIRECTIONS.top,
				nextFlip
			);
		};

		setTimeout(
			function () {
				if ( this.unmountUnderway ) {
					return;
				}
				nextFlip();
			}.bind( this ),
			this.matchAnimationTime
		);
	},

	flipBackAllCards: function () {
		this.cardFlipViews.forEach( function ( card ) {
			card.flipBack();
		});
	},

	onAnimationComplete: function () {
		this.fireEvent( this.EVENTS.DRAWING_ANIM_COMPLETE );
	},
	showMaintenanceMessage: function ( templateURL ) {
		const maintenanceMessage = $( renderTemplate( templateURL, {}));

		this.maintenanceOverlay.html( maintenanceMessage );
		this.maintenanceOverlay.show();
		animationUtil.animateFast(
			this.maintenanceOverlay,
			animationUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	}
});

//represents a drawing ball on the left number pad

export default DrawingView;
