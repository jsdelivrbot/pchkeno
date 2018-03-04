/* */ 
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function objectAssign(dest, src) {
    if (!src) {
        return dest;
    }
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dest[prop] = src[prop];
        }
    }
    return dest;
}

exports.objectAssign = objectAssign;