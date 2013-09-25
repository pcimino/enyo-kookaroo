enyo.kind({name: "RemoteControl", kind: "enyo.Control",
  nodeTag: "canvas",
  clickArray: [],
  domAttributes: {
      width:"350",
      height:"650"
  },
  	create: function() {
		this.inherited(arguments);
		Global.remoteThis = this;
	},
	resizeHandler: function()  {
	},
  rendered: function() {
    // Fill in the canvas node property
    this.hasNode();
    var localContext = this.node.getContext("2d");

    // create in order, bottom layer (background) first
    this.createImage(localContext, "background", "images/buttons/background4.png", "0", "50", "350", "600");

    this.createImage(localContext, "pictureBack",  "images/buttons/back.png", "60", "70", "80", "60", "buttonBack", "Back", false);
    this.createImage(localContext, "pictureHome",  "images/buttons/home.png", "227", "70", '80', "60", "buttonHome", "Home", false);

    this.createImage(localContext, "picture2", "images/buttons/ulc.png", "60", "155", "70", "70");
    this.createImage(localContext, "picture4", "images/buttons/urc.png", "235", "155", "70", "70");
    this.createImage(localContext, "pictureUp", "images/buttons/up.png", "125", "155", "110", "70", "buttonUp", "Up", true);

    this.createImage(localContext, "pictureLeft", "images/buttons/left.png", "60", "225", "70", "100", "buttonLeft", "Left", true);
    this.createImage(localContext, "pictureRight", "images/buttons/right.png", "235", "225", "70", "100", "buttonRight", "Right", true);
    this.createImage(localContext, "pictureOk",  "images/buttons/ok.png", "125", "225", "110", "100", "buttonOk", "Select", false);

    this.createImage(localContext, "picture7", "images/buttons/llc.png", "60", "315", "70", "70");
    this.createImage(localContext, "picture10", "images/buttons/lrc.png", "235", "315", "70", "70");
    this.createImage(localContext, "pictureDown", "images/buttons/down.png", "125", "315", "110", "70", "buttonDown", "Down", true);

    this.createImage(localContext, "pictureReplay", "images/buttons/reply.png", "60", "430", "70", "60", "buttonReplay", "InstantReplay", false);
    this.createImage(localContext, "pictureInfo", "images/buttons/info.png", '240', '430', '70', '60', "buttonInfo", "Info", false);

	Global.log("Rewind button");
    this.createImage(localContext, "pictureRew",  "images/buttons/rewind.png", "60", "520", "65", "65", "buttonRew", "Rev", false);
    this.createImage(localContext, "picturePlay", "images/buttons/play.png", "150", "520", "65", "65", "buttonPlay", "Play", false);
    this.createImage(localContext, "pictureFwd",  "images/buttons/fastfwd.png", "240", "520", "65", "65", "buttonFwd", "Fwd", false);

  },
  clickHandler: function(inSender, inEvent) {
    var x = parseInt(inEvent.offsetX);
    var y = parseInt(inEvent.offsetY);
    for (i in this.clickArray) {
      if ((x >= parseInt(this.clickArray[i].left)) && (x <= (parseInt(this.clickArray[i].left)+parseInt(this.clickArray[i].width)))
      && (y >= parseInt(this.clickArray[i].top)) && (y <= (parseInt(this.clickArray[i].top)+parseInt(this.clickArray[i].height)))) {
        Global.log("DEBUG clickHandler tap object:" + this.clickArray[i].id +":"+ this.clickArray[i].keyName +":"+ inEvent.type);
		//UTIL.postRequest("keyup", this.clickArray[i].keyName, Global.rokuAddress, Global.rokuPort, false, true);
      } 
   }
  },
  mousedownHandler: function(inSender, inEvent) {
	Global.playBeep();
    var x = parseInt(inEvent.offsetX);
    var y = parseInt(inEvent.offsetY);
    for (i in this.clickArray) {
      if ((x >= parseInt(this.clickArray[i].left)) && (x <= (parseInt(this.clickArray[i].left)+parseInt(this.clickArray[i].width)))
      && (y >= parseInt(this.clickArray[i].top)) && (y <= (parseInt(this.clickArray[i].top)+parseInt(this.clickArray[i].height)))) {
        Global.log("DEBUG mousedownHandler tap object:" + this.clickArray[i].id +":"+ this.clickArray[i].keyName +":"+ inEvent.type);
		UTIL.postRequest("keydown", this.clickArray[i].keyName, Global.rokuAddress, Global.rokuPort, this.clickArray[i].holdFlag, true);
		UTIL.postRequest("keyup", this.clickArray[i].keyName, Global.rokuAddress, Global.rokuPort, false, true);
     } 
   } 
  },

	mouseupHandler: function(inSender, inEvent) {
		var x = parseInt(inEvent.offsetX);
		var y = parseInt(inEvent.offsetY);
		for (i in this.clickArray) {
		  if ((x >= parseInt(this.clickArray[i].left)) && (x <= (parseInt(this.clickArray[i].left)+parseInt(this.clickArray[i].width)))
		  && (y >= parseInt(this.clickArray[i].top)) && (y <= (parseInt(this.clickArray[i].top)+parseInt(this.clickArray[i].height)))) {
		//Global.log("DEBUG mouseupHandler tap object:" + this.clickArray[i].id +":"+ this.clickArray[i].keyName +":"+ inEvent.type);
		UTIL.postRequest("keyup", this.clickArray[i].keyName, Global.rokuAddress, Global.rokuPort, false, true);
		  } 
	}
  },
  createImage: function(localContext, imgName, imgSrc, left, top, width, height, eventMethod, keyName, holdFlag) {
    var img = new Image();
	Global.log("createImage " + Global.scaling);
	if (Global.scaling) {
		Global.log("Before scale " + left +":"+width+":"+top+":"+height);
		left = Global.scaleX(left);
		width = Global.scaleX(width);
		top = Global.scaleY(top-50);
		height = Global.scaleY(height);
		Global.log("After scale " + left +":"+width+":"+top+":"+height);
	}
    img.onload = function() {
        localContext.drawImage(img, left, top, width, height);
    }
    img.src = imgSrc;
    if (eventMethod) {
       this.clickArray.push({id:eventMethod, left:left, top:top, width:width, height:height, keyName:keyName, holdFlag:holdFlag});
    }
    img.name = imgName;
  } 
});
