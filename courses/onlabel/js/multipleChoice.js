var pageLoaded = false,
	quiz;

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
		parent.nav.writeToLog("Assessment: loading quiz with " + dataFile);

	

	activeShellNav(false);

	$("#submitBtn").attr("value", parent.nav.settings.labelSubmit); //set label
	$("#feedbackTitle").html(parent.nav.settings.labelFeedback); //set label
	$("#instr").html(parent.nav.settings.labelSelectAnswer);
	$("#submitBtn").attr("disabled", "disabled");

	//load quiz
	quiz = new Quiz(dataFile, parent.nav, function(){
		//setup questions answers
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
	
	var indexAnswered;
	$("#answers>div").each(function(index, ansBlock) {
		//find index of user's answer
		if($(ansBlock).find("input")[0].answered==true){
			indexAnswered = index;
		}        
		//show arrow next to correct answer
		if (quiz.question().answers[index].correct){
			//$(ansBlock).find("#arrow").show("slow");
			//$(ansBlock).find("input").parent().addClass("correct");
			$(ansBlock).find("td:first").addClass("correct");
			//ansBlock.getElementsByTagName("td")[0].className +=  " correct";
			
		}
    });

	//mark the clicked answer if it's incorrect
	quiz.question().setUserAnswer(indexAnswered);
	showFeedback();
}

function showFeedback(){
	$("#answers input:radio").each(function(index, element) {
        this.disabled = true;
    });
	
	$("#submitBtn").css("display", "none");
	$("#feedbackText").html(quiz.question().feedback);
	$("#feedback").show();

	//ungate it
	parent.nav.eventCompleted("content");
	
}
  
function onAnswerChosen(ctr){
	$("#answers input:radio").each(function(index, element) {
        this.answered = false;
    });	
	ctr.answered = true;
	$("#submitBtn").removeAttr('disabled');
}