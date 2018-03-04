/* */ 
"format cjs";
PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
if (typeof PCHMINIBOOTSTRAP.htmlgameBaseURL === "undefined") PCHMINIBOOTSTRAP.htmlgameBaseURL = "";

if (PCH.device == "MOBILE") {
    IWGAME.gameJson.init.game.width = window.innerWidth;
    IWGAME.gameJson.init.game.height = window.innerHeight;
    IWGAME.gameJson.init.game.device = PCH.device.toLocaleLowerCase();
}
var pchcom_gamemanager = {};
function init_pchcom_gamemanager(config, gameJson, GameManager) {

    console.log("init pchcom game manager");

    Object.assign(config, {
        "iframeParent": document.getElementById("htmlgame_frame_div"),
        "wsURL": PCH.GAMES.gameInfo.scoreSubmitURL,
        "gameProxyUrl": IWGAME.gameProxyURL,
        "cacheBuster": 123,
        "videoAdTimeout": 700,
        "maxAdDuration": 70000,
        "timeoutDuration": 15000,
        "outlineFrameDiv": "#htmlgame_frame_outline",
        "adHolder": "#iw_outer_ad_holder",
        "callBackFunction": "pchcom_callback",
        "gameOverScreenID": "#iwgos",
        "gameOverScreenHolder": "#gosholder",
        "gameOverScreenAmountHolder": "#amount",
        "width": window.innerWidth,
        "height": window.innerHeight,
        //"gameloaded": gameLoaded_cb,
        //"end": endCallback,
        "iwTokenThreshold": IWGAME.iwTokenThreshold
    });

    //Set json objects
    var gameApiDataJson = gameJson.apiData;
    var gameInitJson = gameJson.init;
    gameInitJson.serviceUri = config.wsURL;
    if(gameInitJson.service) {
        gameInitJson.service.url = gameInitJson.serviceUri;
        gameInitJson.service.data = gameApiDataJson;
    }

    // @TODO what is this for?
    var parentGameInitJson = gameJson.parentInit;
    if(parentGameInitJson) {
        parentGameInitJson.service.url = config.wsURL;
    }

    // create game manager
    var _gameManager = new GameManager(gameInitJson, {gos: window.GOS});
    if(window.location.href.match(/_simulator=1/) && window.AjaxSimulator) {
        console.log("using simulator");
        _gameManager.service.ajax = window.AjaxSimulator.ajax;
    }

    var respObjVal = {
            0: "",
            1: "silver",
            2: "gold",
            "tokenwin": "t_win",
            "tokenloose": "t_loose",
            "cashwin": "cash",
            "techDiff": "t_diff",
            "prodlineup": "cashoff-prodlineup",
            "claimURL": "",
            "gameId": "",
            "gameStartError": false,
            "tokenWon": 0,
            "gos_gatag": ""
        },
        gameLoadFailureTimeout,
        firstTimeOrientationTriggerFlag = true,
        isGameInRightOrientation = false;


    PCHGames.initializeGame = function() {
        PCHGames.gameId = gameInitJson.game.id;
        PCHGames.gameTokenDescription = gameInitJson.displayTitle;
    }

    PCHGames.gameLoad = function() {
        console.log("PCHGames.gameLoad");
        _gameManager.loadGame();

        gameLoadFailureTimeout = setTimeout(function() {
            console.log("gameLoadFailureTimeout called");
            endCallback({
                "status": 0,
                "score": 0,
                "tokens": 0
            })
        }, 10000);

        if (PCH.device != "MOBILE") {
            $(PCHGames.flashContainerId).show();
        } else {
            $(".upper-layer").addClass("hidenav");
            $(".bonus_progress").addClass("hidden");
        }

        _gameManager.gameModel.onLoaded.then(function() { 
            clearTimeout(gameLoadFailureTimeout);
        });
    }

    var orientationTrigger = function() {
        var current = window.matchMedia("(orientation: landscape)").matches ? "l" : "p",
            required = PCH.GAMES.gameJson.init.game.orientation;
        if (current != required) {
            $("body").addClass('showerror');
            setTimeout(function() {
                $("#rotate_error").height($("html").height());
            }, 1000);
            $("#btm_msg span").html(current == "l" ? "landscape" : "portrait");
            firstTimeOrientationTriggerFlag = false;
        } else {
            $("body").removeClass('showerror');
            if (!isGameInRightOrientation && !firstTimeOrientationTriggerFlag) {
                gameInitJson.game.height = window.innerHeight;
                gameInitJson.game.width = window.innerWidth;
                PCHGames.gameLoad();
                isGameInRightOrientation = true;
            }
        }
        /*
        $("#htmlgame_frame_div iframe").css({
            "width": window.innerWidth,
            "height": window.innerHeight
        });
        */
    }

    var html5DesktopsbgGameEnd = function(resp) {
        PCHGames.flashGameEnd(resp.body); //resp.apiresponse)
    };

    var html5MobilesbgGameEnd = function(resp) {
        //resp = resp.apiresponse;
        resp = resp.body;
        $("#forfeit").after('<div class="gosnavlinks all"><span id="gameshome" class="all">Token Games Home</span><span id="gamescat" class="all">More ' + PCH.GAMES.gameInfo.categoryName + ' Games</span><div class="clear"></div></div>');
        $("#gameshome").on('click', function(e) {
            e.preventDefault();
            window.location.href = "/games";
        });
        $("#gamescat").on('click', function(e) {
            e.preventDefault();
            window.location.href = window.location.href.split(PCH.GAMES.gameInfo.gameAlias)[0];
        });
        PCHGames.gameId = {
            "gameid": PCH.GAMES.gameInfo.gameId,
            "securitytoken": resp.securityToken ? resp.securityToken : PCH.GAMES.gameJson.init.securityToken,
            "gameType": "SBG"
        };
        document.querySelector(config.gameOverScreenAmountHolder).innerHTML = "";
        if (resp.status != 0) PCHGames.GOSgamesUpdate("#amount", PCH.GAMES.gameInfo.isTournament, PCHUSER.type, resp.score, resp.tokens, resp.tokenMultiplier);
        if (PCH.GAMES.gameInfo.isTournament) {
            document.querySelector(config.gameOverScreenID).classList.add("stampOn");
            if (resp.status != 0) stampOnAndCountupGOSAnimation(resp.tokens);
        }
        document.querySelector(config.gameOverScreenHolder).classList.add("t_loose");
        document.querySelector(config.gameOverScreenHolder).classList.add(respObjVal[PCHUSER.type]);
        if (resp.tokens == 0) {
            $("#congrats_nicejob .t_loose").html("TOO BAD!");
            $("#message .silver").html("Create a password to start BANKING TOKENS NOW!");
        } else if (PCH.GAMES.gameJson.init.positiveMessage) {
            $("#congrats_nicejob .t_loose").html(PCH.GAMES.gameJson.init.positiveMessage);
        }
        if (resp.status == 0) {
            document.querySelector(config.gameOverScreenHolder).classList.add("t_diff");
            if (resp.response) {
                if (resp.response.apiErrorCode == 1015) {
                    document.querySelector(config.gameOverScreenHolder).classList.remove(respObjVal[1]);
                    document.querySelector(config.gameOverScreenHolder).classList.add(respObjVal[2]);
                    $("#congrats_nicejob .t_loose").addClass("double_play").html("Sorry, it appears that you are already playing another game at the same time. Please remember to submit one score before playing another game. Please close all other browsers and refresh this page to play this game again.");
                }
            } else {
                $("#congrats_nicejob .t_loose").html("We are experiencing technical difficulties.");
            }

        }
        if (PCHUSER.type == 1) {
            $("#contBtn div").html("Continue");
        }
        document.querySelector(config.outlineFrameDiv).classList.add("hide");
        document.querySelector(config.gameOverScreenID).classList.add("show");
        if (PCHUSER.type != 1) $(".bonus_progress").removeClass("hidden");


        // show the leaderboard after GOS
        $(".alltime").removeClass("hidden");
        PCH.gameEndLeaderBoard();
        orientationTrigger = function() {};
        PCHGA.trackEvent(PCHGames.gaGameCategory, "complete", PCH.GAMES.gaCategory + "/" + PCH.GAMES.gaGameName);
        if (PCHUSER.type == 1) PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + '/' + PCH.GAMES.gaGameName + '/GameOverSilver');
        if (PCHUSER.type == 2) PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + '/' + PCH.GAMES.gaGameName + '/GameOverGold');
    };

    var stampOnAndCountupGOSAnimation = function(finalAmt) {
        countUpAnimation({
            div: "span.gosAmountHolder",
            stop: finalAmt,
            callback: function() {
                $("#gosholder").prepend('<div class="stampOnGOS all"><img class="all" src="/pch_media/images/games/gm-home-featured-cup.jpg"></div>');

                $(".stampOnGOS").addClass("stampOnGOSAnimation");
                $("#iwgos #gosholder #congrats_nicejob").animate({
                    "margin-top": "65px"
                }, 500);
            }
        });
    }
    var countUpAnimation = function(opts) { //div,start,stop,intervals,callback,callback_parameters,animate(t/f)
        var _opts = opts || {};
        _opts.start = _opts.start || 0;
        _opts.intervals = _opts.intervals || (_opts.stop - _opts.start) / 20;
        if (!_opts.div || !_opts.stop) {
            if (typeof _opts.callback == "function") {
                _opts.callback_parameters ? _opts.callback(_opts.callback_parameters) : _opts.callback();
            }
            return false;
        }
        var animatingDiv = $(_opts.div);
        var currVal = _opts.start;
        animatingDiv.html(_opts.start).parent().addClass("countUpAnimation");
        var countUpLoop = setInterval(function() {
            currVal += _opts.intervals;
            if (currVal <= _opts.stop) {
                animatingDiv.html((parseInt(currVal)));
            } else {
                clearInterval(countUpLoop);
                if (typeof _opts.callback == "function") {
                    _opts.callback_parameters ? _opts.callback(_opts.callback_parameters) : _opts.callback();
                }
            };
        }, 100);
        countUpAnimation.resetGOS = function() {
            animatingDiv.parent().removeClass("countUpAnimation");
            $("#iwgos #amount").css({
                "font-size": "4.4em"
            })
        }
    }
    var endCallback = PCH.device != "MOBILE" ? html5DesktopsbgGameEnd : html5MobilesbgGameEnd;
    _gameManager.gameModel.onEnded.then(endCallback);

    pchcom_gamemanager.triggerCallback = function(respObj) {
        console.log("---> triggerCallback", respObj);
        //document.getElementById("callback").value = JSON.stringify(respObj); 
        if (typeof(_gameManager[respObj.event]) == "function") {
            _gameManager[respObj.event](respObj);
        }
    }

    pchcom_gamemanager.triggerLibFunction = function(funcName) {
        console.log("---> triggerLibFunction", funcName);
        if (typeof(_gameManager[funcName]) == "function") {
            _gameManager[funcName]();
        }
    }

    if (PCH.device == "MOBILE") {
        globalOrientationTrigger = function() {};
        window.addEventListener('orientationchange', function() {
            try {
                (clearInterval(PCH.orientaionTimer));
            }
            catch (e){
            }
            PCH.orientaionTimer = setTimeout(orientationTrigger, 500);
        });
        orientationTrigger();
    }

    return pchcom_gamemanager;

}


function pchcom_callback(respObj) {
    console.log("pchcom_callback", respObj);
    pchcom_gamemanager.triggerCallback(respObj);
}

PCHGames.docReadyCallback = function() {
    return true;
}
