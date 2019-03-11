/**
 * @param {string} quizFile: The xml file name that contains the quiz's data.
 * @param {courseNavigator} nav The courseNavigator object
 * Dependencies: This Quiz class requires jquery!!
  */
function Quiz(quizFile, nav, onQuizReady){
	
	this.nav = nav;
	this.attempts = 0;
	this.passingScore;
	this.score;
	this.passed;
	this.maxAttempts; 			//maximum number of tries a user can attempt
	this.showCertificate;
	this.useReviewOption;
	this.showInReview;
	this.numCorrect;

	var questionPrefix,
	    questionSuffix,
		quizXml,
		_randomize,
		questions = new Array(),
		_passText,
		_passTextAllCorrect,
		_failureText,
		_maxAttemptsText,
		_reviewTopicsText,
		_reviewTopicsTextPopup,
		_maxAttemptsReturnText,
		_questionNumber,
		_questionsTotal,
		_companyCert,
		_titleCert;

    //**************************//
    // internal class Question
    //**************************//
	function Question(id, refId, text, answers, type) {

	    this.id = id;
	    this.refId = refId;
	    this.answers = answers;
	    this.type = (typeof (type) == 'undefined' ? 'radio' : type); //default to 'radio'
	    this.htmlText = text;
		var newText = text.replace("<br><br>", " ");
	    this.text = Utils.removeHtmlTags(newText);
	    this.feedback;
	    this.answeredCorrectly;

	    var userAnswers = [];

	    this.getUserAnswers = function () {
	        return userAnswers;
	    }

		this.setUserAnswer = function (index) {
			//this function is available for backwards compatibility only
			//create empty set
			var answers = new Array(this.answers.length);
			for (var i = 0; i < answers.length; i++) {
				answers[i] = false;
			}
			answers[index] = true;
			this.setUserAnswers(answers);
		}

	    this.setUserAnswers = function (answers) {
			//answers is expected to be an array of booleans
	        var index,
                allCorrect = true,
	            i;
	        userAnswers = answers;

			for (i = 0; i < answers.length; i++) {
				if (this.answers[i].correct != userAnswers[i]) {
					allCorrect = false;
					index = i; //index of 1st incorrect
					break;
				}
			}
			
	        this.answeredCorrectly = allCorrect;

	        //set the feedback text
	        if (index == undefined) {
	            //all correct.. pick feedback from 1st correct
	            for (i = 0; i < this.answers.length; i++) {
	                if (this.answers[i].correct == true) {
	                    index = i;
	                    break;
	                }
	            }
	        }
	        else {
	            //something was incorrect.. 
	            if (type == 'checkbox') {
	                //pick feedback from 1st INcorrect
	                for (i = 0; i < this.answers.length; i++) {
	                    if (this.answers[i].correct == false) {
	                        index = i;
	                        break;
	                    }
	                }
	            }
	            else {
	                //pick feedback from whatever user selected
	                for (i = 0; i < userAnswers.length; i++) {
	                    if (userAnswers[i] == true) {
	                        index = i;
	                        break;
	                    }
	                }
	            }
	        }
	        this.feedback = this.answers[index].feedback;
	    }

	}

    //**************************//
    // internal class Answer
    //**************************//
	function Answer(text, feedback, correct) {
	    this.text = text;
	    this.feedback = feedback;
	    this.correct = correct;
	}

    //**************************//
    // internal class Utilities
    //**************************//
	var Utils = {
	    removeHtmlTags: function (str) {
	        str = str.replace(/&(lt|gt);/g, function (strMatch, p1) {
	            return (p1 == "lt") ? "<" : ">";
	        });
	        return str.replace(/<\/?[^>]+(>|$)/g, "");
	    },
	    trim: function (str) {
	        if (str == undefined) return undefined;
	        for (var i = 0; str.charCodeAt(i) < 33; i++);
	        for (var j = str.length - 1; str.charCodeAt(j) < 33; j--);
	        return str.substring(i, j + 1);
	    }
	}

	function trace(str) {
	    if (this.nav != undefined) {
	        this.nav.writeToLog(str);
	    }
	}
 
	this.reset = function () {
	    _questionNumber = 0;
	    this.score = undefined;
	    this.passed = undefined;

	    //get real total number of questions
	    var questionList = quizXml.find("question"),
	        maxRequested = Number(quizXml.attr("displayCount")), //m=maximum to show when pooling is used
	        question,
	        i; 
	    if (maxRequested <= questionList.length && maxRequested > 0) {//in case there's a typo
	        //there's pooling involved.. pick only random selection of maxRequested
	        _questionsTotal = maxRequested
	        //randomize all questions so later on we only pick the max requested (from larger pool)
	        for (i = 0; i < questionList.length; i++) {
	            var randIdx = getRandomNum(0, questionList.length - 1),
	                tmp1 = questionList[i],
	                tmp2 = questionList[randIdx];
	            questionList[randIdx] = tmp1;
	            questionList[i] = tmp2;
	        }
	    }
	    else {
	        _questionsTotal = questionList.length;
	    }
	    trace("Quiz: number of questions = " + _questionsTotal + ", random=" + _randomize);

	    //reformat question prefix
	    questionPrefix = questionPrefix.replace("{totalQuestions}", String(_questionsTotal));
	    questionSuffix = questionSuffix.replace("{totalQuestions}", String(_questionsTotal));

	    //load question from XML into array
	    questions = new Array();
	    for (i = 0; i < _questionsTotal; i++) {

	        question = $(questionList[i]);

	        //var qPrefix = questionPrefix.replace("{currentQuestion}", String(i+1));
	        var qText = question.find("text:first").text(),
	            answersList = question.find("answer"),
	            answers = new Array(),
	            s, aText,
	            fText,
	            correct,
                q;

	        for (s = 0; s < answersList.length; s++) {
	            aText = $(answersList[s]).find("text").text(); //answer text
	            fText = $(answersList[s]).find("feedback").text(); //feedback text
	            correct = $(answersList[s]).attr("correct") == "1";
	            answers.push(new Answer(aText, fText, correct));
	        }
	        q = new Question(question.attr("id"), question.attr("refId"), qText, answers, question.attr("type"));
	        questions.push(q);
	    }

	    //randomize if needed
	    if (_randomize) {
	        for (i = 0; i < questions.length; i++) {
	            var randIdx = getRandomNum(0, _questionsTotal - 1),
	                tmp = questions[i];
	            questions[i] = questions[randIdx];
	            questions[randIdx] = tmp;
	        }
	    }
	};
	//this.reset();
	
	$.ajax({
	    url: quizFile,
        context: this,
		dataType: 'xml',
		async: typeof(onQuizReady)=="function",
	    success: function (xmlDoc) {
	        var XmlDocElement = xmlDoc.documentElement;
            //parse entire xml  
	        quizXml = $(XmlDocElement);
	        this.showInReview = quizXml.attr("showInReview");
	        this.passingScore = Number(quizXml.attr("passingScore"));
	        _randomize = (quizXml.attr("random") == "1" || quizXml.attr("random") == "yes" || quizXml.attr("random") == "true");
	        //displayFeedback = (quizXml.attributes.displayFeedback == "1" || quizXml.attributes.displayFeedback == "yes" || quizXml.attributes.displayFeedback == "true");
	        this.maxAttempts = quizXml.attr("maxAttempts") == "" ? undefined : Number(quizXml.attr("maxAttempts"));
	        if (isNaN(this.maxAttempts)) this.maxAttempts = 0;
	        questionPrefix = quizXml.find("questionPrefix").text();
	        questionSuffix = quizXml.find("questionSuffix").text();
	        if (questionSuffix == undefined) questionSuffix = "";
	        _passText = quizXml.find("passText").text();
	        _passTextAllCorrect = quizXml.find("passTextAllCorrect").text();
	        _failureText = quizXml.find("failureText").text();
	        _maxAttemptsText = quizXml.find("maxAttemptsText").text();
	        _reviewTopicsTextPopup = quizXml.find("reviewTopicsTextPopup").text();
	        _reviewTopicsText = quizXml.find("reviewTopicsText").text();
	        _maxAttemptsReturnText = quizXml.find("maxAttemptsReturnText").text();
	        this.showCertificate = (quizXml.attr("showCert") == "1");
	        this.useReviewOption = (quizXml.attr("showQuestionsInReview") == "1");
	        _companyCert = quizXml.find("companyCert").text();
			_titleCert = quizXml.find("titleCert").text();
			this.reset();
			if (typeof (onQuizReady) == "function") {
				onQuizReady.apply();
			}
	    },
	    error: function (xhr, ajaxOptions, thrownError) {
	        this.nav.writeToLog("Quiz: loading error " + xhr.status + ": " + thrownError, true);
	    }
	});


	
	
	// Returns an integer in the range minVal to maxVal, inclusive
	function getRandomNum(minVal, maxVal) {
	    var r
		do {
			r = Math.random();
			// Keep picking a number until it is not 1.
		} while (r == 1);
		return minVal+Math.floor(r*(maxVal+1-minVal));
	}

	this.question = function() {
		var q = questions[_questionNumber];
		q.displayText = questionPrefix.replace("{currentQuestion}", String(_questionNumber + 1)) 
						+ q.htmlText
						+ questionSuffix.replace("{currentQuestion}", String(_questionNumber + 1));
		return q;
	}
	
	this.nextQuestion = function() {
		if (_questionNumber < _questionsTotal) _questionNumber++;
	}
	this.questionNumber = function() {
		return (_questionNumber+1);
	}
	this.incorrectAnswers = function() {
	    var o = new Array(),
	        i, q;
		for (i = 0; i < questions.length; i++) {
			q = questions[i];
			if (q.answeredCorrectly==false) o.push(q);
		}
		return o;
	}
	this.answerData = function() {
		//return hashtable with key/value pairs
	    var o = new Object(),
	        i, q;
		for (i = 0; i < questions.length; i++) {
			q = questions[i];
			o[q.id] = q.getUserAnswers().toString() + ":" + (q.answeredCorrectly?1:0);
		}
		return o;
	}
	this.passText = function() {
		return this.replaceCodes(_passText);
	}
	this.passTextAllCorrect = function() {
		return this.replaceCodes(_passTextAllCorrect);
	}	
	this.failureText = function() {
		return this.replaceCodes(_failureText);
	}
	this.maxAttemptsText = function() {
		return this.replaceCodes(_maxAttemptsText);
	}
	this.reviewTopicsText = function() {
		return this.replaceCodes(_reviewTopicsText);
	}
	this.reviewTopicsTextPopup = function() {
		return this.replaceCodes(_reviewTopicsTextPopup);
	}
	
	this.maxAttemptsReturnText = function() {
		return this.replaceCodes(_maxAttemptsReturnText);
	}
	this.atLastQuestion = function() {
	    return (_questionNumber == _questionsTotal - 1);
	}
	this.companyName = function() {
		return this.replaceCodes(_companyCert);
	}
	this.title = function() {
		return this.replaceCodes(_titleCert);
	}
	this.replaceCodes = function(str){
		var scoreStr = (this.score == undefined?"": String(this.score));
		str = str.replace("{score}", scoreStr);
		str = str.replace("{numCorrect}", String(this.numCorrect));
		str = str.replace("{totalQuestions}", String(_questionsTotal))
		str = str.replace("{passingScore}", String(this.passingScore));
		str = str.replace("{attempts}", String(this.attempts));
		str = str.replace("{attemptsOrdinal}", this.getOrdinalString(this.attempts));
		str = str.replace("{maxAttempts}", String(this.maxAttempts));
		return str;
	}
	this.getOrdinalString = function(num) {
	    var ret = "N/A";
	    if (typeof num=='number'){
	        var list = ["zero", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];
	        if (num > list.length - 1) {
	            var str = String(num),
                    chr = str.substr(str.length - 1, str.length),
                    ending;
                switch(chr){
                    case "1":
                        ending = "st";
                        break;
                    case "2":
                        ending = "nd";
                        break;
                    case "3":
                        ending = "rd";
                        break;
                    default:
                        ending = "th";
                        break;
                }
                ret = num + ending;
	        }
	        else {
	            ret = list[num];
	        }
	    }
		return ret;
	}
	/**************************************************************************************
	 * IMPORTANT: You must call end() to ensure the score and passing status are calculated
	 **************************************************************************************/
	this.end = function() {
		//calculate score
	    var c = 0,
	        i, q;
		for (i = 0; i < questions.length; i++) {
			q = questions[i];
			trace("Quiz: question " + i + " was correct=" + q.answeredCorrectly);
			if (q.answeredCorrectly) c++;
		}
		this.numCorrect = c;
		this.score = Math.floor(100 * c / _questionsTotal);
		
		//calculate pass value
		this.passed = this.score >= this.passingScore;
		
		this.attempts++;
	}	
	
	
}
 
