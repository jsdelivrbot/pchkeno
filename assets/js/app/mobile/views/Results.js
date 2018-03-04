import ResultsView from "app/views/Results";

const ResultsViewMobile = function () {};

Object.assign( ResultsViewMobile.prototype, ResultsView.prototype, {
	showPaytable: function ( e ) {
		//making this blank as mobile just follows the anchor tag instead of displaying the paytable modal
	}
});

export default ResultsViewMobile;
