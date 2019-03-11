var pageLoaded = false,
	settings = parent.nav.settings,
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
		parent.nav.writeToLog("Assessment error: getPage().data returned undefined."); 
	else
		parent.nav.writeToLog("Assessment: loading quiz with " + dataFile);
	
	$("#finalBtn").hide();
	$("#nextBtn").hide();
	$("#submitBtn").hide();
	$("#reviewBtn").hide();
	$("#tryAgainBtn").hide();
	$("#printCertBtn").hide();
	
	$("#finalBtn").attr("value", parent.nav.settings.labelShowFinal);
	$("#nextBtn").attr("value", parent.nav.settings.labelNextQuestion);
	$("#submitBtn").attr("value", parent.nav.settings.labelSubmit);
	$("#reviewBtn").attr("value", parent.nav.settings.labelReviewList);
	$("#tryAgainBtn").attr("value", parent.nav.settings.labelTryAgain);
	$("#printCertBtn").attr("value", parent.nav.settings.labelPrintCert);
	$("#printBtn").attr("value", parent.nav.settings.labelPrint);
	$("#closeBtn").attr("value", parent.nav.settings.labelClose);
	$("#winTitle").html(parent.nav.settings.labelReviewList);
	

	activeShellNav(false);
	//decide what to show next
	quiz = new Quiz(dataFile, parent.nav, function(){

		var prevAttempts = Number("0" + parent.nav.getPage().bookmark);
		if (prevAttempts>0) quiz.attempts = prevAttempts; 
		var lastScore = Number(parent.lastScore);
		parent.nav.writeToLog("Assessment: prevAttempts=" + prevAttempts + " maxAttempts=" + quiz.maxAttempts + " passing score=" + quiz.passingScore + " lastScore=" + lastScore);
		quiz.score = lastScore;
		if (!isNaN(lastScore) && lastScore >= quiz.passingScore){
			showPass();
		}
		else{
			if (quiz.maxAttempts!=undefined && quiz.maxAttempts!=0 && prevAttempts>=quiz.maxAttempts){
				showFail();
			}
			else{
				//disable navigation if possible
				if (typeof(parent.navigationEnabled)=="function"){
					parent.navigationEnabled(false);
				}
				//show first question
				showQuestion();
			}
		}
	});


 	//set current page
	if (!parent.nav.settings.gated){
		parent.nav.getPage().completed = true;
		parent.nav.saveBookmark();
 	}
}

function setupQuestionAndAnswers() {
    var answer,
        template;
	$("#questionText").html(quiz.question().displayText);
	for (var i = 0; i < quiz.question().answers.length; i++) {
	    if (quiz.question().type == "checkbox") {
	        template = $("#answerTemplateCheckbox");
	    }
	    else {
	        template = $("#answerTemplate");
	    }
	    answer = template.clone(true, true);
		answer.css("display", "block");
		answer.find("input")[0].id = "r" + i;
		answer.find("label.answerText").html( quiz.question().answers[i].text );
		answer.find("label.answerText").attr("for", "r" + i);
		$("#answers").append(answer);	
	}	
}

function checkAnswer() {
    var answers =[],
        ctrl,
        q = quiz.question();
    // track all answer selections
	$("#answers>div").each(function(index, ansBlock) {
	    ctrl = $(ansBlock).find("input")[0]
        answers.push(ctrl.checked);

	    //show arrow next to correct answers
	    if (q.answers[index].correct) {
	        $(ansBlock).find("input").parent().addClass("correct");
	    }
    });

	//record answers
	quiz.question().setUserAnswers(answers);
	showFeedback();
}
 
function selectNextQuestion(){
	$("#nextBtn").hide();
	choicesClear();
	$("#feedback").html("");
	quiz.nextQuestion();
	showQuestion();
}

function checkScore(){
	
	$("#finalBtn").hide();
	//enble navigation if possible
	if (typeof(parent.navigationEnabled)=="function"){
		parent.navigationEnabled(true);
	}	
	//end of quiz
	quiz.end();
	if (quiz.passed) {
		showPass();
	} 
	else {
		showFail();
	}
}
function submitScore(){
	parent.nav.writeToLog("Quiz: submitting a score of " + quiz.score + ". passing result=" + quiz.passed);
	var answerData = "",
	    data = quiz.answerData();
	for (var key in data){
		answerData  += key + "=" + data[key] + ",";
	}
	answerData = answerData.substr(0, answerData.length-1);
	parent.saveScore(quiz.score, quiz.passed, answerData);	
	parent.lastScore = quiz.score;
	
	parent.nav.eventCompleted("content");
	parent.nav.saveBookmark(true);
}
 
function printCertificate() {
	parent.nav.writeToLog("Assessment: userName = " + parent.studentName);
	var w = 760,
		h = 660;
	/*if (Utilities.isChrome){
	    w = 760;
	    h = 457;
	}
	else{
	    w = 50;
	    h = 50;
	}*/	
	//attach certificate data.. certificate will ask for it
	quiz.certificateData = {name:parent.studentName, 
							courseTitle:quiz.title(),
							companyName:parent.nav.settings.companyName};
	var printWin = window.open("certificate.htm", null,"dependent,toolbar=yes,status=no,menubar=yes,scrollbars=yes,resizable=yes,width=" + w +",height=" + h);
	if (printWin==undefined){
		alert("Unable to print. To print this page you must allow popups by checking your particular browser's permissions settings.")
	}
}

function showReviewTopics(){
	var winH = $("#reviewWin").outerHeight(true),
		titleH = $("#winTitle").outerHeight(true),
		buttonH = $("#btnContainer").outerHeight(true);
	$("#reviewWinText").css("height", winH - titleH - buttonH - 40);// Find margin dynamically (40)
	
	//set text and div size
	$("#reviewWin").show();
	$("#reviewWin").css("visibility", "visible");
	
//	var revWinHeight = $("#reviewWin").height();
//	if (Utilities.isIE){
//		$("#reviewWin table").height(revWinHeight - 45);
//	}
//	else{
//		$("#reviewWin table").height(revWinHeight - 20);
//	}
	
//	var td = $("#reviewWinText")[0].parentElement,
//	    tdHeight = $(td).height();	
	if(quiz.reviewTopicsTextPopup() == ""){
		$("#reviewWinText").html(getReviewListHtml());
	} else {
		$("#reviewWinText").html("<b>" + quiz.reviewTopicsTextPopup() + "</b><br><br>" + getReviewListHtml());
	}
	
//	if($("#reviewWinText").height()>tdHeight){
//		$("#reviewWinText").height(tdHeight)
//	}	
}

function getReviewListHtml(){

	// Get another array so we can sort it
	var list = new Array(),
	    duplicate,
	    removeDuplicates = quiz.showInReview.indexOf("questions")==-1,
	    incorrectAnswers = quiz.incorrectAnswers(),
	    i, id;
	
	for(i = 0; i< incorrectAnswers.length; i++){
		id = $.trim(incorrectAnswers[i].refId);
		// Add only unique id's
		duplicate = false;
		for (var s = 0; s<list.length; s++){
			if (id==list[s]){
				duplicate = true;
				break;
			}
		}
		if (removeDuplicates){
			if (!duplicate) list.push(id);
		}
		else{
			list.push(id);
		}
	}
	//list.sort(); // Sorts by ID, not question number
	
	
	// Modify each item so we have the question text in each item
	for(i = 0; i< incorrectAnswers.length; i++){
		qNum = $.trim(incorrectAnswers[i].id);
		id = $.trim(incorrectAnswers[i].refId);
		for(var s = 0; s< list.length; s++){
			if (list[s]==id){
				list[s] = {qNum:qNum, id:id, question:incorrectAnswers[i].text, ans:incorrectAnswers[i].answers};
				break;
			}
		}
	}
	//
	var showQuestions = quiz.showInReview.indexOf("questions")>-1,
	    showTopics = quiz.showInReview.indexOf("topics")>-1,
		showSections = quiz.showInReview.indexOf("sections")>-1,
		sectionTitle,
        str = "",
		labelQuestion = (settings.labelQuestion) ? settings.labelQuestion:"Question",
		labelSeparator = (settings.labelSeparator) ? settings.labelSeparator:":",
		labelTopic = (settings.labelTopic) ? settings.labelTopic:"Topic";
	for(i = 0; i< list.length; i++){
		id = list[i].id;
		if (id.length>0){
			var p = parent.nav.getPage(id);
			if (p==undefined){
				 str += "(Page id not found=" + id + ") <br/>";
			}
			else{
				if (showSections){
				    sectionTitle = $(p.parent).attr("title");
				}
				else{
					sectionTitle = "";
				}
				
				if (settings.labelSeparator==undefined) settings.labelSeparator = ":" //defaults
				if (settings.labelSection==undefined) settings.labelSection = "Section" //defaults
				if (settings.labelTopic==undefined) settings.labelTopic = "Topic" //defaults
				
				if (showQuestions) str += "<b>" + settings.labelQuestion + " " + Number(list[i].qNum.replace(/[^0-9.]/g, '')) + settings.labelSeparator + "</b> " + list[i].question + "<br/>";
				// Custom - List possible answers
				for(a=0;a<list[i].ans.length;a++) {
					str += "• " + list[i].ans[a].text + "<br/>";
				}
				if (showSections && sectionTitle.length>0) str += "<br/><b><i>" + settings.labelSection + settings.labelSeparator + "</b> " + sectionTitle + "</i><br/>";
				if (showTopics) str += "<b><i>" + settings.labelTopic + settings.labelSeparator + "</b> " + p.title + "</i><br/><br/>";
			}
		}
	}
	return str;
}
 

function showQuestion(){
	// Build the question
	setupQuestionAndAnswers();
}

function showFeedback(){

	// Disable all radio buttons
	$("#answers input:radio").each(function(index, element) {
        this.disabled = true;
    });
	
	// Do feedback check to see if we need to display
	if (quiz.question().feedback.length > 0){ 
	 	$("#submitBtn").hide();
	 	$("#nextBtn").css("display", "inline");
		$("#feedback").css("display", "block");
		$("#feedback").html(quiz.question().feedback);
	}
	else{ 
		$("#feedback").hide();
		//feedbackTxt._visible = false;
	}
	
	// Check if this is the last question and change button
	if (quiz.atLastQuestion()) {
		$("#nextBtn").hide();
		if (quiz.question().feedback.length==0) {
			checkScore(); //skip showing final score button
		}
		else{
			$("#finalBtn").css("display", "inline");
		}
	
	}
	else{
		if (quiz.question().feedback.length==0) {
			$("#submitBtn").hide();
			selectNextQuestion(); //skip this frame and go to next question
		}
	}
	
	
}
  
function showFail(){
	$("#questionText").html("");
	choicesClear();  
	$("#submitBtn").hide();
	
	var showReview = (quiz.useReviewOption && quiz.incorrectAnswers().length>0);
	$("#reviewBtn").css("display", showReview?"inline":"none");
 	 
	
	
	//----------------------
	//  setup message
	//----------------------
	var attempts_string;
	if (quiz.maxAttempts==undefined || quiz.maxAttempts==0 || quiz.attempts<quiz.maxAttempts) {
		attempts_string = quiz.failureText();
		$("#tryAgainBtn").css("display", "inline");
	} 
	else {
		attempts_string = quiz.maxAttemptsText();
		$("#tryAgainBtn").hide();
	}
	
	activeShellNav(true);
	if (quiz.atLastQuestion()) { 
		submitScore();
	}
	else{
		attempts_string = quiz.maxAttemptsReturnText(); // TODO: confirm that this is working
	}
	
	parent.nav.getPage().bookmark = quiz.attempts;
	parent.nav.saveBookmark(true);

	$("#feedback").html(attempts_string);
	$("#feedback").show("fast");

}

function tryAgain()  {
	$("#tryAgainBtn").hide();
	$("#reviewBtn").hide();
	$("#feedback").html("");
	closeReviewWin();
	
	quiz.reset();
	activeShellNav(false);
	showQuestion();
}
  
function showPass(){
	$("#questionText").html("");
	choicesClear();  
	$("#submitBtn").hide();
	//reviewWin._visible = false;
	
	//----------------------
	//  setup buttons
	//----------------------
	var showReview = (quiz.useReviewOption && quiz.incorrectAnswers().length>0);
	//$("#reviewBtn").css("display", showReview?"block":"inline");
	$("#reviewBtn").css("display", "inline");	
	
	//----------------------
	//  setup message
	//----------------------
	var results_string;
	if (quiz.incorrectAnswers().length==0 || !quiz.atLastQuestion()){
		results_string = quiz.passTextAllCorrect();
		$("#reviewBtn").hide();
	}
	else{
		results_string = quiz.passText();
	}
	$("#feedback").html(results_string);
	$("#feedback").show("fast");
		
	activeShellNav(true);
	 
	if (quiz.atLastQuestion()) { 
		// This quiz was just taken
		parent.nav.getPage().bookmark = quiz.attempts;
		parent.nav.saveBookmark(true);		
		submitScore();
	}
	if (quiz.showCertificate) $("#printCertBtn").show();
	
}

function choicesClear(){
	$("#answers").html("");
}

function onAnswerChosen(ctr) {
	$("#submitBtn").show();
}

function closeReviewWin(){
	$("#reviewWin").hide("fast");
}

function printReviewList(){
	// Convert html title into plain text title
	courseTitle = "<b>" + Utilities.removeHtmlTags(quiz.title()) + "</b>";
	var w = 760,
		h = 660;
	/*if (Utilities.isChrome) {
	    w = 760;
	    h = 457;
	}
	else {
	    w = 50;
	    h = 50;
	}*/
	var printWin = window.open("", null, "dependent,toolbar=yes,status=no,menubar=yes,scrollbars=yes,resizable=yes,width=" + w + ",height=" + h);
	if (printWin==undefined){
		alert("Unable to print. To print this page you must allow popups by checking your particular browser's permissions settings.")
	}
	else{
		var contents = courseTitle + "<br><br>" + quiz.reviewTopicsText() + "<br><br>" + getReviewListHtml();
		printWin.document.write("<html><head><title>Review List</title></head><body style='font-family:Verdana;font-size:10px;'>" + contents + "</body></html>");
		printWin.document.close();
		printWin.print();
		//printWin.close();
	}
	
}

$(window).on("resize", function() {
	var winH = $("#reviewWin").outerHeight(true),
		titleH = $("#winTitle").outerHeight(true),
		buttonH = $("#btnContainer").outerHeight(true);
	$("#reviewWinText").css("height", winH - titleH - buttonH - 40);
		
});