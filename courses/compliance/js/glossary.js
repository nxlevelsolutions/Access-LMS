// JavaScript Document
//var glossary = (function(){
	
	var glossaryFile = "glossary.xml",
		glossaryXml,
		letterGroups = new Object(),
		primaryColor1,
		hasNativeAudio,
		audioPlayer,
		glossaryType = parent.nav.settings.glossaryType,
		_input,
		defaultInput;
	
	try {
		hasNativeAudio = (new Audio()) != undefined && (!$.browser.mozilla || $.browser.mozilla && Object.hasOwnProperty.call(window, "ActiveXObject")); //firefox doesn't handle mp3's under its audio control
	}
	catch(e){ 
		hasNativeAudio = false 
	}
	if (!hasNativeAudio){
		Utilities.insertFlashFile("flash/audioPlayer.swf", 1, 1, "audioFlash", null);
	}
	function flashInitialized() {
		// This function is called by flash once the 1st frame has loaded
		parent.nav.writeToLog("audioPlayer: initialized");
		audioPlayer = Utilities.getFlashMovieObject('audioFlash');
		audioPlayer.setVolume(50); //50% volume default
	}
	
	$(document).ready(function(){
		$("#searchTXT").keyup(function(event){
			if(event.which == 13) doSearch();
		});
		
		_input = $('#searchTXT');
		_input.focus(function() {
			if(_input.val() == defaultInput) _input.val("");
		}).blur(function(){
			if(_input.val().length == 0) _input.val(defaultInput);
		});
	});
	
	function render(){
		// Audio prep
		if (hasNativeAudio) {
			audioPlayer = document.getElementById("audioHtml5");
			audioPlayer.autoplay = true;
			audioPlayer.volume = 0.5; // 50% volume default
		}

		if (!window.labelsSet) {
			$("#popTitle").html(parent.nav.settings.glossary_title);
			$("#glossary_selectLtr").html(parent.nav.settings.glossary_selectLtr);
//			$("#button input").val(parent.nav.settings.glossary_search);
//			$("#glossary_instr").html(parent.nav.settings.glossary_instr);
			$("#searchTXT").val(parent.nav.settings.glossary_default);
			defaultInput = $("#searchTXT").val();
			window.labelsSet = true;
		}
		// Load xml file
		if (glossaryXml==undefined){
			$.ajax({url:glossaryFile,
				dataType: 'xml',
				success:function(xmlDoc){
					if(glossaryType == "group") { // Group
						glossaryXml = xmlDoc.documentElement;
						var groups = glossaryXml.childNodes;
						for (var i = 0; i<groups.length; i++) {
							if (groups[i].nodeName=="letter"){
								var letter = groups[i].getAttribute("group").toUpperCase();
								if (groups[i].childNodes.length==0){
									document.getElementById(letter).className = "disabled";
								} else {
									letterGroups[letter] = groups[i];
									document.getElementById(letter).className = "enabled";
								}
							}
						}
					} else { // List
						$(xmlDoc).find("item").each(function (idx, item) {
							item = $(item);
							$("#groupList").append("<div class='term'>" + item.attr("term") + "</div>");
							$("#groupList").append("<div class='definition'>" + item.text() + "</div>");
						});
						// Hide group column
						$("#coll").hide();
						$("#colr").css("left", "0px");
						$(".term").css("color", primaryColor1);
					}
				},
				error: function (xhr, ajaxOptions, thrownError) {
					parent.nav.writeToLog("Glossary: " + glossaryFile + " loading error." + xhr.status + ": " + thrownError, true);
				}
			});
		}
		getColor();
	}
	function getColor() {
		var sampleObj = $('<div class="primaryColor1" style="display:none;" />');
		$(document.body).append(sampleObj);
		primaryColor1 = sampleObj.css('background-color');
		sampleObj.remove();
	}
	function loadLetter(letterLink) {
		if (letterLink.className == "disabled") return;
		var letter = letterLink.id,
			txt = "";
		parent.nav.writeToLog("Glossary: loading letter " + letter);
		// Clear out text boxes
		document.getElementById("groupList").innerHTML = "";
		//document.getElementById("searchTXT").value = "";
		var group = letterGroups[letter.toUpperCase()].childNodes;
		for (var i = 0; i<group.length; i++) {
			if (group[i].nodeName=="item"){
				var term = group[i].getAttribute("term"),
					audio = group[i].getAttribute("audio"),
					def;
				if (group[i].textContent==undefined){
					def = group[i].text;
				} else {
					def = group[i].textContent;
				}			
				if (audio==undefined){
					audio = "";
				} else {
					audio = "<img src=\"interface/audio_icon.gif\" width=\"21\" height=\"21\" class=\"audio_icon\" onclick=\"playAudio('" + audio + "')\" />&nbsp;";
				}
				txt += "<div class='term'>" + audio + term + "</div>"
					+ "<div class='definition'>" + def + "</div>"
			}
		}
		// Set text and div size
		var td = $("#groupList")[0].parentElement;
		var tdHeight = $(td).height();
		$("#groupList").html(txt);
		if($("#groupList").height()>tdHeight){
			$("#groupList").height(tdHeight)
		}
		$(".term").css("color", primaryColor1);
		//$(".definition").css("color", primaryColor1);
	}
	function playAudio(file){
		if (file==undefined || file.length==0){
			if (hasNativeAudio){ // webkit
				audioPlayer.pause(); // Required to stop the audio
				audioPlayer.src = "";
				audioPlayer.load();
			} else { // Flash
				if (audioPlayer != undefined) audioPlayer.audioPause();
			}
		} else {
			if (hasNativeAudio){
				audioPlayer.src = file;
				if (Utilities.isiPad) {
					audioPlayer.load();
				}
			} else {
				audioPlayer.loadFile(file);
			}
		}
	}
	function doSearch() {
		// Clear things out
		var txt = "",
			
			searchString = document.getElementById("searchTXT").value;
		document.getElementById("groupList").innerHTML = "";
		if(document.getElementById("searchTXT") == document.activeElement) {
			_input.val("");
		} else {
			_input.val(parent.nav.settings.glossary_default);
		}
		// Check if need to do search
		if (searchString.length == 0 || searchString == null || searchString == " " || searchString == defaultInput) {
			document.getElementById("groupList").innerHTML = "<div class='term'>" + parent.nav.settings.glossary_enter + "</div>";
			$(".term").css("color", primaryColor1);
			return;
		} else {
			// Make it case-INsensitive, user lower case code in this function
			var searchWord = searchString.toLowerCase(),
				counter = 0;
			for (letter in letterGroups){
				var g = letterGroups[letter].childNodes; // Get group
				for (var i = 0; i<g.length; i++) {
					if (g[i].nodeName=="item"){ // Get each item
						var term = g[i].getAttribute("term"),
							def;
						if (g[i].textContent==undefined){
							def = g[i].text;
						}
						else{
							def = g[i].textContent;
						}
						if (term.toLowerCase().indexOf(searchWord)>-1 || def.toLowerCase().indexOf(searchWord)>-1) {
							txt += "<div class='term'>" + term + "</div>"
								+  "<div class='definition'>" + def + "</div>";
							counter++;
						}
					}
				}
			}
			//txt = "<div class='term'>Searching for \"" + searchWord + "\" (" + counter + " hits)</div></br>" + txt;
			txt = "<div class='term'>" + parent.nav.settings.glossary_searchFor + "<br>\"" + searchWord + "\"</div></br>" + txt;
		}
		if (counter == 0) {
			txt = "<div class='term'>" + parent.nav.settings.glossary_results + "</div>";
		}
		// Set text and div size
		var td = $("#groupList")[0].parentElement;
		var tdHeight = $(td).height();
		$("#groupList").html(txt);
		if($("#groupList").height()>tdHeight){
			$("#groupList").height(tdHeight)
		}
		$(".term").css("color", primaryColor1);
	}
	function closeWin() {
		playAudio(undefined);// Stop audio
		parent.course.hideGlossary();
	}

//})();