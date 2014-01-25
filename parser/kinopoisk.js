var internal = require('./parser.js'),
    utils = require('../utils.js');

function parse($, callback){
    var movie = {
        title: parseName($),
        description: parseDesc($),
        image: parseImage($),
        ratings: parseRatings($),
        genres: parseGenres($)
    };

    callback(movie);
}

function parseRatings($){
    var result = [],
        kpSelector = 'span.rating_ball';
    var doms = $(kpSelector);

    if (doms.length > 0)
    doms.each(function(){
        var self = $(this);
        result.push({
            rating: utils.trim(self.text()),
            provider: 'kinopoisk'
        });
    });

    return result;
}

function parseGenres($){
    var stopGenres = [
        'слова', '...'
    ];

    var selector = 'span[itemprop=genre] a';
    var doms = $(selector);

    var result = [];

    doms.each(function(){
        var self= $(this);
        var genre = self.text();

        var add = true;
        for(var i = 0; i < stopGenres.length; i++)
            if (utils.stringContains(genre, stopGenres[i])) add = false;

        if (add) result.push(genre);
    });

    return result;
}

function parseImage($){
    var selectors = [
        '.popupBigImage img'
    ];

    for(var i = 0; i < selectors.length; i ++){
        var selector = selectors[i];

        var image = internal.parseImage($, selector);
        if (image != null)
        {
            return image;
        }
    }
    return null;
}

function parseDesc($){
    var metaSelector = 'meta[name=mrc__share_description]';
    var dom = $(metaSelector);
    var desc = dom.attr('content');

    return desc;
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
