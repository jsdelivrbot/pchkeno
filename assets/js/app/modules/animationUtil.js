import animatejs from "animatejs";

const ANIM_FAST_CLASS = `animated--fast`;

/**
 * A static utility intended for use with resources/assets/css/vendor/animate.css
 *
 * Some animation name constants are supplied, but not all, add others as you need them
 */
const AnimationUtil = {};

Object.assign( AnimationUtil, animatejs, {
	ANIMS: {
		FADE_OUT: `fadeOut`,
		FADE_IN: `fadeIn`,
		FADE_IN_LEFT: `fadeInLeft`,
		FADE_IN_RIGHT: `fadeInRight`,
		FADE_IN_DOWN: `fadeInDown`,
		SLIDE_IN_UP: `slideInUp`,
		SLIDE_IN_DOWN: `slideInDown`,
		SLIDE_OUT_DOWN: `slideOutDown`,
		SLIDE_OUT_UP: `slideOutUp`,
		SLIDE_IN_LEFT: `slideInLeft`,
		SLIDE_IN_RIGHT: `slideInRight`,
		SLIDE_OUT_LEFT: `slideOutLeft`,
		SLIDE_OUT_RIGHT: `slideOutRight`,
		BOUNCE_IN_RIGHT: `bounceInRight`,
		BOUNCE_IN_LEFT: `bounceInLeft`
	},

	/**
	 * Animate a given element with the given animation class, using the faster speed variant
	 *
	 * @param HTMLElement|Zepto|string Any zepto compatible selector of the element to animate
	 * @param string animName the animation name to animate with
	 * @param function callback Optional callback to fire on complete
	 * @param bool True if the classes should not be removed when complete (default is that they are removed)
	 */
	animateFast: function ( el, animName, callback, persistClasses ) {
		this.animate( el, animName, callback, ANIM_FAST_CLASS, persistClasses );
	},

	/**
	 * Shorthand to the fadeOutIn method with the "fast" extra class
	 */
	fadeOutInFast: function ( el, outCallback, inCallback, persistClasses ) {
		this.fadeOutIn(
			el,
			outCallback,
			inCallback,
			ANIM_FAST_CLASS,
			persistClasses
		);
	}
});

for ( const animName in AnimationUtil.ANIMS ) {
	if ( AnimationUtil.ANIMS.hasOwnProperty( animName )) {
		AnimationUtil.makeKnown( AnimationUtil.ANIMS.animName );
	}
}

export default AnimationUtil;
