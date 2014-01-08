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
    var request = require('request');
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            callback($);
        }
    })
}

exports.parse = parse;