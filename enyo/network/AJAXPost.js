ajaxPoster = function() {
}

ajaxPoster.sendPost = function() {
	 	var postdata='fname=enda&lname=mcgrath';
		this.$.post.call({
			handleAs: "text",
			postBody: postdata, 
			contentType: 'application/x-www-form-urlencoded'
		});
	}
ajaxPoster.onSuccess = function(inSender, inResponse) {
		this.$.postResponse.setContent(inResponse);
		console.log("success response = " + inResponse);
	}
ajaxPoster.onFailure = function(inSender, inResponse) {
		this.$.postResponse.setContent(inResponse);
		console.log("failure response = " + inResponse);
	}