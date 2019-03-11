selectCheckboxes = (function(){
    "use strict";
    var _data,
        _attempts = 0,
        _submitBtn,
        _actions,
		_revealBtn,
        _feedback,
		_tries = 0,
        _MAX_TRIES = 2;

    function loadData(url, callback, parser) {
        $.ajax({
            url: url,
            context: this,
            dataType: 'xml',
            async: true,
            success: function (xmlDoc) {
                var dataObj = parser(xmlDoc);
                callback(dataObj);
            }
        });
    }

    function xmlParser( data ) {

        data = $(data);

        // model structure
        var obj = {
            "correct" : data.find('correct').text(),
            "incorrect" : data.find('incorrect').text(),
            "revealed" : data.find('revealed').text(),
            "instructions" : data.find('instructions').text(),
            "rowSpacing" : parseInt(data.find('exercise').attr('rowSpacing'), 10),
            "statements" : null,
            "columns" : null
        };

        // statement column data
        var statements = data.find('statements');

        obj.statements = {
            "header" : statements.find('header').text(),
            "width" : statements.attr('width'),
            "children" : []
        };

        statements.find('text').each(function() {
                obj.statements.children.push($(this).text());
            });

        // answer column data
        var columns = data.find('column');

        obj.columns = [];

        columns.each(function() {
            var el = $(this),
                col = {
                    "header" : el.find('header').text(),
                    "width" : el.attr('width'),
                    "children" : []
                };

            el.find('checkmark').each(function() {
                    var val = parseInt($(this).attr('correct'),10);
                    col.children.push(val);
                });
 
            obj.columns.push(col);
        });

        return obj;
    }

    var ile = {

        init : function( url ) {

            _submitBtn = $('#submitBtn');
			_revealBtn = $('#revealBtn').hide();
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
            _actions = $('#actions');
            _feedback = $('#feedback');
            try {
                loadData(url, function( data ) {
                            _data = data;
                            ile.build();
                        },
                        xmlParser
                    );
            }
            catch(error) {
                parent.nav.writeToLog('SelectCheckboxes error =>' + error);
            }
        },

        build : function() {

            $('#instructions').html('<p>' + _data.instructions + '</p>' || "");

            var container = $('#content'),
                tHeader = container.find('thead'),
                ths = [],
                tBody = container.find('tbody'),
                tds = [],
                i,
                rows = _data.statements.children.length,
                cols = _data.columns.length;

            // add thead row
            for(i=0;i<cols;i++) {
                ths.push('<th>' + _data.columns[i].header + '</th>');
            }
            ths.push('<th class="statement-header">' + _data.statements.header + '</th>');

            tHeader.append('<tr>' + ths.join('') + '</tr>');

            // add tbody rows
            for(i=0;i<rows;i++) {
                var j = 0, result = '';
                for(;j<cols;j++) {
                    result += '<td class="answer green-arrow" width="' + _data.columns[j].width + '"><a href="#" class="checkbox" name="q' + i + '_' + j + '"></a></td>';
                }
                result += '<td class="statement" width="' + _data.statements.width + '">' + _data.statements.children[i] + '</td>';
                tds.push('<tr>' + result + '</tr>');
            }
            tBody.append(tds.join(''));

            $('#displayArea td.answer, td.statement').css('paddingBottom', _data.rowSpacing + 'px');
            $('a.checkbox').on('click', this.changeHandler);
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
        },
 
        score : function() {

            var i = 0, j = 0,
                result = '',
                rows = _data.statements.children.length,
                cols = _data.columns.length,
                correct = true,
				cb;

            if(cols === 1) { //only 1 column.. just provide feedback
                $('a.checkbox').unbind('click');

                for(;i<rows;i++) {
					isCorrect = _data.columns[0].children[i]==1;
					cb = $('a[name=q' + i + '_0]')
					if (cb.hasClass('checked')!=isCorrect){
						correct = false;
					}
					if (isCorrect){
						 cb.parent().addClass('correct');
					}
                }

                result = (correct) ? _data.correct : _data.incorrect;

                this.markCompletion();
            }
            else { //more than 1 column.. user gets 2 chances to respond
				_attempts++;
				var isCorrect, 
					allCorrect = true;
				//find out if all correct	
                for(;i<rows;i++) {
					for(;j<cols;j++) {
						cb = $('a[name=q' + i + '_' + j + ']'),
						isCorrect = _data.columns[j].children[i]==1;						
						if (cb.hasClass('checked')!=isCorrect){
							allCorrect = false;
							break;
						}						
					}
					j = 0;
					if (allCorrect==false) break;
				}
				//show reveal arrows, etc.
				i=0; j=0;
                for(;i<rows;i++) {
					for(;j<cols;j++) {
						cb = $('a[name=q' + i + '_' + j + ']'),
						isCorrect = _data.columns[j].children[i]==1;
						if (cb.hasClass('checked')!=isCorrect){
							correct = false;
						}
						if (_attempts==1 && !allCorrect){
							//1st try and some are wrong...just remove wrong checkmarks
							if (!isCorrect)	cb.removeClass('checked');	
						}
						else{ //2nd try.. OR all are correct...add green arrows on all correct ones
							cb.unbind('click'); //remove all click event
							if (isCorrect) cb.parent().addClass('correct');
						}
					}
					j = 0;
                }
				//set feedback message
				if (_attempts==1){
					result = correct ? _data.correct : _data.revealed;
				}
				else{
					result = correct ? _data.correct : _data.incorrect;
				}
                
				this.markCompletion();

            }

            _feedback.find('#feedbackText').html(result);
            _feedback.show();
        },

        markCompletion : function() {
            parent.nav.eventCompleted("content");
        },
		
        revealHandler : function( event ) {
            _revealBtn.hide();
            this.reveal();
        },
		
        submitHandler: function (event) {
            _tries++;

            var cols = _data.columns.length,
                isCorrect;

            if (cols === 1) {
                if (_tries == _MAX_TRIES) {
                    //final try
                    _submitBtn.hide();
                    this.score();
                }
                else {
                    //1st try.. check if correct
                    var correct = true,
                        rows = _data.statements.children.length,
                        cb;
                    for (var i = 0; i < rows; i++) {
                        isCorrect = _data.columns[0].children[i] == 1;
                        cb = $('a[name=q' + i + '_0]')
                        if (cb.hasClass('checked') != isCorrect) {
                            correct = false;
                        }
                    }
                    //set feedback
                    if (correct) {
                        _submitBtn.hide();
                        this.score();
                    }
                    else {
                        _feedback.find('#feedbackText').html(_data.revealed);
                        _feedback.show();
                        _submitBtn.hide();
                    }
                }

            }
            else {
                //final try
                _submitBtn.hide();
                this.score();
            }

        },

        changeHandler : function( event ) {
            _submitBtn.show();
            _feedback.hide();
            var enableSubmit = true,
				el = $(this);

			el.toggleClass('checked');
			
            if(_data.columns.length > 1) {
				var i = 0, cb,
					rows = _data.statements.children.length;
				for (;i<rows; i++){
					cb = $("a.checked[name^='q" + i + "_']");
					if (cb.length==0){
						enableSubmit = false;
						break;
					}
				}
                //}
            }
            else { //only 1 column
                enableSubmit = $('a.checked').length>0;
            }

            if(enableSubmit) {
                _submitBtn.removeAttr('disabled');
            }
            else {
                _submitBtn.attr('disabled', 'disabled');
            }

            return false;
        }
    };

    return ile;

})();