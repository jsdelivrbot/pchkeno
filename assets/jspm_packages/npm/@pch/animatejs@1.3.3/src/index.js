/* */ 
"format cjs";
const ANIM_CLASS = "animated";
const FADE_OUT_CLASS = "fadeOut";
const FADE_IN_CLASS = "fadeIn";

var knownClasses = {};

/* start prefixed code: originally pulled from: https://gist.github.com/foolyoghurt/b76988ef05fbeaaf04ae
/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
var transitionend = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'mozTransitionEnd',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd'
};

var animationend = {
    'animation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'mozAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd'
};

var animationiteration = {
    'animation': 'animationiteration',
    'WebkitAnimation': 'webkitAnimationIteration',
    'MozAnimation': 'mozAnimationIteration',
    'OAnimation': 'oAnimationIteration',
    'msAnimation': 'MSAnimationIteration'
};

// On some platforms, in particular some releases of Android 4.x,
// the un-prefixed "animation" and "transition" properties are defined on the
// style object but the events that fire will still be prefixed, so we need
// to check if the un-prefixed events are useable, and if not remove them
// from the map
if(!('AnimationEvent' in window)) {
    delete animationend.animation;
    delete animationiteration.animation;
}
if(!('TransitionEvent' in window)) {
    delete transitionend.transition;
}

var style = document.createElement('div').style;

var prefixedAnimationEnd = animationend.animation;
var prefixedAnimationIteration = animationiteration.animation;
if(!("animation" in style)) {
    for(let styleName in animationend) {
        if(styleName in style) {
            prefixedAnimationEnd = animationend[styleName];
            break;
        }
    }
    for(let styleName in animationiteration) {
        if(styleName in style) {
            prefixedAnimationIteration = animationiteration[styleName];
            break;
        }
    }
}

var prefixedTransitionEnd = transitionend.transition;
if(!("transition" in style)) {
    for(let styleName in transitionend) {
        if(styleName in style) {
            prefixedTransitionEnd = transitionend[styleName];
            break;
        }
    }
}
/* end prefixed code */

function removeClasses(el, extraClass) {
    for(var i = el.classList.length - 1; i >= 0; i--) {
        if(knownClasses[el.classList[i]]) {
            el.classList.remove(el.classList[i]);
        }
    }
    el.classList.remove(ANIM_CLASS);
    if(extraClass) {
        el.classList.remove(extraClass);
    }
}

function addClasses(el, animName, extraClass) { 
    el.classList.add(animName);
    el.classList.add(ANIM_CLASS);
    if(extraClass) {
        el.classList.add(extraClass);
    }
}

function eachEl(el, func) {
    if(!el) { return; }
    if(el instanceof HTMLElement) { el = [el]; }
    for(var i = 0, n = el.length || 0; i < n; i++) { 
        func(el[i]);
    }
}

function bindEvent(el, eventName, once, callback) { 
    eachEl(el, (targ) => {
        let handler = (ev) => {
            // this is to guard against the bubbling of child elements triggering the callback
            // we want only the event specific to our target
            if(ev.target === targ) {
                callback(targ);
                if(once) { targ.removeEventListener(eventName, handler, false); }
            }
        };
        targ.addEventListener(eventName, handler, false);
    });
}

/**
* A static utility intended for use with resources/assets/css/vendor/animate.css
*
* When running an animation, this utility will remove other animation classes first, but only those it is aware of.
* It becomes aware of the animation classes the first time they are used, but you can preload more by calling makeAware()
*/
var AnimationUtil = {

    /**
    * Make this module aware of a classname that should be manipulated
    * when animating with the animate() method... all known classes
    * are removed before/after animating to avoid conflicting animations.
    * This list is automatically updated whenever you call animate() with a new class name
    * but you can prefill the list with classes using makeKnown() if you need to for whatever reason
    */
    makeKnown: function(animName) {
        knownClasses[animName] = true;
    },

    /**
    * Animate a given element with the given animation class
    *
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery The element(s) to animate.
    * @param string animName the animation name to animate with
    * @param function callback Optional callback to fire on complete (fires once for eache element), the callback is passed the element
    * @param string optional extra classname to add, this allows you to override parts of the animations by adding your own class 
    *   (e.g add "fast" that adds a style declaration to speed up the animation timing)
    * @param bool True if you want the classes to persist after completion, otherwise they are removed by default
    */
    animate: function(el, animName, callback, extraClass, persistClasses) { 
        knownClasses[animName] = true;
        eachEl(el, (targ) => { 
            let handler = function(ev) {
                if(!persistClasses) { removeClasses(targ, extraClass); }
                if(callback) { callback(targ); }
            };
            removeClasses(targ, extraClass);
            addClasses(targ, animName, extraClass);
            bindEvent(targ, prefixedAnimationEnd, true, handler);
        });
    },

    /**
    * Convenience method to run two animations in sequence and callbacks when both end
    * for example, fade out, callback, fade back in and another callback
    *
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery the elements to animate
    * @param string The first animation to run
    * @param string the second animation to run
    * @param function Optional callback to fire on the first animation complete
    * @param function Optional callback to fire on second animation complete
    * @param string optional extra classname to add (see animate method for details)
    * @param bool True if you want the classes to persist after completion, otherwise they are removed by default
    */
    animateOutIn: function(el, animOutName, animInName, outCallback, inCallback, extraClass, persistClasses) {
        this.animate(el, animOutName, (targ) => {
            if(outCallback) {
                outCallback(targ);
            }
            this.animate(targ, animInName, inCallback, extraClass, persistClasses);
        }, extraClass, persistClasses);
    },

    /**
    * Convenience method to fade out and back in with callbacks in between
    * (see animateOutIn for more details)
    *
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery the elements to animate
    * @param function Optional callback to fire on the first animation complete
    * @param function Optional callback to fire on second animation complete
    * @param string optional extra classname to add (see animate method for details)
    * @param bool True if you want the classes to persist after completion, otherwise they are removed by default
    */
    fadeOutIn: function(el, outCallback, inCallback, extraClass, persistClasses) {
        this.animateOutIn(el, FADE_OUT_CLASS, FADE_IN_CLASS, outCallback, inCallback, extraClass, persistClasses);
    },

    /**
    * Bind to a animationend event
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery
    * @param bool once True if you only want a one-time handler
    * @param function callback 
    */
    onAnimationEnd: function(el, once, callback) {
        bindEvent(el, prefixedAnimationEnd, once, callback);
    },

    /**
    * Remove an animationend event listener
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery
    * @param function The listener to remove
    */
    offAnimationEnd: function(el, handler) {
        eachEl(el, (targ) => { 
            targ.removeEventListener(prefixedAnimationEnd, handler, false);
        });
    },

    /**
    * Bind to animationiteration event. The animationend event never fires
    * if your animation is infinite, but the iteration event is called on each iteration
    * so you can use this event instead
    *
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery
    * @param bool once True if you only want a one-time handler
    * @param function callback
    */
    onAnimationIteration: function(el, once, callback) {
        bindEvent(el, prefixedAnimationIteration, once, callback);
    },

    /**
    * Remove an animationiteration event listener
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery
    * @param function The listener to remove
    */
    offAnimationIteration: function(el, handler) {
        eachEl(el, (targ) => {
            targ.removeEventListener(prefixedAnimationIteration, handler, false);
        });
    },

    /**
    * Bind to a transitionend event
    * @param mixed HTMLElement|HTMLElement[]|NodeList|jQuery
    * @param bool once True if you only want a one-time handler
    * @param function callback 
    */
    onTransitionEnd: function(el, once, callback) {
        bindEvent(el, prefixedTransitionEnd, once, callback);
    },

    /**
    * Remove a transitionend event callback
    * @param HTMLElement|HTMLElement[]|NodeList|jQuery The elements to remove the handler from
    * @param function (optional) the handler to remove, if null all handlers will be removed
    */
    offTransitionEnd: function(el, handler) {
        eachEl(el, (targ) => { 
            targ.removeEventListener(prefixedTransitionEnd, handler, false);
        });
    }

};

export { prefixedTransitionEnd, prefixedAnimationEnd };
export default AnimationUtil;
