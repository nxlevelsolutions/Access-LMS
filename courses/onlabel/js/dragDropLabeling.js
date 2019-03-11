/* __________________________
 * dragDropLabeling v2
 * --------------------------
 * 
 * parameters: 
 *             
 */

var dragDropLabeling = (function(){
    "use strict";

    var _data,
		// droppedAlignment: alignment of drag object to target
		// Template setting overrides this setting
		// options: left, right, center - change text alignment in CSS
        _defaultOptions = {droppedAlignment:"center", iconX:0, iconY:0},
        _attempts = 0,
        _labelsContainer,
        _targetsContainer,
        _imageBackground,
        _submitBtn,
        _revealBtn,
        _actions,
        _feedback;
		//_loadTimer;

    function loadData(url, callback, parser) {
        $.ajax({
            url: url,
            dataType: 'xml',
            async: true,  
            context: this,
            success: function (xml) {
                var data = parser && parser(xml);
                callback && callback(data || {});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                parent.nav.writeToLog("dragDropLabeling: loading error " + xhr.status + ": " + thrownError, true);
            }
        });
    }
      
    function xmlParser( data ) {

        data = $(data);
        var obj = {
            "correct" : data.find('correct').text(),
            "incorrect" : data.find('incorrect').text(),
            "revealed" : data.find('revealed').text(),
            "instructions" : data.find('instructions').text(),
            "tryAgain" : data.find('tryAgain').text(),
	        "maxTries" : parseInt(data.find('exercise').attr('maxTries'),10),
            "revealAudio" : data.find('revealAudio').attr('url'),
            "image" : {},
            "labels":[],
            "targets":[]
        };

        var image = data.find('image'), 
            labels = data.find('label'),
            targets = data.find('target');


        obj.image = {
            "url" : image.attr('url') 
        };

        var i=0, l=labels.length;
        
        for(;i<l;i++) {
            var label = $(labels[i]);
            obj.labels.push({
                "id" : 'l' + i,
                "c" : i,
                "height" : parseInt(label.attr('height'),10),
		        "width" : parseInt(label.attr('width'),10),
		        "content" : label.text()
            });
        }

	    // Randomize the labels
		if(typeof shuffleArray == "function") {
			shuffleArray(obj.labels);
		}
		else {
			obj.labels.sort(function() { return 0.5 - Math.random() });
		}

        i=0,l=targets.length;
        
        for(;i<l;i++) {
            var target = $(targets[i]);
	        obj.targets.push(
                {
                    "id" : 't' + i,
                    "c": i,
                    "x" : parseInt(target.attr('x1')),
                    "y": parseInt(target.attr('y1')),
                    "width": parseInt(target.attr('x2')) - parseInt(target.attr('x1')),
                    "height": parseInt(target.attr('y2')) - parseInt(target.attr('y1'))
	        });
        }

        return obj;
    }

    var ile = {

        init : function( url, options ) {
            _labelsContainer = $('#labels-container');
            _targetsContainer = $("#targets");
            _imageBackground = $("#graphic");
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
            _revealBtn = $("#revealBtn");
            _revealBtn = $("#revealBtn").click($.proxy(this.revealHandler, this));
            _actions = $('#actions');
            _feedback = $('#feedback');
            // Override defaults
            if (options){
                for (var prop in options) {
                    _defaultOptions[prop] = options[prop];
                }
            }

            try {
                loadData(url, function( data ) {
                        _data = data;
                        ile.build();
                    },
                    xmlParser
                );
            }
            catch(error) {
                parent.nav.writeToLog('dragDropLabeling.init error =>' + error);
            }

        },

        reset : function() {
            _attempts = 0;
            this.build();
        },
    
        repositionTargets: function () {
            var img = _imageBackground[0],
                parWidth = _imageBackground.parent().width(),
                parHeight = _imageBackground.parent().height(),
                xScale = img.width / Utilities.getNaturalWidth(img),
                yScale = img.height / Utilities.getNaturalHeight(img),
                xOffset = Math.round($(img).position().left),
                yOffset = Math.round($(img).position().top);
            // Reposition targets
            if (xOffset == 0) {
                xOffset = (parWidth - _imageBackground.width()) / 2;
            }
            if (yOffset == 0) {
                yOffset = (parHeight - _imageBackground.height()) / 2;
            }
            $("#targets div").each(function (index, el) {
                var trg = $(el);
                var target = _data.targets[index];
                trg.css("left", Math.round(xScale * target.x) + xOffset);
                trg.css("top", Math.round(yScale * target.y) + 0);
                trg.css("width", Math.round(xScale * target.width));
                trg.css("height", Math.round(yScale * target.height));
            });

            // Reposition labels
            $('.dropped').each(function (index, el) {
                var lbl = $(el),
                    trgId = lbl.data('t'),
                    trg = $('#' + trgId);
                ile.repositionLabel(lbl, trg);
            });
        },

        repositionLabel: function (dropped, target) {
            var offset = target.offset(),
                droppedHasImage = dropped.find('img').length > 0;
			

            if (_defaultOptions.droppedAlignment === 'left') {
                offset.left += 5;
            }
            if (_defaultOptions.droppedAlignment === 'center') {
                if (!droppedHasImage){
					dropped.css('width', target.width());
                }
                // Center it
                offset.left += (target.width() - dropped.width()) / 2;
                offset.top += (target.height() - dropped.height()) / 2;
            }
            if (_defaultOptions.droppedAlignment === 'right') {
                // Get text width
				/// Test and modify if needed
                var oldTxtWidth = dropped.width();
                dropped.css('width', '');
				dropped.css('position', 'relative');
                dropped.css('display', 'inline-block');
                var txtWidth = dropped.width();
                dropped.css('display', '');
				dropped.css('position', 'absolute');
                dropped.css('width', oldTxtWidth);
                // Right it
                offset.left += (target.width() - txtWidth);
                //offset.top += (target.height() - dropped.height()) / 2;
            }
            dropped.offset(offset);
        },

        build : function() {

            _imageBackground.on("load", function () {

                $('#instructions').html('<p>' + _data.instructions + '</p>' || "");
            
                // Add draggable labels
                var elements = "",
                    i=0, 
                    l = _data.labels.length;
                for(;i<l;i++) {
                    var label = _data.labels[i];
                    elements += '<div id="' + label.id + '" c="' + label.c + '" class="draggable" style="width:' + label.width + 'px; height:'+ label.height + 'px;">' + label.content + '</div>';
                }
                _labelsContainer.html(elements);


                // Add targets
                elements = "";
                i = 0;
                l = _data.targets.length;
                var img = _imageBackground[0],
                    parWidth = _imageBackground.parent().width(),
                    parHeight = _imageBackground.parent().height(),
                    xScale = img.width / Utilities.getNaturalWidth(img),
                    yScale = img.height / Utilities.getNaturalHeight(img),
                    xOffset = (parWidth - _imageBackground.width()) / 2,
                    yOffset = (parHeight - _imageBackground.height()) / 2,
                    styleOveride = '';
					//loadTimer;
                    
                // Override css .result values IF specified by particular exercise
                if (_defaultOptions.iconX != 0) {
                    styleOveride = 'left:' + _defaultOptions.iconX + 'px;';
                }
                if (_defaultOptions.iconY != 0) {
                    styleOveride += 'top:' + _defaultOptions.iconY + 'px;'
                }
                // Create all targets
                for(;i<l;i++) {
                    var target = _data.targets[i];
                    elements += '<div id="' + target.id + '" class="target" c="' + i + '" style="left:' + (Math.round(xScale * target.x) + xOffset) + 'px; top:' + (Math.round(yScale * target.y) + yOffset) + 'px; width:' + Math.round(xScale * target.width) + 'px; height:' + Math.round(yScale * target.height) + 'px;">';
                    elements += "<span class='checkmark' style='" + styleOveride + "'></span>";
                    elements += '</div>';
                }
                _targetsContainer.html(elements);
            
                $('div.draggable').draggable( {
                        stop: function(event, ui) {
                            ile.checkEnableSubmit();
                            $(this).removeClass('dragging');
                        },
                        start: function(event, ui) {
                            var el = $(this);
                            if(el.data('t')) {
                                $('#' + el.data('t')).removeData('d');
                                el.removeData('t');
                            }
                            el.addClass('dragging');
                            el.data("originalPosition", el.offset());
                        },
                        revert: function (event, ui) {
							var colW = $('#left-column').width();
                            $(this).data("originalPosition", {
                                top: 0,
                                left: 0,
								width: colW
                            });
							if(!event) {
								$(this).css('position', 'relative');
								$(this).removeClass('dropped');
							}
                            return !event;
                        }
                });
                //$('div.draggable').css('-ms-touch-action', 'none');

                $('div.target').droppable({
                    tolerance: "pointer",
                    drop : function(event, ui) {    
                        var target = $(this),
                            dropped = ui.draggable,
                            existingDraggable = target.data('d');
                        // See if there is a already a draggable on the target
                        if (existingDraggable && existingDraggable != dropped.attr('id')) {
							var ed = $("#" + existingDraggable),
								originalPos = ed.data("originalPosition");
							ed.css('position', 'relative');// ML
							ed.css('width', 'auto');
							ed.removeClass('dropped');
							ed.animate({left:originalPos.left,top:originalPos.top});
							if(ed.data('t')) {
								ed.removeData('t');
							}
                        }
                        dropped.css('position', 'absolute');
                        ile.repositionLabel(dropped, target);
                         
                        target.data('d', dropped.attr('id'));
                        dropped.data('t', target.attr('id'));
                        dropped.addClass('dropped');
                    },
                    out : function(event, ui) {
                        //ui.draggable.removeClass('dropped');// Moved to revert ML
                    }
                });
				// Waits for background image to load JQuery load doesn't wait in Chrome
                //loadTimer = setTimeout(function(){ ile.repositionTargets(); }, 500);
                _actions.show();
                _submitBtn.attr('disabled', 'disabled');

            });


            $(window).resize(function (e) {
                Utilities.debounce(function () {
                    ile.repositionTargets();
                }, 150);
            });

            // Load background image
            _imageBackground.attr("src", _data.image.url + "?_=" + (new Date()).getTime());
        },

        score : function() {

            var result = '',
                targets = $('div.target'),
                i = 0,
                l = targets.length,
                correct = true,
                isLastAttempt = _attempts + 1 === _data.maxTries;
                
            for(;i<l;i++) {
                var target = $(targets[i]),
                    draggable = $('#' + target.data('d'));
                
                if(draggable.attr('c') !== target.attr('c')) {
					draggable.data('chk', 'incorrect');

					if (isLastAttempt) {
						// Add icon
						target.find('.checkmark').removeClass('correct')
									.addClass('incorrect');      
					}
						target.removeData('d');
						correct = false;
				}
                else {
                    if (isLastAttempt) {
                        // Add icon
                        target.find('.checkmark').removeClass('incorrect')
                              .addClass('correct');
                    }					
                }
            }
            
            if (isLastAttempt) {
                $('div.draggable').draggable('option', 'disabled', true);

                if (correct) {
                    result = _data.correct;
                    this.playRevealAudio();
					this.markComplete();
                }
                else {
                    _revealBtn.show();
                    result = _data.incorrect;
                }
            }
            else {
                // Need to finish multiple attempts path
                _attempts++;
                result = (correct) ? _data.correct : _data.tryAgain;

                if (correct) {
                    this.markComplete();
                }

                // Set incorrect objs to original position
                var drags = $('div.draggable'),
					j = 0,
					le = drags.length;

                for (; j < le; j++) {
                    var drag = $(drags[j]);
                    if (drag.data('chk') == 'incorrect') {
                        if (drag.data('t')) {
                            $('#' + drag.data('t')).removeData('d');
                            drag.removeData('t');
                        }
                        var originalPos = drag.data('originalPosition');
						drag.css('position', 'relative');
                        drag.animate({ left: originalPos.left, top: originalPos.top, width: originalPos.width});
						drag.removeData('t');
                        drag.removeClass('dropped');
                    }
                }
            }
			if(!isLastAttempt && correct) {
				for(i=0;i<l;i++) {
					var target = $(targets[i]);
					target.find('.checkmark').removeClass('incorrect')
					.addClass('correct'); 
				}
			}

            $("#feedback-text").html('<p>' + result + '</p>' || "");
           // $('#feedback').show();
			showPop("Feedback", result);
        },
        
        reveal : function() {
            
            var draggables = $('div.draggable'),
                i = 0, 
                l = draggables.length;
                
            for(;i<l;i++) {
                var drag = $(draggables[i]),
                    c = drag.attr('c'),
                    target = $('div.target[c=' + c + ']');
                ile.repositionLabel(drag, target);
            }
            
            $('div.target').find('.checkmark').removeClass('incorrect').addClass('correct');

            this.playRevealAudio();

            $("#feedback-text").html(_data.revealed);
			 // $('#feedback').show();
			showPop("Feedback", _data.revealed);
			
			this.markComplete();

        },

        submitHandler : function( event ) {
            _submitBtn.hide();
            //$('#left-column').find('h4').css('visibility', 'hidden');
            this.score();
        },
        
        revealHandler : function ( event ) {
            _revealBtn.hide();
            this.reveal();
        },
        
        playRevealAudio : function () {
            if (parent) {
                if (_data.revealAudio && _data.revealAudio.length > 0) {
                    parent.setMp3Controller(_data.revealAudio);
                }
            }
        },
 
        markComplete : function() {
            if(parent.nav) {
                parent.nav.eventCompleted("content");
            }
        },
        
        checkEnableSubmit : function() {

            _submitBtn.show();
            $('#feedback').hide();

            var enableSubmit = true,
                targets = $('div.target'),
                i = 0,
                l = targets.length;

            for(;i<l;i++) {
                var el = $(targets[i]);
				if(!el.data("d")) {
                    enableSubmit = false;
		    		break;
                }
            }

            if(enableSubmit) {
                _submitBtn.removeAttr('disabled');
            }
            else {
                _submitBtn.attr('disabled', 'disabled');
            }
        }        
    };

    return ile;

})();    

 