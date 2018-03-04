import $ from "vendor/zepto";
import renderTemplate from "app/modules/templateLoader";
import PageLoaderView from "app/views/PageLoader";

let $technicalDifficulties;

class OptInLightBox {
	constructor ( enabledPages = []) {
		this.enabledPages = enabledPages;
		this.submitted = false;
		this.bindLightbox();
	}

	bindLightbox () {
		this.container = $( `.emailoptin` );

		//removing out of pjax container and appending to body to avoid z-index issues with the overlay
		$( `.emailoptin` ).remove();
		$( `body` ).append( this.container );
		this.btn = this.container.find( `.btn-primary` );
		this.btn.on( `click`, this.onSubmit.bind( this ));
	}

	exists () {
		if ( this.container && this.container.length > 0 ) {
			return true;
		} else {
			//if no container found, try binding again a lightbox may have been pjaxed in
			this.bindLightbox();
			return this.container && this.container.length > 0;
		}
	}
	isEnabled ( currentPage ) {
		if ( !this.submitted ) {
			//always enable on homepage per php logic, not an issue as homepage is always refresh
			if ( currentPage === `/` ) {
				return true;
			}
			//for backwards compatability, if no enabled pages setting assume lightbox should show on all pages
			if ( this.enabledPages.length === 0 ) {
				return true;
				//return true if we are on enabled page
			} else if ( this.enabledPages.includes( currentPage )) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}

	show () {
		this._shownPromise = new Promise( resolve => {
			this.container.modal({ backdrop: `static` });
			this.container.on( `hiddenbsmodal`, () => {
				this.container.off( `hiddenbsmodal` );
				this._shownPromise = null;
				resolve();
			});
		});
		return this._shownPromise;
	}

	hide () {
		this.container.modal( `hide` );
	}

	onSubmit ( e ) {
		e.preventDefault();

		if (
			$( `#emailoptin-check1` ).prop( `checked` ) ||
			$( `#emailoptin-check2` ).prop( `checked` )
		) {
			this.showLoader();
			this.container
				.find( `.page-loader` )
				.css({
					top: `auto`,
					bottom: `76px`,
					left: `140px`
				})
				.show();

			this.btn.prop( `disabled`, true );

			$.ajax({
				url: `/user/subscribe`,
				type: `POST`,
				data: $( `.emailoptin__form` ).serialize(),
				success: function () {
					this.submitted = true;
					this.hide();
				}.bind( this ),
				error: function () {
					this.container.find( `.page-loader` ).hide();

					this.btn.prop( `disabled`, false );
					if ( !$technicalDifficulties ) {
						$technicalDifficulties = $(
							renderTemplate( `shared/kenocard-oops-backend.html` )
						);
						$technicalDifficulties.appendTo( document.body );
					}
					$technicalDifficulties.modal({ backdrop: false });
				}.bind( this )
			});
		} else {
			this.hide();
		}
		//
	}
	showLoader () {
		if ( !this.pageLoaderView ) {
			this.pageLoaderView = new PageLoaderView();
		}
		this.pageLoaderView.show( this.container.find( `.modal-body` ));
	}
}

export default OptInLightBox;
