/* */ 
"format cjs";
import animate from "@pch/animate";

// the elements we will animate
var targs = document.querySelectorAll(".example-targ");

// flip animation
document.querySelector(".animate--flip").addEventListener("click", function() {
    animate.animate(targs, "flipInX", function(el) {
        console.log("flipInX animation done for " + el.id);
    });
}, false);

// slide animation
document.querySelector(".animate--slide").addEventListener("click", function() {
    animate.animate(targs, "slideInUp", function(el) {
        console.log("slideInUp animation done for " + el.id);
    });
}, false);

// out/in example
document.querySelector(".animate--outin").addEventListener("click", function() {
    animate.animateOutIn(document.querySelectorAll("#example4, #example5"), "slideOutDown", "slideInUp", function(el) {
        console.log("slideOutDown complete");
    }, function(el) {
        console.log("slideInUp complete");
    });
}, false);

// fade out/in example
document.querySelector(".animate--fadeoutin").addEventListener("click", function() {
    animate.fadeOutIn(document.querySelectorAll("#example4, #example5"), function(el) {
        console.log("fade out complete");
    }, function(el) {
        console.log("fade in complete");
    });
}, false);
document.querySelector(".animate--fadeoutinpersist").addEventListener("click", function() {
    animate.fadeOutIn(document.querySelectorAll("#example4, #example5"), function(el) {
        console.log("fade out complete");
    }, function(el) {
        console.log("fade in complete");
    }, null, true);
}, false);

// works with jquery/zepto collections without them being a dependency
document.querySelector(".animate--jquery").addEventListener("click", function() {
    animate.fadeOutIn($("#example6, #example7"), function(el) {
        console.log("fade out complete", el.id);
    }, function(el) {
        console.log("fade in complete", el.id);
    }, null, true);
}, false);

// transition example
var transTarg = document.querySelector(".example-trans");
animate.onTransitionEnd(transTarg, true, function(el) {
    console.log("one time transition callback called on " + el.id);
});
animate.onTransitionEnd(transTarg, false, function(el) {
    console.log("multi time transition callback called on " + el.id);
}, false);
document.querySelector(".animate--trans").addEventListener("click", function() {
    if(transTarg.className.match(/move-right/)) {
        transTarg.classList.remove("move-right");
    }
    else {
        transTarg.classList.add("move-right");
    }
}, false);
