var DEBUG =false;
var MONTHS_COOKIE_LIVESPAN = 1;

function writeCookie(name, value, months){
	var expire = "";
	if(months != null){
		var expirationDate = new Date;
		expirationDate.setMonth(expirationDate.getMonth()+months)
		expire = "; expires=" + expirationDate.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expire;
}

function readCookie(name){
	var cookieValue = "";
	var search = name + "=";
	if(document.cookie.length > 0){ 
		offset = document.cookie.indexOf(search);
		if (offset != -1){ 
		  offset += search.length;
		  end = document.cookie.indexOf(";", offset);
		  if (end == -1) end = document.cookie.length;
		  cookieValue = unescape(document.cookie.substring(offset, end))
		}
	}
	return cookieValue;
}

function unloadingEvent(){
    if (DEBUG) alert("Unloading function called");
}

function saveScore(score, passed, callback) {
    if (DEBUG) alert("saveScore function called;" + score + "," + passed + "," + callback);
}

function mm_getLocation(){ 
	//function to help with backwards compatibility
	return readCookie("prevLoc");
}
function mm_getLastScore(){
	return readCookie("lastScore");
}
function mm_getStudentName(){
	return readCookie("studentName");
}
function mm_getSuspendData(){
	return readCookie("bMark");
}
function mm_LMSFinish(){ }

function getBookmark(flag){
	var bMark = readCookie("bMark");
	var prevLoc = readCookie("prevLoc");
	var stuName = "N/A";
	fm = getFlashMovieObject(flashID);
	if (fm==null){
		alert("Flash object '" + flashID + "' was not found.");
	}
	else{
	    if (DEBUG) alert("Starting with dbData='" + bMark + "', prevLoc='" + prevLoc + "', studentName='" + stuName + "'");
		fm.SetVariable("dbData", bMark);
		fm.SetVariable("retUrl", prevLoc);
		fm.SetVariable("studentName", stuName);
		if (fm.setStartUpData!=undefined) fm.setStartUpData(bMark, prevLoc, stuName, null);
		return bMark;
	}
}

function setBookmark(data, prevLoc, callback) {
	if (data.length>0){
		if (DEBUG) alert("About to set this suspend_data:'" + data + "'");
		writeCookie("bMark", data, MONTHS_COOKIE_LIVESPAN);
	}
	if (prevLoc != null) {
		if (DEBUG) alert("About to set this suspend_data:'" + data + "'");
		writeCookie("prevLoc", prevLoc, MONTHS_COOKIE_LIVESPAN);
	}
}

function resetCookies() {
    writeCookie("bMark", "", null);
    writeCookie("prevLoc", "", null);
}


document.onkeypress = function(e) {
	var k;
	if (document.layers)
		k = e.which;
	else
		k = window.event.keyCode;
	if (k==95){ //shift-minus
		resetCookies();
		alert("Course cookies reset");
	}
}
