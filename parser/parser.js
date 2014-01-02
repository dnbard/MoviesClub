var utils = require('../utils.js')

function parse($, selectors){
    for(var i in selectors){
        var selector = selectors[i];
        var dom = $(selector);

        var result = null;
        if (utils.stringContains(selector, 'meta'))
            result = dom.attr('content');
        else result = dom.text();

        if (result && result.length > 0) return result;
    }
    return '';
}

function parseImage($, selector){
    var dom = $(selector);
    return dom.attr('src');
}

exports.parse = parse;
exports.parseImage = parseImage;