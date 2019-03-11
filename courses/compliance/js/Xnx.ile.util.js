// requires jquery, jquery.xml2json

var nx = nx || {};
nx.ile = nx.ile || {};

nx.ile.util = (function() {
    
    var self = {
    
        loadData : function( url, callback, parser ) {
            $.get(url, function(xml){
                var data = parser && parser(xml);
                callback && callback(data || {});
            });
        }
    }

    return self;

})();