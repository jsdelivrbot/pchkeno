import System from "systemjs";

let noop = function() {};

// zepto stub
let ZeptoStub = {
    attr: noop
};
System.set(System.normalizeSync("vendor/zepto"), System.newModule({
    default: function() {
        return ZeptoStub;
    }
}));

// SnapSVG stub
let SnapStub = function(){};
SnapStub.plugin = noop;
System.set(System.normalizeSync("vendor/snap.svg"), System.newModule({
    default: SnapStub
}));

// animationUtil
System.set(System.normalizeSync("app/modules/animationUtil"), System.newModule({
    default: noop
}));
