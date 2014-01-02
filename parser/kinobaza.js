var internal = require('./parser.js');

function parse($, callback){
    var movie = {
        title: parseName($),
        description: parseDesc($),
        image: parseImage($)
    }

    callback(movie);
}

function parseName($){
    var selectors = [
        'meta[property="og:title"]',
        'h1',
        'span.english'
    ];

    var title = internal.parse($, selectors);
    title = title.replace(' на Кинобазе.tv', '');
    title = title.replace('«', '');
    title = title.replace('»', '');

    return title;
}

function parseDesc($){
    var selector = '.description p';
    var dom = $(selector);

    var desc = '';
    dom.each(function(v, obj){
        desc += $(this).text();
    });
    return desc;
}

function parseImage($){
    var selector = '.cover-container img';
    var image = internal.parseImage($, selector);
    return image;
}

exports.parse = parse;
