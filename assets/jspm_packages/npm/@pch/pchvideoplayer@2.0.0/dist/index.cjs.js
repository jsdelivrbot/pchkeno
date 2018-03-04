/* */ 
'use strict';

/*
* this class is a pub/sub in jQuery style
* we have .on() . off() methods to add Event listeners and remove them.
*
* in order to dispatch the event please use dispatchEvent
* if you want the event to be fired only once please use dispatcOnce
*
*
* */

class EventDispatcher {
    constructor() {
        // collection of subscriptions
        this.eventStack = [];

        // collection of the events which are already fired
        // for dispatchOnce method we check if the event is not on this array
        this.firedStack = [];
    }

    // attach the event and callback to the context
    /**
     *
     * @param type : string - list of the event names separated by space
     * @param callback : function - the callback to be run when event dispatches
     * @returns {boolean} - false for non string type parameter. true for normal scenario
     */
    on(type, callback) {
        if (typeof type !== 'string') return false;

        // remove  extra spaces from the list

        const eventList = type.split(' ').filter(item => item != '');

        // attach multiple events
        eventList.forEach((eventName)=>{

                if (typeof callback == 'function') {

                    this.eventStack[eventName]  =  this.eventStack[eventName] ||  [];
                    this.eventStack[eventName].push (callback);
                }

        });
        return true ;
    }

    // remove event from the context
    /**
     *
     * @param type : string - the event name to be removed from the stack
     */
    off(type) {
        if (typeof type == 'undefined') {
            this.eventStack = [];
        } else {
            this.eventStack.splice(this.eventStack.indexOf(type),1);
        }
    }


    // fire the event
    /**
     *
     * @param type : string - event name to be dispatched
     * @param data : any data which has to be sent to the callback
     */
    dispatchEvent(type, data = {}) {
        let evtStack = this.eventStack[type] || [];

        if (evtStack.length) {
            this.firedStack[type] = true;
            evtStack.forEach((evt) => {
                evt.call(this, data);
            });
        }
    }


    // fire the event if it not already fired.
    /**
     *
     * @param type : string - event name to be dispatched
     * @param data : any data which has to be sent to the callback
     */
    dispatchOnce(type, data) {
        if (typeof this.firedStack[type] == 'undefined') {
            this.dispatchEvent(type, data);
            return true
        } else {
            return false
        }
    }
}

/*
* this class is a decorator to original JW events
* based on original JWplayer events fired by the player instance
*
* the Complete event is the place that we make assumptions for NoAD or Fallback logic
* Each JW event will trigger
*
* */


class AttachEvents extends EventDispatcher {
    constructor() {
        super();
    }

    // attache the events to the dispatcher
    attachEvents() {
        // this event only works on VPAID ads
        // fires at the first frameof the AD
        this.player.on('adStart', (event) => {
            this.dispatchOnce('adStart', event);
        });

        // adBlocker even works when the player is laoded and then user enables the ADBlocker on the browser
        // most of adBlockers will block the JW player AD plugins to load
        this.player.on('adBlocker', (event) => {
            this.dispatchOnce('adBlocker', event);
        });

        // Impression event fires the the API request fires successfully to AD server.
        // most of ADs fire it at the beginning of the AD . some might fire it in the middle
        // we use this event as a reference of successful AD

        this.player.on('adImpression', (event) => {
            this.debugMessage(this.messages.adImpression + this.primary + ' Tag');
            this.adImpression = true;
            this.dispatchOnce('adImpression', event);
        });

        // fire when user manually hits the skip button on the AD.
        // for our user experience it is the same point like adComplete
        this.player.on('adSkipped', (event) => {
            this.dispatchOnce('adSkipped', event);
        });

        // original adTime Event fires constantly when the AD is playing
        // in our decorator we fire it only once we get it for the first time.
        // hence this event gives us the ad duration.
        // Some ADs report their duration incorrectly like 30 sec all the time.
        // so it is better to use this event for logging purposes only
        this.player.on('adTime', (event) => {
            const remaining = Math.round(event.duration - event.position);
            this.dispatchOnce('adTime', remaining);
        });

        // fires when user click on video
        this.player.on('adClick', (event) => {
            this.dispatchOnce('adClick', event);
        });


        // AD error is a complicated event. when we get errors in the AD stack, we get an adError with some messages.
        // it does not mean that we will not get AD after this error.
        // player might fire another adRequest and show the AD after this event.
        // the only reliable event for no fill scenario is the noAd event.
        this.player.on('adError', (event) => {
            this.ADError(event);
        });


        // fires when the is finished ad player is going to show the video content
        // some Ads fire the adImpression but do not fire the adComplete.
        // for those ads we have another logic to trigger adComplete manually
        this.player.on('adComplete', (event) => {
            this.completeFlag = true;
            this.debugMessage(this.messages.adComplete);
            this.dispatchEvent('adComplete', event);
        });


        // this is the place the video content finishes.
        // we need to verify the adImpression flag to make sure we need a fallback to the second tag.
        // in the case we get the adImpression but no adComplete we fire forceAdcomplete
        // if the fallback is enabled and we get no adImpression on the first tag we fallback to 2nd tag
        // if both tag had no fill then we fire the noAd

        this.player.on('complete', () => {

            if (this.adImpression == true) {

                // force the adcomplete event if the AD did not fire that
                if (this.completeFlag != true) {
                    this.debugMessage(this.messages.forceAdComplete);
                    this.dispatchEvent('adComplete', 'forceComplete');
                }

                return;
            }

            // fire No AD if the fallback is disabled
            if (this.adImpression == false
                && this.fallBackEnabled == false) {
                this.dispatchEvent('noAd');
                return;
            }

            // check if we have  any fallback
            if (this.adImpression == false) {
                if (this.fallBackFlag == false) {

                    this.fallBackFlag = true;
                    this.fallBackTime = Date.now();
                    if (this.HTMLFirst) {

                        // check for flash if the flash is the second TAG
                        this.detectFlash();
                        if (this.isFlashEnabled == false) {
                            this.dispatchEvent('noAd');
                            return;
                        }

                        this.flashFallBack();
                    } else {
                        this.html5fallback();
                    }

                    return;
                } else {
                    // no impression after fallback
                    this.noAd = true;
                    this.dispatchEvent('noAd');
                    return;
                }
            }
        });

    }
}

/**
 * this functions checks the browser capabilities and returns a boolean if flash player is installed and active on
 * the browser
 * @returns {boolean}
 */

const flashDetector = ()=> {
    // set the flag for flash player
   let isFlashEnabled = false;
    const plugins = window.navigator.plugins;
    for (let i = 0; i < plugins.length; i++) {
        if (/flash/i.test(plugins[i].name)) {

            isFlashEnabled = true;
        }
    }
    return isFlashEnabled ;
};

/**
 * collection the console messages with their corresponding event names
 *
 */
var messages = {
    adImpression: 'ad impression on ',
    adComplete: 'adComplete',
    fallBacktoFlash: 'flash fallback',
    htmlFallBack: 'HTML5 fallback',
    noAD: ' noAD',
    forceAdComplete: 'force AD Complete',
    setupParams: ' the setup parameters',
    flashDetected: ' flash player detected',
    flashNotDetected: 'flash player not detected',
    jwplayerScriptError :' JW player script is not available',
    containerError : 'DOM container not found Error',
    adError : ' AD Error ',
    playContent : 'playing content ',
    fallbackToVideo : 'fallback to video'
};

/**
 *  this function takes te DFP tag as a string and updated the custom params and other
 * @param tag:String -  the DFP tag
 * @returns ADtag:string - the updated DFP tag . will return empty if the parameter is empty or the type is incorrect
 */
const updateADtag = tag => {

    if (tag =='' || typeof tag !== 'string') return '';

    let ADtag = tag;
    // replace brackets with default values
    ADtag = ADtag.replace('[referrer_url]', encodeURIComponent(window.location.href));
    ADtag = ADtag.replace('[description_url]', encodeURIComponent(window.location.href));
    ADtag = ADtag.replace('[timestamp]', Date.now());

    if( typeof window.PCHUSER !== 'undefined') {
        // update the vast tag with params
        let urlParamObj = {};
        urlParamObj.a = PCHUSER.age || '';
        urlParamObj.g = PCHUSER.gender != "" ? (PCHUSER.gender == "m" || PCHUSER.gender == "1" ? "1" : "2") : "";
        urlParamObj.ar = PCHUSER.ageRange || '';
        urlParamObj.seg = PCHUSER.segments || '';
        urlParamObj.gmt = PCHUSER.gmt || '';
        urlParamObj.level = PCHUSER.level || '';
        urlParamObj.reglist = PCHUSER.reglist.join() || '';

        let urlParams = '';
        urlParams = 'a=' + urlParamObj.a + '&g=' + urlParamObj.g + '&seg=' + urlParamObj.seg + '&gmt=' + (urlParamObj.gmt) + '&level=' + (urlParamObj.level) + '&' + 'reglist=' + (urlParamObj.reglist);
        ADtag += '&cust_params=' + encodeURIComponent(urlParams);
    }

    return ADtag;
};

/**
 *
 * fallback methods will fire when the first tag comes back with no fill and we want the 2nd tag
 * based on configuration we have flash/html or html/flash fallbacks
 *
 */


var fallbacks = {


    // fall back to flash when flash  not available and HTML had no fill
    flashFallBack() {
        this.primary = 'flash';

        this.debugMessage(this.messages.fallBacktoFlash);
        this.selectVastTag();
        if (this.params.advertising) this.params.advertising.tag = this.Adtag;

        this.debugMessage(this.messages.setupParams);
        this.setupPlayerParams(this.params);
        jwplayer().on('ready', () => {
            this.attachEvents();
            this.dispatchEvent('fallbackComplete', 'flash');
        });
    },


    // fall back to html when flash is not available
    html5fallback() {
        this.primary = 'html5';

        this.debugMessage(this.messages.htmlFallBack);
        this.selectVastTag();
        if (this.params.advertising) this.params.advertising.tag = this.Adtag;

        this.debugMessage(this.params);
        this.setupPlayerParams(this.params);
        jwplayer().on('ready', () => {
            this.attachEvents();
            this.dispatchEvent('fallbackComplete', 'HTML5');
        });
    },


    // show fallback video if the was No Ad in both tags
    videoFallback() {
    //  TODO feature for future

    }
};

// handle the adError event from jwplayer
/**
 * methods to drop console messages
 *
 */
var logger = {
    /**
     *  log the message on ADError
     * @param msg: string
     *
     */
    ADError(msg) {

        this.debugMessage('error on AD ');
        this.debugMessage(msg);

        this.dispatchOnce('adError', msg);

    },



    /** drop the console messages
     *
     * @param msg: string
     */
    debugMessage(msg) {
        if (this.debugMode == false) return;

        console.log('PCH Video Message >>>> ', msg);
    },


    /** set the error flag
     *
     * @param err:string
     */
    errorHandler(err) {
        this.errorFlag = true;
        console.log(err);
    }
};

/**
 * Created by hyaghinloo on 1/24/17.
 */


/*
*
*  PCH video player based on JW  player
*  this class is the main  class in the package nad the entry point the build
*
*/

class PchVideoPlayer extends AttachEvents {
    /**
     * setup params from the consumer side

     *
     * @param setupParams : object
     * here is the list of mandatory and optional keys
     *
     * container : string - the ID of the DOM element to contain JW player
     * adTags : object - with tho key 'flashTag' and 'html5Tag'
     * adPlugin : string - 'vast' or 'googima' // optional
     * vpaidmode: string - 'secure' or 'insecure' // optional
     * updateTag : boolean - set it to true if you want the DFP tags to be updated // optional
     * htmlFirst : boolean - set it to true if you want to fire HTML tag first in the fallback // optional
     * device : string - 'device' , 'tablet' or 'mobile' . it will skip the flash tag for non desktop devices.

     **/
    constructor(setupParams) {
        super();
        this.messages = messages;
        this.eventStack = [];
        this.firedStack = [];
        this.noAd = false;
        this.fallBackFlag = false;
        this.completeFlag = false;
        this.fallBackTime = null;
        this.flashAdEmtpy = false;
        this.isFlashEnabled = false;
        this.htmlADEmpty = false;
        this.errorFlag = false;
        this.params = setupParams;
        this.container = this.params.container;
        this.AdTagsObj = this.params.adTags;
        this.primary = window.jwplayer.defaults.primary || 'html5';
        this.fallBackEnabled = window.jwplayer.defaults.primary === 'flash';
        this.client = this.params.adPlugin || 'googima';
        this.Adtag = null;
        this.fallBackVideo = this.params.fallBackVideo || '';
        this.adImpression = false;
        this.vpaidMode = this.params.vpaidmode || "insecure";
        this.updateDFPtag = this.params.updateTag || false;
        this.adTech = {firstTag: 'flash', secondTag: 'html5'};
        this.HTMLFirst = this.params.htmlFirst || false;
        this.hasFlashTag = true;
        this.mute = true;
        this.device = this.params.device.toLowerCase() || 'mobile';
        if (this.HTMLFirst !== false) {
            this.adTech = {firstTag: 'html5', secondTag: 'flash'};
        }

        // check if we are on debug mode
        this.debugMode = this.params.debugMode || (/pchvideodebug=1|.qa.|.stg.|.dev./i.test(window.location.href) ) ? true : false;

        // check if the vast tags are not undefined
        if (this.params.adTags && typeof this.params.adTags.flashTag != 'string') this.params.adTags.flashTag = '';
        if (this.params.adTags && typeof this.params.adTags.html5Tag != 'string') this.params.adTags.html5Tag = '';

        // check if there is a flash tag
        this.hasFlashTag = (this.AdTagsObj.flashTag !== '') ? true : false;


        // roll back to HTML5 if the flash tag is empty
        if (this.primary == 'flash' && !this.hasFlashTag) {
            this.primary == 'html5';
            this.fallBackEnabled = false;
        }

        // update the DFP tags with custom params
        if (this.updateDFPtag) {
            if (this.hasFlashTag) this.params.adTags.flashTag = updateADtag(this.params.adTags.flashTag);

            this.params.adTags.html5Tag = updateADtag(this.params.adTags.html5Tag);
        }


        // check for JWplayer script and container element
        this.setInitialState();

        // check for the ADType
        // in the case the flash first is requested we go for flash
        if (this.primary === 'flash' && this.HTMLFirst == false) this.detectFlash();


        // go for Google IMA if HTML is the first
        if (this.HTMLFirst == true) {
            this.primary = 'html5';
        }

        // pick the right tag based on setup
        this.selectVastTag();

        // this method is resposible for setup the instance of JW player
        this.setupPlayerParams(this.params);
        jwplayer().on('ready', () => {
            this.attachEvents();
        });
    }


    // check for jwplayer script and take the instance from it
    setInitialState() {

        // if DOM element was not there , throw the error
        if (document.getElementById(this.container) === null) {
            this.errorHandler(this.messages.containerError);
        }

        if (window.jwplayer) {
            this.player = window.jwplayer(this.container);
        } else {
            this.errorHandler(this.messages.jwplayerScriptError);
        }

        this.primary = (this.device == 'desktop') ? this.primary : 'html5';
        this.mute = (this.device != 'desktop');

    }


    // player setup
    // pick the right AD client
    //
    /**
     *
     * @param params : object - setup parameters coming from the constructor
     */
    setupPlayerParams(params) {


        // check the params obj and setup the JW player
        if (this.params && typeof this.params === 'object') {

            // if there is no AD tag in params take the AD tag in constructor
            if (typeof this.params.advertising === 'undefined' && this.noAd == false)

                this.params.advertising = {
                    client: this.client,
                    vpaidmode: this.vpaidMode,
                    autoplayadsmuted: this.mute,
                    tag: this.Adtag
                };


            // if there is no fallbackvideo in params take it from constructor
            if (typeof this.params.file === 'undefined') this.params.file = this.fallBackVideo;

            this.debugMessage(this.messages.setupParams);
            this.debugMessage(this.params);


            //setup the adclient
            if (this.params.adTags.flashTag != '') {
                this.params.advertising.client = (this.primary == 'flash') ? 'vast' : 'googima';
            } else {
                this.params.advertising.client = (  this.isFlashEnabled == true && window.jwplayer.defaults.primary == 'flash'  ) ? 'vast' : 'googima';
                this.primary = 'html5';
            }


            // set the adclient to googima for non desktop devices
            this.params.advertising.client = this.device == 'desktop' ? this.params.advertising.client : 'googima';

            // setup the player
            this.player.setup(this.params);
        }

    }

// check if flash is available the set the right primary for that
    detectFlash() {

        this.isFlashEnabled = flashDetector();

        // drop a console message when flash is not available
        if (this.isFlashEnabled) {
            this.debugMessage(this.messages.flashDetected);
        } else {
            this.debugMessage(this.messages.flashNotDetected);

        }


        // fire event when flash not available
        if (this.primary === 'flash' && this.isFlashEnabled === false) this.dispatchEvent('fallbacktohtml5');

        this.primary = (this.isFlashEnabled) ? 'flash' : 'html5';

    }

    // select the vast tag based on the active primary value
    selectVastTag() {
        this.Adtag = (this.primary === 'flash' && this.AdTagsObj.flashTag ) ? this.AdTagsObj.flashTag : this.AdTagsObj.html5Tag;

    }


    get flashFallBack() {
        return fallbacks.flashFallBack;
    }

    get html5fallback() {
        return fallbacks.html5fallback;
    }

    get ADError() {
        return logger.ADError;
    }

    get debugMessage() {
        return logger.debugMessage;
    }

    get errorHandler() {
        return logger.errorHandler;
    }

}

module.exports = PchVideoPlayer;
