import CoachingLightbox from "app/views/CoachingLightBox";

/* global $ */
class IdleMessageLightbox extends CoachingLightbox {
	constructor ( enabled ) {
		super( enabled );
		this.lightboxCreated = false;
	}
	show ( msg, top, left, customClass = ``, $relativeElement = `#main-content` ) {
		this.setupVars( $relativeElement );

		this.loc = $( `.cardplay` ).position();

		this.lightBox.css({
			top: `${top + this.loc.top}px`,
			left: `${left + this.loc.left}px`
		});

		this.container.html( msg );

		this.lightBox.show();
	}
	setupVars ( container = `#main-content` ) {
		if ( !this.lightboxCreated ) {
			this.lightBox = $(
				`<div class="coachingLightBox fadeInOut" id="idleLightBox"><div class="coachingContainer"></div></div>`
			);

			//only add if lightbox doesn't already exist
			$( container )
				.css( `position`, `relative` )
				.append( this.lightBox );

			this.container = this.lightBox.find( `.coachingContainer` );
			this.lightboxCreated = true;
		}
	}
}

export default IdleMessageLightbox;
