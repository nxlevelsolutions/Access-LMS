function Sequence(nav, containerId, onSecuenceReady) {
    //"use strict";
    var cueTimes = new Array(),
        idx,
        lastRendered = -1,
        setCss = false,
        displayItems,
        userSelectedAudio = function () {
            var ret = true;
            if (parent.userSelectedAudio == undefined) {
                if (parent.parent.userSelectedAudio != undefined) {
                    ret = parent.parent.userSelectedAudio;
                }
            }
            else {
                ret = parent.userSelectedAudio;
            }
            return ret;
        }(),
        audioFile,
        allImages = [],
        imgLoadCallbacks = {},
        imgDisplayCallbacks = {},
        completeOnAudioEnd = true; //allow override by content


    function parseXmlData(xmlDoc) {

        idx = 0;
        var removeNextTxt = false,
            removeNextImg = false,
            xmlDoc = $(xmlDoc),
            thereAreImages = false;

        audioFile = xmlDoc.attr("audioFile");
        displayItems = xmlDoc.find("item");

        var imgs = new Array(),
            txts = new Array(),
            def,
            defImgPos;

        displayItems.each(function (i, el) {

            var txtNode = $(el).find("text"),
                imgNode = $(el).find("image"),
                txt = txtNode.text(),
                str;

            if (txt.toLowerCase().substring(0, 11) == "javascript:") {
                txt = txt.replace(/\"/g, "'");
                $("#" + containerId).append("<div id='txt" + i + "' style='display:none;width:100%;' onvisible=\"" + txt + "\"></div>");
            }
            else {
                $("#" + containerId).append("<div id='txt" + i + "' style='display:none;width:100%;'>" + txt + "</div>");
            }

            var imgSrc = imgNode.text(),
                newImg;
            if (imgSrc.length > 0) {
                thereAreImages = true;
                newImg = $("<img id='graphic" + i + "' class='graphic' src='" + imgSrc + "'/>");
                allImages.push(newImg);
                newImg.on("load", function () {
                    var allReady = true;
                    for (var i = 0; i < allImages.length; i++) {
                        if (allImages[i].attr('id') == this.id) {
                            allImages[i].attr('ready', 1);
                            break;
                        }
                    }
                    for (var i = 0; i < allImages.length; i++) {
                        if (allImages[i].attr('ready') != '1') {
                            allReady = false;
                            break;
                        }
                    }
                    if (allReady) {
                        //all images have been loaded
                        if (userSelectedAudio) {
                            parent.addMediaEventListener(window);
                            parent.setMp3Controller(audioFile);
                        }
                        else {
                            renderItem(cueTimes.length - 1);
                        }
                    }
                });
            }

            var newDiv = $("<div class='img' id='img" + i + "' style='display:none;'></div");
            newDiv.append(newImg);
            $("#seqImgBlock").append(newDiv);

            //check callbacks on load
            if (imgSrc.length > 0) {
                newImg.attr('onload', function (i, img) {
                    for (var c in imgLoadCallbacks) {
                        if (c == i) {
                            imgLoadCallbacks[c].call(undefined, img);
                            break;
                        }
                    }
                }(i, newImg))
            }

            //handle "onRemoveNext"
            if (removeNextTxt) {
                txts.pop();
            }
            if (removeNextImg) {
                imgs.pop();
            }

            //add text to render list
            if (txtNode.text().length > 0) {
                txts.push("txt" + i);
            }
            //remove unwanted text
            str = txtNode.attr("removeSequenceIds")==undefined ? '': txtNode.attr("removeSequenceIds").split(',');
            for (var p=0; p<str.length; p++){
                var s = txts.indexOf("txt" + (Number(str[p])-1));
                if (s > -1){
                    txts.splice(s, 1);
                }
            }
            //add img to render list
            if (imgNode.text().length > 0) {
                imgs.push("img" + i);
            } 
            //remove unwanted images
            str = imgNode.attr("removeSequenceIds")==undefined ? '': imgNode.attr("removeSequenceIds").split(',');
            
            for (var p=0; p<str.length; p++){
                var s = imgs.indexOf("img" + (Number(str[p])-1));
                if (s > -1){
                    imgs.splice(s, 1);
                }
            }


            str = txtNode.attr("time"); //backwards compatible
            if (str == undefined) str = $(el).attr("time"); //newer location
            var cueTime = (str == "" || str == undefined) ? 0 : Number(str);
            nav.writeToLog("sequencer: adding cue time at:" + cueTime);
            cueTimes.push(cueTime);

            //store only the ones that should be visible..everything else should be deleted if jumping back
            $(el).attr("availIDs", imgs.toString() + "," + txts.toString());
            removeNextTxt = (txtNode.attr("removeNext") == "1");
            removeNextImg = (imgNode.attr("removeNext") == "1");

        });

        //set sound controller
        if (audioFile == "" || audioFile == undefined) {
            nav.writeToLog("Sequence_animation error: No audio file was specified");
        }           
        else {

            if (userSelectedAudio) {
                if (!thereAreImages){
                    parent.addMediaEventListener(window);
                    parent.setMp3Controller(audioFile);
                }
            }
            else {
                renderItem(cueTimes.length - 1);
            }
        }

        //set current page
        if (!nav.settings.gated) {
            nav.getPage().completed = true;
            nav.saveBookmark();
        }
    }

    function renderItem(index) {
        nav.writeToLog("Sequence: rendering item " + index);
        lastRendered = index;
        var availIDs = displayItems[index].getAttribute("availIDs") + ",";
        for (var i = 0; i < cueTimes.length; i++) {
            //--------------------------------------------
            // do images
            //--------------------------------------------
            if (availIDs.indexOf("img" + i + ",") == -1) {
                $("#img" + i).hide();
            }
            else {
                var div = $("#img" + i);

                //show image
                if (!div.is(':visible')) {
                    if (index > 0) {
                        //as per bob: do show/fade depending on if previous image was removed
                        var prevAvailIDs = displayItems[index - 1].getAttribute("availIDs") + ",";
                        if (prevAvailIDs.indexOf("img" + (i - 2) + ",") == -1 && i > 1) { //do fade on very 1st one
                            //do show when previous was removed
                            div.show();
                        }
                        else {
                            //do fade when prev was already there
                            div.fadeIn();
                        }
                    }
                    else {
                        div.fadeIn();
                    }
                }

                // do onImageDisplay callbacks
                if (i == index && imgDisplayCallbacks[index]) { 
                    imgDisplayCallbacks[index].call(undefined, div.find("img"));
                }
            }
            //--------------------------------------------
            // do text
            //--------------------------------------------
            if (availIDs.indexOf("txt" + i + ",") == -1) {
                $("#txt" + i).hide();
            }
            else {
                $("#txt" + i).fadeIn("fast", function () {
                    var txtBlock = $(this),
                        txtBox = $(".txtArea"),
                        dist;
                    if (txtBox.length == 0) {
                        txtBox = $("#" + containerId);
                    }
                    dist = txtBox.prop("scrollHeight") - txtBox.height();

                    if (txtBlock.attr("onvisible") == undefined) {
                        if (dist != 0) {
                            if (!userSelectedAudio) dist = 0;
                            txtBox.stop().animate(
                                { scrollTop: dist }, 
                                { duration: 500,
                                complete: function () {
                                    txtBlock.css("display", "block")
                                    this.focus();
                                }
                            });
                        }
                    }
                    else {
                        var jscode = txtBlock.attr("onvisible");
                        eval(jscode);
                    }
                });
            }
        }
    }


    function checkRequiredItems() {	
        //**********************************************
        // Check required links
        //**********************************************
        var requiredItems = $("*[role='required']"),
            bookm = nav.getPage().bookmark,
            arr = new Array(),
            allDone = true;
        if (bookm.length>0){
            arr = bookm.split("");}
        else{
            arr = Array(requiredItems.length);
        }	
        requiredItems.each(function(i, element) {
            if (arr[i]=="1") {
                addCheckmark($(element), false);
            }
            else{
                allDone = false;
            }
            $(element).attr("index", i);
            if ($(element).attr("onmouseover")!=undefined){ //for popups on the desktop
                $(element).mouseover(function(){
                    addCheckmark($(this), true);
                });
            }
            $(element).click(function(){
                if ($(element).attr("noautocheck") == undefined) {
                    addCheckmark($(this), true);
                }
                else {
                    parent.lastCheckLinkClicked = $(this);
                }
            });
        });
        return allDone;
    }

    function addCheckmark(element, doSave){
        if (element.attr("checked")=="checked") return;
        //place it next to "A" element and 40 px to left by default
        var pos = element.position();
    //        l = pos.left, // - 40,
    //	    t = pos.top + $("div[id^='txtBlock']").children().scrollTop();
    //	    t = pos.top;
    //	l = (l < 0) ? 0 : l;
        //do override if "left" parameter exists
    //	if (element.attr("checkmarkleft")!=undefined){ 
    //		l = pos.left + Number(element.attr("checkmarkleft"));
    //	}
    //	element.after("<div class='checkmark' style='left:" + l + "px; top:" + t + "px'></div>");
    //	element.after("<div class='checkmark'></div>");
        var imgWidth = element.width() + "px";
        element.after("<div class='checkmark2'><img src='interface/checkmark2.png'></div>");
        element.attr("checked" , true);
        //save bookmark
        if(doSave){
            var bookm = "";
            $("*[role='required']").each(function(i, el) {
                bookm += $(el).attr("checked")?"1":"0";
            });
            nav.getPage().bookmark = bookm;
            
            if (bookm.indexOf("0")==-1 && nav.settings.gated) {
                nav.eventCompleted("content"); 
            }
            nav.saveBookmark(true);		
        }
    }

    return {
        load: function (xmlFile) {
            //load data file
            $.ajax({
                url: xmlFile,
                dataType: 'xml',
                async: true,
                context: this,
                success: function (xmlDoc) {
                    parseXmlData(xmlDoc.documentElement);
                    checkRequiredItems();
                    if (typeof(onSecuenceReady)=="function") onSecuenceReady.apply();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    nav.writeToLog("Sequencer: loading error " + xhr.status + ": " + thrownError, true);
                }
            });
        },
        setTime: function (secs) {
            //get index of section/cuetime
            var currIdx;
            for (var i = 0; i < cueTimes.length; i++) {
                if (secs > cueTimes[i] && (secs < cueTimes[i + 1] || i == cueTimes.length - 1)) {
                    currIdx = i;
                    break;
                }
            }
            //render
            if (currIdx != undefined) {
                if (lastRendered != currIdx) {
                    renderItem(currIdx);
                }
            }
        },
        setAudioEnded: function () {
            //if set to false by content, it's expected that *IT* will do this call instead
            if (completeOnAudioEnd) {
                var contentDone = checkRequiredItems();
                if (contentDone || (contentDone === undefined)) {
                    nav.eventCompleted("content");
                }
            }
        },
        onImageLoad: function (idx, imgLoadcallback) {
            //This callback called on the img.onload event
            imgLoadCallbacks[idx] = imgLoadcallback;
        },
        onImageDisplay: function (idx, imgDisplayCallback) {
            //This callback called when the image is faded in only.
            imgDisplayCallbacks[idx] = imgDisplayCallback;
        }
    }
}

 




 
