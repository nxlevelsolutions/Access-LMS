selectDropdowns = (function(){
    
    var _data,
        _attempts = 0,
        _submitBtn,
        _revealBtn,
        _actions,
        _feedback;
        
    function loadData( url, callback, parser ) {
        $.get(url, function(xml){
            var data = parser && parser(xml);
            callback && callback(data || {});
        }).fail(function (xhr, status, error) {
            parent.nav.writeToLog('selectDropdown error (' +status + "'):"+ error);
        });
    }

    function xmlParser( data ) {
        
        data = $(data);
        var obj = {
            'correct' : data.find('correct').text(),
            'incorrect' : data.find('incorrect').text(),
            'revealed' : data.find('revealed').text(),
            'instructions' : data.find('instructions').text(),
            "rowSpacing" : parseInt(data.find('exercise').attr('rowSpacing'), 10),          
            'statements' : []
        };
        
        var statements = data.find('statement');
        
        statements.each(function() {
                
                var statement = $(this),
					question = {
                        'text' : statement.find('text').text(),
                        'width' : parseInt(statement.find('combobox').attr('width'),10),
						'dropdownlists' : []
                    },
					dropdownlists = statement.find('combobox');
					
				dropdownlists.each(function(l, val) {
					var ddl = $(this),
						items = ddl.find('item');
					question.dropdownlists.push([]);
					question.dropdownlists[l].answers = [];
					
					items.each(function(i, val) {
						var item = $(this);
						question.dropdownlists[l].answers.push(item.text());
	
						if(parseInt(item.attr('c'), 10) === 1) {
							question.dropdownlists[l].correct = i;
						}
					});
					
				});
				
                    
                obj.statements.push(question);
            });

        return obj;
    }
    
    function _checkSelectIsCorrect(value) {
		var indxs = value.id.replace("q", "").split("_"),
			sIdx = indxs[0],
			dIdx = indxs[1],
			selected = $(value).find('option:selected');
			optionIndex = selected.index(),
			correct = _data.statements[sIdx].dropdownlists[dIdx].correct;
        return (optionIndex == correct );
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
                parent.nav.writeToLog('selectDropdown error =>' + error);
            }

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
            var i=0, 
                l=_data.statements.length, 
                holder = $('<div/>');
            for(;i<l;i++) {
                var statement = _data.statements[i],
                	el = statement.text,
					selectBox;
				$(statement.dropdownlists).each(function(ddIndex, ddList) {
					selectBox = '<select id="q' + i + "_" + ddIndex + '">';
					$(ddList.answers).each(function( s, str ) {
						selectBox += '<option>' + str + '</option>';
					});
					selectBox += '</select>';
					if (el.indexOf('{dropdown}') == -1) {
					    parent.nav.writeToLog('selectDropdown configuration error: no \'{dropdown}\' key found in sentence ' +  (i+1));
					}
					else {
					    el = el.replace(/{dropdown}/, selectBox);
					}
				});	
				holder.append('<div class="answer" style="margin-bottom:' + _data.rowSpacing + 'px">' + el + '</div>');
            }
            
            $('#content').html(holder.html());
            $('select').on('change', this.changeHandler);
            _actions.show();
            _submitBtn.attr('disabled', 'disabled');
        },
        
        reveal : function() {
			
			for (var i=0; i<_data.statements.length; i++){
				var statement = _data.statements[i];
				$(statement.dropdownlists).each(function(ddIndex, ddList) {	
					var ddl = $("select[id='q" + i + "_" + ddIndex + "']")
					ddl.find("option")[ddList.correct].selected = true;
                    ddl.removeClass('incorrect');
					ddl.removeClass('correct');				
				});
				  
			}
            $('#feedbackText').html(_data.revealed);
            this.markCompletion();
        },
        
        score : function() {
            
            var isCorrect = true,
                result = _data.correct;
            
            $('select').each(function(i, value) {
                    if(_checkSelectIsCorrect(value)) {
						$(this).addClass('correct');
					}
					else{
                        isCorrect = false;
                        var selected = $(value).find('option:selected'),
                            txt = selected.text();
                        $(this).addClass('incorrect');
                    }
                });
            
            if(!isCorrect) {
                result = _data.incorrect;
                _revealBtn.click($.proxy(this.revealHandler, this)).show();
            }
            else {
                this.markCompletion();
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
        
        changeHandler : function() {
            var showSubmit = true;
			$(this).removeClass('incorrect');
			$(this).removeClass('correct');
            $('select').each(function() {
                    var el = $(this);
                    if(el.find('option:selected').text() === el.find('option:first').text()) {
                        showSubmit = false;
                        return false;
                    }
                });
            
            if(showSubmit) {
                _submitBtn.removeAttr('disabled');
            }
        }
        
    };
        
    return ile;

})();