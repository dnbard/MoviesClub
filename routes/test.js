var articles = require('../models/articles.js');

exports.index = function(req, res){
    var article = articles.add({ text: 'a' });
    article.add({text: 'b'});
    article.add({text: 'c'});

    article.save();

    res.send(article);
}
