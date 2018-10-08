"use strict";

var API = function () {

    var _path = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")),
        _lmsUrl = _path + "/admin/lms_message.aspx",
        _courseId,
        _userId,
        _APIObj;

    //function getMessage(url) {
    //    var ret = Utils.Get(
    //        url,
    //        { cid: _courseId, uid: _userId, r: Math.random(), dir: 'get' },
    //        null,
    //        false
    //    );
    //    return ret.data;
    //}

    function setMessage(key, value) {
        var ret = Utils.Post(
            _lmsUrl + "?m=" + key + "&uid=" + _userId + "&cid=" + _courseId + "&dir=set&r=" + Math.random(),
            { data: value },
            null,
            false
        );
        return ret.result;
    }

    return {
        loadInitData: function (userId, courseId, callback) {
            _userId = userId;
            _courseId = courseId;
            Utils.Get(_lmsUrl,
                { m: 'SCORM_COURSE_INITIAL_DEFAULTS', uid: _userId, cid: _courseId },
                function (data) {
                    _APIObj = data;
                    callback.call(this, data);
                }
            );
        },
 
        LMSInitialize: function () {
            return "true";
        },

        LMSSetValue: function (key, value) {

            //skip unsupported
            if (key == "cmi.core.score.min" || key == "cmi.core.score.max") return;
            var ret = setMessage(key, value);
             
            //update display - status
            if (key == "cmi.core.lesson_status") {
                if (typeof (window.opener.closed) != "unknown" && window.opener.closed == false && window.opener.modWindow == window) {
                    window.opener.lms.refreshDisplay(_courseId);
                }
            }
            //update display - score
            if (key == "cmi.core.score.raw") {
                if (typeof (window.opener.closed) != "unknown" && window.opener.closed == false && window.opener.modWindow == window) {
                    window.opener.lms.refreshDisplay(_courseId);
                }
            }

            return ret;
        },

        LMSGetValue: function (key) {
            return Utils.GetValueByKey(_APIObj, key);
        },

        LMSCommit: function () {
            return "true";
        },

        LMSFinish: function () {
            //LMSFinished = true;
            return "";
        },

        LMSGetLastError: function () {
            return "";
        },

        LMSGetErrorString: function (code) {
            return "";
        },

        LMSGetDiagnostic: function () {
            return "";
        }
    }

}();

     
 
