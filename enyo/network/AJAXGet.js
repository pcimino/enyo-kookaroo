ajaxGetter = function() {
}

ajaxGetter.search = function() {		
		var searchTerm = this.$.searchText.getValue();
		
		if (searchTerm == ""){
			this.$.errorMessage.setContent('You need to enter some text to search for.')
			this.$.errorDialog.open();
		}
		// Use url to access the Google AJAX search API.
		var url = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=' + encodeURIComponent(searchTerm);
		this.$.getGoogleResults.url = url;
		this.$.getGoogleResults.call();
	}
	//success & failure callbacks for our web service
ajaxGetter.gotResultsSuccess =  function(inSender, inResponse) {
		this.results = inResponse.responseData.results;
		this.$.list.refresh();
	}
ajaxGetter.gotResultsFailure =  function(inSender, inResponse) {
		this.$.errorMessage.setContent('Search Failed')
		this.$.errorDialog.open();
	}
	
	//close the error dialog
ajaxGetter.closeDialog =  function() {
		this.$.errorDialog.close();
	}
	//Our standard list setup functions
ajaxGetter.create =  function() {
		this.inherited(arguments);
		this.results = [];
	}
ajaxGetter.listSetupRow =  function(inSender, inRow) {
		var r = this.results[inRow];
		if (r) {
			this.$.itemTitle.setContent(r.title);
			this.$.itemURL.setContent(r.url);
			return true;
		}
	}
	//If the user taps an result in the list then launch the browser to the associated URL
ajaxGetter.launchBrowser =  function(inSender, inEvent, inRowIndex) {
		this.$.list.select(inRowIndex);  //shouldn't this do something??
		console.log(this.results[inRowIndex].url)
		this.$.openBrowser.call(
			{
		       id:     'com.palm.app.browser',
               params: {
	                     target: this.results[inRowIndex].url
                       }           
			});		
	}
ajaxGetter.openSuccess =  function(inSender, inResponse) {
	    console.log("success: " + enyo.json.to(inResponse));
	}
ajaxGetter.openFailure =  function(inSender, inResponse){
	    console.log("failure: " + enyo.json.to(inResponse));		
	}
