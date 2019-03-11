/* __________________________
 * dragDropText v2
 * --------------------------
 * Matching exercise where items have to be dragged and dropped onto another column
 * and into specific spots. 
 * parameters: 
 *             
 */

dragDropText = (function(){
    "use strict";
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
    
    function relocateItems(){
        var mHeight = 0,
            mWidth; 
        //figure max height + width
        $('.drag').each(function(idx){
            var drg = $(this);
            drg.css("height", "100%");
            if ( mHeight < drg.height() ) {
                mHeight = drg.height();
            }
            mWidth = drg.width();
        });
        mHeight += 2; //a pinch taller

        //resize all draggables heights
        $('.drag').each(function(idx){
            $(this).css('height', mHeight);
        });

        //resize all target sizes
        $('.target').each(function(idx){
            $(this).css('height', mHeight).css("width", mWidth);
        });

        //resize all already-dragged left+top positions
        $('td div.target').each(function(idx, el){
            var offset = $(this).offset(),
                draggableId = $(this).data('draggableId');
                //parent.nav.writeToLog('offset: '+offset+', draggableId: '+draggableId+', idx: '+idx);
            if (draggableId!=undefined)
                $('div.drag[t=' + draggableId + ']').offset(offset);
        });

    }
	 
    var ile = {

        init : function( url, callBack ) {
            _callBack = callBack;
            
            $(window).on('resize', function (e) {
                Utilities.debounce(relocateItems, 150);
            });                            

            try {
                loadData(url, function(data) {
                            _data = data;
                            ile.build();
                            relocateItems();
                        }, xmlParser);
            }
            catch(error) {
                parent.nav.writeToLog('dragDropText error:' + error);
            }
			
			_content = $('#content');
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
			
            _revealBtn = $('#revealBtn');
            _actions = $('#actions');
            _feedback = $('#feedback');

            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
        },

        build : function() {

            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");

            var tHeader = _content.find('thead'),
                ths = "",
                tBody = _content.find('tbody'),
                tds = [],
                i,
                rows = _data.items.length,
                //shuffledItems = _data.items.slice().sort(function() { return 0.5 - Math.random() });
				shuffledItems = shuffleArray(_data.items.slice());

            ths = '<tr><th valign="top">' + _data.header1 + '</th><th></th><th></th><th></th><th valign="top">' + _data.header2 + '</th></tr>';

            tHeader.append(ths);

            // add tbody rows
            for(i=0;i<rows;i++) {
                var item = _data.items[i],
                    shuffledItem = shuffledItems[i],
                    result = '<td class="drag-width"><div class="drag" t="' + shuffledItem.id + '">' + shuffledItem.term + '</div></td>' +
                             '<td class="spacer">&nbsp</td>' +
                             '<td class="drag-width"><div class="target" t="' + item.id + '"></div></td>' +
                             '<td class="spacer">&nbsp</td>' +
                             '<td class="definition">' + item.definition + '</td>';
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
                        //$(this).data("originalPosition", {
                        //    top: 0,
                        //    left: 0
                        //});
                    return !event;
                }
            });
            //$('td div.drag').css('-ms-touch-action', 'none');

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
                    dragable = $('div.drag[t=' + item.id + ']'),
                    target = $('div.target[t='+ item.id +']');

                dragable.offset(target.offset());
            }
            $('div.spacer').removeClass('incorrect correct')
            $('#feedbackText').html(_data.tryAgain);
			showPop("Feedback", _data.tryAgain);
            this.markCompletion();
        },

        score : function() {

            _attempts++;

            var isCorrect = true,
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
                    isCorrect = false;
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
//            _feedback.show();
			showPop("Feedback", result);
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