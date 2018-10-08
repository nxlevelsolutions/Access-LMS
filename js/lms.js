"use strict";

var lms = function () {

    var _userId,
        _courseId,
        _lmsUrl = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")) + "/admin/lms_message.aspx";

    function getMessage(url) {
        if (xmlhttp === null) {
            document.location.href = _lmsUrl + "?m=NO_XMLHTTPOBJ&returnUrl=" + document.location.href;
        }
        else {
            xmlhttp.open("GET", url + "&modId=" + modId + "&userId=" + _userId + "&r=" + Math.random(), false);
            xmlhttp.send(null);
            if (xmlhttp.status === 200) {
                return xmlhttp.responseText;
            }
            else {
                alert("Warning: An error has occurred trying to save data. Please exit the course and log in again. (HTTP:" + xmlhttp.status + ")");
            }
        }
    }

    function setMessage(url) {
        var ret = null;
        if (xmlhttp === null) {
            document.location.href = _lmsUrl + "?m=NO_XMLHTTPOBJ&returnUrl=" + document.location.href;
        }
        else {
            xmlhttp.open("GET", url + "&modId=" + modId + "&userId=" + _userId + "&r=" + Math.random(), false);
            xmlhttp.setRequestHeader("Cache-Control", "no-cache");
            xmlhttp.setRequestHeader("Pragma", "no-cache");
            xmlhttp.send(null);
            if (xmlhttp.status === 200) {
                ret = 0;
                if (xmlhttp.responseText !== "0") {
                    ret = xmlhttp.responseText;
                    alert("The course has lost its connection to the LMS. Please exit the course and log in again.");
                }
            }
            else {
                alert("The course has lost its connection to the LMS. Please exit the course and log in again. (HTTP:" + xmlhttp.status + ")");
                ret = -1;
            }
        }
        return ret;
    }

    return {
        initialize: function (userId, courseId) {
            _userId = userId;
            _courseId = courseId;
        },
        refreshDisplay: function () {
            var cList;
            if (_courseId == undefined) {
                Utils.log("Refreshing entire course display.");
                cList = $('tr[courseid]');
            }
            else {
                Utils.log("Refreshing display for courseId=" + _courseId);
                cList = $('tr[courseid=' + _courseId + ']');
            }
            cList.each(function (i, tr) {
                var tr = $(tr),
                    courseid = tr.attr("courseid");
                lms.getCourseStats(function (data) {
                    tr.find("#startDate").html(data.startDate);
                    tr.find("#completedDate").html(data.completedDate);
                    tr.find("#highScore").html(data.maxScore);
                    if (data.completedDate) {
                        tr.find("#certificate").show();
                    }
                }, courseid)
            });
        },
 
        saveScore : function (score) {
            if (xmlhttp === null) xmlhttp = XmlHttp.create();
            var ret = setMessage(_lmsUrl + "?m=SAVE_SCORE&score=" + score);
            //update highest score display
            if (typeof (window.opener.closed) !== "unknown" && window.opener.closed === false && window.opener.modWindow == window) {
                var valP = getMessage(_lmsUrl + "?m=GET_HIGHSCORE");
                window.opener.document.getElementById(modId + "-" + HS).innerHTML = valP.substring(valP.indexOf("=") + 1);
            }
            return ret;
        },
        setCourseComplete: function () {
            if (xmlhttp === null) xmlhttp = XmlHttp.create();
            var ret = setMessage(_lmsUrl + "?m=SET_COURSE_COMPLETE");
            //update display
            if (typeof (window.opener.closed) !== "unknown" && window.opener.closed === false && window.opener.modWindow == window) {
                window.opener.document.getElementById(modId + "-" + CP).innerHTML = getMessage(_lmsUrl + "?m=GET_DATE_MOD_COMPLETED");
            }
            return ret;
        },
        getCourseStats: function (callback, courseId) {
            Utils.Get(_lmsUrl, 
                { m: 'GET_COURSE_STATS', uid: _userId, cid: courseId },
                function (data) {
                    callback.call(this, data);
                }
            );
        },
        getSudentName: function () {
            if (xmlhttp === null) xmlhttp = XmlHttp.create();
            return getMessage(_lmsUrl + "?m=GET_GETFULLNAME");
        },
        getBookmark: function () {
            if (xmlhttp === null) xmlhttp = XmlHttp.create();
            ret = getMessage(_lmsUrl + "?m=GET_BOOKMARK");
            return ret.substring(5);
        },
        setBookmark: function (bookmark) {
            if (xmlhttp === null) xmlhttp = XmlHttp.create();
            ret = setMessage(_lmsUrl + "?m=SET_BOOKMARK&data=" + bookmark);
            return ret;
        }
    }
 

}();
