dragDropText = (function(){

    var _data,
        _attempts = 0,
        _submitBtn,
        _revealBtn,
        _actions,
        _feedback,
        _draggables,
		_callback;

    function loadData( url, callback, parser ) {
        $.get(url, function(xml){
            var data = parser && parser(xml);
            callback && callback(data || {});
        });
    }

    function xmlParser( data ) {

        data = $(data);
        var obj = {
            'correct' : data.find('correct').text(),
            'incorrect' : data.find('incorrect').text(),
            'revealed' : data.find('revealed').text(),
            'instructions' : data.find('instructions').text(),
            'tryAgain' : data.find('tryAgain').text(),
            'items' : []
        };

        var items = data.find('dragText');
        items.each(function(i, val) {
            var item = $(this),
                value = {
                        'id' : i,
                        'term': item.text()
                    };
            obj.items.push(value);
        });

        return obj;
    }

    var ile = {

        init : function( url, callBack ) {
			_callback = callBack;

            try {
                loadData(url, function( data ) {
                            _data = data;
                            ile.build();
                        },
                        xmlParser
                    );
            }
            catch(error) {
                parent.nav.writeToLog('dragDropTextCustom error:' + error);
            }
			
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
            _revealBtn = $('#revealBtn');
            _actions = $('#actions');
            _feedback = $('#feedback');
            _draggables = $('#draggables');
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
        },

        build : function() {

            //var shuffledItems = _data.items.slice().sort(function () { return 0.5 - Math.random() });
			var shuffledItems = shuffleArray(_data.items.slice());

            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");

            // add draggable and targets to page 
            for (var i = 0; i < _data.items.length; i++) {
                var item = _data.items[i],
                    shuffledItem = shuffledItems[i],
                    targetHtml = '<div class="spacer" t="'+ item.id + '">&nbsp</div>' +
                                 '<div class="target" t="' + item.id + '"></div>',
                    trg = $('#target' + i);
                _draggables.append('<div class="drag" t="' + shuffledItem.id + '">' + shuffledItem.term + '</div>');
                if (trg.length == 0) {
                    parent.nav.writeToLog('dragDropTextCustom error: A #target' + i + ' container element was not found. There are more draggables than target spots.');
                }
                else {
                    trg.append(targetHtml);
                }
            }


            $('div.drag').draggable({
                    snap: 'div.target',
                    snapMode: 'inner',
                    snapTolerance: 20,
                    stop: function (event, ui) {
                        ile.checkEnableSubmit();
                        $(this).removeClass('dragging-background');
                    },
                    start: function (event, ui) {
                        $(this).removeData('droppableId')
                               .addClass('dragging-background');
                    },
                    revert: function (event, ui) {
                        $(this).data("draggable").originalPosition = {
                            top: 0,
                            left: 0
                        };
                        return !event;
                    }
            });
            $('div.drag').css('-ms-touch-action', 'none');

            $('div.target').droppable({
                    drop : function(event, ui) {
                        var offset = $(this).offset(),
                            droppedDiv = ui.draggable,
                            draggableId = $(this).data('draggableId');
                    
                        if (draggableId && draggableId != droppedDiv.attr('t')) {
                            var el = $('div.drag[t=' + draggableId + ']');
                            el.removeData('droppableId')
                              .removeClass('dropped-background')
                              .animate({ top: 0, left: 0 }, "slow");
                        }
                        $(this).data('draggableId', droppedDiv.attr('t'));
                        droppedDiv.offset(offset);
                        parent.nav.writeToLog("dragDropTextCustom: dropped text" + droppedDiv.attr('t') + " on target" + $(this).attr('t'));
                        $.data(droppedDiv[0], 'droppableId', $(this).attr('t'));
                        droppedDiv.addClass('dropped-background');
                    },
                    out: function (event, ui) {
                        var droppedDiv = ui.draggable;
                        if ($(this).data('draggableId') == droppedDiv.attr('t'))
                            $(this).removeData('draggableId');
                        droppedDiv.removeClass('dropped-background');
                    },
                    tolerance: "pointer"
                });
             
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
			
			if (_callback!=undefined){
				_callback.call();
			}
			
        },

        _disableDraggables : function() {
            $('div.drag').draggable( "option", "disabled", true );
        },

        reveal : function() {

            var i = 0,
                l = _data.items.length;

            for(;i<l;i++) {
                var item = _data.items[i],
                    dragable = $('div.drag[t=' + item.id + ']')
                    target = $('div.target[t='+ item.id +']');

                dragable.offset(target.offset());
            }
            $('div.spacer').removeClass('incorrect correct')
            $('#feedbackText').html(_data.tryAgain);
            this.markCompletion();
        },

        score : function() {

            _attempts++;
            var isCorrect = true,
                result = _data.correct,
                drags = $('div.drag');

            for (var i = 0; i < drags.length; i++) {
                var draggedDiv = drags[i],
                    trgData = $.data(draggedDiv),
                    trgId = trgData.droppableId,
                    cidx = draggedDiv.attributes.t.value; //correct ordered index

                if (trgId == cidx) {
                    //div is in right target
                    if (_attempts > 1) {
                        $('div.spacer[t=' + trgId + ']').addClass('correct');
                    }
                }
                else {
                    //wrong target
                    isCorrect = false;
                    var target = $('div.target[t=' + trgId + ']');
                    target.droppable('option', 'accept', 'div.drag');
					target.removeData('draggableId');
					delete trgData['droppableId'];

                    if(_attempts === 1) {
                        $(draggedDiv).removeClass('dropped-background')
                             .animate({top:0, left:0},"slow");
                    }
                    else {
                        $('div.spacer[t=' + trgId + ']').addClass('incorrect');
                    }
                }
            }

            if(isCorrect) {
                this.markCompletion();
                $('div.spacer').addClass('correct');
                this._disableDraggables();
            }
            else {

                if(_attempts === 1) {
                    result = _data.incorrect;
                }
                else {
                    result = _data.revealed;
                    _revealBtn.click($.proxy(this.revealHandler, this)).show();
                    this._disableDraggables();
                }
            }

            $('#feedbackText').html(result);
            _feedback.show();
        },

        markCompletion : function() {
            parent.nav.eventCompleted("content");
        },

        revealHandler : function( event ) {
            _revealBtn.hide();
            this.reveal();
        },

        submitHandler : function( event ) {
            _submitBtn.hide();
            this.score();
        },

        checkEnableSubmit : function() {

            _submitBtn.show();
            _feedback.hide();

            var enableSubmit = true,
                drags = $('div.drag'),
                i = 0,
                l = drags.length;

            for(;i<l;i++) {
                var el = drags[i];
                if(!$.data(el, 'droppableId')) {
                    enableSubmit = false
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