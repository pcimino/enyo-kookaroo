enyo.kind({
	name: "PopupDialog",
	kind: enyo.ModalDialog,
	published: {
		message: ""
	},
	components: [{kind: "BasicScroller", components: [
		{name: "message", style: "font-size: 16px; padding: 6px; text-align: center;"},
		{kind: "Button", caption: "Close", popupHandler: true}
		]}
	],
	// because popups are lazily created, initialize properties that effect components 
	// in componentsReady rather than create.
	componentsReady: function() {
		this.inherited(arguments);
		this.messageChanged();
	},
	messageChanged: function() {
		// check to ensure we have this component has been created before updating it.
		if (this.$.message) {
			this.$.message.setContent(this.message);
		}
	},
	getValue: function() {
		return this.$.input.getValue();
	}
});
