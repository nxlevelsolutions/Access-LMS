/*! ===============================================
 *  CourseNavigator class. Manager class to control
 *  course navigation.
 * 
 *  version: 2.72
 *  author: Juan Villegas
 *  dependencies: jquery
 *  events fired: onComplete
 *  ===============================================*/
"use strict";

function CourseNavigator(menuFile, settingsFile, onNavigatorReady) {

    /*------------------------------------------------
     *  Internal class GatedItems.   
     *  manage list of gated items from settings.xml
     *------------------------------------------------*/
    function GatedItems(str, nav) {
        this.completionList = {};
        var gatedItems = [];
        if (str.length > 0) gatedItems = str.split(",");
        for (var i = 0; i < gatedItems.length; i++) {
            gatedItems[i] = { name: $.trim(gatedItems[i]), permanent: true };
            this.completionList[gatedItems[i].name] = false;
        }
        this.completed = function (key) {
            this.completionList[key] = true;
        }
        this.allCompleted = function () {
            for (var i = 0; i < gatedItems.length; i++) {
                if (this.completionList[gatedItems[i].name] != true) {
                    return false;
                }
            }
            return true;
        }
        this.resetFinishedItems = function () {
            for (var i = gatedItems.length - 1; i > -1; i--) {
                if (gatedItems[i].permanent) {
                    this.completionList[gatedItems[i].name] = false;
                }
                else {
                    this.remove(gatedItems[i].name, true);
                }
            }
        }
        this.getListUnfinishedObjects = function () {
            var ret = "";
            for (var i = 0; i < gatedItems.length; i++) {
                if (this.completionList[gatedItems[i].name] != true) {
                    ret += gatedItems[i].name + ",";
                }
            }
            if (ret.length > 0) ret = ret.substring(0, ret.length - 1);
            return ret;
        }
        this.add = function (item, permanent) {
            var exists = false;
            item = $.trim(item);
            for (var i = 0; i < gatedItems.length; i++) {
                if (gatedItems[i].name == item) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                gatedItems.push({ name: item, permanent: (permanent ? true : false) });
                this.completionList[item] = false;
            }
            nav.writeToLog("Navigator: A new item to gate by \"" + item + "\" has been added at " + (permanent ? "course" : "page") + " level.");
        }
        this.remove = function (item, automatic) {
            item = $.trim(item);
            for (var i = 0; i < gatedItems.length; i++) {
                if (gatedItems[i].name == item) {
                    gatedItems.splice(i, 1);
                    break;
                }
            }
            delete this.completionList[item];
            nav.writeToLog("Navigator: An item to gate by \"" + item + "\" has been removed " + (automatic? "automatically.": "."));
        }
    }

    /*------------------------------------------------
     *  Internal class Page. Helper class to manage
     *  each course's page status.
     *-------------------------------------------------*/
    function Page(completed, bookmark, index, parent, xml, depth) {
        this.completed = completed;
        this.bookmark = bookmark;
        this.index = index;
        this.xml = xml;
        this.parent = parent; // This object is of type "xml", not "Page" for compatibility reasons. It should really be of type "Page" or renamed "parentXml"
        this.depth = depth;
    }

    /*------------------------------------------------
     *  Internal class Settings. Helper class to manage
     *  course's settings.
     *-------------------------------------------------*/
    function Settings(settingsFile, nav) {
        var classInst = this,
            timer = new Timer();
        timer.start("Navigator: loaded " + settingsFile);
        $.ajax({
            url: settingsFile,
            dataType: 'xml',
            context: this,
            async: typeof(onNavigatorReady)=="function",
            success: function (xmlDoc) {
                timer.end("Navigator: loaded " + settingsFile);
                $(xmlDoc).find("key").each(function (i) {
                    var key = $(this).attr("name"),
                        val = $.trim($(this).text());
                    if (key != undefined) {
                        //handle booleans
                        if (val.toLowerCase() == "yes" ||
                            val.toLowerCase() == "no" ||
                            val.toLowerCase() == "true" ||
                            val.toLowerCase() == "false") {
                            classInst[key] = (val.toLowerCase() == "yes" || val.toLowerCase() == "true");
                        }
                        else {
                            //handle numbers
                            if (/^[0-9.]+$/.test(val)) {
                                classInst[key] = Number(val);
                            }
                            else {  //everything else string
                                classInst[key] = String(val);
                            }
                        }
                    }
                });
                _gatedItems = new GatedItems(this.gatedItems, nav);
                if (this.gatedItems.length > 0) nav.writeToLog("Navigator: gated items: " + this.gatedItems);
                //check if all loaded
                if (_menuXml != null) {
                    onInitFilesLoaded(nav);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                nav.writeToLog("Navigator: " + settingsFile + " loading error." + xhr.status + ": " + thrownError, true);
            }
        });
    }

    /*------------------------------------------------
     *  Internal class Timer. Helper class to handle
     *  file loading times.
     *-------------------------------------------------*/
    function Timer() {
        var instance = {};//darn IE8 and below
        return {
            start: function (str) {
                if (typeof console != 'undefined' && console.time) {
                    console.time(str);
                }
                else {
                    instance[str] = new Date().getTime();
                }
            },
            end: function (str) {
                if (typeof console != 'undefined') {
                    if (console.time) {
                        console.timeEnd(str);
                    }
                    else {
                        var en = new Date().getTime();
                        console.info(str + ": " + (en - instance[str]) + "ms");
                    }
                }
            }
        }
    }

    /*---------------------------------------*/
    this.writeToLog = function (str, isError) {
        if (typeof (console) != "undefined") {
            if (isError === true) {
                console.error(str);
            }
            else if (isError === false) {
                if (window.chrome) {
                    console.warn("%c" + str, "color: darkorange;");
                }
                else {
                    console.warn(str);
                }
            }
            else {
                if (console.log) console.log(str);
            }
        }
    }

    /*---------------------------------------*/
    this.writeToLog("Navigator: initializing...");

    /*--private--*/
    var idx = 0, //index of current page
        _registeredListeners = new Array(),
        _gatedItems = null,
        _menuXml = null,
        _intervalId = undefined,
        _DELIMITER = ",",
        _DELIMITER_REPLACEMENT = "|",
        _DATA_DELIMITER = "#",
        _DISPLAY_WAITLIST = 4000,
        _save_counter = 0,
        _previousId = "",
        _allNonPages = new Array(),
        _loadPageNodes = function (n, depth) {
            var p;
            if (depth == 0) this.writeToLog("Navigator: parsing " + n.getElementsByTagName("page").length + " nodes");
            for (var i = 0; i < n.childNodes.length; i++) {
                p = n.childNodes[i];
                if (p.nodeType == 1) { //1=ChildXmlNode
                    var url = p.getAttribute("url"),
                        page = new Page(false, "", idx, n, p, depth);
                    for (var aIdx = 0; aIdx < p.attributes.length; aIdx++) {
                        page[p.attributes[aIdx].name] = p.attributes[aIdx].value;
                    }
                    if (url.length > 0) {
                        this.allPages.push(page);
                        idx++;
                    }
                    else {
                        _allNonPages.push(page);
                    }
                    if (p.childNodes.length > 0) {
                        _loadPageNodes.apply(this, [p, depth + 1]);
                    }
                }
            }
        },
        sendAllowToNavigate = function () {
            var tryAgain = false;
            for (var i = 0; i < _registeredListeners.length; i++) {
                var o = _registeredListeners[i],
                    doc = o.document || o.contentDocument; //to get href
                if (o.pageLoaded == true || (typeof (o.contentWindow) != 'undefined' && o.contentWindow.pageLoaded == true)) {
                    var trgObj = o.contentWindow || o;
                    if (trgObj.onAllowToNavigate == undefined) {
                        if (o.toString() == "[object Object]") { //object
                            this.writeToLog("Navigator: A registered object has not implemented 'onAllowToNavigate'", true);
                        }
                        else {//iframe
                            this.writeToLog("Navigator: This page has not implemented 'onAllowToNavigate':" + doc.location.href, true);
                        }
                    }
                    else {
                        trgObj.onAllowToNavigate(this);
                    }
                }
                else {
                    if (o.toString() == "[object Object]") { //dynamic
                        this.writeToLog("Navigator: A registered object reports pageLoaded=false");
                    }
                    else {//iframe
                        this.writeToLog("Navigator: " + doc.location.href + " is not loaded (Registered item #" + i + "). pageLoaded=false");
                    }
                    tryAgain = true;
                    break;
                }
            }
            if (tryAgain) {
                var functRef = function (scope) {
                    return (function () {
                        sendAllowToNavigate.apply(scope);
                    })
                }(this);
                setTimeout(functRef, 1000);
            }
        },
        sendOnUpdateUI = function () {
            var tryAgain = false;
            for (var i = 0; i < _registeredListeners.length; i++) {
                var o = _registeredListeners[i];
                if (o.pageLoaded == true || (typeof (o.contentWindow) != 'undefined' && o.contentWindow.pageLoaded == true)) {
                    var trgObj = o.contentWindow || o;
                    if (trgObj.onUpdateUI == undefined) {
                        if (o.toString() == "[object Object]") { //object
                            this.writeToLog("Navigator: A registered object has not implemented 'onUpdateUI'", true);
                        }
                        else {//iframe
                            this.writeToLog("Navigator:This page has not implemented 'onUpdateUI':" + o.document.location.href, true);
                        }
                    }
                    else {
                        trgObj.onUpdateUI(this);
                    }
                }
                else {
                    if (o.toString() == "[object Object]") { //object
                        this.writeToLog("Navigator: A registered object reports pageLoaded=false", true);
                    }
                    else {//iframe
                        this.writeToLog("Navigator: " + o.location.href + " is not loaded (Registered item #" + i + "). pageLoaded=false");
                    }
                    tryAgain = true;
                    break;
                }
            }
            if (tryAgain) {
                var functRef = function (scope) {
                    return (function () {
                        sendOnUpdateUI.apply(scope);
                    })
                }(this);
                setTimeout(functRef, 1000);
            }
        },
        displayWaitList = function () {
            var list = _gatedItems.getListUnfinishedObjects();
            if (list.length == 0) {
                clearWaitingInterval();
            }
            else {
                this.writeToLog("Framework (" + window.name + "): Waiting for componentReady() message from: " + list);
            }
        },
        clearWaitingInterval = function () {
            clearInterval(_intervalId);
            _intervalId = undefined;
        };

    /*--public--*/
    this.allPages = new Array();
    this.settings = new Settings(settingsFile, this);
    this.COMPLETE = "onComplete";

    /*---------------------------------------*/
    var timer = new Timer();
    timer.start("Navigator: loaded " + menuFile);
    $.ajax({
        url: menuFile,
        dataType: 'xml',
        async: typeof(onNavigatorReady)=="function",
        context: this,
        success: function (xmlDoc) {
            _menuXml = xmlDoc.documentElement;
            timer.end("Navigator: loaded " + menuFile);
            _loadPageNodes.apply(this, [_menuXml, 0]);
            if (_gatedItems != null) {
                onInitFilesLoaded(this);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            this.writeToLog("Navigator: loading error " + xhr.status + ": " + thrownError, true);
        }
    });
    idx = 0; //reset it back.. we used it

    /*---------------------------------------*/
    function onInitFilesLoaded(nav) {
        nav.writeToLog("Navigator: ready.");
        if (typeof (onNavigatorReady) == "function") {
            onNavigatorReady.apply();
        }
    }
    /*---------------------------------------*/
    function sendNavCompleteEventIfAllDone() {
        // Fire course completion event if needed
        var done = true;
        for (var i = 0; i < this.allPages.length; i++) {
            if (this.allPages[i].completed == false) {
                done = false;
                break;
            }
        }
        if (done) {
            this.writeToLog("Framework (" + window.name + "): all pages completed event fired.");
            $(this).trigger({
                type: this.COMPLETE,
                message: true,
                time: new Date()
            });
        }
    }
    /*---------------------------------------*/
    this.gatedItems = function () {
        function addGatedItem(item, permanent) {
            _gatedItems.add(item, permanent);
        }
        function removeGatedItem(item) {
            _gatedItems.remove(item);
        }
        return {
            add: addGatedItem,
            remove: removeGatedItem
        }
    }();
    /*---------------------------------------*/
    this.getXml = function () {
        return _menuXml;
    }
    /*---------------------------------------*/
    this.getPage = function (id) {
        if (id == undefined) {
            return this.allPages[idx];
        }
        else {
            if (typeof (id) == "number") {
                var i = idx + Number(id);
                if (i < 0 || i >= this.allPages.length) {
                    return null;
                }
                else {
                    return this.allPages[i];
                }
            }
            else {
                //look by id in navigatables
                for (var p = 0; p < this.allPages.length; p++) {
                    if (this.allPages[p].id == id) {
                        return this.allPages[p];
                    }
                }
                //look in non-navigatables
                for (var p = 0; p < _allNonPages.length; p++) {
                    if (_allNonPages[p].id == id) {
                        return _allNonPages[p];
                    }
                }
                //not found
                this.writeToLog("Navigator warning: getPage() was called with unknown id=\"" + id + "\"", false);
            }
        }
    }
    /*---------------------------------------*/
    this.loadBookmarks = function (bookmark) {
        if (bookmark == null || bookmark == undefined) {
            this.writeToLog("Navigator: boomark loaded is empty.");
            return;
        }
        
        var ids = bookmark.split(_DELIMITER),
            pageData,
            id,
            i;
        for (i = 0; i < ids.length; i++) {
            pageData = ids[i].split(_DATA_DELIMITER);
            id = pageData[0];
            for (var p = 0; p < this.allPages.length; p++) {
                if (this.allPages[p].id == id) {//found it
                    if (pageData.length == 1) {
                        this.allPages[p].completed = true;
                    }
                    if (pageData.length > 1) {
                        this.allPages[p].completed = pageData[1] == "1";
                    }
                    if (pageData.length == 3) {
                        this.allPages[p].bookmark = pageData[2];
                        //fix page's bookmark if commas were originally added
                        if (this.allPages[p].bookmark.indexOf(_DELIMITER_REPLACEMENT) > -1) {
                            this.allPages[p].bookmark = this.allPages[p].bookmark.split(_DELIMITER_REPLACEMENT).join(_DELIMITER);
                        }
                    }
                    break;
                }
            }
        }
        //Set completion states for parent nodes ("non-pages")
        //This is needed by the TOC
        var xml = $(_menuXml);
        for (i = 0; i < _allNonPages.length; i++) {
            id = _allNonPages[i].id;
            var clist = xml.find("page[id='" + id + "']")[0].childNodes,
                c = 0,
                allDone = true;
            for (; c < clist.length; c++) {
                var cid = clist[c].getAttribute("id");
                if (this.getPage(cid).completed == false) {
                    allDone = false;
                    break;
                }
            }
            _allNonPages[i].completed = allDone;
        }
        this.writeToLog("Navigator: boomarks loaded.");
    }
    /*---------------------------------------*/
    this.getBookmark = function () {
        var strBookmark = "",
            p;
        for (var i = 0; i < this.allPages.length; i++) {
            p = this.allPages[i];
            if (p.bookmark.length == 0) {
                if (p.completed) {
                    strBookmark += p.id + _DELIMITER;
                }
            }
            else {	//there's a page level bookmark
                if (typeof (p.bookmark) != "string" && typeof (p.bookmark) != "number") this.writeToLog("Framework ERROR: a page bookmark must be of type \"string\", not \"" + typeof (p.bookmark) + "\" so it can be saved in the bookmark.", true);
                //make sure bookmark is not of type _DATA_DELIMITER
                var pageBookmark = String(p.bookmark);
                if (pageBookmark.indexOf(_DATA_DELIMITER) > -1) this.writeToLog("Framework ERROR: pages cannot save bookmarks with the character \"" + _DATA_DELIMITER + "\"", true);
                //make sure commas are saved ok as _DELIMITER_REPLACEMENT
                if (pageBookmark.indexOf(_DELIMITER) > -1) {
                    if (pageBookmark.indexOf(_DELIMITER_REPLACEMENT) > -1) {
                        this.writeToLog("Framework ERROR: pages cannot save bookmarks with the character \"" + _DELIMITER_REPLACEMENT + "\"", true);
                    }
                    else {
                        pageBookmark = p.bookmark.split(_DELIMITER).join(_DELIMITER_REPLACEMENT);
                    }
                }

                strBookmark += p.id + _DATA_DELIMITER + (p.completed ? "1" : "0") + _DATA_DELIMITER + pageBookmark + _DELIMITER;
            }
        }
        strBookmark = strBookmark.substring(0, strBookmark.length - _DELIMITER.length);
        return strBookmark;
    }
    /*---------------------------------------*/
    this.eventCompleted = function (itemCompleted) {
        //this is a message sent by the gated components telling 
        //the framework that they have completed.
        if (this.settings.gated) {
            this.writeToLog("Framework (" + window.name + "): gated item \"" + itemCompleted + "\" completed.");
            if (this.allPages[idx].completed) {
                this.writeToLog("Framework (" + window.name + "): page is marked complete.");
                clearWaitingInterval();
                sendAllowToNavigate.apply(this);
            }
            else {
                _gatedItems.completed(itemCompleted);
                if (_gatedItems.allCompleted()) {
                    clearWaitingInterval();
                    this.allPages[idx].completed = true;
                    this.writeToLog("Framework (" + window.name + "): all gated items completed.");
                    sendNavCompleteEventIfAllDone.call(this);
                    this.saveBookmark(true);
                    sendAllowToNavigate.apply(this);
                }
            }
        }

        //check parent node in xml hierarchy and mark completed if siblings are done
        var xmlParent = this.allPages[idx].parent,
            allDone = true;
        for (var i = 0; i < xmlParent.childNodes.length; i++) {
            var n = xmlParent.childNodes[i],
                id = n.getAttribute("id");
            if (this.getPage(id) == false) {
                allDone = false;
                break;
            }
        }
        if (allDone) {
            if ($(xmlParent).attr("id") != undefined) {
                var id = $(xmlParent).attr("id");
                if (id.length > 0) {
                    this.getPage(id).completed = true;
                    sendNavCompleteEventIfAllDone.call(this);
                }
            }
        }
    }
    /*---------------------------------------*/
    this.register = function (obj) {
        if (obj == undefined) {
            this.writeToLog("Navigator ERROR: An undefined object cannot be registered.", true);
        }
        else {
            _registeredListeners.push(obj);
        }
    }
    /*---------------------------------------*/
    this.gotoPage = function (id) {
        //move internal pointers
        if (id == null || id == undefined) {
            this.writeToLog("Navigator: requested page was '" + id + "'; Navigating to 1st page instead.");
            idx = 0;
        }
        else {
            this.writeToLog("Navigator: requested page (offset or id)=" + id);
            if (typeof (id) == "number") {
                var nidx = idx + Number(id);
                if (nidx < 0 || nidx >= this.allPages.length) {
                    this.writeToLog("Navigator error: unable to navigate to an out of range offset (offset)=" + id, true);
                }
                else {
                    idx = nidx;
                }
            }
            else {
                var found = false;
                for (var p = 0; p < this.allPages.length; p++) {
                    if (this.allPages[p].id == id) {
                        found = true;
                        idx = p;
                        break;
                    }
                }
                if (!found) {
                    this.writeToLog("Navigator Error: The page id=" + id + " was not found or is not a navigateable page.");
                    return;
                }
            }
        }
        this.writeToLog("Navigator: Navigating to page id=" + this.getPage().id + " (url=" + this.getPage().url + ")");

       
        if (this.settings.gated) {
            _gatedItems.resetFinishedItems();
        }
        else {
            //mark page complete immediately
            this.allPages[idx].completed = true;
            sendNavCompleteEventIfAllDone.call(this);
        }

        //start displaying waiting list
        if (this.settings.gated) {
            if (!this.allPages[idx].completed) {
                if (!_gatedItems.allCompleted()) { //are all gated items done?
                    if (_intervalId == undefined) {
                        var functRef = function (scope, func) {
                            return (function () {
                                func.apply(scope);
                            })
                        }(this, displayWaitList);
                        _intervalId = setInterval(functRef, _DISPLAY_WAITLIST); //every 20 seconds
                    }
                }
            }
        }

        //save and fire update UI event
        this.saveBookmark();
        sendOnUpdateUI.apply(this);
    }
    /*---------------------------------------*/
    this.end = function () {
        clearWaitingInterval();
    }
    /*---------------------------------------*/
    this.saveBookmark = function (saveNow) {
        //save bookmark if necesssary
        var currentId = this.allPages[idx].id;
        if (this.settings.useLMS || saveNow == true) {
            if ((_save_counter % Number(this.settings.saveInterval)) == 0 || saveNow == true) {
                var newBookmark = this.getBookmark();
                setBookmark(newBookmark, currentId, null);
                _previousId = currentId;
            }
            _save_counter++;
        }
    }
    /*---------------------------------------*/
}

