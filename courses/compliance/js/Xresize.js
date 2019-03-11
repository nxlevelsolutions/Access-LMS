var courseTitleFontSize = "12px", // also set on line 6 of components.css
	courseTitleFontSizeVW = "1.172vw",
	chapterTitleFontSize = "15px", // also set on line 22 of components.css
	chapterTitleFontSizeVW = "1.465vw",
	pageTitleFontSize = "18px", // also set on line 4 of page.css
	pageTitleFontSizeVW = "2.846vw",
	subPageTitleFontSize = "30px", // also set on line 4 of page.css
	subPageTitleFontSizeVW = "3.049vw",
	bodyFontSize = "11px", // also set on line 123 of globals.css
	bodyFontSizeVW = "1.423vw",
	bgImgHeight = 0.06445 * $(window).width(); // this is 1004x = 66 where 1004 is the initical width of frameContents (margin-left of 20) and 66 is the height of topLogo

function swapFooterItems() {
	"use strict";

// NOT DONE: THE MAXIMUM WIDTHS SHOULD BE CALCULATED AUTOMATICALLY (commented section below does not work -- nav is undefined)
	
//	var p = $('.nav li:last-child', window.parent.document);
//	var position = p.position();
//	var pWidth = parseInt($('.nav li:last-child', window.parent.document).css('width'));
//	var maxWidth = position.left + pWidth;

	$('#frameMenu', window.parent.document).show();
	
	
				$('#popBackground', window.parent.document).hide();
				$('.navAlt').hide("slide", { direction: "down" });
				$('#hamburgerLabel').html('Expand');
				$('#hamburger').css('background-image','url("interface/hamburger_open.png")');
				$('#frameMenu', window.parent.document).css('height','38px');
	
	
	if ($( window ).width() > 930 ) { 	// display horizontal global menu in footer
		$('#frameMenu', window.parent.document).css('width','380px');
		$('#frameMenu', window.parent.document).css('left','20px');
	} else {							// display popup vertical global menu above footer
		$('#frameMenu', window.parent.document).css('width','170px');
		$('#frameMenu', window.parent.document).css('left','35px');
	}
	if ($('#subPageTitle').is(':visible')) {
		if ($( window ).width() > 575 ) { 	// display scrubber/time left in footer
			$('#subControlsBkgd', window.parent.document).css('right','204px');
			$('#subControlsBkgd', window.parent.document).css('width','350px');
			$("#frameAudio", window.parent.document).css('right','236px');
			$("#frameAudio", window.parent.document).css('width','241px');
			$('#frameTranscriptButton', window.parent.document).css('right','469px');
		} else {							// hide scrubber/time left in footer
			$('#subControlsBkgd', window.parent.document).css('right','20px');
			$('#subControlsBkgd', window.parent.document).css('width','140px');
			$("#frameAudio", window.parent.document).css('right','30px');
			$("#frameAudio", window.parent.document).css('width','140px');
			$('#frameTranscriptButton', window.parent.document).css('right','80px');
		}
	} else {
		if ($( window ).width() > 705 ) { 	// display scrubber/time left in footer
			$('#frameAudio', window.parent.document).css('width', '241');
			$('#controlsBkgd', window.parent.document).css('width','490');
			$('#frameTranscriptButton', window.parent.document).css('right','500px');
		} else {							// hide scrubber/time left in footer
//			$('#frameAudio', window.parent.document).hide();
			$('#frameAudio', window.parent.document).css('width', '38');
			$('#controlsBkgd', window.parent.document).css('width','306');
			$('#frameTranscriptButton', window.parent.document).css('right','311px');
		}
	}
}

function resizeDisplayArea() {	
	// height of #courseTitle, #logoBar, and #topBar should adjust to the font-size of #courseTitle plus padding
	// minimum height of these divs should be the height of the logo graphic or the height of #courseTitle, whichever is larger
	
	// #displayArea is the wrapper around the content area in all templates
	// Because the fonts resize according to the window width, absolute positioning of titles and content areas no longer works.
	// Calculating #displayArea position and size gives .textArea and .imgArea (as well as KC content) a container 
	//    upon which to base their sizes and therefore scroll or resize as necessary.
	
	"use strict";
	
//	console.trace();

// 1st:	determine height and width of logo
	var bgImgWidth;
	$('#logoBar img', window.parent.document).css('height', bgImgHeight);
	var logoImgHeight = $('#logoBar img', window.parent.document).outerHeight();
	$('#logoBar', window.parent.document).css('height', logoImgHeight);
	$('#logoBar img', window.parent.document).css('width', 'auto');
	bgImgWidth = $('#logoBar img', window.parent.document).css('width');
	$('#logoBar', window.parent.document).css('width', bgImgWidth);
	if ( $('#logoBar img', window.parent.document).height() <= 29 ) {
		$('#logoBar img', window.parent.document).height('29');
	}

// 2nd: set width of courseTitle
	var windowWidth = $(window).width();
	var courseTitleWidth = windowWidth - parseInt(bgImgWidth);
	$('#courseTitle', window.parent.document).css('width', courseTitleWidth);

// 3rd: make sure font sizes aren't too small
	$('#courseTitle', window.parent.document).css('font-size', courseTitleFontSizeVW);
	if ( parseInt($('#courseTitle', window.parent.document).css('font-size')) <= parseInt(courseTitleFontSize) ) {
		$('#courseTitle', window.parent.document).css('font-size', courseTitleFontSize);
	} else {
		$('#courseTitle', window.parent.document).css('font-size', courseTitleFontSizeVW);
	}
	
	//NOTE: chapterTitle should be an id, but in older courses it may be a class
	var courseTitleHeight = $('#courseTitle', window.parent.document).outerHeight();
	$('#chapterTitle', window.parent.document).css('top', courseTitleHeight); $('.chapterTitle', window.parent.document).css('top', courseTitleHeight);
	$('#chapterTitle', window.parent.document).css('font-size', chapterTitleFontSizeVW); $('.chapterTitle', window.parent.document).css('font-size', chapterTitleFontSizeVW);
	$('#chapterTitle', window.parent.document).css('line-height', chapterTitleFontSizeVW); $('.chapterTitle', window.parent.document).css('line-height', chapterTitleFontSizeVW);
	var chapterTitleRight = (parseInt(bgImgWidth) + 30) + "px";
	$('#chapterTitle', window.parent.document).css('right', chapterTitleRight); $('.chapterTitle', window.parent.document).css('right', chapterTitleRight);
	if ( (parseInt($('#chapterTitle', window.parent.document).css('font-size')) <= parseInt(chapterTitleFontSize) ) || (parseInt($('.chapterTitle', window.parent.document).css('font-size')) <= parseInt(chapterTitleFontSize)) ) {
		$('#chapterTitle', window.parent.document).css('font-size', chapterTitleFontSize); $('.chapterTitle', window.parent.document).css('font-size', chapterTitleFontSize);
		$('#chapterTitle', window.parent.document).css('line-height', chapterTitleFontSize); $('.chapterTitle', window.parent.document).css('line-height', chapterTitleFontSize);
	} else {
		$('#chapterTitle', window.parent.document).css('font-size', chapterTitleFontSizeVW); $('.chapterTitle', window.parent.document).css('font-size', chapterTitleFontSizeVW);
		$('#chapterTitle', window.parent.document).css('line-height', chapterTitleFontSizeVW); $('.chapterTitle', window.parent.document).css('line-height', chapterTitleFontSizeVW);
	}
	
	//NOTE: pageTitle should be an id, but in older courses it may be a class
	// see page.css line 2 for default page title size
	$('#pageTitle').css('font-size', pageTitleFontSizeVW);$('.pageTitle').css('font-size', pageTitleFontSizeVW);
	$('#pageTitle').css('line-height', pageTitleFontSizeVW);$('.pageTitle').css('line-height', pageTitleFontSizeVW);
	if ( (parseInt($('#pageTitle').css('font-size')) <= parseInt(pageTitleFontSize) ) || (parseInt($('.pageTitle').css('font-size')) <= parseInt(pageTitleFontSize)) ) {
		$('#pageTitle').css('font-size', pageTitleFontSize);$('.pageTitle').css('font-size', pageTitleFontSize);
		$('#pageTitle').css('line-height', pageTitleFontSize);$('.pageTitle').css('line-height', pageTitleFontSize);
	} else {
		$('#pageTitle').css('font-size', pageTitleFontSizeVW);$('.pageTitle').css('font-size', pageTitleFontSizeVW);
		$('#pageTitle').css('line-height', pageTitleFontSizeVW);$('.pageTitle').css('line-height', pageTitleFontSizeVW);
	}
	
	$('#subPageTitle').css('font-size', subPageTitleFontSizeVW);
	var subPageTitleWidth = $(window).width() - 16 - ($(window).width()*0.12);
	$('#subPageTitle').css('width', subPageTitleWidth);
	if ( parseInt($('#subPageTitle').css('font-size')) <= parseInt(subPageTitleFontSize) ) {
		$('#subPageTitle').css('font-size', subPageTitleFontSize);
		$('#subPageTitle').css('line-height', subPageTitleFontSize);
	} else {
		$('#subPageTitle').css('font-size', subPageTitleFontSizeVW);
		$('#subPageTitle').css('line-height', subPageTitleFontSizeVW);
	}
	
	$('body').css('font-size', bodyFontSizeVW);
	if ( parseInt($('body').css('font-size')) <= parseInt(bodyFontSize) ) {
		$('body').css('font-size', bodyFontSize);
	} else {
		$('body').css('font-size', bodyFontSizeVW); // see globals.css line 112 for default body font size
	}
	
// 4th: determine minHeight: larger of logo height and courseTitle height
	var minHeight;
	$('#courseTitle', window.parent.document).css('height', 'auto');
	var topTitleHeight = $('#courseTitle', window.parent.document).outerHeight() + $('#chapterTitle', window.parent.document).outerHeight() + $('.chapterTitle', window.parent.document).outerHeight();
	if ( topTitleHeight < logoImgHeight) {
		minHeight = logoImgHeight;
	} else {
		minHeight = topTitleHeight;
	}
	
// 5th:	if topLogo is less than minHeight, make topLogo and logoBar = minHeight, otherwise make them 5.4vw
	if ( ( parseInt($('#topLogo', window.parent.document).css('height')) <= minHeight ) || ($('#topLogo', window.parent.document).css('height') === undefined) ) {
		$('#topBar', window.parent.document).css('height', minHeight);
		$('#logoBar', window.parent.document).css('height', minHeight);
		$('#logoBar img', window.parent.document).css('height', minHeight);
	} else {
		$('#topBar', window.parent.document).css('height', '5.4vw');
		$('#logoBar', window.parent.document).css('height', '5.4vw');
		$('#logoBar img', window.parent.document).css('height', '5.4vw');
	}
	$('#logoBar', window.parent.document).css('width', 'auto');
	
//6th: absolutely position #framContents below #topBar
	var fcTop = $('#topBar', window.parent.document).css('height');
	$('#frameContents', window.parent.document).css('top', fcTop);
	
//7th: set the height and width of #displayArea, .imgArea, .txtArea, etc.
	var displayHeight, displayWidth, displayTop, textTop;

	if ($('#subPageTitle').is(':visible')) {
		$('#subPageTitle').css('position', 'absolute');
		$('#subPageTitle').css('top', '0');
		
		displayTop = $('#subPageTitle').outerHeight() + 3;
		$('#subDisplayArea').css('top', displayTop);

		displayHeight = $(window).height() - $('#subPageTitle').outerHeight() - 3;
		$('#subDisplayArea').css('height', displayHeight);
		
		textTop = 20;
		$('.imgArea').css('top', 0);

		
	} else {
		
		displayTop = $('#pageTitle').outerHeight() + $('.pageTitle').outerHeight() + $('#topBar').outerHeight();
		displayHeight = $(window).height() - $('#pageTitle').outerHeight() - $('.pageTitle').outerHeight() - $('#topBar').outerHeight();
		displayWidth = $(window).width();

		$('#displayArea').css('width', displayWidth);
		$('#displayArea').css('height', displayHeight);
		
		// for multiple choice:
		$('#answerSection').css('top', displayTop);
		$('#questionText').css('top', displayTop);
		
		// for other KCs:
		textTop = displayTop + $('#pageTitle').outerHeight() + $('.pageTitle').outerHeight();
		$('#instructions').css('top', textTop);

		// for drag and drop columns:
		var contentTop = $('#instructions').outerHeight() + textTop;
		$('#content').css('top', contentTop);
		var contentHeight = (displayHeight - contentTop) * 0.8;
		$('#content').css('height', contentHeight);
		$('#actionsDND').css('top', contentHeight); 
		
		// for assessment:
		$('#contents').css('top', textTop);
		var contentsWidth = (parseInt(displayWidth)-40)+'px';
		$('#contents').css('width', contentsWidth);
		$('#contents').css('height', displayHeight - textTop - 50);
		
		// for menu:
//		var divMenuHeight = (parseInt(displayHeight)-140)+'px';
//		$('#divMenu').css('height', divMenuHeight);
		
		// for menu:
		$('#instructionsM').css('margin-top', textTop);
		var bfs = $('body').css('font-size');
		var divMenuHeight = ( parseInt(displayHeight) - textTop - parseInt(bfs)*3 ) + 'px'; 
		var divMenuTop = (textTop + (parseInt(bfs)*3))+'px';
		$('#divMenu').css('height', divMenuHeight);
		$('#divMenu').css('top', divMenuTop);
		
		

		$('.imgArea').css('top', displayTop);
	}

	// #textButtonsContainer is only used if there are graphical buttons in sequence template; can be left in here regardless of template
	$('#textButtonsContainer').css('height', displayHeight);
	$('#textButtonsContainer').css('top', displayTop);

	$('.imgArea').css('height', displayHeight);
	$('.txtArea').css('height', displayHeight - 50); // don't go behind controlsBkgd
	
	if ($.browser.msie && parseFloat($.browser.version)<9) {
	} else {
	swapFooterItems();
	}
}