
$(document).ready(function(e) {
	//do image fade ins
	$(".fadeIn").each(function(i, img) {
		$(img).css("display", "none");
		//$(img).bind("load", function () { 
			$(this).fadeIn("400"); 
		//});
    });
    
});