/* */ 
"format cjs";
/*
! PUBLISHERS CLEARING HOUSE 
! Create By: avasudev (Akshat Vasudev) 
! Create On: March 20th, 2017, 6:40:46 PM
*/
var PCHGames = PCHGames || {}
  , PCHAd = PCHAd || {};
PCHGames.flashObject = "iw_flash_holder",
PCHGames.flashContainerId = "#inner_content",
PCHGames.installFlashContainer = "#inner_content",
PCHGames.urlAppendParam = "?",
window.location.href.indexOf("?") !== -1 && (PCHGames.urlAppendParam = "&"),
PCHGames.redirecURL = window.location.href + PCHGames.urlAppendParam + "pchaction=createpw",
PCHGames.flashLoaded = !1,
PCHGames.iwPostGameMessageHolder = "#iw_message_holder",
PCHGames.iwPlayNextButton = ".play_more_button",
PCHGames.goldClass = ".gold ",
PCHGames.silverClass = ".silver ",
PCHGames.goldClassName = "gold",
PCHGames.silverClassName = "silver",
PCHGames.techDiffClass = ".tech_difficulties",
PCHGames.techDiffClassName = "tech_difficulties",
PCHGames.noTokens = ".no_tokens",
PCHGames.noTokensClassName = "no_tokens",
PCHGames.alreadyPlayedClass = ".already_played",
PCHGames.alreadyPlayedClassName = "already_played",
PCHGames.productLineupClass = ".cashoff-prodlineup",
PCHGames.productLineupClassName = " cashoff-prodlineup",
PCHGames.winTypeCashClassName = "cash",
PCHGames.resetGOSCallbacks = [],
PCHGames.GOSOverrideList = [],
PCHGames.ajaxError = "-1",
PCHGames.errorCode = "-1",
PCHGames.hasTechnicalError = "-1",
PCHGames.gameErrorCode = "",
PCHGames.gameStartResponse = "",
PCHGames.stopNavaway = !1,
PCHGames.tokenSplurgeGame = "instantwintokensplurge",
PCHGames.GAParam = "",
PCHGames.iwAdContainers = "#iw_top_ad,#iw_top_ad .visual,.visual.iwrightad",
PCHAd.timeoutDuration = 2e4,
PCHAd.maxAdDuration = 7e4,
PCHGames.postGameLoadProcessing = function() {
    $(".ajaxLoader").remove(),
    $(PCHGames.flashContainerId).show(),
    $("#main").trigger("gameStartInstantWin"),
    $(".iwrightnongoogle").show(),
    setTimeout(function() {
        $("#disclaimer-box").show()
    }, 2e3)
}
,
PCHGames.gameStartCentralCb = function(dataObject) {
    if ($(document).off("keydown"),
    PCHGames.gameStartResponse = dataObject,
    PCHGames.jToken = dataObject.jtoken,
    PCHGames.isFlashGame)
        var myFlash = PCHGames.thisMovie(PCHGames.flashObject);
    if (PCHGames.iwGameType !== PCHGames.tokenSplurgeGame) {
        var xmlString = ""
          , errorCodeVal = "0"
          , IWEreturnFlag = 0;
        2 == dataObject.status ? (errorCodeVal = "0",
        IWEreturnFlag = 1) : (errorCodeVal = "1",
        IWEreturnFlag = 0,
        PCHGames.gameErrorCode = dataObject.iw_response.data.code),
        PCHGames.hasTechnicalError = errorCodeVal,
        xmlString = dataObject.iw_response.response,
        gameStartResponse = xmlString,
        PCHGames.isFlashGame && myFlash.IWEreturn(IWEreturnFlag, xmlString.xmlResponse)
    } else
        2 == dataObject.status ? (window.onbeforeunload = function() {
            var strAlert = "";
            if (strAlert += "\nWARNING!\n",
            strAlert += "You Are About to Forfeit ALL of Your Tokens & Opportunities on Token Splurge for Today!\n",
            strAlert += "Are You Sure You Want to Leave?\n",
            !PCHGames.stopNavaway)
                return strAlert
        }
        ,
        PCHGames.hasTechnicalError = "0",
        PCHGames.isFlashGame && myFlash.gameStartStatus(1)) : (PCHGames.hasTechnicalError = "1",
        PCHGames.isFlashGame && myFlash.gameStartStatus(dataObject.status))
}
,
PCHGames.gameEndCentralCb = function(dataObject, statusCode) {
    PCHGames.jToken = dataObject.jtoken;
    var updateTokenBalanceFlag = (winningAmount = "",
    !1)
      , gosType = "TD";
    PCHGames.GOSOverrideList.props = {
        override: "",
        callback: "",
        callback_params: []
    };
    var GOSErrorObject = PCHGames.checkGOSError(dataObject);
    if (GOSErrorObject.hasError)
        gosType = GOSErrorObject.gosType ? GOSErrorObject.gosType : gosType,
        winningAmount = GOSErrorObject.winningAmount ? PCHGames.getWinningAmountMarkup({
            description: GOSErrorObject.winningAmount + "TOKENS",
            amount: GOSErrorObject.winningAmount,
            isMonetaryWin: !1
        }) : winningAmount;
    else {
        if (PCHGames.iwGameType == PCHGames.tokenSplurgeGame && (PCHGames.gameStartResponse.iw_response.response = {},
        PCHGames.gameStartResponse.iw_response.response.type = dataObject.iw_response.response.type,
        PCHGames.gameStartResponse.iw_response.response.data = {},
        PCHGames.gameStartResponse.iw_response.response.data.prizeValue = dataObject.iw_response.response.data.prizeValue,
        PCHGames.gameStartResponse.iw_response.response.data.prizeType = {},
        PCHGames.gameStartResponse.iw_response.response.data.prizeType.id = dataObject.iw_response.response.data.prizeType.id,
        PCHGames.gameStartResponse.iw_response.response.data.description = dataObject.iw_response.response.data.description,
        dataObject.iw_response.response.data.gos && (PCHGames.gameStartResponse.iw_response.response.data.gos = dataObject.iw_response.response.data.gos)),
        isNaN(parseInt(PCHGames.gameStartResponse.iw_response.response.data.prizeValue, 10)) || (winningAmount = PCHGames.getWinningAmountMarkup({
            description: PCHGames.gameStartResponse.iw_response.response.data.description,
            amount: PCHGames.gameStartResponse.iw_response.response.data.prizeValue,
            isMonetaryWin: !1
        })),
        6 == PCHGames.gameStartResponse.iw_response.response.data.prizeType.id || 0 == PCHGames.gameStartResponse.iw_response.response.data.prizeType.id)
            updateTokenBalanceFlag = !0,
            gosType = "TL";
        else if (void 0 !== PCHGames.gameStartResponse.iw_response.response.data.claimCode && "" !== PCHGames.gameStartResponse.iw_response.response.data.claimCode) {
            var cashWinJSON = gameStartResponse;
            PCHGames.claimCode = cashWinJSON.data.claimCode,
            winningAmount = PCHGames.getWinningAmountMarkup({
                description: cashWinJSON.data.description,
                amount: cashWinJSON.data.prizeValue,
                isMonetaryWin: !0
            }),
            $(PCHGames.iwPostGameMessageHolder).append("<div id='cc_holder'>" + PCHGames.claimCode + "</div>"),
            PCHGames.resetGOSCallbacks.push(function() {
                $("#cc_holder").remove()
            }),
            gosType = "MW"
        }
        PCHGames.gameStartResponse.iw_response.response.data.gosOfferSpectrumURL && (PCHGames.GOSOverrideList.push({
            override: "PL",
            callback: PCHGames.setupProductLineup,
            callback_params: [PCHGames.gameStartResponse.iw_response.response.data.gosOfferText, PCHGames.gameStartResponse.iw_response.response.data.gosOfferSpectrumURL]
        }),
        PCHGames.GAParam = $(PCHGames.gameStartResponse.iw_response.response.data.gosOfferText).find(".gatag_hidden").html()),
        PCHGames.gameStartResponse.iw_response.response.data.gos && (PCHGames.setupGOSMessageOverride({
            newStatus: "CG",
            overwriteData: PCHGames.gameStartResponse.iw_response.response.data.gos
        }),
        PCHGames.GOSOverrideList.push({
            override: "CG",
            callback: function() {
                if (PCHGames.gameStartResponse.iw_response.response.data.gos.button_markup) {
                    var $clonedButton = $(PCHGames.iwPlayNextButton).clone().find("a").html(PCHGames.gameStartResponse.iw_response.response.data.gos.button_markup).parent();
                    $(PCHGames.iwPlayNextButton).hide(),
                    $clonedButton.addClass("gos_overwrite").insertAfter(PCHGames.iwPlayNextButton)
                }
            },
            callback_params: []
        }))
    }
    if (1 == PCHUSER.type)
        PCHGames.GAParam = "/GameOverSilver" + PCHGames.GAParam;
    else if (2 == PCHUSER.type && (PCHGames.GAParam = "/GameOverGold" + PCHGames.GAParam,
    updateTokenBalanceFlag)) {
        PCHGames.updateTokenBalance();
        var tokenValue = "";
        tokenValue = 0 != $(winningAmount).length ? $(winningAmount).html() : winningAmount.replace(/\D/g, "");
        var activityData = {
            value: tokenValue,
            description: PCHGames.gameTokenDescription
        };
        PCH.uniExp.tokenCenter && PCH.uniExp.tokenCenter.showLastActivity(activityData)
    }
    if (void 0 === dataObject.iw_response.response.vip)
        var isVIP = !1;
    else
        var isVIP = !0;
    0 !== PCHGames.gameStartResponse.iw_response.response.data.show_gos && (PCHGames.setupGOS({
        _statusType: gosType,
        _amount: winningAmount,
        _overrides: PCHGames.GOSOverrideList,
        _isVIP: isVIP
    }),
    $("html.ie .gameover_msg_open").trigger("click")),
    dataObject.status,
    PCHGames.stopNavaway = !0
}
,
PCHGames.setupGOS = function(opts) {
    var gosData = $.extend(!0, {}, PCHGames.GOSSettingsObj[PCHUSER.type][opts._statusType]);
    if (opts._overrides)
        for (var i = 0; i < opts._overrides.length; i++)
            if ("" != opts._overrides[i].override) {
                var override_obj = PCHGames.GOSSettingsObj[PCHUSER.type][opts._overrides[i].override];
                for (key in override_obj)
                    gosData[key] = override_obj[key]
            }
    "" != opts._amount ? gosData.prize_amt_holder = opts._amount : "" == opts._amount && $(PCHGames.iwPostGameMessageHolder).addClass(PCHGames.noTokensClassName);
    for (key in gosData)
        "function" != typeof gosData[key] ? 0 != gosData[key].length ? $(PCHGames.GOSSettingsObj.domMap[key]).html(gosData[key]) : $(PCHGames.GOSSettingsObj.domMap[key]).addClass("hide") : "function" == typeof gosData[key] && $(PCHGames.GOSSettingsObj.domMap[key]).on("click", gosData[key]);
    if (opts._overrides)
        for (var i = 0; i < opts._overrides.length; i++)
            "function" == typeof opts._overrides[i].callback && opts._overrides[i].callback.apply(void 0, opts._overrides[i].callback_params);
    if (opts._isVIP)
        if ($(PCHGames.iwPostGameMessageHolder).addClass("vip"),
        0 != $("span.gosAmountHolder").length) {
            var finalAmount = parseFloat($("span.gosAmountHolder").html().replace(/,/g, ""));
            $("span.gosAmountHolder").html("0"),
            setTimeout(function() {
                PCHGames.VIPAnimation(finalAmount)
            }, 500)
        } else
            PCHGames.VIPAnimation.animationCallback();
    $(PCHGames.iwPostGameMessageHolder).addClass(gosData.gosClass),
    1 == PCHUSER.type && void 0 !== window.bonusTokensGosMsg && $("#iw_message_holder.cash").length < 1 && (void 0 !== PCHGames.gameCount ? PCHGames.gameIndex == PCHGames.gameCount && ($("#token_value_holder").append('<span class="bonus-token">' + window.bonusTokensGosMsg + "</span>"),
    $(".silver #iw_inner_message_holder").css({
        height: "auto"
    })) : ($("#token_value_holder").append('<span class="bonus-token">' + window.bonusTokensGosMsg + "</span>"),
    $(".silver #iw_inner_message_holder").css({
        height: "auto"
    }))),
    PCHGames.GATagFire(PCHGames.GAParam)
}
,
PCHGames.resetGOS = function() {
    PCHGames.GAParam = "",
    PCHGames.GOSOverrideList = [],
    $("#iw_message_holder .hide").removeClass("hide"),
    $(PCHGames.flashContainerId).append($("<div/>", {
        class: "ajaxLoader"
    })),
    $(PCHGames.iwPostGameMessageHolder).removeClass(),
    $(PCHGames.GOSSettingsObj.domMap.button_cb).off("click"),
    $(PCHGames.GOSSettingsObj.domMap.nothanks_cb).off("click");
    for (var i = 0; i < PCHGames.resetGOSCallbacks.length; i++)
        "function" == typeof PCHGames.resetGOSCallbacks[i] && PCHGames.resetGOSCallbacks[i](),
        PCHGames.resetGOSCallbacks.splice(i, 1),
        i--
}
,
PCHGames.setupProductLineup = function(markup, redirectLink) {
    $(markup).insertBefore("#tokenamount"),
    $("<span class='line2'>& Play More Games!</span>").insertAfter(".line1"),
    PCHGames.PLPlayButtonOverride = function() {
        PCHGames.GATagFire(PCHGames.GAParam + "/ClaimRewardsBtnClk"),
        window.location.href = redirectLink
    }
    ,
    PCHGames.PLnoThanksButtonOverride = function() {
        PCHGames.GATagFire(PCHGames.GAParam + "/NoThanksBtnClk"),
        PCHGames.goldButtonCallback()
    }
    ,
    PCHGames.setupProductLineup.resetOverride = function() {
        $(".line2,#plussign,#cashoff,.gatag_hidden").remove()
    }
    ,
    PCHGames.resetGOSCallbacks.push(PCHGames.setupProductLineup.resetOverride)
}
,
PCHGames.stampOnAnimation = function(finalAmt) {
    PCHGames.countUpAnimation({
        div: "span.gosAmountHolder",
        stop: finalAmt,
        callback: PCHGames.stampOnAnimation.animationCallback
    })
}
,
PCHGames.stampOnAnimation.animationCallback = function(params) {
    var src = "/components/com_pchcom_content/assets/images/sf_exclusive.png";
    params && (src = params.src),
    $("#iw_inner_message_holder").prepend('<div class="stampOnGOS"><img src="' + src + '"></div>'),
    $("html").hasClass("cssanimations") ? $(".stampOnGOS").addClass("stampOnGOSAnimation") : ($(".stampOnGOS").css({
        opacity: "1"
    }),
    $(".stampOnGOS").fadeIn()),
    $(".user_message .nicejob").animate({
        "margin-left": "125px"
    }, 500),
    PCHGames.resetGOSCallbacks.push(function() {
        $(".stampOnGOS").remove(),
        $(".user_message .nicejob").css({
            "margin-left": "0px"
        })
    })
}
,
PCHGames.VIPAnimation = function(finalAmt) {
    PCHGames.countUpAnimation({
        div: "span.gosAmountHolder",
        stop: finalAmt,
        callback: PCHGames.VIPAnimation.animationCallback
    })
}
,
PCHGames.VIPAnimation.animationCallback = function(params) {
    var src = "/pchcom_media/images/vip_badge.png";
    params && (src = params.src),
    $("#iw_inner_message_holder").prepend('<div class="vipStamp"><img src="' + src + '"></div>'),
    $("html").hasClass("cssanimations") ? $(".vipStamp").addClass("vipStampAnimation") : ($(".vipStamp").css({
        opacity: "1"
    }),
    $(".vipStamp").fadeIn()),
    $(".user_message .nicejob").animate({
        "margin-left": "125px"
    }, 500),
    PCHGames.resetGOSCallbacks.push(function() {
        $(".vipStamp").remove(),
        $(".user_message .nicejob").css({
            "margin-left": "0px"
        })
    })
}
,
PCHGames.countUpAnimation = function(opts) {
    var _opts = opts || {};
    if (_opts.start = _opts.start || 0,
    _opts.intervals = _opts.intervals || (_opts.stop - _opts.start) / 20,
    !_opts.div || !_opts.stop)
        return "function" == typeof _opts.callback && (_opts.callback_parameters ? _opts.callback(_opts.callback_parameters) : _opts.callback()),
        !1;
    var animatingDiv = $(_opts.div)
      , defaultfs = "70px"
      , fontclass = "countUpAnimation";
    animatingDiv.parent().text().trim().length + _opts.stop.toString().length > 14 && (fontclass = "smallerfont",
    defaultfs = "50px");
    var currVal = _opts.start;
    $("html").hasClass("cssanimations") ? animatingDiv.html(_opts.start).parent().addClass(fontclass) : $("#token_value_holder #tokenamount").animate({
        "font-size": defaultfs
    }, 500);
    var countUpLoop = setInterval(function() {
        currVal += _opts.intervals,
        currVal <= _opts.stop ? animatingDiv.html(addCommas(parseInt(currVal))) : (animatingDiv.html(addCommas(parseInt(_opts.stop))),
        clearInterval(countUpLoop),
        "function" == typeof _opts.callback && (_opts.callback_parameters ? _opts.callback(_opts.callback_parameters) : _opts.callback()))
    }, 100);
    PCHGames.countUpAnimation.resetGOS = function() {
        animatingDiv.parent().removeClass(fontclass),
        $("#token_value_holder #tokenamount").css({
            "font-size": "45px"
        })
    }
    ,
    PCHGames.resetGOSCallbacks.push(PCHGames.countUpAnimation.resetGOS)
}
,
PCHGames.setupGOSMessageOverride = function(data) {
    var currentGosType = {}
      , $clonedPasswordMessage = $();
    return data.overwriteData.top && (currentGosType.main_msg = data.overwriteData.top,
    data.overwriteData.top_sub && (currentGosType.main_msg += " " + data.overwriteData.top_sub)),
    data.overwriteData.main && (currentGosType.bottom_msg = data.overwriteData.main),
    data.overwriteData.button && (currentGosType.button_msg = data.overwriteData.button),
    data.overwriteData.bottom && (currentGosType.nothanks_text = data.overwriteData.bottom),
    data.overwriteData.main_np && ($clonedPasswordMessage = $(".silver_createpwd_msg").clone().html(data.overwriteData.main_np),
    $(".silver_createpwd_msg").hide(),
    $clonedPasswordMessage.addClass("gos_overwrite").insertAfter(".silver_createpwd_msg")),
    PCHGames.GOSSettingsObj[PCHUSER.type][data.newStatus] = currentGosType,
    PCHGames.setupGOSMessageOverride.resetGOS = function() {
        $(PCHGames.iwPlayNextButton + ".gos_overwrite").add($clonedPasswordMessage).remove(),
        $(".silver_createpwd_msg").add(PCHGames.iwPlayNextButton).show()
    }
    ,
    PCHGames.resetGOSCallbacks.push(PCHGames.setupGOSMessageOverride.resetGOS),
    data.newStatus
}
,
PCHGames.attachEvents = function() {
    console.log("attaching events");
    function hidingAnimation() {
        return $(PCHGames.iwPostGameMessageHolder).animate({
            top: "-400px"
        }, 300),
        !1
    }
    $(document).keydown(function(event) {
        if (13 == event.which && PCHGames.isFlashGame) {
            var myFlash = PCHGames.thisMovie(PCHGames.flashObject);
            "function" == typeof myFlash.flashStart && myFlash.flashStart()
        }
    }),
    $("#iw_message_holder #silver_set_password #PW,#iw_message_holder #silver_set_password #CP").on("keyup", function(e) {
        13 === e.which && $(".play_more_button a").trigger("click")
    }),
    $("#PW,#CP").on("focus", function() {
        $(this).parent().find("span").addClass("light")
    }),
    $("#PW,#CP").on("blur", function() {
        $(this).parent().find("span").removeClass("light")
    }),
    $("#PW,#CP").on("keyup", function() {
        "" === $.trim($(this).val()) ? $(this).parent().find("span").show() : $(this).parent().find("span").hide()
    }),
    $("html").hasClass("cssanimations") || ($("html.ie .gameover_msg_close").on("click", function() {}),
    $("html.ie .gameover_msg_open").on("click", function() {
        $(PCHGames.iwPostGameMessageHolder).animate({
            top: "-15px"
        }, 200, "linear", function() {
            $(PCHGames.iwPostGameMessageHolder).animate({
                top: "-1px"
            }, 75, function() {
                $(PCHGames.iwPostGameMessageHolder).animate({
                    top: "-15px"
                }, 75, function() {
                    $(PCHGames.iwPostGameMessageHolder).animate({
                        top: "-29px"
                    }, 75, function() {
                        $(PCHGames.iwPostGameMessageHolder).animate({
                            top: "-15px"
                        }, 75)
                    })
                })
            })
        })
    }),
    $("html.ie " + PCHGames.goldClass + PCHGames.iwPlayNextButton).on("click", hidingAnimation),
    $("html.ie " + PCHGames.silverClass + "#forfeit").on("click", hidingAnimation)),
    $(".gameover_msg_close").on("click", function() {
        PCHSSOProxy.clearErrors()
    }),
    $(".gameover_msg_open").on("click", function() {

        PCHSSOProxy.clearErrors(),
        $(PCHGames.iwPostGameMessageHolder).removeClass("closed")
    }),
    PCHGames.silverForfeitCallback = function(e) {
        return e.preventDefault(),
        $(PCHGames.iwPostGameMessageHolder).addClass("hideall"),
        setTimeout(function() {
            $(PCHGames.iwPostGameMessageHolder).removeClass()
        }, 300),
        PCHSSOProxy.clearErrors(),
        0 != PCHGames.pathGameId ? gaTagLbox = "CreatePassword_BankTokenForPath" : gaTagLbox = "CreatePassword_BankTokens",
        PCHGA.trackEvent("SSO", "cancel", gaTagLbox),
        PCHGames.nextStep(),
        !1
    }
    ,
    PCHGames.goldButtonCallback = function(e) {
        return e && e.preventDefault(),
        $(PCHGames.iwPostGameMessageHolder).addClass("hideall"),
        setTimeout(function() {
            $(PCHGames.iwPostGameMessageHolder).removeClass()
        }, 300),
        setTimeout(function() {
            PCHGames.nextStep()
        }, 300),
        !1
    }
    ,
    PCHGames.silverButtonCallback = function(e) {
        e.preventDefault();
        var redirect_url = PCHGames.gameCount == PCHGames.currentGameIndex ? PCHGames.returnURL : PCHGames.redirecURL;
        if ($(this).hasClass("disabled"))
            return !1;
        $(this).addClass("disabled");
        var persist = $("#keepmesigned").is(":checked");
        0 != PCHGames.pathGameId ? gaTagLbox = "CreatePassword_BankTokenForPath" : gaTagLbox = "CreatePassword_BankTokens",
        PCHSSOProxy.createPassword(gaTagLbox, PCHGames.gameId, $("#ssoholder"), $("#PW"), $("#CP"), persist, !1, redirect_url, "", !0)
    }
    ,
    PCHGames.productLineupCallback = function(redirectURL) {
        window.location.href = redirectURL
    }
    ,
    PCHGames.cashWinCallback = function(e) {
        return e.preventDefault(),
        PCHGames.fClaim("", "", PCHGames.claimCode, ""),
        PCHGames.goldButtonCallback(),
        !0
    }
    ,
    PCHGames.GOSSettingsObj = {
        classNames: {},
        domMap: {
            top_msg: ".top_message",
            main_msg: ".nicejob",
            prize_amt_holder: "#token_value_holder #tokenamount",
            bottom_msg: "#gold_message",
            button_msg: "#continue_message",
            button_text: ".play_more_button .line1",
            nothanks_text: "#forfeit a",
            gosClass: "",
            button_cb: PCHGames.iwPlayNextButton,
            nothanks_cb: "#forfeit"
        },
        1: {
            TL: {
                gosClass: PCHGames.silverClassName,
                top_msg: "",
                main_msg: "NICE JOB! You've scored",
                bottom_msg: "",
                button_msg: "Click below to Play More Instant Win Games!",
                button_text: "Continue",
                button_cb: PCHGames.silverButtonCallback,
                nothanks_text: "No thanks, I want to forfeit my tokens.",
                nothanks_cb: PCHGames.silverForfeitCallback
            },
            MW: {
                gosClass: PCHGames.goldClassName + " " + PCHGames.winTypeCashClassName,
                top_msg: "",
                main_msg: "CONGRATULATIONS! You've Won",
                bottom_msg: "You can expect to receive your check in the mail within the next 3 - 5 weeks!",
                button_msg: "Click Below to Play More Instant Win Games!",
                button_text: "Continue",
                button_cb: PCHGames.goldButtonCallback,
                nothanks_text: "",
                nothanks_cb: PCHGames.silverForfeitCallback
            },
            TD: {
                gosClass: PCHGames.silverClassName + " " + PCHGames.techDiffClassName,
                top_msg: "We are experiencing technical difficulties.",
                main_msg: "As a Thank You for your patience You've Been Granted",
                bottom_msg: "",
                button_msg: "Click Below to Play More Instant Win Games",
                button_text: "Continue",
                button_cb: PCHGames.silverButtonCallback,
                nothanks_text: "No thanks, I want to forfeit my tokens.",
                nothanks_cb: PCHGames.silverForfeitCallback
            },
            AP: {
                gosClass: PCHGames.silverClassName + " " + PCHGames.alreadyPlayedClassName,
                top_msg: "This game has been already played.",
                main_msg: "",
                bottom_msg: "",
                button_msg: "Click Below to Play More Instant Win Games",
                button_text: "Continue",
                button_cb: PCHGames.silverButtonCallback,
                nothanks_text: "",
                nothanks_cb: PCHGames.silverForfeitCallback
            },
            SBG: {
                top_msg: "",
                main_msg: "YOU'RE A SUPERSTAR!",
                bottom_msg: "",
                button_msg: ""
            }
        },
        2: {
            TL: {
                gosClass: PCHGames.goldClassName,
                top_msg: "",
                main_msg: "NICE JOB! You've scored",
                bottom_msg: "Don’t forget to redeem your tokens for MORE chances to WIN!",
                button_msg: "Click below to Play More Instant Win Games!",
                button_text: "Continue",
                button_cb: PCHGames.goldButtonCallback,
                nothanks_text: "",
                nothanks_cb: ""
            },
            MW: {
                gosClass: PCHGames.goldClassName + " " + PCHGames.winTypeCashClassName,
                top_msg: "",
                main_msg: "CONGRATULATIONS! You've Won",
                bottom_msg: "You can expect to receive your check in the mail within the next 3 - 5 weeks!",
                button_msg: "Click Below to Play More Instant Win Games!",
                button_text: "Continue",
                button_cb: PCHGames.goldButtonCallback,
                nothanks_text: "",
                nothanks_cb: ""
            },
            TD: {
                gosClass: PCHGames.goldClassName + " " + PCHGames.techDiffClassName,
                top_msg: "We are experiencing technical difficulties",
                main_msg: "AS A THANK YOU FOR YOUR PATIENCE <br/> YOU'VE BEEN GRANTED",
                bottom_msg: "We are sorry for this inconvenience. Please try again!",
                button_msg: "",
                button_text: "Continue",
                button_cb: PCHGames.goldButtonCallback,
                nothanks_text: "No thanks, I want to forfeit my tokens.",
                nothanks_cb: ""
            },
            AP: {
                gosClass: PCHGames.goldClassName + " " + PCHGames.alreadyPlayedClassName,
                top_msg: "This game has been already played.",
                main_msg: "",
                bottom_msg: "",
                button_msg: "Click Below to Play More Instant Win Games!",
                button_text: "Continue",
                button_cb: PCHGames.goldButtonCallback,
                nothanks_text: "",
                nothanks_cb: ""
            },
            PL: {
                gosClass: PCHGames.goldClassName + " " + PCHGames.productLineupClassName,
                button_text: "Claim Reward",
                bottom_msg: "",
                button_msg: "",
                button_cb: function(e) {
                    e.preventDefault(),
                    PCHGames.PLPlayButtonOverride()
                },
                nothanks_text: "No Thanks, Play More Instant Win Games Now!",
                nothanks_cb: function(e) {
                    e.preventDefault()
                }
            },
            SBG: {
                top_msg: "",
                main_msg: "YOU'RE A SUPERSTAR!",
                bottom_msg: "",
                button_msg: "",
                button_text: "Play Again",
                button_cb: function(e) {
                    e.preventDefault(),
                    PCH.GAMES.SBGPlayButtonOverride()
                }
            }
        }
    }
}
,
PCHGames.fShowRules = function() {
    PCHGames.popScroll(PCHGames.rules, 400, 400)
}
,
PCHGames.fShowFacts = function() {
    PCHGames.popScroll(PCHGames.facts, 400, 400)
}
,
PCHGames.popScroll = function(url, w, h) {
    popwin = window.open(url, "win", "scrollbars=yes,toolbar=no,directories=no,menubar=no,resizable=yes,status=no,width=" + w + ",height=" + h),
    popwin.window.focus()
}
,
PCHGames.updateTokenBalance = function() {
    void 0 !== PCH.uniExp.tokenCenter && void 0 !== PCH.uniExp.tokenCenter.updateTokenBalance && PCH.uniExp.tokenCenter.updateTokenBalance()
}
,
PCHGames.GATagFire = function(gat) {
    PCHGames.gaGameCategory = PCHGames.gaGameCategory || "InstantWin";
    var gameDisplayName = PCHGames.gameDisplayName || "";
    gat = gat || "",
    PCHGA.trackVirtualPageView(document.title, PCHGames.gaGameCategory + "/" + gameDisplayName + gat)
}
,
PCHGames.updateGameCount = function(gameCount) {
    gameCount && $("#gameCount").html(gameCount)
}
,
PCHGames.updateProgress = function(currentGameIndex) {
    currentGameIndex && $("#currGameNumber").html(currentGameIndex)
}
,
PCHGames.getWinningAmountMarkup = function(opts) {
    var opts = opts || {}
      , isMonWin = opts.isMonetaryWin || !1
      , description = opts.description || "100 TOKENS"
      , amt = opts.amount || 100
      , textOnlyDescription = "TOKENS";
    if (description.indexOf(amt) != -1)
        ;
    else {
        if (description.indexOf(addCommas(amt)) == -1)
            return description;
        amt = addCommas(amt)
    }
    var tod = description.split(amt);
    return tod[1] && (textOnlyDescription = tod[1].trim()),
    (isMonWin ? "$" : "") + "<span class='gosAmountHolder'>" + addCommas(amt).toUpperCase() + "</span> " + textOnlyDescription.toUpperCase()
}
,
PCHGames.makeSplashPageMarkup = function(opts) {
    opts.idName = opts.idName || "",
    opts.text1 = opts.text1 || "",
    opts.text2 = opts.text2 || "",
    opts.text3 = opts.text3 || "",
    opts.text4 = opts.text4 || "",
    opts.gaText = opts.gaText || "",
    opts.insetDiv = opts.insetDiv || "";
    var markup = '<div class="done_msg_holder" id="' + opts.idName + '"><div class="done_msg_header">' + opts.text1 + '</div><div class="done_msg_body"><div class="done_msg_text1">' + opts.text2 + '</div><div class="done_msg_text2">' + opts.text3 + '</div><div class="done_msg_text3">' + opts.text4 + '</div></div><div class="done_msg_btn_holder"><a href="/"data-onclick="PCHGA.trackEvent(' + opts.gaText + ',\'click\', PCHGames.gameGaDisplayName)"><imgsrc="/components/com_pchcom_content/assets/images/cont_btn.png" /></a></div></div>';
    $(opts.insetDiv).prepend(markup)
}
,
PCHGames.TriggerSplashPages = function(destination, hideDiv) {
    var seconds = 2e3;
    return 0 != PCHGames.pathGameId && void 0 !== PCHGames.splashSessionDisplay && PCHGames.splashSessionDisplay && void 0 !== PCHGames.splashPostPathDisplay && "YES" == PCHGames.splashPostPathDisplay && void 0 !== PCHGames.splashRedirectSeconds && PCHGames.splashRedirectSeconds && (PCHGA.trackEvent("IWNiceWork", "View", PCHGames.gameGaDisplayName),
    PCHGA.trackEvent("PathSplashpage", "complete", PCHGames.pathCompleteGATag + "/IWSplash"),
    PCHGA.trackEvent("InstantWin", "complete", PCHGames.gameGaDisplayName + "/IWSplash"),
    hideDiv ? $(hideDiv).hide() : $("#iw_flash_outer_holder").hide(),
    $("#iw_progress_holder").hide(),
    $("#done_msg_holder_gameover").show(),
    (seconds = parseInt(PCHGames.splashRedirectSeconds, 10)) && (seconds *= 1e3)),
    destination && window.setTimeout(function() {
        window.location.href = destination
    }, seconds),
    !1
};
console.log("here");
//$(document).ready(function() {
(function() {
    console.log("doc ready");
    PCHGames.attachEvents(),
    PCHGames.docReadyCallback = PCHGames.docReadyCallback || function() {
        return !1
    }
    ,
    PCHGames.docReadyCallback() //&& PCHGames.initializeGame()
//});
})();

