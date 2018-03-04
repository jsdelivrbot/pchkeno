import $ from "vendor/zepto";
import UserService from "app/services/User";
import animUtil from "app/modules/animationUtil";
import EventsMixin from "app/mixins/events";

const SSOLightboxView = function () {};

Object.assign( SSOLightboxView.prototype, EventsMixin, {
	EVENTS: {
		SSO_LIGHTBOX_SUBMIT: `SSOLightboxSubmit`
	},

	init: function () {},
	mount: function () {
		console.log( `sso lightbox mount` );
		this.rootNode = $( `.sso-create-password-lightbox-modal` );
		this.submitButton = this.rootNode.find(
			`#sso-create-password-lightbox__submit-button`
		);
		this.passwordField = this.rootNode.find(
			`#sso-create-password-lightbox-create-password`
		);
		this.confirmPasswordField = this.rootNode.find(
			`#sso-create-password-lightbox-confirm-password`
		);

		this.submitButton.on( `click`, this.onSubmit.bind( this ));
		this.errorContainer = this.rootNode.find( `#sso-error-container` );
		this.errorInnerShell = this.errorContainer.find( `.inner-shell` );
		this.errorHeaderText = this.errorContainer.find( `#sso-header-text` );
		this.firstName = this.rootNode.find( `#sso-lightbox-first-name` );
		this.firstName.html( PCHUSER.firstName );
		this.noThanks = this.rootNode.find( `.no-thanks` );
		this.modalBodyLink = this.rootNode.find( `#modal-body__link-text` );
		this.modalBodySubmit = this.rootNode.find( `#modal-body__submit-text` );
		this.closeButton = this.rootNode.find( `.close` );
		this.fromLink = false;
		this.fromGameSubmit = false;

		this.noThanks.on(
			`click`,
			function () {
				this.hide();
			}.bind( this )
		);
	},
	unmount: function () {
		if ( this.submitButton ) {
			this.submitButton.off( `click` );
		}
		this.rootNode = null;
		this.submitButton = null;
		this.passwordField = null;
		this.confirmPasswordField = null;

		this.errorContainer = null;
		this.errorInnerShell = null;
		this.errorHeaderText = null;
		this.firstName = null;

		this.noThanks = null;
		this.modalBodyLink = null;
		this.modalBodySubmit = null;
		this.closeButton = null;
	},
	show: function () {
		$( `.sso-create-password-lightbox-modal` )
			.appendTo( document.body )
			.modal({
				backdrop: true
			});
	},
	showLink: function () {
		this.modalBodySubmit.hide();
		this.modalBodyLink.show();
		this.fromLink = true;
		this.noThanks.show();
		this.closeButton.show();
		this.show();
	},
	showSubmit: function () {
		this.modalBodyLink.hide();
		this.modalBodySubmit.show();
		this.fromSubmit = true;
		this.noThanks.hide();
		this.closeButton.hide();
		$( `.sso-create-password-lightbox-modal` )
			.appendTo( document.body )
			.modal({
				backdrop: `static`
			});
	},
	hide: function () {
		$( `.sso-create-password-lightbox-modal` )
			.modal( `hide` )
			.remove();
		this.unmount();
	},
	onSubmit: function ( e ) {
		e.preventDefault();

		console.log( `sso lightbox on submit` );

		if ( this.validateFields()) {
			const userService = new UserService();
			//pass password values from form

			userService.createPassword(
				this.passwordField.val(),
				this.confirmPasswordField.val(),
				( err, resp ) => {
					if ( err ) {
						this.populateErrorResponses( null );
						return false;
					} else if ( resp.isValid ) {
						if ( this.fromSubmit ) {
							console.log( `sso lightbox view - valid response - fire event!` );
							this.fireEvent( this.EVENTS.SSO_LIGHTBOX_SUBMIT );
						} else if ( this.fromLink ) {
							sessionStorage.setItem( `showLastActivity`, `true` );
							window.location.reload();
						} else {
							sessionStorage.setItem( `showLastActivity`, `true` );
							window.location.reload();
						}
					} else {
						this.showErrors( resp.errorResponses );
						return false;
					}
				}
			);
		}
	},
	showErrors: function ( errorResponses ) {
		this.errorHeaderText.html( `Please correct Below and Re-Submit: ` );
		this.positionErrorContainer();
		this.populateErrorResponses( errorResponses );
	},
	validateFields: function () {
		let valid = true;
		let errorHTML = ``;

		if ( this.passwordField.val() == `` ) {
			this.passwordField.addClass( `invalid` );
			errorHTML += `<div class="error">Password</div>`;
			valid = false;
		}
		if ( this.confirmPasswordField.val() == `` ) {
			this.confirmPasswordField.addClass( `invalid` );
			errorHTML += `<div class="error">Password Confirmation</div>`;
			valid = false;
		}

		if ( !valid ) {
			this.errorHeaderText.html( `Please Fill in the Following Fields:` );
			this.errorInnerShell.html( errorHTML );
			this.positionErrorContainer();
			this.showErrorContainer();
		}
		return valid;
	},
	positionErrorContainer: function () {
		const offsetTop = this.confirmPasswordField.position().top;

		this.errorContainer.css( `top`, offsetTop );
	},
	showErrorContainer: function () {
		animUtil.animateFast(
			this.errorContainer,
			animUtil.ANIMS.FADE_IN,
			function () {},
			true
		);
	},
	hideErrorContainer: function () {
		animUtil.animateFast(
			this.errorContainer,
			animUtil.ANIMS.FADE_OUT,
			function () {},
			true
		);
	},
	populateErrorResponses ( errorResponses ) {
		let errorHTML = ``;

		if ( errorResponses ) {
			errorResponses.forEach( function ( errorResponse ) {
				errorHTML += `<div class="error">` + errorResponse.Message + `</div>`;
			});
		} else {
			errorHTML =
				`<div class="error">Technical Difficulty - Please Try Again</div>`;
		}

		this.errorInnerShell.html( errorHTML );
		this.positionErrorContainer();
		this.showErrorContainer();
	}
});

export default SSOLightboxView;
