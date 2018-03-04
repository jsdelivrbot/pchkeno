import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import Pikaday from "vendor/pikaday";
import selectric from "vendor/jquery.selectric";
import animationUtil from "app/modules/animationUtil";
import ButtonView from "app/views/Button";
import PageLoaderView from "app/views/PageLoader";
import moment from "moment";

const LINK_CLASS = `results__nav__item`;
const LINK_ACTIVE_CLASS = `results__nav__item--active`;
const PICKS_ACTIVE_CLASS = `results__picks--active`;
const SUBMITTING_CLASS = `results--submitting`;
const PJAX_SELECTOR = `#results__pjax`;
const OPT_HAS_PICKS_CLASS = `results__opt--haspicks`;
const TIME_OPTS_LOADING_CLASS = `form-label__display--loading`;

const DATE_PARSE_RE = /^0/;

/**
 * This view handles the results page
 */
const ResultsView = function () {};

Object.assign( ResultsView.prototype, EventsMixin, {
	EVENTS: {
		DATETIME_SUBMIT: `dateTimeSubmit`, // submitted date/time form
		DATE_PICKED: `datePicked`, // picked a date in the calendar
		PLATFORM_PICKED: `platformPicked` // picked a different platform tab
	},

	init: function ( appModel ) {},

	mount: function ( ctx ) {
		this.rootNode = $( `.results` );
		this.pjaxRootNode = $( PJAX_SELECTOR );

		const RESULT_GLOBALS =
			window.KENO_GLOBALS && window.KENO_GLOBALS.RESULTS_PAGE || {};

		// nav links to change platform
		this.navBarRoot = $( `.results__navbar` );
		this.navBarRoot.on(
			`click`,
			`.` + LINK_CLASS,
			this.onNavLinkClick.bind( this )
		);
		this.navBarSubmitBtn = this.navBarRoot.find( `.form-submit` );
		this.navBarSubmitBtn.on( `click`, this.onDateTimeSubmit.bind( this ));

		this.selectedTimestamp =
			parseInt( this.navBarRoot.attr( `data-selected-timestamp` ), 10 ) * 1000;
		this.serverTZOffset = parseInt( this.navBarRoot.attr( `data-tzoffset` ), 10 );
		this.selectedDateTime = moment( new Date( this.selectedTimestamp )).utcOffset(
			this.serverTZOffset / 60
		);
		this.calendarOffsets = RESULT_GLOBALS.calendarOffsets || [];

		// get the user played dates passed to us
		this.initUserCalendarDates();

		// date selection
		this.pickerDisplay = $( `.results__form__date .form-label__display__text` );
		const numDays = parseInt( this.pickerDisplay.attr( `data-numdays` ), 10 ) || 14;

		this.picker = new Pikaday({
			onSelect: this.onDatePicked.bind( this ),
			onDraw: this.onDatePickerDrawn.bind( this ),
			onClose: this.onDatePickerClosed.bind( this ),
			minDate: new Date( Date.now() - 60 * 60 * 24 * ( numDays - 1 ) * 1000 ),
			maxDate: new Date(),
			defaultDate: new Date(),
			renderDayDecorator: this.renderDayDecorator.bind( this ),
			i18n: {
				previousMonth: `Prev`,
				nextMonth: `Next`,
				months: [
					`January`,
					`February`,
					`March`,
					`April`,
					`May`,
					`June`,
					`July`,
					`August`,
					`September`,
					`October`,
					`November`,
					`December`
				],
				weekdays: [
					`Sunday`,
					`Monday`,
					`Tuesday`,
					`Wednesday`,
					`Thursday`,
					`Friday`,
					`Saturday`
				],
				weekdaysShort: [ `Su`, `Mo`, `Tu`, `We`, `Th`, `Fr`, `Sa` ]
			},
			bound: true,
			field: $( `.results__form__date .form-control` )[0],
			trigger: $( `.results__form__date` )[0]
		});
		document.body.appendChild( this.picker.el );

		// time selection
		this.timeDisplay = $( `.results__form__time .form-label__display__text` );
		this.timeDisplayTZ = this.timeDisplay.attr( `data-tz` );
		this.timePicker = $( `.results__form__time select` );
		this.timePicker.selectric({
			maxHeight: 200,
			onOpen: function () {
				this.picker.hide();
			}.bind( this ),
			disableOnMobile: false,
			nativeOnMobile: false,
			onChange: this.onTimePicked.bind( this )
		});

		this.rootNode.on(
			`click`,
			`.results__paytable-link`,
			this.showPaytable.bind( this )
		);
	},

	unmount: function ( ctx ) {
		if ( this.rootNode ) {
			this.rootNode.off( `click` );
			this.rootNode = null;
		}
		if ( this.navBarRoot ) {
			this.navBarRoot.off( `click` );
			this.navBarRoot = null;
		}
		if ( this.navBarSubmitBtn ) {
			this.navBarSubmitBtn.off( `click` );
			this.navBarSubmitBtn = null;
		}
		if ( this.picker ) {
			this.picker.destroy();
			this.picker = null;
		}
		if ( this.pageLoaderView ) {
			this.pageLoaderView.hide();
		}

		this.pickerDate = null;
		this.timeDisplay = null;
		if ( this.timePicker ) {
			this.timePicker.selectric( `destroy` );
		}

		this.isSubmitDisabled = false;
	},

	getPjaxSelector: function () {
		return PJAX_SELECTOR;
	},

	isCashGame: function () {
		return $( `.results__winning-nums` ).hasClass( `results__winning-nums--cash` );
	},

	updateResultsDisplay: function ( pjaxResponse, selectedPlatform ) {
		animationUtil.fadeOutInFast(
			this.pjaxRootNode,
			() => {
				this.initUserCalendarDates();
				this.pjaxRootNode.html( pjaxResponse.body );
			},
			() => {
				this.updateActivePlatform( selectedPlatform );
			}
		);
	},

	initUserCalendarDates: function () {
		const RESULT_GLOBALS =
			window.KENO_GLOBALS && window.KENO_GLOBALS.RESULTS_PAGE || {};
		const dates = RESULT_GLOBALS.recentlyPlayedDates || [];

		this.userDates = [];
		if ( dates ) {
			dates.forEach( dateVal => {
				const [ year, month, day ] = dateVal.split( `-` ); // eg 2017-02-28

				if ( year && month && day ) {
					this.userDates.push({
						year: parseInt( year, 10 ),
						month: parseInt( month.replace( DATE_PARSE_RE, `` ), 10 ) - 1,
						day: parseInt( day.replace( DATE_PARSE_RE, `` ), 10 )
					});
				}
			});
		}
	},

	renderDayDecorator: function ( opts, classes ) {
		if ( classes.find( c => c === `is-disabled` )) {
			return;
		}
		this.userDates.forEach( d => {
			if ( d.day == opts.day && d.month == opts.month && d.year == opts.year ) {
				classes.push( `pikaday-has-picks` );
			}
		});
	},

	updateServerTZOffset: function ( dateVal ) {
		const today = new Date();

		today.setHours( dateVal.getHours());
		today.setMinutes( dateVal.getMinutes());
		today.setSeconds( dateVal.getSeconds());
		today.setMinutes( today.getMinutes() - today.getTimezoneOffset());
		const selected = new Date( dateVal.getTime());

		selected.setMinutes( selected.getMinutes() - selected.getTimezoneOffset());
		const daysDiff = ( today - selected ) / ( 24 * 60 * 60 * 1000 );

		this.serverTZOffset = this.calendarOffsets[parseInt( daysDiff, 10 )];
	},

	getSelectedTimezoneOffset: function () {
		return this.serverTZOffset;
	},

	onDatePicked: function ( d ) {
		this.updateServerTZOffset( d );
		this.selectedDateTime.utcOffset( this.serverTZOffset / 60 );
		this.selectedDateTime.year( d.getFullYear());
		this.selectedDateTime.month( d.getMonth());
		this.selectedDateTime.date( d.getDate());

		this.onTimePicked( this.timePicker.get( 0 ));

		this.updateDateDisplay(
			this.selectedDateTime.date(),
			this.selectedDateTime.month(),
			this.selectedDateTime.year()
		);
		this.updateTimeOptions();
		this.timePicker.selectric( `refresh` );

		this.fireEvent( this.EVENTS.DATE_PICKED, [ this.getSelectedDateTime() ]);
	},

	updateTimeOptions: function () {
		this.timePicker.find( `option` ).each(( i, opt ) => {
			const optionBuilderDate = moment(
				new Date( this.selectedDateTime.unix() * 1000 )
			).utcOffset( this.selectedDateTime.utcOffset());

			optionBuilderDate.hour( 0 );
			optionBuilderDate.minute( 0 );
			optionBuilderDate.add( opt.value, `s` );
			opt.disabled = optionBuilderDate.unix() * 1000 > Date.now();
		});
	},

	updateTimeOptionsWithUserPlays: function ( timesWithPlays ) {
		this.timePicker.find( `option` ).each(( i, opt ) => {
			for ( let j = 0; j < timesWithPlays.length; j++ ) {
				if ( timesWithPlays[j] === parseInt( opt.value, 10 )) {
					$( opt ).addClass( OPT_HAS_PICKS_CLASS );
					return;
				}
			}
			$( opt ).removeClass( OPT_HAS_PICKS_CLASS );
		});
		this.timePicker.selectric( `refresh` );
	},

	setTimeOptionsLoading: function () {
		this.timeDisplay.parent().addClass( TIME_OPTS_LOADING_CLASS );
	},

	unsetTimeOptionsLoading: function () {
		this.timeDisplay.parent().removeClass( TIME_OPTS_LOADING_CLASS );
	},

	onDatePickerDrawn: function ( picker ) {
		const m = picker.calendars[0].month;
		const y = picker.calendars[0].year;

		this.updateDateDisplay( null, m, y );
	},

	onDatePickerClosed: function () {
		this.updateDateDisplay(
			this.selectedDateTime.date(),
			this.selectedDateTime.month(),
			this.selectedDateTime.year()
		);
	},

	updateDateDisplay: function ( day, month, year ) {
		let display = this.picker._o.i18n.months[month] || ``;

		display += day ? ` ` + day : ``;
		display += year ? `, ` + year : ``;
		display = display.replace( /^\s*,?/, `` );
		this.pickerDisplay.text( display );
	},

	onTimePicked: function ( sbox ) {
		const time = parseInt( sbox.options[sbox.selectedIndex].value, 10 );

		this.updateTimeDisplay( time );
		this.selectedDateTime.hours( Math.floor( time / 3600 ));
		this.selectedDateTime.minutes( parseInt( time % 3600 / 60, 10 ));
	},

	updateTimeDisplay: function ( time ) {
		let hours = Math.floor( time / 3600 );

		hours = hours > 12 ? hours - 12 : hours;
		hours = hours === 0 ? 12 : hours;
		const mins = parseInt( time % 3600 / 60, 10 );

		this.timeDisplay.text(
			( hours < 10 ? `0` : `` ) +
				hours +
				`:` +
				( mins < 10 ? `0` : `` ) +
				mins +
				` ` +
				( time < 43200 ? `AM` : `PM` ) +
				` ` +
				this.timeDisplayTZ
		);
	},

	onNavLinkClick: function ( e ) {
		e.preventDefault();
		if ( this.isSubmitDisabled ) {
			return;
		}
		let link = $( e.target );

		link = link.hasClass( LINK_CLASS ) ? link : link.parents( `.` + LINK_CLASS );
		const platform = link.attr( `data-platform` );

		this.fireEvent( this.EVENTS.PLATFORM_PICKED, [ platform ]);
	},

	updateActivePlatform: function ( selectedPlatform ) {
		$( `.` + LINK_CLASS ).forEach( el => {
			const link = $( el );
			const platform = link.attr( `data-platform` );

			link[( platform === selectedPlatform ? `add` : `remove` ) + `Class`](
				LINK_ACTIVE_CLASS
			);
		});
	},

	getSelectedDateTime: function () {
		return new Date( this.selectedDateTime.unix() * 1000 );
	},

	getSelectedPlatform: function () {
		return this.navBarRoot.find( `.` + LINK_ACTIVE_CLASS ).attr( `data-platform` );
	},

	onDateTimeSubmit: function ( e ) {
		e.preventDefault();
		if ( !this.isSubmitDisabled ) {
			this.fireEvent( this.EVENTS.DATETIME_SUBMIT, [ this.getSelectedDateTime() ]);
		}
	},

	showPaytable: function ( e ) {
		e.preventDefault();
		if ( this.isCashGame()) {
			$( `.paytable--cash` )
				.appendTo( document.body )
				.modal({
					backdrop: true
				});
		} else {
			$( `.paytable--tokens` )
				.appendTo( document.body )
				.modal({
					backdrop: true
				});
		}
	},

	disableSubmit: function () {
		this.isSubmitDisabled = true;
		this.rootNode.addClass( SUBMITTING_CLASS );
		//ButtonView.disableForSubmitPending(this.navBarSubmitBtn);
		if ( !this.pageLoaderView ) {
			this.pageLoaderView = new PageLoaderView();
		}
		this.pageLoaderView.show( this.rootNode );
	},

	enableSubmit: function () {
		this.isSubmitDisabled = false;
		this.rootNode.removeClass( SUBMITTING_CLASS );
		//ButtonView.enableFromSubmitPending(this.navBarSubmitBtn);
		if ( this.pageLoaderView ) {
			this.pageLoaderView.hide();
		}
	}
});

export default ResultsView;
