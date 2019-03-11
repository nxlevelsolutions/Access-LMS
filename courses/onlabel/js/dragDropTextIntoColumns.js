/* __________________________
 * dragDropTextIntoColumns v2
 * --------------------------
 * Sets up items that can be randomly dragged and dropped onto another column. 
 * parameters: 
 *             
 */

dragDropTextIntoColumns = (function(){
    "use strict";
    var _data,
        _attempts = 0,
		_content,
        _submitBtn,
        _revealBtn,
        _actions,
        _feedback,
        _columnWidthPercentage,
        _columnWidthBuffer = 1,
        _groups={},
        _allAnswersRequired = true,
		tallestColumn = 0;

    function loadData( url, callback, parser ) {
        $.ajax({
            url: url,
            dataType: 'xml',
            success: function (xml) {
                var data = parser && parser(xml);
                callback && callback(data || {});
            },
            failed: function (xhr, ajaxOptions, thrownError) {
                parent.nav.writeToLog('DragDropTextIntoColumns error=' + url + " loading error." + xhr.status + ": " + thrownError, true);
            }
        });
    }
    
    function parseItems ( items ) {
        var list = [];
        if(items.length) {
            items.each(function(i, val) {
                var item = $(this),
                value = {
                        'id' : i,
                        'c' : item.attr('c'),
                        'text' : item.text()
                    };
                if (item.attr('c') == '') _allAnswersRequired = false;
                list.push(value);
            });
        }
        return list;
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
            'columns' : []
        };
            
        var columns = data.find('column');
        
        columns.each(function(i, val) {
            var column = $(this),
                value = {
                        'id' : i,
                        'header' : column.find('header').text(),
                        'headerColor' : column.find('header').attr('color'),
                        'items' : [],
                        'width' : parseInt(column.attr('width'),10),
                        'color' : column.attr('color')
                    };
                        
            var items = column.find('item');
                
            if(items.length) {
                value.items = parseItems(items);
            }
                    
            obj.columns.push(value);
        });

        return obj;
    }
    
    var ile = {

        init : function( url ) {

            try {
                loadData(url, function( data ) {
                        _data = data;
                        ile.build();
                    },
                    xmlParser
                );
            }
            catch(error) {
                parent.nav.writeToLog('dragDropTextIntoColumns error =>' + error);
            }
            
            _content = $('#exercise-content');
            _submitBtn = $('#submitBtn');
            _submitBtn.click($.proxy(this.submitHandler, this));
            _revealBtn = $('#revealBtn');
            _actions = $('#actions');
            _feedback = $('#feedback');

            _actions.show();
            
        },
        
        _generateItemsMarkup : function( items, id ) {
            
            var i = 0,
                l = items.length,
                markup = "";
                
            function getMarkup(_item, _id, _groupID) {
                return '<div class="item drag" t="' + _id + '" c="' + _item.c + '" g="' + _groupID + '">' + 
                          '<div class="icon"><span></span></div><p>' + _item.text + '</p></div>';
            }
                
            for(;i<l;i++) {
                var item = items[i],
                    groupID = "";
                    
                if(typeof item.c == "string" && item.c.split(',').length > 1) {
                    var correct = item.c.split(',');
                    groupID = new Date().getTime();
                    _groups[groupID] = {
                        possibleValues : correct,
                        unusedValues : correct
                    }
                    $(correct).each(function() {
                        markup += getMarkup(item, id, groupID);
                    });
                }
                else {
                    markup += getMarkup(item, id, groupID);
                }
            }
            
            return markup;
        },

        _updateColumnLayout : function( column, animate ) {
            column = $(column);
            var columnID = column.attr('t'),
                items = _content.find('div.drag[t=' + columnID + ']'),
                i = 0,
                l = items.length;
            
            // Arrange by offset
            items.sort(function(a, b){
                return $(a).offset().top-$(b).offset().top;
            });
            
            var offset = column.position(), 
                sampleItem = $(items[i]),
                itemPadding = sampleItem.outerWidth() - sampleItem.width(),
                width = column.width() - itemPadding,
				adjHeight = $("#exercise-content").scrollTop();
            
			if(adjHeight > 0) {
				offset.top += adjHeight;
			}
			
            for(;i<l;i++) {
                var item = $(items[i]);
                if(animate) {
                    item.animate({'top':offset.top, 'left':offset.left, width:width}, 250);
                }
                else {
                    item.css({'top':offset.top, 'left':offset.left, width:width});
                }
                offset.top += item.outerHeight() + _data.rowSpacing;
            }
			
            column.data('dragY', offset.top);// Is this used/needed?
			
			this._findTallestColumn();
        },
		
		_findTallestColumn : function() {
			var cl = $('div.target').length,
                columnH = [],
                i, j;
			for(i=0;i<cl;i++) {
				var column = $('div.target[t=' + i + ']'),
					items = _content.find('div.drag[t=' + i + ']'),
					l = items.length,
					offset = column.position(),
					adjHeight = $("#exercise-content").scrollTop();
				if(adjHeight > 0) {
					offset.top += adjHeight;
				}
				for(j=0;j<l;j++) {
					var item = $(items[j]);
					offset.top += item.outerHeight() + _data.rowSpacing;
				}
				columnH.push(offset.top);
			}			
			$("div.column").css("height", Math.max.apply(null, columnH) + "px");
			$("div.target").css("height", Math.max.apply(null, columnH) + "px");
		},
        
        _updateColumnWidthPercentage : function () {
            var contentWidth = _content.outerWidth();
            _columnWidthPercentage = parseInt((contentWidth/_data.columns.length)/contentWidth*100, 10);
            _columnWidthPercentage-=_columnWidthBuffer;
        },

        build : function() {
            
            this._updateColumnWidthPercentage();
            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");
            var i = 0,
                l = _data.columns.length,
                draggables = "",
                content = "";
            
            for(;i<l;i++) {
                var column = _data.columns[i],
                    columnColor = column.color || "#ffffff",
                    headerColor = column.headerColor || "#ffffff";
                
                content += '<div id="c' + i + '" class="column' + ((i) ? '' : ' first') + '" style="width:' + _columnWidthPercentage + '%; background-color:'+ columnColor +'">' +
                                '<div class="header" style="background-color:'+ headerColor + ';">' + column.header + '</div>' + 
                                '<div class="target" t="' + i + '"></div>' +
                           '</div>';
                
                if(i == 0 && column.items.length) {
                    //var items = column.items.slice().sort(function() { return 0.5 - Math.random() });;
					var items = shuffleArray(column.items.slice());
                    draggables += this._generateItemsMarkup(items, i);
                }
            }
            
            _content.html(content + draggables);
            
            var firstColumn = $('div.target[t=0]');
            
            this._updateColumnLayout(firstColumn, false);

            $('div.drag').draggable( {
                    containment: '#container',
                    stop: function(event, ui) {
                        ile.checkEnableSubmit();
                        $(this).removeClass('dragging-background');
                        ile._updateColumnLayout(firstColumn, true);
                        if (!_allAnswersRequired) _submitBtn.removeAttr('disabled');
                    },
                    start: function(event, ui) {
                        var element = $(this);
                        element.removeClass('dropped-background')
                               .addClass('dragging-background');
                        
                        if(!element.data('originalStartPosition')) {
                            element.data('originalStartPosition', element.position());
                        }
                    },
                    revert: function (event, ui) {
                        
                        var el = $(this);
                        
                        var origStartPos = $(this).data('originalStartPosition');
                        el.removeClass('dragging-background');
                          //.data('originalPosition', {
                          //          top: origStartPos.top,
                          //          left: origStartPos.left
                          //      });
                        
                        if(el.attr('t') == 0 && el.attr('g')) {
                            ile._groupItemDropped(this, 0);
                        }
                        
                        return !event;
                    }
            });

            //$('div.drag').css('-ms-touch-action', 'none');

            $('div.target').droppable({
                drop : function(event, ui) {
                    var oldTargetID = ui.draggable.attr("t"),
                        newTargetID = $(this).attr('t');
                    if(ui.draggable.attr('g')) {
                        ile._groupItemDropped(ui.draggable, newTargetID);
                    }
                    ui.draggable.attr("t", newTargetID);
                    ui.draggable.addClass('dropped-background');
                    ile._updateColumnLayout($(this), true);
                    if(oldTargetID == 0 && newTargetID != 0) {
                        ile._updateColumnLayout(firstColumn, true);
                    }
                },
                out : function(event, ui) {
                    var oldTarget = ui.draggable.attr('t');
                    ui.draggable.attr("t", 0);
                    if(oldTarget != 0) {
                        ile._updateColumnLayout($('div.target[t='+ oldTarget + ']'), true);
                    }
                    ui.draggable.removeClass('dropped-background');
                }
            });
                
            $(window).resize(function() {
                Utilities.debounce(function(){
                    ile._updateAllColumnLayouts();
                }, 150);
            });
                
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
            var btnY = parseInt((_content.offset().top + _content.height()/2) - _revealBtn.height()/2, 10);
            _revealBtn.css('top', btnY + 'px');    
        },
        
        _groupItemDropped : function( item, targetID ) {
            
            item = $(item);
            
            var group = _groups[item.attr('g')],
                i = 0,
                l = group.unusedValues.length;

            if(item.attr('c').split(',').length == 1) {
                group.unusedValues.push(item.attr('c'));
            }
            
            if(targetID == 0) {
                item.attr('c', group.possibleValues)
            }
            else {
                for(;i<l;i++) {
                    var value = group.unusedValues[i];
                    if(value == targetID) {
                        item.attr('c', value)
                        group.unusedValues.splice(i,1);
                        return;
                    }
                }
                
            }

        },

        _disableDraggables : function() {
            $('div.drag').draggable( "option", "disabled", true );
        },

        _updateAllColumnLayouts : function () {
            var i = 0, l = _data.columns.length;
            for(;i<l;i++) {
                this._updateColumnLayout($('div.target[t='+ i +']'), false);
            }
        },

        reveal : function() {

            var items = $('div.drag'),
                i = 0,
                l = items.length;

            for(;i<l;i++) {
                var item = $(items[i]);
                
                if(item.find('div.correct').length) {
                    continue;
                }
                else {
                    if(item.attr('g')) {
                        var group = _groups[item.attr('g')],
                            j = 0,
                            jl = group.possibleValues.length,
                            k = 0,
                            kl = group.unusedValues.length;

                        for(;j<jl;j++) {
                            var possible = group.possibleValues[j],
                                kill = false;
                            for(;k<kl;k) {
                                var unused = group.unusedValues[k]
                                if(unused == possible) {
                                    item.attr('t', group.unusedValues.splice(k,1))
                                    kill = true;
                                    break;
                                }
                            }
                            if(kill) break;
                        }
                    }
                    else {
                        item.attr('t', item.attr('c'));
                    }
                }
            }

            var column = $('div.target[t=0]'),
                offset = column.position(),
                tmpArr;
            //get all with set answers
            tmpArr = $.grep(items, function (item, i) {
                return $(item).attr('c') != ''
            })
            $(tmpArr).find('div.incorrect').removeClass('incorrect').addClass('correct');

            //get all with unset answers
            tmpArr = $.grep(items, function (item, i) {
                return $(item).attr('c') == '';
            })
            $(tmpArr).find('div.incorrect').each(function (idx, item) {
                var item = $(item);
                item.removeClass('incorrect');
                item.parent().animate({top: offset.top, left: offset.left}, 250);
                offset.top += item.parent().height();
            });
             
            // Set by column
            this._updateAllColumnLayouts();
//            $('#feedback-text').html(_data.revealed);
			showPop3("Feedback", _data.revealed, {x:'+50', y:'+80'}); // use popup for feedback

            this.markCompletion();
        },

        score : function() {

            _attempts++;

            var isCorrect = true,
                result = _data.correct,
                items = $('div.drag'),
                i = 0,
                l = items.length;
            
            for(;i<l;i++) {
                var item = $(items[i]);
                if (item.attr('c') == '' && !item.hasClass('dropped-background')) continue;
                if(item.attr("t") != item.attr("c") ) {
                    isCorrect = false;
                    item.attr("t", 0);
                    if(_attempts === 2) {
                        item.find('.icon').addClass('incorrect');
                    }
                }
                else {
                    if(_attempts === 2) {
                        item.find('.icon').addClass('correct');
                    }
                }
            }

            if(isCorrect) {
                this.markCompletion();
                items.find('div.icon').addClass('correct');
                this._disableDraggables();
				showPop3("Feedback", result, {x:'+50', y:'+80'}); // use popup for feedback

            }
            else {
                if(_attempts === 1) {
                    result = _data.tryAgain;
                    this._updateAllColumnLayouts();
                }
                else {
                    result = _data.incorrect;
                    _revealBtn.click($.proxy(this.revealHandler, this)).show();
                    this._disableDraggables();
                }
				showPop2("Feedback", result, {x:'+50', y:'+80'}); // use popup for feedback

            }

//            $('#feedback-text').html(result);
//            _feedback.show();
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
                if($(el).attr('t') == 0) {
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