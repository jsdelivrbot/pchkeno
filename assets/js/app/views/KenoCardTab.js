import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import Snap from "vendor/snap.svg";
import CardFlipView from "app/views/CardFlip";
import CompletedTabView from "app/views/CompletedTab";

const ANIM_DURATION = 160;
const PROG_ANIM_DURATION = 750;

/**
 * This view represents the card tabs displayed along with a playable keno card
 * (that represent the completed/current/next cards to play.
 * It handles animating the unlock state of the card/tab
 */
const KenoCardTabView = function () {};

Object.assign( KenoCardTabView.prototype, EventsMixin, {
	EVENTS: {
		UNLOCK_ANIM_START: `animStart`,
		UNLOCK_ANIM_PROGRESS: `animProgress`,
		UNLOCK_ANIM_OUT: `animOut`,
		UNLOCK_ANIM_DONE: `animDone`,
		UNLOCK_ANIM_RESET: `animReset`,
		UPDATE_USER_NUMBERS: `updateUserNumbers`
	},

	// called after each route handled, this
	// is the view's opportunity to hook into any new content in the
	// page as needed
	mount: function ( ctx, withShadow ) {
		// flip tabs
		//

		this.getUserPickedNumbers();
		this.cardFlipViews = [];
		this.completedTabViews = [];
		this.completedCards = $(
			`.card-tab.card-tab--completed ul.card-tab__completed__nums`
		);

		this.completedCards.forEach( el => {
			const completedTabView = new CompletedTabView();

			completedTabView.mount( el );
			this.completedTabViews.push( completedTabView );
		});

		$( `.card-tab.cardflip` ).forEach( el => {
			const cardFlipView = new CardFlipView();

			cardFlipView.mount( el, {
				useClickElements: true
			});
			this.cardFlipViews.push( cardFlipView );
		});

		// the animated unlock tab
		this.rootNode = $( `.card-tab--animatable` );
		if ( this.rootNode.length === 0 ) {
			return;
		}
		this.isFirstCard = this.rootNode.hasClass( `card-tab--first` );
		this.isLastCard = this.rootNode.hasClass( `card-tab--last` );

		const stageEl = this.rootNode.find( `.card-tab__stage` );

		if ( stageEl.length === 0 ) {
			return;
		}
		this.stage = Snap( stageEl.get( 0 ));

		// create the graphics to animate
		// the paths we need are defined as <defs> in the svg in the page
		// we will grab those and their path data
		this.card = this.stage.select( `.card-tab__card` );
		// start/end path is for the main card tab background shape
		this.unlockAnimPathStart = this.card.attr( `d` );
		const endPathEl = this.stage.select( `.card-tab__card-end-path` );

		this.unlockAnimPathEnd = endPathEl.attr( `d` );
		this.progFill = endPathEl.attr( `data-prog-fill` );

		// add shadow
		this.useShadow = withShadow;
		if ( this.useShadow ) {
			//this.shadowFilter = this.stage.filter(Snap.filter.shadow(0, 0, 5, "#000000", 0.8));
			// kind of hacky, we need different shadows based on which card this is, because the top/bottom tabs
			// are more difficult to have the shadows seamlessly connect between this and the main card which
			// we will animate into
			if ( this.isFirstCard ) {
				this.shadowFilter = this.stage.filter(
					Snap.filter.shadow( 2, 3, 5, `#000000`, 0.5 )
				); // this for card 1
			} else if ( this.isLastCard ) {
				this.shadowFilter = this.stage.filter(
					Snap.filter.shadow( 2, -3, 5, `#000000`, 0.5 )
				); // this for the last card
			} else {
				this.shadowFilter = this.stage.filter(
					Snap.filter.shadow( 2, 0, 5, `#000000`, 0.5 )
				); // this for cards 2-4
			}
			/*
            this.card.attr({
                filter: this.shadowFilter
            });
            */
		}

		// the out paths are the key frame paths for the card tab shape as it is
		// morphing out at the end
		this.outPaths = [];
		this.outPathSwapAtIndex = 0;
		let el;

		do {
			el = this.stage.select(
				`.card-tab__card-out-path-` + this.outPaths.length
			);
			if ( el ) {
				this.outPaths.push( el.attr( `d` ));
				if ( el.attr( `data-swap` ) === `true` ) {
					this.outPathSwapAtIndex = this.outPaths.length - 1;
				}
			}
		} while ( el );
		this.circleOutline = null;
		this.progressAnim = null;

		// @TODO: temporary click handler to run/reset the animation
		//this.rootNode.on("click", this.toggleAnimation.bind(this));
		//this.card.click(this.toggleAnimation.bind(this));
		//setTimeout(this.toggleAnimation.bind(this), 1500);
	},

	unmount: function ( ctx ) {
		if ( this.cardFlipViews ) {
			this.cardFlipViews.forEach( view => {
				view.unmount();
			});
		}

		this.cardFlipViews = [];
		this.killAnimation();
		this.isAnimationComplete = false;
		if ( this.rootNode ) {
			this.rootNode.off( `click` );
			this.rootNode = null;
		}

		this.stage = null;
		this.card = null;
		this.circleOutline = null;
		this.progressAnim = null;
	},

	getUserPickedNumbers: function () {
		this.fireEvent( this.EVENTS.UPDATE_USER_NUMBERS );
	},
	updateUserNumbersHTML: function ( games ) {
		games.forEach(
			function ( game, index ) {
				this.completedTabViews[index].processNumbersHTML( game.Picks );
			}.bind( this )
		);
	},

	/*
    toggleAnimation: function() {
        if (this.isRunningAnimation) {
            return;
        }
        if (this.isAnimationComplete) {
            this.resetAnimation();
        } else {
            this.runAnimation();
        }
    },
    */

	runAnimation: function ( e ) {
		if (
			this.isRunningAnimation ||
			!this.rootNode ||
			this.rootNode.length === 0
		) {
			return;
		}
		this.isRunningAnimation = true;

		this.fireEvent( this.EVENTS.UNLOCK_ANIM_START );

		this.rootNode.addClass( `card-tab--unlocking` );

		// temporarily remove the shadow filter while animating
		// it is bad for performance, it will get added back on in animationDone()
		if ( this.useShadow ) {
			this.card.attr({ filter: null });
		}

		// morph the card down to a circle shape
		this.morphInAnim()
			.then(() => this.progressFillAnim())
			.then(() => this.morphOutAnim())
			.then(() => this.animationDone());
	},

	killAnimation: function () {
		if ( this.isRunningAnimation ) {
			this.isRunningAnimation = false;
			this.card.stop();
			if ( this.progressAnim ) {
				this.progressAnim.stop();
				this.progressAnim = null;
			}
		}
	},

	/**
	 * first stage of the animation, morphs from the starting shape to
	 * a circle shape
	 */
	morphInAnim: function () {
		return new Promise(( resolve, reject ) => {
			if ( !this.card ) {
				return;
			} // guard against unmount
			this.card.animate(
				{
					d: this.unlockAnimPathEnd
				},
				ANIM_DURATION,
				mina.easein,
				resolve
			);
		});
	},

	/**
	 * second stage of the animation, it animates the circle progress filling
	 * as the lock icon rotates and unlocks
	 */
	progressFillAnim: function () {
		return new Promise(( resolve, reject ) => {
			if ( !this.stage ) {
				return;
			} // guard against unmount

			this.fireEvent( this.EVENTS.UNLOCK_ANIM_PROGRESS );

			this.rootNode.addClass( `card-tab--unlocking-progress` );

			// progress fill animation (circle outline)
			const bbox = this.card.getBBox();
			const strokeWidth = 8;

			this.circleOutline = this.stage
				.circlePath( bbox.cx, bbox.cy, bbox.r1 - strokeWidth / 2 )
				.attr({
					// temporarily make the stroke the same color as the fill to avoid an initial flicker of seeing the
					// stroke outline appear before it is animated below
					stroke: this.card.attr( `fill` ),
					fillOpacity: 0,
					strokeWidth: strokeWidth,
					strokeLinecap: `square`
				});
			this.circleOutline.transform( `r90` ); // rotate so that the path starting point is at the top of the circle
			let path = this.circleOutline.attr( `d` ),
				pathLength = Snap.path.getTotalLength( path );

			this.progressAnim = Snap.animate(
				0,
				pathLength,
				step => {
					if ( !this.circleOutline ) {
						return;
					} // guard against unmount
					if ( step >= 1 ) {
						this.circleOutline.attr({
							stroke: this.progFill,
							path: Snap.path.getSubpath(
								path,
								pathLength - step,
								pathLength - 1
							)
						});
					}
				},
				PROG_ANIM_DURATION,
				mina.easeInOut,
				resolve
			);
		});
	},

	/**
	 * third stage of the animation, morphs from the filled circle back out to
	 * the ending shape
	 */
	morphOutAnim: function () {
		return new Promise(( resolve, reject ) => {
			if ( !this.circleOutline ) {
				return;
			} // guard against unmount

			this.fireEvent( this.EVENTS.UNLOCK_ANIM_OUT );

			this.circleOutline.remove();
			this.circleOutline = null;

			// morph back to full rect
			const outPaths = [].concat( this.outPaths );
			const outCard = this.stage.path( outPaths.shift());

			if ( this.useShadow ) {
				outCard.attr({
					fill: this.card.attr( `fill` ),
					filter: this.shadowFilter
				});
			} else {
				outCard.attr({
					fill: this.card.attr( `fill` )
				});
			}
			this.card.after( outCard );
			this.card.remove();
			this.card = outCard;
			const animDurationPerPath = ANIM_DURATION / outPaths.length;
			var animOut = function () {
				if ( !this.card ) {
					return;
				} // guard against unmount
				// start showing the end point thing
				if ( outPaths.length == this.outPaths.length - this.outPathSwapAtIndex ) {
					this.card.attr({
						d: outPaths.shift()
					});
				}

				this.card.animate(
					{
						d: outPaths.shift()
					},
					animDurationPerPath,
					outPaths.length === 0 ? mina.easeout : mina.linear,
					function () {
						if ( outPaths.length > 0 ) {
							animOut();
						} else {
							resolve();
						}
					}
				);
			}.bind( this );

			animOut();

			this.rootNode
				.addClass( `card-tab--unlocking-out` )
				.removeClass( `card-tab--unlocking` );
		});
	},

	animationDone: function () {
		this.rootNode.addClass( `card-tab--unlocked` );
		this.isRunningAnimation = false;
		this.isAnimationComplete = true;
		this.progressAnim = null;
		if ( this.useShadow ) {
			this.card.attr({ filter: this.shadowFilter });
		}
		this.fireEvent( this.EVENTS.UNLOCK_ANIM_DONE );
	},

	resetAnimation: function () {
		this.fireEvent( this.EVENTS.UNLOCK_ANIM_RESET );

		this.rootNode.removeClass(
			`card-tab--unlocked card-tab--unlocking-progress card-tab--unlocking-out`
		);

		this.card.attr( `d`, this.unlockAnimPathStart );

		this.isRunningAnimation = false;
		this.isAnimationComplete = false;
	}
});

Snap.plugin( function ( Snap, Element, Paper, global ) {
	Paper.prototype.circlePath = function ( cx, cy, r ) {
		let p = `M` + cx + `,` + cy;

		p += `m` + -r + `,0`;
		p += `a` + r + `,` + r + ` 0 1,0 ` + r * 2 + `,0`;
		p += `a` + r + `,` + r + ` 0 1,0 ` + -( r * 2 ) + `,0`;
		return this.path( p, cx, cy );
	};
});

export default KenoCardTabView;
