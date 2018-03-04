/* */

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});
/* originally pulled from: https://gist.github.com/foolyoghurt/b76988ef05fbeaaf04ae

/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
var transitionend = {
	transition: 'transitionend',
	WebkitTransition: 'webkitTransitionEnd',
	MozTransition: 'mozTransitionEnd',
	OTransition: 'oTransitionEnd',
	msTransition: 'MSTransitionEnd',
};

var animationend = {
	animation: 'animationend',
	WebkitAnimation: 'webkitAnimationEnd',
	MozAnimation: 'mozAnimationEnd',
	OAnimation: 'oAnimationEnd',
	msAnimation: 'MSAnimationEnd',
};

var testEl = document.createElement('div');
var style = testEl.style;

// On some platforms, in particular some releases of Android 4.x,
// the un-prefixed "animation" and "transition" properties are defined on the
// style object but the events that fire will still be prefixed, so we need
// to check if the un-prefixed events are useable, and if not remove them
// from the map
if (!('AnimationEvent' in window)) {
	delete animationend.animation;
}
if (!('TransitionEvent' in window)) {
	delete transitionend.transition;
}

var prefixedAnimationEnd = animationend.animation;
if (!('animation' in style)) {
	for (var styleName in animationend) {
		if (styleName in style) {
			exports.prefixedAnimationEnd = prefixedAnimationEnd =
				animationend[styleName];
			break;
		}
	}
}

var prefixedTransitionEnd = transitionend.transition;
if (!('transition' in style)) {
	for (var _styleName in transitionend) {
		if (_styleName in style) {
			exports.prefixedTransitionEnd = prefixedTransitionEnd =
				transitionend[_styleName];
			break;
		}
	}
}

exports.prefixedTransitionEnd = prefixedTransitionEnd;
exports.prefixedAnimationEnd = prefixedAnimationEnd;
