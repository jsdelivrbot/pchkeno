(function() {

// http://svg.dabbles.info/snaptut-circlepath
Snap.plugin( function( Snap, Element, Paper, global ) {
    Paper.prototype.circlePath = function(cx,cy,r) {
        var p = "M" + cx + "," + cy;
        p += "m" + -r + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
        p += "a" + r + "," + r + " 0 1,0 " + -(r*2) + ",0";
        return this.path(p, cx, cy );

    };
});

})();
