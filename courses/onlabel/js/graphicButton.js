"use strict";

var graphicButton = function (_nav) {
    var _buttons = [],
        _imgRef = null,
        _resizeRegistered = false,
        _onAllButtonsClickedCallback = null,
        _retObj = {
            create: function (left, top, widthPerc, imageRefId, imageUrl, imageVisitedUrl, required, onButtonClickedCallback, secs, waitForCompletion, containerId) {
                /*params:
                  ===============================================================
                  left       = integer (left % value)
                  top        = integer (top % value)
                  widthPerc  = integer (width % value)
                  imageRefId = [string] OR [jquery image] object (image id of reference image)
                  imageUrl   = string (url of button up state)
                  imageVisitedUrl=string (url of button visited state)
                  required   = boolean (switch in case button is required)
                  onButtonClickedCallback   = function (callback) to invoke after a button is clicked
                  secs       = integer (seconds of time delay when 1st img appears)
                  waitForCompletion = boolean (true/false)  *** This needs completed
                  containerId       = Element Id of container where the button will be appended to
                */
                if (_nav == undefined) {
                    if (console && console.log) {
                        console.log("graphicButton ERROR: unable to capture navigator object.");
                    }
                }
                if (typeof (widthPerc) == 'undefined') widthPerc = null;
                if (typeof (imageRefId) == 'undefined') imageRefId = null;
                if (typeof (waitForCompletion) == 'undefined') waitForCompletion = null;
                var nb = new GraphicButton(left, top, widthPerc, imageRefId, imageUrl, imageVisitedUrl, required, onButtonClickedCallback, secs, waitForCompletion);
                _buttons.push(nb);
                if (containerId) {
                    nb.image.css("position", "")
                        .css("left", "")
                        .css("top", "")
                        .css("width",  widthPerc);
                    $('#' + containerId).append(nb.image);
                }
                else {
                    if (!_resizeRegistered) {
                        $(window).resize(function () {
                            Utilities.debounce(function () {
                               buttonResize(widthPerc);
                            }, 100)
                        })
                        _resizeRegistered = true;
                    }
                    buttonResize(widthPerc);
                    $(document.body).append(nb.image);
                }

            },
            reset: function () {
                for (var i = 0; i < _buttons.length; i++) {
                    _buttons[i].image.remove();
                }
                _buttons = [];
                _imgRef = null;
                _resizeRegistered = false;
                this.onAllButtonsClicked = null;
                _nav.writeToLog("graphicButton: reset() invoked.");
            },
            onAllButtonsClicked: null
        };

    function buttonResize(widthPercent){
        var btn;
        if (_imgRef == null) {
            //resize relative to the document.body DOM element
            var bodyWidth = $(document.body).width(),
                bodyHeight = $(document.body).height();

            for (var i = 0; i < _buttons.length; i++) {
                btn = _buttons[i];
                var leftPer = parseInt(btn.left),
                    topPer = parseInt(btn.top),
                    newLeft = Math.round(bodyWidth * leftPer / 100) + 'px',
                    newTop = Math.round(bodyHeight * topPer / 100) + 'px',
                    newWidth = Math.round(bodyWidth * parseInt(btn.width) / 100) + 'px';
                btn.image.css('left', newLeft)
                    .css('top', newTop)
                    .css('width', newWidth);
            }
        }
        else {
            //resize relative to the image reference
            for (var i = 0; i < _buttons.length; i++) {
                btn = _buttons[i];
                var leftPer = parseInt(btn.left),
                    topPer = parseInt(btn.top),
                    imgWidthNat = Utilities.getNaturalWidth(_imgRef[0]),
                    imgWidthCur = _imgRef.width(),
                    newLeft = Math.round(_imgRef.offset().left + (imgWidthCur * leftPer / 100)) + 'px',
                    newTop = Math.round(_imgRef.offset().top + (_imgRef.height() * topPer / 100)) + 'px',
                    newWidth = Math.round(imgWidthCur * parseInt(btn.width) / 100) + 'px';
                btn.image.css('left', newLeft)
                    .css('top', newTop)
                    .css('width', newWidth);
            }
        }
    }

    function GraphicButton(left, top, widthPerc, imageRefId, imageUrl, imageVisitedUrl, required, onButtonClickedCallback, secs, waitForCompletion) {
        var _img,
            _onButtonClickedCallback = onButtonClickedCallback,
            _imageVisitedUrl = imageVisitedUrl,
            _buttonInst = this,
            _widthCss = (widthPerc == null ? '' : "width:" + widthPerc + ";"),
            _waitForCompletion = waitForCompletion,
            imgOnload = '';

        //set reference image
        if (typeof (imageRefId) == "string") {
            _imgRef = $(imageRefId);
            if (_imgRef.length == 0) {
                _nav.writeToLog("graphicButton: Image id=\"" + imageRefId + "\" not found.");
                return;
            }
        }
        else {
            if (imageRefId instanceof jQuery) {
                _imgRef = imageRefId;
            }
        }

        if (_imgRef==null){
            _nav.writeToLog("graphicButton: Creating '" + imageUrl + "' required=" + required + " on top document.body element.");
        }
        else{
            _nav.writeToLog("graphicButton: Creating '" + imageUrl + "' required=" + required + " on top of image id='" + _imgRef.attr('id') + "'");
        }

        //save original values
        this.left = left;
        this.top = top;
        this.width = widthPerc;

        //get new coordinates
        if (imageRefId != null) {
            var leftPer = parseInt(left),
                topPer = parseInt(top),
                imgWidthNat = Utilities.getNaturalWidth(_imgRef[0]),
                imgWidthCur = _imgRef.width();
            left = Math.round(_imgRef.offset().left + (imgWidthCur * leftPer / 100)) + 'px';
            top = Math.round(_imgRef.offset().top + (_imgRef.height() * topPer / 100)) + 'px';
            _widthCss = 'width:' + Math.round(imgWidthCur * parseInt(widthPerc) / 100) + 'px;';
        }

        _img = $("<image src='' id='__gb" + _buttons.length + "' style='position:absolute;z-index:100;left:" + left + "; top:" + top + ";" + _widthCss + " display:none; cursor: pointer;' />");

        //display
        if (typeof (secs) == "undefined" || secs==null || secs == 0) {
            _img[0].onload = function () {
                $(this).fadeIn();
            }
        }
        else {
            setTimeout(function () {
                _img.fadeIn();
            }, Number(secs) * 1000, this);
        }

        function markAndSaveStatus() {
            _buttonInst.visited = true;
            _img.attr('src', _imageVisitedUrl);
            //save bookmark
            var alldone = true, //all *required*
                str = _nav.getPage().bookmark,
                bkm = str.split(''),
                btn;
            for (var i = 0; i < _buttons.length; i++) {
                btn = _buttons[i];
                if (btn.visited || bkm[i] == '1') {
                    bkm[i] = '1';
                }
                else {
                    bkm[i] = '0';
                    if (btn.required) alldone = false;
                }
            }
            if (alldone) {
                _nav.writeToLog("graphicButton: All required buttons have been visited.");
                _nav.eventCompleted("graphicButtons");
                if (typeof (_retObj.onAllButtonsClicked) === "function") {
                    _retObj.onAllButtonsClicked.call(undefined, _buttonInst);
                }
            }
            _nav.getPage().bookmark = bkm.join('');
            _nav.saveBookmark();
        }


        //handle click
        _img.click(function () {
            if (_waitForCompletion !== true) {
                markAndSaveStatus();
            }
            if (typeof (_onButtonClickedCallback) === "function") {
                _onButtonClickedCallback.call(undefined, _buttonInst);
            }
        });

        //check if already visited
        var bkm = _nav.getPage().bookmark,
            arr;
        if (bkm.length > 0) {
            arr = bkm.split('');
            if (arr.length > _buttons.length) {
                if (arr[_buttons.length] == '1') {
                    _img.attr('src', imageVisitedUrl);
                }
                else {
                    _img.attr('src', imageUrl);
                }
            }
            else {
                _img.attr('src', imageUrl);
            }
        }
        else {
            _img.attr('src', imageUrl);
        }

        //set remaining public
        this.visited = false;
        this.image = _img;
        this.required = required;
        this.setComplete = function () {
            markAndSaveStatus();
        }

        return this;
    }

    return _retObj;

}(parent.nav);

