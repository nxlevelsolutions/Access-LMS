"use strict";

var lms = function () {

    var _userId,
    //    _courseId,
        _lmsUrl = document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")) + "/admin/LmsMessage.ashx";

    return {
        initialize: function (userId) {
            _userId = userId;
            //_courseId = courseId;
        },
        refreshDisplay: function (assigId, courseId) {
            var cList;
            if (assigId==undefined && courseId==undefined) {
                Utils.log("Refreshing entire course display.");
                cList = $('*[courseid]');
            }
            else {
                Utils.log("Refreshing display for assigId=" + assigId + " courseId=" + courseId);
                cList = $('*[assigId=' + assigId + '][courseid=' + courseId + ']');
            }
            cList.each(function (i, tr) {
                var _tr = $(tr),
                    _assigid = _tr.attr("assigid"),
                    _courseid = _tr.attr("courseid");
                lms.getCourseStats(function (data) {
                    _tr.find("#startDate").html(data.startDate == null ? "N/A": data.startDate);
                    _tr.find("#completedDate").html(data.completedDate == null ? "N/A" : data.completedDate);
                    _tr.find("#highScore").html(data.maxScore);
                    //show links to download certificate if valid date 
                    var tmp = new Date(data.completedDate); 
                    if (data.completedDate !== null && tmp.toString() !== "Invalid Date")
                        _tr.find(".certificate").show(); //show certificate link 
                    
                }, _assigid, _courseid)
            });
        },
        
        getCourseStats: function (callback, assigid, courseId) {
            Utils.Get(_lmsUrl, 
                { m: 'GET_COURSE_STATS', uid: _userId, cid: courseId, aid: assigid },
                function (data) {
                    callback.call(this, data);
                }
            );
        },
 
    }

}();
