function parse($, callback){
    var title = parseName($);
}

function parseName($){
    var selectors = [
        '.moviename-big',
        'span[itemprop=alternativeHeadline]'
    ];

    for(var i in selectors){
        var selector = selectors[i];

        var title = $(selector).html();
        if (title && title.length > 0) return title;
    }
    return '';
}


exports.parse = parse;
