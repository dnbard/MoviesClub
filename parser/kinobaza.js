var internal = require('./parser.js'),
    utils = require('../utils.js');

function parse($, callback){
    var movie = {
        title: parseName($),
        description: parseDesc($),
        image: parseImage($),
        ratings: parseRatings($),
        genres: parseGenres($)
    }

    callback(movie);
}

function parseGenres($){
    var selector = '.filter_genres_set_link';
    var doms = $(selector);

    var result = [];
    doms.each(function(){
        var self= $(this);
        result.push(self.text());
    });

    return result;
}

function parseRatings($){
    var selector = '.rating-link';
    var doms = $(selector);

    var result = [];
    doms.each(function(){
        var self = $(this);
        var ratingProvider = internal.getRatingProvider(self.attr('href'));
        if (ratingProvider)
            result.push({
                rating: utils.trim(self.find('strong').text()),
                provider: ratingProvider
            });
    });

    return result;
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
