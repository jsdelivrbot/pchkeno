import animationUtil from "app/modules/animationUtil";

const OPEN_CLASS = `cardflip--is-flipped`;
const ANIMATING_CLASS = `cardflip--animating`;
const ANIMATED_CLASS = `cardflip--animated`;

const openClassRE = new RegExp( `\\b` + OPEN_CLASS + `\\b` );

const DIR_TOP = `top`;
const DIR_BOT = `bottom`;
const DIR_LEFT = `left`;
const DIR_RIGHT = `right`;

/**
 * Handles the fancy-shmancy flip animation
 * Expects a HTMLElement with structure
 * <div class='cardflip'>
 *   <div class='cardflip__front'></div>
 *   <div class='cardflip__back'></div>
 * </div>
 */
function CardFlipView () {}

// class methods
Object.assign( CardFlipView, {
	DIRECTIONS: {
		top: DIR_TOP,
		bottom: DIR_BOT,
		left: DIR_LEFT,
		right: DIR_RIGHT
	}
});

// instance methods
Object.assign( CardFlipView.prototype, {
	/**
	 * Mount the view, passing the .cardflip HTMLElement root
	 * See the cardflip.css module
	 * @param HTMLElement rootNode Should have the ".cardflip" class and ".cardflip__front", ".cardflip__back" children
	 * @param object opts Additional options
	 *   @param bool useClickElements (default false) True if you want the tap to click handlers to be attached to separate elements
	 *       for the top, bottom, left, right directions. The view will look for elements with the classes '.cardflip__left',
	 *       '.cardflip__right', '.cardflip__top', '.cardflip__bottom'. If these don't exist they will be created and injected to the rootNode
	 *       You are responsible for styling these elements to place them in the desired position.
	 *       When useClickElements is False, the handler will try to intelligently determine the location of the click and flip in that direction
	 */
	mount: function ( rootNode, opts ) {
		this.btn = rootNode;

		this._flipListener = this.onFlipClick.bind( this );
		this.btn.addEventListener( `click`, this._flipListener, false );

		this.opts = Object.assign(
			{
				useClickElements: false
			},
			opts || {}
		);
		if ( this.opts.useClickElements ) {
			this.btnTop = this.createBtn( DIR_TOP );
			this.btnBot = this.createBtn( DIR_BOT );
			this.btnLeft = this.createBtn( DIR_LEFT );
			this.btnRight = this.createBtn( DIR_RIGHT );
		}
		if ( opts.disableClickAtStart ) {
			this.clickDisabled = true;
			this.disableHover();
		}
	},

	createBtn: function ( dir ) {
		const cname = `cardflip__` + dir;
		let btn = this.btn.querySelector( `.` + cname );

		if ( !btn ) {
			btn = document.createElement( `span` );
			btn.className = cname;
			this.btn.appendChild( btn );
		}
		return btn;
	},
	enableClick: function () {
		this.clickDisabled = false;
	},
	disableClick: function () {
		this.clickDisabled = true;
	},
	disableHover: function () {
		this.btn.classList.add( ANIMATED_CLASS );
	},
	enableHover: function () {
		this.btn.classList.remove( ANIMATED_CLASS );
	},

	unmount: function () {
		this.btn.removeEventListener( `click`, this._flipListener, false );
		this._flipListener = null;
		this.btn = null;
	},

	onFlipClick: function ( ev ) {
		if ( !this.clickDisabled ) {
			if ( this.btn.className.match( openClassRE )) {
				this.flipBack();
			} else {
				this.flipOpen( ev );
			}
		}
	},

	flipOpen: function ( ev ) {
		let dir;

		if ( this.opts.useClickElements ) {
			if ( ev.target == this.btnTop ) {
				dir = DIR_TOP;
			} else if ( ev.target == this.btnBot ) {
				dir = DIR_BOT;
			} else if ( ev.target == this.btnLeft ) {
				dir = DIR_LEFT;
			} else if ( ev.target == this.btnRight ) {
				dir = DIR_RIGHT;
			}
		} else {
			let mx = ev.clientX - this.btn.offsetLeft,
				my = ev.clientY - this.btn.offsetTop,
				w = this.btn.offsetWidth,
				h = this.btn.offsetHeight;

			const directions = [
				{
					id: DIR_TOP,
					x: w / 2,
					y: 0
				},
				{
					id: DIR_RIGHT,
					x: w,
					y: h / 2
				},
				{
					id: DIR_BOT,
					x: w / 2,
					y: h
				},
				{
					id: DIR_LEFT,
					x: 0,
					y: h / 2
				}
			];

			directions.sort( function ( a, b ) {
				return distance( mx, my, a.x, a.y ) - distance( mx, my, b.x, b.y );
			});
			dir = directions.shift().id;
		}

		if ( dir ) {
			this.flipInDirection( dir );
		}
	},

	flipInDirection: function ( dir, callback ) {
		this.btn.setAttribute( `data-cardflip-direction`, dir );
		this.btn.classList.add( OPEN_CLASS );
		this.btn.classList.add( ANIMATING_CLASS );
		animationUtil.onTransitionEnd(
			this.btn,
			true,
			this.onFlipDone.bind( this, callback )
		);
	},

	flipBack: function ( callback ) {
		if ( this.btn.classList.contains( OPEN_CLASS )) {
			this.btn.classList.remove( OPEN_CLASS );
			this.btn.classList.add( ANIMATING_CLASS );
			animationUtil.onTransitionEnd(
				this.btn,
				true,
				this.onFlipDone.bind( this, callback )
			);
		}
	},

	/**
	 * This is so that when the flip happens, the user is not immediately shown
	 * the hover overlay again, we want them to see the content that was flipped to
	 * so we add a class while animating that disables pointer events and hides the hover overlay
	 * and once the animation is done, we listen for the first mouse move and then the hover
	 * overlay can be show again. So the user can click to flip and see the back, and the hover
	 * overlay isnt shown until the move the mouse
	 */
	onFlipDone: function ( callback ) {
		const onMouseMove = () => {
			if ( this.btn ) {
				this.btn.classList.remove( ANIMATED_CLASS );
				this.btn.removeEventListener( `mousemove`, onMouseMove, false );
			}
		};

		if ( this.btn != null ) {
			// DOM may have changed and removed our element during animation
			this.btn.classList.add( ANIMATED_CLASS );
			this.btn.classList.remove( ANIMATING_CLASS );
			this.btn.addEventListener( `mousemove`, onMouseMove, false );
		}

		if ( callback ) {
			callback();
		}
	}
});

function distance ( x1, y1, x2, y2 ) {
	const dx = x1 - x2;
	const dy = y1 - y2;

	return Math.sqrt( dx * dx + dy * dy );
}

export default CardFlipView;
