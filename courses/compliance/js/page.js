/* ________________
 * page.js v2
 * ----------------
 * regular content pages should use this js because it sets  
 * eventCompleted("content") immediately on load
 */

var pageLoaded = false;

function onAllowToNavigate(nav){
	//required, but unused in "regular" content pages.
}
function onUpdateUI(nav){
	document.location.href = parent.nav.getPage().url;
}

$(window).on("load", function() {
    pageLoaded = true;
    //Utilities.resetMainGraphicSize();
    if (parent.nav == undefined) return
    $("#graphic").fadeIn();

	if (parent.nav.settings.gated){
		parent.nav.eventCompleted("content"); //send "completed" immediately
	}
})

//$(window).on("unload", function() {
//	parent.lastCheckLinkClicked = undefined;
//})

 

 


 