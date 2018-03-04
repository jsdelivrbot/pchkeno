var PCHMINIBOOTSTRAP = PCHMINIBOOTSTRAP || {};
if (typeof PCHMINIBOOTSTRAP.ssouserBaseURL === "undefined") PCHMINIBOOTSTRAP.ssouserBaseURL = "";

// 2015-07-09 hack for central login pages effort - Rob
// This would be defined elsewhere in central project to use new
// api url, but this condition would be removed completely at project
// completion as ssoproxy url would not be used anymore.
// Hardcoded instances of /ssoproxy in below functions have been replaced
// with PCH.ssoApiUrl variable
var PCH = PCH || {};
if (!PCH.ssoApiUrl) {
	PCH.ssoApiUrl = '/ssoproxy';
}

// @TODO: enable/disbale login button
/**
 * The object will handle below functions login, create password, forgot
 * password, reset password, register comming soon
 */

// @TODO: move this to individual view
PCH.controllerList = [];
var PCHSSO = function() {
	obj = this;

	obj.clearErrors = function() {
		//Loop for all controllers
		for(i=0;i<PCH.controllerList.length;i++)
			PCH.controllerList[i].clearErrors();
		PCH.controllerList = [];
	};

	obj.error = function(str) {
		if (window.console) {
			window.console.log(str);
		}
	}
	//clear any errors
	obj.clearErrors();

	//dependencies.
	//PCH
	if(typeof PCH == 'undefined'){
		obj.error("PCH object is required on the Page");
		return false;
	}

	//PCH.app
	if(typeof PCH.app == 'undefined'){
		obj.error("Appcode is required to be defined in PCH object");
		return false;
	}

	//PCH.ssoui
	if(typeof PCH.ssoui == 'undefined'){
		obj.error("ssoui is required to be defined in PCH object");
		return false;
	}

	//PCH.secure_url
	if(typeof PCH.secure_url == 'undefined'){
		obj.error("secure_url is required to be defined in PCH object");
		return false;
	}
	//PCH.SSO.Controller
	if(typeof PCH.SSO == 'undefined'){
		obj.error("SSO is required with Controller");
		return false;
	}

	/**
	 * element: elements needed for login functionality
	 * cb: Success callback function
	 * fcb: Failure callback function
	 * acb: Analytics callback function
	 */
	obj.login = function(elements, cb , fcb, gaTag) {
		//clear any errors first
		obj.clearErrors();
		//required parameters
		var container, email, password, persist;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}
		if (typeof fcb !== 'function') {
			obj.error("Failure Callback function ->" + fcb);
			obj.error("Invalid Failure callback function");
			return false;
		}


		/**
		 * @TODO: Check for failure callback function
		 */


		if (typeof elements.container == 'undefined'
				|| typeof elements.email == 'undefined'
				|| typeof elements.password == 'undefined'
				|| typeof elements.persist == 'undefined') {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			email = elements.email;
			password = elements.password;
			persist = elements.persist;
		}

		// lets create SSO controller.
		obj.login.loginController = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.login.loginController);

		obj.login.loginController.init({
			"elements" : {
				"container" : container,
				"email" : email,
				"password" : password
			},
			"proxy" : {
				"login" : function login(json) {
					obj.login.loginController.showLoaderGraphic(true);
					json.Persist = persist;
					var req = {
						obj : JSON.stringify(json)
					};
					$.ajax({
						type : "GET",
						url : PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+ PCH.ssoApiUrl+"/login?app=" + PCH.app,
						contentType : "application/json; charset=utf-8",
						dataType : "jsonp",
						data : req,
						jsonpCallback : 'cor',
						success : function(data) {
							obj.login.loginController.showLoaderGraphic(false);
							if (data.result === undefined) {
								var response = data.ValidationResponses;
								obj.response = data;
								obj.login.response = "";
								if(data.MemberDetailStatusResponse != null){
									//store the response. This will be given back to the cb function. The application that initiated the call
									obj.login.response = data.MemberDetailStatusResponse.MemberDetailResponse;
								}
								obj.login.loginController.onLogin(response);
							}
						}
					});
				},
				"performAnalytics" : function(tag) {
					obj.fireGATag(gaTag, 'performAnalytics', tag);
				},
				"redirect" : function(url) {
					if (typeof url !== "undefined") {
						window.location.href = url;
					}
					return false;
				}
			},
			"ui" : PCH.ssoui,
			"loadingGraphic" : container.find("img.loader-icon"),
			"success" : function() {
				obj.fireGATag(gaTag, 'success');
				//obj.login.loginController.showLoaderGraphic(false);
				cb(obj.response);

			},
			"failure" : function() {
				obj.fireGATag(gaTag, 'failure');
				//PCHSSOProxy.loginInProgress = false;
				//obj.login.loginController.showLoaderGraphic(false);
				fcb();
			},
			"env" : PCH.env
		});

		//SSO controller is initialized above. Now lets fire the login event.
		obj.login.loginController.login();
	}

	obj.updateMyAccount = function(elements, cb, fcb, gaTag){
		var errors = false;
		//remove any errors
		obj.clearErrors();
		if(typeof cb != 'function'){
			obj.error("Callback function required for updating my account info");
			return false;
		}

		//lets check elements
		// @TODO: optimise. Instead of setting each property, there should be an array to loop through
		if(typeof elements.container == 'undefined'){
			obj.error("container should be defined");
			return false;
		}
		if(typeof elements.title == 'undefined'){
			obj.error("Title should be defined");
			return false;
		}
		if(typeof elements.firstName == 'undefined'){
			obj.error("firstName should be definied");
			return false;
		}
		if(typeof elements.lastName == 'undefined'){
			obj.error("lastName should be definied");
			return false;
		}
		if(typeof elements.address1 == 'undefined'){
			obj.error("address 1 should be definied");
			return false;
		}
		if(typeof elements.address2 == 'undefined'){
			obj.error("address 2 should be definied");
		}
		if(typeof elements.city == 'undefined'){
			obj.error("city should be definied");
		}
		if(typeof elements.state == 'undefined'){
			obj.error("state should be definied");
		}
		if(typeof elements.zipcode == 'undefined'){
			obj.error("zipcode should be definied");
		}
		if(typeof elements.month == 'undefined'){
			obj.error("month should be definied");
		}
		if(typeof elements.day == 'undefined'){
			obj.error("day should be definied");
		}
		if(typeof elements.year == 'undefined'){
			obj.error("year should be definied");
		}
		if(typeof elements.persist == 'undefined'){
			obj.error("Persist flag should defined");
		}

		//var elementsList = ['container','title','firstName','lastName','address1','address2','city','state','zipcode','month','day','year'];
		//var element_length = elementsList.length;
		//console.log(elements);
		//for(var i=0; i < element_length; i++){
			// @TODO: have option of adding optional elements
			//console.log(elementsList[i]);
			//console.log(elements.elementsList[i]);
			//errors = true;
			//var x = elementsList[i];
			//console.log(elements.x);
			//if(typeof elements.x == 'undefined'){
			//	obj.error(elementsList[i] + " is required in the list of elements");
			//	errors = true;
			//	return false; // @TODO: which is good.. return false, or break?
			//	break;
			//}
		//}


			obj.updateMyAccount.controller = Object.create(PCH.SSO.Controller);
			PCH.controllerList.push(obj.updateMyAccount.controller);
			obj.updateMyAccount.controller.init({
				"elements": {
					"container": elements.container,
					"title": elements.title,
					"firstName": elements.firstName,
					"lastName": elements.lastName,
					"address1": elements.address1,
					"address2": elements.address2,
					"city": elements.city,
					"state": elements.state,
					"zipcode": elements.zipcode,
					"month": elements.month,
					"day": elements.day,
					"year": elements.year

				},
				"proxy": {
					"update": function update(json){
						// @TODO: add Persist flag
						obj.updateMyAccount.controller.showLoaderGraphic(true);
						if($('#RM').length > 0){
							var persist = $('#RM').is(":checked");
							json.Persist = persist;
						}
						var req = {
							obj : JSON.stringify(json)
						};
						$.ajax({
							type : "GET",
							url : PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+ PCH.ssoApiUrl+"/updateAccount",
							contentType : "application/json; charset=utf-8",
							dataType : "jsonp",
							data : req,
							jsonpCallback : 'cor',
							success : function(data) {
								if (data.result === undefined) {
									var response = data.ValidationResponses;

									if(data.MemberDetailStatusResponse != null){
										obj.response = data.MemberDetailStatusResponse.MemberDetailResponse;
									}
									obj.updateMyAccount.controller.onUpdate(response);
								} else if (data.result == 419) {
									window.location.href = loginUrl; // @TODO: add dependencies
									return false;
								}
							}
						});

					},
					"performAnalytics" : function(tag) {
						obj.fireGATag(gaTag, 'performAnalytics', tag);
					},
					"logout": function (cb){
						obj.logout(cb);
					}
				},
				"loadingGraphic":elements.container.find("img.loader-icon"),
				"ui": PCH.ssoui,
				"success": function(){
					obj.fireGATag(gaTag, 'success');
					cb(obj.response); //passing the updated member details back
				},
				"failure": function(){
					obj.fireGATag(gaTag, 'failure');
					fcb();
				},
				"env": PCH.env
			});
			obj.updateMyAccount.controller.update();
	}

	obj.createPassword = function(elements, cb, fcb, gaTag){
		var container, password, confirmPassword, persist;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		if (typeof elements.container == 'undefined'
				|| typeof elements.password == 'undefined'
				|| typeof elements.confirmPassword == 'undefined'
				|| typeof elements.persist == 'undefined') {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			password = elements.password;
			confirmPassword = elements.confirmPassword;
			persist = elements.persist;
		}

		obj.createPassword.controller = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.createPassword.controller);
		obj.createPassword.controller.init({
			//var controller = new PCH.SSO.Controller({
				"elements" : {
					"container": container,
					"password": password,
					"confirmPassword": confirmPassword
				},
				"proxy": {
						"createPassword": function(json){
							//set flag to say password creation is going on
							//PCHSSOProxy.createPasswordInProgress = true;

							//obj.createPasswordController.showLoaderGraphic( true );
							json.Persist = persist;

							if(typeof elements.gameId != 'undefined'){
								json.gameId = elements.gameId;
							}

							// @TODO: Remove the legacy game return value param
							if(typeof game_return_value != 'undefined'){
								json.GameReturnValue = game_return_value;
							}


							var req = {obj:JSON.stringify(json)};
							$.ajax({
								  type: "GET",
								  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/createpassword",
								  contentType: "application/json; charset=utf-8",
								  dataType: "jsonp",
								  data: req,
								  jsonpCallback: 'cor',
								  success: function(data){
									  //obj.createPassword.controller.showLoaderGraphic( false );
									  if(data.result === undefined){
											var response = data.ValidationResponses;
											obj.createPassword.controller.onCreatePassword(response);
									  }
								  }
								});
						},
						"performAnalytics" : function(tag) {
							obj.fireGATag(gaTag, 'performAnalytics', tag);
						},
						"redirect" : function (url) {
							if(typeof url !== "undefined"){
								window.location.href = url;
							}
							return false;
						}
			    },
			    "loadingGraphic": container.find( "img.loader-icon" ),
				"ui":PCH.ssoui,
				"success": function(){
					//obj.createPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'success');
					cb();
				},
				"failure": function (){
					//obj.createPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'failure');
					fcb();
				},
				"env":PCH.env
			});

		obj.createPassword.controller.createPassword();
	}

	obj.resetPassword = function(elements, cb, fcb,gaTag){
		var container, password, confirmPassword, persist;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		if (typeof elements.container == 'undefined'
				|| typeof elements.password == 'undefined'
				|| typeof elements.confirmPassword == 'undefined'
				|| typeof elements.persist == 'undefined'
				|| typeof elements.gmt == 'undefined'
				|| typeof elements.access_code == 'undefined'
				|| typeof elements.ct == 'undefined') {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			password = elements.password;
			confirmPassword = elements.confirmPassword;
			persist = elements.persist;
			gmt = elements.gmt;
			access_code = elements.access_code;
			ct = elements.ct;
		}

		obj.resetPassword.controller = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.resetPassword.controller);
		obj.resetPassword.controller.init({
			//var controller = new PCH.SSO.Controller({
				"elements" : {
					"container": container,
					"password": password,
					"confirmPassword": confirmPassword
				},
				"proxy": {
						"resetPassword": function(json){
							//set flag to say password creation is going on
							//PCHSSOProxy.resetPasswordInProgress = true;

							//obj.resetPasswordController.showLoaderGraphic( true );
							json.Persist = persist;
							json.GMT = gmt;
							json.AC = access_code;
							json.CT	= ct;

							var req = {obj:JSON.stringify(json)};
							$.ajax({
								  type: "GET",
								  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/resetpassword",
								  contentType: "application/json; charset=utf-8",
								  dataType: "jsonp",
								  data: req,
								  jsonpCallback: 'cor',
								  success: function(data){
									  //obj.resetPassword.controller.showLoaderGraphic( false );
									  if(data.result === undefined){
											var response = data.ValidationResponses;
											obj.resetPassword.controller.onResetPassword(response);
									  }
								  }
								});
						},
						"performAnalytics" : function(tag) {
							obj.fireGATag(gaTag, 'performAnalytics', tag);
						},
						"redirect" : function (url) {
							if(typeof url !== "undefined"){
								window.location.href = url;
							}
							return false;
						}
			    },
			    "loadingGraphic": container.find( "img.loader-icon" ),
				"ui":PCH.ssoui,
				"success": function(){
					//obj.resetPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'success');
					cb();
				},
				"failure": function (){
					//obj.resetPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'failure');
					fcb();
				},
				"env":PCH.env
			});

		obj.resetPassword.controller.resetPassword();
	}

	obj.setPassword = function(elements, cb, fcb,gaTag){
		var container, password, confirmPassword, persist;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		if (typeof elements.container == 'undefined'
				|| typeof elements.password == 'undefined'
				|| typeof elements.confirmPassword == 'undefined'
				|| typeof elements.persist == 'undefined'
				|| typeof elements.gmt == 'undefined'
				|| typeof elements.access_code == 'undefined'
				|| typeof elements.ct == 'undefined') {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			password = elements.password;
			confirmPassword = elements.confirmPassword;
			persist = elements.persist;
			gmt = elements.gmt;
			access_code = elements.access_code;
			ct = elements.ct;
		}

		obj.setPassword.controller = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.setPassword.controller);
		obj.setPassword.controller.init({
			//var controller = new PCH.SSO.Controller({
				"elements" : {
					"container": container,
					"password": password,
					"confirmPassword": confirmPassword
				},
				"proxy": {
						"createPassword": function(json){
							//set flag to say password creation is going on
							//PCHSSOProxy.resetPasswordInProgress = true;

							//obj.resetPasswordController.showLoaderGraphic( true );
							json.Persist = persist;
							json.GMT = gmt;
							json.AC = access_code;
							json.CT	= ct;

							var req = {obj:JSON.stringify(json)};
							$.ajax({
								  type: "GET",
								  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/setpassword",
								  contentType: "application/json; charset=utf-8",
								  dataType: "jsonp",
								  data: req,
								  jsonpCallback: 'cor',
								  success: function(data){
									  //obj.resetPassword.controller.showLoaderGraphic( false );
									  if(data.result === undefined){
											var response = data.ValidationResponses;
											obj.setPassword.controller.onCreatePassword(response);
									  }
								  }
								});
						},
						"performAnalytics" : function(tag) {
							obj.fireGATag(gaTag, 'performAnalytics', tag);
						},
						"redirect" : function (url) {
							if(typeof url !== "undefined"){
								window.location.href = url;
							}
							return false;
						}
			    },
			    "loadingGraphic": container.find( "img.loader-icon" ),
				"ui":PCH.ssoui,
				"success": function(){
					//obj.resetPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'success');
					cb();
				},
				"failure": function (){
					//obj.resetPassword.controller.showLoaderGraphic( false );
					obj.fireGATag(gaTag, 'failure');
					fcb();
				},
				"env":PCH.env
			});

		obj.setPassword.controller.createPassword();
	}

	obj.forgotPassword = function(elements, cb, fcb, gaTag){
		//clear any errors first
		obj.clearErrors();
		//required parameters
		var container, email;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		/**
		 * @TODO: Check for failure callback function
		 */


		if (typeof elements.container == 'undefined'
				|| typeof elements.email == 'undefined'
				) {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			email = elements.email;
		}

		// lets create SSO controller.
		obj.forgotPassword.forgotPasswordController = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.forgotPassword.forgotPasswordController);

		obj.forgotPassword.forgotPasswordController.init({
			"elements" : {
				"container" : container,
				"email" : email
			},
			"proxy" : {
				"forgotPassword" : function forgotPassword(json) {
					var req = {obj:JSON.stringify(json)};
					$.ajax({
						  type: "GET",
						  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/forgotpassword"+"?app="+PCH.app,
						  contentType: "application/json; charset=utf-8",
						  dataType: "jsonp",
						  data: req,
						  jsonpCallback: 'cor',
						  success: function(data){
							  if(data.result === undefined){
									var response = data.ValidationResponses;
									obj.forgotPassword.forgotPasswordController.onForgotPassword(response);
								}else{
									fcb();
								}
						  }
						});
				},
				"performAnalytics" : function(tag) {
					obj.fireGATag(gaTag, 'performAnalytics', tag);
				},
				"redirect" : function(url) {
					if (typeof url !== "undefined") {
						window.location.href = url;
					}
					return false;
				}
			},
			"ui" : PCH.ssoui,

			"success" : function() {
				// obj.forgotPassword.forgotPasswordController.showLoaderGraphic( false );
				obj.fireGATag(gaTag, 'success');
				cb();

			},
			"failure" : function() {
				// obj.forgotPassword.forgotPasswordController.showLoaderGraphic( false );
				obj.fireGATag(gaTag, 'failure');
				fcb();
			},
			"env" : PCH.env
		});

		//SSO controller is initialized above. Now lets fire the forgotpassword event.
		obj.forgotPassword.forgotPasswordController.forgotPassword();
	};

	obj.mandatePassword = function(elements, cb, fcb, gaTag){
		//clear any errors first
		obj.clearErrors();
		//required parameters
		var container, email;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		/**
		 * @TODO: Check for failure callback function
		 */


		if (typeof elements.container == 'undefined'
				|| typeof elements.email == 'undefined'
				) {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			email = elements.email;
		}

		// lets create SSO controller.
		obj.mandatePassword.mandatePasswordController = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.mandatePassword.mandatePasswordController);

		obj.mandatePassword.mandatePasswordController.init({
			"elements" : {
				"container" : container,
				"email" : email
			},
			"proxy" : {
				"forgotPassword" : function forgotPassword(json) {
					var req = {obj:JSON.stringify(json)};
					$.ajax({
						  type: "GET",
						  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/mandatepassword"+"?app="+PCH.app,
						  contentType: "application/json; charset=utf-8",
						  dataType: "jsonp",
						  data: req,
						  jsonpCallback: 'cor',
						  success: function(data){
							  if(data.result === undefined){
									var response = data.ValidationResponses;
									obj.mandatePassword.mandatePasswordController.onForgotPassword(response);
								}else{
									fcb();
								}
						  }
						});
				},
				"performAnalytics" : function(tag) {
					obj.fireGATag(gaTag, 'performAnalytics', tag);
				},
				"redirect" : function(url) {
					if (typeof url !== "undefined") {
						window.location.href = url;
					}
					return false;
				}
			},
			"ui" : PCH.ssoui,

			"success" : function() {
				obj.fireGATag(gaTag, 'success');
				cb();

			},
			"failure" : function() {
				obj.fireGATag(gaTag, 'failure');
				fcb();
			},
			"env" : PCH.env
		});

		//SSO controller is initialized above. Now lets fire the forgotpassword event.
		obj.mandatePassword.mandatePasswordController.forgotPassword();
	};

	obj.checkPassword = function(elements, cb, fcb, gaTag){
		//clear any errors first
		obj.clearErrors();
		//required parameters
		var container, email;

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		/**
		 * @TODO: Check for failure callback function
		 */
		if (typeof elements.container == 'undefined'
				|| typeof elements.email == 'undefined'
				) {
			obj.error(elements);
			obj.error("Incomplete elements passed");
			return false;
		} else {
			container = elements.container;
			email = elements.email;
		}

		// lets create SSO controller.
		obj.checkPassword.checkPasswordController = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.checkPassword.checkPasswordController);

		obj.checkPassword.checkPasswordController.init({
			"elements" : {
				"container" : container,
				"email" : email
			},
			"proxy" : {
				"forgotPassword" : function forgotPassword(json) {
					var req = {obj:JSON.stringify(json)};
					$.ajax({
						  type: "GET",
						  url: PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/checkpassword"+"?app="+PCH.app,
						  contentType: "application/json; charset=utf-8",
						  dataType: "jsonp",
						  data: req,
						  jsonpCallback: 'cor',
						  success: function(data){
							  if(data.IsPasswordExist === true){
								  cb();
							  }else{
								  fcb();
							  }
						  }
						});
				},
				"performAnalytics" : function(tag) {
					obj.fireGATag(gaTag, 'performAnalytics', tag);
				},
				"redirect" : function(url) {
					if (typeof url !== "undefined") {
						window.location.href = url;
					}
					return false;
				}
			},
			"ui" : PCH.ssoui,

			"success" : function() {
				obj.fireGATag(gaTag, 'success');
				cb();

			},
			"failure" : function() {
				obj.fireGATag(gaTag, 'failure');
				fcb();
			},
			"env" : PCH.env
		});

		//SSO controller is initialized above. Now lets fire the forgotpassword event.
		obj.checkPassword.checkPasswordController.forgotPassword();
	};

	obj.logout = function(cb) {
		$.get( PCH.ssoApiUrl+"/logout?callback=callback", function() {
			if(typeof cb == 'function'){
				cb();
			}
		} );
	};

	/***************************PCH SSO GA Tag Function*********************************/
	obj.fireGATag = function(gaTag, gaTagType, tag) {
		if (typeof gaTagType == 'undefined') {
				obj.error("Invalid GA Tag Type Passed");
				return false;
		}
		switch(gaTagType){
			case 'success' :
			case 'failure':
				if (typeof gaTag.category == 'undefined' ||
					typeof gaTag.label == 'undefined' ||
					typeof gaTag[gaTagType+'Action'] == 'undefined') {
					obj.error("Invalid GA Tag Category/Label Passed");
					return false;
				}
				if(typeof PCHGA !== 'undefined'){
					PCHGA.trackEvent(gaTag.category, gaTag[gaTagType+'Action'], gaTag.label);
				}
				break;
			case 'performAnalytics':
				if(typeof tag.reason == 'undefined' ){
					obj.error("Invalid Tag Reason passed for GA Tag");
					return false;
				}
				if (tag.reason == 'failure') {
					if(typeof tag.errorCode == 'undefined' ){
						obj.error("Invalid Tag Error Code passed for GA Tag");
						return false;
					}
					if(typeof PCHGA !== 'undefined'){
						PCHGA.trackVirtualPageView(document.title,tag.errorCode);
					}
				} else {
					if(typeof PCHGA !== 'undefined'){
						PCHGA.trackVirtualPageView(document.title,tag.reason);
					}
				}
				tag.success();
				break;
			default:
				break;
		}
		return;
	};

	obj.register = function(elements, cb, fcb, gaTag) {

		obj.clearErrors();

		var optin, optins, container,
			properties = {
				container: null,
				title: null,
				firstName: null,
				lastName: null,
				address1: null,
				address2: null,
				month: null,
				day: null,
				year: null,
				city: null,
				state: null,
				zipcode: null,
				email: null,
				confirmEmail: null,
				password: null,
				confirmPassword: null,
				optin: null
			};

		if (typeof elements !== 'object') {
			obj.error("Elements -> " + elements);
			obj.error("Invalid Elements");
			return false;
		}

		if (typeof cb !== 'function') {
			obj.error("Callback function ->" + cb);
			obj.error("Invalid callback function");
			return false;
		}

		if (typeof fcb !== 'function') {
			obj.error("Callback function ->" + fcb);
			obj.error("Invalid callback function");
			return false;
		}

		for (var prop in properties) {
			// dob may not be required for some properties
			if (!~['month', 'day', 'year'].indexOf(prop)) {
				if (typeof elements[prop] == 'undefined') {
					obj.error(elements);
					obj.error("Incomplete elements passed");
					return false;
				}
			}

			properties[prop] = elements[prop];
		}

	    container = elements.container;
	    optins = elements.optin;

	    if (obj.register.registerInProgress == true) return;
	    obj.register.registerController = Object.create(PCH.SSO.Controller);
		PCH.controllerList.push(obj.register.registerController);

        var emailErrorSuppression = false;

        obj.register.registerController.init({
            "elements": properties,
            "optins": optins,
            "proxy" : {
                "register" : function register(json) {
                    if(typeof PCH.ExtTicket != 'undefined'){
                        json.ExtTicket = PCH.ExtTicket;
                    }
                    obj.register.registerInProgress = true;
                    PCHUSER.email = elements.email.val(); //why
                    var persist = elements.persist;
                    obj.register.registerController.showLoaderGraphic( true );
                    json.Persist = persist;
                    if (emailErrorSuppression) {
                        json.EmailErrorSuppression = emailErrorSuppression;
                        emailErrorSuppression = false;
                    }
                    var req = {
                        obj : JSON.stringify(json)
                    };
                    $.ajax({
                        type : "GET",
                        url : PCH.secure_url+PCHMINIBOOTSTRAP.ssouserBaseURL+PCH.ssoApiUrl+"/register?app="+PCH.app,
                        contentType : "application/json; charset=utf-8",
                        dataType : "jsonp",
                        data : req,
                        jsonpCallback : 'cor',
                        success : function(data) {
                            obj.register.registerController.showLoaderGraphic( false );
                            obj.register.successCallBack(data);
                        }
                        //error: function(response, status, errorThrown) {
                        //	window.location="index.php?option=pagenotfound";
                        //}
                    });
                },
                "logout": function (cb){
                    obj.logout(cb);
                },
                "performAnalytics" : function (tag) {
                	obj.fireGATag(gaTag, 'performAnalytics', tag);

                    if (tag.reason == 'failure')
                        PCHGA.trackVirtualPageView('register', tag.errorCode, obj.register.pchTrackCallBack, tag);
                    else
                        PCHGA.trackVirtualPageView('register', tag.reason, obj.register.pchTrackCallBack, tag);
                },
                "redirect" : function (url) {
                    if(typeof url == "undefined") return false;
                    if(typeof redirectCallback == 'function'){
                        redirectCallback(url);
                    }else{
                        // if(PCHSSOLightbox.failureRedirectURL){
                        //     url = url + "?r=" + PCHSSOLightbox.failureRedirectURL;
                        // }
                        window.top.location = url;
                    }

                },
                skipEmailVal: function (code, email) {
                    emailErrorSuppression = { ErrorCode: code, Email: email };
                }
            },
            "ui" : PCH.ssoui,
            "loadingGraphic": container.find( "img.loader-icon" ),
            "success" : function() {
            	obj.fireGATag(gaTag, 'success');
                cb(obj.response, optins);
            },
            "failure" : function() {
                obj.register.registerInProgress = false;

                obj.fireGATag(gaTag, 'failure');
                fcb(obj.response, optins);
            },
            "env":PCH.env
        });

		obj.register.registerController.register();
	    obj.register.successCallBack = function(json) {
	        if (typeof json.result === 'undefined') {
	            var response = json.ValidationResponses;
	            obj.response = "";
	            if(json.MemberDetailStatusResponse != null){
	                obj.response = json.MemberDetailStatusResponse.MemberDetailResponse;
	            }

	            if(response.FieldOrDatabaseValidationResponse.StatusResponse.Code == '81'){
	                $.each(response.FieldOrDatabaseValidationResponse.Responses, function(index, response){
	                    if(response.Code == 92003){
	                    	window.location.href = '/passwordrequired?app=' + PCH.app + '&user=' + elements.email.val();
	                    }
	                });
	            }

	            obj.register.registerController.onRegister(response);
	        } else {
	        }
	    };
	    obj.register.pchTrackCallBack = function (tag) {
	        if(tag.reason == "obscene" || tag.reason == "underage"){
	            obj.logout(tag.success);
	        }else{
	            tag.success();
	        }
	    };
	};

	return obj;
};