/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(1);
	window.PCH = window.PCH || {};
	PCH.uniExp = PCH.uniExp || {};
	__webpack_require__(57);
	PCH.uniExp.callTokenBalanceApi = __webpack_require__(58).callTokenBalanceApi;
	PCH.uniExp.tokenCenter = __webpack_require__(58).tokenCenter;
	__webpack_require__(58).tokenCenterClick();
	PCH.completeRegister = __webpack_require__(62);

/***/ },

/***/ 1:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 57:
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	// nav code
	(function (win, doc, undefined) {
	    var header = $('.uninav');
	    var nav = $('.uninav__carousel');
	    if (!nav.length || !header.length) {
	        if (window.console) {
	            console.log('NO UNVERSAL NAVIGATION');
	        };
	        return false;
	    } else {
	        var _ret = function () {
	            var nextBtn = nav.find('.uninav__carousel__nxt'),
	                prvBtn = nav.find('.uninav__carousel__prv'),
	                navWindow = nav.find('.uninav__carousel__nav'),
	                navGroup = navWindow.find('.uninav__carousel__navlist'),
	                tabs = navGroup.find('.uninav__carousel__item'),
	                tabWidth = tabs.width(),
	                groupWidth = parseInt(tabWidth) * tabs.length,
	                shimPx = 2,
	                windowWidth = navWindow.width() + shimPx,
	                animate = false,
	                currentOffset = 0,
	                calc = tabWidth;
	            navGroup.width(groupWidth);

	            var checkButtonStates = function checkButtonStates() {
	                if (parseInt(currentOffset) == 0) {
	                    prvBtn.addClass('uninav__carousel__prv--disabled');
	                } else {
	                    prvBtn.removeClass('uninav__carousel__prv--disabled');
	                }

	                if (parseInt(currentOffset) == (groupWidth - windowWidth) * -1) {
	                    nextBtn.addClass('uninav__carousel__nxt--disabled');
	                } else {
	                    nextBtn.removeClass('uninav__carousel__nxt--disabled');
	                }
	            };

	            var slideAnimation = function slideAnimation(calculation, cb) {
	                animate = true;
	                currentOffset = currentOffset + calculation;
	                // the slide is achieved by adding a a* classname, where * is the offset
	                // a corresponding css style will move it the desired amount
	                navGroup.get(0).className = navGroup.get(0).className.replace(/uninav__carousel__navlist--a\d+/g, ''); // remove the old slide class name
	                navGroup.addClass("uninav__carousel__navlist--a" + Math.abs(currentOffset)); // add the new slide classname
	                animate = false;
	                if (cb) {
	                    cb();
	                }
	            };

	            var slideMenu = function slideMenu(direction, cb) {
	                if (direction === 'left') {
	                    if (animate === false && parseInt(currentOffset) > (groupWidth - windowWidth) * -1) {
	                        slideAnimation(calc * -1, cb);
	                    }
	                } else if (direction === 'right') {
	                    if (animate === false && parseInt(currentOffset) < 0) {
	                        slideAnimation(calc, cb);
	                    }
	                }
	            };

	            prvBtn.bind('click', function (e) {
	                if (!$(this).hasClass('uninav__carousel__prv--disabled')) {
	                    slideMenu('right', checkButtonStates);
	                }
	            });

	            nextBtn.bind('click', function (e) {
	                if (!$(this).hasClass('uninav__carousel__nxt--disabled')) {
	                    slideMenu('left', checkButtonStates);
	                }
	            });

	            checkButtonStates();
	            var completeRegLink = header.find("a.minireg");
	            completeRegLink.bind('click', function (e) {
	                if (typeof enableAccountsConfig !== 'undefined' && Boolean(enableAccountsConfig) === true) {
	                    e.preventDefault();
	                    window.location.href = PCH.RegURL;
	                } else {
	                    e.preventDefault();
	                    PCH.RFLightbox({ allowClose: true });
	                }
	            });
	            return {
	                v: true
	            };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	})(window, window.document);

/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var UninavConfig = __webpack_require__(59);
	var PCHGA = __webpack_require__(60); //REMOVE!!!
	var numberFormat = __webpack_require__(61);

	// @TODO...
	//  review call to LEADERBOARD.updateDailyTokens() w/Tanmay and adjust as needed
	//  review PCH.com compatiblilty methods and remove if possible

	//--------------------------------------------------------------------------
	// TOKEN CENTER FOR DESKTOP/TABLET
	//--------------------------------------------------------------------------

	var tokenCenter = function (win, doc, undefined) {

	    'use strict';

	    //--------------------------------------------------------------------------
	    // DEFAULTS
	    //--------------------------------------------------------------------------

	    var config = {
	        defaultTempo: 600, // default drop-down open rate (milliseconds)
	        autoTempo: 300, // auto open-close rate (milliseconds)
	        autoTime: 5000, // auto open-close pause time (milliseconds)
	        reopenTime: 500, // re-open pause time for next message (milliseconds)
	        transTime: 2000, // total transition to new message time (milliseconds)
	        transReopen: 70, // % of transition-in of new message to force re-open
	        bounceTempo: 200, // drop-down bounce rate (milliseconds)
	        bounceDown: 5, // number of pixels to bounce down when opening/closing
	        bounceBack: 10, // number of pixels to bounce back up when opening
	        nameLimit: 15, // limit for user names inserted in messages
	        handler: '', // name of API handler
	        errorText: '', // text to display on ajax call error
	        autoUpdate: true, // automatically update balance on initial page load

	        // Default HTML for token award messages
	        tokensHtml: '<p class="uninav__message-center__salutation">You\'ve earned</p><p class="uninav__message-center__earnings">__TOKENS__ Tokens!</p><p class="uninav__message-center__source">__DESC__</p>',
	        aggregateHtml: '<p class="uninav__message-center__salutation">You\'ve earned</p><p class="uninav__message-center__earnings">__TOKENS__ Tokens!</p>',

	        //Superfan Badge
	        useSfBadge: false,
	        //sfBadge: '<img class="sf-badge" src="/pch_media/images/logos/sf_logo_mobile.png">'
	        sfBadge: '<span class="uninav__sf-badge">Superfan</span'
	    };

	    //--------------------------------------------------------------------------
	    // TOKEN BALANCE METHODS
	    //--------------------------------------------------------------------------

	    /**
	     * Update the current token balance and display in token center
	     *
	     * @param   string  option balance type to switch to: 'current' or 'total', or legacy types 'balance' or 'creditTotal'
	     */
	    var updateTokenBalance = function updateTokenBalance(type) {
	        if (typeof type !== 'undefined') setTokenBalanceType(type);
	        fetchTokenBalance();
	    };

	    /**
	     * Set the token balance type to be shown in token center
	     *
	     * @param   string  balance type to show: 'current' or 'total', or legacy types 'balance' or 'creditTotal'
	     */
	    var setTokenBalanceType = function setTokenBalanceType(type) {
	        switch (type) {
	            case 'current':
	            case 'balance':
	                type = 'current';
	                break;
	            case 'total':
	            case 'creditTotal':
	                type = 'total';
	                break;
	            default:
	                return;
	        }
	        var indicator = container.find("li[rel*='" + type + "']");
	        indicator.siblings().removeClass('active');
	        indicator.addClass('active');
	    };

	    /**
	     * Execute the AJAX call to get the user's token balance
	     *
	     * @param   function    optional function to be called when ajax call completes
	     * @param   mixed       optional argument to pass to callback on success in addition to data
	     */
	    var fetchTokenBalance = function fetchTokenBalance(callback, arg) {
	        // if user details available, do not call for users without passwords
	        // @todo use constants for user types instead of hard coded values
	        if (typeof PCHUSER !== 'undefined' && typeof PCHUSER.type !== 'undefined' && PCHUSER.type < 2) {
	            processTokenBalance('bad user', false, callback, arg);
	            return;
	        }
	        // ajax url
	        if (!config.handler) {
	            processTokenBalance('bad config', false, callback, arg);
	            return;
	        }

	        // Commented MINI-BOOTSTRAP code, as this module is using com_pch_api component to get the token balance
	        //if (typeof PCHMINIBOOTSTRAP === 'undefined' || typeof PCHMINIBOOTSTRAP.contentBaseURL === 'undefined') {
	        //  var url = '/';
	        //} else {
	        //  var url = PCHMINIBOOTSTRAP.contentBaseURL;
	        //  if (url.slice(-1) !== '/') url += '/';
	        //}
	        var url = config.handler + 'balance';
	        // cache busting
	        url += url.indexOf('?') === -1 ? '?cb=' : '&cb=';
	        url += new Date().getTime();
	        // ajax call
	        $.ajax({
	            type: 'GET',
	            url: url,
	            dataType: 'json',
	            success: function success(data) {
	                if (typeof data !== 'undefiend' && data.status === 2 && data.iw_response) {
	                    processTokenBalance('okay', data, callback, arg);
	                } else {
	                    processTokenBalance('invalid', data, callback, arg);
	                }
	            },
	            error: function error(data) {
	                processTokenBalance('failed', data, callback, arg);
	            }
	        });
	    };

	    var updateBalanceDisplay = function updateBalanceDisplay(current, total) {
	        var balance = container.find('.uninav__reward-center__token-amount');
	        balance.data('current', typeof current === "number" ? numberFormat(current) : current);
	        balance.data('total', typeof total === "number" ? numberFormat(total) : total);
	        displayTokenBalance();
	    };

	    /**
	     * Callback to set the token balance and trigger display
	     *
	     * Expected format of ajax response data:
	     *
	     *  { "status": 2,
	     *    "iw_response": { "balance": "currentBalance", "creditTotal": "allTimeTokens" }
	     *  }
	     *
	     * @param   string      status: okay | bad user | bad config | failed | invalid
	     * @param   object      ajax response data (if available)
	     * @param   function    optional callback
	     * @param   mixed       optional argument to pass to callback with data on success
	     */
	    var processTokenBalance = function processTokenBalance(status, data, callback, arg) {
	        if (typeof callback === 'undefined') {
	            if (status === 'okay') {
	                updateBalanceDisplay(data.iw_response.balance, data.iw_response.creditTotal);
	                processLeveling(data);
	            } else if (config.errorText) {
	                var balance = container.find('.uninav__reward-center__token-amount');
	                balance.removeClass('uninav__reward-center__token-amount--token-loading');
	                balance.html(config.errorText);
	            }
	        } else if (typeof callback === 'function') {
	            // @todo why do we need to check if function? shouldn't it always be passed as such?
	            if (status === 'okay') {
	                // pass data and optional argument to callback on success
	                callback(data, arg);
	            } else {
	                // otherwise allow callback to handle error
	                callback();
	            }
	        }
	    };

	    /**
	    * Method to update token balance with the given amounts without requiring
	    * an additional call to the api
	    *
	    * @param int current balance
	    * @param int all time credit total
	    */
	    var processTokenBalanceDisplay = function processTokenBalanceDisplay(balance, creditTotal) {
	        return updateBalanceDisplay(balance, creditTotal);
	    };

	    // helper method to add a level-state classname
	    // it will also remove any existing level state prefix
	    // @param elem
	    // @param {string} class prefix (eg "uninav__token-center" results in "uninav__token-center--gold")
	    // @param {string} levelName The level name (eg "gold") 
	    function addLevelClass(elem, prefix, levelName) {
	        var $elem = $(elem);
	        if ($elem.length == 0) {
	            return;
	        }
	        elem = $elem.get(0);
	        var re = new RegExp(prefix + '--\\w+');
	        elem.className = elem.className.replace(re, '');
	        $elem.addClass(prefix + "--" + levelName);
	    }

	    /* add backgrounds/styles based on level received from JSON */
	    var processLeveling = function processLeveling(data) {
	        if (_typeof(data.iw_response.data.level) == "object") {
	            var _tokenCenter = container.find('.uninav__token-center'),
	                levelName = data.iw_response.data.level.level.toLowerCase(),
	                gameCenter = container.find('.uninav__game-center__bg'),
	                statusIcon = container.find('.uninav__my-status__icon'),
	                levelAmount = container.find('.uninav__game-center__level-amount'),
	                tokenLevelFeedbackText = container.find('.uninav__token-level-feedback__text');

	            addLevelClass(_tokenCenter, "uninav__token-center", levelName);

	            tokenLevelFeedbackText.html(data.iw_response.data.level.levelText);

	            //set amount in rewards status
	            levelAmount.html(data.iw_response.data.level.levelInfo);

	            //change stat simage
	            addLevelClass($(".uninav__game-center__rewards-status__image"), "uninav__game-center__rewards-status__image", levelName);
	            //add bg image for level
	            addLevelClass(gameCenter, 'uninav__display-token-level', levelName);
	            //change small icon in my status
	            addLevelClass(statusIcon, 'uninav__token-level-icon', levelName);

	            levelShowOrHide.unbind('click', toggleFeedback);
	            levelShowOrHide.click(toggleFeedback);

	            if (!PCH.uniExp.tokenCenterOptions.celebrationAutoLoad) PCH.uniExp.tokenCenterOptions.celebrationAutoLoad = true;
	            if (data.iw_response.data.level.hasLevelUp == true && PCH.uniExp.tokenCenterOptions.celebrationAutoLoad == true) {
	                var celebCb = typeof PCH.LEVELS.celebrationEndCallback == "function" ? PCH.LEVELS.celebrationEndCallback : function () {};
	                PCH.LEVELS.triggerLevelUpCelebration({
	                    celebrationEndCallback: celebCb
	                }, data);
	            }
	            $(".uninav__game-center__token-level-create-password").click(function (event) {
	                $(".uninav__continue-registration ul li a").trigger("click");
	            });
	        } else {
	            //hide if no leveling info
	            container.find('.uninav__game-center').hide();
	            container.find('.uninav__my-status').hide();
	        }
	    };

	    var toggleFeedback = function toggleFeedback(tempo) {

	        var container = $('.uninav__token-level-feedback__expanded, .token-level-feedback-expanded');
	        if (isFeedbackExpanded === false) {

	            levelShowOrHide.text('[-]');
	            container.show();
	            isFeedbackExpanded = true;
	            isExpanded = false; //have token-container expand instead of close on toggle

	            expandContainer(tcContent[0].scrollHeight, tempo);
	            //toggleContainer(600, false);
	        } else {
	            levelShowOrHide.text('[+]');
	            var containerHeight = container.height();
	            container.hide();
	            isFeedbackExpanded = false;
	            isExpanded = false; //have token-container expand instead of close on toggle

	            collapseContainer(tcContent[0].scrollHeight - containerHeight, tempo);
	            // toggleContainer(600, true);
	        }
	    };

	    /**
	     * Display token balance
	     */
	    var displayTokenBalance = function displayTokenBalance() {
	        var balance = container.find('.uninav__reward-center__token-amount');
	        if (balance && balance.data('current') !== 'loading') {
	            var type = container.find("li[rel*='current']").hasClass('active') ? 'current' : 'total';
	            balance.removeClass('uninav__reward-center__token-amount--token-loading');
	            balance.html(balance.data(type));
	        }
	    };

	    //--------------------------------------------------------------------------
	    // DROP DOWN MESSAGE WINDOW METHODS
	    //--------------------------------------------------------------------------

	    /**
	     * Determine if messages window is open
	     *
	     * @return  bool    true if drop-down is open
	     */
	    var isExpanded = function isExpanded() {
	        return !!(msgStatus & 1);
	    };

	    /**
	     * Open or close messages container (done manually by user)
	     *
	     * @param   int     tempo (milliseconds)
	     */
	    var toggleContainer = function toggleContainer(tempo, track) {
	        // Note: will ignore request if currently opening or closing, or if not initialized yet
	        if (tcClosedHeight != -1) switch (msgStatus) {
	            // window is currently closed, so it should be opened...
	            case 0:
	                //if (typeof track !== 'undefined' && track) PCHGA.trackEvent('TokenCenter', 'link-click', 'expand');
	                openContainer(true, tempo);
	                break;
	            // window is currently open, so it should be closed...
	            case 1:
	                closeContainer(tempo);
	                break;
	        }
	    };

	    /**
	     * Open messages container
	     *
	     * @param   bool    true to open full window, otherwise only for last activity
	     * @param   int     tempo (milliseconds)
	     */
	    var openContainer = function openContainer(full, tempo) {
	        // only can be opened if currently closed (i.e. status is 0)
	        // if closed, will set status to 3 (i.e. opening)
	        // note: the check of current status and setting is atomic
	        if (msgStatus != 0 || !(msgStatus = 3)) return;
	        // during transition to new message, track window has been re-opened
	        if (msgTransition & 1) msgTransition |= 4;
	        // determine how far window will open
	        if (full) {
	            container.removeClass('uninav__token-center-container--last-activity');
	        } else {
	            container.addClass('uninav__token-center-container--last-activity');
	        }
	        // animate opening of window...
	        if (typeof tempo === 'undefined') tempo = config.defaultTempo;
	        expandContainer(tcContent[0].scrollHeight, tempo, function (e) {
	            // set style of indicator and status to opened
	            container.addClass('uninav__token-center-container--expanded');
	            msgStatus = 1;
	            // execute any pending rendering actions
	            // note: check of current renderOnChange state and reset to 0 is atomic
	            var renderDelay = void 0;
	            if (renderDelay = renderOnChange + (renderOnChange = 0)) setTimeout(function () {
	                renderMessage();
	            }, renderDelay);
	        });
	    };

	    /**
	     * Open messages container automatically to show latest activity
	     */
	    var autoOpenContainer = function autoOpenContainer() {
	        renderOnChange = Math.max(1, config.autoTime); // continue rendering when opened
	        msgAutoClose = true; // trigger auto-close when done
	        openContainer(false); // open window, but only for last activity
	    };

	    /**
	     * Close messages container
	     */
	    var closeContainer = function closeContainer(tempo) {
	        // only can be closed if currently open (i.e. status is 1)
	        // if open, will set status to 2 (i.e. closing)
	        // note: the check of current status and setting is atomic
	        if (msgStatus != 1 || !(msgStatus = 2)) return;
	        msgAutoClose = false;
	        // during transition to new message, track window has been closed
	        if (msgTransition & 1) msgTransition |= 2;
	        // animate closing of window...
	        if (typeof tempo === 'undefined') tempo = config.defaultTempo;
	        collapseContainer(tcClosedHeight, tempo, function (e) {
	            // set style of indicator status to closed
	            container.removeClass('uninav__token-center-container--expanded');
	            msgStatus = 0;
	            // execute any pendin grendering actions
	            // note: pass current renderOnChange state and reset to 0 is atomic
	            var renderDelay = void 0;
	            if (renderDelay = renderOnChange + (renderOnChange = 0)) setTimeout(function () {
	                renderMessage();
	            }, renderDelay);
	        });
	    };

	    /**
	     * Expand messages container to larger height
	     */
	    var expandContainer = function expandContainer(height, tempo, callback) {
	        var bounceHeight = height + config.bounceDown;
	        if (config.bounceBack) {
	            tcContent.animate({
	                'height': bounceHeight + 'px'
	            }, tempo, 'swing', function (e) {
	                tcContent.animate({
	                    'height': '-=' + config.bounceBack
	                }, config.bounceTempo, 'swing', callback);
	            });
	        } else {
	            tcContent.animate({
	                'height': bounceHeight + 'px'
	            }, tempo, 'swing', callback);
	        }
	    };

	    /**
	     * Collapse messages container to smaller height
	     */
	    var collapseContainer = function collapseContainer(height, tempo, callback) {
	        if (config.bounceDown) {
	            tcContent.animate({
	                'height': '+=' + config.bounceDown
	            }, config.bounceTempo, 'swing', function (e) {
	                tcContent.animate({
	                    'height': height + 'px'
	                }, tempo, 'swing', callback);
	            });
	        } else {
	            tcContent.animate({
	                'height': height + 'px'
	            }, tempo, 'swing', callback);
	        }
	    };

	    //--------------------------------------------------------------------------
	    // LAST ACTIVITY METHODS
	    //--------------------------------------------------------------------------

	    /**
	     * Display one or more messages
	     *
	     * @param   mixed   message (string or object) or messages (array)
	     */
	    var showMessage = function showMessage(message) {
	        // process list of messages individually, so each can be checked for any delay
	        if ($.isArray(message)) {
	            for (var i = 0, k = message.length; i < k; ++i) {
	                showMessage(message[i]);
	            }
	            return;
	        }
	        // add message(s) to end of queue
	        if (message) {
	            if ($.isPlainObject(message) && typeof message.delay !== 'undefined' && message.delay > 0) {
	                var delay = message.delay * 1000;
	                message.delay = 0;
	                setTimeout(function () {
	                    showMessage(message);
	                }, delay);
	                return;
	            }
	            msgQueue = msgQueue.concat(message);
	        }
	        // if not active, set to active and render
	        // note 1: rendering is skipped if tcClosedHeight is not initialized yet
	        // note 2: the check if not active and setting to active state must be atomic
	        if (tcClosedHeight != -1 && msgQueue.length && !msgActive && (msgActive = true)) renderMessage();

	        // trigger callback to Leaderboard to update user's daily tokens
	        // @todo Review with Tanmay and adjust as needed...
	        if (typeof LEADERBOARD !== 'undefined' && typeof LEADERBOARD.updateDailyTokens == 'function') {
	            LEADERBOARD.updateDailyTokens();
	        }
	    };

	    /**
	     * Display any pending message in queue or close messages window if necessary
	     */
	    var renderMessage = function renderMessage() {
	        if (msgQueue.length) {
	            switch (msgStatus) {
	                case 0:
	                    // window is currently closed
	                    renderNewMessage(msgQueue.shift());
	                    break;
	                case 1:
	                    // window is currently open
	                    renderNextMessage(msgQueue.shift());
	                    break;
	                case 2:
	                    // window is currently closing
	                    renderOnChange = Math.max(1, config.reopenTime);
	                    break;
	                case 3:
	                    // window is currently opening
	                    renderOnChange = 1;
	                    break;
	            }
	        } else {
	            // close if necessary when no additional messages in queue
	            if (msgStatus == 1 && msgAutoClose) closeContainer();
	            msgActive = false;
	        }
	    };

	    /**
	     * Display next message in queue and open messages window
	     *
	     * @param   object  message
	     */
	    var renderNewMessage = function renderNewMessage(message) {
	        var header = tcContent.find('.uninav__message-center__activity-header'),
	            notices = tcContent.find('.uninav__message-center__message-display');
	        // ensure "latest activity" header is shown and remove old classes
	        if (header.not(':visible')) {
	            header.show();
	            notices.removeClass('uninav__message-center__nopassword uninav__message-center__complete-reg');
	        }
	        // insert message into messages window, and automatically open messages window
	        notices.html(getMessageHtml(message));
	        autoOpenContainer();
	    };

	    /**
	     * Transition to next message in queue when message window is open
	     *
	     * @param   object  message
	     */
	    var renderNextMessage = function renderNextMessage(message) {
	        // get old sizes to determine if resizing will be needed
	        var header = tcContent.find('.uninav__message-center__activity-header'),
	            notices = tcContent.find('.uninav__message-center__message-display'),
	            oldHeight = tcContent[0].scrollHeight,
	            heightAdjust = -notices.height();
	        // this lets us track if user closes (or closes and re-opens) window during transition
	        msgTransition = 1;
	        // half of transfer time will be used to remove old message, half to add new message
	        var halfTransTime = config.transTime / 2;
	        // animate out old message...
	        notices.fadeOut(halfTransTime, function () {
	            // enable "latest activity" header if not active, remove old classes and adjust height
	            if (header.not(':visible')) {
	                header.show();
	                notices.removeClass('uninav__message-center__nopassword uninav__message-center__complete-reg');
	                heightAdjust += header.height();
	            }
	            // insert new message, and complete calculation of any height adjustment needed
	            notices.html(getMessageHtml(message));
	            heightAdjust += notices.height();
	            // this is used to track when both animations complete (see renderNextMessageDone below)
	            renderNextMessageCount = 0;
	            // will only need to check for user closing/opening window during a % of transition-in time
	            var monitorTime = halfTransTime * config.transReopen / 100;
	            if (heightAdjust) monitorTime = Math.max(monitorTime, config.autoTempo);
	            setTimeout(function () {
	                msgTransition &= 6;
	            }, monitorTime);
	            // animate in new message...
	            notices.fadeIn({
	                queue: false,
	                duration: halfTransTime,
	                complete: renderNextMessageDone
	            });
	            // resize if necessary, then continue rendering
	            // note: should only resize if window is open (i.e. it may have been closed by user)
	            // @todo would ot cause issues if the user closed then re-opened the window? 
	            if (heightAdjust > 0 && msgStatus == 1) {
	                var newHeight = oldHeight + heightAdjust;
	                expandContainer(newHeight, config.autoTempo, renderNextMessageDone);
	            } else if (heightAdjust < 0 && msgStatus == 1) {
	                var _newHeight = oldHeight + heightAdjust - (config.bounceBack - config.bounceDown);
	                collapseContainer(_newHeight, config.autoTempo, renderNextMessageDone);
	            } else {
	                renderNextMessageDone();
	            }
	        });
	    };
	    // renderNextMessageDone is called when transition to new message is completed
	    // However, since there are 2 animations active simultaneously, we wait until both complete before continuing
	    // @todo could probably use promise functions instead
	    var renderNextMessageCount = void 0;
	    var renderNextMessageDone = function renderNextMessageDone() {
	        if (++renderNextMessageCount > 1) {
	            // check if window was closed, and not re-opened during transition-in time
	            if ((msgTransition & 6) == 2) {
	                autoOpenContainer();
	            } else {
	                setTimeout(function () {
	                    renderMessage();
	                }, config.autoTime);
	            }
	        }
	    };

	    /**
	     * Return html for one message
	     *
	     * Message Objects:
	     *  message (rendered as <p>)...    { type:'message', text:TEXT, classes:CLASS, styles:STYLE}
	     *  tokens (default if object)...   { type:'tokens', value:TOKENS, description:TEXT }
	     *
	     * Notes:
	     *  will insert user's name into __NAME__, __FIRST__, __LAST__, etc. see insertUserInfo() below
	     *  will support line breaks in message text or token descriptions where \n chars are present
	     *
	     * @todo Define additional message types, including rendering for desktop/tablet AND mobile via UNiS
	     *
	     * @param   mixed   message object or string as a simple 'message' object
	     * @return  string  html for message (or '' if invalid or unknown type)
	     */
	    var getMessageHtml = function getMessageHtml(message) {
	        var messageHtml = '';

	        if (typeof message === 'string') {
	            // assume basic text 'message' when passed as a string
	            message = {
	                type: 'message',
	                'text': message
	            };
	        } else {
	            // when passed as an object, must be a simple object
	            if (!$.isPlainObject(message)) return '';
	            // if 'type' not set in object, assume 'token' message for PCH.com compatibility
	            if (typeof message.type === 'undefined') message.type = 'tokens';
	        }
	        switch (message.type) {
	            case 'message':
	                var attrib = '',
	                    text = $.trim(message['text']).replace(/\s*\n\s*/g, '<br>');
	                if (text) {
	                    if (message['class']) attrib += ' class="' + message['class'] + '"';
	                    if (message['style']) attrib += ' style="' + message['style'] + '"';
	                    messageHtml = '<p' + attrib + '>' + insertUserInfo(text) + '</p>';
	                }
	                break;
	            case 'tokens':
	                var desc = $.trim(message.description).replace(/\s*\n\s*/g, '<br>');
	                if (desc) {
	                    var html = config.tokensHtml,
	                        firstDescWord = String(desc.split(' ', 1));
	                    if (firstDescWord != '') {
	                        // if first word of description is already in the text, remove it from description
	                        var regex = new RegExp(firstDescWord + '\\s+__DESC__', 'i');
	                        if (regex.test(html)) desc = desc.substr(firstDescWord.length + 1);
	                    }
	                    html = html.replace(/__DESC__/i, desc); // insert description into html
	                } else {
	                    var html = config.aggregateHtml;
	                }
	                var tokens = formatNumber(message.value) || 'No';
	                messageHtml = insertUserInfo(html.replace(/__TOKENS__/i, tokens));

	                if (config.useSfBadge) {
	                    messageHtml = messageHtml.replace(/(^<p.*?>)/, '$1' + config.sfBadge);
	                }
	                break;
	            case 'tokens_custom':
	                var desc = $.trim(message.description);

	                if (desc) {
	                    var html = desc;
	                } else {
	                    var html = config.aggregateHtml;
	                }
	                var tokens = formatNumber(message.value) || 'No';
	                messageHtml = insertUserInfo(html.replace(/__TOKENS__/i, tokens));

	                if (config.useSfBadge) {
	                    messageHtml = messageHtml.replace(/(^<p.*?>)/, '$1' + config.sfBadge);
	                }
	                break;

	            // @todo Future additional message object types...
	        }

	        return messageHtml;
	    };

	    /**
	     * Return string with user info inserted
	     *
	     * Insertion vars Supported:
	     *
	     *  __NAME__        User's name as configured in admin
	     *  __FIRST__       User's first name
	     *  __LAST__        User's last name
	     *  __FULLNAME__    User's first and last name
	     *
	     * @param   string  string with insertion vars to be filled in
	     * @return  string  string with user info inserted
	     */
	    var insertUserInfo = function insertUserInfo(text) {
	        var regex = void 0,
	            prop = void 0;
	        for (prop in userInfo) {
	            if (!userInfo.hasOwnProperty(prop)) continue;
	            regex = new RegExp('__' + prop + '__', 'gi');
	            text = text.replace(regex, userInfo[prop].replace(/\s/g, '&nbsp;'));
	            // @todo Remove this deprecated insertion var format once no longer used by PCH.com...
	            regex = new RegExp('\\[\\[%' + prop + '%\\]\\]', 'gi');
	            text = text.replace(regex, userInfo[prop].replace(/\s/g, '&nbsp;'));
	        }
	        return text;
	    };
	    // Used by above code to truncate user names as needed
	    var truncateName = function truncateName(name) {
	        if (config.nameLimit && name.length > config.nameLimit) {
	            name = name.substr(0, config.nameLimit).replace(/\s+$/, '') + '...';
	        }
	        return name;
	    };
	    // List of user info to be inserted
	    // @todo Review and remove these comments when these PCH.com features are no longer needed...
	    //  insertion vars as [[%VAR%]] whereas most other places we use the __VAR__ format
	    //  NAME  var always contained "First L.", but now can be configured in the admin
	    //  FIRSTNAME, LASTNAME and FIRSTLAST vars instead of simpler FIRST, LAST and FULLNAME vars
	    //  LASTFIRST as a var, although the Sso User did not support this format and would return it as "First Last"
	    var userInfo = {
	        'name': PCHUSER.messageName,
	        first: truncateName(PCHUSER.firstName),
	        last: truncateName(PCHUSER.lastName),
	        fullname: truncateName($.trim(PCHUSER.firstName + ' ' + PCHUSER.lastName))
	    };

	    /**
	     * Format number for display
	     *
	     * Simplified version of formatNumber located in uni-shelf.js
	     * Included here to avoid issues if uni-shelf.js loaded later
	     *
	     * @param   int|string  numeric value to be formatted
	     * @param   string      optional prefix
	     *
	     * @return  formatted number
	     */
	    var formatNumber = function formatNumber(num, prefix) {
	        if (!num) return false;
	        if (typeof num === 'number') num = num.toString();
	        num = num.replace(/\,/g, '');
	        num = num.split('.');
	        num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	        num = num.join('.');
	        if (prefix) num = prefix + num;
	        return num;
	    };

	    //--------------------------------------------------------------------------
	    // INITIALIZATION
	    //--------------------------------------------------------------------------

	    // get reference to token center
	    var container = $('.uninav__token-center-container'); // token center main container
	    if (!container.length) {
	        if (window.console) console.log('NO TOKEN MANAGER');
	        return false;
	    }

	    // local variables
	    var tcContent = container.find('.uninav__token-center'),
	        // token center content (token balance plus messages, etc. but w/o footer)
	    tcClosedHeight = -1,
	        // closed height of token center content (-1 = not set yet; set when doc ready)
	    msgQueue = [],
	        // pending messages queue
	    msgStatus = 0,
	        // message window status (bit 0 = open, bit 1 = open)
	    msgActive = false,
	        // message display currently active
	    msgAutoClose = false,
	        // auto close message window when all messages have been shown
	    msgTransition = 0,
	        // message transition status (bit 0 = active, bit 1 = closed, bit 2 = opened)
	    renderOnChange = 0,
	        // render messages when opening/closing completed (0=no, 1+=yes, after delay)
	    levelShowOrHide = $('.uninav__game-center__level-show-or-hide'),
	        // show or hide button for rewards text in token center
	    isFeedbackExpanded = false; //for rewards text in token center

	    // configuration
	    if ($.isPlainObject(PCH.uniExp.tokenCenterOptions)) {
	        var options = PCH.uniExp.tokenCenterOptions;
	        for (var property in config) {
	            if (!config.hasOwnProperty(property)) continue;
	            if (typeof options[property] !== 'undefined') config[property] = options[property];
	        }

	        if (options.showBadge && options.isSuperFan) config.useSfBadge = options.showBadge == '1' && options.isSuperFan == '1';

	        // restore last activity
	        if (typeof options.lastActivity !== 'undefined') {
	            tcContent.find('.uninav__message-center__message-display').html(getMessageHtml(options.lastActivity));
	        }
	    }

	    // open or close token center drop-down when button clicked
	    container.find('.uninav__token-center__footer__toggle-action').bind('mouseup', function (e) {
	        toggleContainer(undefined, true);
	    });

	    // change token balance when token type indicators clicked
	    tcContent.find('.uninav__reward-center ul li').bind('mouseup', function (e) {
	        var target = $(e.target);
	        if (!target.hasClass('active')) {
	            setTokenBalanceType(target.attr('rel'));
	            displayTokenBalance();
	        }
	    });

	    // display token balance and re-calculate closed height when document is ready
	    $(document).ready(function () {
	        if (config.autoUpdate) updateTokenBalance();
	        tcClosedHeight = Math.max(0, tcContent.height());
	        if (msgQueue.length && !msgActive && (msgActive = true)) renderMessage();
	        container.find('.uninav__token-center__footer__toggle-action').show();
	    });

	    // return Token Center object
	    return {
	        updateTokenBalance: updateTokenBalance,
	        processTokenBalanceDisplay: processTokenBalanceDisplay,
	        isExpanded: isExpanded,
	        toggleContainer: toggleContainer,
	        showMessage: showMessage,
	        fetchTokenBalance: fetchTokenBalance
	    };
	}(window, window.document);

	var callTokenBalanceApi = function callTokenBalanceApi(callback, type) {
	    this.tokenCenter.fetchTokenBalance(callback, type);
	};

	module.exports = {
	    callTokenBalanceApi: callTokenBalanceApi,
	    tokenCenter: tokenCenter,
	    tokenCenterClick: function tokenCenterClick() {
	        if (PCH.uniExp.tokenCenter) {
	            $('main,header,footer').delegate('*', 'mouseup', function (e) {
	                if (PCH.uniExp.tokenCenter.isExpanded()) {
	                    PCH.uniExp.tokenCenter.toggleContainer();
	                }
	            });
	        }
	    }
	};

/***/ },

/***/ 59:
/***/ function(module, exports) {

	"use strict";

	var PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
	if (typeof PCHMINIBOOTSTRAP.contentBaseURL === "undefined") PCHMINIBOOTSTRAP.contentBaseURL = "";

	module.exports = {
	  callTokenBalanceApiURL: PCHMINIBOOTSTRAP.contentBaseURL + 'index.php?option=com_pchcom_content&task=tokenBalance&format=raw&' + new Date().getTime()
	};

/***/ },

/***/ 60:
/***/ function(module, exports) {

	"use strict";

	module.exports = { trackEvent: function trackEvent() {} };

/***/ },

/***/ 61:
/***/ function(module, exports) {

	'use strict';

	function numberFormat(val, decimals) {
	    val = parseFloat(val, 10);
	    if (decimals) {
	        val = val.toFixed(decimals);
	    }
	    val = "" + val;
	    var x = val.split('.');
	    var x1 = x[0];
	    var x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    return x1 + x2;
	}

	module.exports = numberFormat;

/***/ },

/***/ 62:
/***/ function(module, exports) {

	"use strict";

	module.exports = function (e) {
		PCHUSER.isSocialReg || PCHUSER.isMiniReg ? window.location.href = PCH.MiniRegURL : PCHSSOLightbox.searchCreatePassword();
	};

/***/ }

/******/ });