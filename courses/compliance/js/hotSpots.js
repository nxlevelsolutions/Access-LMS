/* ________________
 * hotSpots v2
 * ----------------
 * Sets up clickable hot spot areas on an image map. 
 * parameters: imageId = image id where to attach the map to
 *             rawMapData = image map coordinates from iprism
 */

function hotSpots(imageId, rawMapData){
    "use strict";
    var currentMap,
        dataArray,
        //otherRequiredItems, //links/buttons with [role=required]
        selectedArea,
        graphic,
        delimiter = "|",
        objInt = {
            showCheckmark: function () {
                if (!selectedArea) return;
                var index = selectedArea.attr("area-index");
                $('#__cm' + index).show();
                saveStatusBookmark();
            }
        },
        MAP_NAME = "__imageMap";


    function saveStatusBookmark() {

        //scan regular hotspots
        var newBookmark = "";
        $(document).find("[id^=__cm]").each(function (i, img) {
            newBookmark += $(img).is(":visible") ? "1" : "0";
        });

        //save new bookmark
        parent.nav.getPage().bookmark = newBookmark;
        if (newBookmark.indexOf("0") == -1 && parent.nav.settings.gated) {
            parent.nav.eventCompleted("content");
        }
        parent.nav.saveBookmark(true);

    }

    rawMapData = rawMapData.replace(/&lt;/g, '<');
    rawMapData = rawMapData.replace(/&gt;/g, '>');
    rawMapData = rawMapData.replace(/\r|\r/g, '');    //return or line feed chars
    rawMapData = rawMapData.replace(new RegExp(String.fromCharCode(8217), 'g'), '&rsquo;');   //right curved single quote
    rawMapData = $.trim(rawMapData);
    if (rawMapData.substring(rawMapData.length - 1) == ";" || rawMapData.substring(rawMapData.length - 1) == "|") {
        rawMapData = rawMapData.substring(0, rawMapData.length - 1);
    }
  
    dataArray = rawMapData.split(delimiter);
	
    var bookm = parent.nav.getPage().bookmark,
	    arr = new Array(),
        map = $("<map name='" + MAP_NAME + "'></map>"),
        shape,
        allDone = true;
    graphic = $("#" + imageId);
    if (bookm.length>0){
        arr = bookm.split("");}
    else{
        arr = Array(dataArray.length);
    }

    //prepare map
    for (var i = 0; i < dataArray.length; i++) {
        var hsData = $.trim(dataArray[i]).split(","),  
			funcName,
		    area = { shape: "", coords: "", js: "" },
            disp,
			h;
        if (!isNaN(hsData[0])) hsData.unshift("rect"); //default to 'rect' for backwards compatibility
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
        if (arr[i] == "1") {
            disp = "block";
        }
        else {
            disp = "none";
            allDone = false;
        }
        
        //add checkmarks
        $(document.body).append("<div id='__cm" + i + "' origX='" + hsData[1] + "' origY='" + hsData[2] + "' class='checkmark' style='display:" + disp + ";'></div>");
		
        //set areas
        for (; h < hsData.length; h++) {
            area.js += hsData[h] + ",";
        }
        area.coords = area.coords.substr(0, area.coords.length - 1);
        area.js = area.js.substr(0, area.js.length - 1);
        area.js = area.js.replace(/"/g, '\"');
        shape = $("<area shape='" + area.shape + "' coords='" + area.coords + "' href='javascript:void(0)'/>");
        shape.attr("area-function", area.js);
        shape.attr("area-index", i);
        shape.on("click", function (evt) {
            selectedArea = $(this);
            eval(selectedArea.attr("area-function"))
        });
        map.append(shape);
        parent.nav.writeToLog("hotSpot: creating hotspot for a '" + area.shape + "'");
    }
    $(document.body).append(map);
    $('#' + imageId).resizableImageMap(MAP_NAME);

    //reposition all checkmarks - they're position:absolute
    relocateCheckmarks();

	//set completion
	if (allDone && !parent.nav.settings.gated){
	    parent.nav.eventCompleted("content");
		parent.nav.saveBookmark();
 	}

    //relocate checkmarks if image changes size
    if (Utilities.isiPad) {
        $(top.window).on("orientationchange", function () {
            relocateCheckmarks();
        });
    }
    else {
        $(window).resize(function (e) {
            Utilities.debounce(function () {
                relocateCheckmarks();
            }, 150);
        });
    }

    function relocateCheckmarks() {
        $(document).find("[id^=__cm]").each(function (i, div) {
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
    }

    return objInt;

}
 