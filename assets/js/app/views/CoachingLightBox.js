import $ from "vendor/zepto";

class CoachingLightBox {
	constructor ( enabled = window.KENO_GLOBALS.COACHING_SCREENS.enabled ) {
		this.customClass = ``;
		this.lightboxShowing = false;
		this.lightBox = null;
		this.enabled = enabled;
	}
	/**
	 * If two parameters are giving position lightbox relative to body
	 * If three parameters are giving position lightbox relative
	 * to element, top and left become offsets
	 * @param  {Number} top              location of where you want the lightbox to show
	 * @param  {Number} left             location of where you want the lightbox to show
	 * @param  {Object} $relativeElement Zepto object representing the element
	 */
	show (
		msg,
		top,
		left,
		customClass = ``,
		$relativeElement = `#main-content`,
		fadeOut = false
	) {
		this.setupVars( $relativeElement, fadeOut );

		this.loc = $( `.cardplay` ).position();

		this.lightBox.css({
			top: `${top + this.loc.top}px`,
			left: `${left + this.loc.left}px`
		});

		if ( this.customClass !== `` ) {
			this.lightBox.removeClass( this.customClass );
			this.customClass = ``;
		}

		if ( customClass !== `` ) {
			this.customClass = customClass;
			this.lightBox.addClass( customClass );
		}
		this.container.html( msg );

		this.showLightbox();
	}
	hideLightbox () {
		if ( this.lightBox && this.enabled ) {
			this.lightBox.hide();
			this.lightboxShowing = false;
		}
	}
	showLightbox () {
		if ( this.lightBox && this.enabled ) {
			this.lightBox.show();
			this.lightboxShowing = true;
		}
	}
	toggleCoachingScreens () {
		if ( this.lightboxShowing ) {
			this.hideLightbox();
		} else {
			this.showLightbox();
		}
	}
	setupVars ( container = `#main-content`, fadeOut ) {
		// Create lightbox if it does not does not exist
		this.lightBox = $( `#coachingLightBox` );

		if ( !this.lightBox.length ) {
			if ( fadeOut ) {
				this.lightBox = $(
					`<div class="coachingLightBox fadeInOut" id="coachingLightBox"><div class="coachingContainer"></div><div class="second-arrow"></div></div>`
				);
			} else {
				this.lightBox = $(
					`<div class="coachingLightBox" id="coachingLightBox"><div class="coachingContainer"></div><div class="second-arrow"></div></div>`
				);
			}

			$( container ).append( this.lightBox );
		}
		this.container = this.lightBox.find( `.coachingContainer` );
	}
}

export default CoachingLightBox;
