/* */ 
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PRIZE_TYPES = {
    CASH: "MONETARY",
    TOKEN: "TOKEN",
    LUCKY7: "LUCKY7"
    /* @TODO: support all these?
    var PRIZE_CASH = 1;
    var PRIZE_CERT = 2;
    var PRIZE_GOODS = 3;
    // const PRIZE_SUPER = 4;
    var PRIZE_CASHSTAR = 5;
    var PRIZE_TOKENS = 6;
    // const PRIZE_REALBUCKS = 7;
    /*/
};

var SUB_PRIZE_TYPES = {
    CASH: "CASH",
    HARDGOOD: "HARDGOOD",
    EGIFTCARD: "EGIFTCARD"
};

exports.PRIZE_TYPES = PRIZE_TYPES;
exports.SUB_PRIZE_TYPES = SUB_PRIZE_TYPES;
exports.default = PRIZE_TYPES;