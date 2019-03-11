//----------------------------------------------------------
// This file makes some modifications IF the template 
// is being used inside a subcourse component.
//----------------------------------------------------------
$(document).ready(function () {
    if (window.name.toLowerCase() == "subcontents") {
        $("#pageTitle").attr("id", "subPageTitle");
		$("#displayArea").attr("id", "subDisplayArea");
    }
});