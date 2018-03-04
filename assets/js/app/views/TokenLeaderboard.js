import $ from "vendor/zepto";
import EventsMixin from "app/mixins/events";
import animationUtil from "app/modules/animationUtil";

const TokenLeaderboardView = function () {};

Object.assign( TokenLeaderboardView.prototype, EventsMixin, {
	EVENTS: {
		UPDATE_DAILY_TOKEN: `onUpdateDailyToken`
	},

	init: function () {
		this.currentSlideNum = 1;
	},

	mount: function () {
		this.rootNode = $( `#token-leaderboard` );

		this.selectPlatform = this.rootNode.find(
			`#token-leaderboard__select-platform`
		);
		this.desktopTab = this.selectPlatform.find( `li.desktop` );
		this.appTab = this.selectPlatform.find( `li.app` );
		this.dailyLeaderScroller = this.rootNode.find(
			`.token-leaderboard__daily-list-leader-scroller`
		);
		this.rootNode.on( `click`, `.left-arrow`, this.onLeftArrowClick.bind( this ));
		this.rootNode.on(
			`click`,
			`.right-arrow`,
			this.onRightArrowClick.bind( this )
		);
		this.status = this.rootNode.find( `.page-status` );
		this.leftArrow = this.rootNode.find( `.left-arrow` );
		this.rightArrow = this.rootNode.find( `.right-arrow` );
		this.rewardContent = this.rootNode.find( `#pch_leaderboard_rewards` );
		this.rewardLink = this.rootNode.find( `.token-leaderboard__bottom-link` );
		this.rewardLink.on( `click`, this.showRewards.bind( this ));
		this.rewardClose = this.rootNode.find( `.pch_leaderboard_rewards_close` );
		this.rewardClose.on( `click`, this.hideRewards.bind( this ));
		this.animationInProgress = false;
		this.selectPlatform.on(
			`click`,
			`.desktop`,
			{
				platform: `desktop`
			},
			this.changePlatform.bind( this )
		);
		this.selectPlatform.on(
			`click`,
			`.app`,
			{
				platform: `app`
			},
			this.changePlatform.bind( this )
		);
		this.platform = `desktop`;

		this.totalSlidesDesktop = Math.ceil(
			this.rootNode[0].dataset.totalRecordsDesktop / 5
		);
		this.totalSlidesApp = Math.ceil(
			this.rootNode[0].dataset.totalRecordsApp / 5
		);
		this.totalSlides = this.totalSlidesDesktop; //initially set to desktop

		this.loadInitialSlide();

		this.userDailyTokenBalanceContainer = $(
			`#token-leaderboard__daily-token-balance`
		);
		//this.updateUserTokenBalance();
		this.fireEvent( this.EVENTS.UPDATE_DAILY_TOKEN );

		this.updateStatus();
	},

	loadInitialSlide: function () {
		const initialSlide = this.createSlide( 1 );

		this.currentSlide = initialSlide;

		if ( this.currentSlideNum == this.totalSlides ) {
			this.rightArrow.addClass( `disabled` );
		}
	},
	updateFromAppState: function ( appModel ) {
		this.updateDailyToken( appModel );
	},

	onLeftArrowClick: function () {
		let newSlide;

		if ( !this.animationInProgress && this.currentSlideNum != 1 ) {
			this.currentSlideNum--;
			newSlide = this.createSlide( this.currentSlideNum );
			this.scrollLeft( newSlide );
			this.updateStatus();
			if ( this.currentSlideNum == 1 ) {
				this.leftArrow.addClass( `disabled` );
			}
			if ( this.currentSlideNum == this.totalSlides - 1 ) {
				this.rightArrow.removeClass( `disabled` );
			}
		}
	},
	onRightArrowClick: function () {
		let newSlide;

		if ( !this.animationInProgress && this.currentSlideNum != this.totalSlides ) {
			this.currentSlideNum++;
			newSlide = this.createSlide( this.currentSlideNum );
			this.scrollRight( newSlide );
			this.updateStatus();
			if ( this.currentSlideNum == this.totalSlides ) {
				this.rightArrow.addClass( `disabled` );
			}
			if ( this.currentSlideNum == 2 ) {
				this.leftArrow.removeClass( `disabled` );
			}
		}
	},
	scrollLeft: function ( slide ) {
		//do animation
		this.animationInProgress = true;
		animationUtil.animate(
			this.currentSlide,
			animationUtil.ANIMS.SLIDE_OUT_RIGHT
		);

		animationUtil.animate(
			slide,
			animationUtil.ANIMS.SLIDE_IN_LEFT,
			function () {
				this.currentSlide.remove();
				this.currentSlide = slide;
				this.animationInProgress = false;
			}.bind( this )
		);
	},
	scrollRight: function ( slide ) {
		//do animation
		this.animationInProgress = true;
		animationUtil.animate(
			this.currentSlide,
			animationUtil.ANIMS.SLIDE_OUT_LEFT
		);

		animationUtil.animate(
			slide,
			animationUtil.ANIMS.SLIDE_IN_RIGHT,
			function () {
				this.currentSlide.remove();
				this.currentSlide = slide;
				this.animationInProgress = false;
			}.bind( this )
		);
	},
	scrollInLeft: function ( slide ) {
		this.animationInProgress = true;

		animationUtil.animate(
			slide,
			animationUtil.ANIMS.SLIDE_IN_RIGHT,
			function () {
				this.currentSlide.remove();
				this.currentSlide = slide;
				this.animationInProgress = false;
			}.bind( this )
		);
	},
	bounceInLeft: function ( slide ) {
		this.animationInProgress = true;
		animationUtil.animate(
			this.currentSlide,
			animationUtil.ANIMS.SLIDE_OUT_LEFT
		);
		animationUtil.animate(
			slide,
			animationUtil.ANIMS.BOUNCE_IN_RIGHT,
			function () {
				this.currentSlide.remove();
				this.currentSlide = slide;
				this.animationInProgress = false;
			}.bind( this )
		);
	},
	createSlide: function ( slideNumber ) {
		const newSlide = $( `<ul/>` ).html(
			$(
				`#token-leaderboard__daily-list-leaders-` +
					this.platform +
					`-` +
					slideNumber
			).html()
		);

		this.dailyLeaderScroller.append( newSlide );
		return newSlide;
	},
	updateStatus: function () {
		if ( this.totalSlides > 0 )
			this.status.text( this.currentSlideNum + ` of ` + this.totalSlides );
		else {
			this.status.text( `-- of --` );
		}
	},
	changePlatform: function ( e ) {
		this.platform = e.data.platform;
		const newSlide = this.createSlide( 1 );

		this.bounceInLeft( newSlide );
		if ( e.data.platform == `desktop` ) {
			this.desktopTab.addClass( `active` );
			this.appTab.removeClass( `active` );
			this.totalSlides = this.totalSlidesDesktop;
		} else {
			this.appTab.addClass( `active` );
			this.desktopTab.removeClass( `active` );
			this.totalSlides = this.totalSlidesApp;
		}
		this.currentSlideNum = 1;

		this.updateArrowsOnPlatformChange();
		this.updateStatus();
	},
	showRewards: function ( e ) {
		e.preventDefault();
		this.rewardContent.addClass( `shown` );
	},
	hideRewards: function ( e ) {
		e.preventDefault();
		this.rewardContent.removeClass( `shown` );
	},
	updateDailyToken: function ( appModel ) {
		this.userDailyTokenBalanceContainer.html( appModel.dailyTokenBalance );
	},
	updateArrowsOnPlatformChange: function () {
		this.leftArrow.addClass( `disabled` );
		if ( this.totalSlides == 1 ) {
			this.rightArrow.addClass( `disabled` );
		} else {
			this.rightArrow.removeClass( `disabled` );
		}
	}
});

export default TokenLeaderboardView;
