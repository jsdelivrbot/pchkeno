//https://gist.github.com/pamelafox/1379704
;(function($){

    ['width', 'height'].forEach(function(dimension) {
        var offset, 
            Dimension = dimension.replace(/./, function(m) { return m[0].toUpperCase(); });
        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                sides[dimension].forEach(function(side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

})(Zepto);

/*
;(function($) {
    // Add inner and outer width to zepto (adapted from https://gist.github.com/alanhogan/3935463)
    var ioDim = function(dimension, includeBorder) {
        return function (includeMargin) {
            var sides, size, elem;
            if (this) {
                elem = this;
                size = elem[dimension]();
                sides = {
                    width: ["left", "right"],
                    height: ["top", "bottom"]
                };
                sides[dimension].forEach(function(side) {
                    size += parseInt(elem.css("padding-" + side), 10);
                    if (includeBorder) {
                        size += parseInt(elem.css("border-" + side + "-width"), 10);
                    }
                    if (includeMargin) {
                        size += parseInt(elem.css("margin-" + side), 10);
                    }
                });
                return size;
            } else {
                return null;
            }
        }
    };
    ["width", "height"].forEach(function(dimension) {
        var Dimension = dimension.substr(0,1).toUpperCase() + dimension.substr(1);
        $.fn["inner" + Dimension] = ioDim(dimension, false);
        $.fn["outer" + Dimension] = ioDim(dimension, true);
    });
})(Zepto);
*/
