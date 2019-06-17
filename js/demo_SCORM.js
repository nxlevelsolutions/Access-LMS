var API = function () {
    var cont;

    function setStatus(msg) {
        var txt = $(this.containerId + ' .scormLog .allMessages').val();
        txt += msg + '\r';
        $(this.containerId + ' .scormLog .allMessages').val(txt);
    }

    return {
        Start: function (containerId) {
            this.containerId = containerId;
            cont = $(this.containerId + ' .scormLog');
            cont.find('#cStatus').val("");
            cont.find('#prevLoc').val("");
            cont.find('#bookmark').val("");
            cont.find('#lastScore').val("");
        },
        LMSInitialize: function () {
            return true;
        },
        LMSSetValue: function (key, value) {
            switch (key) {
                case "cmi.core.lesson_status":
                    cont.find('#cStatus').val(value);
                    break;
                case "cmi.core.lesson_location":
                    cont.find('#prevLoc').val(value);
                    break;
                case "cmi.suspend_data":
                    cont.find('#bookmark').val(value);
                    break;
                case "cmi.core.score.raw":
                    cont.find('#lastScore').val(value);
                    break;
            }
            setStatus("key=" + key + " set to:\"" + value + "\"");
            return "true";
        },
        LMSGetValue: function (key) {
            setStatus("get value of key=" + key);
            switch (key) {
                case "cmi.core.lesson_status":
                    ret = cont.find('#cStatus').val();
                    break;
                case "cmi.core.lesson_location":
                    ret = cont.find('#prevLoc').val();
                    break;
                case "cmi.suspend_data":
                    ret = cont.find('#bookmark').val();
                    break;
                case "cmi.core.student_name":
                    ret = cont.find('#studentName').val();
                    break;
                case "cmi.core.lesson_mode":
                    ret = cont.find('#lesson_mode').val();
                    break;
                case "cmi.core.score.raw":
                    ret = cont.find('#lastScore').val();
                    break;
                default:
                    setStatus("Key \"" + key + "\" not implemented.");
                    ret = null;
            }
            if (ret == null) ret = "";
            setStatus("returned value=\"" + ret + "\"");
            return ret;
        },
        LMSCommit: function () {
            Utils.log("LMSCommit called");
            return "true";
        },
        LMSFinish: function () {
            Utils.log("LMSFinish called");
            return "";
        },
        LMSGetLastError: function () {
            return 0;
        },
        LMSGetErrorString: function (code) {
            return "";
        },
        LMSGetDiagnostic: function () {
            return "";
        }
    }

}();