var suggestCallBack;

$(document).ready(function() {

    $('#autocomplete').keypress(function(e) {
        if (e.keyCode == 13)
            doSearch(document.getElementById('autocomplete').value);
    });

    $("#autocomplete").autocomplete({
        source: function(request, response) {
            $.getJSON("https://suggestqueries.google.com/complete/search?callback=?", {
                "hl": "en", // Language
                "jsonp": "suggestCallBack", // jsonp callback function name
                "q": request.term, // query term
                "client": "youtube" // force youtube style response, i.e. jsonp
            });
            suggestCallBack = function(data) {
                var len = 0;
                var suggestions = [];
                $.each(data[1], function(key, val) {
                    len++;
                    suggestions.push({
                        "value": val[0]
                    });
                });
                suggestions.length = Math.min(len, 5); // prune suggestions list to only 5 items
                response(suggestions);
            };
        },
        //define select handler
        select: function(event, ui) {
            doSearch(ui.item.value);
        },
    });
});

function doSearch(term) {
    window.location = '//www.google.co.in/search?q=' + term;
}