var language = function () {

    var cookieName = "LANG";

    return {
        set: function(value) {
            cookie.write(cookieName, value, null)
            document.location.href = document.location.href;
        },
        get: function () {
            return cookie.read(cookieName);
        }
    }

}();

$(document).ready(function () {
    var ctrl = document.getElementById("MenuLangSelector"),
        userLang = language.get();
    if (ctrl != null) ctrl.value = (userLang == "" ? "en-US" : userLang);
});