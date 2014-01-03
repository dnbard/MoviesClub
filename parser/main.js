var http = require('http'),
    cheerio = require('cheerio'),
    utils = require('../utils.js'),
    parsers = require('../config.js').parsers;

function parse(url, callback){
    loadHtml(url, function($){
        for(var key in parsers){
            var e = parsers[key];
            if (utils.stringContains(url, key)){
                var parserPath = utils.format('./{0}.js', e)
                var parser = require(parserPath);
                parser.parse($, callback);
            }
        }
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
