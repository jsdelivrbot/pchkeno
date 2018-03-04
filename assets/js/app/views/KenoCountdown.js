import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import Snap from "vendor/snap.svg";
import { padStart } from "lodash";
import Clock from "app/modules/Clock";

// this is the default remaining seconds to start the
// animation at, which can be overridden by supplying a data attribute
const DEFAULT_FINAL_COUNTDOWN_SECONDS = 15;
// this is the default remaining seconds that determines when the lockdown
// period begins
const ANIM_DURATION = 180;

const ANIMATING_CLASS = `clock--countdown`;

/**
 * This view represents the countdown clock.
 */
const KenoCountdownView = function () {};

Object.assign( KenoCountdownView.prototype, EventsMixin, {
	EVENTS: {
		TICK: `tick`
	},

	// called after each route handled, this
	// is the view's opportunity to hook into any new content in the
	// page as needed
	// @param parentRootElement The parent element to look for the clock element in
	// @param opts
	//  bool animateFinalCountdown - set to False if the final countdown shouldnt be animated
	mount: function ( parentScopeElement, opts ) {
		this.opts = Object.assign(
			{
				animateFinalCountdown: true
			},
			opts || {}
		);

		this.rootNode = $( parentScopeElement ).find( `.clock` );
		if ( this.rootNode.length === 0 ) {
			return;
		}
		const stageEl = this.rootNode.find( `.clock__stage` );

		if ( stageEl.length === 0 ) {
			return;
		}
		this.stage = Snap( stageEl.get( 0 ));

		// this is the clock shape that will morph
		this.clockShape = this.stage.select( `.clock__shape` );
		if ( this.clockShape ) {
			this.clockProgressFill = this.clockShape.attr( `data-stroke-fill` );
			this.clockStartFill = this.clockShape.attr( `stroke` );
			this.clockEndFill = this.clockShape.attr( `data-end-fill` );
			// note, stroke style should be declared in px
			this.strokeWidth = parseInt(
				$( this.clockShape.node ).css( `strokeWidth` ),
				10
			);
			this.endStrokeWidth = parseInt( this.strokeWidth * 0.6, 10 );
		}

		// these are the keyframe shapes to morph between
		// loop until we dont find any more index class suffixed elements
		// and store each of their path attributes, we will morph between each of these
		this.morphPaths = [];
		let el;

		do {
			el = this.stage.select( `.clock__morph` + this.morphPaths.length );
			if ( el ) {
				this.morphPaths.push( el.attr( `d` ));
			}
		} while ( el );

		// the text element to animate, we get the text from the
		// element in the page, then hide it and redraw it in SVG so we can can
		// draw it on a shape as needed during the animation
		const headerTextElem = $( `.clock__time__header` );

		headerTextElem.css( `visibility`, `hidden` );
		this.headerText = this.stage.select( `.clock__morphtext` );
		this.headerTextStartFill = this.headerText.attr( `fill` );
		this.headerTextStartPos = {
			x: this.headerText.attr( `x` ),
			y: this.headerText.attr( `y` )
		};
		this.headerTextPath = this.stage
			.select( `.clock__morphtextpath` )
			.attr({ fillOpacity: 0 });
		this.headerTextStartFontSize = this.headerText.attr( `fontSize` );
		this.headerTextEndFontSize = parseInt(
			this.headerText.attr( `data-end-fontsize` ),
			10
		);

		// these are the text path keyframe shapes to morph between
		this.textPaths = [];
		do {
			el = this.stage.select( `.clock__textmorph` + this.textPaths.length );
			if ( el ) {
				this.textPaths.push( el.attr( `d` ));
			}
		} while ( el );

		// the progress fill animation elements
		this.circleOutline = null;
		this.circleOutlinePath = null;
		this.circleOutlinePathLength = null;

		// the time component elements
		// get the element to update the ticking seconds with
		this.clockSeconds = this.rootNode.find( `.clock__seconds` );
		this.clockMinutes = this.rootNode.find( `.clock__minutes` );
		this.clockExpires = parseInt( this.rootNode.attr( `data-expires` ), 10 );
		this.countdownRemainingSeconds = this.clockExpires - this.now();

		// the remaining time in seconds at which point we should animate the clock
		this.finalCountdownSeconds =
			parseInt( this.rootNode.attr( `data-final-countdown` ), 10 ) ||
			DEFAULT_FINAL_COUNTDOWN_SECONDS;

		this.isMounted = true;

		// start clock ticking
		this._tick = this.tick.bind( this );
		Clock.addEvent( Clock.EVENTS.TICK, this._tick );
	},

	unmount: function () {
		this.killAnimation();
		this.isAnimationComplete = false;
		if ( this.rootNode ) {
			this.rootNode.off( `click` );
			this.rootNode = null;
		}

		this.stage = null;
		this.clockShape = null;
		this.headerText = null;
		this.headerTextPath = null;
		this.circleOutline = null;
		this.circleOutlinePath = null;
		this.circleOutlinePathLength = null;
		this.isMounted = false;

		if ( this._tick ) {
			Clock.removeEvent( Clock.EVENTS.TICK, this._tick );
			this._tick = null;
		}
	},

	getClockOffset: function () {
		return Clock.getClockOffset();
	},

	/**
	 * Reset the clock to a new expiration time
	 * will start counting down to that new time, and if
	 * the animation had already run, will revert the animation
	 */
	resetExpiration: function ( newExpires ) {
		this.clockExpires = newExpires;
		this.countdownRemainingSeconds = this.clockExpires - this.now();
		this.resetAnimation();
		this.setClockDisplay( this.countdownRemainingSeconds );
	},

	/**
	 * Returns timestamp in server time, in seconds (not js milliseconds)
	 */
	now: function () {
		return Clock.now();
	},

	// handles counting down the time, and updating the animation progress fill when animation in progress
	// fires the TICK event every second the time changes
	tick: function () {
		if ( !this.isMounted ) {
			return;
		}
		const nowSecondsRemaining = Math.max(
			0,
			Math.floor( this.clockExpires - this.now())
		);

		if ( nowSecondsRemaining < this.countdownRemainingSeconds ) {
			this.countdownRemainingSeconds = nowSecondsRemaining;
			this.setClockDisplay( this.countdownRemainingSeconds );
			this.fireEvent( this.EVENTS.TICK, [ this.countdownRemainingSeconds ]);

			if (
				this.opts.animateFinalCountdown &&
				nowSecondsRemaining <= this.finalCountdownSeconds &&
				!this.isRunningAnimation
			) {
				// mark the time that the final countdown began, so we can calculate the percent complete
				this.countdownStartSeconds = nowSecondsRemaining;
				// start the animation
				this.runAnimation();
			}
			if ( this.isRunningAnimation ) {
				this.progressFill( nowSecondsRemaining );
			}
		}
	},

	// updates the time displayed in the clock
	// @param int The time in seconds remaining
	setClockDisplay: function ( remainingTime ) {
		remainingTime = Math.ceil( remainingTime );
		const { mins, secs } = this.getClockDisplay( remainingTime );

		this.clockMinutes.text( padStart( `` + mins, 2, `0` ));
		this.clockSeconds.text( padStart( `` + secs, 2, `0` ));
	},

	getClockDisplay: function ( remainingTime ) {
		let mins, secs;

		if ( remainingTime <= 0 ) {
			mins = secs = 0;
		} else {
			secs = remainingTime % 60;
			mins = Math.floor( remainingTime / 60 );
		}
		return { mins, secs };
	},

	// starts the animation to the final countdown
	runAnimation: function () {
		if ( this.isRunningAnimation || this.rootNode == null ) {
			return;
		}
		this.isRunningAnimation = true;

		this.rootNode.addClass( ANIMATING_CLASS );

		// morph the card down to a circle shape
		this.morphInAnim().then(() => this.countdownAnim());
	},

	resetAnimation: function () {
		this.rootNode.removeClass( ANIMATING_CLASS );

		if ( this.clockShape ) {
			this.clockShape.attr({
				d: this.morphPaths[0],
				stroke: this.clockStartFill,
				fillOpacity: 0,
				strokeWidth: this.strokeWidth,
				strokeLinecap: `square`
			});
		}

		if ( this.headerText ) {
			this.headerText.attr({
				textpath: null,
				fill: this.headerTextStartFill,
				fontSize: this.headerTextStartFontSize,
				x: this.headerTextStartPos.x,
				y: this.headerTextStartPos.y
			});
			this.headerTextPath.attr( `d`, this.textPaths[0]);
		}

		if ( this.circleOutline ) {
			this.circleOutline.remove();
			this.circleOutline = null;
		}

		this.isRunningAnimation = false;
	},

	// stops running animation
	killAnimation: function () {
		if ( this.isRunningAnimation ) {
			this.isRunningAnimation = false;
			this.clockShape.stop();
			this.headerText.stop();
			this.headerTextPath.stop();
		}
	},

	// the first stage of the final countdown animation
	// morphs in from the starting shape to the circle shape
	morphInAnim: function () {
		return new Promise(( resolve, reject ) => {
			// morph the shape of the clock
			const morphPaths = this.morphPaths.slice( 1 );
			const animDurationPerPath = ANIM_DURATION / morphPaths.length;
			var animMorph = function () {
				const attribs = { d: morphPaths.shift() };

				if ( morphPaths.length === 0 ) {
					attribs.fillOpacity = 1;
				}
				this.clockShape.animate(
					attribs,
					animDurationPerPath,
					morphPaths.length === 0 ? mina.easeout : mina.linear,
					function () {
						if ( morphPaths.length > 0 ) {
							animMorph();
						} else {
							resolve();
						}
					}
				);
			}.bind( this );

			animMorph();

			// animate the stroke properties
			this.clockShape.animate(
				{ stroke: this.clockEndFill, strokeWidth: this.endStrokeWidth },
				ANIM_DURATION
			);

			// animate moprh the header text path
			// need to remove the x value when setting text path startOffset because of IE bug
			// see: http://www.webdeveloper.com/forum/showthread.php?267395-RESOLVED-SVG-textPath-startOffset-IE-bug
			this.headerText
				.attr({ textpath: this.headerTextPath, x: `` })
				.textPath.attr({ startOffset: `13%` });
			const textMorphPaths = this.textPaths.slice( 1 );
			const textAnimDurationPerPath = ANIM_DURATION / textMorphPaths.length;
			var animMorphText = function () {
				this.headerTextPath.animate(
					{ d: textMorphPaths.shift() },
					textAnimDurationPerPath,
					morphPaths.length === 0 ? mina.easeout : mina.linear, // sync the ease with the main clock shape easing
					function () {
						if ( textMorphPaths.length > 0 ) {
							animMorphText();
						}
					}
				);
			}.bind( this );

			animMorphText();

			// animate the text font
			this.headerText.animate(
				{ fill: this.clockEndFill, fontSize: this.headerTextEndFontSize },
				ANIM_DURATION
			);
		});
	},

	// second stage of the final countdown animation,
	// creates the progress fill shape
	countdownAnim: function () {
		// this sets up the elements needed for the final countdown
		// animation
		return new Promise(( resolve, reject ) => {
			const bbox = this.clockShape.getBBox();
			const oldClock = this.clockShape;

			this.clockShape = this.stage
				.circlePath( bbox.cx, bbox.cy, bbox.r1 - this.endStrokeWidth / 2 )
				.attr({
					fill: oldClock.attr( `fill` ),
					fillOpacity: 1,
					strokeWidth: this.endStrokeWidth,
					stroke: this.clockEndFill
				});
			oldClock.remove();

			this.circleOutline = this.stage
				.circlePath( bbox.cx, bbox.cy, bbox.r1 - this.endStrokeWidth / 2 )
				.attr({
					stroke: this.clockEndFill,
					fillOpacity: 0,
					strokeWidth: this.endStrokeWidth + 2,
					strokeLinecap: `square`
				});
			this.circleOutline.transform( `r90` ); // rotate so that the path starting point is at the top of the circle
			this.circleOutlinePath = this.circleOutline.attr( `d` );
			this.circleOutlinePathLength = Snap.path.getTotalLength(
				this.circleOutlinePath
			);
			this.circleOutline.attr({
				path: Snap.path.getSubpath(
					this.circleOutlinePath,
					this.circleOutlinePathLength,
					this.circleOutlinePathLength - 1
				)
			});

			resolve();
		});
	},

	// this will update the final countdown progress fill
	progressFill: function ( remainingSeconds ) {
		if ( !this.circleOutline ) {
			return;
		}
		// progress fill animation (circle outline)
		const percComplete = remainingSeconds / this.countdownStartSeconds;

		this.circleOutline.attr({
			stroke: this.clockProgressFill,
			path: Snap.path.getSubpath(
				this.circleOutlinePath,
				this.circleOutlinePathLength * percComplete,
				this.circleOutlinePathLength - 1
			)
		});
	},

	getRemainingSeconds: function () {
		return this.countdownRemainingSeconds;
	},

	getExpiresTime: function () {
		return this.clockExpires;
	},
	hide: function () {
		this.rootNode.hide();
	}
});

// http://svg.dabbles.info/snaptut-circlepath
Snap.plugin( function ( Snap, Element, Paper, global ) {
	Paper.prototype.circlePath = function ( cx, cy, r ) {
		let p = `M` + cx + `,` + cy;

		p += `m` + -r + `,0`;
		p += `a` + r + `,` + r + ` 0 1,0 ` + r * 2 + `,0`;
		p += `a` + r + `,` + r + ` 0 1,0 ` + -( r * 2 ) + `,0`;
		return this.path( p, cx, cy );
	};
});

export default KenoCountdownView;
