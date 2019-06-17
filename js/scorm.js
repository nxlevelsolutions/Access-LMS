"use strict";

var API = function () {

    var _lmsUrl,
        _courseId,
        _assigId,
        _userId,
        _APIObj,
        _lastError = 0;

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
        var ret;

        $.ajax({
            type: "POST",
            url: _lmsUrl + "?m=" + key + "&uid=" + _userId + "&aid=" + _assigId + "&cid=" + _courseId + "&dir=set&r=" + Math.random(),
            data: { data: value },
            async: false,
            success: function (res) {
                ret = res;
            },
            error: function (xhr, ajaxOptions, err) {
                Utils.log("Scorm setMessage ERROR: '" + ajaxOptions + "':" + err.message);
            }
        });

        return ret.result;
    }

    return {
        //called by course_scorm.aspx
        loadInitData: function (userId, assigId, courseId, pathPrefix, callback) {
            _lmsUrl = pathPrefix + "admin/LmsMessage.ashx"
            _userId = userId;
            _courseId = courseId;
            _assigId = assigId;
            Utils.Get(_lmsUrl,
                { m: 'SCORM_COURSE_INITIAL_DEFAULTS', uid: _userId, cid: _courseId, aid: _assigId },
                function (data) {
                    _APIObj = data;
                    callback.call(this, data);
                }
            );
        },
 
        LMSInitialize: function () {
            return true;
        },

        LMSSetValue: function (key, value) {

            //skip unsupported
            if (key == "cmi.core.score.min" || key == "cmi.core.score.max") return;

            var ret = setMessage(key, value);
             
            //update display if status/score changed
            if (key == "cmi.core.lesson_status" ||
                key == "cmi.core.score.raw") {
                if (window.opener && typeof (window.opener.closed) != "unknown" && window.opener.closed == false && window.opener.lms) {
                    window.opener.lms.refreshDisplay(_assigId, _courseId);
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
            return _lastError;
        },

        LMSGetErrorString: function (code) {
            return "";
        },

        LMSGetDiagnostic: function () {
            return "";
        }
    }

}();

     
 
