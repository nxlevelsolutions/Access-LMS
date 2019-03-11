/*! ===============================================
 *  Author: Juan Villegas
 *  Dependencies: jquery, Utilities
 *  Options: DEFAULT_COMPLETION_CODE, USE_LMS_TIME
 *  ===============================================*/

var DEBUG = false,
    isAICC = true,
    lms = (function (scope) {
        var serverUrl = Utilities.getQueryStringValue(window.location.search, "aicc_url"),
            sid = Utilities.getQueryStringValue(window.location.search, "aicc_sid"),
            sTime = new Date(),
            eTime = "",
            old_status = "",
            old_score = "",
            proxyUrl,
            prevBookmark,
            parser = {
                data: {},
                read: function (aiccRes) {
                    var valueLines = aiccRes.split(/\r/), //try return char
                        line,
                        pair,
                        list;
                    if (DEBUG) alert("LMS response:\r" + aiccRes);
                    if (valueLines.length==1) { //try line feed char
                        valueLines = aiccRes.split(/\s/);
                    }
                    if (valueLines.length==1) {
                        if (DEBUG) alert("Unable to parse server response.");
                    }
                    list = new Array(valueLines.length);
                    if (DEBUG) alert("# of value pairs:\r" + list.length);
                    for (var i = 0; i < list.length; i++) {
                        line = $.trim(valueLines[i].toString());
                        pair = line.split("=");
                        parser.data[$.trim(pair[0].toLowerCase())] = $.trim(pair[1]);
                    }

                    eTime = parser.data.time == undefined ? "" : parser.data.time;
                    if (DEBUG) alert("Returning bookmark:'" + parser.data.lesson_location + "'");
                    if (DEBUG) alert("start time:" + parser.data.time);
                    old_status = parser.data.lesson_status;
                    old_score = parser.data.score;

                    if (DEBUG) alert("LMS returned student name:'" + parser.data.student_name + "'");
                }
            };

        function getElapsedTime() {
            var ret = 0;
            if (eTime != "") {
                var arr = eTime.split(":"),
                    hr = arr[0],
                    mn = arr[1],
                    sc = arr[2];
                ret = Number(hr) * 60 * 60 + Number(mn) * 60 + Number(sc);
            }
            return ret * 1000; //in msecs
        }
        function getClock() {
            var now = new Date(),
                total = Math.round(Math.abs(now.getTime() - sTime.getTime() + (obj.USE_LMS_TIME ? getElapsedTime(): 0)) / 1000),
                hours = Math.floor(total / 60 / 60); total -= Math.floor(hours * 60 * 60),
                minutes = Math.floor(total / 60); total -= Math.floor(minutes * 60),
                seconds = total,
                clock = ((hours < 10) ? "0" : "") + hours;
            clock += ((minutes < 10) ? ":0" : ":") + minutes;
            clock += ((seconds < 10) ? ":0" : ":") + seconds;
            return clock;
        }
        var obj = {
            DEFAULT_COMPLETION_CODE: "c", //default completion code
            USE_LMS_TIME: true, //true: lms time is read and usage time is added then sent back to lms; false: report only time since last LMS data save
            ondataready : null,
            loadData: function (proxyUrl) {
                Utilities.log("aicc: course url='" + window.location + "'");
                Utilities.log("aicc: aicc_url='" + serverUrl + "'");
                Utilities.log("aicc: aicc_sid='" + sid + "'");
                if (typeof (proxyUrl) != 'undefined') {
                    Utilities.log("aicc: using proxy '" + proxyUrl + "'");
                    this.proxyUrl = proxyUrl;
                }
                Utilities.log("aicc: calling getparam ...");
                $.support.cors = true;
                $.ajax({
                    url: (typeof (this.proxyUrl) == 'undefined' ? serverUrl : this.proxyUrl),
                    type: "post",
                    async: false,
                    dataType: "text",
                    data: { command: "getparam", session_id: sid, version: "2.0", aicc_data: "", aicc_url: serverUrl },
                    success: function (data) {
                        parser.read(data);
                        var returnUrl = "",
                            oldBookmark = "",
                            rawBookmark = parser.data.lesson_location;
                        if (rawBookmark.indexOf("~") > -1) {
                            var arr = rawBookmark.split("~");
                            returnUrl = arr[0];
                            oldBookmark = arr[1];
                        }
                        Utilities.log("aicc: getparam returned='" + data + "'");

                        obj.ondataready.apply(scope, [returnUrl,
                                                     parser.data.score,
                                                     parser.data.student_name,
                                                     oldBookmark,
                                                     parser.data.lesson_status,
                                                     parser.data.student_id]);
                    },
                    error: function(jqXHR, textStatus, errorThrown ){
                        //jqXHR jqXHR, String textStatus, String errorThrown
                        Utilities.log("aicc: error loading external url. Status='" + textStatus + "', Error='" + errorThrown + "'");
                    }
                });
            },
            saveBookmark: function (boomark) {
                if (boomark == undefined || boomark == null) {
                    boomark = prevBookmark;
                }
                else {
                    prevBookmark = boomark;
                }
                var statusStr = (old_status == "") ? "i" : old_status,
                    scoreStr = (old_score == "") ? "" : "score=" + old_score + "\r\n",
                    location = (boomark == null) ? "" : "lesson_location=" + boomark + "\r\n",
                    data = "[core]\r\n"
                        + "lesson_status=" + statusStr + "\r\n"
                        + scoreStr
                        + location
                        + "time=" + getClock() + "\r\n";
                if (obj.USE_LMS_TIME==false) sTime = new Date();
                Utilities.log("aicc: sending this information to the LMS:\r" + data);
                $.ajax({
                    url: (typeof (this.proxyUrl) == 'undefined' ? serverUrl : this.proxyUrl),
                    type: "post",
                    async: true,
                    dataType: "text",
                    data: { command: "putparam", session_id: sid, version: "2.0", aicc_data: data, aicc_url: serverUrl},
                    success: function (ret) {
                        Utilities.log("aicc: putparam retuned:" + ret);
                    },
                    error: function(jqXHR, textStatus, errorThrown ){
                        //jqXHR jqXHR, String textStatus, String errorThrown
                        Utilities.log("aicc: error saving to external url. Status='" + textStatus + "', Error='" + errorThrown + "'");
                    }
                });

            },
            setScore: function(score){
                if (score != null && score != 'null') {
                    old_score = score;
                }
            },
            setStatus: function (passed) {
                if (passed != null && passed != 'null') {
                    old_status = (passed == true) ? obj.DEFAULT_COMPLETION_CODE : "f";
                }
            },
            finish: function () {
                $.ajax({
                    url: (typeof (this.proxyUrl) == 'undefined' ? serverUrl : this.proxyUrl),
                    type: "post",
                    async: true,
                    dataType: "text",
                    data: { command: "exitau", session_id: sid, version: "2.0", aicc_url: serverUrl },
                    success: function (ret) {
                        Utilities.log("exitau retuned:" + ret);
                    }
                });

            }
        }
        return obj;
    })(this);

 
/**************************************
/
/  PUBLIC INTERFACE FUNCTIONS
/
***************************************/

var exitSent = false;

function unloadingEvent(fromCourse) {
    //called from flash body.onUnload event
    if (fromCourse == true || ((fromCourse == false || fromCourse == undefined) && exitSent == false)) {
        exitSent = true;
        lms.finish();
    }
}
function saveScore(score, passed, answerData) {
    //answerData ignored in aicc.. 
    Utilities.log("Savescore: score=" + score + ", passed=" + passed + ", data=" + answerData);
    lms.setScore(score);
    lms.setStatus(passed);
    lms.saveBookmark();
}

function getBookmark() {
    //called by flash only
    lms.ondataready = function (lastPageId, lastScore, studentName, bookmark, lessonStatus) {
        var fm = getFlashMovieObject(flashID);
        if (fm == null) {
            alert("Flash object '" + flashID + "' was not found.");
        }
        else {
            fm.SetVariable("dbData", bookmark);
            fm.SetVariable("retUrl", lastPageId);
            fm.SetVariable("studentName", studentName);
            fm.SetVariable("lastScore", lastScore);
            fm.SetVariable("passedStatus", lessonStatus);
            Utilities.log("calling shell ready=" + fm.dataReady);
            fm.dataReady();
        }
    }
    lms.loadData();

    return undefined;//asynch.. signal to shell to wait
}
function setBookmark(data, retUrl) {
    Utilities.log("setBookmark: data=" + data + ", retUrl=" + retUrl);
    if (data!='null' & data.length > 0) { // && data!=old_data
        lms.saveBookmark(retUrl + "~" + data);
    }

}
function mm_LMSFinish() {
    lms.finish();
}

/*
window.onbeforeunload = function () {
    if (!exitSent) {
        //return "WARNING: Please click on \"Stay on this page\" below and use the course's \"EXIT\" button to exit the course, otherwise your scores might not be recorded properly.";
        return "<custom message goes here>";
    }
};
*/