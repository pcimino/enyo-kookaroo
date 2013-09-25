enyo.kind({
	name: "SpinnerPopupDialog",
	layoutKind: "VFlexLayout", 
	pack: "center", 
	align: "center",
	kind: enyo.ModalDialog,
	published: {
		message: ""
	},
	components: [
		{kind: "SpinnerLarge", name: "spin"},
		{name: "message", style: "font-size: 26px; padding: 6px; text-align: center;"}
	],
	// because popups are lazily created, initialize properties that effect components 
	// in componentsReady rather than create.
	componentsReady: function() {
		this.inherited(arguments);
		this.messageChanged();
	},
	messageChanged: function() {
		this.$.spin.show();
		// check to ensure we have this component has been created before updating it.
		if (this.$.message) {
			this.$.message.setContent(this.message);
		}
	}
});
