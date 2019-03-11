

var flashCards = (function(){
    "use strict";
    var _data,
        _$cardsContainer,
        _$currentCard,
        _$nextBtn,
        _$previousBtn,
        _$shuffleBtn,
        _completed = false;

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
                parent.nav.writeToLog("flashCards: loading error " + xhr.status + ": " + thrownError, true);
            }
        });
    }

    function xmlParser( data ) {

        data = $(data);
        var obj = {
            "instructions" : data.find('instructions').text(),
            "cards" : []
        };

        var cards = data.find('cards').children();

        for (var i=0; i<cards.length; i++) {
            var card = $(cards[i]);
            obj.cards.push({
                "id" : 'l' + i,
                "front" : card.find('front').text(),
		        "back" : card.find('back').text(),
		        "completed" : false
            });
        }

        return obj;
    }

    var ile = {

        init : function( url ) {

            _$cardsContainer = $('#cards-container');
            _$nextBtn = $('#nextBtn');
            _$previousBtn = $('#previousBtn');
            _$shuffleBtn = $('#shuffleBtn');
            _$nextBtn.attr('disabled', 'disabled').click($.proxy(this.next, this));
			_$nextBtn.addClass('disabled');
            _$previousBtn.attr('disabled', 'disabled').click($.proxy(this.previous, this));
			_$previousBtn.addClass('disabled');
            _$shuffleBtn.attr('disabled', 'disabled').click($.proxy(this.reset, this));
			_$shuffleBtn.addClass('disabled');

            try {
                loadData(url, function( data ) {
                        _data = data;
                        ile.build();
                    },
                    xmlParser
                );
            }
            catch(error) {
                parent.nav.writeToLog('flashCards.init error =>' + error);
            }

        },

        reset : function() {
            //_data.cards.sort(function() { return 0.5 - Math.random() });
			shuffleArray(_data.cards); // Fisher-Yates shuffle
            this.build();
        },

        build : function() {

            var card_els = '';
            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");
            for (var i=0; i<_data.cards.length; i++) {
                var card = _data.cards[i];
                card_els += '<div id="' + card.id + '" class="card hidden">' + '<div class="front"><div class="content">' +
                    '<table width=100% height=100%><tr><td align=center valign=middle>' + 
                    card.front +
                    '</td></tr></table>' +
                    '</div></div>' + '<div class="back"><div class="content">' +
                    '<table width=100% height=100%><tr><td align=center valign=middle>' + 
                    card.back + 
                    '</td></tr></table>' +
                    '</div></div></div>';
            }

            _$cardsContainer.html(card_els);

            $('.card .front').click($.proxy(this.cardClick, this));
            $('.card .back').click($.proxy(this.cardClick, this));

            this.showCard('next');

        },

        showCard : function (dir) {
            var fadeTime;
            _$currentCard && _$currentCard.removeClass('fade');
            var idx = _$currentCard ? _$currentCard.index() : -1;
            dir === 'next' ? idx++ : idx--;
            _$currentCard = $(_$cardsContainer.children()[idx]);
            _$currentCard.removeClass('hidden').removeClass('flip');
            //if browser is IE and less than 9, then don't fadeout
            //if ($.browser.msie==true && Number($.browser.version) < 9){ 
            //    fadeTime = 0;
            //}
            //else{
                fadeTime = !_data.cards[0].completed ? 0 : 500;
            //}
            
            setTimeout(function () {
                _$currentCard.addClass('fade');
            }, fadeTime);
            this.setNavigation(idx);
        },

        cardClick : function (event) {
            event && event.preventDefault();
            $(event.currentTarget).parent().toggleClass('flip');
            _$currentCard.find('.content').animate({scrollTop:0},0);

            var idx = _$currentCard ? _$currentCard.index() : -1;
           if (idx === _$cardsContainer.children().length-1 && !_completed) {
                _completed = true;
                _$shuffleBtn.removeAttr('disabled');
				_$shuffleBtn.removeClass('disabled');
                this.markComplete();
            }

            _data.cards[idx].completed = true;
           this.setNavigation(idx);
        },

        next : function (event) {
            event && event.preventDefault();
            this.showCard('next');
        },

        previous : function (event) {
            event && event.preventDefault();
            this.showCard('previous');
        },

        setNavigation : function (idx) {
            //!idx ? _$previousBtn.attr('disabled', 'disabled') : _$previousBtn.removeAttr('disabled');
			//idx < 1 ? _$previousBtn.attr('disabled', 'disabled') : _$previousBtn.removeAttr('disabled');
			if (idx < 1) {
				_$previousBtn.attr('disabled', 'disabled');
				_$previousBtn.addClass('disabled');
			} else {
				_$previousBtn.removeAttr('disabled', 'disabled');
				_$previousBtn.removeClass('disabled');
			}
            if (idx > -1 && (idx === _$cardsContainer.children().length-1) || !_data.cards[idx].completed) {
                _$nextBtn.attr('disabled', 'disabled');
				_$nextBtn.addClass('disabled');
            } else if (_data.cards[idx].completed) {
                _$nextBtn.removeAttr('disabled');
				_$nextBtn.removeClass('disabled');
            }
        },

        markComplete : function() {
            if(parent.nav) {
                parent.nav.eventCompleted("content");
            }
        }

    };

    return ile;

})();
