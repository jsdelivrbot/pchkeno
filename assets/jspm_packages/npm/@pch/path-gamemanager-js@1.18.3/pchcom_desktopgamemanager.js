/* */ 
"format cjs";
PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
if (typeof PCHMINIBOOTSTRAP.htmlgameBaseURL === "undefined") PCHMINIBOOTSTRAP.htmlgameBaseURL = "";

var pchcom_gamemanager = {}
function init_pchcom_gamemanager(config, gameJson, GameManager) {

    Object.assign(config, {
        "iframeParent": document.getElementById("htmlgame_frame_div"),
        "wsURL": PCHMINIBOOTSTRAP.htmlgameBaseURL + "index.php?option=com_pchcom_content&task=gameEvent&format=raw&cb="+ new Date().getTime(),
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
        //"gameloaded": gameLoaded_cb,
        //"start": gameStart_cb,
        //"end": gameEnd_cb,
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
    _gameManager.setProxy();

    PCHGames.errorOccured = false;
    var respObjVal = {
        0: "",
        2: "silver",
        3: "gold",
        "tokenwin": "t_win",
        "tokenloose": "t_loose",
        "cashwin": "cash",
        "claimURL": "",
        "gameId": "",
        "gameStartError": false
    }
    var newGameJson = undefined;

    PCHGames.initializeGame = function() {
        PCHGames.gameId = gameInitJson.game.id;
        if (gameInitJson.adType != "") {
            PCHAd.showAd(gameInitJson.adType, "", "instantwin", gameInitJson.displayTitle);
        } else {
            PCHGames.gameLoad();
        }
    }

    PCHGames.gameLoad = function() {
        console.log("PCHGames.gameLoad");
        PCHGames.gameDisplayName = gameInitJson.gaDisplayTitle;
        PCHGames.gameTokenDescription = gameInitJson.displayTitle;
        _gameManager.loadGame();
        PCHGames.postGameLoadProcessing();
    }

    var gameLoaded_cb = function(respObj) {
        console.log("----> gameLoaded_cb");
        //Update progress bar
        $("#htmlgame_frame_div iframe").attr("scrolling", "no");
        if (parentGameInitJson.isPath) {
            PCHGames.updateProgress(gameInitJson.gameIndex);
            PCHGames.updateGameCount(parentGameInitJson.gameCount);
        }

        gameGAtagging("gameload");
        //GA tagging for gameload        
    }

    var gameStart_cb = function(respObj) {
        console.log("---> gameStart_cb", respObj);
        if (respObj.body.status == 2) gameGAtagging("start");
        try { 
            PCHGames.gameStartCentralCb(respObj.body);
        } catch(e) { console.log(e); }
    }

    var gameEnd_cb = function(respObj) {
        console.log("---> gameEnd_cb", respObj);
        //GA tagging for loadeven
        if (respObj.body.status == 2) {
            gameGAtagging("complete");
        }
        PCHGames.gameEndCentralCb(respObj.body);
    }

    function subscribeCallbacks() {
        _gameManager.gameModel.onLoaded.then(gameLoaded_cb);
        _gameManager.gameModel.onStarted.then(gameStart_cb);
        _gameManager.gameModel.onEnded.then(gameEnd_cb);
    }
    subscribeCallbacks();

    PCHGames.nextStep = function() {
        PCHGames.resetGOS();
        if (parentGameInitJson.isPath) {
            getNextGame();
        } else {
            _gameManager.redirect();
            return false;
        }
        //If this is a path game and its the last one, end game and redirect
    }

    var getNextGame = function() {
        console.log("----> getNextGame");

        _gameManager.service.nextGame(parentGameInitJson.jToken, parentGameInitJson.game.id, function(err, resp) {
        //_gameManager.parentGameDelegate.sendEvent("getnextgame", null, function(data) {
            newGameJson = data.iw_response;
            if (typeof(gameInitJson.errorMessage) != "undefined") {
                PCHGames.errorOccured = true;
                PCHGames.makeSplashPageMarkup({
                    idName: "error_occured",
                    text1: "Technical Difficulties",
                    text2: "We're experiencing technical difficulties <br/> with this game.",
                    text3: "Please try again later.",
                    text4: "",
                    gaText: "IWTechDiff",
                    insetDiv: "#done_msg_main_holder"
                });
            }

            if (newGameJson != "") {
                gameInitJson = newGameJson;
                _gameManager.resetGame(gameInitJson);
                subscribeCallbacks();
            }
            // if this is not a path game, then redirect
            if (PCHGames.errorOccured) {
                $("#inner_content,#error_occured").show();
                $("#htmlgame_frame_outline").remove();
                setTimeout(function() {
                    window.location.href = "/";
                }, 5000);
                return false;
            }
            if (gameInitJson == null) {
                gameGAtagging("pathcomplete");
                _gameManager.service.end(parentGameInitJson.jToken, parentGameInitJson.game.id, null, parentGameInitJson.service.data, function(err, resp) {
                    PCHGames.TriggerSplashPages(undefined, "#htmlgame_frame_outline");
                    window.setTimeout(function() {
                        _gameManager.redirect();
                    }, 2000);
                    return false;
                });
                return false;
            }
            //Is a path game
            if (parentGameInitJson.isPath) {
                PCHGames.flashLoaded = false;
                $(PCHGames.flashContainerId).hide();
                PCHGames.initializeGame();
            }
        });
    }

    var responseHasError = function(respObj) {
        return respObj.apiresponse.status == 0 ? true : false;
    }

    PCHGames.checkGOSError = function(dataObject) {
        var errorReturnObject = errorReturnObject || {
            hasError: false
        };

        if (typeof(dataObject.iw_response.response.data) == "undefined") {
            //Show TD with no tokens
            errorReturnObject.hasError = true;
            if (PCHGames.gameErrorCode == "2001") { //already played
                //Show already played GOS
                errorReturnObject.gosType = "AP";
            }
        } else if (parseInt(dataObject.iw_response.response.errorToken)) {

            errorReturnObject.hasError = true;
            errorReturnObject.winningAmount = addCommas(parseInt(dataObject.iw_response.response.errorToken));

            updateTokenBalanceFlag = true;
            if (PCHGames.hasTechnicalError == "-1") {
                //no game start error OR actual timeout
                //Show IW amount tech diff GOS                  
            }
        } else if (PCHGames.hasTechnicalError == "1") {
            errorReturnObject.hasError = true;
        }
        return errorReturnObject;
    }

    pchcom_gamemanager.triggerCallback = function(respObj) {
        console.log("triggerCallback", respObj);
        //document.getElementById("callback").value = JSON.stringify(respObj); 
        if (typeof(_gameManager[respObj.event]) == "function") {
            _gameManager[respObj.event](respObj);
        }
    }

    pchcom_gamemanager.triggerLibFunction = function(funcName) {
        console.log("triggerLibFunction", funcName);
        if (typeof(_gameManager[funcName]) == "function") {
            _gameManager[funcName]();
        }
    }

    var gameGAtagging = function(event) {
        // GA category overrides added per B-21727
        var gameGaCategory = 'InstantWin',
            parentGameGaCategory = 'InstantWin';
        if (!PCH.gaLabel) PCH.gaLabel = "";

        if (gameInitJson && gameInitJson.gaCategoryOverride) {
            gameGaCategory = gameInitJson.gaCategoryOverride;
        }

        if (parentGameInitJson && parentGameInitJson.gaCategoryOverride) {
            parentGameGaCategory = parentGameInitJson.gaCategoryOverride;
        }

        switch (event) {
            case "pathcomplete":
                //GA tagging for Path Complate
                PCHGA.trackEvent(parentGameGaCategory, event, parentGameInitJson.gaDisplayTitle + '/' + PCH.gaLabel);
                break;
            case "gameload":
            case "start":
            case "complete":
                //GA tagging to track game start event
                PCHGA.trackEvent(gameGaCategory, event, gameInitJson.gaDisplayTitle + '/' + PCH.gaLabel);
                break;
        }
    }

    return pchcom_gamemanager;

};


function pchcom_callback(respObj) {
    pchcom_gamemanager.triggerCallback(respObj);
}

PCHGames.docReadyCallback = function() {
    if ($("html").hasClass("ie8")) {
        PCHGames.makeSplashPageMarkup({
            idName: "done_msg_holder_gameover",
            text1: "Update Browser",
            text2: "This game is not designed <br/> to work on Internet Explorer 8",
            text3: "Please update your browser <a target='_blank' href='http://privacy.pch.com/browserUpgrade'>here</a>.",
            text4: "",
            gaText: "IE8issue",
            insetDiv: "#done_msg_main_holder"
        });
        $("#inner_content,#done_msg_holder_gameover").show();
        $("#htmlgame_frame_outline").remove();
        setTimeout(function() {
            window.location.href = "/";
        }, 5000);
        return false;
    }
    return true;
}
