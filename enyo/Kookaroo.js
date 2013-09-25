/* Copyright 2010-2011 Trans Lunar Designs, Inc. */
enyo.kind({name: "RightSliderName", kind:"SlidingView", peekWidth: 0, flex: 1, components: [
		{kind: "Scroller", name: "SliderScroller", flex: 1, components: [
            {name: "TBWebView", kind: enyo.WebView, 
               flex: 1, url: Global.startSite
            }                     
        ]},
        {kind: "Toolbar", components: [
            {kind: "GrabButton"},
			{kind: "Spacer"},
            {caption: "Movie Site", onclick: "selectSite"},
			{kind: "Spacer"},
            {caption: "<<", onclick: "goBack"},
            {caption: ">>", onclick: "goForward"}
        ]},
        {name: "siteMenu", kind: "Menu", className: "url-submenu", components: [ 
            {caption: "Bad Movies", onclick: "siteSelected", site: "www.badmovies.org"},
            {caption: "Hulu", onclick: "siteSelected", site: "www.hulu.com"},
            {caption: "IMDb", onclick: "siteSelected", site: "www.imdb.com"},
            {caption: "iSmash Media", onclick: "siteSelected", site: "www.ismashmedia.com"},
            {caption: "jinni", onclick: "siteSelected", site: "www.jinni.com"},
            {caption: "Metacritic", onclick: "siteSelected", site: "www.metacritic.com"},
            {caption: "Movie Nerd", onclick: "siteSelected", site: "www.movie-nerd.com"},
            {caption: "Movies Planet", onclick: "siteSelected", site: "www.moviesplanet.com"},
            {caption: "Moovees", onclick: "siteSelected", site: "www.moovees.com"},
            {caption: "Netflix", onclick: "siteSelected", site: "www.netflix.com"},
            {caption: "NitPickers", onclick: "siteSelected", site: "www.nitpickers.com"},
            {caption: "Plugged In", onclick: "siteSelected", site: "www.pluggedin.com"},
            {caption: "Rotten Tomatoes", onclick: "siteSelected", site: "www.rottentomatoes.com"},
            {caption: "Roku Support", onclick: "siteSelected", site: "support.roku.com/home"},
            {caption: "Kookaroo Support", onclick: "siteSelected", site: Global.helpLink}
        ]},
		{kind: "Sound", src: "sounds/beep-22.mp3"}
        ],
			selectSite: function(inSender) {
			this.$.sound.play();
				this.$.siteMenu.openAroundControl(inSender);
			},
			siteSelected: function(inSender) {
			this.$.sound.play();
				Global.kookarooThis.siteSelected(inSender);
			},
			goBack: function() {
			this.$.sound.play();
				this.$.TBWebView.goBack();
			},
			reload: function() {
			this.$.sound.play();
				this.$.TBWebView.reloadPage();
			},
			goForward: function() {
			this.$.sound.play();
				this.$.TBWebView.goForward();
			}
		});

enyo.kind({
	name: "Kookaroo",
	kind: enyo.VFlexBox,
	published : {
		savedSite: "",
		showBrowserVal: true
	},
	create: function() {
		this.inherited(arguments);
		Global.kookarooThis = this;
		var dev = enyo.fetchDeviceInfo();
		Global.log("DEV " + dev);
		// TP 1024,1024 318,740
		// pre 3 Screen size :480 : 480 : 318 : 758
		// pixi 320x372
		// Pre 2 320x480
		if (dev.maximumCardWidth < 1000 && dev.maximumCardHeight < 1000) {
			Global.log("Scaling true " + dev.maximumCardWidth +":"+ dev.maximumCardHeight);
			Global.scaling = true;
			enyo.setAllowedOrientation("up");
			if (dev.maximumCardWidth < 400 && dev.maximumCardHeight < 400) {
				// pixi
				Global.xScale = .92;
				Global.yScale = .5;	
			} else if (dev.maximumCardWidth < 500 && dev.maximumCardHeight < 500) {
				// Pre+, Pre 2
				Global.xScale = .92;
				Global.yScale = .734;	
			} else {
				// Pre 3
				Global.xScale = 2 * dev.maximumCardWidth / 1024;
				Global.yScale = (dev.maximumCardHeight) / 965;
			}
			Global.log("Scaling  " + Global.xScale +":"+ Global.yScale);
		} else {
			Global.log("Scaling false " + dev.maximumCardWidth +":"+ dev.maximumCardHeight);
			Global.scaling = false;
			Global.xScale = 1;
			Global.yScale = 1;
		}
		Global.log("Scaling  :" + Global.scaling + ":" + Global.xScale + ":" + Global.yScale);
		this.getStatus();
	},
	render: function() {
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.getStatus();
		// list of Roku addresses
		Global.gDataList = localStorage.getItem(Global.addressListKey);
		if (Global.gDataList == undefined) {
			Global.gDataList = [];
		} else {
			Global.gDataList = JSON.parse(Global.gDataList);
		}

		if (0 == Global.gDataList.length) {
			//TODO Both of these calls fail?
			// how do these differ from when popup is launched from the dropdown menu?
			//this.openPopup({popup: "popupNetwork"});
			if (Global.scaling) {
				this.$.popupNetworkNarrow.openAtCenter();
			} else {
				this.$.popupNetwork.openAtCenter();
			}
		}
		this.setupRokuButton();
		
		Global.addressSelected = localStorage.getItem(Global.addressKey);
		Global.log("stored address " + Global.addressSelected);
		if (Global.addressSelected == undefined || Global.addressSelected.length == 0 || Global.addressSelected == "[object Object]") {
			if (0 == Global.gDataList.length) {
				Global.addressSelected = "";
			} else {
				for (x in Global.gDataList) {
					if (Global.gDataList[x].displayName) {
						Global.addressSelected = Global.gDataList[x].displayName;
						localStorage.setItem(Global.addressKey, Global.addressSelected);
					}
				}
				this.setRokuSelected(Global.addressSelected);
			}
		} else {
			this.setRokuSelected(Global.addressSelected);
		}
	},
	ready: function() {
		this.showBrowserVal = false;
		Global.log("Ready function " + Global.scaling);
		if (!Global.scaling) {
			// browser display
			// Last URL the user set in the webview
			this.savedSite = localStorage.getItem(Global.startSiteKey);
			if (this.savedSite == undefined) {
				this.savedSite = Global.startSite;
			} else {
				this.siteSelected({site: this.savedSite});
			}

			// browser display
			this.showBrowserVal = localStorage.getItem(Global.showBrowserKey);
			if (this.showBrowserVal == undefined) {
				this.showBrowserVal = true;
			} else {
				this.showBrowserVal = JSON.parse(this.showBrowserVal);
			}
			this.setBrowser();
		} else {
			this.$.BrowserRightSlider.destroy();
			this.$.ChangeBrowserButton.destroy();
			this.$.BrowserGrabButton.destroy();
		}
 	}, 
	components: [
		{kind: "SpinnerPopupDialog", name: "SpinnerPopup"},
		{kind: "PopupDialog", name: "HelpPopup"},
		{kind : "PalmService",
			name : "getConnMgrStatus",
			service : "palm://com.palm.connectionmanager/",
			method : "getStatus",
			onSuccess : "statusFinished",
			onFailure : "statusFail",
			onResponse : "gotResponse",
			subscribe : true
		},
        {kind: "ApplicationEvents", onWindowRotated: "windowRotated"},
        {name: "openAppService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
        {name: "launchAppService", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch"},
        {kind: "ApplicationEvents", onOpenAppMenu: "openAppMenu", onCloseAppMenu: "closeAppMenu"},
        {kind: "AppMenu", automatic: false, components: [
             {kind: "EditMenu"},
             {caption: "Add a Roku", onclick: "openPopup", popup: "popupNetwork"},
             {caption: "Help", onclick: "openPopup", popup: "popupHelp"}
        ]},
        {kind: "Popup", name: "popupHelp", width: "500px", layoutKind: "VFlexLayout", pack: "center", align: "center", components: [
            {kind: "Image", src: "images/LogoColor_162x143.png"},
            {kind: "Button", caption: "Email Support@TransLunarDesigns.com", onclick: "buttonClick"},
			{kind: "enyo.HFlexBox", components: [
              	{kind: "Button", caption: "Kookaroo User manual", onclick: "buttonClickLoadHelp"},
              	{kind: "Button", caption: "Cancel", popupHandler: "Cancel"}
			]}
        ]},
		{kind: "PopupNetwork", name: "popupNetwork", dataList: Global.gDataList},
        {kind: "PopupNetworkNarrow", name: "popupNetworkNarrow", dataList: Global.gDataList},
        {kind: "ModalDialog", name:"searchTextPopup", showKeyboardWhenOpening: true,  layoutKind: "VFlexLayout", caption: "Search", onOpen: "dialogOpened", components: [
            {kind: "Input", name: "searchText", onkeypress: "keyPressHandler"},
            {kind: enyo.HFlexBox, components: [
                {kind: "Spacer"},
                {kind: "Button", caption: "OK", onclick: "buttonSubmitSearch"},
                {kind: "Spacer"},
                {kind: "Button", caption: "Cancel", popupHandler: "Cancel"},
                {kind: "Spacer"}
            ]}
        ]},
        {name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{name: "left", flex: 1, kind:"SlidingView", components: [
				{kind: enyo.HFlexBox, flex: 1, components: [
					{kind: "Spacer", name: "LeftSpacer"},
					{kind: "RemoteControl", name: "remote" },
					{kind: "Spacer", name: "RightSpacer"}
                ]},
                {kind: "Toolbar", components: [
                    {kind: "GrabButton", name: "BrowserGrabButton"},
                    {kind: "Button", caption: "Search", onclick: "openPopup", popup: "searchTextPopup"},
                    {caption: "Roku", onclick: "selectRoku", name: "rokuSelector"},
                    {caption: "Browser", name: "ChangeBrowserButton", onclick: "changeBrowser"},
					{caption: "Channel", onclick: "buttonChannel", name: "channelSelector"}
                ]},
                {name: "rokuMenu", kind: "Menu", className: "roku-submenu", components: []},
				{name: "channelMenu", kind: "Menu", className: "roku-submenu", components: []},
				{kind: "Sound", src: "sounds/beep-22.mp3"}
            ]},
			{kind: "RightSliderName", name: "BrowserRightSlider"}
        ]}
	],
	buttonSubmitSearch: function(inSender) {
		this.$.sound.play();
		// submit the form (since I only had one field I have this luxury)
		UTIL.postRequest("keydown", "Enter", Global.rokuAddress, Global.rokuPort, false, true);
		this.$.searchTextPopup.close();
	},
	keyPressHandler: function(inSender, event) {
		this.$.sound.play();
		if (event.srcElement.parentElement.id.endsWith("searchText")) {
			if (event.keyCode == 13) {
				// submit the form (since I only had one field I have this luxury)
				UTIL.postRequest("keydown", "Enter", Global.rokuAddress, Global.rokuPort, false, true);
				inSender.setValue('');
				this.$.searchTextPopup.close();
				//setTimeout(this.enterKeyContinue.bind(this), 10);
			} else if (event.keyCode == 8) {
				UTIL.postRequest("keypress", "Backspace", Global.rokuAddress, Global.rokuPort, false, true);
			} else {
				if (event.keyCode >= 32) {
					var typedChar = String.fromCharCode(event.keyCode);
					UTIL.postRequest("keypress", "LIT_" + encodeURI(typedChar), Global.rokuAddress, Global.rokuPort, false, true);
				}
			}
		}
	},
	windowRotated: function(inSender) {
		this.setBrowser();
	},
	changeBrowser: function() {
		if (!Global.scaling) {
			this.$.sound.play();
			this.showBrowserVal = !this.showBrowserVal;
			localStorage.setItem(Global.showBrowserKey, this.showBrowserVal);
			this.setBrowser();
		}
	},
	setBrowser: function() {
			var dev = enyo.fetchDeviceInfo();
		Global.log("DEV " + dev);
	Global.log("setBrowser " + Global.scaling);
		if (!Global.scaling) {
			Global.log("setBrowser");
			var win = (enyo.getWindowOrientation() != "up" && enyo.getWindowOrientation() != "down");
			Global.log("setBrowser " + win);
			if (win) {
				Global.log("setBrowser A");
				if (this.$.ChangeBrowserButton) this.$.ChangeBrowserButton.hide();
			} else {
				if (this.$.ChangeBrowserButton) this.$.ChangeBrowserButton.show();
			}
			if (!this.showBrowserVal || win) {
				Global.log("setBrowser B");
				this.$.BrowserRightSlider.hide();
			} else {
				this.$.BrowserRightSlider.show();
				Global.log("setBrowser C");
			}
			Global.log("setBrowser Done");
		}
	},
	siteSelected: function(inSender) {
		if (!Global.scaling) {
			this.$.sound.play();
			Global.startSite = "http://" + inSender.site;
			var wv = this.getComponentByName("TBWebView");
			wv.setUrl(Global.startSite, inSender.site);
			localStorage.setItem(Global.startSiteKey, inSender.site);
		}
	},
	getComponentByName: function(searchName) {
		var arr = this.$.BrowserRightSlider.getComponents();
        for (x in arr) {
			if (arr[x] && arr[x].name == searchName) {
				return arr[x];
			}
		}
		return undefined;
	},
    selectRoku: function(inSender) {
		Global.playBeep();
		if (0 == Global.gDataList.length) {
			//TODO Both of these calls fail?
			// how do these differ from when popup is launched from the dropdown menu?
			//this.openPopup({popup: "popupNetwork"});
			if (Global.scaling) {
				this.$.popupNetworkNarrow.openAtCenter();
			} else {
				this.$.popupNetwork.openAtCenter();
			}
		} else {
			this.$.rokuMenu.openAroundControl(inSender);
		}
    },
	rokuSelected: function(inSender) {
		this.$.sound.play();
		Global.log("DEBUG rokuSelected " + inSender.caption);
		this.setRokuSelected(inSender.caption);
		UTIL.getChannels(Global.rokuAddress, Global.rokuPort);
    },
	setRokuSelected: function(caption) {
        Global.log("setRokuSelected rokuSelected caption " + enyo.json.stringify(caption));
		if (caption == undefined || caption.length == 0) {
			Global.log("setRokuSelected undefined");
			if (Global.gDataList.length == 0) {
				this.$.rokuSelector.setCaption("Add Roku");
			} else {
				this.$.rokuSelector.setCaption("Roku");
			}
		} else {
			this.$.rokuSelector.setCaption(caption);
		}
		for (i in Global.gDataList) {
			if (caption == Global.gDataList[i].displayName) {
				var record = Global.gDataList[i];
        		localStorage.setItem(Global.addressKey, record.displayName);
				Global.rokuAddress = record.octet1 + "." + record.octet2 + "." + record.octet3 + "." + record.octet4;
				Global.localIP_1 = record.octet1;
				Global.localIP_2 = record.octet2;
				Global.localIP_3 = record.octet3;
				Global.log("Setting rokuAddress " + Global.rokuAddress);
				
				// Get channels
				Global.log("UTIL.getChannels " + Global.rokuAddress + ":" +Global.rokuPort ); 
				UTIL.getChannels(Global.rokuAddress, Global.rokuPort);
			}
		}
    },
	setupButtonChannel: function() {
		// this.$.channelMenu.destroyComponents();
		var componentArr = this.$.channelMenu.getComponents();
		Global.log("setupButtonChannel " + 1);
		for (i = componentArr.length - 1; i >= 0; i--) {
		Global.log("setupButtonChannel " + 2 + ":" + i);
			if (componentArr[i] && componentArr[i].selected) {
				Global.log("Destroying component " + i);
				componentArr[i].destroy();
			}
		}
		Global.log("setupButtonChannel " + 3);
		// setup Roku list
		//Global.log("setupChannelButton " + Global.channelList.length);
		if (0 == Global.channelList.length) {
			Global.log("setupChannelButton List is empty");
		} else {
			for (x in Global.channelList) {
				Global.log("Loop setupChannelButton " + x);
				if (Global.channelList[x].name && Global.channelList[x].id) {
					var link = "http://" + Global.rokuAddress + ":" + Global.rokuPort + "/query/icon/" + Global.channelList[x].id;
					Global.log("Image URL:" + link);
					
					//this.$.channelMenu.createComponent({kind: "MenuItem", icon: "http://" + Global.rokuAddress + ":" + Global.rokuPort + "/query/icon/" + Global.channelList[x].id, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
//this.$.channelMenu.createComponent({kind: "MenuItem", caption: Global.channelList[x].name, icon: link, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
//this.$.channelMenu.createComponent({kind: "SizeableImage", zoom: '-15', height:'35', width:'56', src: link, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
//this.$.channelMenu.createComponent({kind: "Image", domAttributes: {width:"35", height:"56"}, src: link, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
//this.$.channelMenu.createComponent({kind: "Image", onclick: "channelSelected", 
//selected: Global.channelList[x].id, owner: this, domAttributes: {width:"112", height:"70"}, src: link
//});
//this.$.channelMenu.createComponent({kind: "IconButton", caption: Global.channelList[x].name, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this, style: "width: 200px; height: 150px; padding: 5px;", icon: link});
//this.$.channelMenu.createComponent({kind: "enyo.Control", nodeTag: "canvas", domAttributes: {width:"35", height:"56"}
Global.log("1");
//var image = new enyo.Image({kind: "Image", src: link, domAttributes: {width:"112", height:"70"}});
//image.onclick = "channelSelected";
//image.selected = Global.channelList[x].id;
//image.owner = this;
//Global.log("Image " + enyo.stringify(image));
//image.domAttributes = {width:"112", height:"70"};
//image.src = link;
//Global.log("2 " + enyo.stringify(image.domAttributes));
//var menuItem = new enyo.MenuItem({kind: "MenuItem", caption: Global.channelList[x].name, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
//menuItem.createComponent(image);
//this.$.channelMenu.components.push({kind: "MenuItem", caption: Global.channelList[x].name, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this, components:[image]});
Global.log("3");
this.$.channelMenu.components.push({kind: "LabeledContainer", onclick: "channelSelected", selected: Global.channelList[x].id, owner: this, label: "  "+Global.channelList[x].name, components: [{kind: "Image", src: link, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this, domAttributes: {width:"112", height:"70"}}]});
//this.$.channelMenu.components.push(hflex);
//
//{kind: "LabeledContainer", label: "3 buttons", components: [{kind: "Image", src: link, domAttributes: {width:"112", height:"70"}}]});
					//this.$.channelMenu.createComponent({caption: Global.channelList[x].name, onclick: "channelSelected", selected: Global.channelList[x].id, owner: this});
					Global.log("setupChannelButton " + Global.channelList[x].name + ":" + Global.channelList[x].id);
				}
			}
		}
		this.$.channelMenu.render();
		Global.log("Done setupChannelButton");
		Global.closeSpinner();
	},
	buttonChannel: function(inSender, event) {
		this.$.sound.play();
		Global.log("OpenAroundControl");
		this.$.channelMenu.openAroundControl(inSender);
		Global.log("OpenAroundControl done");
	},
	selectChannel: function(inSender) {
		this.$.sound.play();
		if (0 == Global.channelList.length) {

		} else {
			this.$.channelMenu.openAroundControl(inSender);
		}
    },
	channelSelected: function(inSender) {
		this.$.sound.play();
		//Global.log(enyo.json.stringify(inSender));
		this.$.channelMenu.close();
		UTIL.postRequest("launch", inSender.selected, Global.rokuAddress, Global.rokuPort, false, true);
    },
    openPopup: function(inSender) {
		this.$.sound.play();
		Global.log("openPopup " + inSender.popup);
		if (!Global.wifiWorking && (inSender.popup == "popupNetwork")) {
			this.popMessage("Please check your local wifi network connection");
		} else {
			var target = inSender.popup;
			if (target == "popupNetwork" && Global.scaling == true) {
				target = "popupNetworkNarrow";
			}
			var p = this.$[target];
			Global.log("openPopup B " + p);
			if (p) {
				p.openAtCenter();
			}
		}
    },
    dialogOpened: function() {
        // focuses the input and enables automatic keyboard mode
        this.$.searchText.forceFocusEnableKeyboard();
    },
    buttonClickLoadHelp: function() {
		this.$.BrowserRightSlider.show();
		this.showBrowserVal = true;
		var wv = this.getComponentByName("TBWebView");
		wv.setUrl("http://" + Global.helpLink);
        this.$.popupHelp.close();
    },
    buttonClick: function() {
        this.$.openAppService.call(
            {id: 'com.palm.app.email',
                  params: {
                          summary: "Kookaroo TouchPad question/comment",
                          text: "Kookaroo support: This information is used if you have a support question. If you're having an issue with screen scaling, please attach a screen shot. X:" + Global.xScale + " Y:" + Global.yScale + " Device:" + enyo.json.stringify(enyo.fetchDeviceInfo()),
                          recipients: [{
                               type:"email",
                              role:1,
                              value:"support@translunardesigns.com",
                              contactDisplay:"Trans Lunar Designs"
                            }]
                      }
              }
        ); 
      },
    openAppMenu: function() {
            var menu = this.myAppMenu || this.$.appMenu;
            menu.open();
    },
    closeAppMenu: function() {
            var menu = this.myAppMenu || this.$.appMenu;
            menu.close();
          },
	setupRokuButton: function() {
		Global.kookarooThis.$.rokuMenu.destroyComponents();
		// setup Roku list
		if (0 == Global.gDataList.length) {
			Global.kookarooThis.$.rokuSelector.setCaption("Add Roku");
		} else {
			for (x in Global.gDataList) {
				if (Global.gDataList[x].displayName) {
					Global.kookarooThis.$.rokuMenu.createComponent({caption: Global.gDataList[x].displayName, onclick: "rokuSelected", selected: x, owner: Global.kookarooThis});
				}
			}
		}
		Global.kookarooThis.$.rokuMenu.createComponent({caption: "Add Roku Box", onclick: "openPopup", popup: "popupNetwork", owner: Global.kookarooThis});
		Global.kookarooThis.$.rokuMenu.render();
		try {Global.kookarooThis.closeSpinner();} catch (ignorePixi) {}
	},
    getHelp: function() {
		this.$.popupHelp.openAtCenter();
    },
    openAppMenu: function() {
        var menu = this.myAppMenu || this.$.appMenu;
        menu.open();
    },
    closeAppMenu: function() {
		var menu = this.myAppMenu || this.$.appMenu;
        menu.close();
    },
	// Networking monitoring  
	statusFinished : function(inSender, inResponse) {
		if (Global.logging) {
			enyo.log("getStatus success, results=" + enyo.json.stringify(inResponse));
			enyo.log("gotStatus , results=" + enyo.json.stringify(inResponse));
		}
		Global.localIP = "";
		Global.wifiWorking = false;
		if (inResponse.isInternetConnectionAvailable) {
			try {
				if (inResponse.wifi.state == "connected") Global.wifiWorking = true;
				Global.localIP = inResponse.wifi.ipAddress;
				var ipArr = Global.localIP.split(".");
				Global.localIP_1 = ipArr[0];
				Global.localIP_2 = ipArr[1];
				Global.localIP_3 = ipArr[2];
			} catch (err) {
				Global.log("Wifi not connected " + err);
			}
		}
		Global.log("NETWORK " + Global.wifiWorking + ":" + Global.localIP);
		//this.pop({message: "NETWORK " + Global.wifiWorking + ":" + Global.localIP});
	},
	statusFail : function(inSender, inResponse) {
		//   enyo.log("getStatus failure, results=" + enyo.json.stringify(inResponse));
		Global.localIP = "";
		Global.wifiWorking = false;
	},
	getStatus : function(inSender, inResponse)
	{
		this.$.getConnMgrStatus.call({ "subscribe": true });
	},
	// popup helper
	pop: function(inSender) {
		this.popMessage(inSender.message);
	},
    popMessage: function(message) {
		//this.$.message = message;
        this.$.HelpPopup.openAtCenter();
		this.$.HelpPopup.setMessage(message);
    },
    popSpinner: function(message) {
		//this.$.message = message;
        this.$.SpinnerPopup.openAtCenter();
		this.$.SpinnerPopup.setMessage(message);
    },
    closeSpinner: function() {
        this.$.SpinnerPopup.close();
    }


});