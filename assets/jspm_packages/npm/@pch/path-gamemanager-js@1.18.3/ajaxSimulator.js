/* */ 
"format cjs";
"use strict";

//import $ from "vendor/zepto";
(function (global) {

    function matchIWGameEvent(eventName, params) {
        if (/pch_minibootstrap\/index\.php\?option=com_pchcom_content&task=gameEvent/.test(params.url)) {
            return JSON.parse(params.data).event == eventName;
        }
        return false;
    }

    function matchScratchV4Event(eventName, params) {
        if (/\/event/.test(params.url)) {
            var paramsData = JSON.parse(params.data);
            return paramsData.event == eventName && paramsData.apidata && (paramsData.apidata.returnURL || "").match(/\/scratchoffs/);
        }
        return false;
    }

    /**
    * map request urls/regexes to the local json file to request for the response
    * first array value can be a regex or string, it will match against the request url
    * second array value is the response url, that url will be requested and the response returned to the service
    * third param is optional, and if specified will match against the request method, otherwise all request methods match
    */
    var resourceRoutes = [
    // scratch game responses
    //[/\/start\//, "./mock-responses/scratch-start-error.js", "post"],
    //[/\/end\//, "./mock-responses/scratch-end-error.js", "post"]
    [/\/start\//, "./mock-responses/scratch-start-success.json", "post"], [/\/end\//, "./mock-responses/scratch-end-success.js", "post"], [/\/forfeit\//, "./mock-responses/forfeit-success.js", "post"],
    // scratch V4 game responses
    [matchScratchV4Event.bind(null, "start"), "./mock-responses/scratchV4-start-success.json", "post"], [matchScratchV4Event.bind(null, "end"), "./mock-responses/scratchV4-end-success.json", "post"],
    //[matchScratchV4Event.bind(null, "start"), "./mock-responses/iwV4-start.json", "post"],
    // iw/skill game responses
    [/index\.php\?option=com_pch_skillbasedgames&task=gameEvent/, "http://local.sandbox.qa.pch.com/pch-gamemanager/example/mock-responses/skill-end.json", "post"], [matchIWGameEvent.bind(null, "start"), "http://local.sandbox.qa.pch.com/pch-gamemanager/example/mock-responses/iw-start.json", "post"],
    //[matchIWGameEvent.bind(null, "end"), "http://local.sandbox.qa.pch.com/pch-gamemanager/example/mock-responses/iw-end.json", "post"],
    // slots game responses
    [matchIWGameEvent.bind(null, "end"), "./mock-responses/slots-end.json", "post"], [matchIWGameEvent.bind(null, "slotsSpinStart"), "./mock-responses/slots-spinstart.json", "post"], [matchIWGameEvent.bind(null, "slotsSpinEnd"), "./mock-responses/slots-spinend.json", "post"]];

    /**
    * The simulated ajax request, will take the request url and return a response mapped above
    * If the response json contains a "_statusCode" field, that will be the simulated resoonse status code
    * that is returned, to allow simulating error responses (eg "_statusCode": 500)
    *
    * Use this by injecting it as the Service.ajax value
    */
    var Ajax = function Ajax(params) {
        if (!params) {
            return;
        }

        var respUrl = null;
        for (var i = 0, n = resourceRoutes.length; i < n; i++) {
            // match the method
            if (resourceRoutes[i].length <= 2 || resourceRoutes[i][2] === params.type) {
                // regex url match
                if (resourceRoutes[i][0] instanceof RegExp) {
                    if (resourceRoutes[i][0].test(params.url)) {
                        respUrl = resourceRoutes[i][1];
                        break;
                    }
                }
                // function match
                else if (typeof resourceRoutes[i][0] === "function") {
                        if (resourceRoutes[i][0](params)) {
                            respUrl = resourceRoutes[i][1];
                            break;
                        }
                    }
                    // direct url string match
                    else if (resourceRoutes[i][0] === params.url) {
                            respUrl = resourceRoutes[i][1];
                            break;
                        }
            }
        }

        if (!!respUrl) {
            console.log("making mocked request", params);

            if (params.dataType === "jsonp") {
                params = Object.assign({}, params);
                params.url = respUrl;
                return $.ajax(params);
            }

            return $.getJSON(respUrl, function (data) {
                var statusCode = 200;
                if (data && data._statusCode) {
                    statusCode = parseInt(data._statusCode, 10);
                }

                var xhr = {
                    status: statusCode,
                    responseText: JSON.stringify(data)
                };

                // success
                if (statusCode >= 200 && statusCode < 300) {
                    if (params.success) {
                        params.success(data, statusCode, xhr);
                    }
                }
                // error
                else if (params.error) {
                        params.error(xhr, statusCode);
                    }

                if (params.complete) {
                    params.complete(xhr, statusCode);
                }
            });
        } else {
            console.log("no matching simulator url, making actual request", params);
            return $.ajax(params);
        }
    };

    var Simulator = {
        ajax: Ajax
    };

    global.AjaxSimulator = Simulator;

    //export default Simulator;
})(window);