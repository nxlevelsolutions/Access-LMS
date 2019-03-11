var DEBUG =false;
var newShell = false;

function unloadingEvent(){
    if (DEBUG) alert("Unloading function called");
}
function saveScore(score, passed, callback) {
    if (DEBUG) alert("saveScore function called;" + score + "," + passed + "," + callback);
	if (typeof(flashID)!="undefined"){
		fm = getFlashMovieObject(flashID);
		fm.SetVariable("LMSUpdated", "1");
	}
}
function getBookmark(flag){
	newShell = (flag==true);
	var bMark = "";
	prevLoc = "";
	if (DEBUG) alert("LMS returned location:'" + prevLoc + "'");
	stuName = "John Doe";
	if (DEBUG) alert("LMS returned student name:'" + stuName + "'");

	fm = getFlashMovieObject(flashID);
	
	if (fm==null){
		alert("Flash object '" + flashID + "' was not found.");
	}
	else{
		fm.SetVariable("dbData", bMark);
		fm.SetVariable("retUrl", prevLoc);
		fm.SetVariable("studentName", stuName);
		fm.SetVariable("passedStatus", "");
		if (fm.setStartUpData != undefined) fm.setStartUpData(bMark, prevLoc, stuName, "", false);
		if(newShell){
			fm.SetVariable("LMSUpdated", "1");
			return bMark;
		}
		else{
			fm.Play(); 
		}
	}
}
function setBookmark(data, retUrl, callback){
	
	
	if(newShell){
		if (callback){ //in new shell, callback is either true/false
			fm = getFlashMovieObject(flashID);
			fm.SetVariable("LMSUpdated", "1");
		}
		else{
			if (DEBUG) alert("Warning: callback not set.");
		}
	}
	else{
		if (callback!=null && callback.length>0){
			fm = getFlashMovieObject(flashID);
			fm.TCallLabel("/", callback);
		}
		else{
			if (DEBUG) alert("Warning: callback not set.");
		}
	}
}
function mm_LMSInitialize(){return true}
function mm_LMSFinish(){}
function mm_getLocation(){return ""}
function mm_getLastScore(){return ""}
function mm_getStudentName() { return "" }
function mm_getSuspendData(){return ""}