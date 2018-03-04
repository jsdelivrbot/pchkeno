import UniNavMessagesView from "app/views/UniNavMessages";

/*
* This module just adds the hook that external path games call
* This shows the token activity using the toast view
*/
const showLastActivity = function ( activitiy ) {
	// {
	//  "description": "Played $250 Money Time",
	//  "value": 1000
	// }
	// console.log("showLastActivity", arguments);
	// Detect partial login state, dont show token message until page refresh and the user must be fully logged in
	if (
		activitiy &&
		PCHUSER.isFullyRegistered === false &&
		PCHUSER.isRecognizedUser === true
	) {
		localStorage.setItem( `tokenCenterMessage`, JSON.stringify( activitiy ));
	}

	// Only show token activitiy if the user is fully registered
	if ( activitiy && PCHUSER.isFullyRegistered ) {
		UniNavMessagesView.showTokensMessage(
			{
				type: `tokens`,
				value: activitiy.value,
				description: activitiy.description
			},
			window.PCHUSER,
			window.PCH.uniExp.tokenCenterOptions
		);
	}
};

window.PCH = window.PCH || {};
window.PCH.uniExp = window.PCH.uniExp || {};
window.PCH.uniExp.tokenCenter = window.PCH.uniExp.tokenCenter || {};
window.PCH.uniExp.tokenCenter.showLastActivity = showLastActivity;

// Check to see if localstorage has a message to display
if ( PCHUSER.isFullyRegistered ) {
	let tokenCenterMessage = localStorage.getItem( `tokenCenterMessage` );

	if ( tokenCenterMessage !== null ) {
		tokenCenterMessage = JSON.parse( tokenCenterMessage );
		showLastActivity( tokenCenterMessage );

		// Clear localstorage
		localStorage.clear();
	}
}

export default showLastActivity;
