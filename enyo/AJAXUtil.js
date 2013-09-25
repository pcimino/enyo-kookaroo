//TODO What is AppAssist used for?
// How to determine base IP ?
// how is unstick flag used? Only Pixi?



UTIL = {};
UTIL.timeoutId = null;

UTIL.log = "";
UTIL.getPostBody = function(reqString) {
	//if (AppAssist.useBody === true) {
	//	return 'action=' + reqString;
	//}
	return '';
};
UTIL.loopCount = 2;
UTIL.callBack = '';
var holdButton = false;
var inProcess = false;
UTIL.getWaitComplete = function() {
	return true;
};
UTIL.postDelayedRequest = function(parameters) {
	UTIL.postRequest(parameters.action, parameters.keyParam, parameters.ipAddress, parameters.portNumber, parameters.holdFlag, parameters.initialFlag, UTIL.callBack);
};
UTIL.postRequest = function(action, param, address, port, holdFlag, initialFlag, callBack) {
Global.log("Post request " + action, param, address, port, holdFlag, initialFlag, callBack);
	UTIL.callBack = callBack;
	if (inProcess) {
		setTimeout(function() {
			UTIL.postRequest(action, param, address, port, holdFlag, initialFlag, callBack);
		},
		TimeDelay.defaultDelay);
	}
	inProcess = true;
	if (initialFlag) {
		holdButton = holdFlag;
	}
	var reqString = "http://" + address + ":" + port + "/" + action + "/" + param;
	Global.log("Post :" + reqString.toString());
	new Ajax.Request(reqString.toString(), {
		//"encoding": 'UTF-8',
		"method": 'post',
		"postBody": UTIL.getPostBody(reqString),
		parameters: {
			//		action: reqString
		},
		onSuccess: function(transport) {
			inProcess = false;
			UTIL.loopCount = 2;
			Global.log('Post ok',transport.getStatus());
				//UTIL.log += action + "/" + param + ":" + transport.getStatus() + "\n";
				//Global.kookarooThis.popMessage('ok' + UTIL.log);
				Global.log(enyo.json.stringify(transport));
				//if (unstickFlag) {
				//	UTIL.postRequest('keyup', param, address, port);
				//	UTIL.postRequest('keyup', param, address, port);
				//}
			if (UTIL.callBack && UTIL.callBack != '') {
				UTIL.loopCount = 0;
				Global.log("CallingBack");
				UTIL.callBack(transport);
			} else
			if (holdButton) {
				setTimeout(function() {
					UTIL.postRequest(action, param, address, port, holdFlag, false);
				},
				TimeDelay.defaultDelay);
				//TimeDelay.monitorFlag(UTIL.getWaitComplete, UTIL.postDelayedRequest, {action:action, keyParam:param, ipAddress:address, portNumber:port, holdFlag:holdFlag, initialFlag:false});
			}
		},
		onTimeout: function(e) {
			inProcess = false;
			if (e.request.url.indexOf("/keyup") > 0) {
				if (UTIL.loopCount > 0) {
					UTIL.loopCount -= 1;
					UTIL.postRequest('keyup', param, address, port);
				}
			} else {
				Global.kookarooThis.popMessage('Connection timed out. Please check your network connections to your Roku box.' + e.getStatus());
				Global.log('fail');
			}
		},
		on0: function(e) {
			inProcess = false;
			if (e.request.url.indexOf("/keyup") > 0) {
				holdButton = false;
				if (UTIL.loopCount > 0) {
					UTIL.loopCount -= 1;
					UTIL.postRequest('keyup', param, address, port);
				}
			} else {
				Global.kookarooThis.popMessage(intialFlag + 'Network Error. Please check your network connections to your Roku box.' + e.getStatus());
			}
		},
		onFailure: function(e) {
			inProcess = false;
			holdButton = false;
			if (e.request.url.indexOf("/keyup") > 0) {
				if (UTIL.loopCount > 0) {
					UTIL.loopCount -= 1;
					UTIL.postRequest('keyup', param, address, port);
				}
			} else {
				Global.kookarooThis.popMessage('Error. Please check your network connections to your Roku box.' + e.getStatus());
			}
		},
		onComplete: function(resp) {
			var resultCode = resp.getStatus();
			//	//Mojo.Log.info('complete');
			inProcess = false;
		}
	});
};
UTIL.getChannels = function(address, port) {
	Global.kookarooThis.popSpinner("Scanning your Roku Channels...");
	var url = "http://" + address + ":" + port +"/query/apps";
	Global.log("Get Channels:" + url);
	new Ajax.Request(url, {
		method: 'get',
		parameters: {},
		onSuccess: function(transport) {
		Global.log("DEBUG " + 0);
			//Global.log(transport.getStatus());
			//Global.log(transport.responseText.toString());
			Global.channelList = [];
			var channelArr = transport.responseText.toString().split("<app id=");
			for (i = 1; i < channelArr.length; i++) {
				var itemArr = channelArr[i].split('"');
				var id = itemArr[1];
				var name = itemArr[4].substring(itemArr[4].indexOf('>')+1, itemArr[4].indexOf('<'));
				Global.channelList.push({'id':id, 'name':name});
				//Global.log("Id " + id + " Name " + name);
			}
			Global.log("DEBUG " + 3);
			// Yes I know I should use events and listeners instead of calling global pointers into other classes
			// lazy, lazy, lazy
			Global.kookarooThis.setupButtonChannel();
			Global.log("Setup Button Channel Done");
		},
		'timeout':3500,
		on0: function(e) {
			Global.closeSpinner();
			Global.kookarooThis.popMessage("Connection error. Please check your Roku and network. If problem persists follow the 'Add Roku' manual procedure.");
			Global.log(e);
		},
		onTimeout: function(e) {
			Global.closeSpinner();
			Global.popMessage("Connection timed out. Please check your Roku and network. If problem persists follow the 'Add Roku' manual procedure.");
			Global.log(e);
		},
		onFailure: function(e) {
			Global.kookarooThis.closeSpinner();
						Global.kookarooThis.popMessage("Connection failure. Please check your Roku and network. If problem persists follow the 'Add Roku' manual procedure.");
			Global.log(e);
		},
		onComplete: function(resp) {
			Global.log(resp);
		}
	});
};

UTIL.unstickFlag = false;

