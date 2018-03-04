# Animate.js

Simple javascript utility for listening to animation/transition end events (cross-browser),
as well as convenience methods for integration with [Animate.css](https://daneden.github.io/animate.css/)

Provides a js api to running an animation and optionally getting a callback when it completes.
Also provides similar utilities for listenging for transition end events on elements.

## Usage

This module is written in ES6 format, you will need a transpiler/bundler for use.
See one such example in the */example* directory which uses [SystemJS](https://github.com/systemjs/systemjs).

Look under */src* for documented src for full API

Each of the methods below accepts a single HTMLElement, array of HTMLElements, a NodeList, or jQuery/Zepto collection.
Callbacks are called for each element in the list.

Will work with jQuery/Zepto collections, but does not require nor depend upon those libraries.

Note that after the animation completes, the animate related classes are removed by default, but you can change that
by passing true as the last argument.

```javascript
import animate from "@pch/animate";

// animate a single element, you can animate multiple times
animate.animate(document.querySelector("#my-element"), "slideInUp", (el) => {
    console.log(el.id + " finished animating via slideInUp");
    // you can call animate on an element mutliple times
    animate.animate(el, "flipInX", function(el) {
        console.log(el.id + " finished animating via flipInX");
    });
});

// you can add an extra class if you have your own css overrides triggered by it
animate.animate(document.querySelector("#my-element"), "slideInUp", (el) => { }, "animated--fast");

// the slideInUp and animated classes are removed in the above call when the animation completes
// if you want them to persist, pass true as the last arg
animate.animate(document.querySelector("#my-element"), "slideInUp", (el) => { }, null, true);

// convenience method animateOutIn() can chain two animations in a row with callbacks in between
animate.animateOutIn(document.querySelector(".my-elements"), "fadeOut", "fadeIn", (el) => {
    // element is faded out, do something with it before fading back in, eg replace html
    targ.innerHTML = "<p>All Done</p>";
}, (el) => {
    // element is faded back in, the animation chain is complete
});

// convenience method to do the above
animate.fadeOutIn(document.querySelector(".my-elements", (el) => {
    // element is faded out, do something with it before fading back in, eg replace html
    targ.innerHTML = "<p>All Done</p>";
}, (el) => {
    // element is faded back in, the animation chain is complete
});

// animate multiple elements in one call, each element gets a callback
animate.animate(document.querySelectorAll(".other-elements"), "fadeIn", function(el) {
    console.log("finished animating fadeIn", el);
});

// also provides utility for listening to transition/animation callbacks
// pass true for the second argument for a one-time listener only
// your callback will only fire on the next transition end event, 
// otherwise pass false to get a callback on every transition end event
animate.onAnimationEnd(document.getElementById("foo"), true, function(el) {
    console.log("animation end event called for " + el.id);
});
animate.onAnimationIteration(document.getElementById("foo"), false, function(el) {
    console.log("animation iteration complete called for " + el.id);
});
animate.onTransitionEnd(document.getElementById("foo"), true, function(el) {
    console.log("transition end event called for " + el.id);
});

// you can remove previously added listeners with the offAnimationEnd/offTransitionEnd methods
animate.offAnimationEnd(myElement, handler);
animate.offAnimationIteration(myElement, handler);
animate.offTransitionEnd(myElement, handler);
```

## Example

The example directory contains an example usage. Load *index.html* in a browser.
You must first install the depdendencies via:
```
npm install
jspm install
```
