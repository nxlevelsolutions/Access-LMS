"use strict";
(function( $ ){

	var div,
		offsetX = 12,
		offsetY = 10,
		labelClose,
	    methods = {
		init : function( options ) { 
			// Initialization code (send object after "init")
		},
		show: function (title, contents, location, styles) {
			// Styles:
			// Should be style names: styles can be applied to specific location in tooltips.css
			// .kc-incorrect > #tt_header
			// Apply one or more styles:
			// "tallAndWide" or "tallAndWide customColor-red"

			labelClose = nav.settings.labelClose;
		    var minWidth = 400,
				ttStyles;
			
			div = $("[id^='toolTipDiv']");
			if (div.length !== 0){
				div.remove();
			}
			
			if (contents === undefined && location === undefined) { // In case only content is passed
			    contents = title;
			    title = "";
			}
			
			contents = contents.replace(/&lt;/g, "<");
			contents = contents.replace(/&gt;/g, ">");
			
			if (typeof styles === "string") {
				ttStyles = styles;
				nav.writeToLog("popup style: " + styles);
			} else if (typeof styles === "object" && styles.length > 1) {
				// Might be an array
				ttStyles = styles.join(" ");
				ttStyles = ttStyles.replace(/\./g, "");
			} else if (typeof styles !== "undefined") {
				// Might be object with key/value pairs
				nav.writeToLog("!!! Check showPop styles. Might be key/value pair object - tooltips.js", false);
			}

			div = $(
				"<div id='toolTipDiv' class='tt_standard " + ttStyles + "' style='position:absolute; display:none;' >" +
					"<div id='tt_header' class='primaryColor2'>" +
	 	        		"<div id='tt_title'>" + title + "</div>" +
	    		 		"<div id='tt_close' onclick=$(this).tooltip('hide') >" + labelClose + "</div>" +
					"</div>" +
					"<div id='tt_contents'>" + contents + "</div>" +
				"</div>"
			);
			
			$("body").append(div);
			div.draggable({containment: "parent"});
			// Check if there are images
			div.find('#tt_contents img').on("load", function () {
				repositionAndShow();
			});
			
			// Override location if available
			if (location !== undefined) {
			    if (typeof (location.x) === "string") {
					//$.fn.tooltip.mouseXPos += parseInt(location.x);
					if (location.x.substr((location.x.length -1)) === "%") {
						$.fn.tooltip.mouseXPos = location.x;
					} else {
		            	$.fn.tooltip.mouseXPos += parseInt(location.x);
					}
				}
			    if (typeof (location.x) === "number") {$.fn.tooltip.mouseXPos = location.x;}
			    if (typeof (location.y) === "string") {
					//$.fn.tooltip.mouseYPos += parseInt(location.y);
					if (location.y.substr((location.y.length -1)) == "%") {
						$.fn.tooltip.mouseYPos = location.y;
					} else {
		            	$.fn.tooltip.mouseYPos += parseInt(location.y);
					}
				}
			    if (typeof (location.y) === "number") {$.fn.tooltip.mouseYPos = location.y;}
			}
			
            // Reposition popup
			repositionAndShow(location !== undefined);

		},
		
		showPopAudio: function (url, location) {
			// TODO: Update div to current code as above
		    var minWidth = 400;
			$("#toolTipDiv").hide();
			div = $("#toolTipDivAudio");
			if (div.length===0){
				var startIcon = (Utilities.isiPad)?"interface/audio_play.png":"interface/audio_pause.png";
				/*$("body").append("<div id='toolTipDivAudio' style='min-width:" + minWidth + "px;max-width:550px;display:none; position:absolute;'>" +
                        "<div class='tt_close_button' onclick=$(this).tooltip('hide')></div>" +
						"<div class='tt_title2 tt_title_borders'></div>" +
						"<div class='tt_contents2 tt_content_borders'><iframe src='loading.htm' scrolling='no' frameborder='0' id='popContentFrame' name='popContentFrame' width='100%' height='100%'></iframe></div>" +
						"<img id='tt_play_audio' onclick=$(this).tooltip('togglePlayPause') src='" + startIcon + "' width=26 height=30 />" +
						"</div>");*/
				$("body").append("<div id='toolTipDivAudio' style='min-width:" + minWidth + "px;max-width:550px;display:none; position:absolute;'>" +
								"<div id='tt_header' class='primaryColor2'>" +
										"<div id='tt_title'></div>" +
                    "<img onclick=$(this).tooltip('hide') src='interface/close_button_sm.png' border='0' />" +
                		"</div>" +
								"<div class='tt_contents3'><iframe src='loading.htm' scrolling='no' frameborder='0' id='popContentFrame' name='popContentFrame' width='100%' height='100%'></iframe></div>" +
								"<img id='tt_play_audio' onclick=$(this).tooltip('togglePlayPause') src='" + startIcon + "' width=26 height=30 />" +
								"</div>");
				div = $("#toolTipDivAudio");
				div.draggable();
			} else {
			    div.hide();
			}
			var cf = $("#popContentFrame");
			cf.attr("src", url);
			cf.load(function(){
				$(".tt_title").html( this.contentDocument.title );
				var h = $(this.contentDocument.body).height() + 35; // extra height for player
				$(this).attr("height", h);
				if (frames['popContentFrame'].initialize!=undefined){
					frames['popContentFrame'].initialize(document.getElementById('tt_play_audio'), document.getElementById('tt_rewind_audio')); //pass the playPause button on startup
				}
			});				
			//override location if passed along
			if (location!==undefined){
				$.fn.tooltip.mouseXPos = location.x;
				$.fn.tooltip.mouseYPos = location.y;
			}
			//check if too far to the right
			var overlapX = $(window).width() - $.fn.tooltip.mouseXPos - div.width() - offsetX - 80; //10 padding to the left..otherwise it's flush
			var overlapY = $(window).height() - $.fn.tooltip.mouseYPos - div.height() - offsetY - 10;
			if (overlapX>0) {overlapX = 0;}
			if (overlapY>0) {overlapY = 0;}
			//place on screen and display
			div.css("left", $.fn.tooltip.mouseXPos + offsetX + overlapX);
			div.css("top", $.fn.tooltip.mouseYPos + offsetY + overlapY);
			div.fadeIn("slow");
		},

		hide : function() { 
			var cf = $("#popContentFrame");
			if(cf !== undefined){
				cf.attr("src", "loading.htm");
			}
		
			//audioPlay();//resume playing audio
			if(typeof($.fn.tooltip.callback) === "function"){
				$.fn.tooltip.callback.call();
			}
			if (div === undefined) {return;}
			div.fadeOut("fast", function(){
				$(this).remove();
			});
		},
		update : function(title, contents) { 
			div.find(".tt_title").html(title);
			contents = contents.replace(/&lt;/g, "<");
			contents = contents.replace(/&gt;/g, ">");
			div.find(".tt_contents").html(contents);
		},
		isOpen: function () {
		    var ret;
		    if ($.fn.tooltip.root === window) {
		        if (div === undefined) {
		            ret = false;
		        }
		        else {
		            ret = div.is(":visible");
		        }
		    }
		    else {
		        ret = $.fn.tooltip.root.$.fn.tooltip("isOpen");
		    }
		    return ret;
		}
	};
	
	function repositionAndShow(isLocationSpecified) {
		var newLeft,
			newTop;
		if (isLocationSpecified){
			newLeft = $.fn.tooltip.mouseXPos;
			newTop = $.fn.tooltip.mouseYPos;
		}
		else{
			var overlapX = $(window).width() - $.fn.tooltip.mouseXPos - div.width() - offsetX - 10; //offsetX set at top; 10px padding to the left..otherwise it's flush
			var overlapY = $(window).height() - $.fn.tooltip.mouseYPos - div.height() - offsetY - 10; //offsetY set at top; 10px padding at the top..otherwise it's flush
			if (overlapX > 0) {overlapX = 0;}
			if (overlapY > 0) {overlapY = 0;}
			// Figure new location
			newLeft = $.fn.tooltip.mouseXPos + offsetX + overlapX;
			newTop = $.fn.tooltip.mouseYPos + offsetY + overlapY;
		}

		// Place on screen and display
		// Check if percentages are used, adjust for width and height
//		if(newLeft.toString().slice(-1) === "%") {
//			div.css("margin-left", ((div.width() * -1) / 2));
//		}
//		if(newTop.toString().slice(-1) === "%") {
//			div.css("margin-top", ((div.height() * -1) / 2));
//		}
		div.css("left", newLeft);
		div.css("top", newTop);
		div.fadeIn("slow");
	}  
  
  
	$.fn.tooltip = function(method) {  
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} 
		else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} 
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.tooltip (tooltips.js)' );
		}   
  };
  
})( jQuery );

 
$(document).ready(function(e) {
	// Get window root of course
	$.fn.tooltip.root = function(){
		var w = window;
		while (window.top !== w){
			if (typeof(w.initialize) === 'function'){
				break;
			}
			else{
				w = w.parent;
			}
		}
		return w;
	}();
	// Set coordinates at the root level of the course
	$(document).mousemove(function (e) {
        // TODO: coordinates should be dynamic!.. not specific to iframe
	    if (window.name === "main") {
	        ($.fn.tooltip.root).$.fn.tooltip.mouseXPos = e.pageX;
	        ($.fn.tooltip.root).$.fn.tooltip.mouseYPos = e.pageY;
	    }
	    else {
			// Why are we using e.screenX/Y instead of e.pageX/Y? Screen is position in monitor, not browser window.
	        ($.fn.tooltip.root).$.fn.tooltip.mouseXPos = e.screenX;
	        ($.fn.tooltip.root).$.fn.tooltip.mouseYPos = e.screenY;
	    }
	});
});

function showPop(title, tip, location, targetWin, styles) {
    var rootWin = $.fn.tooltip.root;
    if (typeof (targetWin) === 'undefined') {
        // Default to root of course
        if (typeof (rootWin.updateHotSpots) === "function") {rootWin.updateHotSpots();}
    }
    else {
        // Override in case hotspots are in subcourse
        if (typeof (targetWin.updateHotSpots) === "function") {targetWin.updateHotSpots();}
    }
	rootWin.$.fn.tooltip("show", title, tip, location, styles);
}

function showPopWithAudio(url, location){
	var rootWin = $.fn.tooltip.root;
	if (typeof(rootWin.audioPause)==="function")	{rootWin.audioPause();}
	if (typeof(rootWin.updateHotSpots)==="function")	{rootWin.updateHotSpots();}
	rootWin.$.fn.tooltip("showPopAudio", url, location);
}

function hidePop(){
	var rootWin = $.fn.tooltip.root;
	if (rootWin !== undefined){
		rootWin.$.fn.tooltip('hide');
	}
}

// Set global key press handlers to main course obj
$(document).keydown(function (e) {
    course.keyDown(e);
});
$(document).keyup(function (e) {
    course.keyUp(e);
});