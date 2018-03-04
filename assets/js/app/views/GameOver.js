import $ from "vendor/zepto";
// import EventsMixin from "app/mixins/events";
import renderTemplate from "app/modules/templateLoader";
import animationUtil from "app/modules/animationUtil";
import { GameOverScreen } from "@pch/path-gamemanager-js";

/**
 * This view handles the gameover overlay
 */
// const PathGameOverView = function () {};

// Object.assign( PathGameOverView.prototype, EventsMixin, {
class KenoPathGameOverScreen extends GameOverScreen {
	constructor ( opts, user, cardData ) {
		super( opts );
		this.user = user;
		this.cardData = cardData;
		this.gameNode = this.rootNode;
		this.showing = false;
		this._autoClaim = true; // always true for V4 games
		this.EVENTS.BACK_HOME = `onBackHome`;
	}

	/**
	 * Show a game over view
	 *
	 * @param object User data,
	 *       @param string name
	 *       @param bool haspass True if the user has a password
	 * @param object Card data
	 *       @param int number, The number of the card that was unlocked
	 *       @param string style, The card style name
	 * @param number The tokens the user earned from the game
	 * @param number (optional) The user's score from the game they completed, if null/undefined, no score will be shown
	 * @param HTMLElement (optional) If provided the gameover view is shown inline over this node instead of as a modal
	 */
	open () {
		const inline = !!this.gameNode;

		//allow redirect on live drawing now

		this.showing = true;
		const view = $(
			renderTemplate( `shared/gameover.html`, {
				inline: inline,
				user: this.opts.user,
				cardNum: this.opts.cardData.cardNum,
				cardStyle: this.opts.cardData.cardStyle,
				tokens: this.tokens,
				cash: this.cash
			})
		);

		if ( inline ) {
			const $gameNode = $( this.gameNode );

			$gameNode.find( `#game` ).append( view.get( 0 ));

			animationUtil.animateFast( view, animationUtil.ANIMS.FADE_IN_DOWN );
			view.on( `click`, `[data-dismiss="modal"]`, e => {
				e.preventDefault();
				this.dispatchEvent( this.EVENTS.CONTINUE );
			});
		} else {
			document.body.appendChild( view.get( 0 ));
			view.modal({ backdrop: false });
			view.on( `hiddenbsmodal`, function () {
				view.remove();
			});
		}
	}

	setup ( errResponse, startResp ) {
		if ( errResponse ) {
			// gosClass.push( TD_ERROR_CLASS );
			// messages = this.getErrorMessages(errResponse);

			this.hasError = true;
			//stop from ever showing twice
			if ( !this.showing ) {
				this.open();
			}
		} else {
			if ( startResp.getWinsByType( `TOKEN` )[0]) {
				this.tokens = startResp.getWinsByType( `TOKEN` )[0].value;
			}
			if ( startResp.getWinsByType( `MONETARY` )[0]) {
				this.cash = startResp.getWinsByType( `MONETARY` )[0].value;
			}
		}
	}

	// });
}

export default KenoPathGameOverScreen;
