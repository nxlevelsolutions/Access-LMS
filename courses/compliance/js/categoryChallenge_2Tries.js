/* __________________________
 * categoryChallenge v2
 * --------------------------
 * parameters: 
 *             
 */

var categoryChallenge = (function(){
    "use strict";
    var _data,
		_attempt = 0,
        _cardsContainer,
        _submitBtn,
        _revealBtn,
		_tryAgainBtn,
        _modal,
        _totalCards,
        _zIndex,
        _firstCardTopPosition,
        _originalCardHeight,
        _targetCardTopOffset = 20,
        _deckCardTopOffset = 10;

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
            failed: function (xhr, ajaxOptions, thrownError) {
                parent.nav.writeToLog("categoryChallenge: loading error " + xhr.status + ": " + thrownError, true);
            }
        });
    }

    function xmlParser( data ) {

        data = $(data);
        var obj = {
            "correct" : data.find('correct').text(),
            "revealed" : data.find('revealed').text(),
            "instructions" : data.find('instructions').text(),
			"incorrect" : data.find('incorrect').text(),
            "tryAgain" : data.find('tryAgain').text(),
            "categories":[],
            "items":[],
			"score" : data.find('score').text()
        };

        if (data.find('exercise').attr('deckCardTopOffset')) {
            _deckCardTopOffset = parseInt(data.find('exercise').attr('deckCardTopOffset'),10);
        }

        if (data.find('exercise').attr('targetCardTopOffset')) {
            _targetCardTopOffset = parseInt(data.find('exercise').attr('targetCardTopOffset'),10);
        }

        var categories = data.find('category'),
            items = data.find('item');

        var i=0, l=categories.length;

        for(;i<l;i++) {
            var category = $(categories[i]);
            obj.categories.push({
                "id" : parseInt(category.attr('id'),10),
                "header" : category.find('header').text()
            });
        }

        i=0,l=items.length;
        for(;i<l;i++) {
            var item = $(items[i]);
	        obj.items.push(
                {
                    "id" : 'd' + i,
                    "cid": parseInt(item.parent().parent().attr('id'), 10),
                    "image" : item.attr('img') || '',
                    "content" : item.text()
                });
        }

        // randomize the items
//        obj.items.sort(function() { return 0.5 - Math.random(); });
		parent.shuffleArray(obj.items);

        return obj;
    }

    var ile = {
        indexInArray : function (arr, val) {
            // IE7 does not support Array.indexOf so....
            var idx = -1;
            if (arr.indexOf){
                idx = arr.indexOf(val);
            }
            else{
                for (var i=0; i<arr.length; i++){
                    if (arr[i]===val){
                        idx = i;
                        break;
                    }
                }
            }
            return idx;
        },


        init : function( url ) {

            _cardsContainer = $('#cards-container .cards');
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));

            _revealBtn = $("#revealBtn");
            _revealBtn.click($.proxy(this.reveal, this));

			_tryAgainBtn = $("#tryAgainBtn");
            _tryAgainBtn.click($.proxy(this.tryAgain, this));

           _modal = $('.modal-container');

            try {
                loadData(url, function( data ) {
						_data = data;
						ile.build();
					},
    	            xmlParser
                );
            }
            catch(error) {
                parent.nav.writeToLog('categoryChallenge.init error =>' + error);
            }

        },

        build : function() {
            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");
            $("#category-container0").find('.header .title').html(_data.categories[0].header);
            $("#category-container1").find('.header .title').html(_data.categories[1].header);
            _totalCards = _data.items.length;
            _zIndex = _totalCards+1;

            // add items
            var elements = "",
                i=0,
                l = _data.items.length;

            for(;i<l;i++) {
                var item = _data.items[i],
                    top = i*_deckCardTopOffset;
                    _firstCardTopPosition = top;
                elements += '<div id="' + item.id + '" cid="t' + item.cid + '" class="card draggable" style="top: '+ top + 'px; z-index:'+ i + ' "><div class="icon icon-cancel"></div><p>' + item.content + '</p><div class="image-bg" style="background-image: url('+item.image+')"></div></div>';
            }

            _cardsContainer.html(elements);
            ile._updateDeckLayout();

            var last_card = $(_cardsContainer.children()).last(),
                cards_height = last_card.position().top + last_card.height();
            _modal.height(cards_height);
            _originalCardHeight = last_card.height();

            $('div.draggable').draggable( {
                    stop: function(event, ui) {
                        ile.checkEnableSubmit();
                        $(this).removeClass('dragging');
                    },
                    start: function(event, ui) {
                        var el = $(this),
                            card_id = el.attr('id'),
                            target_id = el.data('target');

                        if (el.hasClass('completed')) {
                            event && event.preventDefault();
                            return;
                        }

                        if (target_id) {
                            var target = $('#'+target_id),
                                target_cards = target.data('cards') ? target.data('cards').split(',') : [],
                                idx = ile.indexInArray(target_cards, card_id);
                            target_cards.splice(idx, 1);
                            if (target_cards && target_cards.length) {
                                target.data('cards', target_cards.join());
                                ile._reorderTargets();
                            } else {
                                target.removeData('cards');
                            }
                            el.removeData('target');
                        }

                        if (!el.hasClass('dropped')) {
                            el.data('originalSize', {
                                width: el.outerWidth(),
                                height: el.outerHeight()
                            });
                        } else {
                            if (target) {
                                el.css( {
                                    height: target.height()
                                });
                            }
                        }
                        el.addClass('dragging');
                        el.css('z-index', _zIndex++);
                        ile._updateDeckLayout();
                    },

                    revert: function (event, ui) { // called if card not dropped on a target
                        var el = $(this),
                            cardsInDeck = (_totalCards-1)-$('.card.dropped').length;
                        if (!el.hasClass('dropped')) {
                            el.css({
                                    'width': el.data('originalSize').width+'px',
                                    'height': el.data('originalSize').height+'px'
                                });
                            el.removeClass('small');
                        }
                        //el.data('originalPosition', {
                        //    top: _firstCardTopPosition+'px',
                        //    left: 0
                        //});
                        return !event;
                    }
            });
            //$('div.draggable').css('-ms-touch-action', 'none');

            $('div.target').droppable({
                    drop : function(event, ui) {
                        var target = $(this),
                            offset = target.offset(),
                            target_top = offset.top,
                            cardHeightDiff,
                            cards;
                        // add cards to target
                        cards = target.data('cards') ? target.data('cards').split(',') : [];
                        cards.push(ui.draggable.attr('id'));
                        target.data('cards', cards.join());

                        // find the top offset and set width and height of card to that of target
                        offset.top += (cards.length-1)*_targetCardTopOffset;
                        cardHeightDiff = offset.top-target_top;

                        //relocate draggable according to target
                        ui.draggable.offset(offset); //snap to x, y
                        ui.draggable.animate({       //animate w, h
                            'width': target.outerWidth()+'px',
                            'height': (target.outerHeight()-cardHeightDiff)+'px'
                        }, 200, 'easeOutQuad', ile._onWindowResize);
                        ui.draggable.addClass('dropped').addClass('small');
                        ui.draggable.data('target', target.attr('id'));
                    },
                    out : function(event, ui) {
                        ui.draggable.removeClass('dropped');
                    }
                });

                $(window).resize($.proxy(this._onWindowResize, this));

        },

        _updateDeckLayout : function () {

            var cards = _cardsContainer.find('.card').not('.dragging').not('.dropped'),
                top = _firstCardTopPosition,
                cardWidthDiff = 10,
                i, j;

            for (i=(cards.length-1), j=0; i >=0; i--, j++) {
                var card = $(cards[i]),
                    width = card.parent().width()-(j*cardWidthDiff);
                top -= _deckCardTopOffset;
                card.css({
                        'top': top,
                        'width': width,
                        'margin-left': (j*cardWidthDiff)*0.5
                    });
            }

        },

        _reorderTargets : function () {
            var cards_in_deck = _cardsContainer.find('.card').not('.dragging').not('.dropped'),
                original_width = cards_in_deck.last().outerWidth(),
                original_height = cards_in_deck.last().outerHeight();

            var targets = $('div.target');
            for (var i=0; i < targets.length; i++) {
                var target = $(targets[i]),
                    cards = target.data('cards') ? target.data('cards').split(',') : [];
                if (cards && cards.length) {
                    for (var j=0; j < cards.length; j++) {
                        var card = $('#'+cards[j]),
                            offset = target.offset(),
                            target_top = offset.top,
                            cardHeightDiff;
                        offset.top += j*_targetCardTopOffset;
                        cardHeightDiff = offset.top-target_top;
                        card.css({
                                'z-index' : j+1,
                                'top': card.offset(offset).top,
                                'left': card.offset(offset).left,
                                'width': target.outerWidth(),
                                'height' : (target.outerHeight()-cardHeightDiff)
                            });
                        if (card.data('draggable') && cards_in_deck && cards_in_deck.length) {
                            card.data('originalSize', {
                                    width: original_width,
                                    height: original_height
                                });
                        } else if (card.data('draggable')) {
                            card.data('originalSize', {
                                    width: _cardsContainer.width(),
                                    height: _originalCardHeight
                                });
                        }
                    }
                }
            }

        },

        _onWindowResize : function (event) {
            ile._updateDeckLayout();
            ile._reorderTargets();
        },

        score : function() {

            var targets = $('div.target'),
                correct_cards;

            for (var i=0; i < targets.length; i++) {
                var target = $(targets[i]),
                    target_responses = target.data('cards') ? target.data('cards').split(',') : [];
                for (var j=0; j < target_responses.length; j++) {
                    var card = $('#'+target_responses[j]);
                    if (card.attr('cid') !== target.attr('id')) {
                        card.addClass('incorrect');
                    }
                }
            }
			
			///if (_attempt === 0) {
	            correct_cards = _cardsContainer.find('.card').not('.incorrect');
			///} else {
    	    ///    correct_cards = _cardsContainer.find('.card').not('.incorrect').not('.prevCorrect');
			///}

			_modal.find('.total').html(correct_cards.length + ' ' + parent.nav.settings.labelOf + ' ' + _totalCards + ' ' + parent.nav.settings.labelCorrect);
			_modal.find('.score p:first').html(_data.score);
            _modal.find('.percent').html(Math.ceil((correct_cards.length/_totalCards)*100)+'%');
			
			if (_cardsContainer.find('.card').not('.incorrect').length === _totalCards) {
				_modal.find('.fdbk-txt').html(_data.correct);
                _revealBtn.hide();
				_tryAgainBtn.hide();
				
				parent.nav.eventCompleted("content");
				parent.nav.saveBookmark();
			} else if  (_attempt < 1 ) {
				_modal.find('.fdbk-txt').html(_data.tryAgain);
				_revealBtn.hide();
				_tryAgainBtn.show();
			} else {
				 parent.nav.saveBookmark();
				_modal.find('.fdbk-txt').html(_data.incorrect);
				_revealBtn.show();
				_tryAgainBtn.hide();
            }
			///_cardsContainer.find('.card').not('.incorrect').addClass('prevCorrect completed');
			
			
			
			
            _modal.addClass('on');
            setTimeout(function () {
                    _modal.find('.modal').css('opacity', 1);
                }, 100);

        },

        reveal : function() {

            _modal.removeClass('on');
            $('#actions-container').append('<p>'+_data.revealed+'</p>');
            _submitBtn.hide();
            $('#actions-container').css('display', 'table-cell');
			$('#actions-container').show();

            var incorrect_cards = $('.card.incorrect'),
                targets = $('div.target');

            for (var i=0; i < incorrect_cards.length; i++) {
                var card = $(incorrect_cards[i]);

                for (var j=0; j < targets.length; j++) {
                    var target = $(targets[j]);

                    if (target.attr('id') !== card.attr('cid')) {

                        var card_id = card.attr('id'),
                            target_cards = target.data('cards') ? target.data('cards').split(',') : [],
                            idx = ile.indexInArray(target_cards, card_id);
                        target_cards.splice(idx, 1);
                        target.data('cards', target_cards.join());
                        card.data('target', card.attr('cid'));

                        var correct_target = $('#'+card.attr('cid')),
                            correct_cards = correct_target.data('cards') ? correct_target.data('cards').split(',') : [],
                            offset = correct_target.offset();
                        correct_cards.push(card_id);
                        correct_target.data('cards', correct_cards.join());

                        card.removeClass('incorrect');
                        card.css('left', card.offset(offset).left);

                    }

                }

            }
            ile._reorderTargets();
			//parent.nav.getPage().completed = true;
			parent.nav.eventCompleted("content");
			parent.nav.saveBookmark();
        },
		
        tryAgain : function() {
            _modal.removeClass('on');
			_attempt++;

            var incorrect_cards = $('.card.incorrect'),	// accrues all the incorrect cards into an array
				targets = $('div.target');

            for (var i=0; i < incorrect_cards.length; i++) {	// look at all the incorrect cards
                var card = $(incorrect_cards[i]);

                for (var j=0; j < targets.length; j++) {	// starting on the left columnm,
                    var target = $(targets[j]);

                    if (target.attr('id') !== card.attr('cid')) {	// if the card doesn't belong in that column,

                        var card_id = card.attr('id'),
                            target_cards = target.data('cards') ? target.data('cards').split(',') : [], // looking at a string listing all cards in that column,
																										// if the string's not empty, add quotes around each item
                            idx = ile.indexInArray(target_cards, card_id);	// figure out where the current card is
                        target_cards.splice(idx, 1);	// remove it from target_cards
                        target.data('cards', target_cards.join());	// and join the elements of array target into a string??? try this with more/fewer elements

						card.data('target',''); // remove the current target setting
						card.removeClass('completed incorrect dropped small dragging draggable'); // remove classes
						card.removeAttr('style'); // remove styling including left and top
						$('#cards-container.cards').append(card); // move the card back to the center
                    }
                }
            }
            ile._reorderTargets();
			ile._updateDeckLayout();
        },

        submitHandler : function( event ) {
            //_submitBtn.hide();
			$('#actions-container').hide();
            this.score();
        },

        checkEnableSubmit : function() {
			if ($('.card').not('.dropped').length === 0) {
                $('#actions-container').css('display', 'table-cell')
				$('#actions-container').show();
                _submitBtn.removeAttr('disabled').removeClass('disabled');
            } else {
                $('#actions-container').hide();
                _submitBtn.attr('disabled', 'disabled');
            }
        }
    };

    return ile;

})();