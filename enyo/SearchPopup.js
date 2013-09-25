enyo.kind({kind: "Popup", name: "PopupNetwork", 
	layoutKind: "VFlexLayout", 
	pack: "center", 
	align: "center",
	render: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.$.networkOctet1Text.setValue(Global.localIP_1);
		this.$.networkOctet2Text.setValue(Global.localIP_2);
		this.$.networkOctet3Text.setValue(Global.localIP_3);
		this.$.progressBarFast.setPosition(0);
		this.$.progressBarSearch.setPosition(0);
	},
	components: [		
		{kind: "HFlexBox", components: [
			{kind: "Image", src: "images/rokubox.png", style: "padding-right: 10px", width: "50px"},
			{content: "Add Roku IP Address", flex: 1, className: "enyo-text-ellipsis", style: "text-transform: capitalize;"}
		]},	
		{kind: "HFlexBox", name: "SearchHFlexBox", components: [
			{kind: "VFlexBox", name: "SearchVFlexBox", components: [
				{kind: "Group", name: "SearchGroup", caption: "Search Network", width: "300px", components: [
					{kind: "HFlexBox", components: [
						{kind: "Input", name: "networkOctet1Text", width: "65px", hint: "", tabIndex: "6", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{kind: "Input", name: "networkOctet2Text", width: "65px", hint: "", tabIndex: "7", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{kind: "Input", name: "networkOctet3Text", width: "65px", hint: "", tabIndex: "8", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{name: "caption", caption: "*", width: "65px"}
					]}
				]},
				{kind: "Group", caption: "Search", width: "300px", components: [
					{kind: "HFlexBox", components: [
						{kind: "Spacer"},
						{kind: "Button", caption: "Quick", name: "QuickButton", onclick: "buttonSearchQuick"},
						{kind: "Spacer"},
						{kind: "Button", caption: "Thorough", name: "ThoroughButton", onclick: "buttonSearchThorough"},
						{kind: "Spacer"}
					]},
					{kind: "ProgressBar", name: "progressBarFast"},
					{kind: "ProgressBar", name: "progressBarSearch"},
					{content: "Time Remaining:", name: "ProgressLabel"}
				]},
				{kind: "Group", caption: "Display Name", width: "300px", components: [
					{kind: "Input", name: "displayText", tabIndex: "1", hint: ""}
				]},
				{kind: "Group", caption: "ROKU IP Address", width: "300px", components: [
					{kind: "HFlexBox", components: [
						{kind: "Input", name: "octet1Text", width: "65px", hint: "", tabIndex: "2", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{kind: "Input", name: "octet2Text", width: "65px", hint: "", tabIndex: "3", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{kind: "Input", name: "octet3Text", width: "65px", hint: "", tabIndex: "4", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"},{content: ".", width: "19"},
						{kind: "Input", name: "octet4Text", width: "65px", hint: "", tabIndex: "5", autoKeyModifier: "num-lock", onchange: "filterIPInput", onkeyup: "filterIPInput"}
					]}
				]},
				{kind: "Group", caption: "", width: "300px", components: [
					{kind: "HFlexBox", components: [
						{kind: "Spacer"},
						{kind: "Button", caption: "Save", onclick: "buttonSave"},
						{kind: "Spacer"},
						{kind: "Button", caption: "Cancel", name: "cancelButton", onclick: "buttonCancel"},
						{kind: "Spacer"}
					]}
				]}
			]},
			{kind: "Group", caption: "Saved Roku", width: "300px", components: [
				{kind: "RokuList", name: "RokuList"}
			]}
		]}
	],
	buttonSave: function() {
		Global.kookarooThis.$.sound.play();
		SEARCH.runFlag = false;
		this.$.QuickButton.setDisabled(false);
		this.$.ThoroughButton.setDisabled(false);
		
		if (this.$.octet4Text.getValue() != "000" && this.$.octet4Text.getValue() != "") {
			var newRokuListItem = new RokuListItem();
			newRokuListItem.populateData({"displayName": this.$.displayText.getValue(), 
			"octet1": this.$.octet1Text.getValue(), 
			"octet2": this.$.octet2Text.getValue(), 
			"octet3": this.$.octet3Text.getValue(), 
			"octet4": this.$.octet4Text.getValue()});
			Global.deleteDuplicate(newRokuListItem);
			Global.gDataList.push(newRokuListItem);
			localStorage.setItem(Global.addressListKey, JSON.stringify(Global.gDataList));
			Global.kookarooThis.setupRokuButton();
			Global.kookarooThis.rokuSelected({caption: this.$.displayText.getValue()});
		}
		this.close();
	},
	buttonCancel: function() {
		Global.kookarooThis.$.sound.play();
		if (SEARCH.runFlag == true) {
			SEARCH.runFlag = false;
		} else {
			Global.kookarooThis.setupRokuButton();
			this.close();
		}
	},
	setupData: function(rokuListItem) {
		this.$.displayText.setValue(rokuListItem.displayName);
		this.$.octet1Text.setValue(rokuListItem.octet1);
		this.$.octet2Text.setValue(rokuListItem.octet2);
		this.$.octet3Text.setValue(rokuListItem.octet3);
		this.$.octet4Text.setValue(rokuListItem.octet4);
	},
	addUrl: function(data) {
		Global.log("addUrl:" + data.displayName);
		this.$.RokuList.addNewData(data);
	},
	buttonSearchQuick: function() {
		Global.kookarooThis.$.sound.play();
		this.search(0.75, true);
	},
	buttonSearchThorough: function() {
		Global.kookarooThis.$.sound.play();
		this.search(2.5, false);
	},
	search: function(delayTimeOut, searchFlag) {
		this.$.QuickButton.setDisabled(true);
		this.$.ThoroughButton.setDisabled(true);
		var oct1 = this.$.networkOctet1Text.getValue();
		var oct2 = this.$.networkOctet2Text.getValue();
		var oct3 = this.$.networkOctet3Text.getValue();
		var addressPrefix = oct1 + "." + oct2 + "." + oct3 + ".";
		if (addressPrefix.indexOf("..") > -1) {
			this.$.networkOctet1Text.setValue(Global.localIP_1);
			this.$.networkOctet2Text.setValue(Global.localIP_2);
			this.$.networkOctet3Text.setValue(Global.localIP_3);
			addressPrefix = Global.localIP_1 + "." + Global.localIP_2 + "." + Global.localIP_3 + ".";
		}
		SEARCH.startSearch(this, addressPrefix, delayTimeOut, searchFlag);
	},
    filterIPInput: function(inSender) {
        var temp = inSender.value;
        var newVal = "";
        if (temp) {
            for (var i = 0; i < temp.length; i++) {
                if (i < 3) {
                    var aChar = temp[i];
                    if (!"0123456789".match(aChar)) {
                        aChar = '';
                    }
                    newVal = newVal + aChar;
                }
            }
        }
        inSender.setValue(newVal);
    },
});