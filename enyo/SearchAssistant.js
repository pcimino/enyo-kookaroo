PPG = {};


SEARCH = {};
SEARCH.addressPrefix = "";

SEARCH.timeoutTimer = [];
SEARCH.request = [];
SEARCH.runFlag = false;
SEARCH.onCompleteCount = 255;
SEARCH.onSearchEnd = 0;
SEARCH.delay = 2;
SEARCH.quick = 0;
SEARCH.quickAdd = 10;
SEARCH.found = 0;

SEARCH.startSearch = function(parent, addressPrefix, delay, searchFastFlag) {
	if (searchFastFlag) {
		// fast
		SEARCH.onCompleteCount = 150;
		SEARCH.onSearchEnd = 90;
	} else {
		SEARCH.onCompleteCount = 255;
		SEARCH.onSearchEnd = 0;
	}
	SEARCH.myThis = parent;
	enyo.time("SEARCHTIME");
	SEARCH.quick = 0;
	SEARCH.quickAdd = 10;
	if (addressPrefix) {
		SEARCH.addressPrefix = addressPrefix;
	} else {
		SEARCH.addressPrefix = "192.168.1.";
	}
	if (delay) {
		SEARCH.delay = delay;
	} else {
		SEARCH.delay = 2;
	}
	SEARCH.timeoutTimer = [];
	SEARCH.request = [];
	SEARCH.runFlag = true;
	SEARCH.updateProgess(SEARCH.onCompleteCount);
	SEARCH.findURL(SEARCH.onCompleteCount);
};
SEARCH.updateProgess = function(inputVal) {
	var val = 100 * (SEARCH.onCompleteCount - inputVal) / (SEARCH.onCompleteCount - SEARCH.onSearchEnd);
	SEARCH.myThis.$.progressBarSearch.setPosition(val);

	SEARCH.myThis.$.progressBarFast.setPosition(SEARCH.quick);
	SEARCH.quick = SEARCH.quick + SEARCH.quickAdd;
	if (SEARCH.quick > 100) {
		SEARCH.quickAdd = -10;
		SEARCH.quick = 90;
	} else if (SEARCH.quick < 0) { 
		SEARCH.quickAdd = 10;
		SEARCH.quick = 10;
	}
	//Mojo.Log.info(inputVal,val);
	//SEARCH.myThis.$.progressBarFast.setPosition(val);
	var secondsRemaining = SEARCH.delay * (inputVal - SEARCH.onSearchEnd);
	var minutes = secondsRemaining / 60;
	var secs = secondsRemaining % 60;
	minutes = minutes.toString();
	if (minutes.indexOf('.') >= 0) {
		minutes = minutes.substring(0, minutes.indexOf('.'));
	}
	secs = (Math.floor(0.5 + secs)).toString();
	if (secs.length == 1) {
		secs = "0" + secs;
		if (secs.indexOf('.') >= 0) {
			secs = secs.substring(0, secs.indexOf('.'));
		}
	}
	var timeStr = minutes + ":" + secs;
	//	Mojo.Log.info(timeStr);
	SEARCH.myThis.$.ProgressLabel.setContent('Time Remaining: ' + timeStr);
};

SEARCH.endSearch = function() {
	SEARCH.myThis.$.QuickButton.setDisabled(false);
	SEARCH.myThis.$.ThoroughButton.setDisabled(false);
	SEARCH.myThis.$.ProgressLabel.setContent('Time Remaining: 00:00');
	SEARCH.myThis.$.progressBarSearch.setPosition(0);
	SEARCH.myThis.$.progressBarFast.setPosition(0);
	var seconds = enyo.timeEnd("SEARCHTIME") / 1000;
	if (SEARCH.found == 0 && !Global.hasRoku()) {
		if (seconds < 10) {
			Global.kookarooThis.popMessage("Search took " + seconds + " seconds. Which is way too quick. Please check your network, unplug and restart your Roku, reboot your webOS device.");
		} else {
			Global.kookarooThis.popMessage("Please check your network, unplug and restart your Roku, reboot your webOS device.");
		}
	}
	Global.log("endSearch F");
};
var isRunning = false;
SEARCH.findURL = function(ipNum) {
	if (isRunning) return;
	isRunning = true;
	//SEARCH.addressPrefix='192.168.1.';
	var url = 'http://' + SEARCH.addressPrefix + ipNum + ":" + Global.rokuPort;
	//url = "http://192.168.1.103:8060";
	Global.log("DEBUG Search " + url);
	SEARCH.request[ipNum] = new Ajax.Request(url, {
		method: 'get',
		parameters: {},
		onSuccess: function(transport) {
			var resultCode = transport.getStatus();
			//listItem.status = resultCode;
			Global.log("SUCCESS");
			Global.log("RESULT " + resultCode);
			if ((resultCode >= 200) && (resultCode < 300)) {
				// success
				Global.log("Build data");
				var data = new RokuListItem();
				data.populateData({"displayName": SEARCH.addressPrefix + ipNum, "octet1": Global.localIP_1, "octet2": Global.localIP_2, "octet3": Global.localIP_3, "octet4": ipNum});
				var uniqueFlag = Global.isDataUnique(data);
				if (uniqueFlag) {
					SEARCH.found++;
					Global.log("Found in findURL " + SEARCH.found + ":" + SEARCH.addressPrefix +""+ ipNum);
					SEARCH.myThis.addUrl(data);
				} else {
					Global.kookarooThis.popMessage("Found " + SEARCH.addressPrefix + ipNum + ".Select from your list to use.");
				}
			}
			ipNum--;
			SEARCH.findURL(ipNum);
		},
		on0: function(e) {
			Global.log("DEBUG on0 "+ enyo.json.stringify(e));
		},
		onTimeout: function(e) {
			Global.log("DEBUG onTimeout "+ enyo.json.stringify(e));
		},
		onFailure: function(e) {
			Global.log("DEBUG onFail "+ enyo.json.stringify(e));
		},
		onComplete: function(resp) {
			Global.log("onComplete " + enyo.json.stringify(resp));
			clearTimeout(SEARCH.timeoutTimer[ipNum]);
			SEARCH.updateProgess(ipNum);
			if ((ipNum <= SEARCH.onSearchEnd) || !SEARCH.runFlag) {
				Global.log("END SEARCH");
				SEARCH.endSearch();
			} else {
				SEARCH.findURL(ipNum - 1);
			}
		}

	});

	SEARCH.timeoutTimer[ipNum] = setTimeout(function() {
		Global.log("SETUP Timer");
		// the actual XHR object
		// abort will trigger on0 and onComplete...
		SEARCH.abortSearch(ipNum);
	},
	SEARCH.delay * 1000); // call this after X ms
	isRunning = false;
};
SEARCH.abortSearch = function(ipNum) {
	if (SEARCH.request[ipNum]) {
		SEARCH.request[ipNum].transport.abort();
	}
};
