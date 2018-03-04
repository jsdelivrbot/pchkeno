if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function(require) {

    var _ = require("lodash");

    return function(env) {

        env.addGlobal("jsonStringify", JSON.stringify);

        env.addFilter("classList", function(obj) {
            return _.reduce(obj, function(result, v, k) { 
                if(!!v) { result.push(k); }
                return result;
            }, []).join(" ");
        });

    };

});
