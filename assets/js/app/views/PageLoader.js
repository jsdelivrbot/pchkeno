import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import renderTemplate from "app/modules/templateLoader";

const PageLoaderView = function () {};

/**
 * Simple view class for showing a page loader animation
 */
Object.assign( PageLoaderView.prototype, EventsMixin, {
	show: function ( parentNode ) {
		this.$pageLoader =
			this.$pageLoader || $( renderTemplate( `shared/pageLoader.html` ));
		$( parentNode ).append( this.$pageLoader );
		this.loadTime = Date.now();
	},

	hide: function () {
		if ( this.$pageLoader ) {
			this.$pageLoader.remove();
		}
	}
});

export default PageLoaderView;
