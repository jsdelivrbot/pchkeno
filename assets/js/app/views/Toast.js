import $ from 'vendor/zepto';
import renderTemplate from 'app/modules/templateLoader';
import animationUtil from 'app/modules/animationUtil';
import EventsMixin from 'app/mixins/events';

const DEFAULT_TOAST_TPL = `shared/toast.html`;

const ToastView = function ( templateName, templateData ) {
	this.templateName = templateName || DEFAULT_TOAST_TPL;
	this.templateData = templateData;
};

Object.assign( ToastView.prototype, EventsMixin, {
	EVENTS: {
		CLOSED: `onclose`
	},

	show: function () {
		this.view = $( renderTemplate( this.templateName, this.templateData || {}));
		this.view.appendTo( document.body );
		this.view.on( `click`, `.toast__dismiss`, this.close.bind( this ));

		animationUtil.animate( this.view, animationUtil.ANIMS.SLIDE_IN_UP, () => {
			window.setTimeout( this.close.bind( this ), 2000 );
		});

		this.pendingPromise = new Promise( resolve => {
			this._pendingResolve = resolve;
		});
		return this.pendingPromise;
	},

	close: function ( e ) {
		if ( e ) {
			e.preventDefault();
		}

		animationUtil.animate(
			this.view,
			animationUtil.ANIMS.SLIDE_OUT_DOWN,
			this.view.remove.bind( this.view )
		);

		this.fireEvent( this.EVENTS.CLOSED );

		if ( this._pendingResolve ) {
			this._pendingResolve();
			this._pendingResolve = null;
			this.pendingPromise = null;
		}
	}
});

// static convenience method
ToastView.show = function ( templateName, templateData ) {
	const view = new ToastView( templateName, templateData );

	view.show();
	return view;
};

export { DEFAULT_TOAST_TPL };
export default ToastView;
