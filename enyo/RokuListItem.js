enyo.kind({kind: "enyo.Object", name: "RokuListItem", 
	published: {
        	displayName: "",
        	octet1: "",
        	octet2: "",
        	octet3: "",
        	octet4: ""
	},
	populateData: function(newJSON) {
			this.displayName = newJSON.displayName;
			this.octet1 = newJSON.octet1;
			this.octet2 = newJSON.octet2;
			this.octet3 = newJSON.octet3;
			this.octet4 = newJSON.octet4;
	},
	// determines if 2 rokus are similar (same name or same address)
	isSimilar: function(newRoku) {
		if (this.displayName == newRoku.displayName) {
			return true;
		}
		if (this.octet1 == newRoku.octet1 && this.octet2 == newRoku.octet2 && this.octet3 == newRoku.octet3 && this.octet4 == newRoku.octet4) {
			return true;
		}
		return false;
	}
});