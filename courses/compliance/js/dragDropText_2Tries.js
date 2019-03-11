dragDropText = (function(){

    var _data,
        _attempts = 0,
		_content,
        _submitBtn,
        _revealBtn,
        _actions,
        _feedback,
		_callBack;

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
            'rowSpacing' : parseInt(data.find('exercise').attr('rowSpacing'), 10),
            'header1' : data.find('header1').text(),
            'header2' : data.find('header2').text(),
            'items' : []
        };

        var items = data.find('dragItem');

        items.each(function(i, val) {

            var item = $(this),
                value = {
                        'id' : i,
                        'term' : $(this).find('dragText').text(),
                        'definition' : $(this).find('definition').text()
                    };

                obj.items.push(value);
            });

        return obj;
    }
	
	$(window).resize(function (e) {
		Utilities.debounce(function () {
			$('td div.target').each(function(idx, el){
				var offset = $(this).offset(),
                    draggableId = $(this).data('draggableId');
				/*var offset = el.offset(),
                    draggableId = el.data('draggableId');*/
					parent.nav.writeToLog('offset: '+offset+', draggableId: '+draggableId+', idx: '+idx);
				$('div.drag[t=' + draggableId + ']').offset(offset);
			});
		}, 250);
	});

    var ile = {

        init : function( url, callBack ) {
			_callBack = callBack;

            try {
                loadData(url, function( data ) {
                            _data = data;
                            ile.build();
                        },
                        xmlParser
                    );
            }
            catch(error) {
                parent.nav.writeToLog('dragDropText error:' + error);
            }
			
			_content = $('#content');
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
			
			_submitBtn.addClass('disabled');
			
            _revealBtn = $('#revealBtn');
            _actions = $('#actions');
            _feedback = $('#feedback');

            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
        },

        build : function() {

            $('#instructionsDDT').html('<p>' + _data.instructions + '</p>' || "");

            var tHeader = _content.find('thead'),
                ths = "",
                tBody = _content.find('tbody'),
                tds = [],
                i,
                rows = _data.items.length,
                //shuffledItems = _data.items.slice().sort(function() { return 0.5 - Math.random() });
				shuffledItems = shuffleArray(_data.items.slice());

            ths = '<tr><th valign="top">' + _data.header1 + '</th><th></th><th></th><th valign="top">' + _data.header2 + '</th></tr>';

            tHeader.append(ths);

            // add tbody rows
            for(i=0;i<rows;i++) {
                var item = _data.items[i],
                    shuffledItem = shuffledItems[i],
                    result = '<td class="objW"><div class="drag" t="' + shuffledItem.id + '"><p>' + shuffledItem.term + '</p></div></td>' +
                             '<td><div class="spacer" t="'+ item.id + '">&nbsp</div></td>' +
                             '<td class="objW"><div class="target" t="' + item.id + '"></div></td>' +
                             '<td><div class="definition"><p>' + item.definition + '</p></div></td>';
                tds.push('<tr>' + result + '</tr>');
            }
            tBody.append(tds.join(''));

            $('td div.drag').draggable({
                    snap: 'td div.target',
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
            $('td div.drag').css('-ms-touch-action', 'none');

            $('td div.target').droppable({
                    drop : function(event, ui) {
                        var offset = $(this).offset(),
                            draggableId = $(this).data('draggableId');
                    
                        if (draggableId && draggableId != ui.draggable.attr('t')) {
                            var el = $('div.drag[t=' + draggableId + ']');
                            el.removeData('droppableId')
                              .removeClass('dropped-background')
                              .animate({ top: 0, left: 0 }, "slow");
                        }
                        $(this).data('draggableId', ui.draggable.attr('t'));
                        ui.draggable.offset(offset);
                        $.data(ui.draggable[0], 'droppableId', $(this).attr('t'));
                        ui.draggable.addClass('dropped-background');
                    },
                    out: function (event, ui) {
                        if ($(this).data('draggableId') == ui.draggable.attr('t'))
                            $(this).removeData('draggableId');
                        ui.draggable.removeClass('dropped-background');
                    },
                    tolerance: "pointer"
                });

            $('td').css('paddingBottom', _data.rowSpacing + 'px');
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
			_submitBtn.addClass('disabled');
			var btnY = parseInt((_content.offset().top + _content.height()/2) - _revealBtn.height()/2, 10);
			_revealBtn.css('top', btnY + 'px');
			
			if (_callBack!=undefined){
				_callBack.call();
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

            var allCorrect = true,
                result = _data.correct,
                drags = $('div.drag'),
                i = 0,
                l = drags.length;

            for(;i<l;i++) {
                var el = drags[i],
                    data = $.data(el),
                    target = $('div.target[t='+ data.droppableId +']'),
                    group = el.attributes.t.value;
                if(data.droppableId != group) {
                    allCorrect = false;
                    target.droppable('option', 'accept', 'div.drag');
					target.removeData('draggableId');
                    delete data['droppableId'];

                    if(_attempts === 1) {
                        $(el).removeClass('dropped-background')
                             .animate({top:0, left:0},"slow");
                    }
                    else {
                        $('div.spacer:eq(' + group + ')').addClass('incorrect');
                    }
                }
                else {
                    if(_attempts > 1) {
                        $('div.spacer:eq(' + group + ')').addClass('correct');
                    }
                }
            }

            if (allCorrect) {
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
				_submitBtn.removeClass('disabled');
            }
            else {
                _submitBtn.attr('disabled', 'disabled');
				_submitBtn.addClass('disabled');
            }
        }

    };
	


    return ile;

})();