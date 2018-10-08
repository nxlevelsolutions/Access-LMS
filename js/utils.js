"use strict";

var Utils = {
    openWin: function (url, w, h) {
        var courseWindow = window.open(url, "courseWindow", "dependent,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=yes,titlebar=yes,screenX=150,screenY=150,top=150,left=150, width=" + w + ",height=" + h);
        return courseWindow;
    },

    exitModule: function () {
        if (confirm("You have selected to exit this course. Are you sure you wish to exit?")) {
            //parent.opener.document.location.href = parent.opener.document.location.href;
            top.close();
        }
	    //if (courseCompleted) mm_LMSCompleted();
    },

    Post: function (url, formdata, callback, useAsync) {
        Utils.log("Utils.Post to:" + url);
        var ret;
        useAsync = useAsync === undefined ? true : useAsync; 
        $.ajax({
            type: "POST",
            url: url,
            data: formdata,
            async: useAsync,
            success: function (res) {
                if (useAsync) {
                    var obj;
                    if (res.d == "ok") {
                        obj = res.d;
                    }
                    else {
                        if (typeof (res.d) === "string") {
                            eval("obj=" + res.d);
                        }
                        else {
                            obj = res.d;
                        }
                    }
                    if (callback) callback.call(undefined, obj);
                }
                else {
                    ret = res;
                }
            },
            error: function (xhr, ajaxOptions, err) {
                Utils.log("Utils.Post: ERROR '" + ajaxOptions + "':" + err.message);
            }
        });
        return ret;
    },

    Get: function (url, data, callback, useAsync) {
        Utils.log("Utils.Get to:" + url);
        var ret;
        useAsync = useAsync === undefined ? true : useAsync; 
        $.ajax({
            type: "GET",
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: useAsync,
            success: function (res) {
                if (useAsync) {
                    if (callback) callback.call(undefined, res);
                }
                else {
                    ret = res;
                }
            },
            error: function (xhr, ajaxOptions, err) {
                Utils.log("Utils.Get: ERROR '" + ajaxOptions + "':" + err.message);
            }
        });
        return ret;
    },

    log: function (msg) {
        if (typeof (console) != "undefined") {
            console.log(msg);
        }
    },

    getQueryVariable: function(key) {
        var query = window.location.search.substring(1),
            vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]).toLowerCase() == key.toLowerCase()) {
                return decodeURIComponent(pair[1]);
            }
        }
        Utils.log('Querystring key=' + key + ' not found');
        return undefined;
    },

    GetValueByKey: function (obj, longkey) {
        //scan object by long sequence of keys 
        var keys = longkey.split('.'),
            subObj = obj;
        for (var i = 0; i < keys.length; i++) {
            subObj = subObj[keys[i]];
            if (subObj === undefined) return undefined;
        }
        return subObj;
    }
};
 
 