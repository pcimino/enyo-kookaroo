/* Hate globals, but sometimes its just to tempting than trying to figure out the cross component calling */

var Global = {};
Global.channels = [];
Global.logging = false;
Global.showBrowserKey = "kookaroo.showBrowser";
Global.startSite = "http://www.imdb.com";
Global.helpLink = "www.translunardesigns.com/webOS/roku_remote_manual_tp.htm";
Global.startSiteKey = "kookaroo.startsite";
Global.addressListKey = "kookaroo.list";
Global.addressKey = "kookaroo.selected";
Global.rokuPort = "8060";
Global.rokuAddress = "";
Global.scaling = false;
Global.xScale = 1;
Global.yScale = 1;
Global.addressSelected = {};
Global.gDataList = [];
Global.channelList = [];

Global.localIP = "";
Global.localIP_1 = "";
Global.localIP_2 = "";
Global.localIP_3 = "";
Global.wifiWorking = false;

Global.kookarooThis = "";

Global.playBeep = function() {
	// Can cause issues on Pixi, so wrap in try/catch
	try {Global.kookarooThis.$.sound.play();} catch (ignore) {}
};
Global.closeSpinner = function() {
	// Can cause issues on Pixi, so wrap in try/catch
	try {Global.kookarooThis.closeSpinner();} catch (ignorePixi) {}
};

Global.log = function(str) {
	if (Global.logging) {
		enyo.error(str);
	}
};
Global.scaleX = function(x) {
	if (Global.scaling) {
		x = parseInt((parseInt(x) * Global.xScale).toString());
	}
	return x;
};
Global.scaleY = function(y) {
	if (Global.scaling) {
		y = parseInt((parseInt(y) * Global.yScale).toString());
	}
	return y;
};

Global.hasRoku = function() {
	for (xx in Global.gDataList) {
		if (Global.gDataList[xx].displayName) {
			return true;
		}
	}
	return false;
};
Global.isDataUnique = function(data) {
	for (xx in Global.gDataList) {
		if (Global.gDataList[xx].displayName) {
			if (data.isSimilar(Global.gDataList[xx])) {
				return false;
			}
		}
	}
	return true;
};
Global.deleteDuplicate = function(data) {
	for (xx = Global.gDataList.length -1 ; xx >= 0; xx--) {
		if (Global.gDataList[xx].displayName) {
			if (data.isSimilar(Global.gDataList[xx])) {
				Global.gDataList.splice(xx, 1);
			}
		}
	}
};

Global.scrubDataList = function() {
	var lArr = [];
	for (x in Global.gDataList) {
		if (Global.gDataList[x].displayName) {
			//Global.log("Scrub " + x + ":" + enyo.json.stringify(Global.gDataList[x]));
			lArr.push(enyo.json.stringify(Global.gDataList[x]));
		}
	}
	return lArr;
};

