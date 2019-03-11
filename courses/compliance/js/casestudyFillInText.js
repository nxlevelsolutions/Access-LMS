var casestudy = (function(){

    var _data,
        _submitBtn,
        _closeBtn,
        _prompt,
        _feedback;
        
    function loadData(url, callback, parser) {
        $.ajax({
            url: url,
            context: this,
            dataType: 'xml',
            async: false,
            success: function (xml) {
                var data = parser && parser(xml);
                callback && callback(data || {});
            },
            error: function (xhr, ajaxOptions, thrownError) {
                parent.nav.writeToLog("CasestudyFillInText: unable to load " + url + " loading error." + xhr.status + ": " + thrownError, true);
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
                'content' : $.trim($(problem.find('instruction')[0]).text()),
                'prompt' : $.trim($(problem.find('instruction')[1]).text())
            },
            'response' : {
                'tabLabel' : response.attr('label'),                
                'content' : $.trim($(response.find('instruction')[0]).text()),
                'prompt' : $.trim($(response.find('instruction')[1]).text()),
                'feedback' : $.trim($(response.find('feedback')).text()) 
            }
        };
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
                parent.nav.writeToLog('casestudyFillInText error =>' + error);
            }
            
            _prompt = $('#prompt');
            _submitBtn = $('#submitBtn');
            _submitBtn.attr('disabled', 'disabled').click($.proxy(this.submitHandler, this));
            _feedback = $('#response-feedback');
            //_feedback.draggable();
            _closeBtn = $('#closeBtn').click(function() { _feedback.hide(); });
        },

        build : function() {
             
            $('#problem-tab').html(_data.problem.tabLabel);
            $('#response-tab').html(_data.response.tabLabel);
            var content = (_data.problem.imageURL) ? '<img src="' + _data.problem.imageURL + '">' : "";
            $('#problem').html(content + '<p>' + _data.problem.content + '</p>');
            $('#prompt').html(_data.problem.prompt);
 
			$('#response-question').html(_data.response.content);
            $('#problem-tab').click(this.problemTabHandler);
            $('#response-tab').click(this.responseTabHandler);
        },

        score : function() {
            _feedback.find('#feedback-content').html(_data.response.feedback);
            _feedback.show();
            //showPop("Feedback", _data.response.feedback);
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
            _submitBtn.hide();
            this.score();
        }

    };

    return ile;
})();