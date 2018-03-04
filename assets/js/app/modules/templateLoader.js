import * as templates from "app/modules/nunjucks-templates";
import nunjucks from "vendor/nunjucks";
import nunjucksExtensions from "app/modules/nunjucks-extensions";

const renderer = new nunjucks.Environment();

nunjucksExtensions( renderer );

// returns the precompiled template with the given name
const loader = function ( name ) {
	return window.nunjucksPrecompiled && window.nunjucksPrecompiled[name];
};

const renderTemplate = function ( name, context ) {
	return renderer.render( name, context );
};

const renderString = function ( tpl, context ) {
	return renderer.renderString( tpl, context );
};

export { loader, renderer, renderString };
export default renderTemplate;
