var Utilities = {
    isChrome  : (navigator.userAgent.match(/Chrome/i) != null),
	isIE      : (Object.hasOwnProperty.call(window, "ActiveXObject")),
	isiPad    : (navigator.userAgent.match(/iPad/i) != null), 
	isWin     : (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false,
	isOpera: ((navigator.userAgent.indexOf("Opera") != -1) ? true : false),

	transitionsAvailable: function(){
	    return ('WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'OTransform' in document.body.style || 'transform' in document.body.style);
	 },
	
	launchSizableCustomPopUp: function (page, w, h) {
	    if (typeof (updateHotSpots) == 'function') updateHotSpots();
	    if (typeof (parent.updateHotSpots) == 'function') parent.updateHotSpots();
		var puWin = window.open(page,"puWindow","dependent,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=yes,titlebar=yes,screenX=150,screenY=150,top=150,left=150, width=" + w + ",height=" + h );
		puWin.focus();
	},
	
	insertFlashFile : function(file, width, height, oName, flVars){
		var nameAttr = null;
		if (oName==null || oName=="") {
			nameAttr = "";}
		else{
			nameAttr = "name=\"" + oName + "\" id=\"" + oName + "\"";
		}
		htm ='<OBJECT classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" WIDTH=' + width + ' HEIGHT=' + height + ' ' + nameAttr + '>';
		htm+='<PARAM NAME=movie VALUE="' + file + '">';
		htm+='<PARAM NAME=menu VALUE=false>';
		htm+='<PARAM NAME=allowFullScreen VALUE=true>';
		htm+='<PARAM NAME=allowScriptAccess VALUE=always>';
		htm+='<PARAM NAME=quality VALUE=high>';
		htm+='<param name="wmode" value="transparent">';
		if (flVars!=null) htm+='<PARAM NAME=FlashVars VALUE=' + flVars + '>';
		htm+='<EMBED ' + nameAttr + ' src="' + file + '" FlashVars="' + flVars + '" allowFullScreen="true" wmode="transparent" swLiveConnect="true" allowScriptAccess="always" quality=high MENU=false WIDTH=' + width + ' HEIGHT=' + height + ' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></EMBED>';
		htm+='</OBJECT>';
		document.write(htm);
	},
	
	getFlashMovieObject : function (movieName) {
		if (navigator.appName.indexOf("Microsoft Internet")==-1){
		    var nList = window.document[movieName];
		    if (nList == "[object HTMLEmbedElement]") return nList;
		    for (var i = 0; i < nList.length; i++) {
				if (nList[i]=="[object HTMLEmbedElement]") return nList[i];
			}
		}
		else {
			return window.document[movieName];
		}
	},

	getElementLocation : function(elementId){
		var el = document.getElementById(elementId);
		var xDist = 0;
		var yDist = 0;
		if (el.offsetParent) {
			do {
				xDist += el.offsetLeft;
			} while (el = el.offsetParent);
			el = document.getElementById(elementId);
			do {
				yDist += el.offsetTop;
			} while (el = el.offsetParent);
			
		}
		else{
			alert("getElementLocation: N/A");
		}
		return {left:xDist, top:yDist};
	},
	
	setElementLocation :  function(elementId, location){
		var el = document.getElementById(elementId);
		$(el).css("left", location.x);
		$(el).css("top", location.y);
	},
	
	getElementSize : function(elementId){
		var el = document.getElementById(elementId);
		return {width:el.offsetWidth, height:el.offsetHeight};
	},
	
	setElementSize : function(elementId, size){
		var el = document.getElementById(elementId);
		$(el).css("width", size.width);
		$(el).css("height", size.height);
	},
	getObjects : function (obj, key, val) {
		//obj=object to scan; key=property being searched, val=optional (value of property)
		//returns array
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(this.getObjects(obj[i], key, val));
			} 
			else if ((i == key && obj[key] == val) || (i == key && val==undefined)) {
				objects.push(obj);
			}
		}
		return objects;
	},
	getFilename : function(url){
		if (url==undefined){
			url = document.location.href;
		}
		var i = url.lastIndexOf("/"),
			ret = "";
		if (i>-1){
			ret = url.substring(i+1);
		}
		i = url.lastIndexOf("\\")
		if (i>-1){
			ret = url.substring(i+1);
		}
		return ret;
	},
	trim : function (text){
		text = text.replace(/^\s+/, "");
		for (var i = text.length - 1; i >= 0; i--) {
			if (/\S/.test(text.charAt(i))) {
				text = text.substring(0, i + 1);
				break;
			}
		}
		return text;
	},
	getQueryStringValue: function (url, key) {
	    var query = window.location.search.substring(1);
	    var vars = query.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('=');
	        if (decodeURIComponent(pair[0]).toLowerCase() == key.toLowerCase()) {
	            return decodeURIComponent(pair[1]);
	        }
	    }
	    return "";
	},
	log: function (msg) {
	    if (typeof (nav) == "undefined") {
	        if (typeof (console) != "undefined") {
	            console.log(msg);
	        }
	    }
	    else {
	        nav.writeToLog(msg);
	    }
	},
	removeHtmlTags: function (str) {
	    return str.replace(/<\/?[^>]+(>|$)/gi, "");
	},
	getCourseWindow: function () {
	    var w = window;
	    while (window.top != w) {
	        if (typeof (w.initialize) == 'function') {
	            break;
	        }
	        else {
	            w = w.parent;
	        }
	    }
	    return w;
	},
	getNaturalWidth: function (graphic) {
	    if (graphic.naturalWidth == undefined) {
	        var img = new Image();
	        img.src = graphic.src;
	        return img.width;
	    }
	    else {
	        return graphic.naturalWidth;
	    }
	},
	getNaturalHeight: function (graphic) {
	    if (graphic.naturalHeight == undefined) {
	        var img = new Image();
	        img.src = graphic.src;
	        return img.height;
	    }
	    else {
	        return graphic.naturalHeight;
	    }
	},
	resetMainGraphicSize: function () {
	    var img = $("#graphic"); //$("img[id=graphic]")
	    if (img.length == 1) {
	        var parent = img.parents("div[class*='imgBlock']");//hotspots are deeper level
	        if (parent.length == 1) { 
	            var divHeight = parent.height(),
	                divWidth = parent.width(),
                    imgWidth = img.width(),
                    imgHeight = img.height(),
	                imgSyle = img[0].style,
                    newImgWidth = imgWidth * divHeight / imgHeight, //at height=100%
	                newImgHeight = imgHeight * divWidth / imgWidth; //at width =100%
	            /*if (newImgWidth < divWidth) {
	                imgSyle.height = "100%";
	                imgSyle.width = "auto";
	            }
	            else {
	                imgSyle.height = "auto";
	                imgSyle.width = "100%";
	            }*/
				imgSyle.maxWidth = "100%";
				imgSyle.maxHeight = "100%";
	        }
	        else {
	            alert("Unable to find proper imgBlock sizing div. Check template's class items.");
	        }
	    }
	},
	debounce: function() {
		var timers = {};
		return function(func, wait){
			clearTimeout(timers[func.toString()]);
			timers[func.toString()] = setTimeout(func, wait);
		}
	}(),
	
	Xdebounce: function (func, wait, timerId) {
		clearTimeout(timerId);
		timerId = setTimeout(func, wait);
		return timerId;
	}
}


var course = {
    exitModule: function () {
        if (confirm(nav.settings.labelExitMsg)) {
            if (typeof (window.external) != "undefined" && typeof (window.external.playerWindowClose) != "undefined") {
                window.external.playerWindowClose();
	        }
	        else {
                top.close();
	        }
		}
	},
	
	openResume : function(){
		$('#pop-background').show();
		$('#frameResume').fadeIn("fast");
	},
	
	closeResume : function(){
		$('#pop-background').hide();
		$('#frameResume').fadeOut("fast");
	},
	
	openTOC : function(){		
		if (typeof(navigationEnabled)=="function" && navigationEnabled()==false ) return;
		hidePop(); 
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPause();
		}
		else {
			audioPause();
		}
		frames["toc"].renderToc();
		$('#pop-background').show();
		$('#frameToc').fadeIn("fast", function(){
			var root = Utilities.getCourseWindow();
			root.frames['toc'].window.focus(); //enable ESC key;
		});
	},
	
	hideTOC : function(){
		if ($("#frameSubCourse").is(':visible')){
		    frames["subCourse"].audioPlay();
		}
		else {
			audioPlay();
		}
		$('#pop-background').hide();
		$('#frameToc').fadeOut("fast");
	},
	
	openGlossary : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPause();
		}
		else {
			audioPause();
		}
		$('#pop-background').show();
		$('#frameGlossary').fadeIn("fast");
	},
	
	hideGlossary : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPlay();
		}
		else {
			audioPlay();
		}
		$('#pop-background').hide();
		$('#frameGlossary').fadeOut("fast");
	},

	openReferences : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPause();
		}
		else {
			audioPause();
		}
		$('#pop-background').show();
		$('#frameReferences').fadeIn("fast");
	},

	hideReferences : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPlay();
		}
		else {
			audioPlay();
		}
		$('#pop-background').hide();
		$('#frameReferences').fadeOut("fast");
	},

	openResources : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPause();
		}
		else {
			audioPause();
		}
		$('#pop-background').show();
		$( "#frameResources" ).show().animate({
			height: "80%"
		}, 500, function() {
			// Animation complete.
		});
	},

	hideResources : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPlay();
		}
		else {
			audioPlay();
		}
		$('#pop-background').hide();
		$('#frameResources').fadeOut("fast");
	},
			
	openHelp : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPause();
		}
		else {
			audioPause();
		}
		$('#pop-background').show();
		$('#frameHelp').show(); //fadeIn("fast");
		window.frames['help'].contentWindow.focus(); //enable ESC key;
	},
	
	hideHelp : function(){
		if ($("#frameSubCourse").is(':visible')){
			frames["subCourse"].audioPlay();
		}
		else {
			audioPlay();
		}
		$('#pop-background').hide();
		$('#frameHelp').hide();//can't fadeOut here.. strange bug makes 2 other layers disappear.
	},

	keyDown: function (e) {
	    //var root = Utilities.getCourseWindow();
	    //if (root == window) {
	    //    if (e.ctrlKey) this.ctrlKeyPressed = true;
	    //}
	    //else {
	    //    root.course.keyDown(e);
	    //}
	},
	
	keyUp: function (e) {
	    var root = Utilities.getCourseWindow();
	    if (root == window) {
			if (nav && e.altKey){
				//show logger
				if (nav.settings.loggerEnabled && e.keyCode == nav.settings.loggerKeyCode) {     // <ctrl> AND letter q key up
					var logWin = frames["logger"].contentWindow || frames["logger"];
					logWin.refresh();
					$("#frameLogger").fadeIn();
				}
				//move to next page
				if (e.keyCode == nav.settings.pageNextKeyCode) {
					root.frames['backNext'].rightArrowKeyPressed();
				} 
				//move to previous page
				if (e.keyCode == nav.settings.pageBackKeyCode) { 
					root.frames['backNext'].leftArrowKeyPressed();
				}
				//show TOC
				if (e.keyCode == nav.settings.tocKeyCode) {      
					root.frames['menu'].openTOC();
				}
				//show Transcript
				if (e.keyCode == nav.settings.transcriptKeyCode) {      
					root.toggleTranscript();
				}
				//show Help
				if (e.keyCode == nav.settings.helpKeyCode) {      
					root.course.openHelp();
				}
				//show ToolBox
				if (e.keyCode == nav.settings.toolboxKeyCode) {      
					root.frames['menu'].resources();
				}
				//pause audio
				if (e.keyCode == nav.settings.audioPlayPauseKeyCode) {      
					root.frames['audio'].togglePlayPause();
				}
				//exit course
				if (e.keyCode == nav.settings.exitCourseKeyCode) {      
					root.course.exitModule();
				}

			}
	    }
	    else {
	        root.course.keyUp(e);
	    }
	}

}

function openSubCourse(url, onCompleteCallback) {
    //must be in global namespace, used everywhere
    parent.openSubCourse(url, onCompleteCallback);
}

function openSubCourseRight(url){
    //must be in global namespace, used everywhere
    parent.openSubCourseRight(url);
}
 
function getFlashMovieObject(movieName) {
    //must be in global namespace, for int_*.js files (backwards compatible)
    return Utilities.getFlashMovieObject(movieName);
}

function shuffleArray(array) {
	// Fisher–Yates shuffle
	var m = array.length, t, i;
	
	// While there remain elements to shuffle…
	while (m) {
	
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		
		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	
	return array;
}

//-------------------------------
//extensions to global prototypes
if (typeof (String.prototype.startsWith) != "function") {
    String.prototype.startsWith = function (str) {
        //returns if prototype string begins with str
        return this.indexOf(str) == 0;
    };
}
if (typeof (Array.prototype.shuffle) != "function") {
    Array.prototype.shuffle = function () {
        //returns a new randomized array 
        var copy = this.slice(),
            i = copy.length,
            j,
            temp;
        if (i == 0) return [];
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    };
}
if (typeof (Array.prototype.indexOf) != "function") {
    Array.prototype.indexOf = function (value) {
        for (var i=0; i< this.length; i++){
			if (this[i]==value) return i;
		}
        return -1;
    };
}

//-------------------------------
//extensions to jquery 
$.cssHooks.backgroundColor = {
    get: function (elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["backgroundColor"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}

//set global key press handlers to main course obj
$(document).keyup(function (e) {
    course.keyUp(e);
	return false; //for IE
});