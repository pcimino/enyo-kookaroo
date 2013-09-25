
enyo.kind({
	name: "RokuList",
	kind: enyo.VFlexBox,
	components: [
		{kind: "VirtualList", name:"virtualList", style: "width: 300px; height: 400px;",
			onSetupRow: "setupRow", components: [
				{kind: "SwipeableItem", onConfirm: "deleteItem", layoutKind: "HFlexLayout", components: [
					{kind: "VFlexBox", style: "width: 300px;", components: [
						{name: "itemName", onclick: "showMenu"},
						{name: "itemSubject", onclick: "showMenu", style: "font-size:12px;"}
					]}
				]}
		]},
		{name: "selectionMenu", kind: "Menu", className: "selection-submenu", components: [ 
			{caption: "Select", onclick: "optionSelected", option: "select"},
			{caption: "Delete", onclick: "optionSelected", option: "delete"},
			{caption: "Cancel", onclick: "optionSelected", option: "cancel"}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	ready: function() {
		this.inherited(arguments);
	},
	setupRow: function(inSender, inIndex) {
		Global.log("Setup Rows in Virtual List " + Global.gDataList.length);
		if (inIndex < Global.gDataList.length) {
			var record = Global.gDataList[inIndex];
			this.$.itemName.setContent(record.displayName);
			this.$.index = inIndex;
			this.$.itemSubject.setContent(record.octet1 + "." + record.octet2 + "." + record.octet3 + "." + record.octet4);
			return true;
		}
	},
	addNewData: function(newRokuListItem) {
		if (newRokuListItem.displayName == "No Roku found...") {
			Global.log("Not found");
		} else {
			Global.log("DISPLAY LIST");//TODO cleanup Duplicate code
			Global.kookarooThis.$.popupNetwork.$.displayText.setValue(newRokuListItem.displayName);
			Global.kookarooThis.$.popupNetwork.$.octet1Text.setValue(newRokuListItem.octet1);
			Global.kookarooThis.$.popupNetwork.$.octet2Text.setValue(newRokuListItem.octet2);
			Global.kookarooThis.$.popupNetwork.$.octet3Text.setValue(newRokuListItem.octet3);
			Global.kookarooThis.$.popupNetwork.$.octet4Text.setValue(newRokuListItem.octet4);
			
			Global.log("Found in RokuList " + newRokuListItem.displayName);
			Global.gDataList.push(newRokuListItem);
			localStorage.setItem(Global.addressListKey, JSON.stringify(Global.gDataList));
			Global.kookarooThis.setupRokuButton();
			Global.kookarooThis.rokuSelected({caption: newRokuListItem.displayName});
		};
		this.$.virtualList.refresh();
	},
	deleteItem: function(inSender, inIndex) {
		// remove data
		Global.gDataList.splice(inIndex, 1);
		localStorage.setItem(Global.addressListKey, JSON.stringify(Global.gDataList));
		Global.kookarooThis.$.rokuMenu.destroyComponents();
		Global.kookarooThis.setupRokuButton();
		Global.kookarooThis.rokuSelected({caption: ""});
		this.$.virtualList.refresh();
	},
	showMenu: function(inSender, inEvent) {
		Global.log("The user clicked on item number: " + inEvent.rowIndex);
        this.$.selectionMenu.openAroundControl(inSender);
		this.selectedRow = inEvent.rowIndex;
		Global.log("inSender " + inSender.toString() + ":" + inSender.name);
    },
    optionSelected: function(inSender) {
		if (inSender.option == 'select') {
			Global.log("Select item " + this.selectedRow);
			var record = Global.gDataList[this.selectedRow];
			Global.log(inSender.option + ":" + JSON.stringify(record));
			Global.kookarooThis.$.popupNetwork.$.displayText.setValue(record.displayName);
			Global.kookarooThis.$.popupNetwork.$.octet1Text.setValue(record.octet1);
			Global.kookarooThis.$.popupNetwork.$.octet2Text.setValue(record.octet2);
			Global.kookarooThis.$.popupNetwork.$.octet3Text.setValue(record.octet3);
			Global.kookarooThis.$.popupNetwork.$.octet4Text.setValue(record.octet4);
		
			Global.addressSelected = record.displayName;
			localStorage.setItem(Global.addressKey, Global.addressSelected);
			//Global.kookarooThis.$.popupNetwork.close();
			Global.rokuAddress = record.octet1 + "." + record.octet2 + "." + record.octet3 + "." + record.octet4;
			Global.kookarooThis.$.rokuSelector.setCaption(record.displayName);
		} else if (inSender.option == 'delete') {
			this.deleteItem(inSender, this.selectedRow);
		}
    },
});