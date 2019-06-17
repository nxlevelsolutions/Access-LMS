
var AICC = function () {
    var pubObj = {
        containerId: null,
        Start: function (contId) {
            this.containerId = contId;
            resetSession();
        },
        courseWindow: null
    };

    function resetSession() {
        $.ajax({
            url: "aicc.asp",
            type: 'post',
            async: false, //needs to be async just here
            data: { command: 'killsession'},
            success: function (ret) {
                updateInfoPage();
            }
        });
    }
    function getSessionData() {
        $.ajax({
            url: "aicc.asp",
            type: 'post',
            async: false,
            data: { command: 'getparam', w: 1 },
            success: function (ret) {
                $(pubObj.containerId).val(ret);
            }
        });
    }
    function updateInfoPage(){
	    getSessionData();
        if (pubObj.courseWindow === null || pubObj.courseWindow.closed === false) setTimeout(updateInfoPage, 1500);
    }
    return pubObj;
}();
