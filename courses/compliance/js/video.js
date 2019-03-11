var errorDescription = {
	    errorCode: function (code) {
	        var des = ["N/A", "MEDIA_ERR_ABORTED", "MEDIA_ERR_NETWORK", "MEDIA_ERR_DECODE", "MEDIA_ERR_SRC_NOT_SUPPORTED"]
	        return des[code];
	    },
	    networkCode: function (code) {
	        var des = ["NETWORK_EMPTY", "NETWORK_IDLE", "NETWORK_LOADING", "NETWORK_LOADED", "NETWORK_NO_SOURCE"]
	        return des[code];
	    },
	    readyStateCode: function (code) {
	        var des = ["HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA"]
	        return des[code];
	    }
	},
	pageLoaded = false,
	audioEndedEventFired = false,
	videoPlayer,
    mouseIsOverVideo,
	tmr,
    autoplay = true,
	autoloop,
    videoControllerWindow = parent.frames['video'];



$(window).load(function () { //attach, not overwrite

    videoPlayer = document.getElementById("video0");
	
	pageLoaded = true;
});

function onAllowToNavigate(nav){
	//required, but unused in "regular" content pages.
}
function onUpdateUI(nav){
	document.location.href = parent.nav.getPage().url;
}

function onVideoEnded() {
    if (autoloop === true) {

    	videoPlayer.play();

    }
    audioEndedEventFired = true;
    parent.nav.eventCompleted("content"); //send "completed" immediately
    videoControllerWindow.displayPauseIcon(false);
}
function audioError(){
	//codes reference:
	//http://developer.apple.com/library/safari/#documentation/AudioVideo/Reference/HTMLMediaElementClassReference/HTMLMediaElement/HTMLMediaElement.html#//apple_ref/javascript/cl/HTMLMediaElement
	if (typeof(audioPlayer) == 'undefined') videoPlayer = document.getElementById("video0");
	parent.nav.writeToLog("Audio status codes: error(" + (videoPlayer.error == null ? null : videoPlayer.error.code) + ")=" + errorDescription.errorCode((videoPlayer.error == null ? 0 : videoPlayer.error.code))
		+ ", networkState("+videoPlayer.networkState+")=" + errorDescription.networkCode( videoPlayer.networkState )
		+ ", readyState("+videoPlayer.readyState+")=" + errorDescription.readyStateCode( videoPlayer.readyState) 
		+ ", paused=" + videoPlayer.paused 
		+ ", ended=" + videoPlayer.ended 
		+ ", duration=" + videoPlayer.duration );
}		 
function playPause() {
    parent.audioPause();
	//audioPlayer.ended==false is buggy in the iPad
	//alert(videoPlayer.paused+":"+audioEndedEventFired);
	if (audioEndedEventFired) {
		audioEndedEventFired = false;

		videoPlayer.play();
	}
	else {
		if (videoPlayer.paused == true) {
			videoPlayer.play();

		}
		else {
			videoPlayer.pause();

		}
	}
}

function pauseVideo(flag) {
    if (flag) {
        //pause

        videoPlayer.pause();

    }
    else {
        //resume
        if (audioEndedEventFired) return;

        if (videoPlayer.paused == true) videoPlayer.play();

    }
}
 
function playVideo() {
	
	videoPlayer.play();
	$('#icon_playpause').css('background','url(interface/audio_loading.gif)');

}

function loadedMetadata() {
    if (Utilities.isiPad) {
        var videoObj = $('#video0'),
            ratio = videoObj[0].videoWidth / videoObj[0].videoHeight;
        videoObj.animate({
            height: (videoObj.width() / ratio) + "px"
        }, 500);
    }
    videoControllerWindow.displayPauseIcon(true);
}

function updatePositionSlider(){
	parent.frames['video'].updatePositionSlider();
}

function renderMovie(file, autoplay, loop) {
    autoloop = loop;
    this.autoplay = autoplay;

	var str = "<video " + (autoplay ? "autoplay" : "") + " style='max-width:100%;max-height:100%;' playing='onPlaying()' id='video0' xposter='images/none.jpg' onerror='audioError()' onended='onVideoEnded()' onloadedmetadata='loadedMetadata()' onTimeUpdate='updatePositionSlider()'> " +
					"<source src='" + file + "' type='video/mp4' />" +
				"</video>";
	document.write(str);
	videoControllerWindow.init();
	
    parent.showVideoControls(true);
    videoControllerWindow.displayLoadingIcon();
}

