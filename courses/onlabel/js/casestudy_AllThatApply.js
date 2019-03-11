/* __________________________
 * casestudy_AllThatApply v2
 * --------------------------
 * parameters: 
 *             
 */

var casestudy = (function(){
    "use strict";
    var _data,
        _attempts = 0,
        _submitBtn,
        _closeBtn,
        _prompt,
        _feedback;
        
    function loadData(url, callback, parser) {
        $.ajax({
            url: url,
            context: this,
            dataType: 'xml',
            async: true,
            success: function (xml) {
                var data = parser && parser(xml);
                callback && callback(data || {});
            },
            failed: function (xhr, ajaxOptions, thrownError) {
                parent.nav.writeToLog("Casestudy: unable to load " + url + " loading error." + xhr.status + ": " + thrownError, true);
            }
        });
    }
        
    function xmlParser( data ) {

        data = $(data);
        var problem = data.find('tab1'),
            response = data.find('tab2');
        
        var obj = {
            'problem' : {
                'imageURL' : problem.attr('image'),
                'tabLabel' : problem.attr('label'),
                'content' : $(problem.find('instruction')[0]).text(),
                'prompt' : $(problem.find('instruction')[1]).text()
            },
            'response' : {
                'tabLabel' : response.attr('label'),                
                'content' : $(response.find('instruction')[0]).text(),
                'prompt' : $(response.find('instruction')[1]).text(),
                'c' : null,
                'choices' : []
            }
        };

        var choices = response.find('choice');
        
        choices.each(function(i, val) {
                var c = $(this);
                var choice = {
                    'text' : c.find('text').text(),
                    'correct': c.attr('correct')=='1'
                };
                
                if(parseInt(c.attr('correct'),10)) {
                    obj.response.c = i;
                }
                
                obj.response.choices.push(choice);
            });

        obj.feedbackCorrect = data.find('feedbackCorrect').text();
        obj.feedbackIncorrect = data.find('feedbackIncorrect').text();

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
                parent.nav.writeToLog('casestudy error =>' + error);
            }
            
            _prompt = $('#prompt');
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
            _feedback = $('#response-feedback');
            _closeBtn = $('#closeBtn').click(function() { _feedback.hide(); });
        },

        build : function() {

            var answers = "";
            
            $('#problem-tab').html(_data.problem.tabLabel);
            $('#response-tab').html(_data.response.tabLabel);
            var content = (_data.problem.imageURL) ? '<img src="' + _data.problem.imageURL + '">' : "";
            $('#problem').html(content + '<p>' + _data.problem.content + '</p>');
            $('#prompt').html(_data.problem.prompt);
			if(_data.problem.prompt==null || _data.problem.prompt==""){
					$('#prompt').css("display","none");
				}

            $(_data.response.choices).each(function( i, val ) {
                answers += '<div class="answer">' +
						'<table width="100%" border="0"><tr>' +
                             '<td width="10" valign="top"><input type="checkbox" name="mc" id="q' + i + '"></td>' +
							 '<td><label for="q' + i + '">' + this.text +'</label></td>' +
                          '</tr></table></div>';
            });

            $('#response-answers').html(answers);
			$('#response-question').html(_data.response.content);
            $('input').on('change', this.changeHandler);
            $('#problem-tab').click(this.problemTabHandler);
            $('#response-tab').click(this.responseTabHandler);
        },

        score : function() {
            
            _attempts++;
            
            //var checked = $('input[name=mc]:checked'),
            //    index = $('input[name=mc]').index(checked),
            //    result = _data.response.choices[index].feedback;
            var allCorrect = true;

            $('input[name=mc]').each(function(i, ctrl){
                ctrl = $(ctrl);
                if(_data.response.choices[i].correct != ctrl.is(":checked")){
                    allCorrect = false;
                }
                //mark correct ones
                if(_data.response.choices[i].correct){
                    ctrl.parents(".answer").addClass('correct');
                }
            })

            //show feedback
            if (allCorrect){
                _feedback.find('#feedback-content p').html(_data.feedbackCorrect);
            }
            else{
                _feedback.find('#feedback-content p').html(_data.feedbackIncorrect);
            }
            _feedback.show();
            
            this.markCompletion();
        },

        markCompletion : function() {
            parent.nav.eventCompleted("content");
        },

        _setSelectedTabAndPrompt : function( tab, prompt ) {
            tab = $(tab);
            if(!tab.hasClass('current')) {
                $('#tabs li').removeClass('current');
                tab.addClass('current');
                $('#problem, #response').toggle();
				_prompt.html(prompt);
				if(prompt==null || prompt==""){
					$('#prompt').css("display","none");
				}
            }
        },
        
        problemTabHandler : function ( event ) {
            ile._setSelectedTabAndPrompt($(this).parent(), _data.problem.prompt);
            return false;
        },
        
        responseTabHandler : function ( event ) {
            ile._setSelectedTabAndPrompt($(this).parent(), _data.response.prompt);
            return false;
        },

        submitHandler : function( event ) {
            //disable button
            _submitBtn.hide();

            //disable choices
            $("input[type=radio]").attr("disabled", "disabled");

            //calculate score, etc.
            this.score();
        },

        changeHandler : function( event ) {
            _submitBtn.removeAttr('disabled');
        }
    };

    return ile;
})();