import $ from "vendor/zepto";
import renderTemplate from "app/modules/templateLoader";

let $genericError;

const GenericErrorView = {
	show: function () {
		if ( !$genericError ) {
			$genericError = $( renderTemplate( `shared/generic-error.html` ));
			$genericError.appendTo( document.body );
		}
		$genericError.modal({ backdrop: false });
	}
};

export default GenericErrorView;
