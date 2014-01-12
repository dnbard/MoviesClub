var http = require('http'),
    cheerio = require('cheerio'),
    utils = require('../utils.js'),
    parsers = require('../config.js').parsers,
    url = require('url');

function parse(url, callback, failure){
    loadHtml(url, function($){
        var isParserActivated = false;

        for(var key in parsers){
            var e = parsers[key];
            if (utils.stringContains(url, e.site)){
                var parserPath = utils.format('./{0}.js', e.parser)
                var parser = require(parserPath);
                parser.parse($, callback);

                isParserActivated = true;
            } 
        }
        if (!isParserActivated) failure();
    });
}

function loadHtml(url, callback){
    var options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
        }
    };

    var request = require('request');
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            callback($);
        }
    }).end();
}

exports.parse = parse;