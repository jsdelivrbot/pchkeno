
"use strict";

( function( win, doc ) {

	function getScript( scriptSrc ) {
		var bd = doc.getElementsByTagName( "body" )[ 0 ],
		scriptElement = doc.createElement( "script" );
		scriptElement.src = scriptSrc;
		bd.appendChild( scriptElement );
	}

	// get required libs
	/*if( typeof jQuery !== "function" ) {
		getScript( "https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" );
	}
	
	if( typeof JSON !== "object" ) {
		getScript( "http://cdn.pch.com/spectrum/js/json2.js" );
	}*/
	
	// create Object.create if it doesn't exist
	if( typeof Object.create !== "function" ) {
		Object.create = function( o ) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}
	
	// create PCH if it does not exist namespace
	if( typeof win.PCH === "undefined" ) {
		win.PCH = {};
	}
	
	if( typeof win.PCH.SSO === "undefined" ) {
		win.PCH.SSO = {};
	}
	
} )( window, document );

PCH.SSO.utils = {
	isJQueryObjectAndNotEmpty: function isJQueryObjectAndNotEmpty( obj ) {
        // is this a jQuery or Zepto object?
        return obj && obj.selector && obj.length;        
    },
    isEmptyObject: function isEmptyObject( obj ) {
        var prop;
        for( prop in obj ) {
            if( obj.hasOwnProperty( prop ) ) {
                return false;
            }
        }
        return true;
    }
};
PCH.SSO.Controller = {
	// private properties
	_cfg: null,
	_elements: {},
	_optins: [],
	_addressCounter: 0,
	_environment: "",
	_errorCollection: [],
	_externalProxy: null,
	
	_internalProxy: {
		register: function register( json ) {
			throw new Error( "_internalProxy: You must pass in a valid register function." );
		},
		update: function update( json ) {
			throw new Error( "_internalProxy: You must pass in a valid update function." );
		},
		login: function login( json ) {
			throw new Error( "_internalProxy: You must pass in a valid login function." );
		},
		/*logout: function logout( json ) {
			throw new Error( "_internalProxy: You must pass in a valid logout function." );
		},*/
		updatePassword: function updatePassword( json ) {
			throw new Error( "_internalProxy: You must pass in a valid updatePassword function." );
		},
		createPassword: function createPassword( json ) {
			throw new Error( "_internalProxy: You must pass in a valid createPassword function." );
		},
		forgotPassword: function forgotPassword( json ) {
			throw new Error( "_internalProxy: You must pass in a valid forgotPassword function." );
		},
		resetPassword: function resetPassword( json ) {
			throw new Error( "_internalProxy: You must pass in a valid resetPassword function." );
		},
		miniRegister: function miniRegister( json ) {
			throw new Error( "_internalProxy: You must pass in a valid miniRegister function." );
		},
		FBwithEmail: function FBwithEmail( json ) {
			throw new Error( "_internalProxy: You must pass in a valid FBwithEmail function." );
		},
		/*FBconnect: function FBconnect( json ) {
			throw new Error( "_internalProxy: You must pass in a valid FBconnect function." );
		},*/
		registerWithMandatoryDOB: function registerWithMandatoryDOB( json ) {
			throw new Error( "_internalProxy: You must pass in a valid registerWithMandatoryDOB function." );
		},
		updateWithMandatoryDOB: function updateWithMandatoryDOB( json ) {
			throw new Error( "_internalProxy: You must pass in a valid updateWithMandatoryDOB function." );
		},
		addScreenNameAndDOB: function addScreenNameAndDOB( json ) {
			throw new Error( "_internalProxy: You must pass in a valid addScreenNameAndDOB function." );
		},
		skipEmailVal: function skipEmailVal( errorCode, email ) {
		    //if (console && console.error) console.error("_internalProxy: You must pass in a valid skipEmailVal function.");
		    throw new Error( "_internalProxy: You must pass in a valid skipEmailVal function." );
		},
		redirect: function redirect( url ) {
			if( typeof url === "string" ) {
				this._sendToURL( url );
			}
		},
		performAnalytics: function performAnalytics( obj ) {
			if( typeof obj.success === "function" ) {
				obj.success();
			}
		}
	},
	_uiSelection: "default",
	_uiCollection: {},
	_loadingGraphic: null,
	_failureCallback: function( e ) {},
	_successCallback: function( e ) {},
	_skipCallback: function( e ) {},

	// public methods
	init: function init( cfg ) {
		this._cfg = cfg;
		this._setElements( cfg.elements );
		this._setOptins( cfg.optins );
		this._setProxy( cfg.proxy );
		this._setUI( cfg.ui );
		this._setEnvironment( cfg.env );
		this._setLoadingGraphic( cfg.loadingGraphic );
		this._setSuccessCallback( cfg.success );
		this._setFailureCallback( cfg.failure );
		this._setSkipCallback( cfg.skip );	
	},
	//"extend": function extend( prop ) {},
	register: function register( noJSON ) {
		this._sharedMethod( noJSON, "register" );
	},
	update: function update( noJSON ) {
		this._sharedMethod( noJSON, "update" );
	},
	login: function login( noJSON ) {
		this._sharedMethod( noJSON, "login" );
	},
	/*logout: function logout( noJSON ) {
		this._sharedMethod( noJSON, "logout" );
	},*/
	updatePassword: function updatePassword( noJSON ) {
		this._sharedMethod( noJSON, "updatePassword" );
	},
	createPassword: function createPassword( noJSON ) {
		this._sharedMethod( noJSON, "createPassword" );
	},
	forgotPassword: function forgotPassword( noJSON ) {
		this._sharedMethod( noJSON, "forgotPassword" );
	},
	resetPassword: function resetPassword( noJSON ) {
		this._sharedMethod( noJSON, "resetPassword" );
	},
	miniRegister: function miniRegister( noJSON ) {
		this._sharedMethod( noJSON, "miniRegister" );
	},
	FBwithEmail: function FBwithEmail( noJSON ) {
		this._sharedMethod( noJSON, "FBwithEmail" );
	},
	/*FBconnect: function FBconnect( noJSON ) {
		this._sharedMethod( noJSON, "FBconnect" );
	},*/
	registerWithMandatoryDOB: function registerWithMandatoryDOB( noJSON ) {
		this._sharedMethod( noJSON, "registerWithMandatoryDOB" );
	},
	updateWithMandatoryDOB: function updateWithMandatoryDOB( noJSON ) {
		this._sharedMethod( noJSON, "updateWithMandatoryDOB" );
	},
	addScreenNameAndDOB: function addScreenNameAndDOB( noJSON ) {
		this._sharedMethod( noJSON, "addScreenNameAndDOB" );
	},

	onRegister: function onRegister( response ) { this._sharedOnMethod( response/*, "register"*/ ); },
	onUpdate: function onUpdate( response ) { this._sharedOnMethod( response/*, "update"*/ ); },
	onLogin: function onLogin( response ) { this._sharedOnMethod( response/*, "login"*/ ); },
	//onLogout: function onLogout( response ) { this._sharedOnMethod( response/*, "logout"*/ ); },
	onCreatePassword: function onCreatePassword( response ) { this._sharedOnMethod( response/*, "createPassword"*/ ); },
	onUpdatePassword: function onUpdatePassword( response ) { this._sharedOnMethod( response/*, "updatePassword"*/ ); },
	onForgotPassword: function onForgotPassword( response ) { this._sharedOnMethod( response/*, "forgotPassword"*/ ); },
	onResetPassword: function onResetPassword( response ) { this._sharedOnMethod( response/*, "resetPassword"*/  ); },
	onMiniRegister: function onMiniRegister( response ) { this._sharedOnMethod( response/*, "miniRegister"*/  ); },
	onFBwithEmail: function onFBwithEmail( response ) { this._sharedOnMethod( response/*, "FBwithEmail"*/  ); },
	//onFBconnect: function onFBconnect( response ) { this._sharedOnMethod( response/*, "FBconnect"*/  ); },
	onRegisterWithMandatoryDOB: function onRegisterWithMandatoryDOB( response ) { this._sharedOnMethod( response/*, "resetPassword"*/  ); },
	onUpdateWithMandatoryDOB: function onUpdateWithMandatoryDOB( response ) { this._sharedOnMethod( response/*, "resetPassword"*/  ); },
	onAddScreenNameAndDOB: function onAddScreenNameAndDOB( response ) { this._sharedOnMethod( response/*, "resetPassword"*/  ); },

	// private methods
	_setElements: function _setElements( e ) {
		var tempObj = {},
		isJQOBJNOTEMPTY = PCH.SSO.utils.isJQueryObjectAndNotEmpty;
		if( e && typeof e === "object" ) {
			// sanitize!!!!!
			for( var prop in e ) {
				if( isJQOBJNOTEMPTY( e[ prop ] ) ) {
					tempObj[ prop ] = e[ prop ];
				}
			}
			this._elements = tempObj;
		} else {
			throw new Error( "_setElements(): Pass in a valid object of elements." );
		}
	},
	_getElements: function _getElements() {
		return this._elements;
	},
	_setOptins: function _setOptins( o ) {
		if( o instanceof Array ) {
			this._optins = o;
		}
	},
	_getOptins: function _getOptins() {
		return this._optins;
	},
	_resetAddressCounter: function _resetAddressCounter() {
		this._addressCounter = 0;
	},
	_addToAddressCounter: function _addToAddressCounter() {
	    this._addressCounter += 1;
	},
	_getAddressCounter: function _getAddressCounter() {
		return this._addressCounter;
	},
	_setProxy: function _setProxy( p ) {
		if( p && typeof p === "object" ) {
			this._externalProxy = p;
		}
	},
	_getProxy: function _getProxy( m ) {
		return ( this._externalProxy && typeof this._externalProxy[ m ] === "function" ) ? this._externalProxy[ m ] : this._internalProxy[ m ];
	},
	_setUI: function _setUI( ui ) {
		if( ui.length && typeof ui === "string" ) {
			this._uiSelection = ui;
		}
	},
	_getUI: function _getUI() {
		return this._uiSelection;
	},
	_setEnvironment: function _setEnvironment( e ) {
		if( e && ( e.length && typeof e === "string" ) ) {
			this._environment = e.toLowerCase();
		} else {
			throw new Error( "_setEnvironment(): Pass in an Environment string." );
		}
	},
	_getEnvironment: function _getEnvironment() {
		/*var envURL = {
			prod: "http://new.pch.com",
			stg: "http://new.stg.pch.com",
			qa: "http://new.qa.pch.com",
			dev: "http://new.dev.pch.com"
		}
		return envURL[ this._environment ];*/
		var url;
		if( this._environment ) {
			if( this._environment === "prod" ) {
				url = "http://www.pch.com";
			} else {
				url = "http://www." + this._environment + ".pch.com";
			}
			return url;
		} else {
			throw new Error( "_getEnvironment(): Pass in an environment." );
		}
	},
	_setLoadingGraphic: function _setLoadingGraphic( g ) {
		if( g ) {
			if( PCH.SSO.utils.isJQueryObjectAndNotEmpty( g ) ) {
				this._loadingGraphic = g;
			}
		}
	},
	_getloadingGraphic: function _getloadingGraphic() {
		return this._loadingGraphic;
	},
	_addErrorToCollection: function _addErrorToCollection( e ) {
		this._errorCollection.push( e );
	},
	_clearErrorCollection: function _clearErrorCollection() {
		this._errorCollection = [];
	},
	_getErrorFromCollection: function _getErrorFromCollection( e ) {
		return this._errorCollection[ e ];
	},
	_getErrorCollection: function _getErrorCollection() {
		return this._errorCollection;
	},
	_setFailureCallback: function _setFailureCallback( fn ) {
		if( typeof fn === "function" ) {
			this._failureCallback = fn;
		}
	},
	_getFailureCallback: function _getFailureCallback() {
		//if( this._getAddressCounter() === 3 ) {
		//    return function() {};
		//} else {
		    return this._failureCallback;
		//}
	},
	_setSuccessCallback: function _setSuccessCallback( fn ) {
		if( typeof fn === "function" ) {
			this._successCallback = fn;
		} else {
			throw new Error( "_setSuccessCallback(): Pass in a valid success callback function." );
		}
	},
	_getSuccessCallback: function _getSuccessCallback() {
		return this._successCallback;
	},
	_setSkipCallback: function _setSkipCallback( fn ) {
		if( typeof fn === "function" ) {
			this._skipCallback = fn;
		}
	},
	_getSkipCallback: function _getSkipCallback() {
		return this._skipCallback;
	},
	_addUiModule: function _addUiModule( ui ) {
		this._uiCollection[ ui.name ] = ui.module;
	},
	_getUiModule: function _getUiModule( uim ) {
		return this._uiCollection[ uim ];
	},
	_sharedMethod: function _sharedMethod( noJSON, method ) {
		this.clearErrors();
		var emptyFields = this._checkForEmpty( this._getElements() ),
		proxy = this._getProxy( method );
		if( PCH.SSO.utils.isEmptyObject( emptyFields ) ) {
			if( noJSON ) {
				proxy.call( this );
			} else {
				var json = PCH.SSO.interpreter.createJSON( this._getElements(), this._getOptins(), method );
				proxy.call( this, json );
			}
		} else {
			this._getFailureCallback()( "blank" );
			this._handleProcessedResponse( {
				type: "blank",
				errorFields: emptyFields
			} );
		}
	},
	_handleProcessedResponse: function _handleProcessedResponse( errorObj ) {
		var error,
		    code,
		    self = this,
		    elms = this._getElements(),
		    ui = this._getUI(),
		    ns = PCH.SSO,
		    specialAlert = ( ui.toLowerCase() === "mobile" ) ? ns.SpecialAlertMobile : ns.SpecialAlertDesktop;

		function fa( c ) {
			this._getProxy( "performAnalytics" )( {
				reason: "failure",
				errorCode: c,
				success: function() {
					self._getProxy( "redirect" ).call( self );
				}
			} );
		}

		function specialAlert92002() {
			var fieldNames = [];

			for( var prop in errorObj.errorFields ) {
				fieldNames.push( prop );
			}

			errorObj = new specialAlert(
		        elms,
		        "Please enter a valid email",
		        "<p>Our records show this email address may be undeliverable. You may be missing out on additional winning opportunities.</p><span class='sml'>If the email supplied is correct, please contact customer service at 1-800-476-4724.</span>",
		        //fieldNames,
		        [ "email", "confirmEmail" ],
		        { text: "Skip now, remind me later", callback: this._getSkipCallback() }
		    );
		    this._addErrorToCollection( errorObj );
		}

		if( ( errorObj.type === "failure" || errorObj.type === "softFailure" ) && errorObj.errorMessages.length === 1 ) {
			code = errorObj.errorMessages[ 0 ].code;
			switch( code ) {
				case 60310:
					fa.call( this, "bademail/" + code );
					break;
				case 60352:
					fa.call( this, "bademail/" + code );
					break;
				case 61310:
					fa.call( this, "bademail/" + code );
					break;
				case 61352:
					fa.call( this, "bademail/" + code );
					break;
				case 61350:
					fa.call( this, "badpassword/" + code );
					break;
				/*case 92002:
					specialAlert92002.call( this );
				    break;*/
			}
		}

		if( this._getAddressCounter() === 3 ) {
		    errorObj = new specialAlert(
		        elms,
		        "This address is not valid",
		        "<p>Please make sure you are using a deliverable mailing address, which may include a P.O. Box.</p><span class='sml'>If you need further assistance, please call customer service at 1-800-476-4724.</span>",
		        [ "address1", "city", "state", "zipcode" ]
		    );
		    this._addErrorToCollection( errorObj );
		    this._resetAddressCounter();
		}

		if( errorObj.type ) {
            error = Object.create( this._getUiModule( this._getUI() ) );
            error.init( errorObj, this._getElements().container, this );
            this._addErrorToCollection( error );
		}

	},
	_sharedOnMethod: function _sharedOnMethod( json/*, method*/ ) {
	    var processedObject = PCH.SSO.interpreter.processJSON(json, this._getElements());
	    var fieldOrAddressValType = processedObject.type;
	    var emailValType = processedObject.emailVal ? processedObject.emailVal.type : "success";

	    // If both address and email successful, or an autocorrect suggestion was returned
	    if( ( fieldOrAddressValType === "success" || fieldOrAddressValType === "autoCorrect" ) && emailValType === "success" ) {
	        this._handleProcessedResponse(processedObject);
	        this._getSuccessCallback()();
	        return;
	    }

	    // If address failed to validate, increment counter
	    if (fieldOrAddressValType === "addressFailure" || fieldOrAddressValType === "suggestion") {
	        this._addToAddressCounter();
	    }

	    // If either failed or there is suggestion
	    if (fieldOrAddressValType === "failure" ||
	        fieldOrAddressValType === "addressFailure" ||
	        fieldOrAddressValType === "suggestion" ||
	        fieldOrAddressValType === "softFailure" ||
	        emailValType === "failure" ||
	        emailValType === "emailFailure" ||
	        emailValType === "suggestion" ||
	        emailValType === "softFailure") {
	        this._getFailureCallback()();
	        this._handleProcessedResponse(processedObject);
	        return;
	    }

	    // Underage
	    if (fieldOrAddressValType === "underAge") {
	        this._onUnderAge();
	        return;
	    }

	    // Obscene
	    if (fieldOrAddressValType === "obscene" || emailValType === "obscene") {
	        this._onObscene();
	        return;
	    }

	    // suppress
	    if (fieldOrAddressValType === "suppress" || emailValType === "suppress") {
	        this._onSuppress();
	        return;
	    }

	    // bot
	    if (fieldOrAddressValType === "bot" || emailValType === "bot") {
	        this._onBot();
	        return;
	    }

	    // bot
	    if (fieldOrAddressValType === "spamTrap" || emailValType === "spamTrap") {
	        this._onSpamTrap();
	        return;
	    }

	    // techFailure
	    if (fieldOrAddressValType === "techFailure" || emailValType === "techFailure") {
	        this._onTechFailure( processedObject );
	        return;
	    }

	    // default case
	    this._getSuccessCallback()();
	},
	_checkForEmpty: function _checkForEmpty( elements ) {
		var dobRequired = false, copy = {};
        $.extend( copy, elements );
        for( var elm in copy ) {
            //if( copy[ elm ] === undefined ) { continue; }
			//if( !isJqObjNotEmpty( copy[ elm ] ) ) { continue; }
			//if( !copy[ elm ] ) { delete copy[ elm ]; continue; }
            if( elm === "container" ) { delete copy[ elm ]; continue; }
            if( elm !== "month" && elm !== "day" && elm !== "year" ) {
                if( copy[ elm ].hasClass( "required" ) ) {
                    if( copy[ elm ][ 0 ].nodeName.toLowerCase() === "input" ) {
                        if( $.trim( copy[ elm ].val() ) !== "" ) {
                            delete copy[ elm ];
                        }
                    } else if( copy[ elm ][ 0 ].nodeName.toLowerCase() === "select" ) {
                        if( copy[ elm ][ 0 ].selectedIndex !== 0 ) {
                            delete copy[ elm ];
                        }
                    }
                } else {
                    delete copy[ elm ];
                }
            } else {
                if( copy[ elm ].hasClass( "required" ) ) {
                    dobRequired = true;
                }
            }
        }

		if( dobRequired ) {
			if( copy.month && copy.day && copy.year ) {
				if( copy.month[ 0 ].selectedIndex !== 0 ) { delete copy.month; };
				if( copy.day[ 0 ].selectedIndex !== 0 ) { delete copy.day; };
				if( copy.year[ 0 ].selectedIndex !== 0 ) { delete copy.year; };
			} else {
				throw new Error( "_checkForEmpty(): You have not supplied all the DOB fields." );
			}
		} else {
			if( copy.month && copy.day && copy.year ) {
				if( ( copy.month[ 0 ].selectedIndex === 0 ) && ( copy.day[ 0 ].selectedIndex === 0 ) && ( copy.year[ 0 ].selectedIndex === 0 ) ) {
					delete copy.month;
					delete copy.day;
					delete copy.year;
				} else {
					if( copy.month[ 0 ].selectedIndex !== 0 ) { delete copy.month; };
					if( copy.day[ 0 ].selectedIndex !== 0 ) { delete copy.day; };
					if( copy.year[ 0 ].selectedIndex !== 0 ) { delete copy.year; };
				}
			}
		}

        /*
		 if( copy.month && copy.day && copy.year ) {
		//if( isJqObjNotEmpty( copy.month ) && isJqObjNotEmpty( copy.day ) && isJqObjNotEmpty( copy.year ) ) {
            if( ( copy.month[ 0 ].selectedIndex === 0 ) && ( copy.day[ 0 ].selectedIndex === 0 ) && ( copy.year[ 0 ].selectedIndex === 0 ) && !dobRequired ) {
                delete copy.month;
                delete copy.day;
                delete copy.year;
            } else {
                if( copy.month[ 0 ].selectedIndex !== 0 ) { delete copy.month; };
                if( copy.day[ 0 ].selectedIndex !== 0 ) { delete copy.day; };
                if( copy.year[ 0 ].selectedIndex !== 0 ) { delete copy.year; };
            }
        } else {
			throw "You have not supplied all the DOB fields.";
		}
		*/

        return copy;
	},
	_doJSONP: function _doJSONP( url, json, callback ) {
        var jsonCOR = { "obj": json }, self = this;
		//this._showLoaderGraphic( true );
        $.ajax( {
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( jsonCOR ),
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "cor",
            success: function( response, textStatus, jqXHR ) {
				//self._showLoaderGraphic( false );
                callback.call( self, response );
            },
            error: function( jqXHR, textStatus, errorThrown ) {},
            complete: function() {}
        } );
	},
	_doXHR: function _doXHR( url, json, callback ) {
		var self = this;
		//this._showLoaderGraphic( true );
        $.ajax( {
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify( json ),
            dataType: "json",
            success: function( response, textStatus, jqXHR ) {
				//self._showLoaderGraphic( false );
                callback.call( self, response );
            },
            error: function( jqXHR, textStatus, errorThrown ) {},
            complete: function() {}
        } );
	},
	showLoaderGraphic: function showLoaderGraphic( show ) {
		if( this._getloadingGraphic() ) {
			if( show ) {
				this._getloadingGraphic().addClass( "show" );
			} else {
				this._getloadingGraphic().removeClass( "show" );
			}
		}
	},
	clearErrors: function clearErrors() {
		var errorCollectionTotal = this._getErrorCollection().length;
		if( errorCollectionTotal > 0 ) {
			for( var el = errorCollectionTotal - 1; el >= 0; el -= 1 ) {
				this._getErrorFromCollection( [ el ] ).clear();
			}
		}
		this._clearErrorCollection();
	},
	_sendToURL: function _sendToURL( url ) {
		top.location.href = url;
	},
	_onUnderAge: function _onUnderAge() {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/we_are_sorry.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "underage",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},
	/*_onSoftFailure: function _onSoftFailure( errorObj ) {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/we_are_sorry.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "underage",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},*/
	_onObscene: function _onObscene() {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/invalid_reg.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "obscene",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},
	_onTechFailure: function _onTechFailure( errorObj ) {
		var self = this,
		redirectURL;/* = ( errorObj.code ) ? this._getEnvironment() + "/errorpages/noreg.html?trn=" + errorObj.code + ( errorObj.message ) ? "&trm=" + errorObj.message : "" : this._getEnvironment() + "/errorpages/noreg.html";*/
		if( errorObj.code ) {
			redirectURL = "/errorpages/noreg.html?trn=" + errorObj.code;
			if( errorObj.message ) {
				redirectURL += "&trm=" + errorObj.message;
			}
		} else {
			redirectURL = "/errorpages/noreg.html";
		}
		this._getProxy( "performAnalytics" ).call( this, {
			reason: "techfailure",
			errorCode: null,
			success: function() {
				self._getProxy( "redirect" ).call( self, redirectURL );
			}
		} );
	},
	_onSuppress: function _onSuppress() {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/invalid_reg.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "suppress",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},
	_onBot: function _onBot() {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/invalid_reg.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "bot",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},
	_onSpamTrap: function _onSpamTrap() {
		var self = this,
		redirectURL = this._getEnvironment() + "/errorpages/invalid_reg.html";
		this._getProxy( "logout" ) ( function() {
			self._getProxy( "performAnalytics" ).call( self, {
				reason: "spamtrap",
				errorCode: null,
				success: function() {
					self._getProxy( "redirect" ).call( self, redirectURL );
				}
			} );
		} );
	},
	_raiseSkipEmailNotification: function _raiseSkipEmailNotification( errorCode, email ) {
	    var callback = this._getProxy( "skipEmailVal" );
	    callback.call( this, errorCode, email );
	}
};

PCH.SSO.interpreter = {
	// private properties
	_statusCodes: {
        failure: 81,
        success: 82,
        autoCorrect: 83,
        suggestion: 84,
        dpvFailure: 85,
        underAge: 86,
        obscene: 87,
        suppress: 88,
        bot: 89,
        spamTrap: 90,
        techFailure: 91,
        softFailure: 92,
        softStop: 94,
        softSuggestion: 95,
        espSuppression: 96,
        suspect: 97
    },

	// public methods
	createJSON: function createJSON( elements, optins, method ) {
		
		function makeRegistrationRequest( elements, optins, mandatoryDOB ) {
			var request = {
				"Fields": [],
				"SubscriptionData": {
					"SubscriptionCodes": []
				}
			},
			dobCode = mandatoryDOB ? this._codeLookup( "mandatoryDOB" ) : this._codeLookup( "dateOfBirth" );

			if( !PCH.SSO.utils.isEmptyObject( elements ) ) {
				for( var elm in elements ) {
					//if( !elements[ elm ] ) { continue; }
					if( elm === "container" ) { continue; }
					if( elm !== "month" && elm !== "day" && elm !== "year" ) {
						request.Fields.push( { "FieldCode": this._codeLookup( elm ), "FieldValue": $.trim( elements[ elm ].val() ) } );
					}
				}
				// push dob in there
				if( elements[ "month" ] && elements[ "day" ] && elements[ "year" ] ) {
					if( elements[ "month" ][ 0 ].selectedIndex === 0 && elements[ "day" ][ 0 ].selectedIndex === 0 && elements[ "year" ][ 0 ].selectedIndex === 0 ) {						
						request.Fields.push( { "FieldCode": dobCode, "FieldValue": "" } );
					} else {
						request.Fields.push( { "FieldCode": dobCode, "FieldValue": $.trim( elements[ "month" ].val() ) + "/" + $.trim( elements[ "day" ].val() ) + "/" + $.trim( elements[ "year" ].val() ) } );
					}
				}
			}
			// hardcode country in there
			request.Fields.push( { "FieldCode": this._codeLookup( "country" ), "FieldValue": "USA" } );
			
			if( optins && optins.length !== 0 ) {
				//if( optins.length !== 0 ) {
					for( var ol = optins.length - 1; ol >= 0; ol -= 1 ) {
						if( optins[ ol ].element.is( ":checked" ) ) {
							request.SubscriptionData.SubscriptionCodes.push( optins[ ol ].code );
						}
					}
				//}
			}
			
			return request;
		}
		
		function makeLoginRequest( elements ) {
			if( !elements.email || !elements.password ) { throw new Error( "createJSON() > makeLoginRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"Email": $.trim( elements.email.val() ),
				"Password": $.trim( elements.password.val() )
			};
			return request;
		}
		
		function makeCreatePasswordRequest( elements ) {
			if( !elements.password || !elements.confirmPassword ) { throw new Error( "createJSON() > makeCreatePasswordRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"Password": $.trim(  elements.password.val() ),
				"ConfirmPassword": $.trim( elements.confirmPassword.val() )
			};
			return request;
		}
		
		function makeUpdatePasswordRequest( elements ) {
			if( !elements.password || !elements.password || !elements.confirmPassword ) { throw new Error( "createJSON() > makeUpdatePasswordRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"OldPassword": $.trim( elements.password.val() ),
				"NewPassword": $.trim( elements.password.val() ),
				"ConfirmNewPassword": $.trim( elements.confirmPassword.val() )
			};
			return request;
		}
		
		function makeResetPasswordRequest( elements ) {
			if( !elements.password || !elements.confirmPassword ) { throw new Error( "createJSON() > makeResetPasswordRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"Password": $.trim( elements.password.val() ),
				"ConfirmPassword": $.trim( elements.confirmPassword.val() )
			};
			return request;
		}
		
		function makeForgotPasswordRequest( elements ) {
			if( !elements.email ) { throw new Error( "createJSON() > makeForgotPasswordRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"Email": $.trim( elements.email.val() )
			};
			return request;
		}

		function makeMiniRegRequest( elements ) {
			if( !elements.email || !elements.password ) { throw new Error( "createJSON() > makeMiniRegRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"Fields": [
					{ "FieldCode": this._codeLookup( "email" ), "FieldValue": $.trim( elements.email.val() ) },
					{ "FieldCode": this._codeLookup( "password" ), "FieldValue": $.trim( elements.password.val() ) },
				]
			};
			if( elements.title ) request.Fields.push( { "FieldCode": this._codeLookup( "title" ), "FieldValue": $.trim( elements.title.val() ) } );
			if( elements.firstName ) request.Fields.push( { "FieldCode": this._codeLookup( "firstName" ), "FieldValue": $.trim( elements.firstName.val() ) } );
			if( elements.lastName ) request.Fields.push( { "FieldCode": this._codeLookup( "lastName" ), "FieldValue": $.trim( elements.lastName.val() ) } );
			if( elements.confirmEmail ) request.Fields.push( { "FieldCode": this._codeLookup( "confirmEmail" ), "FieldValue": $.trim( elements.confirmEmail.val() ) } );
			if( elements.confirmPassword ) request.Fields.push( { "FieldCode": this._codeLookup( "confirmPassword" ), "FieldValue": $.trim( elements.confirmPassword.val() ) } );
			if( elements.month && elements.day && elements.year ) request.Fields.push( { "FieldCode": this._codeLookup( "dateOfBirth" ), "FieldValue": $.trim( elements[ "month" ].val() ) + "/" + $.trim( elements[ "day" ].val() ) + "/" + $.trim( elements[ "year" ].val() ) } );
				
			return request;
		}

		function makeFBwithEmailRequest() {
			if( !elements.email ) { throw new Error( "createJSON() > makeFBwithEmailRequest(): you did not pass in the correct fields for this method" ); }
			return { "PchEmail": $.trim( elements.email.val() ) }
		}

		//function makeFBconnectRequest() {}

		function makeScreenNameAndDobRequest( elements ) {
			if( !elements.screenName || ( !elements.month || !elements.day || !elements.year ) ) { throw new Error( "createJSON() > makeScreenNameAndDobRequest(): you did not pass in the correct fields for this method" ); }
			var request = {
				"ScreenName": $.trim( elements.screenName.val() ),
				"DateOfBirth": $.trim( elements.month.val() ) + "/" + $.trim( elements.day.val() ) + "/" + $.trim( elements.year.val() )
			};
			return request;
		}
		
		switch( method ) {
            case "register":
				return makeRegistrationRequest.call( this, elements, optins, false );
				break;
			case "update":
				return makeRegistrationRequest.call( this, elements, optins, false );
				break;
			case "login":
				return makeLoginRequest.call( this, elements );
				break;
			/*case "logout":
				//return makeLoginRequest.call( this, elements );
				break;*/
			case "createPassword":
				return makeCreatePasswordRequest.call( this, elements );
				break;
			case "updatePassword":
				return makeUpdatePasswordRequest.call( this, elements );
				break;
			case "forgotPassword":
				return makeForgotPasswordRequest.call( this, elements );
				break;
			case "resetPassword":
				return makeResetPasswordRequest.call( this, elements );
				break;
			case "miniRegister":
				return makeMiniRegRequest.call( this, elements, optins, true );
				break;
			case "FBwithEmail":
				return makeFBwithEmailRequest.call( this, elements, optins, true );
				break;
			/*case "FBconnect":
				return makeFBconnectRequest.call( this, elements );
				break;*/
			case "registerWithMandatoryDOB":
				return makeRegistrationRequest.call( this, elements, optins, true );
				break;
			case "updateWithMandatoryDOB":
				return makeRegistrationRequest.call( this, elements, optins, true );
				break;
			case "addScreenNameAndDOB":
				return makeScreenNameAndDobRequest.call( this, elements );
				break;
			default:
				throw "you need to use a known method";
				break;
		}
		return undefined;
	},
	
	processJSON: function processJSON( json, elements ) {
		var self = this,
			fieldDatabaseVal = ( typeof json.FieldOrDatabaseValidationResponse === "object" ) ? json.FieldOrDatabaseValidationResponse : null,
			emailVal = ( typeof json.EmailValidationResponse === "object" ) ? json.EmailValidationResponse : null,
			addressVal = ( typeof json.AddressValidationResponse === "object" ) ? json.AddressValidationResponse : null,
			emailSugg = ( json.EmailSuggestions instanceof Array ) ? json.EmailSuggestions : null,
			addressSugg = ( json.AddressSuggestions instanceof Array ) ? json.AddressSuggestions : null;
		
		if( json.IsValid && !json.IsSkip ) {
			if( addressSugg ) {
				return createAddressAutoCorrectObject();
			} else {
				return createSuccessObject();
			}
		}

		if( json.IsSkip ) {
			return parseFieldDatabaseVal();
		}
		
		if( fieldDatabaseVal !== null ) {
			return parseFieldDatabaseVal();
		} else {
			return parseEmailVal();
		}
		
		function convertToField( fieldName ) {
			var fields = elements;
			for( var field in fields ) {
				if( field === fieldName ) {
					return elements[ field ];
				}
			}
			return null;
		}
				
		function parseFieldDatabaseVal() {
		    switch (fieldDatabaseVal.StatusResponse.Code) {
		        case self._statusCodes.failure:
		            return createFailureObject(fieldDatabaseVal);
		        case self._statusCodes.success:
		            return parseEmailVal();
		        case self._statusCodes.underAge:
		            return { type: "underAge" };
		        case self._statusCodes.obscene:
		            return { type: "obscene" };
		        case self._statusCodes.techFailure:
		            return createTechFailureObject(fieldDatabaseVal);
		        case self._statusCodes.softFailure:
		            return createSoftFailureObject(fieldDatabaseVal);
		        default:
		            return parseEmailVal();
		    }
		}

	    function parseEmailVal() {
	        if (!emailVal) {
	            return parseAddressVal();
	        }

	        switch (emailVal.StatusResponse.Code) {
	        case self._statusCodes.failure:
	            return parseAddressVal(createFailureObject(emailVal, false, true));
	        case self._statusCodes.success:
	            return parseAddressVal();
	        case self._statusCodes.suggestion:
	            return parseAddressVal(createEmailSuggestionObject());
	        case self._statusCodes.obscene:
	            return { type: "obscene" };
	        case self._statusCodes.suppress:
	            return { type: "suppress" };
	        case self._statusCodes.bot:
	            return { type: "bot" };
	        case self._statusCodes.spamTrap:
	            return { type: "spamTrap" };
	        case self._statusCodes.techFailure:
	            return createTechFailureObject(emailVal);
	        case self._statusCodes.softStop:
	            return parseAddressVal(createFailureObject(emailVal, true, true));
	        case self._statusCodes.softSuggestion:
	            return parseAddressVal(createEmailSuggestionObject(true));
	        case self._statusCodes.espSuppression: // treated as success
	        case self._statusCodes.suspect: // treated as success
	            return parseAddressVal();
	        default:
	            return parseAddressVal();
	        }
	    }

	    function parseAddressVal(parsedEmailVal) {
	        var parsedAddressVal;
	        var shouldAttachEmailFailure = true;
	        if (addressVal !== null) {
	            switch (addressVal.StatusResponse.Code) {
	            case self._statusCodes.failure:
	                parsedAddressVal = createAddressFailureObject(addressVal);
	                break;
	            case self._statusCodes.success:
	                parsedAddressVal = createSuccessObject();
	                break;
	            case self._statusCodes.autoCorrect:
	                parsedAddressVal = createAddressAutoCorrectObject();
	                break;
	            case self._statusCodes.suggestion:
	                parsedAddressVal = createAddressSuggestionObject();
	                break;
	            case self._statusCodes.dpvFailure:
	                parsedAddressVal = createAddressFailureObject(addressVal);
	                break;
	            case self._statusCodes.obscene:
	                parsedAddressVal = { type: "obscene" };
	                shouldAttachEmailFailure = false;
	                break;
	            case self._statusCodes.techFailure:
	                parsedAddressVal = createTechFailureObject(addressVal);
	                shouldAttachEmailFailure = false;
	                break;
	            default:
	                parsedAddressVal = createSuccessObject();
	            }
	        } else {
	            parsedAddressVal = createSuccessObject();
	        }

	        if (shouldAttachEmailFailure && parsedEmailVal) {
	            parsedAddressVal.emailVal = parsedEmailVal;
	        }
	        return parsedAddressVal;
	    }

	    function createSuccessObject() {
			return {
				type: "success"
			};
		}
		
		/*function createUnderAgeObject( validationObj ) { return { type: "underAge", code: validationObj.Responses[ 0 ].Code } }
		function createObsceneObject( validationObj ) {}
		function createTechFailureObject( validationObj ) {}
		function createSuppressObject( validationObj ) {}
		function createBotObject( validationObj ) {}
		function createSpamTrapObject( validationObj ) {}*/
		
	    function createFailureObject(validationObj, isSoftFailure, isEmail) {
			var errorType = validationObj,
			errorMessages = errorType.Responses,
			failureFieldCodes = ( errorType.FailureFieldCodes ) ? errorType.FailureFieldCodes : [],
			errorMessageArray = [],
			errorFieldsObj = {},
			tmp;
			
			for( var em = 0, eml = errorMessages.length; em < eml; em += 1 ) {
				tmp = errorMessages[ em ];
				errorMessageArray.push( {
					code: tmp.Code,
					message: tmp.Message,
					field: ( tmp.FieldCode ) ? convertToField( self._codeLookup( tmp.FieldCode ) ) : null
				} );
			}
			
			//for( var ffc = failureFieldCodes.length - 1; ffc >= 0; ffc -= 1 ) {
			for( var ff = 0, ffl = failureFieldCodes.length; ff < ffl; ff += 1 ) {
				//errorFieldsArray.push( convertToField( self._codeLookup( failureFieldCodes[ ff ] ) ) );
				if( failureFieldCodes[ ff ] === 24 ) {
					errorFieldsObj[ self._codeLookup( failureFieldCodes[ ff ] ) ] = {
						month: convertToField( "month" ),
						day: convertToField( "day" ),
						year: convertToField( "year" )
					};
				} else {
					errorFieldsObj[ self._codeLookup( failureFieldCodes[ ff ] ) ] = convertToField( self._codeLookup( failureFieldCodes[ ff ] ) );
				}
			}
			
			return {
			    type: isEmail ? "emailFailure" : "failure",
			    statusMessage: (errorType.StatusResponse.Message) ? errorType.StatusResponse.Message : null,
			    errorMessages: errorMessageArray,
			    errorFields: errorFieldsObj,
			    isSoft: isSoftFailure
			};
		}
		
		function createAddressFailureObject( validationObj ) {
			var errorType = validationObj,
			errorMessages = errorType.Responses,
			failureFieldCodes = ( errorType.FailureFieldCodes ) ? errorType.FailureFieldCodes : [],
			errorMessageArray = [],
			errorFieldsObj = {},
			tmp;
			
			for( var em = 0, eml = errorMessages.length; em < eml; em += 1 ) {
				tmp = errorMessages[ em ];
				errorMessageArray.push( {
					code: tmp.Code,
					message: tmp.Message,
					field: ( tmp.FieldCode ) ? convertToField( self._codeLookup( tmp.FieldCode ) ) : null
				} );
			}
			
			if( !failureFieldCodes.length ) {
				errorFieldsObj[ self._codeLookup( 14 ) ] = convertToField( self._codeLookup( 14 ) );
				if( convertToField( self._codeLookup( 15 ) ).val() !== "" ) {
					errorFieldsObj[ self._codeLookup( 15 ) ] = convertToField( self._codeLookup( 15 ) );
				}
				errorFieldsObj[ self._codeLookup( 16 ) ] = convertToField( self._codeLookup( 16 ) );
				errorFieldsObj[ self._codeLookup( 17 ) ] = convertToField( self._codeLookup( 17 ) );
				errorFieldsObj[ self._codeLookup( 18 ) ] = convertToField( self._codeLookup( 18 ) );
			} else {
				for( var ff = 0, ffl = failureFieldCodes.length; ff < ffl; ff += 1 ) {
					//errorFieldsArray.push( convertToField( self._codeLookup( failureFieldCodes[ ff ] ) ) );
					if( failureFieldCodes[ ff ] === 24 ) {
						errorFieldsObj[ self._codeLookup( failureFieldCodes[ ff ] ) ] = {
							month: convertToField( "month" ),
							day: convertToField( "day" ),
							year: convertToField( "year" )
						};
					} else {
						errorFieldsObj[ self._codeLookup( failureFieldCodes[ ff ] ) ] = convertToField( self._codeLookup( failureFieldCodes[ ff ] ) );
					}
				}
			}
			
			return {
				type: "addressFailure",
				statusMessage: ( errorType.StatusResponse.Message ) ? errorType.StatusResponse.Message : null,
				errorMessages: errorMessageArray,
				errorFields: errorFieldsObj
			};
		}
		
		function createAddressSuggestionObject() {
			var suggestionArray = [],
				errorFields = {},
				addressFields = {},
				tmp;
			
			addressFields[ self._codeLookup( 14 ) ] = convertToField( self._codeLookup( 14 ) );
			addressFields[ self._codeLookup( 15 ) ] = convertToField( self._codeLookup( 15 ) );
			addressFields[ self._codeLookup( 16 ) ] = convertToField( self._codeLookup( 16 ) );
			addressFields[ self._codeLookup( 17 ) ] = convertToField( self._codeLookup( 17 ) );
			addressFields[ self._codeLookup( 18 ) ] = convertToField( self._codeLookup( 18 ) );
			
			if( addressSugg.length > 1 ) {
				errorFields[ self._codeLookup( 14 ) ] = convertToField( self._codeLookup( 14 ) );
				errorFields[ self._codeLookup( 16 ) ] = convertToField( self._codeLookup( 16 ) );
				errorFields[ self._codeLookup( 17 ) ] = convertToField( self._codeLookup( 17 ) );
				errorFields[ self._codeLookup( 18 ) ] = convertToField( self._codeLookup( 18 ) );
			/*} else if (addressSugg[0].FieldsCorrected) {
			    for (var fsl = addressSugg[0].FieldsCorrected.length - 1; fsl >= 0; fsl -= 1) {
			        errorFields[self._codeLookup(addressSugg[0].FieldsCorrected[fsl].FieldCode)] = convertToField(self._codeLookup(addressSugg[0].FieldsCorrected[fsl].FieldCode));
			    }
			}*/
			} else if (addressVal.FailureFieldCodes) {
			    for (var fsl = addressVal.FailureFieldCodes.length - 1; fsl >= 0; fsl -= 1) {
			        errorFields[self._codeLookup(addressVal.FailureFieldCodes[fsl])] = convertToField(self._codeLookup(addressVal.FailureFieldCodes[fsl]));
			    }
			}
			
			for( var s = 0, sl = addressSugg.length; s < sl; s += 1 ) {
				tmp = addressSugg[ s ].Address;
				suggestionArray.push( {
					address1: tmp.AddressLine1,
					address2: tmp.AddressLine2,
					city: tmp.City,
					state: tmp.State,
					zipcode: tmp.ZipCode
				} );
			}
			
			return {
			    type: "suggestion",
			    statusMessage: (addressVal.Responses[0].Message) ? addressVal.Responses[0].Message : null,
			    addressSuggestions: suggestionArray,
			    errorFields: errorFields,
			    addressFields: addressFields
			};
		}
		
		function createEmailSuggestionObject(isSoftSugg) {
		    var suggestionArray = [],
		        errorFields = {},
		        emailFields = {};

		    emailFields[self._codeLookup(20)] = convertToField(self._codeLookup(20));
		    emailFields[self._codeLookup(21)] = convertToField(self._codeLookup(21));

		    if (emailSugg.length > 0) {
		        errorFields[self._codeLookup(20)] = $(convertToField(self._codeLookup(20)));
		        errorFields[self._codeLookup(21)] = $(convertToField(self._codeLookup(21)));
		    }

		    for (var s = 0, sl = emailSugg.length; s < sl; s += 1) {
		        suggestionArray.push({ email: emailSugg[s] });
		    }

		    return {
		        type: "suggestion",
		        statusMessage: (emailVal.Responses && emailVal.Responses[0].Message) ? emailVal.Responses[0].Message : null,
		        errorCode: (emailVal.Responses && emailVal.Responses[0].Code) ? emailVal.Responses[0].Code : null,
		        emailSuggestions: suggestionArray,
		        errorFields: errorFields,
		        emailFields: emailFields,
		        isSoft: !!isSoftSugg
		    };
		}

		function createAddressAutoCorrectObject() {
			var address = addressSugg[ 0 ].Address,
			suggestionArray = [],
			addressFields = {};
			
			addressFields[ self._codeLookup( 14 ) ] = convertToField( self._codeLookup( 14 ) );
			addressFields[ self._codeLookup( 15 ) ] = convertToField( self._codeLookup( 15 ) );
			addressFields[ self._codeLookup( 16 ) ] = convertToField( self._codeLookup( 16 ) );
			addressFields[ self._codeLookup( 17 ) ] = convertToField( self._codeLookup( 17 ) );
			addressFields[ self._codeLookup( 18 ) ] = convertToField( self._codeLookup( 18 ) );
			
			suggestionArray.push( {
				address1: address.AddressLine1,
				address2: address.AddressLine2,
				city: address.City,
				state: address.State,
				zipcode: address.ZipCode
			} );
			
			return {
				type: "autoCorrect",
				statusMessage: ( addressVal.StatusResponse.Message ) ? addressVal.StatusResponse.Message : null,
				addressSuggestions: suggestionArray,
				addressFields: addressFields
			};
		}
		
		function createTechFailureObject( validationObj ) {
		    return {
		        type: "techFailure",
		        code: (validationObj.Responses) ? validationObj.Responses[0].Code : null,
		        message: (validationObj.Responses) ? validationObj.Responses[0].Message : null
		    };
		}

		function createSoftFailureObject( validationObj ) {
			var softFailureObject = createFailureObject( validationObj );
			softFailureObject.type = "softFailure";
			return softFailureObject;
		}
	},
	
	// private methods	
	_codeLookup: function _codeLookup( code ) {
		var letterLookup = {
            title: 11, firstName: 12, lastName: 13, address1: 14,
            address2: 15, city: 16, state: 17, zipcode: 18, country: 19,
            email: 20, confirmEmail: 21, password: 22, confirmPassword: 23,
            dateOfBirth: 24, currentPassword: 25, newPassword: 26, confirmNewPassword: 27,
			screenName: 28, mandatoryDOB: 29, universalMembership: 50
        };
        var numberLookup = {
            11: "title", 12: "firstName", 13: "lastName", 14: "address1",
            15: "address2", 16: "city", 17: "state", 18: "zipcode", 19: "country",
            20: "email", 21: "confirmEmail", 22: "password", 23: "confirmPassword",
            24: "dateOfBirth", 25: "currentPassword", 26: "newPassword", 27: "confirmNewPassword",
			28: "screenName", 29: "mandatoryDOB", 50: "universalMembership"
        };
        if( typeof code === "number" ) {
            return numberLookup[ code ];
        } else if( typeof code === "string" ) {
            return letterLookup[ code ];
        }
        return false;
	},
	
	/*getErrorType: function _getErrorType( validationResponses ) {
		if( !validationResponses ) {
			return null;
		}
	
		var response = validationResponses.FieldOrDatabaseValidationResponse;
		if( response && response.DbResponseCode && response.DbResponseCode.toUpperCase() === "VALIDFAIL" ) {
			return "Field";
		}
		response = validationResponses.AddressValidationResponse;
		if( response && response.DbResponseCode && response.DbResponseCode.toUpperCase() === "VALIDFAIL" ) {
			return "Address";
		}
	
		return null;
	}*/

	getErrorType: function _getErrorType( validationResponses ) {
		var response;

		if( !validationResponses ) return null;
	
		response = validationResponses.FieldOrDatabaseValidationResponse && validationResponses.FieldOrDatabaseValidationResponse.StatusResponse ? validationResponses.FieldOrDatabaseValidationResponse.StatusResponse.Code : null;

		if( response === 81 ) return "Field";

		response = validationResponses.AddressValidationResponse && validationResponses.AddressValidationResponse.StatusResponse ? validationResponses.AddressValidationResponse.StatusResponse.Code : null;

		if( response === 81 || response === 84 || response === 85 ) return "Address";
	
		return null;
	}
};
PCH.SSO.DefaultUI = {
	// private properties
	_cfg: {},
	_blankMessages: {
		title: "Title",
		firstName: "First Name",
		lastName: "Last Name",
		screenName: "Screen Name",
		dateOfBirth: "Date of Birth",
		address1: "Street Address",
		address2: "Apt/Suite",
		city: "City",
		state: "State",
		zipcode: "Zip Code",
		email: "Email",
		confirmEmail: "Email Confirmation",
		oldPassword: "Original Password",
		password: "Password",
		confirmPassword: "Password Confirmation"
	},
	_errorType: "",
	_addressFields: {},
	_statusMessage: "",
	_errorMessages: [],
	_suggestions: [],
	_me: null,
	_container: {},
	_controller: null,
	
		
	// public methods
	init: function init( cfg, container, controller ) {
	    this._cfg = cfg;
	    this._controller = controller;
	    this._setContainer(container);
	    this._setAddressFields(cfg.addressFields);
	    this._setErrorType(cfg.type);
	    this._setStatusMessage(cfg.statusMessage);
	    this._setErrorMessages(cfg.errorMessages);
	    this._setSuggestions(cfg.suggestions);
	    this._populateUI();
	},
	clear: function clear() {},
	
	// private methods
	_setErrorType: function _setErrorType( et ) {
		if( typeof et === "string" ) {
			this._errorType = et;
		} else {
			throw new Error( "_setErrorType():" );
		}
	},
	_getErrorType: function _getErrorType() {
		return this._errorType;
	},
	_setContainer: function _setErrorType( c ) {
		if( c && typeof c === "object" ) {
			this._container = c;
		} else {
			throw new Error( "_setContainer():" );
		}
	},
	_getContainer: function _getContainer() {
		return this._container;
	},
	_getBlankMessage: function _getBlankMessage( f ) {
		return this._blankMessages[ f ];
	},
	_getErrorFields: function _getErrorFields() {
	    // Copy error fields
	    var errorFields = this._cfg.errorFields ? $.extend({}, this._cfg.errorFields) : {};

	    // If email val is avaiable, get error fields from it as well
	    if (this._cfg.emailVal && this._cfg.emailVal.errorFields) {
	        $.extend(errorFields, this._cfg.emailVal.errorFields);
	    }
	    return errorFields;
	},
	_getErrorFieldsLength: function _getErrorFieldsLength() {
		var length = 0,
			prop;
			
		for( prop in this._getErrorFields() ) {
			if( this._getErrorFields().hasOwnProperty( prop ) ) {
				length++;
			}
		}
		return length;
	},
	_setAddressFields: function _setAddressFields( ef ) {
		if( ef && typeof ef === "object" ) {
			this._addressFields = ef;
		}
	},
	_getAddressFields: function _getAddressFields() {
		return this._addressFields;
	},
	_setStatusMessage: function _setStatusMessage( sm ) {
		if( typeof sm === "string" ) {
			this._statusMessage = sm;
		}
	},
	_getStatusMessage: function _getStatusMessage() {
		return this._statusMessage;
	},
	_setErrorMessages: function _setErrorMessages(em) {
	    if (em instanceof Array) {
	        this._errorMessages = em;
	    }
	},
	_getErrorMessages: function _getErrorMessages() {
		return this._errorMessages;
	},
	_setSuggestions: function _setSuggestions( sg ) {
		if( sg instanceof Array ) {
			this._suggestions = sg;
		}
	},
	_getSuggestions: function _getSuggestions() {
		return this._suggestions;
	},
	_populateUI: function _populateUI() {},
	_renderUI: function _renderUI() {}
};

PCH.SSO.Controller._addUiModule( {
	name: "default",
	module: PCH.SSO.DefaultUI
} );
PCH.SSO.DesktopUI = Object.create( PCH.SSO.DefaultUI );

PCH.SSO.DesktopUI._populateUI = function _populateUI() {
    var self = this, statesIndex = {}, isHeaderSet = false;

    var outerShell = self._me = getShell(),
        innerShell = outerShell.find("div.inner-shell"),
        header = outerShell.find("div.header");
	
	function fillStateIndex( stateField ) {
		var selectST = stateField.find( "option" );
		selectST.each( function( index, element ) {
			statesIndex[ element.value.toLowerCase() ] = index;
		} );
	}
	
	function blanks(cfg) {
	    var statusText = "Please fill in the following fields:",
		dobAdded = false;

	    if (!isHeaderSet) {
	        header.append(statusText);
	        isHeaderSet = true;
	    }

	    for (var field in cfg.errorFields) {
	        if ((field === "month" || field === "day" || field === "year") && !dobAdded) {
	            innerShell.append($("<div class=\"error\">").text(self._blankMessages["dateOfBirth"]));
	            dobAdded = true;
	        } else {
	            innerShell.append($("<div class=\"error\">").text(self._blankMessages[field]));
	        }
	    }
	}
	
	function failures(cfg) {
	    if (!isHeaderSet) {
	        header.append("Please correct below and re-submit.");
	        isHeaderSet = true;
	    }
	    var failureClass = "error";
	    if (cfg.type === "emailFailure") failureClass = "email-header";
	    if (cfg.type === "addressFailure") failureClass = "address-header";

	    // Check if address errors are already displayed,
	    // add a divider
	    if (innerShell.find("ul.address-header").length > 0) {
	        innerShell.append($("<hr class='borderdiv'>"));
	    }

	    for (var em = 0, eml = cfg.errorMessages.length; em < eml; em += 1) {
            // Prepare error message
	        var errorUl = $("<ul>");
	        errorUl.addClass(failureClass);
	        if (cfg.isSoft) errorUl.addClass("soft");
	        var errorLi = $("<li>").text(cfg.errorMessages[em].message);
	        errorUl.append(errorLi);
	        innerShell.append(errorUl);
	        
            // If this is soft failure, we'll need a close button too
	        if (cfg.isSoft) {
	            // Store email and error code for skip callback
	            var email = (self._cfg.emailVal) ? self._cfg.emailVal.errorFields.email.val() : null;
	            var errorCode = (self._cfg.emailVal) ? self._cfg.emailVal.errorMessages[0].code : null;
	            
	            // UAT FEEDBACK: Enable skip functionality without
	            // the user clicking on cross button
	            self.raiseSkipEmailNotification(errorCode, email);

                // Wire up close button
	            var closeButton = $("<div class='close'></div>");
	            closeButton.bind("mouseup", {}, function (e) {
	                self.clearEmail();
	                self.raiseSkipEmailNotification(errorCode, email);
	            });
	            errorLi.append(closeButton);
	        }
	    }

	    // Check for email validation errors
	    if (cfg.emailVal) {
	        render(cfg.emailVal);
	    }
	}
	
	function suggestions(cfg) {
	    var sug = cfg.addressSuggestions,
	        eSug = cfg.emailSuggestions,
	        adr = cfg.addressFields,
	        emf = cfg.emailFields,
	        statusText = cfg.statusMessage,
	        headerText = "Please correct below and re-submit.";

	    if (!isHeaderSet) {
	        header.append(headerText);
	        isHeaderSet = true;
	    }
	    if (adr && adr.state) fillStateIndex(adr.state);

	    if (sug && sug.length) {
	        var ulAddress = $("<ul class='address-header'>");
	        innerShell.append(ulAddress);
	        var liAddress = $("<li>").text(statusText);
	        ulAddress.append(liAddress);
	        for (var as = 0, asl = sug.length; as < asl; as += 1) {
	            var address = $("<div class=\"address\">");
	            address.html(
	                sug[as].address1 + " " + "<br />" +
	                    sug[as].address2 + " " +
	                    sug[as].city + ", " +
	                    sug[as].state + "  " +
	                    sug[as].zipcode
	            );
	            address.bind("mouseup", { "iter": as }, function (e) {
	                adr.address1.val(sug[e.data.iter].address1);
	                adr.address2.val(sug[e.data.iter].address2);
	                adr.city.val(sug[e.data.iter].city);
	                adr.state[0].selectedIndex = statesIndex[sug[e.data.iter].state.toLowerCase()];
	                adr.zipcode.val(sug[e.data.iter].zipcode);
	                self.clearAddress();
	            });

	            innerShell.append(address);
	        }
	    }

	    if (eSug && eSug.length) {
	        // Provided a divider if address errors / suggestions are present
	        if (innerShell.find("ul.address-header").length > 0) {
	            innerShell.append($("<hr class='borderdiv'>"));
	        }

	        var ulEmail = $("<ul class='email-header'>");
	        if (cfg.isSoft) ulEmail.addClass("soft");
	        innerShell.append(ulEmail);
	        var liEmail = $("<li>").text(statusText);
	        if (cfg.isSoft) {
	            var email = cfg.errorFields.email.val();
	            var errorCode = cfg.errorCode;
	            
	            // UAT FEEDBACK: Enable skip functionality without
	            // the user clicking on cross button
	            self.raiseSkipEmailNotification(errorCode, email);

	            var closeButton = $("<div class='close'></div>");
	            closeButton.bind("mouseup", {}, function (e) {
	                self.clearEmail();
	                self.raiseSkipEmailNotification(errorCode, email);
	            });
	            liEmail.append(closeButton);
	        }
	        ulEmail.append(liEmail);
	        for (var es = 0, esl = eSug.length; es < esl; es += 1) {
	            var emailDiv = $("<div class=\"email\">");
	            emailDiv.html(eSug[es].email);
	            emailDiv.bind("mouseup", { "iter": es }, function (e) {
	                emf.email.val(eSug[e.data.iter].email);
	                emf.confirmEmail.val(eSug[e.data.iter].email);
	                self.clearEmail();
	            });

	            innerShell.append(emailDiv);
	        }
	    }

	    // Check for email validation errors
	    if (cfg.emailVal) {
	        render(cfg.emailVal);
	    }
	}
	
	function autoCorrect(cfg) {
	    var sug = cfg.addressSuggestions[0],
			adr = cfg.addressFields;

	    if (adr && adr.state) fillStateIndex(adr.state);

	    adr.address1.val(sug.address1);
	    adr.address2.val(sug.address2);
	    adr.city.val(sug.city);
	    adr.state[0].selectedIndex = statesIndex[sug.state.toLowerCase()];
	    adr.zipcode.val(sug.zipcode);

	    // Check for email validation errors
	    if (cfg.emailVal) {
	        render(cfg.emailVal);
	    }
	}
	
	function getShell() {
		return $( "<div class=\"sso-outer-shell\">" )
		.append( $( "<div class=\"header\">" ).html( "<div class=\"arrow\"></div>" ) )
		.append( $( "<div class=\"inner-shell\">" ) );
	}
    
	function render(cfg) {
	    switch (cfg.type) {
	        case "success":
	            if (cfg.emailVal) render(cfg.emailVal);
	            else return;
	            break;
	        case "blank":
	            blanks(cfg);
	            break;
	        case "failure":
	        case "addressFailure":
	        case "emailFailure":
	            failures(cfg);
	            break;
	        case "suggestion":
	            suggestions(cfg);
	            break;
	        case "autoCorrect":
	            autoCorrect(cfg);
	            return; // no need to call _renderUI for autocorrect
	    }
	    self._renderUI(outerShell);
	}

	render(self._cfg);
};

PCH.SSO.DesktopUI._colorFields = function _colorFields( highlight ) {
	var field,
		erf = this._getErrorFields();
		
	for( field in erf ) {
		if( erf[ field ] ) {
			if( highlight ) {
				if( field === "dateOfBirth" ) {
					erf.dateOfBirth.month.addClass( "sso-highlight" );
					erf.dateOfBirth.day.addClass( "sso-highlight" );
					erf.dateOfBirth.year.addClass( "sso-highlight" );
				} else {
					erf[ field ].addClass( "sso-highlight" );
				}
			} else {
				if( field === "dateOfBirth" ) {
					erf.dateOfBirth.month.removeClass( "sso-highlight" );
					erf.dateOfBirth.day.removeClass( "sso-highlight" );
					erf.dateOfBirth.year.removeClass( "sso-highlight" );
				} else {
					erf[ field ].removeClass( "sso-highlight" );
				}
			}
		} else {
			throw new Error( "_colorFields(): The field that needs to be highlighted has not been passed in the config." );
		}
	}
};

PCH.SSO.DesktopUI._renderUI = function _renderUI( obj1 ) {
	var self = this;
	//isJqObjNotEmpty = PCH.SSO.utils.isJQueryObjectAndNotEmpty;
	//topElement;
	
	function scrollContainerInToView() {
		if( window.self !== window.top ) window.top.postMessage( "{\"command\":\"error_scroll\"}", "*" ); // via mr. andrew
        
        if( !self._container.is( ":visible" ) ) {
			return;
		}
        var windowTop = $( document ).scrollTop(),
			regTop = self._container.offset().top;
			
        if( windowTop <= regTop ) {
			return;
		}
        
        window.scrollTo( 0, regTop );
    }

	
	function getTopPos() {
		var highNum = 50000,
			topElement;
		
		for( var field in self._getErrorFields() ) {
			if( self._getErrorFields()[ field ] ) {
				if( field === "dateOfBirth" ) {
					topElement = ( function( f ) {
						var highNum = 5000,
						topElement;
						for( var field in f ) {
							if( f[ field ].offset().top < highNum ) {
								topElement = f[ field ];
								highNum = f[ field ].offset().top;
							}
						}
						return topElement;
					} )( self._getErrorFields()[ field ] );
				} else {
					if( self._getErrorFields()[ field ].offset().top < highNum ) {
						topElement = self._getErrorFields()[ field ];
						highNum = self._getErrorFields()[ field ].offset().top;
					}
				}
			} else {
				throw new Error( "_renderUI() > getTopPos(): The field you are trying to check height on has not been passed in the config." );
			}
		}

		return ( $( "html" ).hasClass( "sso-lightbox" ) ) ? topElement.offset().top - $( window ).scrollTop() : topElement.offset().top;
	}
	
	function getLeftPos() {
		var tempValue;
		if( self._container ) {
			tempValue = self._container.offset().left + self._container.outerWidth();
		} else {
			throw new Error( "_renderUI() > getLeftPos(): You have not passed in a container element." );
		}
		return tempValue;
		//return topElement.offset().left + topElement.outerWidth() + 10;	
	}
	
	this._colorFields( true );
	scrollContainerInToView();
	$( "body" ).append( obj1 );
	obj1.css( "top", getTopPos() + "px" );
	obj1.css( "left", getLeftPos() + "px" );
	obj1.fadeIn( "400" );
};

PCH.SSO.DesktopUI.clear = function clear() {
	var self = this;
	this._colorFields( false );
	if( this._me ) {
		this._me.fadeOut( "400", function( e ) {
		    $(self._me).remove();
			self._me = null;
		} );
		//var sel = "div." + this._me.attr( "class" );		
		//this._me.parent().remove( sel );
	}
};

PCH.SSO.DesktopUI.clearAddress = function clearAddress() {
    var self = this;
    if (!self._me) return;

    //  Is email validation present?
    if (!self._cfg.emailVal || self._cfg.emailVal.type === "success") {
        // If not, simply clear out everything
        self.clear();
        return;
    }

    // Clear out only the address section
    self._colorFields(false);
    var addressElements = $(self._me).find(".address,.address-header,.borderdiv");
    var fadeOutCount = 0, fadeOutMax = addressElements.length;
    addressElements.fadeOut("400", function () {
        $(this).remove();

        // Move the email section to the proper place
        // But render only once
        fadeOutCount++;
        if (fadeOutCount == fadeOutMax) { // If this is the last item being faded out
            self._cfg.type = "success";
            self._cfg.errorFields = []; // clear out address errors
            self._renderUI(self._me);
        }
    });
};

PCH.SSO.DesktopUI.clearEmail = function clearEmail() {
    var self = this;
    if (!self._me) return;

    //  Is address validation present?
    if (!self._cfg || self._cfg.type === "success" || self._cfg.type === "autoCorrect") {
        // If not present, simply clear out everything
        self.clear();
        return;
    }

    // Otherwise, clear out only the email section
    self._colorFields(false);
    var emailElements = $(self._me).find(".email,.email-header,.borderdiv");
    var fadeOutCount = 0, fadeOutMax = emailElements.length;
    emailElements.fadeOut("400", function () {
        $(this).remove();

        // Move the address section to the proper place
        // But render only once
        fadeOutCount++;
        if (fadeOutCount == fadeOutMax) { // If this is the last item being faded out
            // Recolor error fields
            if (self._cfg.emailVal) {
                self._cfg.emailVal.type = "success";
                self._cfg.emailVal.errorFields = []; // clear out email errors
            }
            self._colorFields(true);
        }
    });
};

PCH.SSO.DesktopUI.raiseSkipEmailNotification = function raiseSkipEmailNotification(errorCode, email) {
    this._controller._raiseSkipEmailNotification(errorCode, email);
};

PCH.SSO.Controller._addUiModule( {
	name: "desktop",
	module: PCH.SSO.DesktopUI
} );

( function( g, ns ) {
    /*
     * use the strict js engine
     */
    "use strict";
    
    /*
     * my internal globals
     */
    var d = g.document;
    
    
    /*
     * util function for object creation
     */
    function object( o ) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    
    
    /*
     * util function for prototype stealing
     */
    function inheritPrototype( subType, superType ) {
        var prototype = object( superType.prototype );
        prototype.constructor = subType;
        subType.prototype = prototype;
    }
    
    
    /*
     * get the absolute Y pos from the window origin
     */
    function getPos( elm ) {
        var y = 0,
            x = 0,
            elmCopy = elm;
            
        if( elmCopy.offsetParent ) {	
            do {
                y += elmCopy.offsetTop;	
                x += elmCopy.offsetLeft;
            } while( elmCopy = elmCopy.offsetParent );
        }
        return { x: x, y: y };
    }
    
    
    /*
     * constructor sets the properties
     */
    function SpecialAlert( elements, statusMessage, message, fields, button ) {
        this.elements = elements;
        this.statusMessage = statusMessage;
        this.message = message;
        this.fields = fields;
        this.button = button;
        this.domSelf;
        this.init();
    }
    
    
    /*
     * define all prototype methods
     */
    SpecialAlert.prototype = {
    
        /*
         * kick off everything
         */
        init: function() {
            this.create();
            this.insert();
            this.colorFields( true );
        },
        create: function() {},
        setMessage: function() {},
        setPosition: function() {},
        umFunc: function() {
            g.alert( "ash stop messing around!" );
        },
        
         
        /*
         * insert the alert into the page and make it appear using various methods
         */
        insert: function() {
            d.body.appendChild( this.domSelf );
            this.setPosition();
            if( g.jQuery ) {
                $( this.domSelf ).fadeIn( 400 );
            } else if( g.Zepto ) {
                $( this.domSelf ).animate( { opacity: 100 }, 400, "ease-in" );
            } else {
                this.domSelf.style.opacity = "1";
                this.domSelf.style.display = "block";
                this.domSelf.style.visibility = "visible";
            }  
        },
     
     
        /*
         * color the fields or remove the color from the fields
         */
        colorFields: function( bool ) {
            var i = 0,
                elms = this.elements,
                f = this.fields,
                fl = this.fields.length;
            
            if( bool ) {
                for( ; i < fl; i += 1 ) {
                    elms[ f[ i ] ].addClass( "sso-highlight-special" );
                }    
            } else {
                for( ; i < fl; i += 1 ) {
                    elms[ f[ i ] ].removeClass( "sso-highlight-special" );
                } 
            }
        },
         
        
        /*
         * remove the alert from the page and make it disappear using various methods
         */
        destroy: function() {
            if( g.jQuery ) {
                $( this.domSelf ).fadeOut( 400, ( function( context ) { return function() { context.remove(); } }( this ) ) );
            } else if( g.Zepto ){
                $( this.domSelf ).animate( { opacity: 0 }, 400, "ease-out", ( function( context ) { return function() { context.remove(); } } ( this ) ) );
            } else {
                this.domSelf.style.display = "none";
                this.remove();
            }
            this.colorFields( false );
        },
        
              
        /*
         * alias to destroy for the controller which calls clear not destroy
         */
        clear: function() {
            this.destroy();
        },


        /*
         * remove the alert from the dom
         */
        remove: function() {
            if( this.domSelf ) {
                this.domSelf.parentNode.removeChild( this.domSelf );
            }
        }
    };


    /*
     * add the alert object to the passed namespace
     * add the utils to SSO.utils
     */
    if ( typeof ns === "object" ) {
        ns.SpecialAlert = SpecialAlert;
        
        // add them to the utils object
        ns.utils.object = object;
        ns.utils.inheritPrototype = inheritPrototype;
        ns.utils.getPos = getPos;
    }

} ( this, PCH.SSO ) );

( function( g, ns ) {
    /*
     * use the strict js engine
     */
    "use strict";
    
    /*
     * my internal globals
     */
    var d = g.document,
        utils = ns.utils;


    /*
     * constructor
     * calls the super classes constructor
     */
    function SpecialAlertDesktop( elements, statusMessage, message, fields, button ) {
        //console.info( this );
        // like calling super()
        ns.SpecialAlert.call( this, elements, statusMessage, message, fields, button );
    }


    /*
     * inheritence (parasitic combination pattern)
     */
    ns.utils.inheritPrototype( SpecialAlertDesktop, ns.SpecialAlert );


    /*
     * create all the dom elements and assign classes
     */
    SpecialAlertDesktop.prototype.create = function() {
        var outerShell = this.domSelf = d.createElement( "div" ),
            header = d.createElement( "div" ),
            arrow = d.createElement( "div" ),
            innerShell = d.createElement( "div" );
        
        // this is for spectrum
        (function scrollContainerInToView() {
            var windowTop = $( d ).scrollTop(),
                container = this.elements.container,
                regTop = container.position().top;

            if( !container.is( ":visible" ) ) {
                return;
            }
                
            if( windowTop <= regTop ) {
                return;
            }
            
            g.scrollTo( 0, regTop );
        }).call( this );
        // this is for spectrum

        outerShell.className = "sso-outer-shell special-alert"; // works in IE7
        header.className = "header";
        arrow.className = "arrow";
        innerShell.className = "inner-shell";
        
        header.appendChild( arrow );
        outerShell.appendChild( header );
        outerShell.appendChild( innerShell );
        
        this.setMessage( header, innerShell );
    };


    /*
     * set all text in the alert box
     * make button if needed based on config options
     */
    SpecialAlertDesktop.prototype.setMessage = function( header, body ) {
        var statusText = d.createTextNode( this.statusMessage ),
            bodyText = d.createElement( "div" ),
            buttonText,
            button;
        
        bodyText.className = "warning";
        bodyText.innerHTML = this.message;
            
        header.appendChild( statusText );
        body.appendChild( bodyText );
        
        if( this.button ) {
            button = d.createElement( "button" );
            buttonText = d.createTextNode( this.button.text )
            button.appendChild( buttonText );
            body.appendChild( button );
            button.onclick = ( function( context ) {
                return function() {
                    //context.destroy();
                    context.button.callback();
                }
            }( this ) );
        }
    };


    /*
     * set the position of the alert
     */
    SpecialAlertDesktop.prototype.setPosition = function() {
        var originYelement = this.elements[ this.fields[ 0 ] ][ 0 ],
            originXelement = this.elements.container[ 0 ],
            YOFFSET = -5;
        
        this.domSelf.style.top = utils.getPos( originYelement ).y + "px";
        this.domSelf.style.left = utils.getPos( originXelement ).x + originXelement.offsetWidth + "px";
    };


    /*
     * add the alert object to the passed namespace
     */ 
    if( typeof ns === "object" ) {
        ns.SpecialAlertDesktop = SpecialAlertDesktop;
    }

}( this, PCH.SSO ) );
( function( g, ns ) {
     /*
     * use the strict js engine
     */
    "use strict";
    
    /*
     * my internal globals
     */
    var d = g.document,
        utils = ns.utils,
        //hidnfldslbls = $('label[for=CI],label[for=ST],label[for=A2]');
        
        // nagesh added code for 2-step on mobile
        hidnfldslbls = $('label[for=CI],label[for=ST],label[for=A2],p[for=CI],p[for=ST],p[for=A2]');
    /*
     * constructor
     * calls the super classes constructor
     */
    // show fields if both inputs ( address1 and zip ) have values and populate the respective inputs r = response
    function showCityState( r ) {
        var el = this._elements;
        if (r && r.IsValid) {
            el.address1.val(r.AddressLine1);
            el.address2.val(r.AddressLine2);
            el.city.val(r.City);
            el.state.val(r.State);
        }

        if (!r) { // when the API switch is OFF (simply show the fields)
            el.state.show();
            el.city.show();
            el.address2.show();
        }
        else { // When API call comes back, but the result may not be valid
            el.state.slideDown("fast", function () {
                $(this).removeAttr('style').show();
                el.city.slideDown("fast", function () {
                    $(this).removeAttr('style').show();
                    el.address2.slideDown("fast", function () {
                        $(this).removeAttr('style').show();
                    });
                });
            });
        }
        hidnfldslbls.css({ 'height': '1px', 'display': 'block' }).animate({ height: 14 });
    }
    /*
     * add the show citystate object to the passed namespace
     */ 
    if( typeof ns === "object" ) {
        ns.showCityState = showCityState;
    }

}( this, PCH.SSO.Controller ) );