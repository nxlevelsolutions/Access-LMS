
var mp3Player = function(){
	"use strict";
	
	var hasNativeAudio,
		errorDescription = {
			errorCode : function(code){
				var des = ["N/A", "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", "MEDIA_ERR_DECODE", "MEDIA_ERR_SRC_NOT_SUPPORTED"]
				return des[code];
			},
			networkCode: function(code){
				var des = ["NETWORK_EMPTY", "NETWORK_IDLE", "NETWORK_LOADING", "NETWORK_LOADED", "NETWORK_NO_SOURCE"]
				return des[code];
			},
			readyStateCode: function(code){
				var des = ["HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA"]
				return des[code];
			}
		},	
		pageLoaded = false,
		audioPlayer,
		audioFile = "",
		playPauseImageElement,
		rewindImageElement,
		publicInterface;
	 
	function insertFlashFile(file, width, height, oName){
		var nameAttr = null,
		    htm = '';
		if (oName==null || oName=="") {
			nameAttr = "";}
		else{
			nameAttr = "name=\"" + oName + "\" id=\"" + oName + "\"";
		}
		htm+='<OBJECT classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" WIDTH=' + width + ' HEIGHT=' + height + ' ' + nameAttr + '>';
		htm+='<PARAM NAME=movie VALUE="' + file + '">';
		htm+='<PARAM NAME=menu VALUE=false>';
		htm+='<PARAM NAME=allowFullScreen VALUE=true>';
		htm+='<PARAM NAME=allowScriptAccess VALUE=always>';
		htm+='<PARAM NAME=quality VALUE=high>';
		htm+='<param name="wmode" value="transparent">';
		htm+='<EMBED ' + nameAttr + ' src="' + file + '" allowFullScreen="true" wmode="transparent" swLiveConnect="true" allowScriptAccess="always" quality=high MENU=false WIDTH=' + width + ' HEIGHT=' + height + ' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></EMBED>';
		htm+='</OBJECT>';
		$(document.body).append(htm); 
	}	
	
	
	//public interface	
	publicInterface = {
		initialize : function(){
			var obj;
			
			try{
			    hasNativeAudio = (new Audio()) != undefined;
			} 
			catch(e){ 
				hasNativeAudio = false 
			}
			if (hasNativeAudio) {
				obj = document.createElement("audio");	
				obj.setAttribute("id", "mp3AudioPlayer");
				obj.setAttribute("type", "audio/mpeg");
				obj.setAttribute("onerror", "mp3Player.audioError()");
				document.body.appendChild(obj);	 
				
			//http://www.chipwreck.de/blog/2010/03/01/html-5-video-dom-attributes-and-events/
			
				audioPlayer = obj;
				audioPlayer = document.getElementById("mp3AudioPlayer"); 
				audioPlayer.autoplay = true;
				audioPlayer.volume = 0.5; //50% volume default
				audioPlayer.preload="metadata";
			}
			else{
				insertFlashFile("flash/audioPlayer.swf", 1, 1, "mp3AudioPlayer", null);				
			}				
		},
		
		setUIControllers : function(playPauseImageElement, rewindImageElement){
			this.playPauseImageElement = playPauseImageElement;
			this.rewindImageElement = rewindImageElement;
		},
		
		play : function(file){
			//called locally and from parent
			audioFile = file;
			parent.nav.writeToLog("Audio: page audio=\"" + file + "\" (native=" + hasNativeAudio +") in frame " + this.name);
			if (file==undefined || file.length==0){
				this.displayPauseIcon(false);
				if (hasNativeAudio){ //webkit
					if (!isNaN(audioPlayer.duration)) {
						audioPlayer.pause(); //required to stop the audio
						audioPlayer.src = "";
						audioPlayer.load();
					}
				}
				else{ //flash
					audioPlayer.load("");
				}
			}
			else{
				if (hasNativeAudio){
					audioPlayer.src = String(file);
					if (Utilities.isiPad) {
						audioPlayer.load();
					}
					//audioPlayer.play();
					//setTimeout(audioError, 2000)
				}
				else{
					if(audioPlayer!=undefined) audioPlayer.loadFile(file);
					//setTimeout("showError()", 2000)
				}
				this.displayPauseIcon(true);
			}			
		},
		
		stop : function(){
			if (hasNativeAudio){ //webkit
				if (!isNaN(audioPlayer.duration)) {
					audioPlayer.pause(); //required to stop the audio
					audioPlayer.src = "";
					audioPlayer.load();
				}
			}
			else{ //flash
				audioPlayer.load("");
			}			
		},
		
		displayPauseIcon : function displayPauseIcon(flag){
			if (this.playPauseImageElement!=undefined)
				this.playPauseImageElement.src = "interface/audio_" + (flag?"pause":"play") + ".png";
		},	
		
		togglePlayPause : function(){
			//called by user when play/pause button is pressed
			if (hasNativeAudio){
				if (audioPlayer.paused || audioPlayer.ended){
					parent.nav.writeToLog("play() toggle");
					audioPlayer.play();
					this.displayPauseIcon(true);
				}
				else{
					parent.nav.writeToLog("pause() toggle");
					audioPlayer.pause();
					this.displayPauseIcon(false);
				}
			}
			else{
				if (audioPlayer.getPlayingState()=='playing'){
					audioPlayer.audioPause();
					this.displayPauseIcon(false);
				}
				else if (audioPlayer.getPlayingState()=='finished'){
					audioPlayer.audioPlay();
					this.displayPauseIcon(true);
				}
				else{ //it's paused, don't show pause icon
					audioPlayer.audioPlay();
					this.displayPauseIcon(true);
				}
			}
			
		},

		rewindAudio : function(){
			this.play(audioFile);
		},
		audioError : function(errMessage){
			if (hasNativeAudio && parent.nav!=undefined){
				//codes reference:
				//http://developer.apple.com/library/safari/#documentation/AudioVideo/Reference/HTMLMediaElementClassReference/HTMLMediaElement/HTMLMediaElement.html#//apple_ref/javascript/cl/HTMLMediaElement
				if (console!=undefined){
					var str = "Audio status codes: error("+(audioPlayer.error==null?null:audioPlayer.error.code)+")="  + errorDescription.errorCode( (audioPlayer.error==null?0:audioPlayer.error.code) )
						+ ", networkState("+audioPlayer.networkState+")=" + errorDescription.networkCode( audioPlayer.networkState )
						+ ", readyState("+audioPlayer.readyState+")=" + errorDescription.readyStateCode( audioPlayer.readyState) 
						+ ", paused=" + audioPlayer.paused 
						+ ", ended=" + audioPlayer.ended 
						+ ", duration=" + audioPlayer.duration;
					parent.nav.writeToLog(str);
					console.log(str);
				}
			}
			if (!hasNativeAudio && parent.nav!=undefined){
				parent.nav.writeToLog("niftyplayer.swf: " + errMessage);
				console.log("niftyplayer.swf: " + errMessage);
			}
			
		},
		audioEnded: function(){
		 	this.displayPauseIcon(false);
		},
		flashInitialized : function(){
			audioPlayer = document.getElementById("mp3AudioPlayer"); 
			audioPlayer.registerEvent('onSongOver', 'mp3Player.audioEnded');
			audioPlayer.registerEvent('onError', 'mp3Player.audioError');
			audioPlayer.setVolume(50); //50% volume default
			publicInterface.play(audioFile);
		}
		
	}
	
	return publicInterface;
	
}();

function flashInitialized() {
    //this function is called by flash once the 1st frame has loaded
    if (parent.nav!=undefined) parent.nav.writeToLog("mp3Player: flash initialized.");
	mp3Player.flashInitialized();
}

window.onbeforeunload = function () {
    //IE bug fix to Flash function
    this.__flash__removeCallback = function (instance, name) {
        if (instance == null) return;
        instance[name] = null;
    }
}

$(window).load(function() {
	mp3Player.initialize();
});