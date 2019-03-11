var pageLoaded = false,
	quiz,
    tries = 0,
	MAX_TRIES = 2;

function onAllowToNavigate(nav){ 
	//required as per framework
}
function onUpdateUI(nav){ //required as per framework
	
	document.location.href = parent.nav.getPage().url;
}

function activeShellNav(val){
	//parent.enableNavigation(val); 
}

function onPageLoaded(){
	pageLoaded = true;
	
	var dataFile = parent.nav.getPage().data;
	if (dataFile==undefined) 
		parent.nav.writeToLog("Assessment error: getPage().data returned undefined.") 
	else
		parent.nav.writeToLog("Assessment: loading quiz from " + dataFile);
	

	activeShellNav(false);
	$("#submitBtn").attr("disabled", "disabled");
	$("#submitBtn").attr("value", parent.nav.settings.labelSubmit); //set label
	$("#feedbackTitle").html(parent.nav.settings.labelFeedback); //set label
	

	//setup questions answers
	quiz = new Quiz(dataFile, parent.nav, function(){
	$("#questionText").html(quiz.question().displayText);
		for (var i = 0; i< quiz.question().answers.length; i++) {
			var answer = $("#answerTemplate").clone(true, true); //document.getElementById("answerTemplate").cloneNode(true); //make duplicate in memory
			answer.css("display", "block");
			answer.find("input")[0].id = "r" + i;
			answer.find("label.answerText").html( quiz.question().answers[i].text );
			answer.find("label.answerText").attr("for", "r" + i);
			$("#answers").append(answer);	
		}	 
	});

 	//set current page
	if (!parent.nav.settings.gated){
		parent.nav.getPage().completed = true;
		parent.nav.saveBookmark();
 	}
}

function checkAnswer() {
	// make sure there is answer
    tries++;

	var indexAnswered,
	answerBlock;
	$("#answers>div").each(function(index, ansBlock) {
		//find index of user's answer
		if($(ansBlock).find("input")[0].answered==true){
			indexAnswered = index;
			answerBlock = ansBlock;
		}        
	    //show arrow next to correct answer
		if (tries == MAX_TRIES || quiz.question().answers.length == 2) {
		    if (quiz.question().answers[index].correct) {
		        //$(ansBlock).find("#arrow").show("slow");
		        //$(ansBlock).find("input").parent().addClass("correct");
		        $(ansBlock).find("td:first").addClass("correct");
		        //ansBlock.getElementsByTagName("td")[0].className +=  " correct";

		    }
		}
    });

	quiz.question().setUserAnswer(indexAnswered);

	var feedbackText = quiz.question().feedback;
	if (quiz.question().answeredCorrectly) {
		
		if (quiz.question().answers[indexAnswered].correct) {
		        $(answerBlock).find("td:first").addClass("correct");
		    }
			
					
	    //disable options
	    $("#answers input:radio").each(function (index, element) {
	        this.disabled = true;
	    });
	    //hide submit
	    $("#submitBtn").hide();
	    //ungate it
	    parent.nav.eventCompleted("content");
	}
	else {
	    //mark the clicked answer if it's incorrect
	    if (tries == MAX_TRIES || quiz.question().answers.length==2) {
	        

	        //disable options
	        $("#answers input:radio").each(function (index, element) {
	            this.disabled = true;
	        });

	        //ungate it
	        parent.nav.eventCompleted("content");
	    }
	    else {
	        feedbackText = "That is incorrect. Please try again.";
	    }
	    $("#submitBtn").hide();
	}

    //showfeedback
	$("#feedbackText").html(feedbackText);
	$("#feedback").show();

}
 
 
 
  
function onAnswerChosen(ctr){
	$("#answers input:radio").each(function(index, element) {
        this.answered = false;
    });	
	ctr.answered = true;
	$("#feedback").hide();
	$("#submitBtn").show();
	$("#submitBtn").removeAttr('disabled');
}

  