// ----------------------------------------------------

// define global var as handle to API object
var mm_adl_API = null,
    msg = "Error Communicating with the LMS. Please Close and Re-Launch the course. Failure to do so will result in progress and test results not being saved. \r Details:";

//document.domain = document.domain.substring(document.domain.indexOf('.') + 1);

// mm_getAPI, which calls findAPI as needed
function mm_getAPI() {
    //always check.. user might have closed the connection

    var myAPI = null;
    //search parents first
    if (myAPI == null && typeof (window.parent) != 'undefined') myAPI = findAPI(window.parent)
    if (myAPI == null && typeof (window.top) != 'undefined') myAPI = findAPI(window.top);
    //search opener
    if (myAPI == null && window.top.opener != null) {
        if (window.top.opener.closed == false) {
            myAPI = findAPI(window.top.opener);
            if (myAPI == null) myAPI = findAPI(window.top.opener.top)
        }
    }
    if (myAPI == null) {
        alert(msg + 'JavaScript Warning: API object not found in window or opener.');
    }
    else {
        mm_adl_API = myAPI;
    }
}

// returns LMS API object (or null if not found)
function findAPI(win) {
    // look in this window
    if (win == null) return null;
    if (win.closed == true) {
        alert(msg + "It appears that you closed the main LMS window. Please reopen the course without closing the main window.");
        return null;
    }
    if (typeof (win) != 'undefined') {
        try {
            if (typeof (win.API) == 'object') {
                return win.API;
            }
        }
        catch (e) {
            alert("Due to browser security restrictions, the course is unable to access a window frame.");
            return null;
        }
    }

    // not found ...look in this window's frameset children
    if (win.frames.length > 0) {
        for (var i = 0; i < win.frames.length; i++) {
            if (typeof (win.frames[i]) != "undefined" && typeof (win.frames[i]) != "unknown") {
                try {
                    if (typeof (win.frames[i].API) != "undefined" && win.frames[i].API != null) {
                        return win.frames[i].API;
                    }
                    else {
                        var api = findAPI(win.frames[i]);
                        if (typeof (api) != "undefined" && api != null) {
                            return api;
                        }
                    }
                }
                catch (e) { }
            }
        }
    }
    return null;
}


// call LMSInitialize()
function mm_LMSInitialize() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        var ret = mm_adl_API.LMSInitialize("");
        if (ret == "false" || ret == false) {
            if (mm_adl_API.LMSGetLastError() == 103) {
                //Note 103=Already Initialized
                //Complete list: http://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/
                ret = "true";
            }
        }
        return ret;
    }
}

// call LMSCommit()
function mm_LMSCommit() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        var ret = mm_adl_API.LMSCommit("");
        //if (ret==undefined || ret==false || ret=="false") {
        //	showDebug("LMS error diagnostic (on commit) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        //}
        return ret;
    }

}
//time functions
var sTime = new Date(); //start
function getTotalTime() {
    var now = new Date();
    var total = Math.round(Math.abs(now.getTime() - sTime.getTime()) / 1000); //in secs
    var hours = Math.floor(total / 60 / 60); total -= Math.floor(hours * 60 * 60);
    var minutes = Math.floor(total / 60); total -= Math.floor(minutes * 60);
    var seconds = total;
    var clock = ((hours < 10) ? "0" : "") + hours;
    clock += ((minutes < 10) ? ":0" : ":") + minutes;
    clock += ((seconds < 10) ? ":0" : ":") + seconds;
    return clock;
}


// call LMSFinish()
function mm_LMSFinish() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        var ret = mm_adl_API.LMSSetValue("cmi.core.session_time", getTotalTime());
        if (ret == undefined || ret == false || ret == "false") {
            showDebug("LMS error diagnostic (on session_time) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        }
        mm_LMSCommit();
        mm_adl_API.LMSFinish("");
    }
}

// call LMSComplete()
function mm_LMSCompleted() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        showDebug("course exam has been passed:(marked as complete)");
        var ret = mm_adl_API.LMSSetValue("cmi.core.lesson_status", "completed");
        if (ret == undefined || ret == false || ret == "false") {
            showDebug("LMS error diagnostic (on completed) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        }
        if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        return ret;
    }
}

function mm_LMSPassed() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        showDebug("course exam has been passed:(marked as passed)");
        var ret = mm_adl_API.LMSSetValue("cmi.core.lesson_status", "passed");
        if (ret == undefined || ret == false || ret == "false") {
            showDebug("LMS error diagnostic (on passed) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        }
        if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        return ret;
    }
}

function mm_LMSFailed() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        showDebug("course exam has been failed:(marked as failed)");
        var ret = mm_adl_API.LMSSetValue("cmi.core.lesson_status", "failed");
        if (ret == undefined || ret == false || ret == "false") {
            showDebug("LMS error diagnostic (on passed) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        }
        if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        return ret;
    }
}
// call LMSIncomplete()
function mm_LMSIncomplete() {

    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        var ret = mm_adl_API.LMSSetValue("cmi.core.lesson_status", "incomplete");
        if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        return ret;
    }


}

function mm_setLocation(data) {
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        if (typeof (mm_adl_API.LMSSetValue) == 'unknown') {
            alert('Error: Unable to connect to the LMS. Please relaunch the course.');
        }
        else {
            var ret = mm_adl_API.LMSSetValue("cmi.core.lesson_location", data);
            if (ret == undefined || ret == false || ret == "false") {
                showDebug("LMS error diagnostic (on set location) Error code " + mm_adl_API.LMSGetLastError() + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
            }
            if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        }
        return ret;
    }
}

function mm_getLocation() {

    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        return mm_adl_API.LMSGetValue("cmi.core.lesson_location");
    }

}

function mm_setSuspendData(data) {
    var ret = false;
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
        if (typeof (mm_adl_API.LMSSetValue) == 'unknown') {
            alert('Error: Unable to connect to the LMS. Please relaunch the course.');
        }
        else {
            showDebug("Course is sending this bookmark:'" + data + "'");
            ret = mm_adl_API.LMSSetValue("cmi.suspend_data", data);
            if (ret == undefined || ret == false || ret == "false") {
                showDebug("LMS error diagnostic (on set suspend_data) Error code " + mm_adl_API.LMSGetLastError + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
            }
            if (typeof (SCORM_ALWAYS_COMMIT) != 'undefined' && SCORM_ALWAYS_COMMIT) mm_LMSCommit();
        }
    }
    return ret;
}

function mm_getSuspendData() {

    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
        return "";
    }
    else {
        var ret = mm_adl_API.LMSGetValue("cmi.suspend_data");
        showDebug("Course received this bookmark:'" + ret + "' Error (if any):'" + mm_adl_API.LMSGetLastError() + "'");
        ret = unescape(ret);
        return ret;
    }

}

function mm_getStudentName() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
        return "";
    }
    else {
        var ret = mm_adl_API.LMSGetValue("cmi.core.student_name");
        showDebug("Course received this student name:'" + ret + "' Error (if any):'" + mm_adl_API.LMSGetLastError() + "'");
        ret = unescape(ret);
        return ret;
    }

}
function mm_getStudentID() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
        return "";
    }
    else {
        var ret = mm_adl_API.LMSGetValue("cmi.core.student_id");
        showDebug("Course received this student id:'" + ret + "' Error (if any):'" + mm_adl_API.LMSGetLastError() + "'");
        ret = unescape(ret);
        return ret;
    }
}
function mm_getLastScore() {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
        return "";
    }
    else {
        var ret = mm_adl_API.LMSGetValue("cmi.core.score.raw");
        showDebug("Course received this bookmark:'" + ret + "' Error (if any):'" + mm_adl_API.LMSGetLastError() + "'");
        ret = unescape(ret);
        return ret;
    }

}
function mm_saveScore(score) {
    mm_getAPI();
    if (mm_adl_API == null) {
        alert(msg + "Unable to locate API object.");
    }
    else {
		mm_adl_API.LMSSetValue("cmi.core.score.max", 100);
		//mm_adl_API.LMSSetValue("cmi.core.score.min", 0);
        var ret = mm_adl_API.LMSSetValue("cmi.core.score.raw", score);
        if (ret == undefined || ret == false || ret == "false") {
            showDebug("LMS error diagnostic (on save score) Error code " + mm_adl_API.LMSGetLastError + ":\n" + mm_adl_API.LMSGetDiagnostic(""), true);
        }
        mm_LMSCommit();
        return ret;
    }

}
function showDebug(msg, lmsError) {
    if (parent.DEBUG == true || DEBUG == true || lmsError == true) {
        alert(msg);
    }
}
function trace(msg) {
    if (typeof (console) != 'undefined') {
        console.log(msg);
    }
}

/**************************************
/
/ INTERFACE FUNCTIONS
/
***************************************/

var old_data = null,
    DEBUG = false,
    exitedViaButton = false,
    ret = mm_LMSInitialize();
 

//if (ret != "true" && ret != true) {
//    alert("Warning: unable to initialize");
//}
if (DEBUG) alert("course initialized");
var st;
st = mm_adl_API.LMSGetValue("cmi.core.lesson_status");
if (DEBUG) alert("LMS returned a lesson status of '" + st + "'");
//mark as incomplete immediately after lunch
if (st != "completed" && st != "passed" && st != "failed" && st != "incomplete") {
    mm_adl_API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    trace("LMSSetValue cmi.core.lesson_status to incomplete");
}
function unloadingEvent(skipMessage) {
    if (!skipMessage) mm_LMSFinish();
}
function saveScore(score, passed, callback) {
    var ret;
    trace("saveScore called: score='" + score + "', passed='" + passed + "'");
    if (score != null) {
        score = Number(score);
        ret = mm_saveScore(score);
        trace("mm_saveScore called: res='" + ret + "'");
        if (ret !== true && ret != "true") {
            alert(msg + "An error has ocurred trying to save your score. Please try again.");
        }
    }
    if (passed == true || passed == "true") {
        if (score == null) {
            ret = mm_LMSCompleted();
            trace("mm_LMSCompleted called: res='" + ret + "'");
        }
        else {
            ret = mm_LMSPassed();
            trace("mm_LMSPassed called: res='" + ret + "'");
        }
        if (ret != "true" && ret != true) {
            alert(msg + "An error has ocurred trying to save your 'Passed/Completed' status. Please try again.");
        }
    }
	if (passed == false || passed == "false") {
	    if (score != null) {
	        ret = mm_LMSFailed();
	        trace("mm_LMSFailed called: res='" + ret + "'");
	    }
	}
}

 
function setBookmark(data, retUrl, callback) {
    var ret;
    if (data == null) {
        ret = mm_setSuspendData("");
    }
    else {
        if (data.length > 0 && data != old_data) {
            if (DEBUG) alert("About to set this suspend_data:'" + data + "'");
            ret = mm_setSuspendData(data);
            if (ret != "true" && ret != true) {
                alert(msg + "Warning: unable to set suspend_data:" + ret + " with:" + data);
            }
        }
    }
    old_data = data;

    if (DEBUG) alert("LMS save suspend_data returned:" + ret + ". About to save location:'" + retUrl + "'");

    
    if (typeof (retUrl) != "undefined") {
        ret = mm_setLocation(retUrl);
        if (ret != "true" && ret != true) {
            alert(msg + "Warning: unable to set location:" + ret);
        }
        if (DEBUG) alert("LMS save location returned:" + ret);
    }
}

 