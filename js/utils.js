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

    ConsoleWrite: function (msg) {
        if (typeof (console) != "undefined") {
            console.log(msg);
        }
    },

    Post: function (url, formdata, callback, useAsync) {
        Utils.log("Utils.Post to:" + url);
        var ret;
        useAsync = useAsync === undefined ? true : useAsync; 
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(formdata),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
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

    getQueryVariable: function (key, url) {
        var query,
            i;
        if (url) {
            i = url.indexOf('?');
            if (i > -1) {
                query = url.substr(i + 1);
            }
            else {
                query = url;
            }
        }
        else {
            query = window.location.search.substring(1);
        }
        var vars = query.split('&');
        for (i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]).toLowerCase() == key.toLowerCase()) {
                return decodeURIComponent(pair[1]);
            }
        }
        return undefined;
    },

    setQueryVariable: function (pairsObj) {
        //parses the entire url, parsing and adding querystring
        //parameters if required. Returns a full url.
        //to delete set var to null, ex: {x:null}
        var query = window.location.search.substring(1),
            vars = (query == "" ? []: query.split('&') ),
            url = document.location.pathname + "?",
            found,
            value,
            key;
        for (key in pairsObj) {
            value = pairsObj[key];
            found = false;
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (decodeURIComponent(pair[0]).toLowerCase() == key.toLowerCase()) {
                    if (value == null) {
                        vars.splice(i, 1); 
                    }
                    else {
                        vars[i] = key + "=" + encodeURI(value);
                        found = true;
                        break;
                    }
                }
            }
            if (!found && value!=null) {
                vars.push(key + "=" + encodeURI(value));
            }
        }
        url += vars.join("&");
        return url;
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
    },

    UploadFile: function (file, uploadUrl, optionsObj) {
        var formData = new FormData();
        formData.append('file', file);
        //check allowed extensions
        if (optionsObj.allowedExtensions) {
            var exts = optionsObj.allowedExtensions.split(','),
                found = false;
            for (var i = 0; i < exts.length; i++) {
                if ($.trim(exts[i].toLowerCase()) == file.name.substring(file.name.length - $.trim(exts[i]).length).toLowerCase()) {
                    found = true;
                }
            }
            if (!found) {
                if (optionsObj.onError) {
                    optionsObj.onError.call(this, "The selected file type is not allowed.", file);
                }
                return;
            }
        }

        //add extra form data if needed
        if (optionsObj.addFormData) {
            for (var key in optionsObj.addFormData) {
                formData.append(key, optionsObj.addFormData[key]);
            }
        }

        //post file
        $.ajax({
            type: "POST",
            url: uploadUrl,
            data: formData,   
            contentType: false,  
            processData: false,
            dataType: "json",
            cache: false,

            success: function (data) {
                if (data.error) {
                    if (optionsObj.onError) {
                        optionsObj.onError.call(this, data.error, file, data);
                    }
                }
                else {
                    if (optionsObj.onSuccess) {
                        optionsObj.onSuccess.call(this, "", file, data);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (optionsObj.onError) {
                    optionsObj.onError.call(this, thrownError, file);
                }
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener("progress", function (e) {
                        if (optionsObj.onProgress) {
                            optionsObj.onProgress.call(this, e.loaded / e.total);
                        }
                    }, false);
                }
                return myXhr;
            },
            complete: function () {
                //alert("complete");
            }
            
        });

    }


};
 
//--------------------------------------------------------
// add extensions to built-in prototype objects if missing
//--------------------------------------------------------
if (typeof (String.prototype.trim) !== "function") {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}