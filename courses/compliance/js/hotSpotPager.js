var pageLoaded = false,
	hotSpotPager  = (function(){

    var _data,
        _pageIdx = 0,
		_hotSpotClicked,
		_text;
        
    function loadData( url, callback, parser ) {
        $.get(url, function(xml){
            var data = parser(xml);
            callback(data);
        });
    }
        
    function xmlParser( data ) {

        data = $(data);
        
        var obj = [],
        	pages = data.find('page'),
			bookm = parent.nav.getPage().bookmark,
			pB = new Array(); //page bookmarks
			
		_text = data.find('text').text();
		 
		if (bookm.length>0){
			pB = bookm.split(":");
		}

        pages.each(function(i, val) {
			var p = $(this),
				hsB = new Array(),
			 	page = {
					image : p.attr('image'),
					hotspots : []
				},
				hotspots = p.find('hotspot');
			
			if (pB.length>i) hsB = pB[i].split('');
			
			for (var c=0; c<hotspots.length; c++){
				var hs = $(hotspots[c]),
					isChecked = 0;
				if (hsB.length>c) isChecked = hsB[c];
				page.hotspots.push({
					functionCall: $.trim(hs.text()),
					rectangle : {x:hs.attr('x'), y:hs.attr('y'), width:hs.attr('width'), height:hs.attr('height')},
					checked : isChecked
				});
			}	
				
			obj.push(page);
		});

        return obj;
    }

	function build() {
			
		$('#backButton').click(function(){viewPage(-1)});
		$('#nextButton').click(function(){viewPage(1)});
		$("#pageY").html(_data.length);
		$("#txtMain").html(_text);
		viewPage(0);
	}
	
	function viewPage(idx){
		//check max/min pages
		_pageIdx += idx;
		if(_pageIdx==-1){
			_pageIdx = 0;
			return;
		}
		if(_pageIdx==_data.length){
			_pageIdx = _data.length-1;
			return;
		}		
		//remove all old hotspots
		$(".hotSpot").remove();
		//add new hotspots
		var pageData = _data[_pageIdx];
		for (var i=0; i<pageData.hotspots.length; i++) {
			var hsData = pageData.hotspots[i];
			//create new box
			var hs = document.getElementById("hotSpotTemplate").cloneNode(true); //make duplicate in memory
			hs.className = "hotSpot";
			hs.id = "hs"+i;
			document.body.appendChild(hs);	
			//set checkmark
			var chk_mc = hs.getElementsByTagName("img")[0],
			    background = hs.getElementsByTagName("div")[0];
			chk_mc.id = "cm" + i;
			background.className = "hotSpotBackground";
			chk_mc.style.display = (hsData.checked=="1"?"block":"none"); 
			if (chk_mc.style.display=="none") allDone = false;
			hs.data = hsData;
			$(hs).click(onHotSpotClick);
			$(hs).mouseover(onHotSpotMouseOver);
			$(hs).mouseout(onHotSpotMouseOut);
		}
		//load graphic
		var img = document.getElementById("graphic");
		if (img.onload == null) {
		    $(img).hide();
		    img.onload = function () {
		        $(this).fadeIn("fast", function () {
		            resizeMainImage();
		        });
		    }
		}
		img.src = pageData.image;
		
		//update page indicator
		$("#pageX").html(_pageIdx+1);
		//update buttons
		if (_pageIdx==0){
			$("#backButton").attr('src', 'interface/back_hs_disabled.gif');
			$("#backButton").removeClass("navButton");			
		}
		else{
			$("#backButton").attr('src', 'interface/back_hs.gif');
			$("#backButton").addClass("navButton");
		}
		if (_pageIdx==_data.length-1){
			$("#nextButton").attr('src', 'interface/next_hs_disabled.gif');
			$("#nextButton").removeClass("navButton");			
		}
		else{
			$("#nextButton").attr('src', 'interface/next_hs.gif');
			$("#nextButton").addClass("navButton");
		}
		
		
	}
	function onHotSpotMouseOver(){
		var background = this.getElementsByTagName("div")[0];
		$(background).fadeTo("fast", .3);
	}
	function onHotSpotMouseOut(){
		var background = this.getElementsByTagName("div")[0];
		$(background).fadeTo("fast", 0);
	}
	function onHotSpotClick() {
		parent.nav.writeToLog("hotSpotPager: parsing function \"" + this.data.functionCall + "\"");
		_hotSpotClicked = this;
		var funcName = this.data.functionCall,
			s = funcName.indexOf("("),
			e = funcName.lastIndexOf(")"),
			method = funcName.substr(0, s),
			parameters = funcName.substr(s+1, e-s-1),
			paramArray = parameters.split(","); 

		for (var i=0; i<paramArray.length; i++){
			var param=paramArray[i];
			if (param.substring(0, 1)=="'" || param.substring(0, 1)=='"'){
				param = param.substring(1, param.length);
			}
			if (param.substring(param.length-1, param.length)=="'" || param.substring(param.length-1, param.length)=='"'){
				param = param.substring(0, param.length-1);
			}
			paramArray[i] = param;
		}
	 
		if (typeof(window[method])=="function"){
			window[method].apply(window, paramArray);
		}
		else{
			if (typeof(parent[method])=="function") {
				parent[method].apply(parent, paramArray);
			} 
			else{
				parent.nav.writeToLog("hotSpotPager: Function \"parent." + method + "\" was not found.");
			}
		}
		
	};	

    return {
        init : function( url ) {
            try {
                loadData(url, function( data ) {
                        _data = data;
                        build();
                    },
                    xmlParser
                );
            }
            catch(error) {
                parent.nav.writeToLog('hotSpotPager error =>' + error);
            }
        },
		setCheckMark : function(){
			//show checkmark
			if (_hotSpotClicked==undefined) return;
			var chk_mc = _hotSpotClicked.getElementsByTagName("img")[0],
				newBookmark = "",
				allViewed = true;
			chk_mc.style.display = "block";
			_hotSpotClicked.data.checked = "1"; //
			_hotSpotClicked=undefined;
			
			//get new bookmark
			for (var i=0; i<_data.length; i++){
				var hsList = Utilities.getObjects(_data[i], 'checked');
				for (var h=0; h<hsList.length; h++){
					newBookmark += hsList[h].checked;
					if (hsList[h].checked=='0') allViewed = false;
				}
				newBookmark += ":"
			}
			newBookmark = newBookmark.substring(0, newBookmark.length -1);
			 
			//save new bookmark
			parent.nav.getPage().bookmark = newBookmark;
			if (allViewed) parent.nav.eventCompleted("content");
			parent.nav.saveBookmark(true);
		}
    };

})();

parent.HotSpotsFrame = this;

function onAllowToNavigate(nav){ 
	//required as per framework
}
function setPageViewed(){ 
	parent.HotSpotsFrame = undefined; //reset after we leave
}
function onUpdateUI(nav){ //required as per framework
	
	document.location.href = parent.nav.getPage().url;
}
function showCheck(){
	hotSpotPager.setCheckMark();
}
function onPageLoaded(){
	pageLoaded = true;
	if (parent.nav == undefined) return;
	$("#labelOf").html(parent.nav.settings.labelOf);

}
function render() {
    if (parent.nav != undefined) {
        var dataURL = parent.nav.getPage().data;
        if (!dataURL) {
            var pageId = parent.nav.getPage().id;
            parent.nav.writeToLog('hotSpotPager error: getPage().data for page ' + pageId + ' returned undefined.')
        }
        else {
            parent.nav.writeToLog("hotSpotPager: loading data file: " + dataURL);
            hotSpotPager.init(dataURL);
            $.fn.tooltip.callback = hotSpotPager.setCheckMark;
        }
    }
}

function resizeMainImage() {
    var img = $("img[id=graphic]"),
        parent = img.parent(),
        divHeight = parent.height(),
        divWidth = parent.width();
    img.each(function (i, imgEl) {
        var imgSyle = imgEl.style,
            imgWidth = $(imgEl).width(),
            imgHeight = $(imgEl).height(),
            controlsHeight = $("#controls").height();
        if (divHeight <= (imgHeight + controlsHeight)) {
            if (divWidth < imgWidth) {
                imgSyle.height = "auto";
                imgSyle.width = "100%";
            }
            else {
                imgSyle.height = (divHeight - controlsHeight) + "px";// "80%";
                imgSyle.width = "auto";
            }
        }
        else {
            //img height fits as 1:1 ratio
            //check if setting img width to 100% makes it taller than div
            var nH = divWidth * imgWidth / imgHeight;
            if (divHeight > (nH + controlsHeight)) { //div is taller than resized width
                imgSyle.height = "auto";
                imgSyle.width = "100%";
            }
            else {
                imgSyle.height = (divHeight - controlsHeight) + "px";;
                imgSyle.width = "auto";
            }
        }

    });
}

$(window).resize(function () {
    //$(document).find("[id^=cm]").remove();
    resizeMainImage();
});

$(document).ready(function () {
    render();
    //alert($(document).width() + "x" + $(document).height());
});
