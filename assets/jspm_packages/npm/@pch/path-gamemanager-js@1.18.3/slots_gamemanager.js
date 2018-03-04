/* */ 
"format cjs";
PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
if (typeof PCHMINIBOOTSTRAP.htmlgameBaseURL === "undefined") PCHMINIBOOTSTRAP.htmlgameBaseURL = "";

var pchcom_gamemanager = {};
function init_pchcom_gamemanager(config, gameJson, GameManager) {

    PCHGames = PCHGames || {};
    if (PCH.device == "MOBILE") {
        gameJson.init.game.width = window.innerWidth;
        gameJson.init.game.height = window.innerHeight;
        gameJson.init.game.device = PCH.device.toLocaleLowerCase();
    }

    var slots = PCH.SLOTS || {};

    Object.assign(config, {
        "iframeParent": document.getElementById("htmlgame_frame_div"),
        "wsURL": gameJson.parentInit.service.url,
        "gameProxyUrl": slots.gameProxyURL,
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
        "slotsSpinStart": slotsSpinStart_cb,
        "slotsSpinEnd": slotsSpinEnd_cb,
        "viewPayTable": viewPayTable_cb,
        "viewHowToPlay": viewHowToPlay_cb,
        "viewOfficialRules": viewOfficialRules_cb,
        "viewSweepstakesFacts": viewSweepstakesFacts_cb,
        "getMoreCoins": getMoreCoins_cb,
        "viewTokenPayout": viewTokenPayout_cb,
        //"error": gameError_cb,
        //"end": endCallback
    });

    var spinStartResponse;

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

    var _gameManager = new GameManager(gameInitJson, {gos: window.GOS});
    if(window.location.href.match(/_simulator=1/) && window.AjaxSimulator) {
        console.log("using simulator");
        _gameManager.service.ajax = window.AjaxSimulator.ajax;
    }

    var currentSpinNumber = 0,
        spinStartTimeout = 0,
        gameEndTimeout = 0,
        totalTournamantScore = 0;

    var respObjVal = {
        0: "",
        1: "silver",
        2: "gold",
        "tokenwin": "t_win",
        "tokenloose": "t_loose",
        "cashwin": "cash",
        "techDiff": "t_diff",
        "claimURL": "",
        "gameId": "",
        "gameStartError": false,
        "tokenWon": 0,
        "gos_gatag": ""
    },
    gameLoadFailureTimeout,
    isGameInRightOrientation = false,
    cashWinOnLastSpin = false,
    cashWinOnLastSpinGameEndResponse = {};

    PCHGames.initializeGame = function() {
        if (isGameInRightOrientation) {
            return false;
        }
        totalTournamantScore = PCH.SLOTS.totalScore;
        PCHGames.gameId = gameInitJson.game.id;
        PCHGames.gameTokenDescription = gameInitJson.displayTitle;
        _gameManager.loadGame();

        gameLoadFailureTimeout = setTimeout(function() {
            endCallback({
                "status": 0,
                "score": 0,
                "tokens": 0
            });
        }, 10000);
        if (PCH.device != "MOBILE") {
            $(PCHGames.flashContainerId).show();
        } else {
            $(".upper-layer").addClass("hidenav");
            $(".bonus_progress").addClass("hidden");

        }
        gameGAtagging("init");
        $(" .slots-iw-cash-win a ").on('click', function(event) {
            event.preventDefault();
            if (PCH.device == "MOBILE") {
                $(".slots-iw-cash-win").hide();
            } else {
                $("#iw_inner_message_holder").children(":not('.slots-iw-cash-win')").removeClass('hide');
                $(".slots-iw-cash-win").hide();
                $("#iw_message_holder").removeClass();
            }
            if (cashWinOnLastSpin) {
                cashWinOnLastSpin = false;
                endCallback(cashWinOnLastSpinGameEndResponse);
            }
        });

    };

    PCHGames.gameLoad = PCHGames.initializeGame;

    _gameManager.gameModel.onLoaded.then(function() {
        //Update progress bar
        clearTimeout(gameLoadFailureTimeout);
        gameGAtagging("gameload");
        //GA tagging for gameload

        // ajdust the cash win window size on mob
        if(PCH.device == "MOBILE") {
            $(".slots-iw-cash-win").height(window.innerHeight);
        }
    });

    var slotsSpinStart_cb = function(respObj) {
        //refresh GPT Ad on
        if(typeof PCH.TAGMANAGER !== 'undefined') {
            PCH.TAGMANAGER.utagview({
                gpt_page_type: utag_data.gpt_page_type,
                gpt_refresh: "true"
            }, null, [25]);
        }

        spinStartResponse = respObj.body;
        currentSpinNumber++;
        spinStartTimeout = setTimeout(function() {}, 40000);
        if(slots.gameInfo.isTournament) gameGAtagging("spinstart");

        //If has Error show error GOS;
        // If has Error show error GOS;return false;
    };

    var gameError_cb = function(respObj) {
        if(!slots.gameInfo.isTournament)return false;
        // error scenario for tournament only
        $.get("/components/com_pchcom_content/views/article/tmpl/slots-technical-difficulties.php", function(data) {
            $(".game-box.spnsr-slct").append(data);
            $(".game-box .difficulties-container").addClass('ontopofgame');
            var errorMsg, btnText;
            if(respObj.body.iw_response.response.success == 1) {
                $(".difficulties-container").addClass('knowscore');
                errorMsg = "Oops, a glitch! Don’t worry – <br/>we saved your score!";
                $("h3.difficulties-message").after($("<div/>", {
                    class: "tech_diff_score",
                    html: "SCORE = " + respObj.body.iw_response.response.score + "<br/><div>This score will be applied to your<br/>Total Slots Tournament Score for today!</div>"
                }));
            } else {
                errorMsg = "Oh no! A glitch! Don’t worry,<br/> you won’t lose your spins!";
                $(".continue-button.no-button").attr("src", "/pch_media/images/slots/tryagain-button.png");
            }
            $("h3.difficulties-message").html(errorMsg);
            $(".game-box .continue-button").on('click', function(event) {
                event.preventDefault();
                window.location.reload();
            }).removeClass('no-button');
            $(".game-box .difficulties-container").fadeIn("slow");
        });
    };

    var gameEndFailureCall = function() {
        $.ajax({
            url: parentGameInitJson.service.url,
            data: {
                "jtoken": gameInitJson.jToken,
                "gameid": gameInitJson.game.id,
                "apidata": gameInitJson.apiData,
                "event": "end",
                "gamedata": ""
            }
        })
        .done(function(resp) {
            endCallback(resp);
        })
        .fail(function() {
            window.location.reload();
        })
        .always(function() {

        });
    };

    var gameGAtagging = function(event) {
        // GA category overrides added per B-21727
        var gameGaCategory = 'SlotsTournament',
        parentGameGaCategory = 'SlotsTournamentPath';
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
            PCHGA.trackEvent(parentGameGaCategory, event, parentGameInitJson.gaDisplayTitle);
            break;
            case "init":
            case "gameload":
            case "start":
            case "complete":
            //GA tagging to track game start event
            //PCHGA.trackEvent(gameGaCategory, event, gameInitJson.gaDisplayTitle);
            break;
            case "spinstart":
            case "spinend":
            availabeSpin = spinStartResponse.iw_response.response.result.availableSpins;
            totalSpins = gameInitJson.game.slots.machine.totalSpins;
            currentSpin = totalSpins - availabeSpin;
            //GA tagging to track game start event
            PCHGA.trackEvent(gameGaCategory, event, gameInitJson.gaDisplayTitle + '/spin ' + currentSpin + " Of " + totalSpins);
            break;
        }
    };

    var slotsSpinEnd_cb = function(respObj) {
        totalTournamantScore += spinStartResponse.iw_response.response.result.payoutResult.scoreCredited;
        $(".sl-pr-final-text p").html(addCommas(totalTournamantScore));
        clearTimeout(spinStartTimeout);
        if(spinStartResponse.iw_response.response.result.prize) {
            if (PCH.device == "MOBILE") {
                var mobCashwinMarkup  = ' <div class="sl-pch-logo"></div> <div class="iw-cash-win-txt-bx"> <div>Nice job, <br>you just won </div> <div class="iw-cash-amnt"></div> </div><div class="mob-claim-code">Claim Code: ' + spinStartResponse.iw_response.response.result.prize.claimInformation.claimCode + '<span></span></div> <div class="cash-msg">You can expect to receive your prize in the mail within the next 3 - 5 weeks!</div> <a href="#"> <div class="cashwin-button iw-cash-claim"> <img src="/pch_media/images/slots/slot-cl-pr-mob.png"> </div> </a>';
                $(".slots-iw-cash-win").html(mobCashwinMarkup);
                $(".slots-iw-cash-win").height(window.innerHeight);
                $(".iw-cash-amnt").html("$" + addCommas(spinStartResponse.iw_response.response.result.prize.dollarValue) + ".00!");

                $(".slots-iw-cash-win").show();
            } else {
                var deskCashwinMarkup = '<div class="iw-cash-win-txt-bx"> <p>Nice job, you just won</p> <p class="iw-cash-amnt"> </p> </div><div class="desk-claim-code">Claim Code: ' + spinStartResponse.iw_response.response.result.prize.claimInformation.claimCode + '<span></span></div> <div class="cash-msg">You can expect to receive your prize in the mail within the next 3 - 5 weeks!</div> <a href="#" ><div class="iw-cash-claim"> <img src="/pch_media/images/slots/continue-button.png"/> </div> </a>';
                $(".slots-iw-cash-win").html(deskCashwinMarkup);
                $("#iw_inner_message_holder").append($(".slots-iw-cash-win"));
                $("#iw_inner_message_holder").children(":not('.slots-iw-cash-win')").addClass('hide');
                $(".slots-iw-cash-win").show();
                $(".iw-cash-amnt").html("$" + addCommas(spinStartResponse.iw_response.response.result.prize.dollarValue) + ".00!");
                $("#iw_message_holder").addClass('gold cash');
            }

            $(".slots-iw-cash-win a ").off().on('click', function(event) {
                event.preventDefault();
                if (PCH.device == "MOBILE") {
                    $(".slots-iw-cash-win").hide();
                } else {
                    $("#iw_inner_message_holder").children(":not('.slots-iw-cash-win')").removeClass('hide');
                    $(".slots-iw-cash-win").hide();
                    $("#iw_message_holder").removeClass();
                }
                if (cashWinOnLastSpin) {
                    cashWinOnLastSpin = false;
                    endCallback(cashWinOnLastSpinGameEndResponse);
                }

                //clear cash win copy from the page
                $(".slots-iw-cash-win").html('');
            });
            if (spinStartResponse.iw_response.response.result.availableSpins === 0) {
                //game end timeout start inside which call gameEnd ajax call.
                cashWinOnLastSpin = true;
            }
        } else if (spinStartResponse.iw_response.response.result.availableSpins === 0) {
            //game end timeout start inside which call gameEnd ajax call.
            gameEndTimeout = setTimeout(gameEndFailureCall, 60000);
        }

        if ((currentSpinNumber%PCH.SLOTS.gameInfo.midRollSpinThreshold) === 0) {
            playMidrollOrRescueAd({
                zone: PCH.SLOTS.gameJson.init.midrollAd.adZone,
                adType: PCH.SLOTS.gameJson.init.midrollAd.adType,
                adUrl: PCH.SLOTS.gameJson.init.midrollAd.adUrl,
                adMessage:"Please view this message from our sponsor! <br/> Their support keeps PCH.com free."
            });
        }

        if (slots.gameInfo.isTournament) gameGAtagging("spinend");
    };

    // we move to the slots_gp.js via event trigger
    var lightBoxEventTrigger = function(e, needAjax) {
        // trigger the lightbox show event
        var slotEvent = jQuery.Event("slotlightbox");
        slotEvent.name = e.event;
        slotEvent.apiUrl = e.ApiUrl;
        slotEvent.needAjax = needAjax;
        $("#slot-lbox-box").trigger(slotEvent);
    };

    var viewPayTable_cb = function(respObj) {
        respObj.ApiUrl = slots.viewPayTableAPI;
        lightBoxEventTrigger(respObj, true);
    };

    var viewHowToPlay_cb = function(respObj) {
        respObj.ApiUrl = slots.viewHowToPlayAPI;
        lightBoxEventTrigger(respObj, false);
    };

    var viewOfficialRules_cb = function(respObj) {
        respObj.ApiUrl = gameInitJson.game.rules;
        lightBoxEventTrigger(respObj, false);
    };

    var viewSweepstakesFacts_cb = function(respObj) {
        respObj.ApiUrl = gameInitJson.game.policy;
        lightBoxEventTrigger(respObj, false);
    };

    var viewTokenPayout_cb = function(respObj) {
        respObj.ApiUrl = "";
        lightBoxEventTrigger(respObj, false);
    };

    var getMoreCoins_cb = function() {
        playMidrollOrRescueAd({
            zone: gameInitJson.rescueAd.adZone,
            adType: gameInitJson.rescueAd.adType,
            adUrl: gameInitJson.rescueAd.adUrl,
            adMessage:"Please enjoy this sponsored message <br/> while we load you up with coins!"
        });
    };

    orientationTrigger = function() {
        var current = window.matchMedia("(orientation: landscape)").matches ? "l" : "p",
        required = "l";
        if (current != required) {
            $("body").addClass('showerror');
            setTimeout(function() {
                $("#rotate_error").height($("html").height());
            }, 1000);
            $("#btm_msg span").html(current == "l" ? "landscape" : "portrait");
        } else {
            $("body").removeClass('showerror');
            if (!isGameInRightOrientation) {
                $("#htmlgame_frame_div iframe").css({
                    "width": window.innerWidth,
                    "height": window.innerHeight
                });
                gameInitJson.game.height = window.innerHeight;
                gameInitJson.game.width = window.innerWidth;
                PCHGames.gameLoad();
                isGameInRightOrientation = true;
            }
        }
    };

    var slotsLastGamePathComplete = function() {
        if (PCH.SLOTS.remainingGames == 1) {
            // @TODO
            _gameManager.endGame(null);
            _gameManager.gameModel.onEnded.then(function(err, resp) { 
                gameGAtagging("pathcomplete");
            });
        }
    };

    var playMidrollOrRescueAd = function(slotsAdSettings) { //zone,adType, adMessage
        if (PCH.device != "MOBILE") {

            if(slotsAdSettings.adType == "videoAd")slotsAdSettings.adType = "midrollOrRescueAd";
            if(slotsAdSettings.adMessage)$(".slot-vid-ad-txt").html(slotsAdSettings.adMessage);

            if(PCH.device === "DESKTOP") {
                if (slotsAdSettings.zone) alfyad_options.alfyzone = slotsAdSettings.zone;
                if (slotsAdSettings.adType) PCHAd.showAd(slotsAdSettings.adType, "", "instantwin", PCH.SLOTS.gaGameName);
            }else {
                PCHAd.showAd('midrollOrRescueAd', "", "instantwin", PCH.SLOTS.gaGameName);
            }
        } else if (PCH.device == "MOBILE") {
            //create iframe for MP;
            //setup countdown timer;
            //setup postMessage recieving : adloaded
            PCHAds.showAd(slotsAdSettings.adType, {
                adUrl: slotsAdSettings.adUrl
            });
            PCHGA.trackVirtualPageView(document.title, PCH.SLOTS.gaGameName + '/mpAd');
        }
        return false;
        //Update alfyzone to the same as param.
        //Add class to make it look like a lightbox.
        //update alfyadcompleted function to hide LB;
    };

    var slotsDesktopGameEnd = function(resp) {
        console.log("slots game end", resp);
        clearTimeout(gameEndTimeout);
        if (cashWinOnLastSpin) {
            cashWinOnLastSpinGameEndResponse = resp;
            return false;
        }
        PCHGames.slotsGameEnd(resp.body);
        gameGAtagging("complete");
        slotsLastGamePathComplete();
    };

    var slotsMobilesGameEnd = function(resp) {
        clearTimeout(gameEndTimeout);
        if (cashWinOnLastSpin) {
            cashWinOnLastSpinGameEndResponse = resp;
            return false;
        }
        resp = resp.body;
        PCHGames.gameId = slots.gameInfo.gameId;
        document.querySelector(config.gameOverScreenAmountHolder).innerHTML = "";
        if (resp.status !== 0) PCHGames.GOSgamesUpdate("#amount", slots.gameInfo.isTournament, PCHUSER.type, resp.iw_response.response.score, resp.iw_response.response.tokens, resp.iw_response.response.tokenMultiplier);
        document.querySelector(config.gameOverScreenHolder).classList.add("t_loose");
        document.querySelector(config.gameOverScreenHolder).classList.add(respObjVal[PCHUSER.type]);
        if (resp.tokens === 0) {
            $("#congrats_nicejob .t_loose").html("TOO BAD!");
            $("#message .silver").html("Create a password to start BANKING TOKENS NOW!");
        } else if (gameInitJson.positiveMessage) {
            $("#congrats_nicejob .t_loose").html(gameInitJson.positiveMessage);
        }
        if (resp.status === 0) {
            document.querySelector(config.gameOverScreenHolder).classList.add("t_diff");
            $("#congrats_nicejob .t_loose").html("We are experiencing technical difficulties.");
        }
        if (PCHUSER.type == 1) {
            $("#contBtn div").html("Continue");
        }
        document.querySelector(config.outlineFrameDiv).classList.add("hide");
        document.querySelector(config.gameOverScreenID).classList.add("show");
        $(".upper-layer").removeClass("hidenav");
        if (PCHUSER.type != 1) $(".bonus_progress").removeClass("hidden");


        // show the leaderboard after GOS
        $("#inner_content").append($(".alltime"));
        $(".alltime , .leaderboard-holder").show();
        PCH.gameEndLeaderBoard();

        orientationTrigger = function() {};

        if (PCHUSER.type == 1) PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + '/' + slots.gaGameName + '/GameOverSilver');
        if (PCHUSER.type == 2) PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + '/' + slots.gaGameName + '/GameOverGold');
        slotsLastGamePathComplete();
    };

    var endCallback = PCH.device != "MOBILE" ? slotsDesktopGameEnd : slotsMobilesGameEnd;
    _gameManager.gameModel.onEnded.then(endCallback).catch(gameError_cb);

    pchcom_gamemanager.triggerCallback = function(respObj) {
        console.log("triggerCallback", respObj);
        //document.getElementById("callback").value = JSON.stringify(respObj);
        if(typeof(_gameManager[respObj.event]) == "function") {
            _gameManager[respObj.event](respObj);
        }
    };

    pchcom_gamemanager.triggerLibFunction = function(funcName) {
        console.log("triggerLibFunction", funcName);
        if (typeof(_gameManager[funcName]) == "function") {
            _gameManager[funcName]();
        }
    };

    if (PCH.device == "MOBILE") {
        globalOrientationTrigger = function() {};
        window.addEventListener('orientationchange', function() {
            setTimeout(orientationTrigger, 500);
        });
        orientationTrigger();
    }

    _gameManager.service.addEventListener(_gameManager.service.EVENTS.REQUEST_CALLBACK, function(req, err, resp) {
        if(err) {
            gameError_cb(err.body);
        }
        else if(req.params.event && (typeof config[req.params.event]) === "function") {
            config[req.params.event](resp.body);
        }
    });
}

function pchcom_callback(respObj) {
    console.log("pchcom_callback", respObj);
    pchcom_gamemanager.triggerCallback(respObj);
}


$(document).ready(function(){
    if(document.querySelector('.tokens-already-banked') !== null){
        var tokensAfterMultiplier =  document.querySelector('.tokens-multiplier').innerHTML;
        var divVal = PCH.SLOTS.tokenMultiplier - 1;
        var orginalValue = parseInt(tokensAfterMultiplier.replace(/,/g, '')) / divVal;
        var totalTokens = parseInt(orginalValue) + parseInt(tokensAfterMultiplier.replace(/,/g, ''));
        document.querySelector('.tokens-already-banked').innerHTML = parseInt(orginalValue).toLocaleString();
        document.querySelector('.total-tokens-banked').innerHTML = parseInt(totalTokens).toLocaleString();
    }
});
