const postcss = require("postcss");

function parseSelector(selectorTemplate, themeName) {
    return selectorTemplate.replace(/%s/g, themeName).replace(/"/g, '');
}

/**
* returns a mixin function that outputs style delcarations for each card theme given the style 
* and color variable to use from the resources/assets/css/colors.json variables
*
* The mixin function accepts these params:
* @param selectorTemplate This is the selector to output for each of the card style variations, %s will be replaced by the card theme name
*   If your selector contains a space, wrap the entire selector in " quotes
* @param property The style property to style (eg, color, background-color, text-color, etc)
* @param variableName The variable name as listed in the colors.json file, eg "BG", "TEXT", etc
*
* @example (assuming this mixin is assigned to the "card-colors" name)
*   // call the mixin
*   @mixin card-colors ".card-tab--%s", color, BG
*   // result
*   .card-tab--a { color: red; }
*   .card-tab--b { color: blue; }
*   .card-tab--c { color: green; } 
*   ... etc
*/
function cardColorStyle(themeNames, colorFunc) {
    return function(mixin, selectorTemplate, propertyName, variableName) {
        var nodes = [];
        for(var i = 0, n = themeNames.length; i < n; i++) {
            let rule = postcss.rule({selector: parseSelector(selectorTemplate, themeNames[i])});
            rule.append({
                prop: propertyName,
                value: colorFunc(themeNames[i], variableName)
            });
            nodes.push(rule);
        }
        mixin.replaceWith(nodes);
    };
}

/**
* returns a mixin function that outputs a linear gradient using the GRAD_TOP, GRAD_BOT color variables
*
* @example (assuming this mixin is assigned to the "card-gradient" name)
*   // call the mixin
*   @mixin card-gradient ".card--%s .card-body", background
*  // result
*  .card--a .card-body { background: linear-gradient(to bottom, #424175 0%, #2b2a4d 100%) }
*  .card--b .card-body { background: linear-gradient(to bottom, #058612 0%, #04590c 100%) }
*  ... etc
*/
function cardColorGradient(themeNames, colorFunc) {
    return function(mixin, selectorTemplate, propertyName) {
        var nodes = [];
        for(var i = 0, n = themeNames.length; i < n; i++) {
            let name = themeNames[i];
            let rule = postcss.rule({selector: parseSelector(selectorTemplate, name)});
            rule.append({
                prop: propertyName,
                value: "linear-gradient(to bottom, " + colorFunc(name, "GRAD_TOP") + " 0%, " + colorFunc(name, "GRAD_BOT") + " 100%)"
            });
            nodes.push(rule);
        }
        mixin.replaceWith(nodes);
    };
}

module.exports = function(colorVariables) {

    // look for the different theme names, we expect them to be
    // as keys in the colorVariables object like "CARDA", "CARDB", "CARDFOO", etc
    // the theme names would then be "a","b","foo"
    var themeNames = [];
    // map the css theme name to the original key in colorVariables
    var themeNameMap = {};
    var themeRE = /CARD(\w+)/;
    for(var k in colorVariables) {
        if(!colorVariables.hasOwnProperty(k)) {
            continue;
        }
        let match = k.match(themeRE);
        if(match) {
            let name = match[1].toLowerCase();
            themeNames.push(name);
            themeNameMap[name] = k;
        }
    }

    let colorVar = function(themeName, varName) {
        return colorVariables[themeNameMap[themeName]][varName];
    };

    return {
        cardColors: cardColorStyle(themeNames, colorVar),
        cardColorGradient: cardColorGradient(themeNames, colorVar)
    };

};
