var pageLoaded = false,
	currentCheckmarkId = '',
    currentMap,
    otherRequiredItems, //links/buttons with [role=required]
    graphic; //global scope

parent.HotSpotsFrame = this;

function onAllowToNavigate(nav){ 
	// Required as per framework
}

function onUpdateUI(nav){ //required as per framework
	document.location.href = parent.nav.getPage().url;
}

function setPageViewed(){ 
	parent.HotSpotsFrame = undefined; //reset after we leave
}
function onPageLoaded() {
    
    pageLoaded = true;
    if (parent.nav==undefined) return;
	 
    var rawData,
        delimiter = "|";
    
    //if the var hotSpotData is available, use it.
    //this allows individual pages (file inserts) to set their
    //own hotSpot data.
    if (typeof(hotSpotData)=="undefined"){
        rawData = parent.nav.getPage().data
    }    
    else{
        rawData = hotSpotData;
    }
    
    rawData = rawData.replace(/&lt;/g, '<');
    rawData = rawData.replace(/&gt;/g, '>');
    rawData = rawData.replace(/\r|\r/g, '');    //return or line feed chars
    rawData = rawData.replace(new RegExp(String.fromCharCode(8217), 'g'), '&rsquo;');   //right curved single quote
    rawData = $.trim(rawData);
    if (rawData.substring(rawData.length - 1) == ";" || rawData.substring(rawData.length - 1) == "|") {
        rawData = rawData.substring(0, rawData.length - 1);
    }
  
    var dataArray = rawData.split(delimiter),
        bookm = parent.nav.getPage().bookmark,
	    arr = new Array(),
      str = "<map name='hotSpotMap'>",
      allDone = true;
    graphic = $("#graphic");
		
    if (bookm.length>0){
        arr = bookm.split("");}
    else{
        arr = Array(dataArray.length);
    }

    //prepare map
    for (var i = 0; i < dataArray.length; i++) {
        var hsData = $.trim(dataArray[i]).split(","),  
		    area = { shape: "", coords: "", js: "setCurrentHS(this);" },
            disp,
			h;
        if (!isNaN(hsData[0])) hsData.unshift("rect"); // Default to 'rect' for backwards compatibility
        area.shape = $.trim(hsData[0].toLowerCase());
        switch (area.shape) {
            case "rect":
                area.coords += hsData[1] + "," + hsData[2] + ",";
                area.coords += (Number(hsData[1]) + Number(hsData[3])) + ",";
                area.coords += (Number(hsData[2]) + Number(hsData[4])) + ",";
                h = 5;
                break;
            case "circle":
                for (h = 1; h < 4; h++) {
                    area.coords += hsData[h] + ",";
                }
                break;
            case "poly":
                for (h = 1; (h < hsData.length && !isNaN(hsData[h])) ; h++) {
                    area.coords += hsData[h] + ",";
                }
                break;
        }

        //check if visible or not 
//        if (arr[i] == "1") {
//            disp = "block";
//        }
//        else {
//            disp = "none";
//            allDone = false;
//        }
        // Add checkmarks
        //$(document.body).append("<div id='cm" + i + "' origX='" + hsData[1] + "' origY='" + hsData[2] + "' class='checkmark' style='display:" + disp + ";'></div>");
		
        // Set areas
        for (; h < hsData.length; h++) {
            area.js += hsData[h] + ",";
        }
        area.coords = area.coords.substr(0, area.coords.length - 1);
        area.js = area.js.substr(0, area.js.length - 1);
        area.js = area.js.replace(/"/g, '\"');
        str += "<area shape='" + area.shape + "' coords='" + area.coords + "' href='#' onclick=\"javascript:" + area.js + "\" data-area-key='" + i + "' />";

        parent.nav.writeToLog("hotSpot: creating hotspot for a '" + area.shape + "'");
    }
    str += "</map>";
    $('map[name=hotSpotMap]').remove();
    $(document.body).append(str);

    // Figure out css value from style sheet
    var hs_default = $('<div class="hotspot" style="display:none" />');
    $(document.body).append(hs_default);
    var backcolor = hs_default.css('background-color'),
        opacity = hs_default.css('opacity');
    //if (opacity == undefined) {
    //    var filter = hs_default[0].style.filter;
    //    opacity = Number(hs_default.css('filter').replace(/[^0-9\.]+/g, '')) / 100;
    //}
    backcolor = backcolor.replace("#", "");
    hs_default.remove();

    // http://www.outsharked.com/imagemapster/default.aspx?docs.html
    graphic.attr("usemap", "#hotSpotMap").mapster({
        singleSelect: true,
        fillColor: backcolor,
        fill: true,
        fillOpacity: opacity,
        clickNavigate: false,
        scaleMap: true,
        stroke: true,
        strokeOpacity: .6,
        strokeColor: '000000',
        strokeWidth: 1 
    });

    // Wedge a fix to mapster to shift image to right
    //$('[id^=mapster_wrap_').css('float', 'right');

    //reposition all checkmarks AFTER float=right above and after mapster has been created
	$(document).find("[id^=cm]").each(function (i, div) {
	    var ckmDiv = $(div),
            offset = graphic.offset(),
            ratioW = graphic.width() / Utilities.getNaturalWidth(graphic[0]),
            ratioH = graphic.height() / Utilities.getNaturalHeight(graphic[0]),
            nLeft,
            nTop;
	    nLeft = (Number(ckmDiv.attr("origX")) * ratioW + offset.left) - graphic.position().left, //position().left is used by IE9 while offset() is +, 0 in others.
        nTop = (Number(ckmDiv.attr("origY")) * ratioH + offset.top);
	    ckmDiv.css('left', nLeft);
	    ckmDiv.css('top', nTop);
	});

    //add checkmarks to other required items
	for (var t = 0; t < otherRequiredItems.length; t++) {
	    if (bookm.substr(t + i, 1) == '1') {
	        addRequiredCheckmark($(otherRequiredItems[t]));
	    }
	}

	// Set completion
//	if (allDone && !parent.nav.settings.gated){
	    parent.nav.eventCompleted("content");
		parent.nav.saveBookmark();
// 	}
}

function setCurrentHS(area) {
    currentMap = $(area);
    var key = currentMap.attr("data-area-key");
//    currentCheckmarkId = "#cm" + key;
}
 
// This funcion is called by the shell/parent in response to an unknown item being closed
function showCheck() {
	if (currentCheckmarkId=='') return;
	$(currentCheckmarkId).show();
    setTimeout(function () {
        currentMap.mapster('deselect');
    }, 800);
	
    saveStatusBookmark();
}

function saveStatusBookmark() {
	var newBookmark = "";

    // Scan other required items
    otherRequiredItems.each(function (i, el) {
        newBookmark += $(el).attr("checked") ? "1" : "0";
    });

    // Save new bookmark
    parent.nav.getPage().bookmark = newBookmark;
    if (newBookmark.indexOf("0") == -1 && parent.nav.settings.gated) {
        parent.nav.eventCompleted("content");
    }
    parent.nav.saveBookmark(true);

}

function addRequiredCheckmark(element) {
    //function called by "otherRequiredItems" ONLY
    if (element.attr("checked") != "checked") {
        // Place it next to "A" element and 40 px to left by default
        var l = element.position().left, //-40
            t = element.position().top; //+ $("div[id^='txtBlock']").children().scrollTop()
        l = (l < 0) ? 0 : l;
        // Do override if "left" parameter exists
        if (element.attr("checkmarkleft") != undefined) {
            l = element.position().left + Number(element.attr("checkmarkleft"));
        }
        element.after("<div class='checkmark' style='left:" + l + "px; top:" + t + "px'></div>");
        element.attr("checked", true);
    }
    saveStatusBookmark();
}

function relocateRequiredCheckmarks() {
    for (var i = 0; i < otherRequiredItems.length; i++) {
        var element = $(otherRequiredItems[i]),
            l = element.position().left,
            t = element.position().top,
            checkmark = element.next();
        l = (l < 0) ? 0 : l;
        if (element.attr("checkmarkleft") != undefined) { //do override if "left" parameter exists
            l = element.position().left + Number(element.attr("checkmarkleft"));
        }
        checkmark.css('left', l).css('top', t);
    }
}

function clearCheckmarksAndImageMap() {
    $(document).find("[id^=cm]").remove(); //added back on onPageLoaded
    //wipe out mapster stuff
    var parent = $("#graphic").parents("div[class*='imgBlock']");
    if (parent.length == 1) {
        var copy = $(parent[0]).clone(true);
        $(parent[0]).html('');
        var oldImgTag = copy.find('img[id=graphic]');
        oldImgTag.attr("style", "");
        $(parent[0]).append(oldImgTag);
    }
}

if (Utilities.isiPad) {
    $(top.window).on("orientationchange", function () {
        relocateRequiredCheckmarks();
        clearCheckmarksAndImageMap();
        onPageLoaded();
    });
}
else {
    $(window).resize(function (e) {
        Utilities.debounce(function () {
            relocateRequiredCheckmarks();
            clearCheckmarksAndImageMap();
            onPageLoaded();
        }, 250);
    });
}

$(document).ready(function () {
    // Add checkmark to non-required (non-hotspot) items - if any
    otherRequiredItems = $("*[role='required']");
    otherRequiredItems.click(function () {
        if ($(this).attr("noautocheck") == undefined) {
            addRequiredCheckmark($(this));
        }
    });

});