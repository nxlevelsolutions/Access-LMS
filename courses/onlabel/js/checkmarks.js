/* ________________
 * checkmarks v2
 * ----------------
 * Sets up links/buttons that get a checkmark after being clicked. 
 * parameters: 
 *             
 */

 function checkmarks(bookmark, gatedId){
    "use strict";

	var requiredItems = $("*[role='required']"),
		arr = new Array(),
		allDone = true;
	if (bookmark.length>0){
        arr = bookmark.split("");
    }
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
			//else {
			//    parent.lastCheckLinkClicked = $(this);
			//}
		});
	});
 
	if (allDone){
		parent.nav.eventCompleted(gatedId); //send "completed" immediately
	}

    function addCheckmark(element, doSave){
        if (element.attr("checked")=="checked") return;
    
        var pos = element.position(),
            l = pos.left,  
            t = pos.top;
        l = (l < 0) ? 0 : l;
        //do override if "left" parameter exists
        if (element.attr("checkmarkleft")){ 
            l = pos.left + Number(element.attr("checkmarkleft"));
        }
        element.after("<div class='checkmark' style='left:" + l + "px; top:" + t + "px'></div>");
        element.attr("checked" , true);
        //save bookmark
        if(doSave){
            var bookm = "";
            $("*[role='required']").each(function(i, el) {
                bookm += $(el).attr("checked")?"1":"0";
            });
            parent.nav.getPage().bookmark = bookm;
            
            if (bookm.indexOf("0")==-1 && parent.nav.settings.gated) {
                parent.nav.eventCompleted("content"); 
            }
            parent.nav.saveBookmark(true);		
        }
    }

    /*
    $(window).resize(function (e) {
        Utilities.debounce(function () {
            //scan each checkmark and reposition
            $(document).find("div.checkmark").each(function (i, el) {
                var chk = $(el),
                    pos = chk.prev().position(),
                    l = pos.left,
                    t = pos.top + $("div[id^='txtBlock']").children().scrollTop();
                l = (l < 0) ? 0 : l;
                //do override if "left" parameter exists
                if (chk.attr("checkmarkleft") != undefined) {
                    l = pos.left + Number(chk.attr("checkmarkleft"));
                }
                chk.css('left', l)
                    .css('top', t);
            });
        }, 150);
    });
     */

 }