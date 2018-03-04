var PCH = PCH || {};
PCH.LEVELS = PCH.LEVELS || {};
window.levelUpCelebrationFileLoaded = true;
(function(scope) {
    var d = new Date();
    var n = d.getMilliseconds();
    var props = {
        iframeHolderEl: "levelUpCelebrationIframeHolder",
        iframeEl: "levelUpCelebrationIframe",
        iframeURL: window.location.protocol + "//www.##pch.com/LevelUpLightbox/?cacheBursting=" + n + "&tmpl=raw&parentdomain=" + window.location.protocol + "//" + window.location.host
    };
    var celebrationIframeTimeout = null,
        dynaFrameLoadedTimeout = null,
        iframeReference = null,
        hasErrorAlreadyOccured = false,
        lightboxManagerObject = null;

    var celebrationTimedOutError = function(time) {
        return setTimeout(function() {
            hasErrorAlreadyOccured = true;
            $("#preCelebrationLoader .loaderMsg").html('We are experiencing technical difficulties.<br/><br/>Please visit "My Account" for Loyalty Reward details!');
            $("#preCelebrationLoader .loaderHolder").remove();
            $("#" + props.iframeHolderEl + " iframe").fadeOut();
            $("#preCelebrationLoader").fadeIn(function() {
                setTimeout(function() {
                    $("#" + props.iframeHolderEl).remove();
                }, 4000);
            });
        }, time);
    }
    var spitOutCSSMarkup = function() {
        var holder = $("<div/>", {
            id: props.iframeHolderEl
        });
        $(holder).height($("body").height());
        var preCelebrationLoader = $("<div/>", {
            id: "preCelebrationLoader"
        });
        preCelebrationLoader.html('<div class="loaderMsg">Loading Your PCHRewards Loyalty Program Celebration...</div><div class="loaderHolder"></div>');
        holder.append(preCelebrationLoader);
        $("body").append(holder);
    }

    var postMessageEventListener = function(event) {
        if (event.origin.indexOf("pch") != -1 && event != undefined) {
            var postMessageDataFromPCHIFrame = decodeURI(event.data);
            switch (postMessageDataFromPCHIFrame) {
                case "gameClose":
                    PCH.LEVELS.gameClose();
                    break;
                case "iframeLoaded":
                    if (hasErrorAlreadyOccured) return false;
                    clearTimeout(celebrationIframeTimeout);
                    $("#preCelebrationLoader").fadeOut();
                    $("#" + props.iframeHolderEl + " iframe").fadeIn();
                    break;
            }
        }
    }

    var createIframe = function() {
        var newDate = new Date().getTime();
        celebrationIframeTimeout = celebrationTimedOutError(10000);
        dynaF = PCH.createDynaFrame({
            parent: $("#" + props.iframeHolderEl),
            targetSelector: "body",
            url: props.iframeURL,
            callback: function(arg) {
                if (arg.close == true) {
                    dynaF.close();
                }
            }
        });
        $(dynaF.iframe).attr("id", props.iframeEl);
        $("#" + props.iframeEl).width($("#" + props.iframeHolderEl).width());
        if (window.addEventListener) {
            window.addEventListener("message", postMessageEventListener);
        } else {
            window.attachEvent("onmessage", postMessageEventListener);
        }
        return dynaF;
    }

    var orientationChange = function() {
        $("#" + props.iframeEl).width($("#" + props.iframeHolderEl).width());
    }

    scope.level.init = function(opts) {
        if (PCH.LIGHTBOX) {
            lightboxManagerObject = PCH.LIGHTBOX.registerLightbox({
                open: function() {
                    scope.level.pushToLBManager(opts)
                }
            });
        } else {
            scope.level.pushToLBManager(opts)
        }
    }

    scope.level.pushToLBManager = function(opts) {
        //transfer options to local variable. for(var a in b)...has prop?... if func, convertCallbacks()
        //import dynaframe lib if !availble.
        //create iframe with opts varilables.
        $("#" + props.iframeHolderEl).remove();
        spitOutCSSMarkup();
        for (var opt in opts) {
            if (!props.hasOwnProperty(opt)) {
                props[opt] = opts[opt];
            }
        }
        props.iframeURL = props.iframeURL.replace("##", props.env);
        dynaFrameLoadedTimeout = celebrationTimedOutError(5000);
        if (!PCH.createDynaFrame) {
            $.getScript(window.location.protocol + "//www.pch.com/pch_media/js/dynamic_iframe.js", function() {
                clearTimeout(dynaFrameLoadedTimeout);
                iframeReference = createIframe();
            });
        } else if (PCH.createDynaFrame) {
            clearTimeout(dynaFrameLoadedTimeout);
            iframeReference = createIframe();
        }

        window.addEventListener("resize", orientationChange, false);
        window.addEventListener("orientationchange", orientationChange, false);
    }

    scope.level.gameClose = function() {
        if (window.removeEventListener) {
            window.removeEventListener("message", postMessageEventListener);
        } else {
            window.detachEvent("onmessage", postMessageEventListener);
        }

        $("div#levelUpCelebrationIframeHolder").fadeOut(function() {
            $(this).html("");
            $(this).remove();
        }).bind(this);
        if (PCH.uniExp !== undefined) {
            if (PCH.uniExp.callTokenBalanceApi) PCH.uniExp.callTokenBalanceApi(PCH.uniExp.processTokenBalance);
        }
        if (props.gameEndCallback) {
            typeof(props.gameEndCallback) == "function" ? props.gameEndCallback(): 0;
        }
        if (lightboxManagerObject != null) {
            lightboxManagerObject.notifyClose();
        }
    }

}({
    level: PCH.LEVELS,
    w: window.top,
    $: jQuery
}))
