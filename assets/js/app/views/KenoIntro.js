/* global UUID, Snap, mina */
import EventsMixin from 'app/mixins/events';
import { delay } from 'lodash';
import CoachingLightBox from 'app/views/CoachingLightBox';
import coachingMessages from 'app/config/coaching-messages';
import OneADay from '../modules/OneADay';
const animDuration = 1000;

/**
 * This view class represents the intro animation
 */
const KenoIntroView = function () {};

Object.assign( KenoIntroView.prototype, EventsMixin, {
	EVENTS: {
		OUT_ANIM_START: `outAnimStart`,
		REVEALED: `contentReveal`
	},

	hasIntro: function () {
		return !!this.stage;
	},

	mount: function () {
		const el = document.querySelector( `.card-intro` );

		if ( !el ) {
			return;
		}
		this.stage = Snap( el );
		const stageBBox = this.stage.getBBox();

		this.stageSize = Math.max( stageBBox.width, stageBBox.height );
		// the overlay image that wipes out
		this.overlay = this.stage.select( `.card-intro__overlay` );
		// the cover fill that will be the content that appears
		this.coverFill = this.stage.rect( 0, 0, this.stageSize, this.stageSize );
		// the circle is what will get clipped out
		this.circleRadius = this.stageSize * 0.75;
		this.circleClip = this.stage.circle( stageBBox.cx, stageBBox.cy, 0 );
		this.circleClip.attr({
			fill: `#fff`
		});
		// create and use our mask
		this.clipMask = this.stage.group( this.coverFill, this.circleClip );
		this.overlay.attr({
			mask: this.clipMask
		});

		this.isMounted = true;
		this.coaching = new CoachingLightBox();
	},

	unmount: function () {
		this.isMounted = false;
		this.killAnimation();
		this.stage = null;
		this.circleClip = null;
		this.clipMask = null;
		this.overlay = null;
	},

	killAnimation: function () {
		this.isAnimationComplete = false;
		if ( this.isRunningAnimation ) {
			this.isRunningAnimation = false;
			if ( this.circleClip ) {
				this.circleClip.stop();
			}
		}
	},

	runAnimation: function () {
		if ( this.isRunningAnimation ) {
			return;
		}
		this.isRunningAnimation = true;

		// morph the card down to a circle shape
		this.introInAnim()
			.then(() => this.intervalAnim())
			.then(() => this.introOutAnim())
			.then(() => this.revealContentAnim())
			.then(() => this.animationDone())
			.then(() => {
				// Coaching screens
				if ( this.isAnimationComplete ) {
					this.coaching.show(
						coachingMessages.default.msg,
						coachingMessages.default.top,
						coachingMessages.default.left
					);
				}
			});
	},

	startAnimation: function ( animDelay ) {
		// start the animation after a delay
		if ( animDelay > 0 ) {
			delay( this.runAnimation.bind( this ), animDelay );
		} else {
			this.runAnimation();
		}
	},

	introInAnim: function () {
		const firstPlay = new OneADay( UUID, `firstPlay`, 1 ); // userId, storage key, num of days until trigger

		return new Promise(( resolve ) => {
			if ( !this.isMounted ) {
				return resolve();
			}

			firstPlay.checkIfFirstPlay().then(( val ) => {
				if( !val ) {
					this.overlay.clear();
				}
			});

			// fill in with image
			if ( this.circleClip ) {
				this.circleClip.animate(
					{
						r: this.circleRadius
					},
					animDuration,
					mina.linear,
					resolve
				);
			}
		});
	},

	intervalAnim: function () {
		return new Promise(( resolve ) => {
			if ( !this.isMounted ) {
				return resolve();
			}
			// briefly pause, then shrink back down
			delay( resolve, animDuration );
		});
	},

	introOutAnim: function () {
		this.fireEvent( this.EVENTS.OUT_ANIM_START );
		return new Promise(( resolve ) => {
			if ( !this.isMounted ) {
				return resolve();
			}
			this.circleClip.animate(
				{
					r: 0
				},
				animDuration,
				mina.linear,
				resolve
			);
		});
	},

	revealContentAnim: function () {
		return new Promise(( resolve ) => {
			if ( !this.isMounted ) {
				return resolve();
			}
			// reverse the masking, so that the content we reveal will be what is masked and the circle growing out
			// will reveal it underneath
			const cover = this.stage.rect( 0, 0, this.stageSize, this.stageSize );

			cover.insertBefore( this.overlay );
			cover.attr({
				fill: this.stage.attr( `data-prog-fill` )
			});
			this.overlay.remove();
			this.coverFill.attr({
				fill: `#fff`
			});
			this.circleClip.attr({
				fill: `#000`
			});
			cover.attr({
				mask: this.clipMask
			});

			// once shrunk, we reveal the card content underneath, and then grow back out to reveal it
			this.fireEvent( this.EVENTS.REVEALED );
			this.circleClip.animate(
				{
					r: this.circleRadius
				},
				animDuration,
				mina.linear,
				resolve
			);
		});
	},

	animationDone: function () {
		this.isRunningAnimation = false;
		this.isAnimationComplete = true;
		if ( this.stage ) {
			this.stage.remove();
		}
	}
});

export default KenoIntroView;
